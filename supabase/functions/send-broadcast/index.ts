import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BOT_TOKEN = "8659761366:AAH333sffDInLISOMdWO7IlND5p_Wwn_fYE";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendTelegramMessage(chatId: number, text: string, mediaType?: string, mediaUrl?: string, caption?: string) {
  try {
    if (mediaType && mediaType !== 'none' && mediaUrl) {
      const methodMap: Record<string, string> = {
        photo: 'sendPhoto',
        video: 'sendVideo',
        document: 'sendDocument',
        audio: 'sendAudio',
      };
      const method = methodMap[mediaType] || 'sendMessage';
      const fieldMap: Record<string, string> = {
        photo: 'photo', video: 'video', document: 'document', audio: 'audio',
      };
      const field = fieldMap[mediaType];
      const body: Record<string, unknown> = {
        chat_id: chatId,
        [field]: mediaUrl,
        caption: caption || text,
        parse_mode: 'HTML',
      };
      const res = await fetch(`${TELEGRAM_API}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return res.ok;
    } else {
      const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
      });
      return res.ok;
    }
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { broadcast_id } = await req.json();

    const { data: broadcast } = await supabase
      .from("broadcasts")
      .select("*")
      .eq("id", broadcast_id)
      .maybeSingle();

    if (!broadcast) {
      return new Response(JSON.stringify({ error: "Broadcast topilmadi" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("broadcasts").update({ status: "sending" }).eq("id", broadcast_id);

    const { data: users } = await supabase
      .from("telegram_users")
      .select("telegram_id")
      .eq("is_banned", false)
      .eq("is_deleted", false);

    if (!users || users.length === 0) {
      await supabase.from("broadcasts").update({
        status: "completed",
        sent_count: 0,
        total_users: 0,
        completed_at: new Date().toISOString(),
      }).eq("id", broadcast_id);

      return new Response(JSON.stringify({ success: true, sent: 0, failed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("broadcasts").update({ total_users: users.length }).eq("id", broadcast_id);

    let sent = 0;
    let failed = 0;

    for (const user of users) {
      const success = await sendTelegramMessage(
        user.telegram_id,
        broadcast.message,
        broadcast.media_type,
        broadcast.media_url,
        broadcast.caption
      );
      if (success) sent++; else failed++;

      if ((sent + failed) % 10 === 0) {
        await supabase.from("broadcasts").update({ sent_count: sent, failed_count: failed }).eq("id", broadcast_id);
      }

      await new Promise(r => setTimeout(r, 35));
    }

    await supabase.from("broadcasts").update({
      status: "completed",
      sent_count: sent,
      failed_count: failed,
      completed_at: new Date().toISOString(),
    }).eq("id", broadcast_id);

    return new Response(JSON.stringify({ success: true, sent, failed, total: users.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server xatosi: " + (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

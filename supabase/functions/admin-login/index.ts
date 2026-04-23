import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { login_id, password } = await req.json();

    if (!login_id || !password) {
      return new Response(JSON.stringify({ error: "Login va parol kiritilishi shart" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("login_id", login_id)
      .eq("is_active", true)
      .maybeSingle();

    if (adminError || !admin) {
      return new Response(JSON.stringify({ error: "Noto'g'ri login yoki parol" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (admin.password_hash !== password) {
      return new Response(JSON.stringify({ error: "Noto'g'ri login yoki parol" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const email = `admin_${login_id}@botadmin.local`;
    let authUser = null;

    const { data: existing } = await supabase.auth.admin.listUsers();
    const existingUser = existing?.users?.find(u => u.email === email);

    if (!existingUser) {
      const { data: newUser } = await supabase.auth.admin.createUser({
        email,
        password: admin.password_hash,
        email_confirm: true,
      });
      authUser = newUser.user;
      if (authUser) {
        await supabase.from("admins").update({ auth_user_id: authUser.id }).eq("id", admin.id);
      }
    }

    const { data: session } = await supabase.auth.signInWithPassword({
      email,
      password: admin.password_hash,
    });

    if (!session?.session) {
      return new Response(JSON.stringify({ error: "Autentifikatsiya xatosi" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("admins").update({ last_login: new Date().toISOString() }).eq("id", admin.id);

    return new Response(JSON.stringify({
      success: true,
      session: session.session,
      admin: { id: admin.id, name: admin.name, login_id: admin.login_id, telegram_username: admin.telegram_username },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server xatosi: " + (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

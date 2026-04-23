export interface Admin { id: string; login_id: string; name: string; telegram_username: string; is_active: boolean; created_at: string; last_login: string | null; }
export interface TelegramUser { id: string; telegram_id: number; username: string; first_name: string; last_name: string; language_code: string; is_banned: boolean; is_deleted: boolean; ban_reason: string; joined_at: string; last_active: string; total_commands: number; }
export interface Broadcast { id: string; message: string; media_type: string; media_url: string; caption: string; status: 'pending' | 'sending' | 'completed' | 'failed'; total_users: number; sent_count: number; failed_count: number; created_by: string | null; created_at: string; completed_at: string | null; }
export interface RequiredChannel { id: string; channel_id: string; channel_name: string; channel_link: string; is_active: boolean; created_at: string; }
export interface CoursePrice { id: string; course_name: string; description: string; price: number; currency: string; duration_days: number; is_active: boolean; created_at: string; updated_at: string; }
export interface BotCommand { id: string; command: string; description_uz: string; description_ru: string; description_en: string; response_uz: string; response_ru: string; response_en: string; is_active: boolean; usage_count: number; created_at: string; }
export interface BotSetting { id: string; key: string; value: string; description: string; updated_at: string; }
export interface StatsDaily { id: string; date: string; new_users: number; active_users: number; commands_used: number; messages_sent: number; payments_count: number; payments_total: number; }
export type Language = 'uz' | 'ru' | 'en';

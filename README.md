# IT Frontend Bot - Admin Panel

Telegram bot uchun React + TypeScript admin paneli. Supabase database, Edge Functions va Tailwind CSS orqali ishlab chiqilgan.

## Ishni boshlash

### O'rnatish

```bash
npm install
npm run dev
```

### Login ma'lumotlari

- **Login ID:** `12345679`
- **Parol:** `jamshid2009`

Birinchi kirishda tizim avtomatik ravishda admin akkauntni yaratadi.

## Funksiyalar

### Dashboard
- Foydalanuvchilar soni, bugun faol, bloklangan
- Kunlik statistika grafiklari
- Xabarlar va buyruqlar statistikasi

### Users (Foydalanuvchilar)
- Barcha foydalanuvchilarni ko'rish (paginatsiya bilan)
- Qidiruv (Telegram ID yoki username orqali)
- Foydalanuvchini bloklash/blokdan chiqarish
- O'chirish (soft delete)
- Batafsil ma'lumotlarni ko'rish

### Broadcast (Ommaviy xabar)
- Matnli xabar yuborish
- Media qo'shish (rasm, video, hujjat, audio)
- Yuborish tarixi
- Holat kuzatuv

### Statistics (Statistika)
- Kunlik/oylik foydalanuvchi grafiklari
- Buyruqlar statistikasi
- O'sish tendentsiyalari
- 7/14/30 kunlik filtrlar

### Channels (Kanallar)
- Majburiy kanallarni boshqarish
- Kanal link va nomi saqlash

### Prices (Narxlar)
- Kurs narxlarini boshqarish
- Valyutalar: UZS, USD, RUB

### Commands (Buyruqlar)
- Bot buyruqlarini 3 tilda (UZ/RU/EN) boshqarish
- Tavsiflari va javoblarini tahrirlash

### Settings (Sozlamalar)
- Bot ma'lumotlari
- Adminlar ro'yxatini boshqarish
- Asosiy sozlamalar

## Tillar

- O'zbekcha (uz)
- Ruscha (ru)  
- Inglizcha (en)

Til sahifa burchagidagi tugmalardan o'zgartiriladi.

## Texnologiyalar

- **Frontend:** React 18, TypeScript, Vite
- **UI:** Tailwind CSS, Lucide React
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **Charting:** Recharts
- **Routing:** React Router v6

## API Endpoints

- `POST /functions/v1/admin-login` - Admin login
- `POST /functions/v1/send-broadcast` - Xabar yuborish

## Database Tables

- `admins` - Admin users
- `telegram_users` - Telegram bot users
- `broadcasts` - Xabar records
- `required_channels` - Majburiy kanallar
- `course_prices` - Kurs narxlari
- `bot_commands` - Bot buyruqlari
- `bot_settings` - Bot sozlamalari
- `stats_daily` - Kunlik statistika
- `payments` - To'lov recordlari

Barcha jadvallar Row Level Security (RLS) bilan himoyalangan.

## Environment Variables

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Build

```bash
npm run build
npm run preview
```

## Linting

```bash
npm run lint
npm run typecheck
```

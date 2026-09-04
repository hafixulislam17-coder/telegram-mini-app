# Telegram Mini App — Task & Reward MVP

Vercel-ready Telegram Mini App starter with:
- Telegram user login/identity via `initData`
- Timed tasks with a mandatory 10-second ad gate
- Referral system + configurable commission
- Video-ad reward placeholder
- Spin reward
- Withdrawals: bKash, Nagad, USDT
- BDT currency
- Admin panel
- Adsterra / Social Bar / Popunder code slots
- Admin demo credentials: `demo` / `123456` (change before production)

## Stack
Next.js + TypeScript + Supabase + Vercel.

## Important
Third-party ad networks may have their own rules about incentivized traffic. Only use ad formats and reward flows that are permitted by the specific ad network/account.

## Setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `ADMIN_USERNAME=demo`
   - `ADMIN_PASSWORD=123456`
4. `npm install`
5. `npm run dev`
6. Deploy to Vercel and set the same environment variables.

## Telegram
Create a bot with BotFather and configure its Mini App/menu button to your Vercel URL.

## Ad code
Admin settings contain three slots:
- Adsterra
- Social Bar
- Popunder

Paste only the code supplied by your ad provider. The task gate requires the 10-second timer and an ad slot to be present before the task can be claimed. Because third-party scripts run in the browser, the app cannot reliably inspect whether an external ad window was closed; do not represent this as a guaranteed ad-view verification unless your ad provider gives you a supported callback/verification API.

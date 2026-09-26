# Md Mojahid portfolio

The public portfolio is at `/`; the private management dashboard is at `/admin`. The portfolio keeps the original page design and effects. In the dashboard, use forms to manage project details and banner uploads, skills and progress, profile/contact information, process steps, stats, and the scrolling tech marquee. Changes stay in the form draft until **Publish changes** is selected.

## Local development

1. Install Node.js 20.9 or newer and run `npm.cmd install` in PowerShell (or `npm install` in Command Prompt).
2. Copy `.env.example` to `.env.local` if you do not already have one. Otherwise, add `ADMIN_PASSWORD` and `ADMIN_SECRET` to your existing `.env.local` without replacing its other settings.
3. Run `npm.cmd run dev` in PowerShell (or `npm run dev` in Command Prompt) and open `http://localhost:3000`.

Without `DATABASE_URL`, local development reads and writes `data/content.json`. Banner uploads require a connected Vercel Blob store and `BLOB_READ_WRITE_TOKEN`; connect the store to your Vercel project to have Vercel provide that token.

## Vercel deployment

1. Import the project into Vercel.
2. From the Vercel project **Storage** page, create and connect a **Blob** store. Public Blob URLs are used for project banners.
3. Add a Postgres database integration from the Vercel Marketplace (Neon is one option), then configure its `DATABASE_URL` connection string in the Vercel project environment variables.
4. Set `ADMIN_PASSWORD` and a long random `ADMIN_SECRET` in Vercel environment variables. Keep these values private.
5. Deploy. On first content load, the app creates its small `portfolio_content` table and seeds it from `data/content.json`; later dashboard publishes are stored in Postgres.

Banner uploads accept JPG, PNG, WebP, AVIF, or GIF files up to 4 MB. Each upload receives a unique Blob URL. If you remove a project, its old banner file remains in Blob storage; remove unused images from the Blob dashboard when you want to reclaim space.

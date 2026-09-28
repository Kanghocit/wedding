# Thiệp cưới Mai Lan Trắng (self-hosted)

Digital wedding invitation inspired by the Mai Lan Trắng template. All copy, photos, bank info, and timeline are configured via environment variables.

## Setup

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Guest link: `/?guest=Tên%20khách`.

Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — password from `ADMIN_PASSWORD` in `.env`.

RSVP and guestbook entries are stored in `DATA_DIR` (default `./data`).

## Production

Uses existing `ecosystem.config.cjs` and `scripts/deploy-production.sh`. Ensure `.env` exists on the server before `pnpm build`.

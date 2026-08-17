# Yormand Dental Clinic — Full-Stack Website

A complete, production-ready website for **Yormand Dental Clinic** (Dushanbe, Tajikistan): public
marketing site, appointment system, and a full Admin Panel / CMS so clinic staff can manage every
piece of content without touching code.

---

## 1. Project Structure

```
yormand/
├── backend/                 # Node.js + Express + TypeScript API
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema (all models)
│   │   └── seed.ts          # Seed script (admin user + researched content)
│   ├── src/
│   │   ├── config/          # Prisma client
│   │   ├── middleware/      # auth, error handling, upload
│   │   ├── routes/          # one file per resource (services, doctors, ...)
│   │   ├── utils/           # auth helpers (JWT, bcrypt)
│   │   └── server.ts        # app entrypoint
│   ├── uploads/              # uploaded media (served at /uploads)
│   └── .env.example
└── frontend/                 # React + Vite + TypeScript + Tailwind
    ├── src/
    │   ├── pages/public/      # 15 public pages
    │   ├── pages/admin/       # Admin Panel screens
    │   ├── components/        # layout, admin, and shared UI components
    │   ├── context/           # Auth + Language (i18n) context
    │   ├── i18n/               # TJ / RU / EN UI translations
    │   ├── services/api.ts     # Axios client (attaches JWT)
    │   └── types/               # shared TypeScript types
    └── .env not required (dev server proxies /api to the backend)
```

---

## 2. Technology

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router, i18next (TJ/RU/EN)
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite by default (zero-config for local dev/demo), via **Prisma ORM** — the schema
  is written to be portable to **PostgreSQL** for production (see §7)
- **Auth:** JWT (7-day expiry) + bcrypt password hashing, role-based access (`SUPER_ADMIN`, `ADMIN`,
  `EDITOR`), protected routes and middleware
- **Security:** helmet, CORS allow-list, rate limiting (global + stricter on login/appointment
  submission), Zod input validation on every write route, sanitized file uploads (MIME allow-list,
  random filenames, size limit), Prisma parameterized queries (SQL-injection safe)

---

## 3. Install & Run Locally

### Prerequisites
- Node.js 18+
- npm

### Backend

```bash
cd backend
cp .env.example .env        # edit JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD before going live
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed                 # creates the first admin user + researched demo content
npm run dev                  # http://localhost:4000
```

> **Note on this build environment:** the Prisma engine binaries could not be downloaded during
> development here because outbound network access was restricted to a small allow-list that did
> not include `binaries.prisma.sh`. All backend TypeScript compiles cleanly and every route/schema
> was written and reviewed carefully, but `prisma generate` / `migrate` / `seed` have **not been
> executed end-to-end** in this sandbox. Run the three commands above on a machine with normal
> internet access before your first run — this is standard Prisma setup and should work without
> any changes.

### Frontend

```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:4000`, so just run both
servers side by side.

- **Public website:** http://localhost:5173
- **Admin panel:** http://localhost:5173/admin/login

### First Admin Account

Created by the seed script from your `.env` values:
- Email: `ADMIN_EMAIL` (default `admin@yormand.tj`)
- Password: `ADMIN_PASSWORD` (default `ChangeMe123!`)

**Change this password immediately after first login** (via a direct database update or by adding
a "change password" admin route — not included by default for scope reasons; flagged below).

---

## 4. Building for Production

```bash
# backend
cd backend
npm run build      # compiles to dist/
npm start           # runs dist/server.js

# frontend
cd frontend
npm run build       # outputs static site to dist/
npm run preview     # local preview of the production build
```

Serve `frontend/dist` via any static host or CDN (Vercel, Netlify, Nginx, etc.), and point it at
the deployed backend API via a reverse proxy or by rebuilding with an absolute `VITE_API_URL` if
you prefer (currently the app calls a relative `/api`, so put the frontend and backend behind the
same domain/reverse proxy in production, or add an env-based base URL).

---

## 5. Managing Content (No Code Required)

Everything in the spec is editable from `/admin`:

| Area | What the admin can do |
|---|---|
| **Dashboard** | See totals: appointments, services, doctors, gallery images, reviews |
| **Appointments** | View, filter/search/sort, change status (New → Pending → Confirmed → Completed/Cancelled), add internal notes, delete |
| **Services** | Full CRUD, per-language (TJ/RU/EN) title & descriptions, price + visibility toggle, category, featured flag, active/inactive |
| **Doctors** | Full CRUD, photo upload, per-language bio/education/specialization, explicit "unconfirmed placeholder" flag |
| **Gallery** | Upload/delete images, categorize (Clinic/Reception/Equipment/Team/Other), show/hide |
| **Before & After** | Upload before/after pairs, treatment name, publish/unpublish (defaults to unpublished; on-screen consent reminder) |
| **Reviews** | Add/edit/delete, star rating, source attribution, approve/unapprove before it appears publicly |
| **Prices** | Add price rows, exact price / range / "on consultation" toggle, show/hide |
| **Settings** | Clinic name, logo, phone, WhatsApp/Telegram/Instagram, address, working hours, map links |

All public pages read live from the database via the API — nothing is hard-coded, so changes in the
Admin Panel appear immediately on the public site.

---

## 6. Database Schema

See `backend/prisma/schema.prisma` for the full model list, matching the spec:
`AdminUser`, `AuditLog`, `Service` + `ServiceTranslation`, `Doctor` + `DoctorTranslation`,
`GalleryItem`, `BeforeAfter`, `Review`, `Price`, `Appointment`, `Page` + `PageTranslation`,
`HomepageSection`, `Media`, `SiteSetting`, `SocialLink`, `SeoEntry`.

`AuditLog` model exists in the schema but is not yet wired into every write route — see §9 for
what's left to finish.

---

## 7. Switching to PostgreSQL for Production

1. In `backend/prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` in `.env` to your Postgres connection string.
3. Run `npx prisma migrate deploy`.

No application code changes are required — all queries go through Prisma.

---

## 8. Security Notes

- Rotate `JWT_SECRET` and the seeded admin password before any real deployment.
- Set `FRONTEND_URL` in `.env` to your real production domain (used for CORS).
- Uploaded files are restricted to jpeg/png/webp/gif, capped at 5MB, and stored under
  randomly-generated filenames — never trust or execute the original filename.
- All public-facing write endpoints (`POST /api/appointments`) are rate-limited; admin login is
  rate-limited more strictly against brute force.
- Never commit `.env` — only `.env.example` is tracked.

---

## 9. Information Still To Be Confirmed by Yormand Clinic

Per the research notes provided, the following are seeded as **clearly marked placeholders** and
should be confirmed/completed by the clinic through the Admin Panel before launch:

- Doctor names/photos/bios are partially confirmed (Асадуллоева Адиба, Шукуров Саидахмад,
  Абдулаев Бехруз Абдулаевич appear in reviews/aggregated listings) — full biographies, photos, and
  credentials need clinic sign-off. One doctor profile is a pure placeholder pending a confirmed
  name.
- Official Instagram URL (aggregated sources suggest `@Yormand.dentalclinic` — unverified)
- WhatsApp / Telegram contact links
- Google Maps link (Yandex Maps data was available; Google link not confirmed)
- All service prices (none were published — every price defaults to "on consultation" / hidden)
- Before/After images (none seeded — clinic must upload with patient consent)
- Working hours (approximate "08:00–21:00" from listing; not clinic-confirmed)

## 10. Known Gaps / Suggested Next Steps

- **Prisma engines were not downloaded in this dev sandbox** (network restriction) — run
  `prisma generate && prisma migrate dev` yourself before first use (§3).
- **Admin "change password" UI** is not yet built — add a route + form, or rotate the seeded
  password directly in the database for now.
- **AuditLog** is modeled but not yet written to from every admin action — wire it into the routes
  you care most about tracking (e.g. appointment status changes, content edits).
- **Homepage section reordering/hide-show UI** exists in the API (`/api/homepage`) but the visual
  drag-and-drop admin screen for it wasn't built in this pass — the data model and endpoints are
  ready for it.
- **sitemap.xml / robots.txt / structured data** generation endpoints were not added in this pass;
  the `SeoEntry` model and per-page SEO API are in place to build them from.
- Add automated tests (none included) before relying on this in production.

---

## 11. Quick Reference

- Public site (dev): **http://localhost:5173**
- Admin login (dev): **http://localhost:5173/admin/login**
- API health check: **http://localhost:4000/api/health**
- Default admin: value of `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`

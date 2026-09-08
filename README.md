# Puttalam Boarding Finder

A boarding-house marketplace for students in Puttalam. Students search rooms by
area, budget and who the boarding takes; owners list rooms and answer requests;
an admin approves listings before they go live.

Built from `idea.md`. Scope is deliberately narrow — no payments, no chat, no
maps, no reviews, no notifications.

## Run it

```bash
npm install
cp .env.example .env.local   # then paste your Supabase URL and anon key
npm run dev
```

Open http://localhost:3000.

The data lives in Supabase. If you have not set the project up yet, follow
**`supabase/README.md`** first — it is five steps: run `schema.sql`, turn off
email confirmation, create eight demo accounts, run `seed.sql`, paste two keys.

## Demo accounts

All three use the password **`demo1234`**, and the sign-in page has a one-tap
button for each so nobody types a password on stage.

| Sign in as | Email | Sees |
|---|---|---|
| Student | `student@demo.lk` | Requests sent, with the owner's answer |
| Owner | `vendor@demo.lk` | Four listings, two requests waiting |
| Admin | `admin@demo.lk` | Three listings in the approval queue, platform stats |

## The four-minute demo path

1. **Home** — say the problem in one line: students take a bus to Puttalam and
   walk street to street asking about boarding, with no idea of price or whether
   anything is free.
2. **Search** — pick Kalladi, up to Rs 7,000. Point out the URL:
   `/boardings?area=Kalladi&max=7000`. The filters are server-rendered and
   shareable.
3. **Listing** — open *Women's boarding at Kalladi Junction*. The row of squares
   next to the price is the room tally: one filled square per room still free.
   Send a request with a move-in date.
4. **Owner tab** — sign in as `vendor@demo.lk`, the request is waiting with the
   student's name, dates and phone number. Confirm it.
5. **Back to the listing** — the tally has dropped by one on its own. That is the
   part vendors care about: the count stays honest without anyone maintaining it.
6. **Admin tab** — sign in as `admin@demo.lk`: three listings waiting for review,
   coverage by area, and the platform counts. Approve one.
7. **Close** — how owners get onboarded in Puttalam, not the tech.

Have all three signed in on separate browser profiles beforehand.

## How it is put together

| | |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4, hand-rolled components in `src/components/ui.tsx` |
| Database | Supabase Postgres, with row level security on every table |
| Auth | Supabase Auth (email + password), cookie session refreshed in `proxy.ts` |
| Deploy | Vercel |

### Routes

| Route | Purpose |
|---|---|
| `/` | Hero, search, live counts, rooms with space left |
| `/boardings` | Results grid with a filter sidebar, sortable |
| `/boardings/[id]` | Photos, details, owner contact, request form |
| `/login`, `/register` | Auth; the role is picked at registration |
| `/dashboard/student` | Requests sent and their status |
| `/dashboard/vendor` | Incoming requests, then listings (add / edit / delete) |
| `/dashboard/admin` | Approval queue, coverage by area, platform counts |

`src/proxy.ts` refreshes the Supabase session on every request — Server
Components cannot write the rotated cookie themselves — and bounces signed-out
visitors away from `/dashboard`. `src/app/dashboard/layout.tsx` checks the role,
and row level security is the backstop under both.

### The one rule worth knowing

Confirming a booking request and decrementing `available_rooms` happen in the
same transaction, inside the `confirm_booking` Postgres function. Two owners
clicking confirm on the last room at the same moment cannot both succeed — the
second one gets "No rooms left in this boarding."

### Data layer

Every query lives in `src/lib/data.ts`. Pages and server actions never touch
Supabase directly. The schema, RLS policies and seed data are in `supabase/`.

## Deploying to Vercel

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
environment variables, and set the project root to `boarding-finder` — the repo
has `idea.md` at the top level. Nothing else differs from local: the same
Postgres backs both, so what you demo is what you built.

Do not add the `service_role` key. The app never uses it, and it bypasses row
level security.

## Design

The palette comes from the Puttalam salterns: chalk-white crust, the shallow
green water standing in the pans, and the red laterite the roads are cut
through. Type is Bricolage Grotesque for display, Instrument Sans for body, IBM
Plex Mono for anything numeric — prices, counts, dates.

The room tally is the one place a number is drawn instead of written, because
"2 of 6 free" is what a student actually scans the page for.

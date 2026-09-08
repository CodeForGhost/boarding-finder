# Supabase setup

The app runs on Supabase — Postgres, Auth and row level security. There is no
local database any more; without the two keys below nothing will load.

## 1. Create the tables

Open the Supabase **SQL Editor** and run **`schema.sql`**. It is safe to re-run.
It creates:

- `profiles`, `boardings`, `bookings`
- `handle_new_user` — makes a profile row for every new signup, taking the name,
  phone and role from the signup metadata. It ignores any role other than
  `student` or `vendor`, so nobody can register themselves as an admin.
- `confirm_booking` — confirms a request and decrements `available_rooms` in one
  transaction, so two clicks on the last room cannot both succeed.
- Row level security on all three tables.

## 2. Turn off email confirmation

**Authentication → Sign In / Providers → Email**, switch off "Confirm email".
Otherwise a new signup has to click a link before it gets a session, and the
register form will tell them so instead of signing them in.

## 3. Create the demo accounts

**Authentication → Users → Add user**, password `demo1234`, with
**Auto Confirm User** ticked:

| Email | Becomes |
|---|---|
| `admin@demo.lk` | admin |
| `vendor@demo.lk` | vendor |
| `sithara@demo.lk` | vendor |
| `jaleel@demo.lk` | vendor |
| `kumari@demo.lk` | vendor |
| `student@demo.lk` | student |
| `nuha@demo.lk` | student |
| `tharindu@demo.lk` | student |

The role in that column is set by `seed.sql` in the next step, not here.

## 4. Seed the listings

Run **`seed.sql`**. It looks the accounts up by email, sets each profile's name,
phone and role, and inserts the 17 boardings and 7 booking requests. It stops
with a clear error naming the account if one is missing, and it clears any
previous seed rows first, so it is safe to re-run.

## 5. Point the app at the project

**Settings → API**, copy the **Project URL** and the **anon public** key into
`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Then `npm run dev`.

Both values are meant to be public — they ship to the browser. Row level
security is what protects the data, which is why step 1 matters. The
`service_role` key bypasses RLS entirely; this app never needs it, so keep it
out of the repo and out of Vercel.

## How the pieces map

| Concern | Where |
|---|---|
| Every query and mutation | `src/lib/data.ts` |
| Cookie-bound Supabase client | `src/lib/supabase/server.ts` |
| Who is signed in, and their role | `src/lib/session.ts` |
| Sign in / register / sign out | `src/actions/auth.ts` |
| Token refresh + `/dashboard` gate | `src/proxy.ts` |

Two things worth knowing if you extend it:

- `amenities` and `images` are real Postgres `text[]` columns, so the client
  hands them back as arrays. No parsing.
- Grouping (`getAreaCounts`, `getAreaBreakdown`) happens in JavaScript, because
  PostgREST has no `GROUP BY`. That is fine at this size; if the board grows to
  thousands of listings, move it into a view.

## Row level security, in words

- **Boardings** — approved listings are readable by anyone. A vendor also sees
  their own pending and rejected ones; an admin sees everything. Only a vendor
  can create one, only its owner or an admin can edit it, only its owner can
  delete it.
- **Bookings** — visible to the student who sent it, the owner of the boarding,
  and admins. Only a student can create one, only the boarding's owner can
  answer it, and a student can withdraw only their own pending request.
- **Profiles** — you can always read your own. Beyond that: admins read
  everyone, the owner of a live listing is readable by anyone (their name and
  phone are on the listing page, which is the point of the board), and a student
  who has requested your room is readable by you so you can ring them back.

The predicates behind those rules are `security definer` functions
(`current_role_is`, `owns_boarding`, `is_listed_owner`, `has_asked_me`). That is
deliberate: a policy that queried the tables directly would re-enter its own
policy and recurse.

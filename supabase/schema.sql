-- Puttalam Boarding Finder — Supabase schema
-- Run this in the Supabase SQL editor once, before seed.sql.
-- Safe to re-run: every object is created with "if not exists" or replaced.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------- profiles --

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  full_name  text not null default '',
  phone      text not null default '',
  role       text not null default 'student' check (role in ('student', 'vendor', 'admin')),
  created_at timestamptz not null default now()
);

-- A profile row is created for every new auth user. The name, phone and role
-- come from the metadata the register form passes to supabase.auth.signUp().
-- Nobody can make themselves an admin this way: that is set in the dashboard.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    case when new.raw_user_meta_data ->> 'role' in ('student', 'vendor')
         then new.raw_user_meta_data ->> 'role'
         else 'student' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------------- boardings --

create table if not exists public.boardings (
  id              uuid primary key default uuid_generate_v4(),
  vendor_id       uuid not null references public.profiles (id) on delete cascade,
  title           text not null,
  description     text not null default '',
  area            text not null,
  address         text not null default '',
  gender          text not null check (gender in ('male', 'female', 'mixed')),
  price_per_month integer not null check (price_per_month >= 0),
  total_rooms     integer not null default 1 check (total_rooms >= 1),
  available_rooms integer not null default 1 check (available_rooms >= 0),
  amenities       text[] not null default '{}',
  images          text[] not null default '{}',
  status          text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at      timestamptz not null default now(),
  constraint available_within_total check (available_rooms <= total_rooms)
);

create index if not exists boardings_status_idx on public.boardings (status);
create index if not exists boardings_vendor_idx on public.boardings (vendor_id);
create index if not exists boardings_area_idx   on public.boardings (area);

-- ---------------------------------------------------------------- bookings --

create table if not exists public.bookings (
  id              uuid primary key default uuid_generate_v4(),
  boarding_id     uuid not null references public.boardings (id) on delete cascade,
  student_id      uuid not null references public.profiles (id) on delete cascade,
  move_in_date    date not null,
  duration_months integer not null default 1 check (duration_months >= 1),
  message         text not null default '',
  status          text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  created_at      timestamptz not null default now()
);

create index if not exists bookings_student_idx  on public.bookings (student_id);
create index if not exists bookings_boarding_idx on public.bookings (boarding_id);

-- ------------------------------------------------------- predicate helpers --
-- All security definer, so they read past RLS. That is deliberate: a policy
-- that queried these tables directly would re-enter their own policies.

create or replace function public.current_role_is(want text)
returns boolean
language sql
stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = want);
$$;

-- Does this person own the boarding? Used to gate answering a request.
create or replace function public.owns_boarding(boarding uuid)
returns boolean
language sql
stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.boardings
    where id = boarding and vendor_id = auth.uid()
  );
$$;

-- Owners of live listings are contactable: the listing page shows their name
-- and phone to anyone, which is the whole point of the board.
create or replace function public.is_listed_owner(who uuid)
returns boolean
language sql
stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.boardings
    where vendor_id = who and status = 'approved'
  );
$$;

-- A student who has asked for one of my rooms: I need their name and number
-- to answer them.
create or replace function public.has_asked_me(who uuid)
returns boolean
language sql
stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.bookings bk
    join public.boardings b on b.id = bk.boarding_id
    where bk.student_id = who and b.vendor_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------- booking --
-- Confirming a request takes a room off the board in the same transaction, so
-- two clicks on the last room cannot both succeed. Returns null on success, or
-- the message to show the owner.

create or replace function public.confirm_booking(booking uuid)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  b record;
begin
  select bk.id, bk.status, bd.id as boarding_id, bd.vendor_id, bd.available_rooms
    into b
    from public.bookings bk
    join public.boardings bd on bd.id = bk.boarding_id
   where bk.id = booking
   for update of bk, bd;

  if not found then return 'That request no longer exists.'; end if;
  if b.vendor_id <> auth.uid() then return 'That request belongs to another owner.'; end if;
  if b.status <> 'pending' then return 'That request has already been answered.'; end if;
  if b.available_rooms < 1 then
    return 'No rooms left in this boarding. Free a room before confirming.';
  end if;

  update public.bookings set status = 'confirmed' where id = booking;
  update public.boardings set available_rooms = available_rooms - 1 where id = b.boarding_id;
  return null;
end;
$$;

-- --------------------------------------------------------------------- RLS --
-- The server actions check roles too. These policies mean the anon key, which
-- ships to the browser, still cannot reach anything it should not.

alter table public.profiles  enable row level security;
alter table public.boardings enable row level security;
alter table public.bookings  enable row level security;

-- profiles ------------------------------------------------------------------

drop policy if exists "profiles are readable by their owner" on public.profiles;
drop policy if exists "profiles are visible to those who need them" on public.profiles;
create policy "profiles are visible to those who need them" on public.profiles
  for select using (
    id = auth.uid()                    -- myself
    or public.current_role_is('admin') -- admins see everyone
    or public.is_listed_owner(id)      -- owner contact on a live listing
    or public.has_asked_me(id)         -- a student who requested my room
  );

drop policy if exists "profiles are editable by their owner" on public.profiles;
create policy "profiles are editable by their owner" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- boardings -----------------------------------------------------------------

drop policy if exists "approved boardings are public" on public.boardings;
create policy "approved boardings are public" on public.boardings
  for select using (
    status = 'approved' or vendor_id = auth.uid() or public.current_role_is('admin')
  );

drop policy if exists "vendors create their own boardings" on public.boardings;
create policy "vendors create their own boardings" on public.boardings
  for insert with check (vendor_id = auth.uid() and public.current_role_is('vendor'));

drop policy if exists "vendors and admins edit boardings" on public.boardings;
create policy "vendors and admins edit boardings" on public.boardings
  for update using (vendor_id = auth.uid() or public.current_role_is('admin'))
  with check (vendor_id = auth.uid() or public.current_role_is('admin'));

drop policy if exists "vendors delete their own boardings" on public.boardings;
create policy "vendors delete their own boardings" on public.boardings
  for delete using (vendor_id = auth.uid());

-- bookings ------------------------------------------------------------------

drop policy if exists "students and the owner see a booking" on public.bookings;
create policy "students and the owner see a booking" on public.bookings
  for select using (
    student_id = auth.uid()
    or public.current_role_is('admin')
    or public.owns_boarding(boarding_id)
  );

drop policy if exists "students create their own requests" on public.bookings;
create policy "students create their own requests" on public.bookings
  for insert with check (student_id = auth.uid() and public.current_role_is('student'));

drop policy if exists "the owner answers a request" on public.bookings;
create policy "the owner answers a request" on public.bookings
  for update using (public.owns_boarding(boarding_id))
  with check (public.owns_boarding(boarding_id));

drop policy if exists "students withdraw their own requests" on public.bookings;
create policy "students withdraw their own requests" on public.bookings
  for delete using (student_id = auth.uid() and status = 'pending');

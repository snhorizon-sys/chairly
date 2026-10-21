-- =====================================================================
-- Chairly 0003: zasady, lokalizacja, tryb potwierdzania i wymagania
-- Uruchom w Supabase: SQL Editor -> New query -> wklej całość -> Run
-- =====================================================================

create type public.confirmation_mode as enum ('instant', 'manual');
create type public.cancellation_policy as enum ('flexible', 'moderate', 'strict');

-- ---------------------------------------------------------------------
-- Oferty: zasady najmu, wymagania wobec najemcy, udogodnienia, sale i eventy
-- ---------------------------------------------------------------------
alter table public.listings
  add column confirmation        public.confirmation_mode   not null default 'manual',
  add column cancellation        public.cancellation_policy not null default 'moderate',
  add column min_hours           smallint not null default 1  check (min_hours between 1 and 24),
  add column deposit             numeric(10,2) check (deposit >= 0),
  add column notice_days         smallint check (notice_days between 0 and 180), -- wypowiedzenie przy najmie miesięcznym
  add column rules               text[] not null default '{}',   -- zasady korzystania, zakazy
  add column requirements        text[] not null default '{}',   -- wymagania wobec najemcy
  add column requires_insurance  boolean not null default false, -- wymagane OC
  add column amenities           text[] not null default '{}',   -- szatnia, kuchnia, Wi-Fi...
  add column layouts             text[] not null default '{}',   -- sale/eventy: układ sali
  add column catering_allowed    boolean,                        -- sale/eventy
  add column setup_info          text;                           -- montaż i demontaż

-- ---------------------------------------------------------------------
-- Salony: dojazd i dostępność lokalu (pełny adres już jest w kolumnie address)
-- ---------------------------------------------------------------------
alter table public.salons
  add column floor       text,
  add column has_elevator boolean,
  add column parking     text,
  add column directions  text;

revoke insert, update on public.salons from authenticated;
grant insert (owner_id, name, slug, city, district, address, lat, lng, description,
              floor, has_elevator, parking, directions) on public.salons to authenticated;
grant update (name, city, district, address, lat, lng, description,
              floor, has_elevator, parking, directions) on public.salons to authenticated;

-- ---------------------------------------------------------------------
-- Profil najemcy: ubezpieczenie OC (salon może go wymagać)
-- ---------------------------------------------------------------------
alter table public.profiles
  add column has_insurance boolean not null default false;

revoke update on public.profiles from authenticated;
grant update (full_name, phone, bio, specialties, avatar_path, role, has_insurance) on public.profiles to authenticated;

create or replace view public.public_profiles as
  select id, role, full_name, bio, specialties, avatar_path, verified, has_insurance
  from public.profiles;

-- ---------------------------------------------------------------------
-- Widok do wyszukiwarki: nowe kolumny dopisane na końcu.
-- Wskazówki dojścia (directions) celowo nie trafiają do widoku publicznego.
-- (create or replace view dopuszcza tylko dopisywanie kolumn na końcu)
-- ---------------------------------------------------------------------
create or replace view public.listing_cards
with (security_invoker = true) as
select
  l.id, l.slug, l.type, l.title, l.description, l.specialties, l.equipment, l.included,
  l.price_hour, l.price_day, l.price_month, l.capacity, l.tone, l.created_at,
  s.name as salon_name, s.city, s.district, s.verified,
  coalesce(r.avg_rating, 0)::numeric(2,1) as rating,
  coalesce(r.review_count, 0)             as review_count,
  l.confirmation, l.cancellation, l.min_hours, l.deposit, l.notice_days,
  l.rules, l.requirements, l.requires_insurance, l.amenities,
  l.layouts, l.catering_allowed, l.setup_info,
  s.floor, s.has_elevator, s.parking
from public.listings l
join public.salons s on s.id = l.salon_id
left join lateral (
  select avg(rv.rating) as avg_rating, count(*) as review_count
  from public.reviews rv
  join public.bookings b on b.id = rv.booking_id
  where b.listing_id = l.id and rv.direction = 'renter_to_salon'
) r on true
where l.status = 'published';

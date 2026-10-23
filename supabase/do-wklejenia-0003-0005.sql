-- =====================================================================
-- Chairly: migracje 0003 + 0004 + 0005 w jednym pliku do wklejenia
-- Supabase -> SQL Editor -> New query -> wklej CAŁOŚĆ -> Run
-- Można uruchomić ponownie: części już wykonane zostaną pominięte.
-- (Oryginalne pliki zostają w supabase/migrations.)
-- =====================================================================

-- =====================================================================
-- Chairly 0003: zasady, lokalizacja, tryb potwierdzania i wymagania
-- Uruchom w Supabase: SQL Editor -> New query -> wklej całość -> Run
-- =====================================================================

do $$ begin create type public.confirmation_mode as enum ('instant', 'manual'); exception when duplicate_object then null; end $$;
do $$ begin create type public.cancellation_policy as enum ('flexible', 'moderate', 'strict'); exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Oferty: zasady najmu, wymagania wobec najemcy, udogodnienia, sale i eventy
-- ---------------------------------------------------------------------
alter table public.listings
  add column if not exists confirmation        public.confirmation_mode   not null default 'manual',
  add column if not exists cancellation        public.cancellation_policy not null default 'moderate',
  add column if not exists min_hours           smallint not null default 1  check (min_hours between 1 and 24),
  add column if not exists deposit             numeric(10,2) check (deposit >= 0),
  add column if not exists notice_days         smallint check (notice_days between 0 and 180), -- wypowiedzenie przy najmie miesięcznym
  add column if not exists rules               text[] not null default '{}',   -- zasady korzystania, zakazy
  add column if not exists requirements        text[] not null default '{}',   -- wymagania wobec najemcy
  add column if not exists requires_insurance  boolean not null default false, -- wymagane OC
  add column if not exists amenities           text[] not null default '{}',   -- szatnia, kuchnia, Wi-Fi...
  add column if not exists layouts             text[] not null default '{}',   -- sale/eventy: układ sali
  add column if not exists catering_allowed    boolean,                        -- sale/eventy
  add column if not exists setup_info          text;                           -- montaż i demontaż

-- ---------------------------------------------------------------------
-- Salony: dojazd i dostępność lokalu (pełny adres już jest w kolumnie address)
-- ---------------------------------------------------------------------
alter table public.salons
  add column if not exists floor       text,
  add column if not exists has_elevator boolean,
  add column if not exists parking     text,
  add column if not exists directions  text;

revoke insert, update on public.salons from authenticated;
grant insert (owner_id, name, slug, city, district, address, lat, lng, description,
              floor, has_elevator, parking, directions) on public.salons to authenticated;
grant update (name, city, district, address, lat, lng, description,
              floor, has_elevator, parking, directions) on public.salons to authenticated;

-- ---------------------------------------------------------------------
-- Profil najemcy: ubezpieczenie OC (salon może go wymagać)
-- ---------------------------------------------------------------------
alter table public.profiles
  add column if not exists has_insurance boolean not null default false;

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
-- (W tym pliku widok listing_cards tworzy dopiero część 0005 poniżej, z kolumnami mapy.)


-- =====================================================================
-- Chairly 0004: adres i wskazówki dojścia widoczne dopiero po potwierdzeniu
-- Uruchom w Supabase: SQL Editor -> New query -> wklej całość -> Run
-- (Można uruchomić ponownie, nic się nie zepsuje.)
--
-- Wcześniej tabela salons była czytelna dla każdego (polityka "salon read"),
-- więc adres, współrzędne i wskazówki dojścia mógł pobrać także niezalogowany
-- odwiedzający. Teraz:
--   * publicznie zostają: nazwa, miasto, dzielnica, opis, piętro, winda, parking
--   * ukryte: address, lat, lng, directions
--   * ukryte dane zwraca funkcja salon_private_details() tylko właścicielowi
--     salonu, najemcy z potwierdzoną lub zakończoną rezerwacją i adminowi
--
-- Uwaga dla kodu aplikacji: na tabeli salons nie wolno już robić select("*").
-- Wszystkie obecne zapytania podają listę kolumn, więc nic się nie zmienia.
-- =====================================================================

revoke select on public.salons from anon, authenticated;

grant select (id, owner_id, name, slug, city, district, description, verified, created_at,
              floor, has_elevator, parking)
  on public.salons to anon, authenticated;

-- ---------------------------------------------------------------------
-- Dane prywatne salonu
-- ---------------------------------------------------------------------
create or replace function public.salon_private_details(p_salon uuid)
returns table (address text, lat double precision, lng double precision, directions text)
language sql stable security definer set search_path = public as $$
  select s.address, s.lat, s.lng, s.directions
  from salons s
  where s.id = p_salon
    and (
      s.owner_id = auth.uid()
      or public.is_admin()
      or exists (
        select 1
        from bookings b
        join listings l on l.id = b.listing_id
        where l.salon_id = s.id
          and b.renter_id = auth.uid()
          and b.status in ('confirmed', 'completed')
      )
    );
$$;

revoke execute on function public.salon_private_details(uuid) from public, anon;
grant execute on function public.salon_private_details(uuid) to authenticated;


-- =====================================================================
-- Chairly 0005: przybliżona lokalizacja salonów do mapy w wyszukiwarce
-- Uruchom w Supabase PO 0004: SQL Editor -> New query -> wklej całość -> Run
-- (Można uruchomić ponownie, nic się nie zepsuje.)
--
-- Dokładne lat/lng zostają ukryte (migracja 0004). Mapa dostaje osobne,
-- publiczne kolumny map_lat/map_lng: punkt przesunięty o kilkaset metrów,
-- liczony automatycznie z lat/lng. Z mapy nie da się odczytać adresu.
-- =====================================================================

alter table public.salons
  add column if not exists map_lat double precision,
  add column if not exists map_lng double precision;

-- Siatka ok. 550 x 340 m + stałe przesunięcie zależne od salonu (do ok. 170 m),
-- żeby salony z tej samej okolicy nie nakładały się na mapie.
create or replace function public.salons_set_map_point()
returns trigger language plpgsql as $$
declare
  h bigint;
begin
  if new.lat is null or new.lng is null then
    new.map_lat := null;
    new.map_lng := null;
    return new;
  end if;
  h := abs(hashtext(new.id::text)::bigint);
  new.map_lat := (round((new.lat * 200)::numeric) / 200)::double precision + ((h % 1000) / 1000.0 - 0.5) * 0.003;
  new.map_lng := (round((new.lng * 200)::numeric) / 200)::double precision + (((h / 1000) % 1000) / 1000.0 - 0.5) * 0.004;
  return new;
end;
$$;

drop trigger if exists salons_map_point on public.salons;
create trigger salons_map_point
  before insert or update of lat, lng on public.salons
  for each row execute function public.salons_set_map_point();

-- Przybliżony punkt jest publiczny; ustawić go może tylko wyzwalacz
grant select (map_lat, map_lng) on public.salons to anon, authenticated;

-- Współrzędne salonów demo (dane przykładowe z seed.sql)
update public.salons s set lat = v.lat, lng = v.lng
from (values
  ('studio-lustro',    52.41216, 16.90041),
  ('skin-room',        52.39251, 16.91953),
  ('nail-bar-rynek',   52.40862, 16.93381),
  ('grunwald-barbers', 52.39879, 16.87922),
  ('akademia-forma',   52.40403, 16.92218),
  ('garbary-loft',     52.41284, 16.94053),
  ('brow-atelier',     52.19321, 21.02512),
  ('oaza-body',        51.08022, 17.01981)
) as v(slug, lat, lng)
where s.slug = v.slug and s.owner_id is null;

-- Uzupełnij punkt dla salonów, które już mają współrzędne
update public.salons set lat = lat where lat is not null and map_lat is null;

-- Widok wyszukiwarki: przybliżony punkt dopisany na końcu jako lat/lng
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
  s.floor, s.has_elevator, s.parking,
  s.map_lat as lat, s.map_lng as lng
from public.listings l
join public.salons s on s.id = l.salon_id
left join lateral (
  select avg(rv.rating) as avg_rating, count(*) as review_count
  from public.reviews rv
  join public.bookings b on b.id = rv.booking_id
  where b.listing_id = l.id and rv.direction = 'renter_to_salon'
) r on true
where l.status = 'published';

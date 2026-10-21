-- =====================================================================
-- Fotelia: schemat bazy (Supabase / PostgreSQL)
-- Uruchom w Supabase: SQL Editor -> New query -> wklej całość -> Run
-- =====================================================================

create extension if not exists btree_gist;

-- ---------------------------------------------------------------------
-- Typy
-- ---------------------------------------------------------------------
create type public.user_role      as enum ('renter', 'host', 'admin');
create type public.listing_type   as enum ('stanowisko', 'sala', 'event');
create type public.listing_status as enum ('draft', 'published', 'archived');
create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type public.review_direction as enum ('renter_to_salon', 'salon_to_renter');
create type public.verification_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------
-- Profile użytkowników (1:1 z auth.users)
-- ---------------------------------------------------------------------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         public.user_role not null default 'renter',
  full_name    text,
  phone        text,
  bio          text,
  specialties  text[] not null default '{}',
  avatar_path  text,
  verified     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Automatyczne tworzenie profilu po rejestracji
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Salony
-- ---------------------------------------------------------------------
create table public.salons (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid references public.profiles (id) on delete set null, -- null tylko dla danych demo
  name         text not null,
  slug         text not null unique,
  city         text not null,
  district     text,
  address      text,
  lat          double precision,
  lng          double precision,
  description  text,
  verified     boolean not null default false,
  created_at   timestamptz not null default now()
);

create index salons_city_idx on public.salons (lower(city));

-- ---------------------------------------------------------------------
-- Oferty: stanowiska, sale szkoleniowe, przestrzenie na eventy
-- Ceny w złotych (numeric), docelowo do Stripe przeliczane na grosze
-- ---------------------------------------------------------------------
create table public.listings (
  id           uuid primary key default gen_random_uuid(),
  salon_id     uuid not null references public.salons (id) on delete cascade,
  slug         text not null unique,
  type         public.listing_type not null,
  status       public.listing_status not null default 'draft',
  title        text not null,
  description  text,
  specialties  text[] not null default '{}',
  equipment    text[] not null default '{}',
  included     text[] not null default '{}',
  price_hour   numeric(10,2) check (price_hour  > 0),
  price_day    numeric(10,2) check (price_day   > 0),
  price_month  numeric(10,2) check (price_month > 0),
  capacity     int check (capacity > 0),
  tone         text, -- kolor zastępczy, dopóki nie ma zdjęć
  created_at   timestamptz not null default now(),
  constraint listings_has_price check (coalesce(price_hour, price_day, price_month) is not null)
);

create index listings_salon_idx on public.listings (salon_id);
create index listings_type_status_idx on public.listings (type, status);
create index listings_specialties_idx on public.listings using gin (specialties);

create table public.listing_photos (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  position     int not null default 0
);

create index listing_photos_listing_idx on public.listing_photos (listing_id, position);

-- ---------------------------------------------------------------------
-- Dostępność: stały tygodniowy grafik (0 = niedziela ... 6 = sobota)
-- ---------------------------------------------------------------------
create table public.availability_rules (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings (id) on delete cascade,
  weekday      smallint not null check (weekday between 0 and 6),
  start_time   time not null,
  end_time     time not null,
  check (end_time > start_time)
);

create index availability_rules_listing_idx on public.availability_rules (listing_id, weekday);

-- Wyjątki: urlop, święto, zamknięty dzień
create table public.availability_blocks (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings (id) on delete cascade,
  during       tstzrange not null,
  reason       text
);

-- ---------------------------------------------------------------------
-- Rezerwacje
-- Exclusion constraint: baza fizycznie nie pozwoli na dwie aktywne
-- rezerwacje tej samej oferty w nakładających się godzinach.
-- ---------------------------------------------------------------------
create table public.bookings (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings (id) on delete restrict,
  renter_id    uuid not null references public.profiles (id) on delete restrict,
  during       tstzrange not null,
  status       public.booking_status not null default 'pending',
  price_total  numeric(10,2) not null check (price_total >= 0),
  note         text,
  created_at   timestamptz not null default now(),
  constraint bookings_no_overlap exclude using gist (
    listing_id with =,
    during with &&
  ) where (status in ('pending', 'confirmed'))
);

create index bookings_renter_idx on public.bookings (renter_id);
create index bookings_listing_during_idx on public.bookings using gist (listing_id, during);

-- ---------------------------------------------------------------------
-- Zapytania o eventy (bez kalendarza, wycena indywidualna)
-- ---------------------------------------------------------------------
create table public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings (id) on delete cascade,
  sender_id    uuid references public.profiles (id) on delete set null,
  name         text not null,
  email        text not null,
  event_date   date,
  guests       int,
  message      text not null,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Opinie w obie strony, jedna na rezerwację i kierunek
-- ---------------------------------------------------------------------
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references public.bookings (id) on delete cascade,
  author_id    uuid not null references public.profiles (id) on delete cascade,
  direction    public.review_direction not null,
  rating       smallint not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now(),
  unique (booking_id, direction)
);

-- ---------------------------------------------------------------------
-- Weryfikacja: certyfikaty najemców, dokumenty salonów (sanepid itp.)
-- ---------------------------------------------------------------------
create table public.verifications (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid references public.profiles (id) on delete cascade,
  salon_id     uuid references public.salons (id) on delete cascade,
  document     text not null,  -- np. 'certyfikat', 'opinia_sanepid'
  storage_path text not null,
  status       public.verification_status not null default 'pending',
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now(),
  check (num_nonnulls(profile_id, salon_id) = 1)
);

-- ---------------------------------------------------------------------
-- Widok do wyszukiwarki: oferta + salon + średnia ocen
-- ---------------------------------------------------------------------
create view public.listing_cards
with (security_invoker = true) as
select
  l.id, l.slug, l.type, l.title, l.description, l.specialties, l.equipment, l.included,
  l.price_hour, l.price_day, l.price_month, l.capacity, l.tone, l.created_at,
  s.name as salon_name, s.city, s.district, s.verified,
  coalesce(r.avg_rating, 0)::numeric(2,1) as rating,
  coalesce(r.review_count, 0)             as review_count
from public.listings l
join public.salons s on s.id = l.salon_id
left join lateral (
  select avg(rv.rating) as avg_rating, count(*) as review_count
  from public.reviews rv
  join public.bookings b on b.id = rv.booking_id
  where b.listing_id = l.id and rv.direction = 'renter_to_salon'
) r on true
where l.status = 'published';

-- Zajęte godziny bez danych osobowych (do paska dostępności)
create function public.busy_ranges(p_listing uuid, p_from timestamptz, p_to timestamptz)
returns table (during tstzrange)
language sql stable security definer set search_path = public as $$
  select b.during from bookings b
  where b.listing_id = p_listing
    and b.status in ('pending', 'confirmed')
    and b.during && tstzrange(p_from, p_to)
  union all
  select ab.during from availability_blocks ab
  where ab.listing_id = p_listing
    and ab.during && tstzrange(p_from, p_to);
$$;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles            enable row level security;
alter table public.salons              enable row level security;
alter table public.listings            enable row level security;
alter table public.listing_photos      enable row level security;
alter table public.availability_rules  enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.bookings            enable row level security;
alter table public.inquiries           enable row level security;
alter table public.reviews             enable row level security;
alter table public.verifications       enable row level security;

-- Pomocnicza: czy zalogowany użytkownik jest właścicielem oferty
create function public.owns_listing(p_listing uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from listings l join salons s on s.id = l.salon_id
    where l.id = p_listing and s.owner_id = auth.uid()
  );
$$;

-- Profile: każdy widzi publiczne profile, edytuje tylko swój
create policy "profile read"   on public.profiles for select using (true);
create policy "profile update" on public.profiles for update using (id = auth.uid());

-- Salony: publiczne do odczytu, właściciel zarządza
create policy "salon read"   on public.salons for select using (true);
create policy "salon insert" on public.salons for insert with check (owner_id = auth.uid());
create policy "salon update" on public.salons for update using (owner_id = auth.uid());
create policy "salon delete" on public.salons for delete using (owner_id = auth.uid());

-- Oferty: opublikowane widzą wszyscy, właściciel widzi i edytuje swoje
create policy "listing read" on public.listings for select
  using (status = 'published' or public.owns_listing(id));
create policy "listing insert" on public.listings for insert
  with check (exists (select 1 from public.salons s where s.id = salon_id and s.owner_id = auth.uid()));
create policy "listing update" on public.listings for update using (public.owns_listing(id));
create policy "listing delete" on public.listings for delete using (public.owns_listing(id));

-- Zdjęcia i grafik: jak oferta
create policy "photo read"   on public.listing_photos for select using (true);
create policy "photo write"  on public.listing_photos for all
  using (public.owns_listing(listing_id)) with check (public.owns_listing(listing_id));

create policy "rules read"   on public.availability_rules for select using (true);
create policy "rules write"  on public.availability_rules for all
  using (public.owns_listing(listing_id)) with check (public.owns_listing(listing_id));

create policy "blocks owner" on public.availability_blocks for all
  using (public.owns_listing(listing_id)) with check (public.owns_listing(listing_id));

-- Rezerwacje: widzi najemca i salon; tworzy zalogowany najemca
create policy "booking read" on public.bookings for select
  using (renter_id = auth.uid() or public.owns_listing(listing_id));
create policy "booking insert" on public.bookings for insert
  with check (renter_id = auth.uid() and status = 'pending');
create policy "booking update" on public.bookings for update
  using (renter_id = auth.uid() or public.owns_listing(listing_id));

-- Zapytania o eventy: każdy może wysłać, czyta tylko salon
create policy "inquiry insert" on public.inquiries for insert with check (true);
create policy "inquiry read"   on public.inquiries for select using (public.owns_listing(listing_id));

-- Opinie: publiczne; dodaje tylko strona rezerwacji
create policy "review read" on public.reviews for select using (true);
create policy "review insert" on public.reviews for insert with check (
  author_id = auth.uid() and exists (
    select 1 from public.bookings b
    where b.id = booking_id and b.status = 'completed'
      and (
        (direction = 'renter_to_salon' and b.renter_id = auth.uid()) or
        (direction = 'salon_to_renter' and public.owns_listing(b.listing_id))
      )
  )
);

-- Weryfikacje: widzi i dodaje tylko właściciel dokumentu
create policy "verification own" on public.verifications for all
  using (
    profile_id = auth.uid()
    or exists (select 1 from public.salons s where s.id = salon_id and s.owner_id = auth.uid())
  )
  with check (
    profile_id = auth.uid()
    or exists (select 1 from public.salons s where s.id = salon_id and s.owner_id = auth.uid())
  );

grant execute on function public.busy_ranges(uuid, timestamptz, timestamptz) to anon, authenticated;

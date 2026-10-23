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

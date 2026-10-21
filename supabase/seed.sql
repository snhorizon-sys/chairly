-- =====================================================================
-- Dane demo: 8 przykładowych ofert (te same co w src/data/listings.ts)
-- Uruchom PO 0001_schema.sql. Można bezpiecznie usunąć przed startem.
-- =====================================================================

with s as (
  insert into public.salons (name, slug, city, district, verified)
  values ('Studio Lustro', 'studio-lustro', 'Poznań', 'Jeżyce', true)
  on conflict (slug) do update set name = excluded.name
  returning id
), l as (
  insert into public.listings (salon_id, slug, type, status, title, description, specialties, equipment, included, price_hour, price_day, price_month, capacity, tone)
  select s.id, 'fotel-jezyce', 'stanowisko', 'published', 'Fotel fryzjerski przy oknie', 'Jasne stanowisko w kameralnym salonie na Jeżycach. Dwie myjki na trzy fotele, własna szafka na kosmetyki, parking dla klientek w podwórzu.', array['Fryzjerstwo']::text[], array['Fotel hydrauliczny', 'Myjka z masażem', 'Suszarka i prostownica', 'Lustro z oświetleniem LED']::text[], array['Media', 'Ręczniki i pranie', 'Recepcja', 'Kawa dla klientek']::text[], 35, 220, 1900, null, '#E7D9DC'
  from s
  returning id
)
insert into public.availability_rules (listing_id, weekday, start_time, end_time)
select l.id, r.weekday, r.start_time::time, r.end_time::time
from l, (values (0, '09:00', '13:00'), (0, '15:00', '19:00'), (1, '09:00', '13:00'), (1, '15:00', '19:00'), (2, '09:00', '13:00'), (2, '15:00', '19:00'), (3, '09:00', '13:00'), (3, '15:00', '19:00'), (4, '09:00', '13:00'), (4, '15:00', '19:00'), (5, '09:00', '13:00'), (5, '15:00', '19:00'), (6, '09:00', '13:00'), (6, '15:00', '19:00')) as r(weekday, start_time, end_time);

with s as (
  insert into public.salons (name, slug, city, district, verified)
  values ('Skin Room', 'skin-room', 'Poznań', 'Wilda', true)
  on conflict (slug) do update set name = excluded.name
  returning id
), l as (
  insert into public.listings (salon_id, slug, type, status, title, description, specialties, equipment, included, price_hour, price_day, price_month, capacity, tone)
  select s.id, 'gabinet-kosmetologiczny-wilda', 'stanowisko', 'published', 'Gabinet kosmetologiczny z łóżkiem', 'Zamykany gabinet z umywalką i wentylacją, spełnia wymogi sanitarne do zabiegów z naruszeniem ciągłości skóry.', array['Kosmetologia', 'Rzęsy i brwi']::text[], array['Łóżko elektryczne', 'Lampa lupa', 'Autoklaw', 'Wózek kosmetyczny']::text[], array['Media', 'Sterylizacja narzędzi', 'Jednorazowe podkłady']::text[], 45, 280, null, null, '#D9E3DF'
  from s
  returning id
)
insert into public.availability_rules (listing_id, weekday, start_time, end_time)
select l.id, r.weekday, r.start_time::time, r.end_time::time
from l, (values (0, '12:00', '18:00'), (1, '12:00', '18:00'), (2, '12:00', '18:00'), (3, '12:00', '18:00'), (4, '12:00', '18:00'), (5, '12:00', '18:00'), (6, '12:00', '18:00')) as r(weekday, start_time, end_time);

with s as (
  insert into public.salons (name, slug, city, district, verified)
  values ('Nail Bar Rynek', 'nail-bar-rynek', 'Poznań', 'Stare Miasto', false)
  on conflict (slug) do update set name = excluded.name
  returning id
), l as (
  insert into public.listings (salon_id, slug, type, status, title, description, specialties, equipment, included, price_hour, price_day, price_month, capacity, tone)
  select s.id, 'stanowisko-nails-stare-miasto', 'stanowisko', 'published', 'Stanowisko do stylizacji paznokci', 'Jedno z pięciu stanowisk w lokalu przy Starym Rynku. Duży ruch przechodni i własny profil salonu w systemie rezerwacji.', array['Paznokcie']::text[], array['Biurko z pochłaniaczem', 'Frezarka', 'Lampa UV/LED', 'Fotel klientki']::text[], array['Media', 'Recepcja', 'Wspólna strefa oczekiwania']::text[], 25, 150, 1200, null, '#E9E1D2'
  from s
  returning id
)
insert into public.availability_rules (listing_id, weekday, start_time, end_time)
select l.id, r.weekday, r.start_time::time, r.end_time::time
from l, (values (0, '08:00', '11:00'), (0, '14:00', '16:00'), (0, '18:00', '20:00'), (1, '08:00', '11:00'), (1, '14:00', '16:00'), (1, '18:00', '20:00'), (2, '08:00', '11:00'), (2, '14:00', '16:00'), (2, '18:00', '20:00'), (3, '08:00', '11:00'), (3, '14:00', '16:00'), (3, '18:00', '20:00'), (4, '08:00', '11:00'), (4, '14:00', '16:00'), (4, '18:00', '20:00'), (5, '08:00', '11:00'), (5, '14:00', '16:00'), (5, '18:00', '20:00'), (6, '08:00', '11:00'), (6, '14:00', '16:00'), (6, '18:00', '20:00')) as r(weekday, start_time, end_time);

with s as (
  insert into public.salons (name, slug, city, district, verified)
  values ('Grunwald Barbers', 'grunwald-barbers', 'Poznań', 'Grunwald', true)
  on conflict (slug) do update set name = excluded.name
  returning id
), l as (
  insert into public.listings (salon_id, slug, type, status, title, description, specialties, equipment, included, price_hour, price_day, price_month, capacity, tone)
  select s.id, 'barber-grunwald', 'stanowisko', 'published', 'Fotel barberski', 'Fotel na stałe lub dniówki w piątki i soboty. Właściciel szuka osoby z własną bazą klientów.', array['Barber']::text[], array['Fotel barberski Takara', 'Myjka', 'Sterylizator UV']::text[], array['Media', 'Muzyka i Wi-Fi', 'Ręczniki']::text[], null, 180, 1600, null, '#D8DCE6'
  from s
  returning id
)
insert into public.availability_rules (listing_id, weekday, start_time, end_time)
select l.id, r.weekday, r.start_time::time, r.end_time::time
from l, (values (5, '09:00', '19:00'), (6, '09:00', '19:00')) as r(weekday, start_time, end_time);

with s as (
  insert into public.salons (name, slug, city, district, verified)
  values ('Akademia Forma', 'akademia-forma', 'Poznań', 'Centrum', true)
  on conflict (slug) do update set name = excluded.name
  returning id
), l as (
  insert into public.listings (salon_id, slug, type, status, title, description, specialties, equipment, included, price_hour, price_day, price_month, capacity, tone)
  select s.id, 'sala-szkoleniowa-centrum', 'sala', 'published', 'Sala szkoleniowa na 12 osób', 'Przestrzeń przygotowana pod szkolenia praktyczne. Można rozłożyć stanowiska w podkowę lub w rzędach.', array['Paznokcie', 'Rzęsy i brwi', 'Makijaż']::text[], array['6 stanowisk z lampami', '2 łóżka dla modelek', 'Rzutnik i ekran', 'Statyw i oświetlenie do nagrań']::text[], array['Kawa i woda', 'Szatnia', 'Pomoc przy rekrutacji modelek']::text[], null, 900, null, 12, '#E3DCEA'
  from s
  returning id
)
insert into public.availability_rules (listing_id, weekday, start_time, end_time)
select l.id, r.weekday, r.start_time::time, r.end_time::time
from l, (values (0, '08:00', '20:00'), (1, '08:00', '20:00'), (2, '08:00', '20:00'), (3, '08:00', '20:00'), (4, '08:00', '20:00'), (5, '08:00', '20:00'), (6, '08:00', '20:00')) as r(weekday, start_time, end_time);

with s as (
  insert into public.salons (name, slug, city, district, verified)
  values ('Garbary Loft', 'garbary-loft', 'Poznań', 'Garbary', true)
  on conflict (slug) do update set name = excluded.name
  returning id
), l as (
  insert into public.listings (salon_id, slug, type, status, title, description, specialties, equipment, included, price_hour, price_day, price_month, capacity, tone)
  select s.id, 'event-loft-garbary', 'event', 'published', 'Loft na pokazy i premiery', 'Industrialne wnętrze na premiery marek, pokazy fryzjerskie i sesje zdjęciowe. Wycena indywidualna przy większych wydarzeniach.', array['Makijaż', 'Fryzjerstwo']::text[], array['Wybieg', 'Nagłośnienie', 'Ścianka do zdjęć', 'Zaplecze dla modelek']::text[], array['Sprzątanie', 'Ochrona', 'Możliwość cateringu']::text[], null, 2500, null, 60, '#DDE2D6'
  from s
  returning id
)
select 1 from l;

with s as (
  insert into public.salons (name, slug, city, district, verified)
  values ('Brow Atelier', 'brow-atelier', 'Warszawa', 'Mokotów', true)
  on conflict (slug) do update set name = excluded.name
  returning id
), l as (
  insert into public.listings (salon_id, slug, type, status, title, description, specialties, equipment, included, price_hour, price_day, price_month, capacity, tone)
  select s.id, 'pmu-warszawa-mokotow', 'stanowisko', 'published', 'Gabinet do makijażu permanentnego', 'Gabinet z pozytywną opinią sanepidu, dostępny w poniedziałki i środy.', array['Makijaż permanentny', 'Rzęsy i brwi']::text[], array['Łóżko elektryczne', 'Lampa bezcieniowa', 'Autoklaw klasy B']::text[], array['Media', 'Sterylizacja', 'Recepcja']::text[], 60, 380, null, null, '#EADBD3'
  from s
  returning id
)
insert into public.availability_rules (listing_id, weekday, start_time, end_time)
select l.id, r.weekday, r.start_time::time, r.end_time::time
from l, (values (0, '10:00', '16:00'), (1, '10:00', '16:00'), (2, '10:00', '16:00'), (3, '10:00', '16:00'), (4, '10:00', '16:00'), (5, '10:00', '16:00'), (6, '10:00', '16:00')) as r(weekday, start_time, end_time);

with s as (
  insert into public.salons (name, slug, city, district, verified)
  values ('Oaza Body', 'oaza-body', 'Wrocław', 'Krzyki', false)
  on conflict (slug) do update set name = excluded.name
  returning id
), l as (
  insert into public.listings (salon_id, slug, type, status, title, description, specialties, equipment, included, price_hour, price_day, price_month, capacity, tone)
  select s.id, 'masaz-wroclaw', 'stanowisko', 'published', 'Pokój do masażu', 'Wyciszony pokój z regulowanym oświetleniem. Najlepiej sprawdzi się przy stałej współpracy.', array['Masaż']::text[], array['Stół do masażu', 'Podgrzewacz ręczników', 'Głośnik']::text[], array['Media', 'Pranie', 'Prysznic dla klientów']::text[], 40, null, 1500, null, '#D6E0E3'
  from s
  returning id
)
insert into public.availability_rules (listing_id, weekday, start_time, end_time)
select l.id, r.weekday, r.start_time::time, r.end_time::time
from l, (values (0, '16:00', '20:00'), (1, '16:00', '20:00'), (2, '16:00', '20:00'), (3, '16:00', '20:00'), (4, '16:00', '20:00'), (5, '16:00', '20:00'), (6, '16:00', '20:00')) as r(weekday, start_time, end_time);


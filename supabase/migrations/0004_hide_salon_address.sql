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

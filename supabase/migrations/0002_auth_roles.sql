-- =====================================================================
-- Chairly 0002: role przy rejestracji i zabezpieczenia kolumn
-- Uruchom w Supabase: SQL Editor -> New query -> wklej całość -> Run
-- =====================================================================

-- Czy zalogowany użytkownik jest administratorem
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- Czy zalogowany użytkownik ma konto salonu
create or replace function public.is_host()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('host', 'admin'));
$$;

-- Rola wybrana przy rejestracji (tylko renter lub host, nigdy admin)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    case when new.raw_user_meta_data ->> 'role' = 'host' then 'host'::user_role else 'renter'::user_role end
  );
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Profile: telefon i inne dane widzi tylko właściciel.
-- Publiczne informacje są w widoku public_profiles.
-- ---------------------------------------------------------------------
drop policy if exists "profile read" on public.profiles;
drop policy if exists "profile update" on public.profiles;

create policy "profile read own" on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profile update own" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and (role <> 'admin' or public.is_admin()));

-- Użytkownik może zmieniać tylko te kolumny (bez "verified")
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, phone, bio, specialties, avatar_path, role) on public.profiles to authenticated;

create or replace view public.public_profiles as
  select id, role, full_name, bio, specialties, avatar_path, verified
  from public.profiles;

grant select on public.public_profiles to anon, authenticated;

-- ---------------------------------------------------------------------
-- Salony: zakłada tylko konto salonu; "verified" nadaje wyłącznie admin
-- ---------------------------------------------------------------------
drop policy if exists "salon insert" on public.salons;
create policy "salon insert" on public.salons for insert
  with check (owner_id = auth.uid() and public.is_host());

revoke insert, update on public.salons from anon, authenticated;
grant insert (owner_id, name, slug, city, district, address, lat, lng, description) on public.salons to authenticated;
grant update (name, city, district, address, lat, lng, description) on public.salons to authenticated;

-- Jeden salon na konto (na start)
create unique index if not exists salons_one_per_owner on public.salons (owner_id) where owner_id is not null;

-- TODO przy rezerwacjach: zawęzić "booking update", żeby najemca mógł tylko anulować,
-- a zmiana statusu na confirmed/completed szła przez salon lub płatność.

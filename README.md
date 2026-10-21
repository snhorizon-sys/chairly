# Chairly

Platforma do wynajmu stanowisk, gabinetów, sal szkoleniowych i przestrzeni na eventy w salonach beauty.

To jest wstępny podgląd na przykładowych danych. Rezerwacje, logowanie i płatności jeszcze nie działają.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Otwórz http://localhost:3000

## Podłączenie Supabase

1. Supabase → **SQL Editor** → New query → wklej `supabase/migrations/0001_schema.sql` → **Run**
2. Nowe zapytanie → wklej `supabase/seed.sql` → **Run** (8 ofert demo)
3. W pliku `.env.local` wpisz Project URL i Publishable key (Project Settings → API Keys)
4. Zatrzymaj `npm run dev` (Ctrl+C) i uruchom ponownie

5. SQL Editor → wklej `supabase/migrations/0002_auth_roles.sql` → **Run** (role i zabezpieczenia kont)
6. Authentication → **URL Configuration**: Site URL `http://localhost:3000`, w Redirect URLs dodaj `http://localhost:3000/**`
7. (na czas developmentu) Authentication → Sign In / Providers → Email → wyłącz **Confirm email**,
   żeby nowe konta logowały się od razu. Darmowy plan wysyła tylko kilka maili na godzinę.

Bez kluczy strona działa na danych przykładowych z `src/data/listings.ts`.
W trybie dev stopka pokazuje, skąd pochodzą dane.

## Baza danych

| Tabela | Co trzyma |
|---|---|
| profiles | użytkownicy (najemca / salon / admin), tworzone automatycznie przy rejestracji |
| salons | salony i ich lokalizacja |
| listings | oferty: stanowisko, sala szkoleniowa, event |
| listing_photos | zdjęcia ofert (ścieżki w Supabase Storage) |
| availability_rules | tygodniowy grafik dostępności |
| availability_blocks | wyjątki: urlop, zamknięte dni |
| bookings | rezerwacje; baza blokuje nakładające się terminy |
| inquiries | zapytania o eventy |
| reviews | opinie w obie strony po zakończonej rezerwacji |
| verifications | dokumenty: certyfikaty, opinia sanepidu |

Widok `listing_cards` łączy ofertę, salon i średnią ocen. Wszystkie tabele mają Row Level Security.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL) przez @supabase/supabase-js
- Fonty: Bricolage Grotesque (nagłówki), Instrument Sans (tekst), wczytywane lokalnie przez @fontsource

## Struktura

```
src/
  app/
    page.tsx              strona główna
    oferty/page.tsx       wyszukiwarka z filtrami
    oferty/[id]/page.tsx  szczegóły oferty i rezerwacja
    dla-salonow/page.tsx  strona dla właścicieli salonów
    logowanie/            logowanie i rejestracja (rola: najemca / salon)
    auth/callback/        link z e-maila potwierdzającego
    panel/                panel salonu: dane salonu, oferty, dodawanie oferty z grafikiem
    konto/                profil użytkownika
  proxy.ts                odświeżanie sesji przy każdym żądaniu
  lib/                    supabase.ts (dane publiczne), supabase-server.ts (sesja), auth.ts, listings.ts
  components/             nagłówek, stopka, karta oferty, pasek dostępności, panel rezerwacji
  data/listings.ts        przykładowe oferty (do zastąpienia bazą danych)
```

## Kolejne kroki

1. ~~Schemat bazy w Supabase~~
2. ~~Logowanie, konta i panel salonu~~
3. Zdjęcia ofert (Supabase Storage) w miejsce kolorowych kafelków
4. Kalendarz dostępności i rezerwacje z blokadą podwójnych terminów w bazie
5. Płatności przez Stripe Connect (BLIK, Przelewy24, karta)

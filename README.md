# Fotelia (nazwa robocza)

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
    dla-salonow/page.tsx  strona dla właścicieli salonów + formularz dodania oferty
  components/             nagłówek, stopka, karta oferty, pasek dostępności, panel rezerwacji
  data/listings.ts        przykładowe oferty (do zastąpienia bazą danych)
```

## Kolejne kroki

1. ~~Schemat bazy w Supabase~~
2. Logowanie (Supabase Auth)
3. Zdjęcia ofert (Supabase Storage) w miejsce kolorowych kafelków
4. Kalendarz dostępności i rezerwacje z blokadą podwójnych terminów w bazie
5. Płatności przez Stripe Connect (BLIK, Przelewy24, karta)

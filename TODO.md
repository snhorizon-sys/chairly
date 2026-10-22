# Do zrobienia

## Zaplanowane

- [ ] **Wybór czasu wynajmu przez najemcę:** godziny, dni, miesiące i dowolna liczba każdej z tych jednostek (np. 3 dni, 2 miesiące). Dziś okienko rezerwacji pozwala wybrać tylko tryb (godziny / dzień / miesiąc) i, dla godzin, ich liczbę.
- [ ] **Mapa w wyszukiwarce:** wybrać kierunek z `Chairly-mapa-propozycje.pdf` (A: suwak godziny, B: dzielnice, C: czas dojazdu). Rekomendacja: A + grupowanie dzielnic z B. Technicznie: MapLibre + MapTiler, współrzędne `lat`/`lng` z adresu salonu.

## Znane braki (ustalone przy pracy nad wyglądem w stylu Airbnb)

- [ ] Zdjęcia ofert i galeria (wymaga Supabase Storage)
- [ ] Prawdziwy zapis rezerwacji z akceptacją lub odrzuceniem przez salon
- [ ] Kalendarz dostępności z zajętymi terminami zamiast zwykłego pola daty
- [ ] Odczyt opinii i gospodarza z bazy (na stronie oferty są na razie dane przykładowe)
- [ ] Wiadomości między najemcą a salonem
- [ ] Ulubione zapisywane na koncie (dziś serduszko działa tylko w przeglądarce)
- [ ] Upload certyfikatów najemców
- [x] Adres salonu publicznie czytelny w bazie: naprawione migracją `0004` (adres, współrzędne i wskazówki dojścia widzi tylko właściciel, admin i najemca z potwierdzoną rezerwacją). Do uruchomienia w Supabase po `0003`
- [ ] Pokazać adres i wskazówki dojścia najemcy po potwierdzeniu rezerwacji w aplikacji: wywołać funkcję `salon_private_details(salon_id)` (gotowa w `0004`). Uwaga: na tabeli `salons` nie robić `select("*")`
- [ ] Mapa a ukryte współrzędne: `0004` ukrywa `lat`/`lng` przed publicznością. Zdecydować: przybliżona lokalizacja na mapie (jak Airbnb, rekomendowane, pasuje do grupowania dzielnic) czy dokładna pinezka (wtedy złagodzić `0004`)
- [ ] Ostrzeżenie Next.js na stronie oferty (`/oferty/[id]`): adres oferty odczytywany poza `<Suspense>`. Strona działa, ale przejście do oferty może być wolniejsze.
- [x] ~~Uruchomić `npm run build` i `npx tsc --noEmit`~~: sprawdzone 22.10, oba przechodzą bez błędów

## Dziennik zmian

### 22.10.2026

**Bigos**
- Nowy wygląd w stylu Airbnb: menu „Stanowiska / Sale szkoleniowe / Eventy”, wyszukiwarka w formie pigułki z czerwonym przyciskiem.
- Strona główna: przewijany rząd „Wolne dziś →” ze strzałkami.
- Karty ofert: większe kafelki, plakietki „Zweryfikowany” i „⚡ Rezerwacja natychmiast”, ocena przy tytule.
- Serduszko „ulubione” na kartach (na razie zapisywane tylko w przeglądarce).
- Strona oferty: nowy układ, zasady potwierdzania i anulowania, panel rezerwacji z notatką dla salonu i akceptacją zasad najmu.
- Ten plik TODO z listą braków.

**SNHorizon + Claude**
- Czytelniejsze godziny dostępności:
  - strona oferty: szerszy pasek z podziałką co godzinę, godziny wpisane w zielone pola, plakietki z wolnymi oknami, legenda „wolne / zajęte lub poza grafikiem”,
  - karty ofert: każde wolne okno jako osobna plakietka (np. `9:00–13:00` `15:00–19:00`).
  - Pliki: `src/components/AvailabilityBar.tsx`, `src/components/ListingCard.tsx`, `src/app/oferty/[id]/page.tsx`.
- Przycisk „Przełącz na konto salonu” na stronie profilu (`/konto`) dla kont najemcy.
- Projekty mapy w wyszukiwarce (3 kierunki + wersja na telefon) w pliku `Chairly-mapa-propozycje.pdf`. Kod mapy jeszcze nie wdrożony.
- Sprawdzenie aktualnej wersji: `tsc` i `npm run build` bez błędów.

**Organizacyjnie**
- Praca przez gałąź `main`: przed pracą `git pull`, po zmianach `git add .`, `git commit -m "…"` i `git push`.
- Zaproszenie Bigosa do organizacji w Supabase (rola Developer lub Administrator).

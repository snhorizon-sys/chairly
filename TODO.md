# Do zrobienia

## Zaplanowane

- [ ] **Wybór czasu wynajmu przez najemcę:** godziny, dni, miesiące i dowolna liczba każdej z tych jednostek (np. 3 dni, 2 miesiące). Dziś okienko rezerwacji pozwala wybrać tylko tryb (godziny / dzień / miesiąc) i, dla godzin, ich liczbę.

## Znane braki (ustalone przy pracy nad wyglądem w stylu Airbnb)

- [ ] Zdjęcia ofert i galeria (wymaga Supabase Storage)
- [ ] Prawdziwy zapis rezerwacji z akceptacją lub odrzuceniem przez salon
- [ ] Kalendarz dostępności z zajętymi terminami zamiast zwykłego pola daty
- [ ] Odczyt opinii i gospodarza z bazy (na stronie oferty są na razie dane przykładowe)
- [ ] Mapa w wyszukiwarce
- [ ] Wiadomości między najemcą a salonem
- [ ] Ulubione zapisywane na koncie (dziś serduszko działa tylko w przeglądarce)
- [ ] Upload certyfikatów najemców
- [ ] Adres salonu jest publicznie czytelny w bazie (polityka RLS na tabeli `salons`), mimo że formularz obiecuje pokazanie go po potwierdzeniu rezerwacji
- [ ] Uruchomić `npm run build` i `npx tsc --noEmit`, bo ostatnie zmiany nie przeszły tych sprawdzeń

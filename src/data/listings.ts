// Przykładowe dane do podglądu. Docelowo zastąpione zapytaniami do bazy (Supabase).

export type ListingType = "stanowisko" | "sala" | "event";

export type Listing = {
  id: string;
  type: ListingType;
  title: string;
  salon: string;
  city: string;
  district: string;
  specialties: string[];
  priceHour?: number;
  priceDay?: number;
  priceMonth?: number;
  capacity?: number;
  rating: number;
  reviews: number;
  equipment: string[];
  included: string[];
  description: string;
  // wolne okna w najbliższym dniu, godziny 8–20
  freeToday: [number, number][];
  verified: boolean;
  tone: string; // kolor kafelka zastępujący zdjęcie w podglądzie
  // zasady i szczegóły (opcjonalne, dane przykładowe ich nie mają)
  confirmation?: ConfirmationMode;
  cancellation?: CancellationPolicy;
  minHours?: number;
  deposit?: number;
  noticeDays?: number;
  rules?: string[];
  requirements?: string[];
  requiresInsurance?: boolean;
  amenities?: string[];
  layouts?: string[];
  cateringAllowed?: boolean;
  setupInfo?: string;
  floor?: string;
  hasElevator?: boolean;
  parking?: string;
  host?: Host;
  reviewList?: Review[];
};

export type Host = {
  name: string;
  since: number; // rok dołączenia
  bio: string;
  responseTime: string;
  verified: boolean;
};

export type Review = {
  author: string;
  role: string;
  date: string;
  rating: number;
  text: string;
};

export type ConfirmationMode = "instant" | "manual";
export type CancellationPolicy = "flexible" | "moderate" | "strict";

export const CONFIRMATION_LABEL: Record<ConfirmationMode, string> = {
  instant: "Rezerwacja natychmiast",
  manual: "Salon potwierdza rezerwację",
};

export const CANCELLATION_LABEL: Record<CancellationPolicy, string> = {
  flexible: "Elastyczne: bezpłatne anulowanie do 24 godzin przed",
  moderate: "Umiarkowane: bezpłatne anulowanie do 3 dni przed",
  strict: "Rygorystyczne: bezpłatne anulowanie do 7 dni przed",
};

export const AMENITIES = [
  "Szatnia",
  "Kuchnia / aneks",
  "Wi-Fi",
  "Recepcja",
  "Strefa oczekiwania",
  "Toaleta dla klientów",
  "Klimatyzacja",
  "Pochłaniacz / wentylacja",
];

export const LAYOUTS = ["Teatralny", "Warsztatowy (stoły)", "Kino", "Bankietowy", "Wolna aranżacja"];

export const TYPE_LABEL: Record<ListingType, string> = {
  stanowisko: "Stanowisko lub gabinet",
  sala: "Sala szkoleniowa",
  event: "Przestrzeń na event",
};

export const SPECIALTIES = [
  "Fryzjerstwo",
  "Barber",
  "Paznokcie",
  "Kosmetologia",
  "Rzęsy i brwi",
  "Makijaż permanentny",
  "Masaż",
  "Makijaż",
];

export const sampleListings: Listing[] = [
  {
    id: "fotel-jezyce",
    type: "stanowisko",
    title: "Fotel fryzjerski przy oknie",
    salon: "Studio Lustro",
    city: "Poznań",
    district: "Jeżyce",
    specialties: ["Fryzjerstwo"],
    priceHour: 35,
    priceDay: 220,
    priceMonth: 1900,
    rating: 4.9,
    reviews: 38,
    equipment: ["Fotel hydrauliczny", "Myjka z masażem", "Suszarka i prostownica", "Lustro z oświetleniem LED"],
    included: ["Media", "Ręczniki i pranie", "Recepcja", "Kawa dla klientek"],
    description:
      "Jasne stanowisko w kameralnym salonie na Jeżycach. Dwie myjki na trzy fotele, własna szafka na kosmetyki, parking dla klientek w podwórzu.",
    freeToday: [[9, 13], [15, 19]],
    verified: true,
    tone: "#E7D9DC",
    confirmation: "instant",
    cancellation: "flexible",
    minHours: 2,
    deposit: 200,
    noticeDays: 30,
    rules: ["Sprzątanie stanowiska po pracy", "Własne kosmetyki i narzędzia", "Bez zapachowych produktów w trakcie wizyt innych osób"],
    requirements: ["Certyfikat lub dyplom fryzjerski", "Własna baza klientów"],
    requiresInsurance: true,
    amenities: ["Wi-Fi", "Recepcja", "Strefa oczekiwania", "Toaleta dla klientów"],
    floor: "Parter",
    hasElevator: false,
    parking: "Bezpłatny w podwórzu",
    host: {"name": "Karolina", "since": 2023, "bio": "Prowadzę salon od ośmiu lat. Szukam spokojnych, odpowiedzialnych osób, które cenią dobrą atmosferę w pracy.", "responseTime": "Odpowiada zwykle w ciągu godziny", "verified": true},
    reviewList: [{"author": "Marta", "role": "Fryzjerka", "date": "wrzesień 2026", "rating": 5, "text": "Czyste stanowisko, świetne światło i bardzo miła obsługa. Wracam co tydzień."}, {"author": "Paweł", "role": "Koloryst", "date": "sierpień 2026", "rating": 5, "text": "Wszystko zgodne z opisem, szybka odpowiedź na wiadomości."}, {"author": "Ola", "role": "Fryzjerka", "date": "lipiec 2026", "rating": 4, "text": "Dobra lokalizacja, czasem trochę głośno przy recepcji."}],
  },
  {
    id: "gabinet-kosmetologiczny-wilda",
    type: "stanowisko",
    title: "Gabinet kosmetologiczny z łóżkiem",
    salon: "Skin Room",
    city: "Poznań",
    district: "Wilda",
    specialties: ["Kosmetologia", "Rzęsy i brwi"],
    priceHour: 45,
    priceDay: 280,
    rating: 4.8,
    reviews: 21,
    equipment: ["Łóżko elektryczne", "Lampa lupa", "Autoklaw", "Wózek kosmetyczny"],
    included: ["Media", "Sterylizacja narzędzi", "Jednorazowe podkłady"],
    description:
      "Zamykany gabinet z umywalką i wentylacją, spełnia wymogi sanitarne do zabiegów z naruszeniem ciągłości skóry.",
    freeToday: [[12, 18]],
    verified: true,
    tone: "#D9E3DF",
    confirmation: "manual",
    cancellation: "moderate",
    minHours: 3,
    deposit: 300,
    noticeDays: 30,
    rules: ["Dezynfekcja gabinetu po każdym kliencie", "Dokumentacja zabiegów prowadzona przez najemcę"],
    requirements: ["Dyplom kosmetologa", "Aktualne szkolenia BHP"],
    requiresInsurance: true,
    amenities: ["Klimatyzacja", "Pochłaniacz / wentylacja", "Szatnia", "Wi-Fi"],
    floor: "1. piętro",
    hasElevator: true,
    parking: "Strefa płatna przed budynkiem",
    host: {"name": "Anna", "since": 2022, "bio": "Kosmetolog z dziesięcioletnim doświadczeniem. Gabinet spełnia wymogi sanitarne do zabiegów inwazyjnych.", "responseTime": "Odpowiada zwykle w ciągu kilku godzin", "verified": true},
    reviewList: [{"author": "Natalia", "role": "Stylistka brwi", "date": "październik 2026", "rating": 5, "text": "Idealny gabinet do pracy, autoklaw zawsze gotowy."}, {"author": "Kasia", "role": "Kosmetolog", "date": "wrzesień 2026", "rating": 5, "text": "Bardzo profesjonalnie. Gospodyni jasno określa zasady."}],
  },
  {
    id: "stanowisko-nails-stare-miasto",
    type: "stanowisko",
    title: "Stanowisko do stylizacji paznokci",
    salon: "Nail Bar Rynek",
    city: "Poznań",
    district: "Stare Miasto",
    specialties: ["Paznokcie"],
    priceHour: 25,
    priceDay: 150,
    priceMonth: 1200,
    rating: 4.6,
    reviews: 54,
    equipment: ["Biurko z pochłaniaczem", "Frezarka", "Lampa UV/LED", "Fotel klientki"],
    included: ["Media", "Recepcja", "Wspólna strefa oczekiwania"],
    description:
      "Jedno z pięciu stanowisk w lokalu przy Starym Rynku. Duży ruch przechodni i własny profil salonu w systemie rezerwacji.",
    freeToday: [[8, 11], [14, 16], [18, 20]],
    verified: false,
    tone: "#E9E1D2",
    confirmation: "instant",
    cancellation: "flexible",
    minHours: 1,
    noticeDays: 14,
    rules: ["Odkurzanie stanowiska po pracy", "Własne frezy i pilniki"],
    requirements: ["Własne narzędzia"],
    requiresInsurance: false,
    amenities: ["Recepcja", "Strefa oczekiwania", "Wi-Fi"],
    floor: "Parter",
    hasElevator: true,
    parking: "Parking miejski w pobliżu",
    host: {"name": "Studio Nail Bar", "since": 2024, "bio": "Pięć stanowisk w sercu Starego Miasta, duży ruch klientek i profil salonu w mediach społecznościowych.", "responseTime": "Odpowiada zwykle w ciągu dnia", "verified": false},
    reviewList: [{"author": "Dominika", "role": "Stylistka paznokci", "date": "wrzesień 2026", "rating": 5, "text": "Dużo klientek z ulicy, dobrze przygotowane stanowisko."}, {"author": "Ewelina", "role": "Stylistka paznokci", "date": "sierpień 2026", "rating": 4, "text": "Super lokalizacja, trochę ciasno przy pełnym obłożeniu."}],
  },
  {
    id: "barber-grunwald",
    type: "stanowisko",
    title: "Fotel barberski",
    salon: "Grunwald Barbers",
    city: "Poznań",
    district: "Grunwald",
    specialties: ["Barber"],
    priceDay: 180,
    priceMonth: 1600,
    rating: 4.7,
    reviews: 17,
    equipment: ["Fotel barberski Takara", "Myjka", "Sterylizator UV"],
    included: ["Media", "Muzyka i Wi-Fi", "Ręczniki"],
    description: "Fotel na stałe lub dniówki w piątki i soboty. Właściciel szuka osoby z własną bazą klientów.",
    freeToday: [],
    verified: true,
    tone: "#D8DCE6",
    confirmation: "manual",
    cancellation: "strict",
    minHours: 4,
    deposit: 400,
    noticeDays: 30,
    rules: ["Dyskrecja wobec klientów salonu", "Zachowanie porządku w strefie myjek"],
    requirements: ["Własna baza klientów", "Referencje z poprzedniego miejsca pracy"],
    requiresInsurance: true,
    amenities: ["Wi-Fi", "Strefa oczekiwania", "Klimatyzacja"],
    floor: "Parter",
    hasElevator: false,
    parking: "Parking przed lokalem",
    host: {"name": "Tomek", "since": 2021, "bio": "Właściciel barbershopu. Stawiam na dobrą muzykę i zgrany zespół.", "responseTime": "Odpowiada zwykle w ciągu godziny", "verified": true},
    reviewList: [{"author": "Bartek", "role": "Barber", "date": "wrzesień 2026", "rating": 5, "text": "Świetna ekipa, sprzęt na wysokim poziomie."}, {"author": "Michał", "role": "Barber", "date": "czerwiec 2026", "rating": 4, "text": "Dobre miejsce na dniówki w weekendy."}],
  },
  {
    id: "sala-szkoleniowa-centrum",
    type: "sala",
    title: "Sala szkoleniowa na 12 osób",
    salon: "Akademia Forma",
    city: "Poznań",
    district: "Centrum",
    specialties: ["Paznokcie", "Rzęsy i brwi", "Makijaż"],
    priceDay: 900,
    capacity: 12,
    rating: 5.0,
    reviews: 9,
    equipment: ["6 stanowisk z lampami", "2 łóżka dla modelek", "Rzutnik i ekran", "Statyw i oświetlenie do nagrań"],
    included: ["Kawa i woda", "Szatnia", "Pomoc przy rekrutacji modelek"],
    description:
      "Przestrzeń przygotowana pod szkolenia praktyczne. Można rozłożyć stanowiska w podkowę lub w rzędach.",
    freeToday: [[8, 20]],
    verified: true,
    tone: "#E3DCEA",
    confirmation: "manual",
    cancellation: "moderate",
    minHours: 4,
    deposit: 500,
    rules: ["Zakaz używania sprzętu bez wcześniejszego instruktażu", "Sprzątanie po szkoleniu w cenie"],
    requirements: ["Opis programu szkolenia", "Ubezpieczenie OC organizatora"],
    requiresInsurance: true,
    amenities: ["Klimatyzacja", "Wi-Fi", "Szatnia", "Kuchnia / aneks", "Toaleta dla klientów"],
    floor: "2. piętro",
    hasElevator: true,
    parking: "Parking podziemny w budynku",
    layouts: ["Warsztatowy (stoły)", "Teatralny", "Wolna aranżacja"],
    cateringAllowed: true,
    setupInfo: "Wstęp na godzinę przed szkoleniem, demontaż do 30 minut po zakończeniu.",
    host: {"name": "Akademia Forma", "since": 2022, "bio": "Akademia szkoleniowa dla branży beauty. Pomagamy w organizacji wydarzeń i rekrutacji modelek.", "responseTime": "Odpowiada zwykle w ciągu godziny", "verified": true},
    reviewList: [{"author": "Agnieszka", "role": "Trenerka", "date": "październik 2026", "rating": 5, "text": "Sala idealnie przygotowana, uczestniczki były zachwycone."}, {"author": "Justyna", "role": "Organizatorka kursów", "date": "wrzesień 2026", "rating": 5, "text": "Profesjonalna obsługa i dobry dojazd."}],
  },
  {
    id: "event-loft-garbary",
    type: "event",
    title: "Loft na pokazy i premiery",
    salon: "Garbary Loft",
    city: "Poznań",
    district: "Garbary",
    specialties: ["Makijaż", "Fryzjerstwo"],
    priceDay: 2500,
    capacity: 60,
    rating: 4.9,
    reviews: 6,
    equipment: ["Wybieg", "Nagłośnienie", "Ścianka do zdjęć", "Zaplecze dla modelek"],
    included: ["Sprzątanie", "Ochrona", "Możliwość cateringu"],
    description: "Industrialne wnętrze na premiery marek, pokazy fryzjerskie i sesje zdjęciowe. Wycena indywidualna przy większych wydarzeniach.",
    freeToday: [],
    verified: true,
    tone: "#DDE2D6",
    confirmation: "manual",
    cancellation: "strict",
    minHours: 6,
    deposit: 1500,
    rules: ["Cisza nocna po 22:00", "Zakaz używania konfetti i brokatu"],
    requirements: ["Opis wydarzenia i planu godzinowego", "Ubezpieczenie OC organizatora"],
    requiresInsurance: true,
    amenities: ["Wi-Fi", "Szatnia", "Kuchnia / aneks", "Klimatyzacja", "Toaleta dla klientów"],
    floor: "Parter",
    hasElevator: true,
    parking: "Parking dla gości przy budynku",
    layouts: ["Kino", "Bankietowy", "Wolna aranżacja"],
    cateringAllowed: true,
    setupInfo: "Montaż dzień wcześniej po uzgodnieniu, demontaż do 3 godzin po wydarzeniu.",
    host: {"name": "Garbary Loft", "since": 2023, "bio": "Przestrzeń na premiery, pokazy i sesje. Pomagamy z techniką i ochroną.", "responseTime": "Odpowiada zwykle w ciągu dnia", "verified": true},
    reviewList: [{"author": "Marcelina", "role": "Organizatorka pokazu", "date": "wrzesień 2026", "rating": 5, "text": "Fantastyczna przestrzeń, obsługa techniczna bardzo pomocna."}, {"author": "Piotr", "role": "Fotograf", "date": "sierpień 2026", "rating": 5, "text": "Dużo światła i elastyczna aranżacja."}],
  },
  {
    id: "pmu-warszawa-mokotow",
    type: "stanowisko",
    title: "Gabinet do makijażu permanentnego",
    salon: "Brow Atelier",
    city: "Warszawa",
    district: "Mokotów",
    specialties: ["Makijaż permanentny", "Rzęsy i brwi"],
    priceHour: 60,
    priceDay: 380,
    rating: 4.8,
    reviews: 29,
    equipment: ["Łóżko elektryczne", "Lampa bezcieniowa", "Autoklaw klasy B"],
    included: ["Media", "Sterylizacja", "Recepcja"],
    description: "Gabinet z pozytywną opinią sanepidu, dostępny w poniedziałki i środy.",
    freeToday: [[10, 16]],
    verified: true,
    tone: "#EADBD3",
    confirmation: "manual",
    cancellation: "moderate",
    minHours: 3,
    deposit: 300,
    noticeDays: 30,
    rules: ["Dezynfekcja po każdym kliencie", "Wyłącznie zabiegi zgodne z zakresem kwalifikacji najemcy"],
    requirements: ["Certyfikat makijażu permanentnego", "Aktualne badania sanitarne"],
    requiresInsurance: true,
    amenities: ["Klimatyzacja", "Wi-Fi", "Recepcja", "Pochłaniacz / wentylacja"],
    floor: "3. piętro",
    hasElevator: true,
    parking: "Strefa płatna w okolicy",
    host: {"name": "Brow Atelier", "since": 2022, "bio": "Pracownia brwi i makijażu permanentnego z pozytywną opinią sanepidu.", "responseTime": "Odpowiada zwykle w ciągu kilku godzin", "verified": true},
    reviewList: [{"author": "Weronika", "role": "Linergistka", "date": "październik 2026", "rating": 5, "text": "Czysty gabinet z całym potrzebnym sprzętem."}, {"author": "Alicja", "role": "Linergistka", "date": "wrzesień 2026", "rating": 5, "text": "Polecam, bardzo uczciwe zasady współpracy."}],
  },
  {
    id: "masaz-wroclaw",
    type: "stanowisko",
    title: "Pokój do masażu",
    salon: "Oaza Body",
    city: "Wrocław",
    district: "Krzyki",
    specialties: ["Masaż"],
    priceHour: 40,
    priceMonth: 1500,
    rating: 4.5,
    reviews: 12,
    equipment: ["Stół do masażu", "Podgrzewacz ręczników", "Głośnik"],
    included: ["Media", "Pranie", "Prysznic dla klientów"],
    description: "Wyciszony pokój z regulowanym oświetleniem. Najlepiej sprawdzi się przy stałej współpracy.",
    freeToday: [[16, 20]],
    verified: false,
    tone: "#D6E0E3",
    confirmation: "instant",
    cancellation: "flexible",
    minHours: 2,
    noticeDays: 14,
    rules: ["Cisza w korytarzu", "Wietrzenie pokoju po każdym kliencie"],
    requirements: ["Dyplom masażysty lub certyfikat"],
    requiresInsurance: false,
    amenities: ["Szatnia", "Wi-Fi", "Toaleta dla klientów"],
    floor: "1. piętro",
    hasElevator: false,
    parking: "Bezpłatny parking przy ulicy",
    host: {"name": "Oaza Body", "since": 2024, "bio": "Kameralne studio masażu. Cenimy spokój i wzajemny szacunek.", "responseTime": "Odpowiada zwykle w ciągu dnia", "verified": false},
    reviewList: [{"author": "Iwona", "role": "Masażystka", "date": "wrzesień 2026", "rating": 5, "text": "Cichy pokój, miły klimat."}, {"author": "Rafał", "role": "Fizjoterapeuta", "date": "sierpień 2026", "rating": 4, "text": "Dobra cena, trochę brakuje miejsca na przechowywanie rzeczy."}],
  },
];

export function priceLabel(l: Listing) {
  if (l.priceHour) return { value: l.priceHour, unit: "zł / godz." };
  if (l.priceDay) return { value: l.priceDay, unit: "zł / dzień" };
  return { value: l.priceMonth ?? 0, unit: "zł / mies." };
}

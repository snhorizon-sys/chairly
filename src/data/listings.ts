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
};

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
  },
];

export function priceLabel(l: Listing) {
  if (l.priceHour) return { value: l.priceHour, unit: "zł / godz." };
  if (l.priceDay) return { value: l.priceDay, unit: "zł / dzień" };
  return { value: l.priceMonth ?? 0, unit: "zł / mies." };
}

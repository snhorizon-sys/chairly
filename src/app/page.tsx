import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { ListingCard } from "@/components/ListingCard";
import { ScrollRow } from "@/components/ScrollRow";
import { TYPE_LABEL, type Listing, type ListingType } from "@/data/listings";
import { getListings } from "@/lib/listings";

const TYPES: { type: ListingType; text: string }[] = [
  {
    type: "stanowisko",
    text: "Fotel, biurko do paznokci albo zamykany gabinet. Na godziny, dniówki lub na stałe z umową najmu.",
  },
  {
    type: "sala",
    text: "Sale ze stanowiskami i łóżkami dla modelek, rzutnikiem i światłem do nagrań. Na jeden dzień lub cykl szkoleń.",
  },
  {
    type: "event",
    text: "Lofty i salony po godzinach na premiery marek, pokazy fryzjerskie i sesje zdjęciowe.",
  },
];

function ofertLabel(n: number) {
  if (n === 1) return "1 oferta";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return `${n} oferty`;
  return `${n} ofert`;
}

const rowItem = "w-[15.5rem] shrink-0 snap-start sm:w-[17rem]";

export default async function Home() {
  const listings = await getListings();
  const freeToday = listings.filter((l) => l.freeToday.length > 0);

  // Miasta od tego z największą liczbą ofert
  const byCity = new Map<string, Listing[]>();
  for (const l of listings) byCity.set(l.city, [...(byCity.get(l.city) ?? []), l]);
  const cities = Array.from(byCity.entries()).sort((a, b) => b[1].length - a[1].length);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 text-center sm:px-6 sm:pt-14">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-[1.1] sm:text-5xl">
          Fotel na dziś, gabinet na miesiąc, sala na szkolenie.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted sm:text-lg">
          Salony beauty wynajmują tu wolne stanowiska, a fryzjerki, kosmetolożki i stylistki znajdują miejsce do pracy
          bez zakładania własnego lokalu.
        </p>
        <div className="mt-8">
          <SearchForm />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {freeToday.length > 0 && (
          <ScrollRow title="Wolne dziś" href="/oferty?dzis=1">
            {freeToday.map((l) => (
              <div key={l.id} className={rowItem}>
                <ListingCard listing={l} />
              </div>
            ))}
          </ScrollRow>
        )}
        {cities.map(([city, items]) => (
          <ScrollRow key={city} title={`Popularne w: ${city}`} href={`/oferty?miasto=${encodeURIComponent(city)}`}>
            {items.map((l) => (
              <div key={l.id} className={rowItem}>
                <ListingCard listing={l} />
              </div>
            ))}
          </ScrollRow>
        ))}
      </div>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Co można wynająć</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {TYPES.map(({ type, text }) => (
            <Link key={type} href={`/oferty?typ=${type}`} className="bg-paper p-6 hover:bg-porcelain/60">
              <h3 className="text-xl font-semibold">{TYPE_LABEL[type]}</h3>
              <p className="mt-2 text-muted">{text}</p>
              <p className="mt-4 text-sm font-medium">
                {ofertLabel(listings.filter((l) => l.type === type).length)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">Szukasz miejsca do pracy</h2>
          <ol className="mt-6 space-y-5">
            {[
              ["Znajdź stanowisko", "Filtruj po mieście, specjalizacji, wyposażeniu i wolnych godzinach."],
              ["Zarezerwuj i zapłać", "BLIK, karta lub przelew. Salon dostaje pieniądze po Twojej wizycie."],
              ["Przyjmij klientki", "Umowa najmu generuje się automatycznie, a terminy masz w kalendarzu."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-paper">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-3xl bg-ink p-8 text-paper">
          <h2 className="text-2xl font-bold">Masz wolny fotel?</h2>
          <p className="mt-3 text-paper/75">
            Pusty fotel w poniedziałek to stracony przychód. Dodaj stanowisko, ustaw godziny i cenę, a my znajdziemy
            najemcę. Płacisz tylko prowizję od opłaconych rezerwacji.
          </p>
          <Link
            href="/dla-salonow"
            className="mt-6 inline-block rounded-full bg-lacquer px-5 py-3 font-medium hover:bg-lacquer-dark"
          >
            Dodaj swój salon
          </Link>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { ListingCard } from "@/components/ListingCard";
import { TYPE_LABEL, type ListingType } from "@/data/listings";
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

export default async function Home() {
  const listings = await getListings();
  const today = listings.filter((l) => l.city === "Poznań" && l.freeToday.length > 0).slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
          Fotel na dziś, gabinet na miesiąc, sala na szkolenie.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Salony beauty wynajmują tu wolne stanowiska, a fryzjerki, kosmetolożki i stylistki znajdują miejsce do pracy
          bez zakładania własnego lokalu.
        </p>
        <div className="mt-8">
          <SearchForm />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Wolne dziś w Poznaniu</h2>
          <Link href="/oferty?miasto=Poznań" className="text-sm font-medium underline underline-offset-4">
            Wszystkie oferty
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {today.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

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

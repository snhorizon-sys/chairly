import Link from "next/link";
import { notFound } from "next/navigation";
import { TYPE_LABEL } from "@/data/listings";
import { getListing, getListings } from "@/lib/listings";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { BookingBox } from "@/components/BookingBox";

export async function generateStaticParams() {
  const listings = await getListings();
  return listings.map((l) => ({ id: l.id }));
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = await getListing(id);
  if (!l) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/oferty" className="text-sm text-muted underline underline-offset-4">
        Wróć do wyników
      </Link>

      <div className="mt-4 grid gap-2 sm:grid-cols-[2fr_1fr] sm:grid-rows-2">
        <div className="aspect-[16/10] rounded-2xl sm:row-span-2 sm:aspect-auto" style={{ background: l.tone }} />
        <div className="hidden aspect-[4/3] rounded-2xl sm:block" style={{ background: l.tone, filter: "brightness(0.96)" }} />
        <div className="hidden aspect-[4/3] rounded-2xl sm:block" style={{ background: l.tone, filter: "brightness(0.92)" }} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm text-muted">{TYPE_LABEL[l.type]}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{l.title}</h1>
          <p className="mt-2 text-muted">
            {l.salon}, {l.district}, {l.city} ·{" "}
            {l.reviews > 0 ? `★ ${l.rating.toFixed(1)} (${l.reviews} opinii)` : "nowa oferta"}
            {l.verified && " · salon zweryfikowany"}
          </p>

          <p className="mt-6 max-w-prose text-lg">{l.description}</p>

          {l.capacity && (
            <p className="mt-4 font-medium">Do {l.capacity} osób</p>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold">Dostępność dziś</h2>
            <div className="mt-3 max-w-md">
              <AvailabilityBar free={l.freeToday} />
            </div>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">Wyposażenie</h2>
              <ul className="mt-3 space-y-2">
                {l.equipment.map((e) => (
                  <li key={e} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold">W cenie</h2>
              <ul className="mt-3 space-y-2">
                {l.included.map((e) => (
                  <li key={e} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lacquer" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-paper p-5">
            <h2 className="font-bold">Umowa najmu stanowiska</h2>
            <p className="mt-1 text-muted">
              Po rezerwacji obie strony dostają wzór umowy z danymi z profili. Przy najmie miesięcznym umowa jest
              wymagana.
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <BookingBox listing={l} />
        </div>
      </div>
    </div>
  );
}

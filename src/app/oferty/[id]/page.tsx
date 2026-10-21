import Link from "next/link";
import { notFound } from "next/navigation";
import { CANCELLATION_LABEL, CONFIRMATION_LABEL, TYPE_LABEL } from "@/data/listings";
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

          {l.amenities && l.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Udogodnienia</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {l.amenities.map((a) => (
                  <li key={a} className="rounded-full border border-line px-3 py-1.5 text-sm">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {l.type !== "stanowisko" && Boolean(l.layouts?.length || l.cateringAllowed != null || l.setupInfo) && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Sala i event</h2>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                {l.layouts && l.layouts.length > 0 && (
                  <div>
                    <dt className="text-muted">Układy sali</dt>
                    <dd>{l.layouts.join(", ")}</dd>
                  </div>
                )}
                {l.cateringAllowed != null && (
                  <div>
                    <dt className="text-muted">Własny catering</dt>
                    <dd>{l.cateringAllowed ? "Dozwolony" : "Niedozwolony"}</dd>
                  </div>
                )}
                {l.setupInfo && (
                  <div className="sm:col-span-2">
                    <dt className="text-muted">Montaż i demontaż</dt>
                    <dd>{l.setupInfo}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {(l.confirmation || l.cancellation) && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Zasady najmu</h2>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                {l.confirmation && (
                  <div>
                    <dt className="text-muted">Potwierdzanie</dt>
                    <dd>{CONFIRMATION_LABEL[l.confirmation]}</dd>
                  </div>
                )}
                {l.cancellation && (
                  <div>
                    <dt className="text-muted">Anulowanie</dt>
                    <dd>{CANCELLATION_LABEL[l.cancellation]}</dd>
                  </div>
                )}
                {l.minHours != null && l.minHours > 1 && (
                  <div>
                    <dt className="text-muted">Minimalny czas rezerwacji</dt>
                    <dd>{l.minHours} godz.</dd>
                  </div>
                )}
                {l.deposit != null && (
                  <div>
                    <dt className="text-muted">Kaucja</dt>
                    <dd>{l.deposit.toLocaleString("pl-PL")} zł</dd>
                  </div>
                )}
                {l.noticeDays != null && l.priceMonth != null && (
                  <div>
                    <dt className="text-muted">Wypowiedzenie przy najmie miesięcznym</dt>
                    <dd>{l.noticeDays} dni</dd>
                  </div>
                )}
              </dl>

              {l.rules && l.rules.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-semibold">Zasady korzystania</h3>
                  <ul className="mt-2 space-y-2">
                    {l.rules.map((r) => (
                      <li key={r} className="flex gap-2">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {((l.requirements && l.requirements.length > 0) || l.requiresInsurance) && (
                <div className="mt-5">
                  <h3 className="font-semibold">Wymagania wobec najemcy</h3>
                  <ul className="mt-2 space-y-2">
                    {l.requiresInsurance && (
                      <li className="flex gap-2">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                        Ubezpieczenie OC
                      </li>
                    )}
                    {l.requirements?.map((r) => (
                      <li key={r} className="flex gap-2">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {(l.floor || l.hasElevator != null || l.parking) && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Lokalizacja</h2>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                {l.floor && (
                  <div>
                    <dt className="text-muted">Piętro</dt>
                    <dd>{l.floor}</dd>
                  </div>
                )}
                {l.hasElevator != null && (
                  <div>
                    <dt className="text-muted">Winda</dt>
                    <dd>{l.hasElevator ? "Jest" : "Brak"}</dd>
                  </div>
                )}
                {l.parking && (
                  <div className="sm:col-span-2">
                    <dt className="text-muted">Parking</dt>
                    <dd>{l.parking}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 text-sm text-muted">Dokładny adres i wskazówki dojścia dostaniesz po potwierdzeniu rezerwacji.</p>
            </div>
          )}

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

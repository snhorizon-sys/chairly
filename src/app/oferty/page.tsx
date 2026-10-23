import Link from "next/link";
import { Suspense } from "react";
import { ListingCard } from "@/components/ListingCard";
import { AMENITIES, SPECIALTIES, TYPE_LABEL, priceLabel, type ListingType } from "@/data/listings";
import { MapExplorer } from "@/components/map/MapExplorer";
import type { MapPoint } from "@/components/map/types";
import { getListings } from "@/lib/listings";

type Params = Promise<{
  miasto?: string;
  typ?: string;
  specjalizacja?: string;
  dzis?: string;
  natychmiast?: string;
  udogodnienie?: string;
  widok?: string;
}>;

type Query = Record<string, string | undefined>;

/** Adres /oferty z tymi samymi filtrami i innym widokiem */
function viewHref(q: Query, widok: "lista" | "mapa") {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v && k !== "widok") sp.set(k, v);
  if (widok === "mapa") sp.set("widok", "mapa");
  const qs = sp.toString();
  return qs ? `/oferty?${qs}` : "/oferty";
}

function ViewToggle({ q, current }: { q: Query; current: "lista" | "mapa" }) {
  const item = (v: "lista" | "mapa", label: string) => (
    <Link
      href={viewHref(q, v)}
      aria-current={current === v ? "page" : undefined}
      className={`rounded-full px-4 py-2 ${current === v ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
    >
      {label}
    </Link>
  );
  return (
    <nav aria-label="Widok wyników" className="flex rounded-full bg-porcelain p-1 text-sm font-semibold">
      {item("lista", "Lista")}
      {item("mapa", "Mapa")}
    </nav>
  );
}

export default function OffersPage({ searchParams }: { searchParams: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 text-muted sm:px-6">Ładowanie ofert…</div>}>
      <Offers searchParams={searchParams} />
    </Suspense>
  );
}

async function Offers({ searchParams }: { searchParams: Params }) {
  const query = await searchParams;
  const { miasto = "", typ = "", specjalizacja = "", dzis, natychmiast, udogodnienie = "", widok } = query;
  const listings = await getListings();
  const CITIES = Array.from(new Set(listings.map((l) => l.city))).sort((a, b) => a.localeCompare(b, "pl"));

  const results = listings.filter(
    (l) =>
      (!miasto || l.city.toLowerCase() === miasto.toLowerCase()) &&
      (!typ || l.type === typ) &&
      (!specjalizacja || l.specialties.includes(specjalizacja)) &&
      (!dzis || l.freeToday.length > 0) &&
      (!natychmiast || l.confirmation === "instant") &&
      (!udogodnienie || (l.amenities ?? []).includes(udogodnienie)),
  );

  const heading = (
    <>
      {typ ? TYPE_LABEL[typ as ListingType] : "Wszystkie miejsca"}
      {miasto && <span className="text-muted">, {miasto}</span>}
    </>
  );

  if (widok === "mapa") {
    const points: MapPoint[] = results
      .filter((l) => l.lat != null && l.lng != null)
      .map((l) => {
        const p = priceLabel(l);
        return {
          id: l.id,
          title: l.title,
          salon: l.salon,
          place: l.district || l.city,
          typeLabel: TYPE_LABEL[l.type],
          lat: l.lat!,
          lng: l.lng!,
          freeToday: l.freeToday,
          priceShort: `${p.value} ${p.unit.replace(" / godz.", "/h").replace(" / dzień", "/dzień").replace(" / mies.", "/mc")}`,
          tone: l.tone,
          rating: l.rating,
          reviews: l.reviews,
        };
      });
    return (
      <div className="flex flex-col lg:h-[calc(100dvh-61px)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-xl font-bold">{heading}</h1>
            <Link href={viewHref(query, "lista")} className="text-sm text-muted underline underline-offset-4">
              Zmień filtry
            </Link>
          </div>
          <ViewToggle q={query} current="mapa" />
        </div>
        {points.length === 0 ? (
          <div className="mx-auto max-w-xl p-10 text-center">
            <p className="font-semibold">Brak ofert z lokalizacją dla tych filtrów.</p>
            <p className="mt-1 text-muted">Zmień miasto lub filtry albo wróć do widoku listy.</p>
          </div>
        ) : (
          <MapExplorer key={JSON.stringify(query)} points={points} withoutLocation={results.length - points.length} />
        )}
      </div>
    );
  }

  const select = "w-full rounded-lg border border-line bg-paper px-3 py-2.5 outline-none focus:border-ink";

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr]">
      <aside>
        <form className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5 lg:sticky lg:top-6">
          <h2 className="text-lg font-bold">Filtry</h2>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Miasto</span>
            <select name="miasto" defaultValue={miasto} className={select}>
              <option value="">Wszystkie</option>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Rodzaj miejsca</span>
            <select name="typ" defaultValue={typ} className={select}>
              <option value="">Wszystkie</option>
              {Object.entries(TYPE_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Specjalizacja</span>
            <select name="specjalizacja" defaultValue={specjalizacja} className={select}>
              <option value="">Dowolna</option>
              {SPECIALTIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Udogodnienie</span>
            <select name="udogodnienie" defaultValue={udogodnienie} className={select}>
              <option value="">Dowolne</option>
              {AMENITIES.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="natychmiast"
              value="1"
              defaultChecked={!!natychmiast}
              className="h-4 w-4 accent-lacquer"
            />
            Rezerwacja natychmiast
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="dzis" value="1" defaultChecked={!!dzis} className="h-4 w-4 accent-lacquer" />
            Tylko wolne dziś
          </label>
          <button className="rounded-lg bg-ink px-4 py-2.5 font-medium text-paper hover:bg-ink/85">Pokaż oferty</button>
          <Link href="/oferty" className="text-center text-sm text-muted underline underline-offset-4">
            Wyczyść filtry
          </Link>
        </form>
      </aside>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">{heading}</h1>
          <ViewToggle q={query} current="lista" />
        </div>
        <p className="mt-1 text-muted">
          {results.length} {results.length === 1 ? "oferta" : results.length < 5 && results.length > 1 ? "oferty" : "ofert"}
        </p>

        {results.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper p-10 text-center">
            <p className="font-semibold">Nie ma ofert pasujących do tych filtrów.</p>
            <p className="mt-1 text-muted">Zmień miasto lub specjalizację, albo wyczyść filtry.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

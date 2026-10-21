import Link from "next/link";
import { Suspense } from "react";
import { ListingCard } from "@/components/ListingCard";
import { SPECIALTIES, TYPE_LABEL, type ListingType } from "@/data/listings";
import { getListings } from "@/lib/listings";

type Params = Promise<{ miasto?: string; typ?: string; specjalizacja?: string; dzis?: string }>;

export default function OffersPage({ searchParams }: { searchParams: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10 text-muted sm:px-6">Ładowanie ofert…</div>}>
      <Offers searchParams={searchParams} />
    </Suspense>
  );
}

async function Offers({ searchParams }: { searchParams: Params }) {
  const { miasto = "", typ = "", specjalizacja = "", dzis } = await searchParams;
  const listings = await getListings();
  const CITIES = Array.from(new Set(listings.map((l) => l.city))).sort((a, b) => a.localeCompare(b, "pl"));

  const results = listings.filter(
    (l) =>
      (!miasto || l.city.toLowerCase() === miasto.toLowerCase()) &&
      (!typ || l.type === typ) &&
      (!specjalizacja || l.specialties.includes(specjalizacja)) &&
      (!dzis || l.freeToday.length > 0),
  );

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
        <h1 className="text-3xl font-bold">
          {typ ? TYPE_LABEL[typ as ListingType] : "Wszystkie miejsca"}
          {miasto && <span className="text-muted">, {miasto}</span>}
        </h1>
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

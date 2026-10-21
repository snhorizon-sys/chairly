import Link from "next/link";
import { type Listing, TYPE_LABEL, priceLabel } from "@/data/listings";
import { HeartButton } from "./HeartButton";

const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

export function ListingCard({ listing }: { listing: Listing }) {
  const price = priceLabel(listing);
  const freeToday = listing.freeToday.length
    ? `Wolne dziś: ${listing.freeToday.map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(", ")}`
    : null;

  return (
    <div className="group relative">
      <Link href={`/oferty/${listing.id}`} className="block">
        {/* Miejsce na zdjęcie salonu */}
        <div className="relative aspect-[5/4] overflow-hidden rounded-2xl" style={{ background: listing.tone }}>
          {listing.verified && (
            <span className="absolute left-3 top-3 rounded-full bg-paper px-3 py-1 text-xs font-semibold shadow-sm">
              Zweryfikowany
            </span>
          )}
          {listing.confirmation === "instant" && (
            <span className="absolute bottom-3 left-3 rounded-full bg-paper/95 px-3 py-1 text-xs font-medium shadow-sm">
              ⚡ Rezerwacja natychmiast
            </span>
          )}
        </div>
        <div className="mt-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug group-hover:underline">{listing.title}</h3>
            {listing.reviews > 0 && (
              <p className="shrink-0 text-sm">
                ★ {listing.rating.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </p>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted">
            {listing.salon}, {listing.district || listing.city}
          </p>
          <p className="text-sm text-muted">{TYPE_LABEL[listing.type]}</p>
          {freeToday && <p className="text-sm text-sage">{freeToday}</p>}
          <p className="mt-1.5">
            <span className="font-semibold">{price.value}</span> <span className="text-sm">{price.unit}</span>
            {listing.reviews === 0 && <span className="ml-2 text-sm text-muted">Nowa oferta</span>}
          </p>
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10">
        <HeartButton id={listing.id} label={listing.title} />
      </div>
    </div>
  );
}

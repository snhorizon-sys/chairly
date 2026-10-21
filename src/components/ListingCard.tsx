import Link from "next/link";
import { type Listing, TYPE_LABEL, priceLabel } from "@/data/listings";
import { AvailabilityBar } from "./AvailabilityBar";

export function ListingCard({ listing }: { listing: Listing }) {
  const price = priceLabel(listing);
  return (
    <Link
      href={`/oferty/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper hover:border-ink/40"
    >
      {/* Miejsce na zdjęcie salonu */}
      <div className="relative aspect-[4/3]" style={{ background: listing.tone }}>
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-xs font-medium">
          {TYPE_LABEL[listing.type]}
        </span>
        {listing.verified && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-paper">
            Zweryfikowany
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold leading-tight group-hover:underline">{listing.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {listing.salon}, {listing.district}, {listing.city}
          </p>
        </div>
        <AvailabilityBar free={listing.freeToday} compact />
        <div className="mt-auto flex items-end justify-between pt-1">
          <p>
            <span className="font-display text-xl font-bold">{price.value}</span>{" "}
            <span className="text-sm text-muted">{price.unit}</span>
          </p>
          {listing.reviews > 0 ? (
            <p className="text-sm">
              ★ {listing.rating.toFixed(1)} <span className="text-muted">({listing.reviews})</span>
            </p>
          ) : (
            <p className="text-sm text-muted">Nowa oferta</p>
          )}
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { createSupabaseServer } from "@/lib/supabase-server";
import { TYPE_LABEL, type ListingType } from "@/data/listings";
import { primaryButton } from "@/components/form";
import { SalonForm } from "./SalonForm";
import { becomeHost, deleteListing, setListingStatus } from "./actions";

type Params = Promise<{ dodano?: string }>;

export default function PanelPage({ searchParams }: { searchParams: Params }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Suspense fallback={<p className="text-muted">Ładowanie panelu…</p>}>
        <Panel searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const STATUS: Record<string, { label: string; className: string }> = {
  published: { label: "Opublikowana", className: "bg-sage/15 text-sage" },
  draft: { label: "Szkic", className: "bg-line/70 text-muted" },
  archived: { label: "Ukryta", className: "bg-line/70 text-muted" },
};

type Row = {
  id: string;
  slug: string;
  title: string;
  type: ListingType;
  status: string;
  price_hour: number | null;
  price_day: number | null;
  price_month: number | null;
};

async function Panel({ searchParams }: { searchParams: Params }) {
  const user = await requireUser("/panel");
  const { dodano } = await searchParams;

  if (user.role === "renter") {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold">Panel salonu</h1>
        <p className="mt-3 text-muted">
          Masz konto najemcy. Jeśli prowadzisz salon i chcesz wynajmować stanowiska, przełącz konto na konto salonu.
          Możesz dalej rezerwować miejsca u innych.
        </p>
        <form action={becomeHost} className="mt-6">
          <button className={primaryButton}>Przełącz na konto salonu</button>
        </form>
      </div>
    );
  }

  const sb = await createSupabaseServer();
  const { data: salon } = await sb
    .from("salons")
    .select("id, name, city, district, verified")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!salon) {
    return (
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h1 className="text-3xl font-bold">Witaj{user.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}</h1>
          <p className="mt-3 text-muted">
            Zacznij od danych salonu. Pokażemy je przy każdej Twojej ofercie. Potem dodasz stanowiska, sale lub
            przestrzeń na eventy.
          </p>
        </div>
        <SalonForm />
      </div>
    );
  }

  const { data } = await sb
    .from("listings")
    .select("id, slug, title, type, status, price_hour, price_day, price_month")
    .eq("salon_id", salon.id)
    .order("created_at", { ascending: false });
  const listings = (data ?? []) as Row[];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {salon.district ? `${salon.district}, ` : ""}
            {salon.city}
            {salon.verified ? " · zweryfikowany" : " · czeka na weryfikację"}
          </p>
          <h1 className="text-3xl font-bold">{salon.name}</h1>
        </div>
        <Link href="/panel/oferty/nowa" className={primaryButton}>
          Dodaj ofertę
        </Link>
      </div>

      {dodano && (
        <p className="mt-6 rounded-lg bg-sage/15 p-3 text-sm text-sage" role="status">
          {dodano === "szkic"
            ? "Szkic zapisany. Opublikuj go, kiedy będzie gotowy."
            : "Oferta opublikowana. Pojawi się w wyszukiwarce."}
        </p>
      )}

      <h2 className="mt-10 text-xl font-bold">Twoje oferty</h2>
      {listings.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-paper p-10 text-center">
          <p className="font-semibold">Nie masz jeszcze ofert.</p>
          <p className="mt-1 text-muted">Dodaj pierwsze stanowisko, salę szkoleniową lub przestrzeń na event.</p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
          {listings.map((l) => {
            const s = STATUS[l.status] ?? STATUS.draft;
            const price = l.price_hour
              ? `${l.price_hour} zł / godz.`
              : l.price_day
                ? `${l.price_day} zł / dzień`
                : `${l.price_month} zł / mies.`;
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.title}</p>
                  <p className="text-sm text-muted">
                    {TYPE_LABEL[l.type]} · {price}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.className}`}>{s.label}</span>
                <div className="flex items-center gap-1 text-sm">
                  {l.status === "published" && (
                    <Link href={`/oferty/${l.slug}`} className="rounded-md px-2 py-1.5 hover:bg-porcelain">
                      Zobacz
                    </Link>
                  )}
                  <form action={setListingStatus}>
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="status" value={l.status === "published" ? "archived" : "published"} />
                    <button className="rounded-md px-2 py-1.5 hover:bg-porcelain">
                      {l.status === "published" ? "Ukryj" : "Opublikuj"}
                    </button>
                  </form>
                  <form action={deleteListing}>
                    <input type="hidden" name="id" value={l.id} />
                    <button className="rounded-md px-2 py-1.5 text-lacquer hover:bg-lacquer/10">Usuń</button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

import Link from "next/link";
import { hasSupabase } from "@/lib/supabase";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-lg font-bold text-ink">Chairly</p>
          <p className="mt-2 max-w-xs">Wolne fotele, gabinety i sale w salonach beauty.</p>
          {process.env.NODE_ENV === "development" && (
            <p className="mt-3 text-xs">Źródło danych: {hasSupabase ? "Supabase" : "przykładowe dane (brak kluczy w .env.local)"}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/oferty">Szukaj miejsca</Link>
          <Link href="/oferty?typ=sala">Sale szkoleniowe</Link>
          <Link href="/oferty?typ=event">Przestrzenie na eventy</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/dla-salonow">Dla salonów</Link>
          <span>Regulamin</span>
          <span>Polityka prywatności</span>
        </div>
      </div>
    </footer>
  );
}

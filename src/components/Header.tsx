import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span aria-hidden className="inline-block h-5 w-3 rounded-full bg-lacquer" />
          Fotelia
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          <Link href="/oferty" className="rounded-md px-2 py-1.5 hover:bg-porcelain">
            Szukaj miejsca
          </Link>
          <Link href="/dla-salonow" className="hidden rounded-md px-2 py-1.5 hover:bg-porcelain sm:block">
            Dla salonów
          </Link>
          <Link
            href="/dla-salonow#dodaj"
            className="rounded-full bg-ink px-4 py-2 font-medium text-paper hover:bg-ink/85"
          >
            Dodaj ofertę
          </Link>
        </nav>
      </div>
    </header>
  );
}

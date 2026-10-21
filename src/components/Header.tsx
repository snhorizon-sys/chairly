import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";

const CATEGORIES = [
  {
    href: "/oferty?typ=stanowisko",
    label: "Stanowiska",
    icon: "M8 3h8v8H8z M6 11h12v3H6z M9 14v7 M15 14v7",
  },
  {
    href: "/oferty?typ=sala",
    label: "Sale szkoleniowe",
    icon: "M3 4h18v12H3z M12 16v4 M8 20h8",
  },
  {
    href: "/oferty?typ=event",
    label: "Eventy",
    icon: "m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z",
  },
];

function CategoryLink({ href, label, icon }: (typeof CATEGORIES)[number]) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted hover:bg-porcelain hover:text-ink"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
        <path d={icon} />
      </svg>
      {label}
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span aria-hidden className="inline-block h-5 w-3 rounded-full bg-lacquer" />
          Chairly
        </Link>
        <nav aria-label="Rodzaj miejsca" className="hidden items-center gap-1 md:flex">
          {CATEGORIES.map((c) => (
            <CategoryLink key={c.href} {...c} />
          ))}
        </nav>
        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          <Link href="/dla-salonow" className="hidden rounded-full px-3 py-2 font-medium hover:bg-porcelain sm:block">
            Dla salonów
          </Link>
          <Suspense fallback={<span className="inline-block h-9 w-32" aria-hidden />}>
            <UserNav />
          </Suspense>
        </nav>
      </div>
      <nav aria-label="Rodzaj miejsca" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
        {CATEGORIES.map((c) => (
          <CategoryLink key={c.href} {...c} />
        ))}
      </nav>
    </header>
  );
}

const pill = "rounded-full bg-ink px-4 py-2 font-medium text-paper hover:bg-ink/85";

async function UserNav() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <Link href="/logowanie" className="rounded-md px-2 py-1.5 hover:bg-porcelain">
          Zaloguj się
        </Link>
        <Link href="/logowanie?tryb=rejestracja&rola=host" className={pill}>
          Dodaj ofertę
        </Link>
      </>
    );
  }

  return (
    <>
      <form action={signOut}>
        <button className="rounded-md px-2 py-1.5 text-muted hover:bg-porcelain hover:text-ink">Wyloguj</button>
      </form>
      {user.role === "renter" ? (
        <Link href="/konto" className={pill}>
          Moje konto
        </Link>
      ) : (
        <Link href="/panel" className={pill}>
          Panel salonu
        </Link>
      )}
    </>
  );
}

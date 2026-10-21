import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";

export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span aria-hidden className="inline-block h-5 w-3 rounded-full bg-lacquer" />
          Chairly
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-3">
          <Link href="/oferty" className="hidden rounded-md px-2 py-1.5 hover:bg-porcelain sm:block">
            Szukaj miejsca
          </Link>
          <Link href="/dla-salonow" className="hidden rounded-md px-2 py-1.5 hover:bg-porcelain md:block">
            Dla salonów
          </Link>
          <Suspense fallback={<span className="inline-block h-9 w-32" aria-hidden />}>
            <UserNav />
          </Suspense>
        </nav>
      </div>
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

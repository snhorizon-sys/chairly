import { Suspense } from "react";
import { redirect } from "next/navigation";
import { hasSupabase } from "@/lib/supabase";
import { getCurrentUser, safeNext } from "@/lib/auth";
import { AuthForm } from "./AuthForm";

type Params = Promise<{ tryb?: string; next?: string; rola?: string; blad?: string }>;

export default function LoginPage({ searchParams }: { searchParams: Params }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_420px] md:items-start">
      <div>
        <h1 className="text-4xl font-bold leading-tight">Twoje konto w Chairly</h1>
        <p className="mt-4 max-w-md text-lg text-muted">
          Salon dodaje tu stanowiska i ustala grafik. Najemczynie rezerwują miejsca i zbierają opinie, które pomagają
          przy kolejnych wynajmach.
        </p>
      </div>
      <Suspense fallback={<div className="h-96 rounded-2xl border border-line bg-paper" />}>
        <Login searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Login({ searchParams }: { searchParams: Params }) {
  const { tryb, next, rola, blad } = await searchParams;

  if (!hasSupabase) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-6">
        <p className="font-semibold">Logowanie nie jest jeszcze włączone.</p>
        <p className="mt-1 text-muted">Uzupełnij klucze Supabase w pliku .env.local i uruchom ponownie npm run dev.</p>
      </div>
    );
  }

  const user = await getCurrentUser();
  if (user) redirect(safeNext(next, user.role === "renter" ? "/konto" : "/panel"));

  return (
    <AuthForm
      mode={tryb === "rejestracja" ? "signup" : "login"}
      next={next ? safeNext(next) : ""}
      role={rola === "host" ? "host" : "renter"}
      linkError={blad === "link"}
    />
  );
}

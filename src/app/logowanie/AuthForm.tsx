"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormAction } from "@/components/useFormAction";
import { signIn, signUp } from "@/app/auth/actions";
import { inputClass, labelClass, primaryButton } from "@/components/form";

type Props = { mode: "login" | "signup"; next: string; role: "renter" | "host"; linkError: boolean };

export function AuthForm({ mode, next, role: initialRole, linkError }: Props) {
  const [loginState, loginAction, loginPending] = useFormAction(signIn);
  const [signupState, signupAction, signupPending] = useFormAction(signUp);
  const [role, setRole] = useState(initialRole);

  const state = mode === "login" ? loginState : signupState;
  const pending = mode === "login" ? loginPending : signupPending;
  const query = (m: string) => `/logowanie?tryb=${m}&rola=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`;

  if (mode === "signup" && signupState?.message) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-6" role="status">
        <h2 className="text-xl font-bold">Sprawdź skrzynkę</h2>
        <p className="mt-2 text-muted">{signupState.message}</p>
        <p className="mt-4 text-sm text-muted">Nie widzisz wiadomości? Zajrzyj do folderu Spam lub Oferty.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-porcelain p-1 text-sm font-medium">
        <Link
          href={query("logowanie")}
          aria-current={mode === "login" ? "page" : undefined}
          className={`rounded-lg px-3 py-2 text-center ${mode === "login" ? "bg-paper shadow-sm" : "text-muted hover:text-ink"}`}
        >
          Logowanie
        </Link>
        <Link
          href={query("rejestracja")}
          aria-current={mode === "signup" ? "page" : undefined}
          className={`rounded-lg px-3 py-2 text-center ${mode === "signup" ? "bg-paper shadow-sm" : "text-muted hover:text-ink"}`}
        >
          Załóż konto
        </Link>
      </div>

      {linkError && (
        <p className="mt-4 rounded-lg bg-lacquer/10 p-3 text-sm text-lacquer-dark" role="alert">
          Link wygasł albo został już użyty. Zaloguj się lub załóż konto ponownie.
        </p>
      )}

      <form onSubmit={mode === "login" ? loginAction : signupAction} className="mt-5 grid gap-4">
        <input type="hidden" name="next" value={next} />

        {mode === "signup" && (
          <>
            <fieldset>
              <legend className="text-sm text-muted">Kim jesteś</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  [
                    ["renter", "Szukam miejsca", "Fryzjerka, kosmetolożka, stylistka…"],
                    ["host", "Mam salon", "Wynajmuję stanowiska lub sale"],
                  ] as const
                ).map(([value, title, hint]) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={role === value}
                      onChange={() => setRole(value)}
                      className="peer sr-only"
                    />
                    <span className="block h-full rounded-xl border border-line p-3 peer-checked:border-ink peer-checked:ring-1 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-lacquer">
                      <span className="block font-semibold">{title}</span>
                      <span className="mt-0.5 block text-xs text-muted">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className={labelClass}>
              <span className="text-muted">{role === "host" ? "Imię i nazwisko właściciela" : "Imię i nazwisko"}</span>
              <input name="full_name" autoComplete="name" required className={inputClass} />
            </label>
          </>
        )}

        <label className={labelClass}>
          <span className="text-muted">E-mail</span>
          <input name="email" type="email" autoComplete="email" required className={inputClass} />
        </label>
        <label className={labelClass}>
          <span className="text-muted">Hasło</span>
          <input
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={mode === "signup" ? 8 : undefined}
            required
            className={inputClass}
          />
          {mode === "signup" && <span className="text-xs text-muted">Co najmniej 8 znaków.</span>}
        </label>

        {state?.error && (
          <p className="rounded-lg bg-lacquer/10 p-3 text-sm text-lacquer-dark" role="alert">
            {state.error}
          </p>
        )}

        <button disabled={pending} className={primaryButton}>
          {pending ? "Chwileczkę…" : mode === "login" ? "Zaloguj się" : "Załóż konto"}
        </button>
      </form>
    </div>
  );
}

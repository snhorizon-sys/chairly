"use client";

import { useState } from "react";
import type { Listing } from "@/data/listings";

type Mode = "hour" | "day" | "month";

export function BookingBox({ listing }: { listing: Listing }) {
  const modes: { id: Mode; label: string; price?: number }[] = [
    { id: "hour" as Mode, label: "Godziny", price: listing.priceHour },
    { id: "day" as Mode, label: "Dzień", price: listing.priceDay },
    { id: "month" as Mode, label: "Miesiąc", price: listing.priceMonth },
  ].filter((m) => m.price);

  const [mode, setMode] = useState<Mode>(modes[0].id);
  const [hours, setHours] = useState(4);
  const [sent, setSent] = useState(false);

  const current = modes.find((m) => m.id === mode)!;
  const total = mode === "hour" ? current.price! * hours : current.price!;
  const isEvent = listing.type === "event";

  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      {modes.length > 1 && (
        <div className="grid grid-flow-col gap-1 rounded-xl bg-porcelain p-1" role="tablist">
          {modes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                mode === m.id ? "bg-paper shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      <p className="mt-4">
        <span className="font-display text-3xl font-bold">{current.price}</span>{" "}
        <span className="text-muted">zł / {mode === "hour" ? "godz." : mode === "day" ? "dzień" : "mies."}</span>
      </p>

      <div className="mt-4 grid gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">{mode === "month" ? "Od kiedy" : "Data"}</span>
          <input type="date" className="rounded-lg border border-line px-3 py-2.5" defaultValue="2026-10-22" />
        </label>
        {mode === "hour" && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Liczba godzin</span>
            <input
              type="number"
              min={1}
              max={12}
              value={hours}
              onChange={(e) => setHours(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
              className="rounded-lg border border-line px-3 py-2.5"
            />
          </label>
        )}
      </div>

      <div className="mt-5 flex justify-between border-t border-line pt-4">
        <span className="text-muted">Razem</span>
        <span className="font-semibold tabular-nums">{total.toLocaleString("pl-PL")} zł</span>
      </div>

      <button
        onClick={() => setSent(true)}
        className="mt-4 w-full rounded-xl bg-lacquer px-4 py-3 font-medium text-paper hover:bg-lacquer-dark"
      >
        {isEvent ? "Wyślij zapytanie" : "Zarezerwuj"}
      </button>
      {sent && (
        <p className="mt-3 rounded-lg bg-porcelain p-3 text-sm" role="status">
          To podgląd. Rezerwacje i płatności zadziałają po podłączeniu bazy danych i Stripe.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-muted">Pieniądze trafiają do salonu dopiero po wizycie.</p>
    </div>
  );
}

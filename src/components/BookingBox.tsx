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
  const minHours = listing.minHours ?? 1;
  const [hours, setHours] = useState(Math.max(4, minHours));
  const [sent, setSent] = useState(false);
  const [accepted, setAccepted] = useState(false);

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
              min={minHours}
              max={12}
              value={hours}
              onChange={(e) => setHours(Math.max(minHours, Math.min(12, Number(e.target.value) || minHours)))}
              className="rounded-lg border border-line px-3 py-2.5"
            />
            {minHours > 1 && <span className="text-xs text-muted">Minimum {minHours} godz.</span>}
          </label>
        )}
        {isEvent && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Liczba gości</span>
            <input
              type="number"
              min={1}
              max={listing.capacity}
              className="rounded-lg border border-line px-3 py-2.5"
              placeholder={listing.capacity ? `do ${listing.capacity}` : undefined}
            />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">{isEvent ? "Wiadomość do salonu" : "Notatka dla salonu (opcjonalnie)"}</span>
          <textarea
            rows={3}
            maxLength={500}
            className="rounded-lg border border-line px-3 py-2.5"
            placeholder={
              isEvent ? "Rodzaj wydarzenia, godziny, potrzebny sprzęt" : "Jakie zabiegi wykonasz, ilu klientów przyjmiesz"
            }
          />
        </label>
      </div>

      <div className="mt-5 flex justify-between border-t border-line pt-4">
        <span className="text-muted">Razem</span>
        <span className="font-semibold tabular-nums">{total.toLocaleString("pl-PL")} zł</span>
      </div>
      {listing.deposit != null && (
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted">Kaucja (zwrotna)</span>
          <span className="tabular-nums">{listing.deposit.toLocaleString("pl-PL")} zł</span>
        </div>
      )}

      <label className="mt-4 flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 accent-lacquer"
        />
        <span>
          Akceptuję zasady najmu i warunki anulowania z tej oferty
          {listing.requiresInsurance && ", w tym wymóg ubezpieczenia OC"}.
        </span>
      </label>

      <button
        onClick={() => setSent(true)}
        disabled={!accepted}
        className="mt-4 w-full rounded-xl bg-lacquer px-4 py-3 font-medium text-paper hover:bg-lacquer-dark disabled:opacity-60"
      >
        {isEvent ? "Wyślij zapytanie" : listing.confirmation === "instant" ? "Zarezerwuj" : "Poproś o rezerwację"}
      </button>
      {sent && (
        <p className="mt-3 rounded-lg bg-porcelain p-3 text-sm" role="status">
          To podgląd. Rezerwacje i płatności zadziałają po podłączeniu bazy danych i Stripe.
        </p>
      )}
      {!isEvent && listing.confirmation && (
        <p className="mt-3 text-center text-xs text-muted">
          {listing.confirmation === "instant"
            ? "Rezerwacja jest potwierdzona od razu."
            : "Salon potwierdzi rezerwację, zanim zapłacisz."}
        </p>
      )}
      <p className="mt-2 text-center text-xs text-muted">Pieniądze trafiają do salonu dopiero po wizycie.</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { fmtHour, statusAt } from "@/lib/availability";
import { OffersMap } from "./OffersMap";
import type { MapPoint } from "./types";

const DURATIONS = [1, 2, 4];
const MIN = 8;
const MAX = 20;
const noop = () => () => {};

function nowInWarsaw() {
  const parts = new Intl.DateTimeFormat("pl-PL", { timeZone: "Europe/Warsaw", hour: "numeric", minute: "numeric" })
    .formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 12);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + (m > 30 ? 1 : 0.5);
}

export function MapExplorer({ points, withoutLocation }: { points: MapPoint[]; withoutLocation: number }) {
  const [chosenHour, setHour] = useState<number | null>(null);
  // Domyślnie najbliższa pełna lub pół godzina; na serwerze 12:00, w przeglądarce aktualna
  const defaultHour = useSyncExternalStore(
    noop,
    () => Math.min(Math.max(nowInWarsaw(), MIN), MAX - 1),
    () => 12,
  );
  const hour = chosenHour ?? defaultHour;
  const [duration, setDuration] = useState(2);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const maxStart = MAX - duration;
  const start = Math.min(hour, maxStart);

  const sorted = useMemo(() => {
    const rank = (p: MapPoint) => {
      const s = statusAt(p.freeToday, start, duration);
      return s.kind === "free" ? 0 : s.kind === "later" ? 1 : 2;
    };
    return [...points].sort((a, b) => rank(a) - rank(b));
  }, [points, start, duration]);

  const freeCount = sorted.filter((p) => statusAt(p.freeToday, start, duration).kind === "free").length;
  const selected = points.find((p) => p.id === selectedId) ?? null;
  const selectedStatus = selected ? statusAt(selected.freeToday, start, duration) : null;

  return (
    <div className="grid min-h-0 flex-1 lg:grid-cols-[380px_1fr]">
      {/* Lista */}
      <section aria-label="Oferty na mapie" className="order-2 min-h-0 overflow-y-auto border-line p-4 lg:order-1 lg:border-r lg:p-5">
        <h2 className="text-xl font-bold">
          {freeCount} {freeCount === 1 ? "miejsce wolne" : freeCount > 1 && freeCount < 5 ? "miejsca wolne" : "miejsc wolnych"} o{" "}
          {fmtHour(start)}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Na {duration} {duration === 1 ? "godzinę" : duration < 5 ? "godziny" : "godzin"}. Przesuń suwak, żeby sprawdzić inną godzinę.
        </p>

        <ul className="mt-4 flex flex-col gap-1">
          {sorted.map((p) => {
            const s = statusAt(p.freeToday, start, duration);
            const active = p.id === selectedId;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(active ? null : p.id)}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(p.id)}
                  onBlur={() => setHoveredId(null)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left ${active ? "bg-porcelain ring-2 ring-ink" : "hover:bg-porcelain"}`}
                >
                  <span className="h-14 w-14 shrink-0 rounded-lg" style={{ background: p.tone }} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.title}</span>
                    <span className="block truncate text-xs text-muted">
                      {p.salon} · {p.place}
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      {s.kind === "free" && (
                        <span className="rounded-md bg-sage px-1.5 py-0.5 text-xs font-bold text-paper tabular-nums">
                          wolne do {fmtHour(s.until)}
                        </span>
                      )}
                      {s.kind === "later" && (
                        <span className="rounded-md border border-line px-1.5 py-0.5 text-xs font-semibold text-muted tabular-nums">
                          wolne od {fmtHour(s.from)}
                        </span>
                      )}
                      {s.kind === "none" && <span className="text-xs text-muted">dziś pełne</span>}
                      <span className="text-sm font-semibold">{p.priceShort}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {withoutLocation > 0 && (
          <p className="mt-4 text-xs text-muted">
            {withoutLocation} {withoutLocation === 1 ? "oferta nie ma" : "oferty nie mają"} jeszcze lokalizacji, więc nie ma
            {withoutLocation === 1 ? "" : "ją"} na mapie. Zobaczysz je w widoku listy.
          </p>
        )}
      </section>

      {/* Mapa */}
      <div className="relative order-1 h-[65dvh] lg:order-2 lg:h-full">
        <OffersMap
          points={points}
          hour={start}
          duration={duration}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
        />

        {/* Legenda */}
        <div className="pointer-events-none absolute left-3 top-3 hidden flex-col gap-1.5 rounded-xl bg-paper/95 p-3 text-xs shadow-md sm:flex">
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-6 rounded-full bg-sage" /> wolne o wybranej godzinie
          </span>
          <span className="flex items-center gap-2">
            <span className="box-border h-3.5 w-6 rounded-full border-[1.5px] border-[#c3c9d1] bg-paper" /> wolne później
          </span>
          <span className="flex items-center gap-2">
            <span className="mx-1.5 h-2.5 w-2.5 rounded-full bg-[#aab1bb]" /> dziś pełne
          </span>
          <span className="mt-1 border-t border-line pt-1.5 text-muted">Lokalizacje przybliżone. Adres po potwierdzeniu rezerwacji.</span>
        </div>

        {/* Karta wybranej oferty */}
        {selected && (
          <div className="absolute inset-x-3 top-3 z-10 mx-auto max-w-sm overflow-hidden rounded-2xl bg-paper shadow-xl sm:left-auto sm:right-14 sm:mx-0 sm:w-80">
            <div className="h-20" style={{ background: selected.tone }} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold leading-snug">{selected.title}</p>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Zamknij"
                  className="-mr-1 -mt-1 rounded-full p-1 text-muted hover:bg-porcelain hover:text-ink"
                >
                  <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {selected.salon} · {selected.place}
                {selected.reviews > 0 && ` · ★ ${selected.rating.toLocaleString("pl-PL", { minimumFractionDigits: 1 })}`}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selected.freeToday.length ? (
                  selected.freeToday.map(([a, b]) => (
                    <span key={`${a}-${b}`} className="rounded-md bg-sage/15 px-1.5 py-0.5 text-xs font-semibold text-sage tabular-nums">
                      {fmtHour(a)}–{fmtHour(b)}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">Dziś brak wolnych godzin</span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold">{selected.priceShort}</span>
                <Link href={`/oferty/${selected.id}`} className="text-sm font-bold text-lacquer hover:underline">
                  {selectedStatus?.kind === "free" ? `Zarezerwuj ${fmtHour(start)}` : "Zobacz ofertę"}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Suwak godziny */}
        <div className="absolute inset-x-3 bottom-3 z-10 rounded-2xl bg-paper p-4 shadow-xl sm:inset-x-auto sm:left-1/2 sm:w-[min(640px,calc(100%-24px))] sm:-translate-x-1/2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display font-bold">
              Wolne dziś{" "}
              <span className="ml-1 rounded-md bg-lacquer px-2 py-0.5 text-sm text-paper tabular-nums">
                {fmtHour(start)}–{fmtHour(start + duration)}
              </span>
            </p>
            <div className="flex items-center gap-1 text-sm" role="group" aria-label="Na ile godzin">
              <span className="mr-1 text-muted">Na ile?</span>
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  aria-pressed={duration === d}
                  className={`rounded-full px-3 py-1 font-semibold ${duration === d ? "bg-ink text-paper" : "border border-line hover:border-ink"}`}
                >
                  {d} h
                </button>
              ))}
            </div>
          </div>
          <label className="mt-3 block">
            <span className="sr-only">Godzina rozpoczęcia</span>
            <input
              type="range"
              min={MIN}
              max={maxStart}
              step={0.5}
              value={start}
              onChange={(e) => setHour(Number(e.target.value))}
              aria-valuetext={`od ${fmtHour(start)} do ${fmtHour(start + duration)}`}
              className="w-full accent-lacquer"
            />
          </label>
          <div className="flex justify-between text-[11px] text-muted tabular-nums" aria-hidden>
            {[8, 10, 12, 14, 16, 18, 20].map((h) => (
              <span key={h}>{h}:00</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

/**
 * Wolne godziny na dziś.
 * Pełna wersja: oś godzin z podziałką co godzinę, opisane wolne okna i lista godzin.
 * Wersja kompaktowa (karta oferty): godziny jako tekst + cienki pasek.
 */
export function AvailabilityBar({ free, compact = false }: { free: [number, number][]; compact?: boolean }) {
  const slots = [...free].sort((a, b) => a[0] - b[0]);
  // Oś domyślnie 8–20, poszerzana, jeśli salon pracuje wcześniej lub dłużej
  const start = Math.min(8, ...slots.map(([a]) => Math.floor(a)));
  const end = Math.max(20, ...slots.map(([, b]) => Math.ceil(b)));
  const span = end - start;
  const pos = (h: number) => `${((h - start) / span) * 100}%`;
  const width = (a: number, b: number) => `${((b - a) / span) * 100}%`;
  const label = slots.length
    ? "Wolne dziś: " + slots.map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(", ")
    : "Dziś brak wolnych godzin";

  if (compact) {
    return (
      <div>
        {slots.length ? (
          <p className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
            <span className="text-muted">Dziś:</span>
            {slots.map(([a, b]) => (
              <span key={`${a}-${b}`} className="font-medium tabular-nums text-sage">
                {fmt(a)}–{fmt(b)}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-sm text-muted">Dziś brak wolnych godzin</p>
        )}
        <div className="relative mt-1.5 h-1.5 overflow-hidden rounded-full bg-line/60" aria-hidden>
          {slots.map(([a, b]) => (
            <span key={`${a}-${b}`} className="absolute inset-y-0 bg-sage" style={{ left: pos(a), width: width(a, b) }} />
          ))}
        </div>
      </div>
    );
  }

  const hours = Array.from({ length: span + 1 }, (_, i) => start + i);

  return (
    <div>
      <div className="relative" role="img" aria-label={label}>
        {/* tło osi: zajęte lub poza grafikiem */}
        <div className="relative h-10 overflow-hidden rounded-lg bg-[repeating-linear-gradient(135deg,var(--color-line)_0_6px,transparent_6px_12px)] ring-1 ring-line">
          {slots.map(([a, b]) => (
            <span
              key={`${a}-${b}`}
              className="absolute inset-y-0 flex items-center justify-center overflow-hidden whitespace-nowrap border-x-2 border-paper bg-sage text-xs font-semibold text-paper tabular-nums"
              style={{ left: pos(a), width: width(a, b) }}
            >
              {b - a >= 2 ? `${fmt(a)}–${fmt(b)}` : ""}
            </span>
          ))}
          {/* linie co godzinę */}
          {hours.slice(1, -1).map((h) => (
            <span key={h} className="absolute inset-y-0 w-px bg-ink/10" style={{ left: pos(h) }} aria-hidden />
          ))}
        </div>
        {/* podpisy godzin co 2 h */}
        <div className="relative mt-1 h-4 text-[11px] text-muted tabular-nums" aria-hidden>
          {hours.map((h, i) =>
            (h - start) % 2 === 0 ? (
              <span
                key={h}
                className={`absolute ${i === 0 ? "" : i === hours.length - 1 ? "-translate-x-full" : "-translate-x-1/2"}`}
                style={{ left: pos(h) }}
              >
                {h}:00
              </span>
            ) : null,
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {slots.length ? (
          <>
            <span className="text-sm text-muted">Wolne dziś:</span>
            {slots.map(([a, b]) => (
              <span
                key={`${a}-${b}`}
                className="rounded-full bg-sage/15 px-3 py-1 text-sm font-semibold text-sage tabular-nums"
              >
                {fmt(a)}–{fmt(b)}
              </span>
            ))}
          </>
        ) : (
          <span className="text-sm text-muted">Dziś brak wolnych godzin</span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-sage" /> wolne
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-[repeating-linear-gradient(135deg,var(--color-line)_0_3px,transparent_3px_6px)] ring-1 ring-line" />
          zajęte lub poza grafikiem
        </span>
      </div>
    </div>
  );
}

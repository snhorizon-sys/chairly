const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

const START = 8;
const END = 20;

/** Pasek godzin 8–20 z zaznaczonymi wolnymi oknami na dziś. */
export function AvailabilityBar({ free, compact = false }: { free: [number, number][]; compact?: boolean }) {
  const span = END - START;
  const label =
    free.length === 0
      ? "Dziś brak wolnych godzin"
      : "Wolne dziś: " + free.map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(", ");

  return (
    <div>
      <div
        className={`relative w-full overflow-hidden rounded-full bg-line/60 ${compact ? "h-2" : "h-3"}`}
        role="img"
        aria-label={label}
      >
        {free.map(([a, b]) => (
          <span
            key={`${a}-${b}`}
            className="absolute inset-y-0 rounded-full bg-sage"
            style={{
              left: `${((Math.max(a, START) - START) / span) * 100}%`,
              width: `${((Math.min(b, END) - Math.max(a, START)) / span) * 100}%`,
            }}
          />
        ))}
      </div>
      {!compact && (
        <div className="mt-1 flex justify-between text-[11px] text-muted tabular-nums">
          <span>8:00</span>
          <span>14:00</span>
          <span>20:00</span>
        </div>
      )}
      <p className={`text-xs ${free.length ? "text-sage" : "text-muted"} ${compact ? "mt-1.5" : "mt-1"}`}>{label}</p>
    </div>
  );
}

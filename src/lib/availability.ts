/** Formatowanie godziny 9.5 -> "9:30" */
export const fmtHour = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

export type SlotStatus =
  | { kind: "free"; until: number } // wolne przez cały wybrany czas
  | { kind: "later"; from: number } // wolne później tego dnia
  | { kind: "none" }; // dziś już nic

/** Czy oferta ma wolne okno od godziny `hour` przez `duration` godzin? */
export function statusAt(free: [number, number][], hour: number, duration: number): SlotStatus {
  const slots = [...free].sort((a, b) => a[0] - b[0]);
  const fit = slots.find(([a, b]) => a <= hour && b >= hour + duration);
  if (fit) return { kind: "free", until: fit[1] };
  const later = slots.find(([a, b]) => a > hour && b - a >= duration);
  if (later) return { kind: "later", from: later[0] };
  return { kind: "none" };
}

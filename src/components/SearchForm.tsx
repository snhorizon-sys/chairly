import { SPECIALTIES, TYPE_LABEL } from "@/data/listings";

const field =
  "w-full rounded-xl border border-line bg-paper px-3 py-3 text-base outline-none focus:border-ink";

/** Formularz wyszukiwania – wysyła parametry do /oferty. */
export function SearchForm() {
  return (
    <form
      action="/oferty"
      className="grid gap-3 rounded-2xl bg-paper p-3 shadow-[0_1px_0_var(--color-line)] ring-1 ring-line sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-end"
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="px-1 text-muted">Miasto</span>
        <input name="miasto" placeholder="np. Poznań" className={field} defaultValue="Poznań" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="px-1 text-muted">Czego szukasz</span>
        <select name="typ" className={field} defaultValue="stanowisko">
          {Object.entries(TYPE_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="px-1 text-muted">Specjalizacja</span>
        <select name="specjalizacja" className={field} defaultValue="">
          <option value="">Dowolna</option>
          {SPECIALTIES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <button className="rounded-xl bg-lacquer px-6 py-3 font-medium text-paper hover:bg-lacquer-dark">
        Szukaj
      </button>
    </form>
  );
}

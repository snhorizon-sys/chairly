import { SPECIALTIES, TYPE_LABEL } from "@/data/listings";

const segment = "flex flex-1 flex-col justify-center px-6 py-3 hover:bg-porcelain/70 focus-within:bg-porcelain/70";
const labelText = "text-xs font-semibold";
const control = "w-full bg-transparent text-sm outline-none placeholder:text-muted";

/** Wyszukiwarka w kształcie pigułki (Gdzie / Czego szukasz / Specjalizacja), wysyła parametry do /oferty. */
export function SearchForm() {
  return (
    <form
      action="/oferty"
      className="mx-auto flex w-full max-w-3xl flex-col rounded-3xl border border-line bg-paper shadow-[0_3px_14px_rgba(0,0,0,0.08)] sm:flex-row sm:items-stretch sm:rounded-full"
    >
      <label className={`${segment} rounded-t-3xl sm:rounded-l-full sm:rounded-tr-none`}>
        <span className={labelText}>Gdzie</span>
        <input name="miasto" placeholder="Wpisz miasto" defaultValue="Poznań" className={control} />
      </label>
      <span aria-hidden className="h-px bg-line sm:my-3 sm:h-auto sm:w-px" />
      <label className={segment}>
        <span className={labelText}>Czego szukasz</span>
        <select name="typ" defaultValue="stanowisko" className={control}>
          {Object.entries(TYPE_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <span aria-hidden className="h-px bg-line sm:my-3 sm:h-auto sm:w-px" />
      <label className={segment}>
        <span className={labelText}>Specjalizacja</span>
        <select name="specjalizacja" defaultValue="" className={control}>
          <option value="">Dowolna</option>
          {SPECIALTIES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <div className="p-2">
        <button
          aria-label="Szukaj"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lacquer px-5 font-medium text-paper hover:bg-lacquer-dark sm:w-12 sm:px-0"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 5 5" strokeLinecap="round" />
          </svg>
          <span className="sm:hidden">Szukaj</span>
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useFormAction } from "@/components/useFormAction";
import { createListing } from "@/app/panel/actions";
import {
  AMENITIES,
  CANCELLATION_LABEL,
  CONFIRMATION_LABEL,
  LAYOUTS,
  SPECIALTIES,
  TYPE_LABEL,
  type ListingType,
} from "@/data/listings";
import { inputClass, labelClass, primaryButton, secondaryButton } from "@/components/form";

// Kolejność od poniedziałku; wartość to numer dnia w bazie (0 = niedziela)
const DAYS = [
  [1, "Poniedziałek"],
  [2, "Wtorek"],
  [3, "Środa"],
  [4, "Czwartek"],
  [5, "Piątek"],
  [6, "Sobota"],
  [0, "Niedziela"],
] as const;

export function ListingForm() {
  const [state, action, pending] = useFormAction(createListing);
  const [type, setType] = useState<ListingType>("stanowisko");

  return (
    <form onSubmit={action} className="grid gap-8">
      <section className="grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
        <h2 className="text-lg font-bold sm:col-span-2">Co wynajmujesz</h2>
        <label className={labelClass}>
          <span className="text-muted">Rodzaj miejsca</span>
          <select name="type" value={type} onChange={(e) => setType(e.target.value as ListingType)} className={inputClass}>
            {Object.entries(TYPE_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="text-muted">Tytuł</span>
          <input name="title" required maxLength={120} className={inputClass} placeholder="Fotel fryzjerski przy oknie" />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          <span className="text-muted">Opis</span>
          <textarea
            name="description"
            rows={4}
            maxLength={3000}
            className={inputClass}
            placeholder="Co wyróżnia to miejsce, zasady korzystania, dla kogo się sprawdzi"
          />
        </label>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm text-muted">Dla jakich specjalizacji</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SPECIALTIES.map((s) => (
              <label key={s} className="cursor-pointer">
                <input type="checkbox" name="specialties" value={s} className="peer sr-only" />
                <span className="inline-block rounded-full border border-line px-3 py-1.5 text-sm peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-lacquer">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className={labelClass}>
          <span className="text-muted">Wyposażenie</span>
          <textarea name="equipment" rows={4} className={inputClass} placeholder={"Fotel hydrauliczny\nMyjka\nSterylizator"} />
          <span className="text-xs text-muted">Każda pozycja w nowej linii.</span>
        </label>
        <label className={labelClass}>
          <span className="text-muted">W cenie</span>
          <textarea name="included" rows={4} className={inputClass} placeholder={"Media\nRęczniki\nRecepcja"} />
          <span className="text-xs text-muted">Każda pozycja w nowej linii.</span>
        </label>
        {type !== "stanowisko" && (
          <label className={labelClass}>
            <span className="text-muted">Maksymalna liczba osób</span>
            <input name="capacity" type="number" min={1} className={inputClass} />
          </label>
        )}
        <fieldset className="sm:col-span-2">
          <legend className="text-sm text-muted">Udogodnienia wspólne</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <label key={a} className="cursor-pointer">
                <input type="checkbox" name="amenities" value={a} className="peer sr-only" />
                <span className="inline-block rounded-full border border-line px-3 py-1.5 text-sm peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-lacquer">
                  {a}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {type !== "stanowisko" && (
        <section className="grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
          <h2 className="text-lg font-bold sm:col-span-2">Sala i event</h2>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm text-muted">Dostępne układy sali</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {LAYOUTS.map((l) => (
                <label key={l} className="cursor-pointer">
                  <input type="checkbox" name="layouts" value={l} className="peer sr-only" />
                  <span className="inline-block rounded-full border border-line px-3 py-1.5 text-sm peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-lacquer">
                    {l}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className={labelClass}>
            <span className="text-muted">Catering własny najemcy</span>
            <select name="catering_allowed" defaultValue="" className={inputClass}>
              <option value="">Nie podano</option>
              <option value="yes">Dozwolony</option>
              <option value="no">Niedozwolony</option>
            </select>
          </label>
          <label className={labelClass}>
            <span className="text-muted">Montaż i demontaż</span>
            <textarea
              name="setup_info"
              rows={3}
              maxLength={500}
              className={inputClass}
              placeholder="np. wstęp na godzinę przed, sprzątanie po evencie w cenie"
            />
          </label>
        </section>
      )}

      <section className="grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <h2 className="text-lg font-bold">Ceny</h2>
          <p className="text-sm text-muted">Wypełnij te, które oferujesz. Co najmniej jedna jest wymagana.</p>
        </div>
        {(
          [
            ["price_hour", "Za godzinę (zł)"],
            ["price_day", "Za dzień (zł)"],
            ["price_month", "Za miesiąc (zł)"],
          ] as const
        ).map(([name, label]) => (
          <label key={name} className={labelClass}>
            <span className="text-muted">{label}</span>
            <input name={name} type="number" min={1} step="0.01" inputMode="decimal" className={inputClass} />
          </label>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
        <h2 className="text-lg font-bold sm:col-span-2">Zasady najmu</h2>
        <label className={labelClass}>
          <span className="text-muted">Potwierdzanie rezerwacji</span>
          <select name="confirmation" defaultValue="manual" className={inputClass}>
            {Object.entries(CONFIRMATION_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="text-muted">Anulowanie</span>
          <select name="cancellation" defaultValue="moderate" className={inputClass}>
            {Object.entries(CANCELLATION_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          <span className="text-muted">Minimalny czas rezerwacji (godz.)</span>
          <input name="min_hours" type="number" min={1} max={24} defaultValue={1} className={inputClass} />
        </label>
        <label className={labelClass}>
          <span className="text-muted">Kaucja (zł)</span>
          <input name="deposit" type="number" min={1} step="0.01" inputMode="decimal" className={inputClass} />
          <span className="text-xs text-muted">Zostaw puste, jeśli nie pobierasz kaucji.</span>
        </label>
        <label className={labelClass}>
          <span className="text-muted">Wypowiedzenie przy najmie miesięcznym (dni)</span>
          <input name="notice_days" type="number" min={0} max={180} className={inputClass} placeholder="30" />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" name="requires_insurance" className="h-4 w-4 accent-lacquer" />
          Wymagam ubezpieczenia OC najemcy
        </label>
        <label className={labelClass}>
          <span className="text-muted">Zasady korzystania</span>
          <textarea name="rules" rows={4} className={inputClass} placeholder={"Bez zapachowych produktów\nSprzątanie stanowiska po pracy"} />
          <span className="text-xs text-muted">Każda pozycja w nowej linii.</span>
        </label>
        <label className={labelClass}>
          <span className="text-muted">Wymagania wobec najemcy</span>
          <textarea
            name="requirements"
            rows={4}
            className={inputClass}
            placeholder={"Certyfikat ukończenia kursu\nWłasne kosmetyki i narzędzia"}
          />
          <span className="text-xs text-muted">Każda pozycja w nowej linii.</span>
        </label>
      </section>

      <section className="rounded-2xl border border-line bg-paper p-6">
        <h2 className="text-lg font-bold">Kiedy jest dostępne</h2>
        <p className="text-sm text-muted">Stały grafik tygodniowy. Urlopy i pojedyncze dni zablokujesz później.</p>
        <div className="mt-4 grid gap-2">
          {DAYS.map(([d, name]) => (
            <div key={d} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 sm:grid-cols-[180px_auto_auto]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={`day_${d}`}
                  defaultChecked={d !== 0}
                  className="h-4 w-4 accent-lacquer"
                />
                {name}
              </label>
              <input
                type="time"
                name={`from_${d}`}
                defaultValue="09:00"
                step={1800}
                aria-label={`${name}, od`}
                className="rounded-lg border border-line px-2 py-2"
              />
              <input
                type="time"
                name={`to_${d}`}
                defaultValue="18:00"
                step={1800}
                aria-label={`${name}, do`}
                className="rounded-lg border border-line px-2 py-2"
              />
            </div>
          ))}
        </div>
      </section>

      {state?.error && (
        <p className="rounded-lg bg-lacquer/10 p-3 text-sm text-lacquer-dark" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button name="intent" value="publish" disabled={pending} className={primaryButton}>
          {pending ? "Zapisuję…" : "Opublikuj ofertę"}
        </button>
        <button name="intent" value="draft" disabled={pending} className={secondaryButton}>
          Zapisz jako szkic
        </button>
      </div>
    </form>
  );
}

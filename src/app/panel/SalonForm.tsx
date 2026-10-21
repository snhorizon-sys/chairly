"use client";

import { useFormAction } from "@/components/useFormAction";
import { createSalon } from "./actions";
import { inputClass, labelClass, primaryButton } from "@/components/form";

export function SalonForm() {
  const [state, action, pending] = useFormAction(createSalon);

  return (
    <form onSubmit={action} className="grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
      <label className={`${labelClass} sm:col-span-2`}>
        <span className="text-muted">Nazwa salonu</span>
        <input name="name" required maxLength={120} className={inputClass} placeholder="np. Studio Lustro" />
      </label>
      <label className={labelClass}>
        <span className="text-muted">Miasto</span>
        <input name="city" required maxLength={80} className={inputClass} placeholder="Poznań" />
      </label>
      <label className={labelClass}>
        <span className="text-muted">Dzielnica</span>
        <input name="district" maxLength={80} className={inputClass} placeholder="Jeżyce" />
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        <span className="text-muted">Adres</span>
        <input name="address" maxLength={200} className={inputClass} placeholder="ul. Kraszewskiego 10" />
        <span className="text-xs text-muted">Pokażemy go dopiero po potwierdzeniu rezerwacji.</span>
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        <span className="text-muted">O salonie</span>
        <textarea name="description" rows={3} maxLength={2000} className={inputClass} placeholder="Klimat, parking, godziny otwarcia" />
      </label>
      {state?.error && (
        <p className="rounded-lg bg-lacquer/10 p-3 text-sm text-lacquer-dark sm:col-span-2" role="alert">
          {state.error}
        </p>
      )}
      <button disabled={pending} className={`${primaryButton} sm:col-span-2 sm:justify-self-start`}>
        {pending ? "Zapisuję…" : "Zapisz salon"}
      </button>
    </form>
  );
}

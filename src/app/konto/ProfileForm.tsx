"use client";

import { useFormAction } from "@/components/useFormAction";
import { updateProfile } from "./actions";
import { SPECIALTIES } from "@/data/listings";
import { inputClass, labelClass, primaryButton } from "@/components/form";

type Props = {
  fullName: string;
  phone: string;
  bio: string;
  specialties: string[];
  email: string;
  hasInsurance?: boolean;
};

export function ProfileForm({ fullName, phone, bio, specialties, email, hasInsurance = false }: Props) {
  const [state, action, pending] = useFormAction(updateProfile);

  return (
    <form onSubmit={action} className="grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
      <label className={labelClass}>
        <span className="text-muted">Imię i nazwisko</span>
        <input name="full_name" defaultValue={fullName} required maxLength={120} className={inputClass} />
      </label>
      <label className={labelClass}>
        <span className="text-muted">Telefon</span>
        <input name="phone" type="tel" defaultValue={phone} maxLength={30} className={inputClass} />
        <span className="text-xs text-muted">Widoczny tylko dla salonu po potwierdzeniu rezerwacji.</span>
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        <span className="text-muted">E-mail</span>
        <input value={email} disabled className={inputClass} />
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm text-muted">Twoje specjalizacje</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => (
            <label key={s} className="cursor-pointer">
              <input
                type="checkbox"
                name="specialties"
                value={s}
                defaultChecked={specialties.includes(s)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-line px-3 py-1.5 text-sm peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-lacquer">
                {s}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="has_insurance" defaultChecked={hasInsurance} className="h-4 w-4 accent-lacquer" />
        Mam ubezpieczenie OC w zakresie wykonywanych usług
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        <span className="text-muted">O mnie</span>
        <textarea
          name="bio"
          rows={4}
          defaultValue={bio}
          maxLength={1500}
          className={inputClass}
          placeholder="Doświadczenie, certyfikaty, z jakimi markami pracujesz"
        />
        <span className="text-xs text-muted">Salon zobaczy to przed akceptacją rezerwacji.</span>
      </label>

      {state?.error && (
        <p className="rounded-lg bg-lacquer/10 p-3 text-sm text-lacquer-dark sm:col-span-2" role="alert">
          {state.error}
        </p>
      )}
      {state?.message && (
        <p className="rounded-lg bg-sage/15 p-3 text-sm text-sage sm:col-span-2" role="status">
          {state.message}
        </p>
      )}

      <button disabled={pending} className={`${primaryButton} sm:col-span-2 sm:justify-self-start`}>
        {pending ? "Zapisuję…" : "Zapisz profil"}
      </button>
    </form>
  );
}

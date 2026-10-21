/** Wspólne style pól formularzy */
export const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-base outline-none focus:border-ink disabled:opacity-60";

export const labelClass = "flex flex-col gap-1 text-sm";

export const primaryButton =
  "rounded-xl bg-lacquer px-5 py-3 font-medium text-paper hover:bg-lacquer-dark disabled:opacity-60";

export const secondaryButton =
  "rounded-xl border border-line bg-paper px-5 py-3 font-medium hover:border-ink disabled:opacity-60";

export type FormState = { error?: string; message?: string } | undefined;

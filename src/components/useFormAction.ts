"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { FormState } from "./form";

/**
 * Jak useActionState, ale formularz NIE jest czyszczony po wysłaniu
 * (przy błędzie użytkownik nie traci wpisanych danych).
 */
export function useFormAction(action: (prev: FormState, fd: FormData) => Promise<FormState>) {
  const [state, dispatch, pending] = useActionState(action, undefined);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const fd = new FormData(e.currentTarget, submitter);
    startTransition(() => dispatch(fd));
  }

  return [state, onSubmit, pending] as const;
}

"use client";

import { useSyncExternalStore, type MouseEvent } from "react";

const KEY = "chairly:favorites";
const EVENT = "chairly:favorites-changed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

const getServerSnapshot = () => "[]";

function parse(raw: string): string[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.map(String) : [];
  } catch {
    return [];
  }
}

/** Serduszko „zapisz na później”. Na razie ulubione są zapamiętywane tylko w tej przeglądarce. */
export function HeartButton({ id, label }: { id: string; label: string }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const on = parse(raw).includes(id);

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const current = parse(getSnapshot());
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // brak dostępu do pamięci przeglądarki – serduszko po prostu nie zostanie zapamiętane
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? `Usuń z zapisanych: ${label}` : `Zapisz: ${label}`}
      className="flex h-9 w-9 items-center justify-center rounded-full text-paper hover:scale-110"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
        <path
          d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.7 3.6 4.5 6.9 4.5c2 0 3.4 1.1 5.1 3 1.7-1.9 3.1-3 5.1-3 3.3 0 5.3 3.2 4.1 6.6-1.7 4.8-9.2 9.4-9.2 9.4z"
          fill={on ? "var(--color-lacquer)" : "rgba(0,0,0,0.45)"}
          stroke="#fff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

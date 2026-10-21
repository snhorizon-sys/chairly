"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

/** Nagłówek sekcji ze strzałkami i poziomo przewijany rząd kart. */
export function ScrollRow({ title, href, children }: { title: string; href: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  const arrow =
    "flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-lg leading-none hover:border-ink hover:shadow-sm";

  return (
    <section className="mt-12 first:mt-0">
      <div className="flex items-center justify-between gap-4">
        <Link href={href} className="group inline-flex items-center gap-2 text-xl font-semibold sm:text-2xl">
          <h2 className="text-xl sm:text-2xl">{title}</h2>
          <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-porcelain group-hover:bg-line">
            →
          </span>
        </Link>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label="Przewiń w lewo" className={arrow}>
            ‹
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Przewiń w prawo" className={arrow}>
            ›
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="no-scrollbar -mx-4 mt-5 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {children}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { fmtHour, statusAt } from "@/lib/availability";
import type { MapPoint } from "./types";

// Darmowe kafelki bez klucza API. Docelowo można podmienić na MapTiler z własnym stylem.
const STYLE_URL = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? "https://tiles.openfreemap.org/styles/positron";

type Props = {
  points: MapPoint[];
  hour: number;
  duration: number;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
};

const BASE =
  "cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-bold tabular-nums shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lacquer";

function markerLook(p: MapPoint, hour: number, duration: number, active: boolean) {
  const s = statusAt(p.freeToday, hour, duration);
  const scale = active ? " scale-110" : "";
  if (active) {
    const text = s.kind === "free" ? `do ${fmtHour(s.until)}` : s.kind === "later" ? `od ${fmtHour(s.from)}` : p.priceShort;
    return { cls: `${BASE} bg-ink text-paper z-10${scale}`, text, label: `${p.title}: ${text}` };
  }
  if (s.kind === "free")
    return { cls: `${BASE} bg-sage text-paper`, text: `do ${fmtHour(s.until)}`, label: `${p.title}: wolne do ${fmtHour(s.until)}` };
  if (s.kind === "later")
    return {
      cls: `${BASE} border-[1.5px] border-[#c3c9d1] bg-paper text-muted shadow-none`,
      text: `od ${fmtHour(s.from)}`,
      label: `${p.title}: wolne od ${fmtHour(s.from)}`,
    };
  return {
    cls: "block h-3.5 w-3.5 cursor-pointer rounded-full border-2 border-paper bg-[#aab1bb] shadow focus-visible:outline-2 focus-visible:outline-lacquer",
    text: "",
    label: `${p.title}: dziś brak wolnych godzin`,
  };
}

export function OffersMap({ points, hour, duration, selectedId, hoveredId, onSelect }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef(new Map<string, { marker: Marker; el: HTMLButtonElement }>());
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Mapa tworzona raz; MapLibre ładujemy dopiero w przeglądarce
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !box.current) return;
      const m = new maplibregl.Map({
        container: box.current,
        style: STYLE_URL,
        center: [16.925, 52.406],
        zoom: 12,
        attributionControl: { compact: true },
      });
      m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      m.on("click", () => onSelectRef.current(null));
      map.current = m;

      for (const p of points) {
        // Zewnętrzny element należy do MapLibre (pozycjonowanie), przycisk w środku stylujemy sami
        const wrap = document.createElement("div");
        const el = document.createElement("button");
        el.type = "button";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectRef.current(p.id);
        });
        wrap.appendChild(el);
        const marker = new maplibregl.Marker({ element: wrap, anchor: "bottom" }).setLngLat([p.lng, p.lat]).addTo(m);
        markers.current.set(p.id, { marker, el });
      }

      const fit = () => {
        m.resize();
        if (points.length > 1) {
        const lngs = points.map((p) => p.lng);
        const lats = points.map((p) => p.lat);
        m.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: { top: 90, bottom: 190, left: 70, right: 70 }, maxZoom: 14, duration: 0 },
        );
        } else if (points.length === 1) {
          m.jumpTo({ center: [points[0].lng, points[0].lat], zoom: 14 });
        }
      };
      fit();
      m.once("load", fit);
      window.dispatchEvent(new Event("chairly-map-ready"));
    })();
    const current = markers.current;
    return () => {
      cancelled = true;
      current.forEach(({ marker }) => marker.remove());
      current.clear();
      map.current?.remove();
      map.current = null;
    };
    // punkty zmieniają się tylko przy zmianie filtrów (nowy render strony)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wygląd pinezek zależy od godziny, czasu trwania i zaznaczenia
  useEffect(() => {
    const paint = () => {
      for (const p of points) {
        const m = markers.current.get(p.id);
        if (!m) continue;
        const look = markerLook(p, hour, duration, p.id === selectedId || p.id === hoveredId);
        m.el.className = look.cls;
        m.el.textContent = look.text;
        m.el.setAttribute("aria-label", look.label);
        m.el.setAttribute("aria-pressed", String(p.id === selectedId));
        m.marker.getElement().style.zIndex = p.id === selectedId || p.id === hoveredId ? "5" : "1";
      }
    };
    paint();
    window.addEventListener("chairly-map-ready", paint);
    return () => window.removeEventListener("chairly-map-ready", paint);
  }, [points, hour, duration, selectedId, hoveredId]);

  // Przesuń mapę do wybranej oferty
  useEffect(() => {
    const p = points.find((x) => x.id === selectedId);
    if (p && map.current) map.current.easeTo({ center: [p.lng, p.lat], duration: 400 });
  }, [selectedId, points]);

  return <div ref={box} className="h-full w-full" aria-label="Mapa ofert" role="region" />;
}

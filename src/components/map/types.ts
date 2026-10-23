/** Dane jednej oferty potrzebne mapie i liście obok niej */
export type MapPoint = {
  id: string;
  title: string;
  salon: string;
  place: string; // dzielnica lub miasto
  typeLabel: string;
  lat: number;
  lng: number;
  freeToday: [number, number][];
  priceShort: string; // np. "35 zł/h"
  tone: string;
  rating: number;
  reviews: number;
};

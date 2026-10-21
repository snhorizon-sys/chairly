import { SPECIALTIES, TYPE_LABEL } from "@/data/listings";

const input = "w-full rounded-lg border border-line bg-paper px-3 py-2.5 outline-none focus:border-ink";

export default function ForSalonsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
        Zarabiaj na fotelach, które dziś stoją puste.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Ustawiasz godziny, cenę i zasady. Najemczynie płacą z góry, a Ty dostajesz wypłatę po każdej wizycie, pomniejszoną
        o prowizję.
      </p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {[
          ["Ty decydujesz kto", "Widzisz profil, certyfikaty i opinie najemczyni, zanim zaakceptujesz pierwszą rezerwację."],
          ["Płatność z góry", "Kaucja i przedpłata online. Odwołanie w ostatniej chwili nie zostawia Cię z pustym fotelem."],
          ["Umowa w pakiecie", "Wzór umowy najmu stanowiska uzupełnia się sam danymi z obu profili."],
        ].map(([t, d]) => (
          <div key={t} className="bg-paper p-6">
            <h2 className="text-lg font-semibold">{t}</h2>
            <p className="mt-2 text-muted">{d}</p>
          </div>
        ))}
      </div>

      <section id="dodaj" className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h2 className="text-3xl font-bold">Dodaj ofertę</h2>
          <p className="mt-3 text-muted">
            Zajmie to kilka minut. Zdjęcia i kalendarz dostępności dodasz w kolejnym kroku.
          </p>
        </div>
        <form className="grid gap-4 rounded-2xl border border-line bg-paper p-6 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-muted">Nazwa salonu</span>
            <input className={input} placeholder="np. Studio Lustro" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Miasto</span>
            <input className={input} placeholder="Poznań" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Rodzaj miejsca</span>
            <select className={input}>
              {Object.entries(TYPE_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm text-muted">Dla jakich specjalizacji</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => (
                <label key={s} className="cursor-pointer">
                  <input type="checkbox" className="peer sr-only" />
                  <span className="inline-block rounded-full border border-line px-3 py-1.5 text-sm peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-lacquer">
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Cena za godzinę (zł)</span>
            <input type="number" className={input} placeholder="35" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">Cena za dzień (zł)</span>
            <input type="number" className={input} placeholder="220" />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-muted">Opis</span>
            <textarea rows={4} className={input} placeholder="Co wyróżnia stanowisko, co jest w cenie, zasady korzystania" />
          </label>
          <button
            type="button"
            className="rounded-xl bg-lacquer px-5 py-3 font-medium text-paper hover:bg-lacquer-dark sm:col-span-2 sm:justify-self-start"
          >
            Zapisz i przejdź do zdjęć
          </button>
        </form>
      </section>
    </div>
  );
}

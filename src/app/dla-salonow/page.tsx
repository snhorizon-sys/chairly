import Link from "next/link";

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

      <section id="dodaj" className="mt-16 grid gap-8 rounded-3xl bg-ink p-8 text-paper sm:p-10 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Dodaj salon w kilka minut</h2>
          <ol className="mt-5 space-y-2 text-paper/80">
            <li>1. Załóż konto salonu.</li>
            <li>2. Uzupełnij nazwę, miasto i opis salonu.</li>
            <li>3. Dodaj stanowiska z cenami i grafikiem tygodniowym.</li>
          </ol>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/logowanie?tryb=rejestracja&rola=host&next=/panel"
            className="rounded-xl bg-lacquer px-5 py-3 text-center font-medium hover:bg-lacquer-dark"
          >
            Załóż konto salonu
          </Link>
          <Link href="/logowanie?next=/panel" className="text-center text-sm text-paper/80 underline underline-offset-4">
            Mam już konto
          </Link>
        </div>
      </section>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useReveal } from "@/hooks/use-reveal";
import logoImg from "@/assets/rolling-car-logo-transparent.png";
import nightBackgroundImg from "@/assets/marrakech-night-background.png";
import aboutTucsonImg from "@/assets/about-tucson.png";
import daciaImg from "@/assets/dacia-logan.jpg";
import clioImg from "@/assets/renault-clio.jpg";
import tucsonImg from "@/assets/hyundai-tucson.jpg";
import { isLoggedIn, isVehicleAvailable, vehicles as getAdminVehicles } from "@/lib/admin-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rouling Car — Location de Voitures à Rabat, Maroc" },
      { name: "description", content: "Louez Dacia Logan, Renault Clio 5, Hyundai Tucson et plus à Rabat. Réservation WhatsApp instantanée avec Rouling Car." },
      { property: "og:title", content: "Rouling Car — Location de Voitures à Rabat" },
      { property: "og:description", content: "Réservez votre voiture à Rabat en quelques secondes via WhatsApp." },
      { property: "og:image", content: nightBackgroundImg },
      { name: "twitter:image", content: nightBackgroundImg },
    ],
  }),
  component: Index,
});

const PHONES = ["+212 661 213 700", "+212 661 757 405"] as const;
const WHATSAPP_NUMBER = "212661213700"; // primary

type Car = {
  id: string;
  name: string;
  model: string;
  category: string;
  image: string;
  price: number;
  seats: number;
  transmission: "Manuelle" | "Automatique";
  fuel: "Essence" | "Diesel";
  ac: boolean;
  status: "Disponible" | "Réservé" | "Indisponible" | "Maintenance";
};

const cars: Car[] = [
  { id: "logan", name: "Dacia Logan", model: "2024", category: "Économique", image: daciaImg, price: 200, seats: 5, transmission: "Manuelle", fuel: "Diesel", ac: true, status: "Disponible" },
  { id: "clio", name: "Renault Clio 5", model: "2024", category: "Citadine", image: clioImg, price: 280, seats: 5, transmission: "Manuelle", fuel: "Essence", ac: true, status: "Disponible" },
  { id: "tucson", name: "Hyundai Tucson", model: "2024", category: "SUV", image: tucsonImg, price: 600, seats: 5, transmission: "Automatique", fuel: "Diesel", ac: true, status: "Disponible" },
];

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Index() {
  useReveal();
  const [reservedCar, setReservedCar] = useState<Car | null>(null);
  const [fleet, setFleet] = useState<Car[]>(cars);
  useEffect(() => {
    const syncFleet = () => setFleet(getAdminVehicles().filter((vehicle) => !vehicle.archived).map((vehicle) => ({ ...vehicle, model: vehicle.model || "—", ac: true })));
    syncFleet();
    window.addEventListener("rouling-data", syncFleet);
    return () => window.removeEventListener("rouling-data", syncFleet);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <TrustBadges />
      <Stats />
      <Fleet cars={fleet} onReserve={setReservedCar} />
      <Reserve />
      <WhyChooseUs />
      <Testimonials />
      <About />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
      {reservedCar && <ReservationModal car={reservedCar} onClose={() => setReservedCar(null)} />}
    </div>
  );
}

function Logo({ className = "h-12" }: { className?: string }) {
  return <img src={logoImg} alt="Rolling Car" className={className} />;
}

function Nav() {
  const [admin, setAdmin] = useState(false);
  useEffect(() => setAdmin(isLoggedIn()), []);
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
        <div className="glass rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Logo className="h-12 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-foreground/80">
            <a href="#fleet" className="hover:text-gold transition-colors">Notre Flotte</a>
            <a href="#reserve" className="hover:text-gold transition-colors">Réservation</a>
            <a href="#about" className="hover:text-gold transition-colors">À propos</a>
            <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
            {admin && <a href="/admin/dashboard" className="rounded-full border border-gold/30 px-3 py-1 text-gold">Admin</a>}
          </nav>
          <a
            href={waLink("Bonjour Rouling Car, je souhaite réserver une voiture.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:brightness-110 transition pulse-gold"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Réserver</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-36 pb-20 sm:pb-28 min-h-[94vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <img src={nightBackgroundImg} alt="" className="h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
      </div>

      {/* decorative spinning star (from logo motif) */}
      <div className="pointer-events-none absolute right-[-80px] top-24 opacity-20 anim-spin-slow">
        <StarMotif className="h-[420px] w-[420px] text-gold" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <div className="reveal inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-gold gold-border">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Agence à Rabat, Maroc
          </div>
          <h1 className="reveal reveal-delay-1 mt-5 max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02]">
            Roulez avec <span className="text-gradient-red">style</span>,<br/>
            <span className="text-gradient-gold">partout au Maroc.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg text-foreground/75">
            Rouling Car — votre partenaire de confiance pour la location de voitures à Rabat.
            Une flotte récente, des prix justes, une réservation en quelques secondes via WhatsApp.
          </p>
          <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-3">
            <a
              href={waLink("Bonjour Rouling Car, je souhaite réserver une voiture.")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 font-semibold hover:brightness-110 transition shadow-xl shadow-primary/35"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Réserver sur WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#fleet" className="inline-flex items-center gap-2 rounded-full glass gold-border px-7 py-4 font-semibold text-gold hover:bg-gold/10 transition">
              Voir la flotte
            </a>
          </div>

          <div className="reveal mt-10 flex flex-wrap gap-6 text-sm text-foreground/70">
            {[
              ["Livraison", "Aéroport & Hôtel"],
              ["Assurance", "Tous risques"],
              ["Kilométrage", "Illimité"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-gold" />
                <span><span className="text-foreground font-medium">{k}</span> — {v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative reveal reveal-delay-2">
          <div className="relative rounded-[2rem] glass gold-border p-4 sm:p-6 shadow-2xl shadow-black/40 anim-float">
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gold text-gold-foreground text-[11px] font-semibold tracking-wider">
              OFFRE DU JOUR
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white/95">
              <img src={tucsonImg} alt="Hyundai Tucson" className="w-full h-60 object-contain p-3" width={1024} height={1024} />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="text-xs text-gold uppercase tracking-widest">SUV Premium</div>
                <div className="font-display text-2xl font-bold">Hyundai Tucson</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gradient-gold">600 DH</div>
                <div className="text-xs text-muted-foreground">/ jour</div>
              </div>
            </div>
          </div>

          {/* driving line behind card */}
          <div className="absolute -bottom-6 left-0 right-0 h-px overflow-hidden opacity-40">
            <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent anim-drive" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    ["500+", "Clients satisfaits"],
    ["15+", "Véhicules récents"],
    ["24/7", "Service & assistance"],
    ["100%", "Réservation WhatsApp"],
  ];
  return (
    <section className="py-10 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(([n, l], i) => (
          <div key={l} className={`reveal reveal-delay-${(i % 3) + 1} text-center`}>
            <div className="text-3xl sm:text-4xl font-bold text-gradient-gold">{n}</div>
            <div className="mt-1 text-sm text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    ["Livraison gratuite", "Rabat, aéroport & hôtels", TruckIcon],
    ["Assurance incluse", "Roulez l'esprit léger", ShieldIcon],
    ["Réservation WhatsApp", "Réponse en quelques minutes", WhatsAppIcon],
    ["Véhicules récents", "Contrôlés et entretenus", SparkIcon],
    ["Assistance 24/7", "Toujours à vos côtés", HeadsetIcon],
    ["Prix transparents", "Aucun frais caché", Check],
  ] as const;
  return (
    <section className="relative z-10 -mt-8 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 overflow-hidden rounded-3xl glass gold-border shadow-2xl shadow-black/20">
          {badges.map(([title, copy, Icon]) => (
            <div key={title} className="group min-h-32 border-b border-r border-gold/15 p-4 sm:p-5 last:border-r-0 lg:border-b-0">
              <Icon className="h-5 w-5 text-gold transition-transform duration-300 group-hover:scale-110" />
              <div className="mt-3 text-sm font-semibold leading-tight">{title}</div>
              <div className="mt-1 text-[11px] leading-snug text-foreground/55">{copy}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fleet({ cars, onReserve }: { cars: Car[]; onReserve: (car: Car) => void }) {
  return (
    <section id="fleet" className="pb-0 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="reveal text-xs uppercase tracking-[0.25em] text-gold">Notre flotte</div>
          <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-bold">
            Des véhicules <span className="text-gradient-red">pour chaque trajet</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-foreground/70">
            Citadines économiques, berlines confortables et SUV polyvalents — choisissez la voiture
            qui correspond à votre voyage à Rabat et partout au Maroc.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((c, i) => (
            <CarCard key={c.name} car={c} delay={i} onReserve={onReserve} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CarCard({ car, delay, onReserve }: { car: Car; delay: number; onReserve: (car: Car) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const available = isVehicleAvailable({ ...car, description: "" }, today, today);
  const availability = available ? "Disponible aujourd’hui" : car.status === "Maintenance" ? "Maintenance" : car.status === "Indisponible" ? "Sur demande" : "Réservé";
  const msg = `Bonjour Rouling Car 👋,\nJe souhaite réserver la *${car.name}* (${car.price} DH/jour).\n\nDates : \nLieu de prise en charge : `;
  return (
    <article className={`reveal reveal-delay-${(delay % 3) + 1} group relative flex h-full flex-col rounded-[1.75rem] glass gold-border overflow-hidden shadow-xl shadow-black/20 hover:-translate-y-2 hover:border-gold/70 transition-all duration-500`}>
      <div className="relative h-64 overflow-hidden bg-secondary">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="relative z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-background/70 gold-border text-gold">
          {car.category}
        </span>
        <span className={`absolute top-3 right-3 z-10 rounded-full px-3 py-1.5 text-[10px] font-bold shadow-lg ring-1 ${available ? "bg-emerald-600 text-white shadow-emerald-950/50 ring-emerald-300/60" : "bg-red-600 text-white shadow-red-950/50 ring-red-300/60"}`}>{availability}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-end justify-between">
          <div><h3 className="font-display text-xl font-bold">{car.name}</h3><div className="mt-0.5 text-xs font-medium text-gold">Modèle : {car.model || "—"}</div></div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient-gold">{car.price} <span className="text-sm">DH</span></div>
            <div className="text-[11px] text-muted-foreground">/ jour</div>
          </div>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-foreground/75">
          <li className="flex items-center gap-2"><UsersIcon className="h-3.5 w-3.5 text-gold" /> {car.seats} places</li>
          <li className="flex items-center gap-2"><GearIcon className="h-3.5 w-3.5 text-gold" /> {car.transmission}</li>
          <li className="flex items-center gap-2"><FuelIcon className="h-3.5 w-3.5 text-gold" /> {car.fuel}</li>
          <li className="flex items-center gap-2"><SnowIcon className="h-3.5 w-3.5 text-gold" /> Climatisation</li>
        </ul>
        <button
          type="button"
          onClick={() => onReserve(car)}
          className="mt-6 inline-flex w-full justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:brightness-110 transition shadow-lg shadow-primary/20"
        >
          <WhatsAppIcon className="h-4 w-4" /> {available ? "Réserver sur WhatsApp" : "Demander une alternative"}
        </button>
      </div>
    </article>
  );
}

function Reserve() {
  return (
    <section id="reserve" className="pb-24 pt-0 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div>
            <div className="reveal text-xs uppercase tracking-[0.25em] text-gold">Réservation</div>
            <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-bold">
              Réservez en <span className="text-gradient-gold">3 étapes</span>
            </h2>
            <ol className="mt-10 grid gap-4">
              {[
                ["Choisissez votre voiture", "Parcourez notre flotte et sélectionnez le véhicule adapté à vos besoins."],
                ["Envoyez-nous un message WhatsApp", "Cliquez sur Réserver, indiquez vos dates et le lieu de prise en charge."],
                ["Récupérez les clés", "Livraison gratuite à Rabat (aéroport, hôtel, gare). Bonne route !"],
              ].map(([t, d], i) => (
                <li key={t} className={`reveal reveal-delay-${(i % 3) + 1} flex gap-5 rounded-3xl glass gold-border p-5`}>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold text-xl text-gold-foreground font-bold font-display shadow-lg shadow-gold/15">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{t}</div>
                    <p className="text-sm text-foreground/70 mt-1">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
        </div>
      </div>
    </section>
  );
}

function BookingForm() {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [car, setCar] = useState(cars[0].name);
  const [pickup, setPickup] = useState(today);
  const [ret, setRet] = useState(tomorrow);
  const [location, setLocation] = useState("Aéroport Rabat-Salé");
  const [name, setName] = useState("");

  const { days, total } = useMemo(() => {
    const p = new Date(pickup).getTime();
    const r = new Date(ret).getTime();
    const d = Math.max(1, Math.ceil((r - p) / 86400000));
    const price = cars.find((c) => c.name === car)?.price ?? 0;
    return { days: d, total: d * price };
  }, [car, pickup, ret]);

  const fmt = (s: string) =>
    new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const message = [
    `Bonjour Rouling Car 👋`,
    name ? `Je suis ${name}.` : ``,
    `Je souhaite réserver la *${car}*.`,
    `📅 Prise en charge : ${fmt(pickup)}`,
    `📅 Retour : ${fmt(ret)}`,
    `📍 Lieu : ${location}`,
    `⏱️ Durée : ${days} jour(s)`,
    `💰 Total estimé : ${total} DH`,
  ]
    .filter(Boolean)
    .join("\n");

  const invalid = new Date(ret) <= new Date(pickup);

  return (
    <div className="reveal reveal-delay-2 rounded-3xl glass gold-border p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-whatsapp/15 grid place-items-center">
          <WhatsAppIcon className="h-6 w-6 text-whatsapp" />
        </div>
        <div>
          <div className="font-display text-2xl font-bold">Réservation rapide</div>
          <div className="text-xs text-muted-foreground">Sélectionnez vos dates — envoi via WhatsApp</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Véhicule">
          <select
            value={car}
            onChange={(e) => setCar(e.target.value)}
            className="input-base"
          >
            {cars.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} — {c.price} DH/j
              </option>
            ))}
          </select>
        </Field>
        <Field label="Lieu de prise en charge">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-base"
            placeholder="Aéroport, hôtel, gare…"
          />
        </Field>
        <Field label="Date de prise en charge">
          <input
            type="date"
            min={today}
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="input-base"
          />
        </Field>
        <Field label="Date de retour">
          <input
            type="date"
            min={pickup}
            value={ret}
            onChange={(e) => setRet(e.target.value)}
            className="input-base"
          />
        </Field>
        <Field label="Votre nom (optionnel)" className="sm:col-span-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base"
            placeholder="Ex. Yassine B."
          />
        </Field>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-secondary/60 gold-border px-5 py-4">
        <div className="text-sm text-foreground/70">
          {days} jour(s) × {cars.find((c) => c.name === car)?.price} DH
        </div>
        <div className="text-2xl font-bold text-gradient-gold">{total} DH</div>
      </div>

      <a
        href={invalid ? undefined : waLink(message)}
        target="_blank"
        rel="noreferrer"
        aria-disabled={invalid}
        onClick={(e) => invalid && e.preventDefault()}
        className={`mt-5 inline-flex w-full justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-semibold transition shadow-lg shadow-primary/30 ${invalid ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"}`}
      >
        <WhatsAppIcon className="h-5 w-5" />
        {invalid ? "Choisissez une date de retour valide" : "Réserver sur WhatsApp"}
      </a>

      <div className="mt-4 space-y-2">
        {PHONES.map((p) => (
          <a
            key={p}
            href={`tel:${p.replace(/\s/g, "")}`}
            className="flex items-center justify-between rounded-xl bg-secondary/40 hover:bg-secondary px-4 py-2.5 text-sm transition"
          >
            <span className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-gold" />
              {p}
            </span>
            <span className="text-xs text-muted-foreground">Appeler</span>
          </a>
        ))}
      </div>
      <div className="mt-4 text-sm text-foreground/70 flex items-start gap-2">
        <MapPin className="h-4 w-4 text-gold mt-0.5" />
        Rabat, Maroc — Livraison gratuite à l'aéroport, à votre hôtel ou à la gare.
      </div>
    </div>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-foreground/70 mb-1.5 uppercase tracking-wider">
        {label}
      </span>
      {children}
    </label>
  );
}

function ReservationModal({ car, onClose }: { car: Car; onClose: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(tomorrow);
  const [pickup, setPickup] = useState("Rabat");
  const [returnLocation, setReturnLocation] = useState("Rabat");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const invalidDates = new Date(end) <= new Date(start);
  const days = invalidDates ? 0 : Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
  const total = days * car.price;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  const format = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const confirm = (event: React.FormEvent) => {
    event.preventDefault();
    if (invalidDates) return setError("La date de retour doit être après la date de départ.");
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !pickup.trim() || !returnLocation.trim()) return setError("Merci de renseigner tous les champs obligatoires.");
    const message = [
      "Bonjour Rouling Car,", "", "Je souhaite réserver ce véhicule :", "",
      `🚗 Véhicule : ${car.name}`, `🏷️ Catégorie : ${car.category}`, `⛽ Carburant : ${car.fuel}`, `⚙️ Transmission : ${car.transmission}`, "",
      `📅 Date de départ : ${format(start)}`, `📅 Date de retour : ${format(end)}`, `📍 Lieu de prise en charge : ${pickup}`, `📍 Lieu de retour : ${returnLocation}`, "",
      `💰 Prix : ${car.price} DH / jour`, `🧾 Durée : ${days} jours`, `✅ Total TTC : ${total} DH`, "",
      `👤 Client : ${firstName} ${lastName}`, `📞 Téléphone : ${phone}`,
      email.trim() ? `📧 Email : ${email.trim()}` : "", "", "Merci de confirmer la disponibilité."
    ].filter(Boolean).join("\n");
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Réserver ${car.name}`}>
      <div className="modal-in w-full max-w-3xl overflow-hidden rounded-t-[2rem] border border-gold/30 bg-card shadow-2xl shadow-black/70 sm:max-h-[90vh] sm:rounded-[2rem]">
        <div className="flex items-start justify-between bg-gradient-to-br from-red-700 via-primary to-red-950 px-6 py-6 sm:px-8">
          <div><h2 className="text-2xl font-bold text-white">Réserver — {car.name}</h2><p className="mt-1 text-sm text-white/75">Confirmation immédiate · Livraison rapide</p></div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid h-10 w-10 place-items-center rounded-full bg-black/20 text-2xl text-white transition hover:bg-black/35">×</button>
        </div>
        <form onSubmit={confirm} className="max-h-[calc(90vh-104px)] overflow-y-auto p-5 sm:p-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-gold/20 bg-secondary/55 p-4 sm:flex-row sm:items-center">
            <div className="h-24 w-full rounded-2xl bg-white/95 sm:w-36"><img src={car.image} alt={car.name} className="h-full w-full object-contain p-2" /></div>
            <div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xl font-bold">{car.name}</h3><div className="text-xl font-bold text-gradient-gold">{car.price} DH <span className="text-xs text-foreground/60">/ jour</span></div></div><p className="mt-1 text-sm text-gold">{car.category}</p><p className="mt-2 text-xs text-foreground/65">{car.fuel} · {car.transmission} · {car.seats} places</p></div>
          </div>
          <div className="mt-7"><h3 className="text-lg font-bold">Dates & lieu</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Date de départ"><input required type="date" min={today} value={start} onChange={e=>setStart(e.target.value)} className="input-base" /></Field><Field label="Date de retour"><input required type="date" min={start} value={end} onChange={e=>setEnd(e.target.value)} className="input-base" /></Field><Field label="Lieu de prise en charge"><input required value={pickup} onChange={e=>setPickup(e.target.value)} className="input-base" placeholder="Rabat, Aéroport, Hôtel, Gare…" /></Field><Field label="Lieu de retour"><input required value={returnLocation} onChange={e=>setReturnLocation(e.target.value)} className="input-base" placeholder="Rabat, Aéroport, Hôtel, Gare…" /></Field></div></div>
          <div className="mt-5 rounded-2xl border border-gold/25 bg-gold/10 px-5 py-4"><div className="flex items-center justify-between text-sm text-foreground/70"><span>{days || "—"} jour{days > 1 ? "s" : ""} × {car.price} DH</span><span className="text-xs uppercase tracking-wider text-gold">Total TTC</span></div><div className="mt-1 text-right text-3xl font-bold text-gradient-gold">{total.toLocaleString("fr-MA")} DH</div></div>
          <div className="mt-7"><h3 className="text-lg font-bold">Vos informations</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Prénom"><input required value={firstName} onChange={e=>setFirstName(e.target.value)} className="input-base" /></Field><Field label="Nom"><input required value={lastName} onChange={e=>setLastName(e.target.value)} className="input-base" /></Field><Field label="Téléphone"><input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="input-base" placeholder="+212 …" /></Field><Field label="Email (optionnel)"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input-base" placeholder="vous@email.com" /></Field></div></div>
          {error && <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
          <button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-white shadow-xl shadow-primary/30 transition hover:brightness-110">🚗 Confirmer la réservation</button>
          <p className="mt-3 text-center text-xs text-foreground/60">✅ Confirmation par WhatsApp · Aucun paiement requis maintenant</p>
        </form>
      </div>
    </div>
  );
}

function About() {
  const features = [
    ["Flotte récente", "Véhicules entretenus et révisés régulièrement."],
    ["Tarifs transparents", "Aucun frais caché, kilométrage illimité."],
    ["Assurance incluse", "Tous risques pour rouler l'esprit tranquille."],
    ["Livraison gratuite", "Aéroport de Rabat-Salé, hôtels et gare."],
  ];
  return (
    <section id="about" className="py-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <div className="relative rounded-3xl overflow-hidden gold-border">
            <img src={aboutTucsonImg} alt="Hyundai Tucson de Rouling Car" className="w-full h-[420px] object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <Logo className="h-12 w-auto" />
              <div className="text-right">
                <div className="text-xs text-gold uppercase tracking-widest">Depuis Rabat</div>
                <div className="font-display text-xl">Location premium</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="reveal text-xs uppercase tracking-[0.25em] text-gold">À propos</div>
          <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-bold">
            Une agence <span className="text-gradient-red">marocaine</span> à votre service
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-foreground/70">
            Basée à Rabat, Rouling Car vous accompagne dans tous vos déplacements — qu'il s'agisse d'un
            voyage d'affaires, d'une escapade en famille ou d'un road-trip à travers le Maroc.
            Notre équipe est à votre écoute pour vous offrir une expérience simple, rapide et fiable.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={f[0]} className={`reveal reveal-delay-${(i % 3) + 1} rounded-2xl glass gold-border p-4`}>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gold" />
                  <div className="font-semibold">{f[0]}</div>
                </div>
                <div className="mt-1 text-sm text-foreground/70">{f[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    ["Une expérience sans friction", "De la réservation à la remise des clés, tout est simple, rapide et humain.", SparkIcon],
    ["Une flotte fiable", "Des véhicules récents, vérifiés et préparés avec le plus grand soin.", ShieldIcon],
    ["La flexibilité marocaine", "Livraison à l'aéroport, à votre hôtel ou à la gare de Rabat.", TruckIcon],
    ["Un service qui répond", "Une équipe locale disponible sur WhatsApp pour vous accompagner.", HeadsetIcon],
  ] as const;
  return (
    <section className="py-24 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="reveal text-xs uppercase tracking-[0.25em] text-gold">L'expérience Rouling Car</div>
          <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-bold">Pourquoi choisir <span className="text-gradient-red">Rouling Car ?</span></h2>
          <p className="reveal reveal-delay-2 mt-4 text-foreground/70">Une location de voiture pensée pour vous laisser profiter du Maroc, en toute confiance.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([title, copy, Icon], i) => (
            <article key={title} className={`reveal reveal-delay-${(i % 3) + 1} rounded-3xl glass gold-border p-6 transition hover:-translate-y-1 hover:bg-secondary/60`}>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/10 ring-1 ring-gold/30"><Icon className="h-6 w-6 text-gold" /></div>
              <h3 className="mt-6 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    ["Yassine B.", "Rabat", "Service impeccable, voiture très propre et livraison directement à l'aéroport. Je recommande sans hésiter."],
    ["Sarah M.", "France", "Réservation ultra simple sur WhatsApp. L'équipe était ponctuelle et très professionnelle du début à la fin."],
    ["Omar E.", "Casablanca", "Tarifs clairs, aucun supplément surprise et une Clio en excellent état. Une vraie agence de confiance."],
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><div className="reveal text-xs uppercase tracking-[0.25em] text-gold">Ils nous font confiance</div><h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-bold">Des trajets qui laissent <span className="text-gradient-gold">un bon souvenir.</span></h2></div>
          <div className="reveal text-sm text-foreground/60">4.9/5 · Avis clients</div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {reviews.map(([name, city, copy], i) => (
            <figure key={name} className={`reveal reveal-delay-${(i % 3) + 1} rounded-3xl glass gold-border p-7`}>
              <div className="flex gap-1 text-gold" aria-label="5 étoiles">★★★★★</div>
              <blockquote className="mt-5 text-lg leading-relaxed text-foreground/85">“{copy}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-white">{name[0]}</div><div><div className="font-semibold">{name}</div><div className="text-xs text-foreground/55">Client Rouling Car · {city}</div></div></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const questions = [
    ["Quels documents sont nécessaires pour louer une voiture ?", "Une pièce d'identité ou passeport, un permis de conduire valide et les informations de votre réservation suffisent."],
    ["Puis-je être livré à l'aéroport de Rabat-Salé ?", "Oui. Nous proposons la livraison à l'aéroport, à votre hôtel et à la gare à Rabat."],
    ["L'assurance est-elle incluse ?", "Oui, nos locations incluent une couverture d'assurance. Notre équipe vous explique les conditions lors de la réservation."],
    ["Comment réserver ?", "Choisissez votre véhicule puis envoyez-nous vos dates sur WhatsApp. Nous vous confirmons rapidement la disponibilité."],
  ];
  return (
    <section className="py-24 border-t border-border/60">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center"><div className="reveal text-xs uppercase tracking-[0.25em] text-gold">Questions fréquentes</div><h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-bold">Tout est <span className="text-gradient-red">clair.</span></h2></div>
        <div className="mt-10 space-y-3">
          {questions.map(([q, a], i) => <details key={q} className={`reveal reveal-delay-${(i % 3) + 1} group rounded-2xl glass gold-border px-5 py-1`}><summary className="cursor-pointer list-none py-5 pr-8 font-semibold marker:content-none"><span>{q}</span><span className="float-right text-gold transition group-open:rotate-45">+</span></summary><p className="pb-5 pr-6 text-sm leading-relaxed text-foreground/70">{a}</p></details>)}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass gold-border overflow-hidden grid lg:grid-cols-2">
          <div className="p-10 lg:p-14">
            <div className="reveal text-xs uppercase tracking-[0.25em] text-gold">Contact</div>
            <h2 className="reveal reveal-delay-1 mt-3 text-4xl font-bold">Parlons de votre prochain trajet</h2>
            <p className="reveal reveal-delay-2 mt-3 text-foreground/70">
              Notre équipe répond en quelques minutes sur WhatsApp.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold mt-1" />
                <div>
                  <div className="font-semibold">Adresse</div>
                  <div className="text-foreground/70">Rabat, Maroc</div>
                </div>
              </li>
              {PHONES.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <PhoneIcon className="h-5 w-5 text-gold mt-1" />
                  <div>
                    <div className="font-semibold">Téléphone</div>
                    <a href={`tel:${p.replace(/\s/g, "")}`} className="text-foreground/80 hover:text-gold transition">{p}</a>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 text-gold mt-1" />
                <div><div className="font-semibold">Horaires</div><div className="text-foreground/70">Tous les jours · 08:00 — 22:00</div></div>
              </li>
            </ul>

            <a
              href={waLink("Bonjour Rouling Car, je souhaite plus d'informations.")}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-semibold hover:brightness-110 transition shadow-lg shadow-primary/30"
            >
              <WhatsAppIcon className="h-5 w-5" /> Discutons sur WhatsApp
            </a>
            <div className="mt-6 flex items-center gap-3 text-sm text-foreground/60"><span>Suivez-nous</span><a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-gold/30 px-3 py-1.5 hover:text-gold">Instagram</a><a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-gold/30 px-3 py-1.5 hover:text-gold">Facebook</a></div>
          </div>
          <div className="min-h-[420px] relative bg-secondary/40">
            <iframe
              title="Rouling Car à Rabat"
              src="https://www.google.com/maps?q=Rabat,+Maroc&output=embed"
              className="absolute inset-0 h-full w-full grayscale-[40%] contrast-110"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/55 via-transparent to-transparent ring-1 ring-inset ring-gold/20" />
            <div className="absolute bottom-6 left-6 rounded-2xl glass gold-border px-4 py-3"><div className="text-xs uppercase tracking-widest text-gold">Notre agence</div><div className="mt-1 font-semibold">Rabat, Maroc</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-auto" />
        </div>
        <div className="text-sm text-foreground/60">
          © {new Date().getFullYear()} Rouling Car — Location de voitures à Rabat, Maroc.
        </div>
        <div className="flex items-center gap-3 text-sm">
          {PHONES.map((p) => (
            <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="text-foreground/70 hover:text-gold transition">
              {p}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Bonjour Rouling Car 👋")}
      target="_blank"
      rel="noreferrer"
      aria-label="Réserver sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 grid place-items-center rounded-full bg-whatsapp text-white shadow-2xl shadow-whatsapp/40 pulse-gold hover:scale-110 transition"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

/* ---------- Icons (inline SVG, no extra deps) ---------- */
function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d="M19.11 17.55c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.15-1.33-.79-.71-1.32-1.58-1.48-1.85-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.14-.61-1.46-.83-2-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27 0 1.34.97 2.63 1.1 2.81.14.18 1.92 2.93 4.66 4.11.65.28 1.16.45 1.56.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.02 5.33c-5.9 0-10.69 4.79-10.69 10.69 0 1.88.5 3.72 1.44 5.33L5.33 26.67l5.5-1.42a10.65 10.65 0 0 0 5.18 1.34h.01c5.9 0 10.69-4.79 10.69-10.69 0-2.86-1.11-5.55-3.13-7.57a10.62 10.62 0 0 0-7.57-3.13zm0 19.51h-.01a8.84 8.84 0 0 1-4.5-1.23l-.32-.19-3.27.84.87-3.19-.21-.33a8.84 8.84 0 0 1-1.36-4.72c0-4.89 3.98-8.86 8.87-8.86 2.37 0 4.59.92 6.26 2.6a8.81 8.81 0 0 1 2.6 6.27c0 4.89-3.98 8.86-8.87 8.86z"/>
    </svg>
  );
}
function ArrowRight({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M5 12h14M13 5l7 7-7 7"/></svg>; }
function Check({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}><path d="M20 6L9 17l-5-5"/></svg>; }
function PhoneIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function MapPin({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function ShieldIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 3l7 3v5c0 5-3.4 8.7-7 10-3.6-1.3-7-5-7-10V6l7-3z"/><path d="m9 12 2 2 4-4"/></svg>; }
function TruckIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M3 5h11v11H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>; }
function HeadsetIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H6a2 2 0 0 1-2-2v-3zm16 0h-3v5h1a2 2 0 0 0 2-2v-3zM17 19c0 2-2 2-5 2"/></svg>; }
function SparkIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z"/></svg>; }
function ClockIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>; }
function UsersIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function GearIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function FuelIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M3 22h12V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18z"/><path d="M15 8h2a2 2 0 0 1 2 2v6a2 2 0 0 0 4 0V9l-3-3"/></svg>; }
function SnowIcon({ className = "" }: { className?: string }) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>; }
function StarMotif({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <g transform="translate(100 100)">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="-40" y="-40" width="80" height="80" transform={`rotate(${i * 45})`} opacity="0.4" />
        ))}
        <circle r="20" />
      </g>
    </svg>
  );
}

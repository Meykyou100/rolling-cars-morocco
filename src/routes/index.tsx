import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useReveal } from "@/hooks/use-reveal";
import logoAsset from "@/assets/logo.asset.json";
import heroImg from "@/assets/hero.jpg";
import daciaImg from "@/assets/dacia-logan.jpg";
import clioImg from "@/assets/renault-clio.jpg";
import tucsonImg from "@/assets/hyundai-tucson.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rouling Car — Location de Voitures à Rabat, Maroc" },
      { name: "description", content: "Louez Dacia Logan, Renault Clio 5, Hyundai Tucson et plus à Rabat. Réservation WhatsApp instantanée avec Rouling Car." },
      { property: "og:title", content: "Rouling Car — Location de Voitures à Rabat" },
      { property: "og:description", content: "Réservez votre voiture à Rabat en quelques secondes via WhatsApp." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Index,
});

const PHONES = ["+212 661 213 700", "+212 661 757 405"] as const;
const WHATSAPP_NUMBER = "212661213700"; // primary

type Car = {
  name: string;
  category: string;
  image: string;
  price: number;
  seats: number;
  transmission: "Manuelle" | "Automatique";
  fuel: "Essence" | "Diesel";
  ac: boolean;
};

const cars: Car[] = [
  { name: "Dacia Logan", category: "Économique", image: daciaImg, price: 200, seats: 5, transmission: "Manuelle", fuel: "Diesel", ac: true },
  { name: "Renault Clio 5", category: "Citadine", image: clioImg, price: 280, seats: 5, transmission: "Manuelle", fuel: "Essence", ac: true },
  { name: "Hyundai Tucson", category: "SUV", image: tucsonImg, price: 600, seats: 5, transmission: "Automatique", fuel: "Diesel", ac: true },
];

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Index() {
  useReveal();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      <Hero />
      <Stats />
      <Fleet />
      <Reserve />
      <About />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function Logo({ className = "h-12" }: { className?: string }) {
  return <img src={logoAsset.url} alt="Rouling Car" className={className} />;
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-3">
        <div className="glass rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Logo className="h-10 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-foreground/80">
            <a href="#fleet" className="hover:text-gold transition-colors">Notre Flotte</a>
            <a href="#reserve" className="hover:text-gold transition-colors">Réservation</a>
            <a href="#about" className="hover:text-gold transition-colors">À propos</a>
            <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
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
    <section id="top" className="relative pt-32 pb-24 min-h-[92vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="" className="h-full w-full object-cover opacity-40" />
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
          <h1 className="reveal reveal-delay-1 mt-5 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
            Roulez avec <span className="text-gradient-red">style</span>,<br/>
            <span className="text-gradient-gold">partout au Maroc.</span>
          </h1>
          <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg text-foreground/75">
            Rouling Car — votre partenaire de confiance pour la location de voitures à Rabat.
            Une flotte récente, des prix justes, une réservation en quelques secondes via WhatsApp.
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap items-center gap-3">
            <a
              href={waLink("Bonjour Rouling Car, je souhaite réserver une voiture.")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-semibold hover:brightness-110 transition shadow-lg shadow-primary/30"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Réserver sur WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#fleet" className="inline-flex items-center gap-2 rounded-full glass gold-border px-6 py-3.5 font-semibold text-gold hover:bg-gold/10 transition">
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
          <div className="relative rounded-3xl glass gold-border p-6 anim-float">
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gold text-gold-foreground text-[11px] font-semibold tracking-wider">
              OFFRE DU JOUR
            </div>
            <img src={tucsonImg} alt="Hyundai Tucson" className="w-full h-56 object-cover rounded-2xl" width={1024} height={1024} />
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

function Fleet() {
  return (
    <section id="fleet" className="py-24">
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
            <CarCard key={c.name} car={c} delay={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CarCard({ car, delay }: { car: Car; delay: number }) {
  const msg = `Bonjour Rouling Car 👋,\nJe souhaite réserver la *${car.name}* (${car.price} DH/jour).\n\nDates : \nLieu de prise en charge : `;
  return (
    <article className={`reveal reveal-delay-${(delay % 3) + 1} group relative rounded-3xl glass gold-border overflow-hidden hover:-translate-y-1 transition-transform duration-500`}>
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-secondary to-card">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-background/70 gold-border text-gold">
          {car.category}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-end justify-between">
          <h3 className="font-display text-xl font-bold">{car.name}</h3>
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
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-full justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:brightness-110 transition"
        >
          <WhatsAppIcon className="h-4 w-4" /> Réserver
        </a>
      </div>
    </article>
  );
}

function Reserve() {
  return (
    <section id="reserve" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="reveal text-xs uppercase tracking-[0.25em] text-gold">Réservation</div>
            <h2 className="reveal reveal-delay-1 mt-3 text-4xl sm:text-5xl font-bold">
              Réservez en <span className="text-gradient-gold">3 étapes</span>
            </h2>
            <ol className="mt-10 space-y-6">
              {[
                ["Choisissez votre voiture", "Parcourez notre flotte et sélectionnez le véhicule adapté à vos besoins."],
                ["Envoyez-nous un message WhatsApp", "Cliquez sur Réserver, indiquez vos dates et le lieu de prise en charge."],
                ["Récupérez les clés", "Livraison gratuite à Rabat (aéroport, hôtel, gare). Bonne route !"],
              ].map(([t, d], i) => (
                <li key={t} className={`reveal reveal-delay-${(i % 3) + 1} flex gap-4`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground font-bold font-display">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <p className="text-sm text-foreground/70 mt-1">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal reveal-delay-2 rounded-3xl glass gold-border p-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-whatsapp/15 grid place-items-center">
                <WhatsAppIcon className="h-6 w-6 text-whatsapp" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold">Réservation WhatsApp</div>
                <div className="text-xs text-muted-foreground">Réponse rapide, 7j/7</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {PHONES.map((p) => (
                <a
                  key={p}
                  href={waLink(`Bonjour Rouling Car, je souhaite réserver une voiture.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl bg-secondary/60 hover:bg-secondary px-5 py-4 transition gold-border"
                >
                  <span className="flex items-center gap-3">
                    <PhoneIcon className="h-4 w-4 text-gold" />
                    <span className="font-medium">{p}</span>
                  </span>
                  <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
                </a>
              ))}
            </div>
            <div className="mt-6 text-sm text-foreground/70 flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gold mt-0.5" />
              Rabat, Maroc — Livraison gratuite à l'aéroport, à votre hôtel ou à la gare.
            </div>
          </div>
        </div>
      </div>
    </section>
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
            <img src={heroImg} alt="Rouling Car à Rabat" className="w-full h-[420px] object-cover" loading="lazy" />
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
            </ul>

            <a
              href={waLink("Bonjour Rouling Car, je souhaite plus d'informations.")}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-semibold hover:brightness-110 transition shadow-lg shadow-primary/30"
            >
              <WhatsAppIcon className="h-5 w-5" /> Discutons sur WhatsApp
            </a>
          </div>
          <div className="min-h-[360px] relative">
            <iframe
              title="Rouling Car à Rabat"
              src="https://www.google.com/maps?q=Rabat,+Maroc&output=embed"
              className="absolute inset-0 h-full w-full grayscale-[40%] contrast-110"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-gold/20" />
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

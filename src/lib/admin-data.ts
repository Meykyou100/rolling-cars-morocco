export type VehicleStatus = "Disponible" | "Réservé" | "Indisponible" | "Maintenance";
export type ReservationStatus = "Nouvelle demande" | "Confirmée" | "Terminée" | "Annulée";

export type Vehicle = { id: string; name: string; model: string; category: string; price: number; fuel: string; transmission: string; seats: number; image: string; description: string; status: VehicleStatus; archived?: boolean };
export type Reservation = { id: string; client: string; phone: string; vehicleId: string; start: string; end: string; pickup: string; returnLocation: string; total: number; notes: string; status: ReservationStatus };

const VEHICLES_KEY = "rouling-admin-vehicles";
const RESERVATIONS_KEY = "rouling-admin-reservations";
const SESSION_KEY = "rouling-admin-session";
const VEHICLE_ASSET_VERSION_KEY = "rouling-admin-vehicle-assets-v3";

export const defaultVehicles: Vehicle[] = [
  { id: "logan", name: "Dacia Logan", model: "2024", category: "Économique", price: 200, fuel: "Diesel", transmission: "Manuelle", seats: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfEJbisJyBv43oto4dmo0xk7ads6IIRudcNw&s", description: "Confortable, pratique et économique pour Rabat et ses environs.", status: "Disponible" },
  { id: "clio", name: "Renault Clio 5", model: "2024", category: "Citadine", price: 280, fuel: "Essence", transmission: "Manuelle", seats: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCPBOP0J0MNAUN13AqFH0_iHOZ58-8-AERiA&s", description: "Élégante et agile, idéale pour les trajets urbains.", status: "Disponible" },
  { id: "tucson", name: "Hyundai Tucson", model: "2023", category: "SUV", price: 600, fuel: "Diesel", transmission: "Automatique", seats: 5, image: "https://apiv2.autonews.ma/wp-content/uploads/2023/12/hyndai-tucsson-2023-autonews-1.jpg", description: "Un SUV premium pour voyager en tout confort.", status: "Disponible" },
  { id: "peugeot-208", name: "Peugeot 208", model: "2024", category: "Citadine", price: 250, fuel: "Essence", transmission: "Manuelle", seats: 5, image: "https://www.peugeot.ma/content/dam/peugeot/master/b2c/our-range/showroom/208/2023-10-new-208/mobile/208_ALLUREEV_M.jpg?imwidth=768", description: "Citadine moderne et élégante, parfaite pour vos trajets au Maroc.", status: "Disponible" },
  { id: "volkswagen-t-roc", name: "Volkswagen T-Roc", model: "2024", category: "SUV", price: 350, fuel: "Essence", transmission: "Automatique", seats: 5, image: "https://v3.moteur.ma/storage/media/images/models/nouvelle-t-roc-947.png", description: "SUV compact élégant et confortable pour vos déplacements au Maroc.", status: "Disponible" },
];

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
};
export const vehicles = () => {
  const stored = read<Vehicle[]>(VEHICLES_KEY, defaultVehicles);
  if (typeof window === "undefined") return stored;
  const refreshAssets = localStorage.getItem(VEHICLE_ASSET_VERSION_KEY) !== "3";
  const migrated = defaultVehicles.map((preset) => {
    const current = stored.find((vehicle) => vehicle.id === preset.id);
    if (!current) return preset;
    return refreshAssets
      ? { ...preset, ...current, image: preset.image, model: current.model || preset.model }
      : { ...preset, ...current };
  });
  const custom = stored.filter((vehicle) => !defaultVehicles.some((preset) => preset.id === vehicle.id));
  const next = [...migrated, ...custom];
  if (refreshAssets || next.length !== stored.length) {
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(next));
    localStorage.setItem(VEHICLE_ASSET_VERSION_KEY, "3");
  }
  return next;
};
export const reservations = () => read<Reservation[]>(RESERVATIONS_KEY, []);
const notify = () => typeof window !== "undefined" && window.dispatchEvent(new Event("rouling-data"));
export const saveVehicles = (data: Vehicle[]) => { localStorage.setItem(VEHICLES_KEY, JSON.stringify(data)); notify(); };
export const saveReservations = (data: Reservation[]) => { localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(data)); notify(); };
export const isLoggedIn = () => typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "true";
export const login = () => sessionStorage.setItem(SESSION_KEY, "true");
export const logout = () => sessionStorage.removeItem(SESSION_KEY);
export const isVehicleAvailable = (vehicle: Vehicle, start: string, end: string) => vehicle.status === "Disponible" && !reservations().some(r => r.vehicleId === vehicle.id && r.status === "Confirmée" && start <= r.end && end >= r.start);

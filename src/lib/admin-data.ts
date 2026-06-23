import daciaImg from "@/assets/dacia-logan.jpg";
import clioImg from "@/assets/renault-clio.jpg";
import tucsonImg from "@/assets/hyundai-tucson.jpg";

export type VehicleStatus = "Disponible" | "Réservé" | "Indisponible" | "Maintenance";
export type ReservationStatus = "Nouvelle demande" | "Confirmée" | "Terminée" | "Annulée";

export type Vehicle = { id: string; name: string; model: string; category: string; price: number; fuel: string; transmission: string; seats: number; image: string; description: string; status: VehicleStatus; archived?: boolean };
export type Reservation = { id: string; client: string; phone: string; vehicleId: string; start: string; end: string; pickup: string; returnLocation: string; total: number; notes: string; status: ReservationStatus };

const VEHICLES_KEY = "rouling-admin-vehicles";
const RESERVATIONS_KEY = "rouling-admin-reservations";
const SESSION_KEY = "rouling-admin-session";

export const defaultVehicles: Vehicle[] = [
  { id: "logan", name: "Dacia Logan", model: "2024", category: "Économique", price: 200, fuel: "Diesel", transmission: "Manuelle", seats: 5, image: daciaImg, description: "Confortable, pratique et économique pour Rabat et ses environs.", status: "Disponible" },
  { id: "clio", name: "Renault Clio 5", model: "2024", category: "Citadine", price: 280, fuel: "Essence", transmission: "Manuelle", seats: 5, image: clioImg, description: "Élégante et agile, idéale pour les trajets urbains.", status: "Disponible" },
  { id: "tucson", name: "Hyundai Tucson", model: "2024", category: "SUV", price: 600, fuel: "Diesel", transmission: "Automatique", seats: 5, image: tucsonImg, description: "Un SUV premium pour voyager en tout confort.", status: "Disponible" },
];

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
};
export const vehicles = () => read<Vehicle[]>(VEHICLES_KEY, defaultVehicles);
export const reservations = () => read<Reservation[]>(RESERVATIONS_KEY, []);
const notify = () => typeof window !== "undefined" && window.dispatchEvent(new Event("rouling-data"));
export const saveVehicles = (data: Vehicle[]) => { localStorage.setItem(VEHICLES_KEY, JSON.stringify(data)); notify(); };
export const saveReservations = (data: Reservation[]) => { localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(data)); notify(); };
export const isLoggedIn = () => typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "true";
export const login = () => sessionStorage.setItem(SESSION_KEY, "true");
export const logout = () => sessionStorage.removeItem(SESSION_KEY);
export const isVehicleAvailable = (vehicle: Vehicle, start: string, end: string) => vehicle.status === "Disponible" && !reservations().some(r => r.vehicleId === vehicle.id && r.status === "Confirmée" && start <= r.end && end >= r.start);

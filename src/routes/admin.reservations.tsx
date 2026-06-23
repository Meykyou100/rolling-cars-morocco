import { createFileRoute } from "@tanstack/react-router";
import { ReservationsPage } from "@/components/admin-shell";
export const Route = createFileRoute("/admin/reservations")({ component: ReservationsPage });

import { createFileRoute } from "@tanstack/react-router";
import { VehiclesPage } from "@/components/admin-shell";
export const Route = createFileRoute("/admin/vehicles")({ component: VehiclesPage });

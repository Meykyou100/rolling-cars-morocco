import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/admin-shell";
export const Route = createFileRoute("/admin/dashboard")({ component: DashboardPage });

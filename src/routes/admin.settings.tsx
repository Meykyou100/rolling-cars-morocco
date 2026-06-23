import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/admin-shell";
export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

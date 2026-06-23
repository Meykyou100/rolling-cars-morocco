-- Run this once in Supabase: SQL Editor > New query.
create extension if not exists "pgcrypto";

create type public.vehicle_status as enum ('Disponible', 'Réservé', 'Indisponible', 'Maintenance');
create type public.reservation_status as enum ('Nouvelle demande', 'Confirmée', 'Terminée', 'Annulée');

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text,
  category text not null,
  price_per_day numeric(10,2) not null check (price_per_day >= 0),
  fuel text not null,
  transmission text not null,
  seats smallint not null check (seats > 0),
  image_url text,
  description text,
  status public.vehicle_status not null default 'Disponible',
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id),
  client_first_name text not null,
  client_last_name text not null,
  phone text not null,
  email text,
  start_date date not null,
  end_date date not null,
  pickup_location text not null,
  return_location text not null,
  total_price numeric(10,2) not null check (total_price >= 0),
  notes text,
  status public.reservation_status not null default 'Nouvelle demande',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservation_dates_valid check (end_date > start_date)
);

create index reservations_vehicle_dates_idx on public.reservations(vehicle_id, start_date, end_date);

alter table public.vehicles enable row level security;
alter table public.reservations enable row level security;

-- Anyone can see active vehicles; only authenticated agency staff can manage data.
create policy "Public can view active vehicles" on public.vehicles for select using (archived = false);
create policy "Authenticated staff manage vehicles" on public.vehicles for all to authenticated using (true) with check (true);
create policy "Authenticated staff manage reservations" on public.reservations for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;
create policy "Public can view vehicle images" on storage.objects for select using (bucket_id = 'vehicle-images');
create policy "Authenticated staff upload vehicle images" on storage.objects for insert to authenticated with check (bucket_id = 'vehicle-images');
create policy "Authenticated staff update vehicle images" on storage.objects for update to authenticated using (bucket_id = 'vehicle-images');
create policy "Authenticated staff delete vehicle images" on storage.objects for delete to authenticated using (bucket_id = 'vehicle-images');

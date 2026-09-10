create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Admins can view their own membership"
  on public.admin_users for select
  using ((select auth.uid()) = user_id);

create table public.invitation_templates (
  id text primary key check (id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 80),
  mood text not null check (char_length(mood) between 2 and 60),
  palette text not null check (char_length(palette) between 2 and 100),
  couple text not null check (char_length(couple) between 3 and 170),
  event_date text not null check (char_length(event_date) between 2 and 80),
  accent text not null check (accent in ('arch', 'botanical', 'monogram', 'ribbon', 'minimal', 'terracotta')),
  published boolean not null default false,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index invitation_templates_published_created_idx
  on public.invitation_templates (published, created_at desc);

alter table public.invitation_templates enable row level security;

insert into public.admin_users (user_id)
select id from auth.users where lower(email) = 'kishmishyan.gevorg@gmail.com'
on conflict (user_id) do nothing;

create policy "Anyone can view published invitation templates"
  on public.invitation_templates for select
  using (published);

create policy "Admins can view all invitation templates"
  on public.invitation_templates for select
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can create invitation templates"
  on public.invitation_templates for insert
  with check (
    created_by = (select auth.uid())
    and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  );

create policy "Admins can update invitation templates"
  on public.invitation_templates for update
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can delete invitation templates"
  on public.invitation_templates for delete
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

insert into public.invitation_templates (id, name, mood, palette, couple, event_date, accent, published, created_by)
select seed.id, seed.name, seed.mood, seed.palette, seed.couple, seed.event_date, seed.accent, true, owner.id
from (values
  ('evergreen-vows', 'Evergreen vows', 'Editorial', 'Forest & parchment', 'Amelia & James', 'SEPTEMBER 14, 2027', 'arch'),
  ('garden-letter', 'Garden letter', 'Romantic', 'Sage & ivory', 'Sofia & Daniel', 'MAY 22, 2027', 'botanical'),
  ('golden-hour', 'Golden hour', 'Classic', 'Warm white & gold', 'Nora & David', 'OCTOBER 02, 2027', 'monogram'),
  ('softly-tied', 'Softly tied', 'Modern', 'Blush & taupe', 'Lena & Aram', 'JUNE 05, 2027', 'ribbon'),
  ('quiet-type', 'Quiet type', 'Minimal', 'Ivory & charcoal', 'Maya & Leo', 'AUGUST 28, 2027', 'minimal'),
  ('sunset-table', 'Sunset table', 'Warm', 'Terracotta & cream', 'Clara & Theo', 'JULY 17, 2027', 'terracotta')
) as seed(id, name, mood, palette, couple, event_date, accent)
cross join lateral (select id from auth.users where lower(email) = 'kishmishyan.gevorg@gmail.com' limit 1) owner
on conflict (id) do nothing;

create table public.invitation_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null,
  details jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, template_id)
);

create index invitation_drafts_user_updated_idx
  on public.invitation_drafts (user_id, updated_at desc);

alter table public.invitation_drafts enable row level security;

create policy "Users can view their invitation drafts"
  on public.invitation_drafts for select
  using ((select auth.uid()) = user_id);

create policy "Users can create their invitation drafts"
  on public.invitation_drafts for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their invitation drafts"
  on public.invitation_drafts for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their invitation drafts"
  on public.invitation_drafts for delete
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can view their invitation drafts" on public.invitation_drafts;
drop policy if exists "Users can create their invitation drafts" on public.invitation_drafts;
drop policy if exists "Users can update their invitation drafts" on public.invitation_drafts;
drop policy if exists "Users can delete their invitation drafts" on public.invitation_drafts;

create policy "Customers can view their invitation drafts"
  on public.invitation_drafts for select
  using (
    (select auth.uid()) = user_id
    and not exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  );

create policy "Customers can create their invitation drafts"
  on public.invitation_drafts for insert
  with check (
    (select auth.uid()) = user_id
    and not exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  );

create policy "Customers can update their invitation drafts"
  on public.invitation_drafts for update
  using (
    (select auth.uid()) = user_id
    and not exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  )
  with check (
    (select auth.uid()) = user_id
    and not exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  );

create policy "Customers can delete their invitation drafts"
  on public.invitation_drafts for delete
  using (
    (select auth.uid()) = user_id
    and not exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  );

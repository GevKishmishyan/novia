insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = 'kishmishyan.gevorg@gmail.com'
on conflict (user_id) do nothing;

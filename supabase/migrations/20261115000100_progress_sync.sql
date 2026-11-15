create table if not exists public.trailbook_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null check (length(key) between 1 and 300 and key ~ '^(reading|prep|practice)/'),
  value jsonb,
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, key),
  constraint record_size check (octet_length(value::text) <= 262144)
);
alter table public.trailbook_records enable row level security;
revoke all on public.trailbook_records from anon, authenticated;
grant select on public.trailbook_records to authenticated;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'trailbook_records' and policyname = 'Read own progress') then
    create policy "Read own progress" on public.trailbook_records for select to authenticated using ((select auth.uid()) = user_id);
  end if;
end $$;
create or replace function public.trailbook_write_record(p_key text, p_value jsonb, p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  saved public.trailbook_records;
begin
  if actor is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_expected_revision < 0 or p_expected_revision is null then raise exception 'Invalid revision'; end if;
  if p_expected_revision = 0 then
    insert into public.trailbook_records(user_id, key, value) values (actor, p_key, p_value)
    on conflict (user_id, key) do nothing returning * into saved;
  else
    update public.trailbook_records set value = p_value, revision = revision + 1, updated_at = now()
    where user_id = actor and key = p_key and revision = p_expected_revision returning * into saved;
  end if;
  if saved.key is not null then return jsonb_build_object('applied', true, 'record', jsonb_build_object('key',saved.key,'value',saved.value,'revision',saved.revision)); end if;
  select * into saved from public.trailbook_records where user_id = actor and key = p_key;
  if saved.key is null then raise exception 'Record missing; refresh and retry'; end if;
  return jsonb_build_object('applied', false, 'record', jsonb_build_object('key',saved.key,'value',saved.value,'revision',saved.revision));
end;
$$;
revoke all on function public.trailbook_write_record(text,jsonb,bigint) from public, anon;
grant execute on function public.trailbook_write_record(text,jsonb,bigint) to authenticated;

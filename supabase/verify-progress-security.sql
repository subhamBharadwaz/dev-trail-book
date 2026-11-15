begin;
insert into auth.users(id, aud, role, email) values
('11111111-1111-4111-8111-111111111111','authenticated','authenticated','sync-check-a@example.invalid'),
('22222222-2222-4222-8222-222222222222','authenticated','authenticated','sync-check-b@example.invalid');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
do $$ declare first_result jsonb; conflict_result jsonb; begin
  first_result := public.trailbook_write_record('reading/read/__sync_check__', 'true', 0);
  if not (first_result->>'applied')::boolean then raise exception 'Initial write failed'; end if;
  conflict_result := public.trailbook_write_record('reading/read/__sync_check__', 'false', 0);
  if (conflict_result->>'applied')::boolean then raise exception 'Stale revision overwrote progress'; end if;
  if (select count(*) from public.trailbook_records where key='reading/read/__sync_check__') <> 1 then raise exception 'Own row missing'; end if;
  begin
    insert into public.trailbook_records(user_id,key,value) values ('22222222-2222-4222-8222-222222222222','reading/read/illegal','true');
    raise exception 'Direct cross-account write was allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);
do $$ begin
  if exists(select 1 from public.trailbook_records where key='reading/read/__sync_check__') then raise exception 'Other account data leaked'; end if;
  perform public.trailbook_write_record('reading/read/__sync_check__', 'false', 0);
  if (select count(*) from public.trailbook_records where key='reading/read/__sync_check__') <> 1 then raise exception 'Account isolation failed'; end if;
end $$;
reset role;
do $$ begin
  if has_table_privilege('anon','public.trailbook_records','SELECT') then raise exception 'Anonymous read was allowed'; end if;
  if has_function_privilege('anon','public.trailbook_write_record(text,jsonb,bigint)','EXECUTE') then raise exception 'Anonymous write was allowed'; end if;
end $$;
rollback;
select 'PASS: isolation, anonymous denial, and stale revision checks; test data rolled back' as result;

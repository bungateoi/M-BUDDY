-- M-BUDDY — schema thật cho tài khoản người dùng (thay mock trong app/data/*.ts)
-- Xem kế hoạch đầy đủ: /Users/mac/.claude/plans/vivid-leaping-sphinx.md
--
-- Chạy TOÀN BỘ file này 1 lần trong Supabase Dashboard > SQL Editor > New query.
-- An toàn để chạy lại (idempotent) nhờ "if not exists" / "or replace" ở mọi chỗ.

-- ============================================================
-- 1. profiles — 1 dòng / user, tạo tự động khi đăng ký (xem trigger cuối file)
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- Lấy từ auth.users lúc đăng ký (xem trigger handle_new_user) — chỉ để
  -- admin dễ nhận diện tài khoản trong màn Quản trị, KHÔNG dùng để đăng nhập.
  email text not null default '',
  full_name text not null default '',
  -- Khớp key trong app/data/roleplayAvatars.ts
  avatar_key text not null default 'adult-women',
  job_title text not null default '',
  branch text not null default '',
  role text not null default 'employee' check (role in ('employee', 'manager', 'admin')),
  -- Người quản lý trực tiếp — null cho tới khi được admin gán (màn Quản trị,
  -- xem admin_set_manager bên dưới).
  manager_id uuid references public.profiles (id) on delete set null,
  xp integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  streak_freeze_count integer not null default 0,
  -- 6 tiêu chí khớp SCORE_CRITERIA_META trong app/data/scoreCriteriaMeta.ts.
  skill_scores jsonb not null default '{
    "customer_understanding": 0,
    "knowledge": 0,
    "communication": 0,
    "objection_handling": 0,
    "insight_discovery": 0,
    "closing": 0
  }'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Hồ sơ năng lực người dùng M-BUDDY — 1 dòng/tài khoản, tạo tự động khi đăng ký.';

-- An toàn nếu bảng đã tồn tại từ lần chạy trước (thêm cột/role 'admin' nếu
-- thiếu) — không tác dụng gì nếu bảng vừa tạo mới ở trên.
alter table public.profiles add column if not exists email text not null default '';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('employee', 'manager', 'admin'));

create index if not exists profiles_manager_id_idx on public.profiles (manager_id);
create index if not exists profiles_xp_idx on public.profiles (xp desc);

alter table public.profiles enable row level security;

-- Đặt TRƯỚC policy dùng nó bên dưới. STABLE + SECURITY DEFINER: chỉ đọc 1
-- dòng (id = auth.uid()) nên không đệ quy/tốn kém dù được gọi trong RLS của
-- chính bảng profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

comment on function public.is_admin() is 'true nếu user hiện tại có role admin — dùng trong RLS + RPC admin_*.';

drop policy if exists "profiles_select_self_or_reports" on public.profiles;
create policy "profiles_select_self_or_reports"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or manager_id = auth.uid() or public.is_admin());

-- Chỉ cho tự sửa các field hiển thị cá nhân — KHÔNG cho sửa trực tiếp xp/streak/
-- skill_scores (2 field đó chỉ đổi qua RPC SECURITY DEFINER bên dưới, tránh user
-- tự nâng điểm/XP của chính mình qua API).
drop policy if exists "profiles_update_self_display_fields" on public.profiles;
create policy "profiles_update_self_display_fields"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

revoke update on public.profiles from authenticated;
grant update (full_name, avatar_key, job_title, branch) on public.profiles to authenticated;

-- ============================================================
-- 2. daily_activity — 1 dòng / user / ngày có hoạt động, nguồn tính streak
-- ============================================================

create table if not exists public.daily_activity (
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_date date not null,
  primary key (user_id, activity_date)
);

comment on table public.daily_activity is 'Đánh dấu các ngày user có hoàn thành role-play — nguồn tính current_streak/longest_streak và weekProgress trên Home.';

alter table public.daily_activity enable row level security;

drop policy if exists "daily_activity_select_self" on public.daily_activity;
create policy "daily_activity_select_self"
  on public.daily_activity for select
  to authenticated
  using (user_id = auth.uid());

-- Không cấp INSERT trực tiếp cho client — chỉ ghi qua record_activity() bên dưới.

-- ============================================================
-- 3. leaderboard view — chỉ lộ field an toàn (không lộ skill_scores/branch/job_title)
-- ============================================================

drop view if exists public.leaderboard;
create view public.leaderboard
  with (security_invoker = false) as
  select id, full_name, avatar_key, xp, current_streak
  from public.profiles
  order by xp desc;

comment on view public.leaderboard is 'Slice công khai của profiles cho bảng xếp hạng — security_invoker=false để lộ ra mọi user mà KHÔNG cần nới RLS trên bảng profiles gốc (nơi có skill_scores nhạy cảm hơn).';

grant select on public.leaderboard to authenticated;

-- ============================================================
-- 4. RPC functions (SECURITY DEFINER) — luôn tự lấy auth.uid(), không nhận
--    user_id từ client, nên không thể gọi hộ/giả mạo người khác.
-- ============================================================

create or replace function public.record_activity()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  streak_count integer := 0;
  check_date date := current_date;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  insert into public.daily_activity (user_id, activity_date)
  values (uid, current_date)
  on conflict do nothing;

  -- Đếm số ngày liên tiếp có hoạt động, lùi dần từ hôm nay.
  loop
    exit when not exists (
      select 1 from public.daily_activity
      where user_id = uid and activity_date = check_date
    );
    streak_count := streak_count + 1;
    check_date := check_date - 1;
  end loop;

  update public.profiles
  set
    current_streak = streak_count,
    longest_streak = greatest(longest_streak, streak_count)
  where id = uid;
end;
$$;

comment on function public.record_activity() is 'Đánh dấu hôm nay là ngày có hoạt động cho user hiện tại + tính lại streak. Gọi ngay sau khi 1 buổi role-play hoàn thành.';

create or replace function public.apply_skill_scores(new_scores jsonb, xp_gain integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  old_scores jsonb;
  merged jsonb;
  k text;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  select skill_scores into old_scores from public.profiles where id = uid;
  merged := old_scores;

  -- Làm mượt: 70% điểm cũ + 30% điểm buổi vừa xong, tránh 1 buổi bất
  -- thường (quá tốt/quá tệ) làm điểm nhảy giật.
  for k in select jsonb_object_keys(new_scores)
  loop
    merged := jsonb_set(
      merged,
      array[k],
      to_jsonb(round(coalesce((old_scores ->> k)::numeric, 0) * 0.7 + (new_scores ->> k)::numeric * 0.3))
    );
  end loop;

  update public.profiles
  set skill_scores = merged, xp = xp + greatest(0, xp_gain)
  where id = uid;
end;
$$;

comment on function public.apply_skill_scores(jsonb, integer) is 'Trộn skill_scores hiện có với điểm 1 buổi role-play vừa chấm (làm mượt 70/30) + cộng XP. new_scores dùng đúng key trong SCORE_CRITERIA_META.';

-- Chỉ admin (is_admin()) mới gọi được — đổi role của BẤT KỲ ai (bootstrap
-- admin đầu tiên vẫn phải làm thủ công trong SQL Editor, xem hướng dẫn
-- kèm theo file này, vì trước đó chưa ai có role='admin' để tự gọi RPC).
create or replace function public.admin_set_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if new_role not in ('employee', 'manager', 'admin') then
    raise exception 'invalid role: %', new_role;
  end if;
  update public.profiles set role = new_role where id = target_user_id;
end;
$$;

comment on function public.admin_set_role(uuid, text) is 'Admin đổi role 1 tài khoản bất kỳ — dùng ở màn Quản trị (app/screens/AdminScreen.tsx).';

-- new_manager_id = null để bỏ gán (member không còn thuộc team nào).
create or replace function public.admin_set_manager(target_user_id uuid, new_manager_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if target_user_id = new_manager_id then
    raise exception 'không thể tự gán mình làm quản lý của chính mình';
  end if;
  update public.profiles set manager_id = new_manager_id where id = target_user_id;
end;
$$;

comment on function public.admin_set_manager(uuid, uuid) is 'Admin thêm/gỡ 1 thành viên khỏi team của 1 trưởng nhóm — dùng ở màn Quản trị.';

-- Tài khoản tạo qua Supabase Dashboard (Authentication > Users > Add user)
-- không có sẵn họ tên/chức danh/chi nhánh — admin điền lại ở màn Quản trị.
create or replace function public.admin_set_profile(target_user_id uuid, new_full_name text, new_job_title text, new_branch text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  update public.profiles
  set full_name = coalesce(new_full_name, full_name),
      job_title = coalesce(new_job_title, job_title),
      branch = coalesce(new_branch, branch)
  where id = target_user_id;
end;
$$;

comment on function public.admin_set_profile(uuid, text, text, text) is 'Admin điền/sửa họ tên, chức danh, chi nhánh cho 1 tài khoản bất kỳ — dùng khi tài khoản được tạo thẳng qua Supabase Dashboard (chưa có sẵn thông tin này).';

-- ============================================================
-- 5. Trigger — tự tạo profiles khi có user mới đăng ký
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- BOOTSTRAP ADMIN ĐẦU TIÊN — làm thủ công, 1 lần duy nhất
-- ============================================================
-- Chưa ai có role='admin' nên chưa ai gọi được admin_set_role() qua app.
-- Sau khi ĐÃ đăng ký tài khoản của chính bạn trong app (màn Đăng ký), chạy
-- ĐÚNG 1 dòng dưới đây (đổi email) trong SQL Editor để tự phong admin cho
-- mình — từ đó vào màn "Quản trị hệ thống" trong app để phong thêm
-- trưởng nhóm / gán thành viên vào team, không cần SQL nữa.
--
-- update public.profiles set role = 'admin' where email = 'ban@vidu.com';

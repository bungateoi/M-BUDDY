-- M-BUDDY — tiến độ THẬT theo từng level ở màn Map (khoá tuần tự + học vượt).
-- Chạy SAU 0001_init.sql (không sửa lại file đó — đã chạy rồi).
--
-- Chạy TOÀN BỘ file này 1 lần trong Supabase Dashboard > SQL Editor > New query.
-- An toàn để chạy lại (idempotent).

-- ============================================================
-- 1. level_progress — 1 dòng TỒN TẠI = level đó ĐÃ hoàn thành với user này
-- ============================================================

create table if not exists public.level_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Khớp Level.id trong app/data/levels.ts, dạng "{chapterNumber}.{productOrder}", vd "3.4".
  level_id text not null,
  -- Điểm CAO NHẤT đạt được qua các lần chơi lại (0-100, khớp roleplayResult.totalScore).
  best_score integer not null default 0,
  attempts integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, level_id)
);

comment on table public.level_progress is 'Tiến độ Map — 1 dòng/level đã hoàn thành. Ghi qua RPC record_level_progress(), đọc trực tiếp qua SELECT (RLS chỉ cho xem của chính mình).';

alter table public.level_progress enable row level security;

drop policy if exists "level_progress_select_self" on public.level_progress;
create policy "level_progress_select_self"
  on public.level_progress for select
  to authenticated
  using (user_id = auth.uid());

-- Không cấp INSERT/UPDATE trực tiếp cho client — chỉ ghi qua record_level_progress() bên dưới
-- (tránh user tự mở khoá/tự sửa điểm level qua API).

-- ============================================================
-- 2. RPC record_level_progress — luôn tự lấy auth.uid(), không nhận user_id
--    từ client nên không thể gọi hộ/giả mạo người khác.
-- ============================================================

create or replace function public.record_level_progress(
  p_level_id text,
  p_score integer,
  p_is_skip_ahead boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  chapter_num integer;
  prev_chapter integer;
  m integer;
  target_id text;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;

  -- Luôn ghi nhận điểm cho ĐÚNG level vừa chơi.
  insert into public.level_progress (user_id, level_id, best_score, attempts, updated_at)
  values (uid, p_level_id, greatest(0, p_score), 1, now())
  on conflict (user_id, level_id) do update
    set best_score = greatest(public.level_progress.best_score, excluded.best_score),
        attempts = public.level_progress.attempts + 1,
        updated_at = now();

  -- Học vượt đạt >= 60% -> mở khoá (đánh dấu hoàn thành) TOÀN BỘ level của
  -- các chặng TỪ 1 tới chặng chứa p_level_id (vd bấm "Học vượt" ở chặng 5 ->
  -- chơi level '4.5' -> đạt >=60% -> mở khoá chặng 1,2,3,4). Cấu trúc app cố
  -- định 5 chặng x 5 level (xem app/data/levels.ts) nên lặp cứng 1..5.
  if p_is_skip_ahead and p_score >= 60 then
    chapter_num := split_part(p_level_id, '.', 1)::integer;
    for prev_chapter in 1..chapter_num loop
      for m in 1..5 loop
        target_id := prev_chapter::text || '.' || m::text;
        insert into public.level_progress (user_id, level_id, best_score, attempts, updated_at)
        values (uid, target_id, greatest(0, p_score), 1, now())
        on conflict (user_id, level_id) do update
          set best_score = greatest(public.level_progress.best_score, excluded.best_score),
              updated_at = now();
      end loop;
    end loop;
  end if;
end;
$$;

comment on function public.record_level_progress(text, integer, boolean) is 'Ghi điểm 1 level vừa hoàn thành ở Map + (nếu học vượt đạt >=60%) mở khoá toàn bộ các chặng trước đó. Gọi ngay sau khi role-play của 1 level Map chấm điểm xong (RolePlayScreen.tsx#finishCall).';

-- M-BUDDY — Lịch sử luyện tập (màn "Ôn tập") — lưu lại MỌI buổi role-play đã
-- hoàn thành ở Map và ở Practice (KHÔNG lưu buổi luyện với khách hàng tự tạo
-- theo tiêu chí — xem app/screens/RolePlayScreen.tsx#finishCall).
--
-- Chạy SAU 0001_init.sql + 0002_level_progress.sql (không sửa lại 2 file đó).
-- Chạy TOÀN BỘ file này 1 lần trong Supabase Dashboard > SQL Editor > New query.
-- An toàn để chạy lại (idempotent).

create table if not exists public.roleplay_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null check (source in ('map', 'practice')),
  -- Chỉ 1 trong 2 cột dưới có giá trị, khớp `source`.
  level_id text,
  practice_customer_id text,
  -- 2 dòng hiển thị trên thẻ danh sách — dựng sẵn lúc lưu (không tính lại từ
  -- level_id/practice_customer_id mỗi lần đọc, vì tên persona/sản phẩm/khách
  -- hàng có thể đổi sau này còn lịch sử phải giữ nguyên như lúc chơi):
  -- map: title_line="Chặng {n} – Level {m}", subtitle_line="{persona} – {product}".
  -- practice: title_line="Practice", subtitle_line="{tên khách hàng}".
  title_line text not null,
  subtitle_line text not null,
  total_score integer not null,
  -- 6 key khớp SCORE_CRITERIA_META (app/data/scoreCriteriaMeta.ts).
  skill_scores jsonb not null,
  -- Toàn bộ RoleplayResult (app/data/types.ts) — dùng lại NGUYÊN VẸN cho màn
  -- "Lịch sử chi tiết" (chính là màn Kết quả luyện tập, xem ResultScreen.tsx).
  result jsonb not null,
  created_at timestamptz not null default now()
);

comment on table public.roleplay_history is 'Lịch sử mọi buổi role-play đã hoàn thành (Map + Practice) — màn "Ôn tập". 1 dòng/buổi, ghi 1 lần lúc hoàn thành, không sửa/xoá qua app.';

create index if not exists roleplay_history_user_created_idx
  on public.roleplay_history (user_id, created_at desc);

alter table public.roleplay_history enable row level security;

drop policy if exists "roleplay_history_select_self" on public.roleplay_history;
create policy "roleplay_history_select_self"
  on public.roleplay_history for select
  to authenticated
  using (user_id = auth.uid());

-- Cho phép tự ghi lịch sử CỦA CHÍNH MÌNH trực tiếp (không cần RPC) — khác
-- level_progress/skill_scores (phải qua RPC vì ảnh hưởng mở khoá/xếp hạng),
-- bảng này chỉ là nhật ký cá nhân, không ai khác đọc được (RLS select ở
-- trên) nên không có rủi ro thao túng dữ liệu chung.
drop policy if exists "roleplay_history_insert_self" on public.roleplay_history;
create policy "roleplay_history_insert_self"
  on public.roleplay_history for insert
  to authenticated
  with check (user_id = auth.uid());

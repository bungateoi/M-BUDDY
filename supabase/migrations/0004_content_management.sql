-- M-BUDDY — nội dung nghiệp vụ (sản phẩm/chặng/level/câu hỏi trắc nghiệm)
-- chuyển từ dữ liệu tĩnh (app/data/*.ts) sang Supabase, để admin quản lý
-- ngay trong app (ẩn/sửa/thêm + tự sinh lại bằng AI). Xem kế hoạch đầy đủ:
-- /Users/mac/.claude/plans/vivid-leaping-sphinx.md
--
-- Chạy SAU 0001/0002/0003 (không sửa lại các file đó — đã chạy rồi).
-- Chạy TOÀN BỘ file này 1 lần trong Supabase Dashboard > SQL Editor > New query.
-- An toàn để chạy lại (idempotent). Sau file này, chạy tiếp
-- 0005_seed_content.sql để nạp sẵn dữ liệu 5 sản phẩm/5 chặng/25 level/125
-- câu hỏi hiện tại.
--
-- Ghi chú quan trọng: 4 bảng dưới đây CHỈ cho phép SELECT qua RLS (đọc mở
-- cho mọi user đã đăng nhập — đây là nội dung dùng chung, không phải dữ
-- liệu riêng tư). KHÔNG có policy INSERT/UPDATE/DELETE nào cho role
-- 'authenticated' — mọi thao tác ghi (tạo/sửa/ẩn + sinh lại nội dung bằng AI)
-- chỉ được thực hiện từ agent/main.py bằng SUPABASE_SERVICE_ROLE_KEY (tự
-- bỏ qua RLS), sau khi agent tự xác thực người gọi có role='admin'. Xem
-- verify_admin() trong agent/main.py.

-- ============================================================
-- 1. products
-- ============================================================

create table if not exists public.products (
  id text primary key,
  order_num integer not null,
  name text not null,
  short_name text,
  short_description text not null,
  target_audience text not null,
  benefits jsonb not null default '[]'::jsonb,
  basic_conditions text not null,
  key_selling_points jsonb not null default '[]'::jsonb,
  objection_bank jsonb not null default '[]'::jsonb,
  compliance_note text,
  -- Ẩn toàn bộ sản phẩm (mọi chặng) khỏi màn Map.
  is_hidden boolean not null default false,
  -- Ẩn sản phẩm này CHỈ ở 1 số chặng cụ thể — mảng số nguyên (chapterNumber),
  -- vd '[2,4]'::jsonb. Rỗng = không ẩn riêng chặng nào.
  hidden_chapter_numbers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Sản phẩm ngân hàng (nguồn: docs/products.md) — quản lý qua "Quản trị hành trình & tri thức". Ghi chỉ qua agent/main.py (service-role).';

alter table public.products enable row level security;

drop policy if exists "products_select_all" on public.products;
create policy "products_select_all"
  on public.products for select
  to authenticated
  using (true);

-- ============================================================
-- 2. personas (chặng / phân khúc khách hàng)
-- ============================================================

create table if not exists public.personas (
  id text primary key,
  -- Số thứ tự chặng, 1 ải trên màn Map — duy nhất, khớp app/data/personas.ts.
  chapter_number integer not null unique,
  name text not null,
  star_rating integer not null,
  -- {age, occupation, incomeLevel, needs, painPoints, expectations, barriers}
  criteria jsonb not null,
  behavior_note text not null,
  general_tactic text not null,
  win_condition text not null,
  recommended_product_id text references public.products (id) on delete set null,
  is_boss_chapter boolean not null default false,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.personas is 'Chặng/phân khúc khách hàng (nguồn: docs/personas.md) — quản lý qua "Quản trị hành trình & tri thức". Ghi chỉ qua agent/main.py (service-role).';

alter table public.personas enable row level security;

drop policy if exists "personas_select_all" on public.personas;
create policy "personas_select_all"
  on public.personas for select
  to authenticated
  using (true);

-- ============================================================
-- 3. levels — tổ hợp (chặng × sản phẩm), 1 bài role-play cụ thể
-- ============================================================

create table if not exists public.levels (
  -- "{chapterNumber}.{productOrder}", vd "1.1", "5.5".
  id text primary key,
  chapter_number integer not null,
  persona_id text not null references public.personas (id) on delete cascade,
  product_id text not null references public.products (id) on delete cascade,
  -- Có thể lẻ .5 (vd 4.5) — xem comment Level.starRating trong app/data/types.ts.
  star_rating numeric(2, 1) not null,
  opening_line text not null,
  sample_flow jsonb not null default '[]'::jsonb,
  objection_bank jsonb not null default '[]'::jsonb,
  win_criteria text not null,
  is_final_boss boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.levels is 'Level = tổ hợp (chặng × sản phẩm) — chỉ tồn tại nếu admin đã áp dụng sản phẩm đó cho chặng đó (hoặc ngược lại). Trạng thái "ẩn" hiển thị được SUY RA từ products.is_hidden/hidden_chapter_numbers + personas.is_hidden, không lưu cột riêng ở đây.';

create index if not exists levels_persona_id_idx on public.levels (persona_id);
create index if not exists levels_product_id_idx on public.levels (product_id);
create index if not exists levels_chapter_number_idx on public.levels (chapter_number);

alter table public.levels enable row level security;

drop policy if exists "levels_select_all" on public.levels;
create policy "levels_select_all"
  on public.levels for select
  to authenticated
  using (true);

-- ============================================================
-- 4. quiz_questions — 5 câu / level, "Ôn tập nhanh" trước role-play
-- ============================================================

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  level_id text not null references public.levels (id) on delete cascade,
  -- Thứ tự hiển thị trong 1 level, 1-5.
  question_order integer not null,
  question text not null,
  -- [{id: "A"|"B"|"C"|"D", text: string}, ...]
  options jsonb not null,
  correct_option_id text not null check (correct_option_id in ('A', 'B', 'C', 'D')),
  explanation text not null,
  created_at timestamptz not null default now()
);

comment on table public.quiz_questions is 'Câu hỏi trắc nghiệm "Ôn tập nhanh" — 5 câu/level, sinh bởi AI qua agent/main.py (POST /admin/products, /admin/personas).';

create unique index if not exists quiz_questions_level_order_idx on public.quiz_questions (level_id, question_order);

alter table public.quiz_questions enable row level security;

drop policy if exists "quiz_questions_select_all" on public.quiz_questions;
create policy "quiz_questions_select_all"
  on public.quiz_questions for select
  to authenticated
  using (true);

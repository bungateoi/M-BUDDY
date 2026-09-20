/**
 * Sinh file migration `supabase/migrations/0006_v2_content_reseed.sql` từ
 * dữ liệu v2 hiện có (app/data/products.ts, personas.ts, levels.ts,
 * quizBank.json) — thay thế TOÀN BỘ nội dung cũ (5 sản phẩm/5 chặng/25
 * level/125 câu hỏi, seed bởi 0005_seed_content.sql) bằng bộ mới (18 sản
 * phẩm/5 chặng/19 level/95 câu hỏi, nguồn v2_docs/).
 *
 * Khác 0005 (chỉ INSERT ... ON CONFLICT DO NOTHING — bỏ qua nếu đã có):
 * file này UPSERT (ON CONFLICT DO UPDATE) để GHI ĐÈ nội dung của các id
 * trùng (5 persona id giữ nguyên, 13/19 level id giữ nguyên), đồng thời
 * DELETE các id cũ không còn tồn tại trong bộ mới (5 product id cũ, 6 level
 * id cũ dạng "x.5"/"4.4"/"4.5"). Cũng ALTER TABLE thêm các cột mới
 * (knowledge_base, training_script, self_address...).
 *
 * KHÔNG động tới level_progress/roleplay_history (dữ liệu tiến độ/lịch sử
 * người dùng) — 2 bảng đó chỉ lưu level_id dạng text rời, không có FK tới
 * bảng levels, nên không bị ảnh hưởng/cascade khi xoá level cũ.
 *
 * Script chạy 1 lần, không phải API route — không dùng khi app đang chạy.
 * Không cần credential Supabase (chỉ đọc data tĩnh, in ra SQL) — file SQL
 * sinh ra do NGƯỜI DÙNG tự chạy trong Supabase SQL Editor, giống các
 * migration trước.
 *
 * Cách chạy (từ thư mục app/):
 *   node scripts/generateContentReseedSql.mts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../data/products.ts';
import { personas } from '../data/personas.ts';
import { levels } from '../data/levels.ts';
import type { QuizQuestion } from '../data/types.ts';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(SCRIPT_DIR, '../../supabase/migrations/0006_v2_content_reseed.sql');
const quizzesByLevelId: Record<string, QuizQuestion[]> = JSON.parse(
  fs.readFileSync(path.resolve(SCRIPT_DIR, '../data/quizBank.json'), 'utf-8')
);

// Id cũ (seed bởi 0005) không còn tồn tại trong bộ dữ liệu mới — cần xoá
// hẳn khỏi Supabase thay vì để mồ côi. Liệt kê tay vì đây là snapshot 1 lần
// tại thời điểm migrate, không phải logic tái sử dụng.
const OLD_PRODUCT_IDS = ['tiet-kiem-online', 'the-tin-dung', 'vay-tieu-dung', 'bao-hiem-lien-ket', 'combo'];
const OLD_LEVEL_IDS = [
  '1.1', '1.2', '1.3', '1.4', '1.5',
  '2.1', '2.2', '2.3', '2.4', '2.5',
  '3.1', '3.2', '3.3', '3.4', '3.5',
  '4.1', '4.2', '4.3', '4.4', '4.5',
  '5.1', '5.2', '5.3', '5.4', '5.5',
];

function sqlStr(value: string | undefined | null): string {
  if (value === undefined || value === null) return 'null';
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlBool(value: boolean | undefined): string {
  return value ? 'true' : 'false';
}

function sqlJson(value: unknown): string {
  return `'${JSON.stringify(value ?? []).replace(/'/g, "''")}'::jsonb`;
}

function sqlNum(value: number): string {
  return String(value);
}

function sqlIdList(ids: string[]): string {
  return ids.map((id) => sqlStr(id)).join(', ');
}

function productRow(p: (typeof products)[number]): string {
  return `(${sqlStr(p.id)}, ${sqlNum(p.order)}, ${sqlStr(p.name)}, ${sqlStr(p.shortName)}, ${sqlStr(p.shortDescription)}, ${sqlStr(p.targetAudience)}, ${sqlJson(p.benefits)}, ${sqlStr(p.basicConditions)}, ${sqlJson(p.keySellingPoints)}, ${sqlJson(p.objectionBank)}, ${sqlStr(p.complianceNote)}, ${sqlStr(p.knowledgeBase)})`;
}

function personaRow(p: (typeof personas)[number]): string {
  return `(${sqlStr(p.id)}, ${sqlNum(p.chapterNumber)}, ${sqlStr(p.name)}, ${sqlNum(p.starRating)}, ${sqlJson(p.criteria)}, ${sqlStr(p.behaviorNote)}, ${sqlStr(p.generalTactic)}, ${sqlStr(p.winCondition)}, ${sqlStr(p.recommendedProductId)}, ${sqlBool(p.isBossChapter)}, ${sqlStr(p.selfAddress)}, ${sqlStr(p.sellerAddress)}, ${sqlStr(p.speakingStyle)}, ${sqlStr(p.patienceNote)}, ${sqlStr(p.closingSignal)}, ${sqlStr(p.financialData)}, ${sqlStr(p.hiddenData)}, ${sqlStr(p.contrastExample)})`;
}

function levelRow(l: (typeof levels)[number]): string {
  return `(${sqlStr(l.id)}, ${sqlNum(l.chapterNumber)}, ${sqlStr(l.personaId)}, ${sqlStr(l.productId)}, ${sqlNum(l.starRating)}, ${sqlStr(l.openingLine)}, ${sqlJson(l.sampleFlow)}, ${sqlJson(l.objectionBank)}, ${sqlStr(l.winCriteria)}, ${sqlBool(l.isFinalBoss)}, ${sqlStr(l.trainingScript)}, ${sqlStr(l.openerRole ?? 'customer')}, ${sqlBool(l.strictScript)})`;
}

function quizRows(levelId: string): string[] {
  const questions = quizzesByLevelId[levelId] ?? [];
  return questions.map(
    (q, i) =>
      `(${sqlStr(levelId)}, ${sqlNum(i + 1)}, ${sqlStr(q.question)}, ${sqlJson(q.options)}, ${sqlStr(q.correctOptionId)}, ${sqlStr(q.explanation)})`
  );
}

const lines: string[] = [];

lines.push('-- M-BUDDY v2 — thay thế TOÀN BỘ nội dung nghiệp vụ (sản phẩm/chặng/level/');
lines.push('-- câu hỏi) bằng bộ mới theo v2_docs/ (Kich_ban_training.md,');
lines.push('-- Persona_5_nhan_vat.md, MSB_Product_Knowledge_Base.md, Rule_chung.md).');
lines.push('-- Sinh TỰ ĐỘNG bằng app/scripts/generateContentReseedSql.mts từ');
lines.push('-- app/data/products.ts, personas.ts, levels.ts, quizBank.json — KHÔNG tự sửa tay.');
lines.push('--');
lines.push('-- Chạy SAU 0005_seed_content.sql, TOÀN BỘ file này 1 lần trong Supabase');
lines.push('-- Dashboard > SQL Editor > New query. An toàn để chạy lại (upsert theo id).');
lines.push('--');
lines.push('-- KHÔNG động tới level_progress/roleplay_history — 2 bảng đó lưu level_id');
lines.push('-- dạng text rời, không có FK tới bảng levels, nên tiến độ/lịch sử cũ của');
lines.push('-- người dùng thật (nếu có) vẫn giữ nguyên, chỉ đơn giản không còn khớp với');
lines.push('-- level nào trong bộ mới nếu id đó đã bị xoá.');
lines.push('');

lines.push('-- ============================================================');
lines.push('-- 0. Thêm cột mới cho nội dung v2 (idempotent)');
lines.push('-- ============================================================');
lines.push('');
lines.push('alter table public.products add column if not exists knowledge_base text;');
lines.push('');
lines.push('alter table public.personas');
lines.push('  add column if not exists self_address text,');
lines.push('  add column if not exists seller_address text,');
lines.push('  add column if not exists speaking_style text,');
lines.push('  add column if not exists patience_note text,');
lines.push('  add column if not exists closing_signal text,');
lines.push('  add column if not exists financial_data text,');
lines.push('  add column if not exists hidden_data text,');
lines.push('  add column if not exists contrast_example text;');
lines.push('');
lines.push('alter table public.levels add column if not exists training_script text;');
lines.push('');
lines.push("alter table public.levels add column if not exists opener_role text not null default 'customer';");
lines.push('alter table public.levels add column if not exists strict_script boolean not null default false;');
lines.push('');

lines.push('-- ============================================================');
lines.push('-- 1. Xoá id cũ không còn tồn tại trong bộ mới');
lines.push('-- ============================================================');
lines.push('');
lines.push('-- Level cũ dạng "x.5"/"4.4"/"4.5" (chặng nào cũng có đúng 5 level) — bộ mới');
lines.push('-- không còn cố định 5 level/chặng (chặng 4 chỉ còn 3). Xoá trước products để');
lines.push('-- tránh phụ thuộc thứ tự (dù đã có on delete cascade từ products).');
lines.push(`delete from public.levels where id in (${sqlIdList(OLD_LEVEL_IDS)}) and id not in (${sqlIdList(levels.map((l) => l.id))});`);
lines.push('');
lines.push('-- Sản phẩm cũ (5 sản phẩm mẫu chung, không còn dùng) — cascade xoá luôn mọi');
lines.push('-- level còn sót tham chiếu tới chúng.');
lines.push(`delete from public.products where id in (${sqlIdList(OLD_PRODUCT_IDS)}) and id not in (${sqlIdList(products.map((p) => p.id))});`);
lines.push('');

lines.push('-- ============================================================');
lines.push('-- 2. Upsert products — ghi đè theo id nếu đã tồn tại');
lines.push('-- ============================================================');
lines.push('');
lines.push('insert into public.products');
lines.push('  (id, order_num, name, short_name, short_description, target_audience, benefits, basic_conditions, key_selling_points, objection_bank, compliance_note, knowledge_base)');
lines.push('values');
lines.push(products.map(productRow).join(',\n') + '');
lines.push('on conflict (id) do update set');
lines.push('  order_num = excluded.order_num,');
lines.push('  name = excluded.name,');
lines.push('  short_name = excluded.short_name,');
lines.push('  short_description = excluded.short_description,');
lines.push('  target_audience = excluded.target_audience,');
lines.push('  benefits = excluded.benefits,');
lines.push('  basic_conditions = excluded.basic_conditions,');
lines.push('  key_selling_points = excluded.key_selling_points,');
lines.push('  objection_bank = excluded.objection_bank,');
lines.push('  compliance_note = excluded.compliance_note,');
lines.push('  knowledge_base = excluded.knowledge_base,');
lines.push('  updated_at = now();');
lines.push('');

lines.push('-- ============================================================');
lines.push('-- 3. Upsert personas — 5 id giữ nguyên, chỉ ghi đè nội dung');
lines.push('-- ============================================================');
lines.push('');
lines.push('insert into public.personas');
lines.push('  (id, chapter_number, name, star_rating, criteria, behavior_note, general_tactic, win_condition, recommended_product_id, is_boss_chapter, self_address, seller_address, speaking_style, patience_note, closing_signal, financial_data, hidden_data, contrast_example)');
lines.push('values');
lines.push(personas.map(personaRow).join(',\n') + '');
lines.push('on conflict (id) do update set');
lines.push('  chapter_number = excluded.chapter_number,');
lines.push('  name = excluded.name,');
lines.push('  star_rating = excluded.star_rating,');
lines.push('  criteria = excluded.criteria,');
lines.push('  behavior_note = excluded.behavior_note,');
lines.push('  general_tactic = excluded.general_tactic,');
lines.push('  win_condition = excluded.win_condition,');
lines.push('  recommended_product_id = excluded.recommended_product_id,');
lines.push('  is_boss_chapter = excluded.is_boss_chapter,');
lines.push('  self_address = excluded.self_address,');
lines.push('  seller_address = excluded.seller_address,');
lines.push('  speaking_style = excluded.speaking_style,');
lines.push('  patience_note = excluded.patience_note,');
lines.push('  closing_signal = excluded.closing_signal,');
lines.push('  financial_data = excluded.financial_data,');
lines.push('  hidden_data = excluded.hidden_data,');
lines.push('  contrast_example = excluded.contrast_example,');
lines.push('  updated_at = now();');
lines.push('');

lines.push('-- ============================================================');
lines.push('-- 4. Upsert levels — 13/19 id giữ nguyên (1.1-3.4, 4.1-4.3, 5.1-5.4 mới)');
lines.push('-- ============================================================');
lines.push('');
lines.push('insert into public.levels');
lines.push('  (id, chapter_number, persona_id, product_id, star_rating, opening_line, sample_flow, objection_bank, win_criteria, is_final_boss, training_script, opener_role, strict_script)');
lines.push('values');
lines.push(levels.map(levelRow).join(',\n') + '');
lines.push('on conflict (id) do update set');
lines.push('  chapter_number = excluded.chapter_number,');
lines.push('  persona_id = excluded.persona_id,');
lines.push('  product_id = excluded.product_id,');
lines.push('  star_rating = excluded.star_rating,');
lines.push('  opening_line = excluded.opening_line,');
lines.push('  sample_flow = excluded.sample_flow,');
lines.push('  objection_bank = excluded.objection_bank,');
lines.push('  win_criteria = excluded.win_criteria,');
lines.push('  is_final_boss = excluded.is_final_boss,');
lines.push('  training_script = excluded.training_script,');
lines.push('  opener_role = excluded.opener_role,');
lines.push('  strict_script = excluded.strict_script,');
lines.push('  updated_at = now();');
lines.push('');

lines.push('-- ============================================================');
lines.push('-- 5. Thay hẳn quiz_questions cho 19 level trên (xoá cũ, chèn mới)');
lines.push('-- ============================================================');
lines.push('');
lines.push(`delete from public.quiz_questions where level_id in (${sqlIdList(levels.map((l) => l.id))});`);
lines.push('');
const allQuizRows = levels.flatMap((l) => quizRows(l.id));
lines.push('insert into public.quiz_questions');
lines.push('  (level_id, question_order, question, options, correct_option_id, explanation)');
lines.push('values');
lines.push(allQuizRows.join(',\n') + '');
lines.push('on conflict (level_id, question_order) do update set');
lines.push('  question = excluded.question,');
lines.push('  options = excluded.options,');
lines.push('  correct_option_id = excluded.correct_option_id,');
lines.push('  explanation = excluded.explanation;');
lines.push('');

fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf-8');
console.log(`Ghi xong: ${OUTPUT_PATH}`);
console.log(`${products.length} sản phẩm, ${personas.length} chặng, ${levels.length} level, ${allQuizRows.length} câu hỏi.`);
console.log(`Xoá ${OLD_PRODUCT_IDS.length} sản phẩm cũ, tối đa ${OLD_LEVEL_IDS.length - levels.length} level cũ không còn dùng.`);

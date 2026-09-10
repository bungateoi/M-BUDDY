/**
 * Sinh file SQL seed `supabase/migrations/0005_seed_content.sql` từ dữ liệu
 * tĩnh hiện có (app/data/products.ts, personas.ts, levels.ts, quizzes.ts) —
 * để nạp sẵn đúng 5 sản phẩm/5 chặng/25 level/125 câu hỏi vào Supabase, cho
 * màn "Quản trị hành trình & tri thức" có dữ liệu thật ngay từ đầu thay vì
 * bảng trống.
 *
 * Script chạy 1 lần, không phải API route — không dùng khi app đang chạy.
 * Không cần credential Supabase gì cả (chỉ đọc data tĩnh, in ra SQL) — file
 * SQL sinh ra do NGƯỜI DÙNG tự chạy trong Supabase SQL Editor, giống các
 * migration trước.
 *
 * Cách chạy (từ thư mục app/):
 *   node scripts/generateContentSeedSql.mts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../data/products.ts';
import { personas } from '../data/personas.ts';
import { levels } from '../data/levels.ts';
import type { QuizQuestion } from '../data/types.ts';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(SCRIPT_DIR, '../../supabase/migrations/0005_seed_content.sql');
// Đọc trực tiếp bằng fs thay vì `import ... with { type: 'json' }` — tránh
// phải thêm import attribute chỉ cho 1 script chạy 1 lần này.
const quizzesByLevelId: Record<string, QuizQuestion[]> = JSON.parse(
  fs.readFileSync(path.resolve(SCRIPT_DIR, '../data/quizBank.json'), 'utf-8')
);

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

function productRow(p: (typeof products)[number]): string {
  return `(${sqlStr(p.id)}, ${sqlNum(p.order)}, ${sqlStr(p.name)}, ${sqlStr(p.shortName)}, ${sqlStr(p.shortDescription)}, ${sqlStr(p.targetAudience)}, ${sqlJson(p.benefits)}, ${sqlStr(p.basicConditions)}, ${sqlJson(p.keySellingPoints)}, ${sqlJson(p.objectionBank)}, ${sqlStr(p.complianceNote)})`;
}

function personaRow(p: (typeof personas)[number]): string {
  return `(${sqlStr(p.id)}, ${sqlNum(p.chapterNumber)}, ${sqlStr(p.name)}, ${sqlNum(p.starRating)}, ${sqlJson(p.criteria)}, ${sqlStr(p.behaviorNote)}, ${sqlStr(p.generalTactic)}, ${sqlStr(p.winCondition)}, ${sqlStr(p.recommendedProductId)}, ${sqlBool(p.isBossChapter)})`;
}

function levelRow(l: (typeof levels)[number]): string {
  return `(${sqlStr(l.id)}, ${sqlNum(l.chapterNumber)}, ${sqlStr(l.personaId)}, ${sqlStr(l.productId)}, ${sqlNum(l.starRating)}, ${sqlStr(l.openingLine)}, ${sqlJson(l.sampleFlow)}, ${sqlJson(l.objectionBank)}, ${sqlStr(l.winCriteria)}, ${sqlBool(l.isFinalBoss)})`;
}

function quizRows(levelId: string): string[] {
  const questions = quizzesByLevelId[levelId] ?? [];
  return questions.map(
    (q, i) =>
      `(${sqlStr(levelId)}, ${sqlNum(i + 1)}, ${sqlStr(q.question)}, ${sqlJson(q.options)}, ${sqlStr(q.correctOptionId)}, ${sqlStr(q.explanation)})`
  );
}

const lines: string[] = [];

lines.push('-- M-BUDDY — seed dữ liệu nội dung hiện có (5 sản phẩm/5 chặng/25 level/125');
lines.push('-- câu hỏi) vào Supabase, sinh TỰ ĐỘNG bằng app/scripts/generateContentSeedSql.mts');
lines.push('-- từ app/data/products.ts, personas.ts, levels.ts, quizzes.ts — KHÔNG tự sửa tay.');
lines.push('--');
lines.push('-- Chạy SAU 0004_content_management.sql, TOÀN BỘ file này 1 lần trong Supabase');
lines.push('-- Dashboard > SQL Editor > New query. An toàn để chạy lại (on conflict do nothing).');
lines.push('');

lines.push('insert into public.products');
lines.push('  (id, order_num, name, short_name, short_description, target_audience, benefits, basic_conditions, key_selling_points, objection_bank, compliance_note)');
lines.push('values');
lines.push(products.map(productRow).join(',\n') + '');
lines.push('on conflict (id) do nothing;');
lines.push('');

lines.push('insert into public.personas');
lines.push('  (id, chapter_number, name, star_rating, criteria, behavior_note, general_tactic, win_condition, recommended_product_id, is_boss_chapter)');
lines.push('values');
lines.push(personas.map(personaRow).join(',\n') + '');
lines.push('on conflict (id) do nothing;');
lines.push('');

lines.push('insert into public.levels');
lines.push('  (id, chapter_number, persona_id, product_id, star_rating, opening_line, sample_flow, objection_bank, win_criteria, is_final_boss)');
lines.push('values');
lines.push(levels.map(levelRow).join(',\n') + '');
lines.push('on conflict (id) do nothing;');
lines.push('');

const allQuizRows = levels.flatMap((l) => quizRows(l.id));
lines.push('insert into public.quiz_questions');
lines.push('  (level_id, question_order, question, options, correct_option_id, explanation)');
lines.push('values');
lines.push(allQuizRows.join(',\n') + '');
lines.push('on conflict (level_id, question_order) do nothing;');
lines.push('');

fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf-8');
console.log(`Ghi xong: ${OUTPUT_PATH}`);
console.log(`${products.length} sản phẩm, ${personas.length} chặng, ${levels.length} level, ${allQuizRows.length} câu hỏi.`);

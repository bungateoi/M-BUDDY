/**
 * Sinh sẵn 125 câu hỏi trắc nghiệm (5 câu × 25 level) cho màn "Ôn tập
 * nhanh", ghi ra app/data/quizBank.json để review trước khi gộp vào
 * app/data/quizzes.ts (quizzesByLevelId).
 *
 * Script chạy 1 lần, không phải API route — không dùng khi app đang chạy.
 *
 * Input: dùng trực tiếp app/data/products.ts + personas.ts + levels.ts
 * (đã parse sẵn từ docs/products.md, docs/personas.md,
 * docs/roleplay-scenarios.md khi các file này được tạo ở Phase 1) thay vì
 * tự parse lại 3 file markdown — cùng nội dung, nhưng đã có sẵn dạng có
 * cấu trúc (keySellingPoints, objectionBank...) nên đáng tin cậy hơn parse
 * markdown bằng regex.
 *
 * Cách chạy (từ thư mục app/):
 *   node --env-file=../agent/.env scripts/generateQuizBank.mts
 *
 * (Dùng chung LLM_API_KEY/LLM_BASE_URL/LLM_MODEL đã cấu hình cho backend ở
 * /agent/.env — không tạo credential riêng cho script này.)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../data/products.ts';
import { personas } from '../data/personas.ts';
import { levels } from '../data/levels.ts';
import type { Level, Persona, Product, QuizOptionId, QuizQuestion } from '../data/types.ts';

const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_BASE_URL = process.env.LLM_BASE_URL;
const LLM_MODEL = process.env.LLM_MODEL;

if (!LLM_API_KEY || !LLM_BASE_URL || !LLM_MODEL) {
  console.error(
    'Thiếu LLM_API_KEY / LLM_BASE_URL / LLM_MODEL trong environment.\n' +
    'Chạy script này với --env-file trỏ vào agent/.env, ví dụ (từ thư mục app/):\n' +
    '  node --env-file=../agent/.env scripts/generateQuizBank.mts'
  );
  process.exit(1);
}

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(SCRIPT_DIR, '../data/quizBank.json');
const LETTERS: QuizOptionId[] = ['A', 'B', 'C', 'D'];
const QUESTIONS_PER_LEVEL = 5;
const MAX_ATTEMPTS = 2;

interface RawQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return match ? match[1].trim() : trimmed;
}

function buildPrompt(level: Level, product: Product, persona: Persona): string {
  const keySellingPoints = product.keySellingPoints.map((p) => `- ${p}`).join('\n');
  const productObjections = product.objectionBank
    .map((o) => `- Hỏi: "${o.question}" -> Trả lời chuẩn: ${o.sampleAnswer}`)
    .join('\n');
  const levelObjections = level.objectionBank
    .map((o) => `- "${o.trigger}" -> ${o.guidance}`)
    .join('\n') || '(không có)';

  return `Bạn là chuyên gia đào tạo sales ngân hàng, soạn câu hỏi trắc nghiệm kiểm
tra kiến thức sản phẩm cho nhân viên TRƯỚC KHI họ luyện tập role-play gọi
điện tư vấn khách hàng.

Sản phẩm: ${product.name} — ${product.shortDescription}
Điều kiện cơ bản: ${product.basicConditions}
Đối tượng khách hàng trong tình huống này: ${persona.name}, ${persona.criteria.occupation}, ${persona.criteria.age} tuổi.

Key selling points cần nhân viên nắm chắc:
${keySellingPoints}

Objection bank của sản phẩm (câu hỏi khách hay hỏi + câu trả lời chuẩn):
${productObjections}

Objection bank riêng của tình huống này:
${levelObjections}

Soạn ĐÚNG ${QUESTIONS_PER_LEVEL} câu hỏi trắc nghiệm tiếng Việt, kiểm tra
trực tiếp kiến thức sản phẩm và cách xử lý phản đối ở trên (không hỏi
chung chung ngoài phạm vi những gì liệt kê). Mỗi câu có ĐÚNG 4 phương án,
chỉ 1 phương án đúng, kèm giải thích ngắn gọn (1-2 câu) sau khi trả lời.

Trả về CHỈ MỘT JSON object, không thêm text hay markdown nào khác, đúng
format sau:
{"questions": [{"question": string, "options": [string, string, string, string], "correctIndex": 0|1|2|3, "explanation": string}, ...đúng ${QUESTIONS_PER_LEVEL} phần tử]}`;
}

function validateRaw(raw: unknown): raw is { questions: RawQuestion[] } {
  if (!raw || typeof raw !== 'object' || !Array.isArray((raw as { questions?: unknown }).questions)) {
    return false;
  }
  const questions = (raw as { questions: unknown[] }).questions;
  if (questions.length !== QUESTIONS_PER_LEVEL) return false;
  return questions.every((q) => {
    if (!q || typeof q !== 'object') return false;
    const r = q as Record<string, unknown>;
    return (
      typeof r.question === 'string' &&
      Array.isArray(r.options) &&
      r.options.length === 4 &&
      r.options.every((o) => typeof o === 'string') &&
      typeof r.correctIndex === 'number' &&
      r.correctIndex >= 0 &&
      r.correctIndex <= 3 &&
      typeof r.explanation === 'string'
    );
  });
}

async function callLLM(prompt: string): Promise<string> {
  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('LLM trả về content rỗng');
  }
  return content;
}

async function generateForLevel(level: Level, product: Product, persona: Persona): Promise<RawQuestion[]> {
  const prompt = buildPrompt(level, product, persona);
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const content = await callLLM(prompt);
      const parsed = JSON.parse(stripJsonFences(content));
      if (!validateRaw(parsed)) {
        throw new Error(`JSON không đúng schema (attempt ${attempt}): ${JSON.stringify(parsed).slice(0, 200)}`);
      }
      return parsed.questions;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function toQuizQuestions(levelId: string, raw: RawQuestion[]): QuizQuestion[] {
  return raw.map((q, i) => ({
    id: `${levelId}-q${i + 1}`,
    question: q.question,
    options: q.options.map((text, idx) => ({ id: LETTERS[idx], text })),
    correctOptionId: LETTERS[q.correctIndex],
    explanation: q.explanation,
  }));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const result: Record<string, QuizQuestion[]> = {};
  const failures: string[] = [];

  console.log(`Sinh quiz cho ${levels.length} level, model=${LLM_MODEL}...\n`);

  for (const level of levels) {
    const product = products.find((p) => p.id === level.productId);
    const persona = personas.find((p) => p.id === level.personaId);
    if (!product || !persona) {
      console.log(`[${level.id}] BỎ QUA — thiếu product/persona tương ứng`);
      failures.push(level.id);
      continue;
    }

    process.stdout.write(`[${level.id}] ${product.name} × ${persona.name} ... `);
    try {
      const raw = await generateForLevel(level, product, persona);
      result[level.id] = toQuizQuestions(level.id, raw);
      console.log('OK');
    } catch (err) {
      console.log(`FAILED — ${err instanceof Error ? err.message : String(err)}`);
      failures.push(level.id);
    }

    await sleep(300);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf-8');

  console.log(`\nGhi xong: ${OUTPUT_PATH}`);
  console.log(`Thành công: ${Object.keys(result).length}/${levels.length} level.`);
  if (failures.length) {
    console.log(`Thất bại (${failures.length}): ${failures.join(', ')} — chạy lại script sẽ tự tạo lại toàn bộ.`);
  }
  console.log('\n⚠️  Đây là file để REVIEW, chưa được dùng trong app — quizzesByLevelId ở');
  console.log('   app/data/quizzes.ts vẫn giữ nguyên cho tới khi bạn duyệt nội dung và');
  console.log('   yêu cầu gộp vào.');
}

main().catch((err) => {
  console.error('Lỗi không mong muốn:', err);
  process.exit(1);
});

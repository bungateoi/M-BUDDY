import { supabase } from './supabaseClient';
import {
  replaceLevels,
  replacePersonas,
  replaceProducts,
  replaceQuizzes,
} from '../data';
import type { Level, Persona, Product, QuizQuestion } from '../data/types';

// Lớp hydrate nội dung nghiệp vụ (sản phẩm/chặng/level/câu hỏi trắc
// nghiệm) từ Supabase — thay cho dữ liệu tĩnh trong app/data/products.ts,
// personas.ts, levels.ts, quizzes.ts (giờ chỉ còn là SEED mặc định). Xem
// kế hoạch: /Users/mac/.claude/plans/vivid-leaping-sphinx.md
//
// Ghi (tạo/sửa sản phẩm/chặng + tự sinh lại quiz/kịch bản bằng AI) KHÔNG đi
// qua Supabase trực tiếp — đi qua agent/main.py (POST /admin/products,
// /admin/personas), vì cần gọi LLM. Xem saveProduct/savePersona bên dưới.

interface ProductRow {
  id: string;
  order_num: number;
  name: string;
  short_name: string | null;
  short_description: string;
  target_audience: string;
  benefits: string[];
  basic_conditions: string;
  key_selling_points: string[];
  objection_bank: Product['objectionBank'];
  compliance_note: string | null;
  is_hidden: boolean;
  hidden_chapter_numbers: number[];
  /** v2 — xem migration 0006_v2_content_reseed.sql. */
  knowledge_base: string | null;
}

interface PersonaRow {
  id: string;
  chapter_number: number;
  name: string;
  star_rating: number | string;
  criteria: Persona['criteria'];
  behavior_note: string;
  general_tactic: string;
  win_condition: string;
  recommended_product_id: string | null;
  is_boss_chapter: boolean;
  is_hidden: boolean;
  // v2 — xem migration 0006_v2_content_reseed.sql.
  self_address: string | null;
  seller_address: string | null;
  speaking_style: string | null;
  patience_note: string | null;
  closing_signal: string | null;
  financial_data: string | null;
  hidden_data: string | null;
  contrast_example: string | null;
}

interface LevelRow {
  id: string;
  chapter_number: number;
  persona_id: string;
  product_id: string;
  star_rating: number | string;
  opening_line: string;
  sample_flow: string[];
  objection_bank: Level['objectionBank'];
  win_criteria: string;
  is_final_boss: boolean;
  /** v2 — xem migration 0006_v2_content_reseed.sql. */
  training_script: string | null;
}

interface QuizQuestionRow {
  level_id: string;
  question_order: number;
  question: string;
  options: QuizQuestion['options'];
  correct_option_id: QuizQuestion['correctOptionId'];
  explanation: string;
}

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    order: row.order_num,
    name: row.name,
    shortName: row.short_name ?? undefined,
    shortDescription: row.short_description,
    targetAudience: row.target_audience,
    benefits: row.benefits ?? [],
    basicConditions: row.basic_conditions,
    keySellingPoints: row.key_selling_points ?? [],
    objectionBank: row.objection_bank ?? [],
    complianceNote: row.compliance_note ?? undefined,
    isHidden: row.is_hidden ?? false,
    hiddenChapterNumbers: row.hidden_chapter_numbers ?? [],
    knowledgeBase: row.knowledge_base ?? undefined,
  };
}

function mapPersonaRow(row: PersonaRow): Persona {
  return {
    id: row.id,
    chapterNumber: row.chapter_number,
    name: row.name,
    starRating: Number(row.star_rating),
    criteria: row.criteria,
    behaviorNote: row.behavior_note,
    generalTactic: row.general_tactic,
    winCondition: row.win_condition,
    recommendedProductId: row.recommended_product_id ?? '',
    isBossChapter: row.is_boss_chapter ?? false,
    isHidden: row.is_hidden ?? false,
    selfAddress: row.self_address ?? undefined,
    sellerAddress: row.seller_address ?? undefined,
    speakingStyle: row.speaking_style ?? undefined,
    patienceNote: row.patience_note ?? undefined,
    closingSignal: row.closing_signal ?? undefined,
    financialData: row.financial_data ?? undefined,
    hiddenData: row.hidden_data ?? undefined,
    contrastExample: row.contrast_example ?? undefined,
  };
}

function mapLevelRow(row: LevelRow): Level {
  return {
    id: row.id,
    chapterNumber: row.chapter_number,
    personaId: row.persona_id,
    productId: row.product_id,
    starRating: Number(row.star_rating),
    openingLine: row.opening_line,
    sampleFlow: row.sample_flow ?? [],
    objectionBank: row.objection_bank ?? [],
    winCriteria: row.win_criteria,
    isFinalBoss: row.is_final_boss ?? false,
    trainingScript: row.training_script ?? undefined,
  };
}

function mapQuizRows(rows: QuizQuestionRow[]): Record<string, QuizQuestion[]> {
  const byLevel: Record<string, QuizQuestion[]> = {};
  [...rows]
    .sort((a, b) => a.question_order - b.question_order)
    .forEach((row) => {
      const list = byLevel[row.level_id] ?? (byLevel[row.level_id] = []);
      list.push({
        id: `${row.level_id}-q${row.question_order}`,
        question: row.question,
        options: row.options,
        correctOptionId: row.correct_option_id,
        explanation: row.explanation,
      });
    });
  return byLevel;
}

/** Nạp nội dung thật từ Supabase, thay cho seed tĩnh trong app/data/*.ts —
 * gọi 1 lần sau khi có session (App.tsx#AuthGate, SAU khi profile tải
 * xong, vì RLS 4 bảng này chỉ mở cho role 'authenticated'). Bảng nào rỗng
 * (chưa chạy migration seed) thì giữ nguyên seed tĩnh cho bảng đó — không
 * làm app trắng trơn nếu DB chưa có dữ liệu. Lỗi mạng/bất kỳ cũng bỏ qua
 * tương tự, không chặn app mở lên. */
export async function hydrateContentFromBackend(): Promise<void> {
  try {
    const [productsRes, personasRes, levelsRes, quizRes] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('personas').select('*'),
      supabase.from('levels').select('*'),
      supabase.from('quiz_questions').select('*'),
    ]);

    if (!productsRes.error && productsRes.data && productsRes.data.length > 0) {
      replaceProducts((productsRes.data as ProductRow[]).map(mapProductRow));
    }
    if (!personasRes.error && personasRes.data && personasRes.data.length > 0) {
      replacePersonas((personasRes.data as PersonaRow[]).map(mapPersonaRow));
    }
    if (!levelsRes.error && levelsRes.data && levelsRes.data.length > 0) {
      replaceLevels((levelsRes.data as LevelRow[]).map(mapLevelRow));
    }
    if (!quizRes.error && quizRes.data && quizRes.data.length > 0) {
      replaceQuizzes(mapQuizRows(quizRes.data as QuizQuestionRow[]));
    }
  } catch {
    // Offline hoặc lỗi bất kỳ — giữ nguyên seed tĩnh, không chặn app.
  }
}

// ---- Ghi (chỉ admin) — gọi thẳng agent/main.py, xem verify_admin() ở đó ----

function getBackendUrl(): string {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (!url) throw new Error('EXPO_PUBLIC_BACKEND_URL chưa được cấu hình — xem app/.env.example.');
  return url.replace(/\/+$/, '');
}

async function getAccessTokenOrThrow(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Chưa đăng nhập.');
  return token;
}

export interface SaveProductInput {
  id: string;
  isNew: boolean;
  name: string;
  shortName?: string;
  shortDescription: string;
  targetAudience: string;
  benefits: string[];
  basicConditions: string;
  keySellingPoints: string[];
  objectionBank: Product['objectionBank'];
  complianceNote?: string;
  isHidden: boolean;
  hiddenChapterNumbers: number[];
  /** Chỉ có ý nghĩa khi isNew=true — các chặng (chapterNumber) sẽ được tạo
   * level tương ứng ngay khi lưu. */
  applyToChapterNumbers?: number[];
}

export interface SavePersonaInput {
  id: string;
  isNew: boolean;
  name: string;
  starRating: number;
  criteria: Persona['criteria'];
  behaviorNote: string;
  generalTactic: string;
  winCondition: string;
  recommendedProductId?: string;
  isBossChapter?: boolean;
  isHidden: boolean;
  /** Chỉ có ý nghĩa khi isNew=true — các sản phẩm (id) sẽ được tạo level
   * tương ứng ngay khi lưu. */
  applyToProductIds?: string[];
}

interface SaveContentResult {
  affectedLevelIds: string[];
}

/** Tạo mới/sửa 1 sản phẩm — backend tự sinh lại (bằng AI) quiz + kịch bản
 * role-play cho mọi level bị ảnh hưởng rồi lưu vào Supabase. Có thể chạy
 * chậm (nhiều lượt gọi LLM tuần tự). */
export async function saveProduct(input: SaveProductInput): Promise<SaveContentResult> {
  const token = await getAccessTokenOrThrow();
  const res = await fetch(`${getBackendUrl()}/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `saveProduct thất bại: HTTP ${res.status}`);
  }
  return res.json();
}

/** Tạo mới/sửa 1 chặng (persona) — tương tự saveProduct. */
export async function savePersona(input: SavePersonaInput): Promise<SaveContentResult> {
  const token = await getAccessTokenOrThrow();
  const res = await fetch(`${getBackendUrl()}/admin/personas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `savePersona thất bại: HTTP ${res.status}`);
  }
  return res.json();
}

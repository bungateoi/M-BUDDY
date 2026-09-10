/**
 * Sinh sẵn cấu hình role-play (behaviorNote, openingLine, winCriteria,
 * objectionBank, product) cho 20 hồ sơ khách hàng thật ở màn Practice, ghi
 * ra app/data/customerRoleplayConfigs.json.
 *
 * Script chạy 1 lần, không phải API route — không dùng khi app đang chạy.
 * Cùng cách làm với generateQuizBank.mts: sinh sẵn 1 lần bằng AI, sau đó
 * app chỉ đọc file JSON tĩnh — bấm "Luyện tập" ở màn Practice không gọi AI
 * để dựng bối cảnh, chỉ dùng để trả lời/chấm điểm từng lượt hội thoại
 * (giống hệt luồng role-play trong Map, xem RolePlayScreen.tsx).
 *
 * Input: app/data/customerProfiles.ts (20 hồ sơ, đã parse sẵn từ
 * docs/ho_so_khach_hang.md).
 *
 * Cách chạy (từ thư mục app/):
 *   node --env-file=../agent/.env scripts/generateCustomerRoleplayConfigs.mts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { customerProfiles } from '../data/customerProfiles.ts';
import type { CustomerProfile, CustomerRoleplayConfig } from '../data/types.ts';

const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_BASE_URL = process.env.LLM_BASE_URL;
const LLM_MODEL = process.env.LLM_MODEL;

if (!LLM_API_KEY || !LLM_BASE_URL || !LLM_MODEL) {
  console.error(
    'Thiếu LLM_API_KEY / LLM_BASE_URL / LLM_MODEL trong environment.\n' +
      'Chạy script này với --env-file trỏ vào agent/.env, ví dụ (từ thư mục app/):\n' +
      '  node --env-file=../agent/.env scripts/generateCustomerRoleplayConfigs.mts'
  );
  process.exit(1);
}

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(SCRIPT_DIR, '../data/customerRoleplayConfigs.json');
const MAX_ATTEMPTS = 2;

const DIFFICULTY_LABEL: Record<CustomerProfile['difficulty'], string> = {
  De: 'Dễ',
  TrungBinh: 'Trung bình',
  Kho: 'Khó',
  RatKho: 'Rất khó',
};

const DIFFICULTY_HINT: Record<CustomerProfile['difficulty'], string> = {
  De: 'dễ tính, cởi mở nhanh, tin tưởng nhân viên nếu được giải thích rõ ràng, không đòi hỏi nhiều bằng chứng.',
  TrungBinh: 'cẩn trọng vừa phải — cần được giải thích thuyết phục, có thể hỏi lại 1-2 lần trước khi đồng ý.',
  Kho: 'hoài nghi, đặt câu hỏi khai thác kỹ, so sánh nhiều lựa chọn, không dễ bị thuyết phục nhanh.',
  RatKho: 'rất khó tính, đòi hỏi cao, chất vấn liên tục, ít tin tưởng sales ngay từ đầu, cần lý lẽ/bằng chứng vững mới cân nhắc.',
};

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return match ? match[1].trim() : trimmed;
}

function buildPrompt(c: CustomerProfile): string {
  return `Bạn là chuyên gia thiết kế kịch bản luyện tập (role-play) cho nhân viên
sales ngân hàng bán lẻ (RB) tại Việt Nam.

Hồ sơ khách hàng (có thật, dùng để luyện tập — không phải khách hàng thật):
- Tên: ${c.name}
- Tuổi: ${c.age}, Giới tính: ${c.gender}
- Nghề nghiệp: ${c.occupation}
- Thu nhập: ${c.incomeText}
- Khu vực: ${c.region}
- Nhu cầu/Mục tiêu: ${c.needs}
- Hành vi hiện tại: ${c.currentBehavior}
- Pain points: ${c.painPoints}
- Kỳ vọng: ${c.expectations}
- Động lực: ${c.motivation}
- Rào cản: ${c.barrier}
- Mức độ khó khi tư vấn (đã xếp hạng trước, PHẢI tuân theo đúng mức này):
  ${DIFFICULTY_LABEL[c.difficulty]} — nghĩa là khách hàng này ${DIFFICULTY_HINT[c.difficulty]}

Nhiệm vụ: tạo cấu hình cho 1 buổi role-play gọi điện tư vấn, trong đó AI sẽ
đóng vai CHÍNH khách hàng này khi luyện tập với nhân viên sales.

1. behaviorNote: mô tả cách khách hàng này phản ứng/nói chuyện trong cuộc
   gọi (giọng điệu, mức độ khó tính, tốc độ ra quyết định, cách đặt câu
   hỏi...) — PHẢI khớp đúng mức độ khó ở trên VÀ khớp nghề nghiệp/hoàn
   cảnh cụ thể của khách (vd. sinh viên mới đi làm sẽ rụt rè, ít kiến thức
   tài chính hơn hẳn so với giám đốc doanh nghiệp từng trải nhiều ngân
   hàng). 2-3 câu, cụ thể, không chung chung.
2. openingLine: câu đầu tiên khách hàng nói khi vừa nhấc máy nghe điện
   thoại sales gọi tới — ngắn gọn, tự nhiên, đúng tính cách.
3. winCriteria: tiêu chí cụ thể để coi là nhân viên sales đã tư vấn thành
   công trong đúng tình huống của khách hàng này.
4. objectionBank: 2-4 câu phản đối/nghi ngại cụ thể mà khách hàng này CÓ
   THỂ đưa ra trong cuộc gọi (trigger), kèm hướng xử lý gợi ý cho nhân
   viên (guidance) — phải bám sát đúng painPoints/rào cản/kỳ vọng ở trên,
   không phản đối chung chung.
5. product: sản phẩm/giải pháp ngân hàng phù hợp NHẤT để tư vấn đúng nhu
   cầu của khách hàng này — name (tên ngắn gọn, tiếng Việt), shortDescription
   (1-2 câu), keySellingPoints (3-4 điểm bán chính cụ thể, dùng để chấm
   điểm kiến thức sản phẩm của nhân viên sau buổi luyện tập).

Trả về CHỈ MỘT JSON object, không thêm text hay markdown nào khác, đúng
format sau:
{"behaviorNote": string, "openingLine": string, "winCriteria": string, "objectionBank": [{"trigger": string, "guidance": string}, ...2-4 phần tử], "product": {"name": string, "shortDescription": string, "keySellingPoints": [string, ...3-4 phần tử]}}`;
}

function validateRaw(raw: unknown): raw is CustomerRoleplayConfig {
  if (!raw || typeof raw !== 'object') return false;
  const r = raw as Record<string, unknown>;
  if (typeof r.behaviorNote !== 'string' || !r.behaviorNote.trim()) return false;
  if (typeof r.openingLine !== 'string' || !r.openingLine.trim()) return false;
  if (typeof r.winCriteria !== 'string' || !r.winCriteria.trim()) return false;
  if (!Array.isArray(r.objectionBank) || r.objectionBank.length < 2 || r.objectionBank.length > 4) return false;
  if (
    !r.objectionBank.every(
      (o) =>
        o &&
        typeof o === 'object' &&
        typeof (o as Record<string, unknown>).trigger === 'string' &&
        typeof (o as Record<string, unknown>).guidance === 'string'
    )
  ) {
    return false;
  }
  const product = r.product as Record<string, unknown> | undefined;
  if (!product || typeof product !== 'object') return false;
  if (typeof product.name !== 'string' || !product.name.trim()) return false;
  if (typeof product.shortDescription !== 'string' || !product.shortDescription.trim()) return false;
  if (!Array.isArray(product.keySellingPoints) || product.keySellingPoints.length < 3) return false;
  if (!product.keySellingPoints.every((p) => typeof p === 'string')) return false;
  return true;
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

async function generateForCustomer(c: CustomerProfile): Promise<CustomerRoleplayConfig> {
  const prompt = buildPrompt(c);
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const content = await callLLM(prompt);
      const parsed = JSON.parse(stripJsonFences(content));
      if (!validateRaw(parsed)) {
        throw new Error(`JSON không đúng schema (attempt ${attempt}): ${JSON.stringify(parsed).slice(0, 200)}`);
      }
      return parsed;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const result: Record<string, CustomerRoleplayConfig> = {};
  const failures: string[] = [];

  console.log(`Sinh cấu hình role-play cho ${customerProfiles.length} khách hàng, model=${LLM_MODEL}...\n`);

  for (const c of customerProfiles) {
    process.stdout.write(`[${c.id}] ${c.name} (${DIFFICULTY_LABEL[c.difficulty]}) ... `);
    try {
      result[c.id] = await generateForCustomer(c);
      console.log('OK');
    } catch (err) {
      console.log(`FAILED — ${err instanceof Error ? err.message : String(err)}`);
      failures.push(c.id);
    }
    await sleep(300);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf-8');

  console.log(`\nGhi xong: ${OUTPUT_PATH}`);
  console.log(`Thành công: ${Object.keys(result).length}/${customerProfiles.length} khách hàng.`);
  if (failures.length) {
    console.log(`Thất bại (${failures.length}): ${failures.join(', ')} — chạy lại script sẽ tự tạo lại toàn bộ.`);
  }
}

main().catch((err) => {
  console.error('Lỗi không mong muốn:', err);
  process.exit(1);
});

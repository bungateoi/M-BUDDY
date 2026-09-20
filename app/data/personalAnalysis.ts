import { levels } from './levels';
import { products } from './products';
import type { KnowledgeTopicProgress, PracticeHistoryEntry, PracticeRecommendation, SkillScore } from './types';

// Import trực tiếp từ './levels'/'./products' (không qua barrel './index') —
// index.ts re-export chính module này, import ngược lại sẽ tạo circular
// import (xem lý do tương tự ở data/scoringMapper.ts).

// Nội dung cho màn "Phân tích chi tiết" (Home > Kiến thức & Kỹ năng > Xem
// chi tiết, xem ui-draft/man-phantich-canhan.png).

/** Nhận xét điểm mạnh/điểm cần cải thiện — tính TỪ skills thật của user
 * (không hardcode nữa, vì mỗi user giờ có skill_scores thật khác nhau, xem
 * lib/authData.ts). Chưa có backend AI phân tích riêng cho việc này (khác
 * /score, vốn chỉ chấm 1 buổi role-play cụ thể) nên dùng 1 công thức đơn
 * giản: 2 tiêu chí cao nhất là điểm mạnh, 2 tiêu chí thấp nhất là điểm cần
 * cải thiện. */
export function buildSkillInsightSummary(skills: SkillScore[]): string {
  if (skills.length < 4) return 'Hoàn thành vài buổi role-play để nhận phân tích điểm mạnh/điểm cần cải thiện nhé.';

  const sorted = [...skills].sort((a, b) => b.value - a.value);
  const strengths = sorted.slice(0, 2);
  const weaknesses = sorted.slice(-2).reverse();

  return (
    `Bạn đang làm tốt ở ${strengths[0].label} và ${strengths[1].label}. Tuy nhiên, ` +
    `${weaknesses[0].label} và ${weaknesses[1].label} là 2 điểm cần cải thiện. Hãy ưu tiên luyện cách đặt ` +
    `câu hỏi mở, lắng nghe và đào sâu nhu cầu trước khi tư vấn — mục tiêu tiếp theo: khai thác ít nhất ` +
    `3-5 thông tin quan trọng để đưa ra giải pháp phù hợp hơn.`
  );
}

// "Combo" là sản phẩm bán chéo, gộp kiến thức của các sản phẩm còn lại
// (xem docs/products.md — "Tài khoản số + Bảo hiểm + Đầu tư") — học 1 level
// combo tính điểm hiểu biết cho TẤT CẢ sản phẩm, không chỉ riêng combo.
// Nhận diện qua id cố định của sản phẩm seed gốc; nếu admin xoá/đổi id sản
// phẩm này qua "Quản trị hành trình & tri thức", trường hợp đặc biệt này
// đơn giản không áp dụng nữa (level combo mới chỉ tính cho chính nó).
const COMBO_PRODUCT_ID = 'combo';

/** Mỗi sản phẩm hiện có = 1 thanh mức độ (số lượng thanh đổi theo số sản
 * phẩm thật, không hardcode nữa) — điểm là TRUNG BÌNH điểm "Kiến thức sản
 * phẩm" (tiêu chí `knowledge` trong SCORE_CRITERIA_META) của lần học ĐIỂM
 * CAO NHẤT (theo tổng điểm) cho mỗi level Map đã hoàn thành thuộc sản phẩm
 * đó — mặc định 0% nếu chưa học level nào của sản phẩm này. Học 1 level
 * combo tính điểm hiểu biết vào TẤT CẢ sản phẩm (xem COMBO_PRODUCT_ID). */
export function buildKnowledgeTopics(history: PracticeHistoryEntry[]): KnowledgeTopicProgress[] {
  // Lần học điểm cao nhất (theo tổng điểm) cho mỗi level Map — cùng ngữ
  // nghĩa "best_score" của level_progress, nhưng cần thêm điểm knowledge
  // riêng của đúng lần đó nên tính lại từ roleplay_history (đã có sẵn toàn
  // bộ điểm 6 tiêu chí mỗi lần học, xem PracticeHistoryEntry.skillScores).
  const bestByLevel = new Map<string, number>(); // levelId -> knowledge score của lần điểm cao nhất
  const bestTotalByLevel = new Map<string, number>();
  for (const entry of history) {
    if (entry.source !== 'map' || !entry.levelId) continue;
    const prevTotal = bestTotalByLevel.get(entry.levelId);
    if (prevTotal === undefined || entry.totalScore > prevTotal) {
      bestTotalByLevel.set(entry.levelId, entry.totalScore);
      bestByLevel.set(entry.levelId, entry.skillScores['knowledge'] ?? 0);
    }
  }

  const scoresByProductId = new Map<string, number[]>();
  const pushScore = (productId: string, score: number) => {
    const list = scoresByProductId.get(productId);
    if (list) list.push(score);
    else scoresByProductId.set(productId, [score]);
  };
  bestByLevel.forEach((knowledgeScore, levelId) => {
    const level = levels.find((l) => l.id === levelId);
    if (!level) return;
    if (level.productId === COMBO_PRODUCT_ID) {
      products.forEach((p) => pushScore(p.id, knowledgeScore));
    } else {
      pushScore(level.productId, knowledgeScore);
    }
  });

  return products.map((p) => {
    const scores = scoresByProductId.get(p.id) ?? [];
    const value = scores.length > 0 ? Math.round(scores.reduce((sum, v) => sum + v, 0) / scores.length) : 0;
    return { id: p.id, label: p.shortName ?? p.name, icon: 'reader-outline', value };
  });
}

const LOW_SCORE_THRESHOLD = 80;
const MAX_RECOMMENDATIONS = 3;

/** Gợi ý luyện lại THẬT — lấy đúng các level user ĐÃ hoàn thành nhưng điểm
 * còn thấp (< LOW_SCORE_THRESHOLD), điểm thấp nhất lên trước. Bấm vào 1 gợi
 * ý sẽ vào thẳng Ôn tập nhanh (Quiz) của đúng level đó (xem
 * PersonalAnalysisScreen.tsx) — y hệt cách vào 1 level từ Map. Chưa học đủ
 * (levelProgress rỗng) hoặc đã học hết ở mức tốt (>=80%) thì trả mảng rỗng —
 * màn hình tự hiện fallback thân thiện. title/subtitle khớp đúng cách hiển
 * thị "Chủ đề cần cải thiện" trong Figma (node-id=160-16508): tên sản phẩm +
 * "{score}% - Cần cải thiện", không còn ghép "Level N •" phía trước. */
export function buildPracticeRecommendations(levelProgress: Record<string, number>): PracticeRecommendation[] {
  return Object.entries(levelProgress)
    .filter(([, score]) => score < LOW_SCORE_THRESHOLD)
    .sort((a, b) => a[1] - b[1])
    .slice(0, MAX_RECOMMENDATIONS)
    .map(([levelId, score]) => {
      const level = levels.find((l) => l.id === levelId);
      const product = level ? products.find((p) => p.id === level.productId) : undefined;
      const productLabel = product?.shortName ?? product?.name ?? 'Sản phẩm';
      return {
        id: `pr-${levelId}`,
        icon: 'refresh-circle',
        title: productLabel,
        subtitle: `${score}% - Cần cải thiện`,
        levelId,
      };
    });
}

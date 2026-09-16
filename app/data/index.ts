export * from './types';
export { products, replaceProducts } from './products';
export { personas, replacePersonas } from './personas';
export { levels, replaceLevels } from './levels';
export { mockDailyChallenge } from './userProgress';
export { GLOBAL_ROLEPLAY_RULES } from './rules';
export { quizzesByLevelId, replaceQuizzes } from './quizzes';
export { roleplayCustomersByLevelId } from './roleplayCustomers';
export { roleplayAvatarSources, getRoleplayAvatarSource } from './roleplayAvatars';
export type { RoleplayAvatarKey } from './roleplayAvatars';
export { roleplayResultsByLevelId } from './roleplayResults';
export { customerProfiles } from './customerProfiles';
export { customerRoleplayConfigsByCustomerId } from './customerRoleplayConfigs';
export { badgeTiers, badgeTierIcons, getBadgeTierProgress } from './badgeTiers';
export { SCORE_CRITERIA_META, buildSkillScoresFromRaw, averageSkillScore } from './scoreCriteriaMeta';
export type { ScoreCriterionMeta } from './scoreCriteriaMeta';
export { buildSkillInsightSummary, buildKnowledgeTopics, buildPracticeRecommendations } from './personalAnalysis';

import { products } from './products';
import { personas } from './personas';
import { levels } from './levels';
import { quizzesByLevelId } from './quizzes';
import { roleplayCustomersByLevelId } from './roleplayCustomers';
import { roleplayResultsByLevelId } from './roleplayResults';
import { customerProfiles } from './customerProfiles';
import { customerRoleplayConfigsByCustomerId } from './customerRoleplayConfigs';

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getPersonaById(id: string) {
  return personas.find((p) => p.id === id);
}

export function getLevelById(id: string) {
  return levels.find((l) => l.id === id);
}

/** true nếu sản phẩm này bị ẩn TẠI chapterNumber cụ thể (ẩn toàn bộ, hoặc
 * ẩn riêng chặng đó) — xem Product.isHidden/hiddenChapterNumbers. */
function isProductHiddenInChapter(productId: string, chapterNumber: number): boolean {
  const product = getProductById(productId);
  if (!product) return true;
  return !!product.isHidden || !!product.hiddenChapterNumbers?.includes(chapterNumber);
}

/** true nếu level này còn hiển thị trên màn Map — false nếu chặng
 * (persona) hoặc sản phẩm của level bị admin ẩn ("Quản trị hành trình &
 * tri thức"). Dùng để lọc trước khi tính khoá tuần tự/học vượt. */
export function isLevelVisible(level: { chapterNumber: number; personaId: string; productId: string }): boolean {
  const persona = getPersonaById(level.personaId);
  if (!persona || persona.isHidden) return false;
  return !isProductHiddenInChapter(level.productId, level.chapterNumber);
}

export function getLevelsByPersona(personaId: string) {
  return levels
    .filter((l) => l.personaId === personaId && isLevelVisible(l))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getLevelsByChapter(chapterNumber: number) {
  return levels
    .filter((l) => l.chapterNumber === chapterNumber && isLevelVisible(l))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** Số thứ tự level trong ải (1-5), suy từ Level.id dạng "{chapter}.{order}". */
export function getPositionInChapter(levelId: string) {
  return Number(levelId.split('.')[1]);
}

export function getDifficultyLabel(starRating: number): string {
  if (starRating <= 1.5) return 'Dễ';
  if (starRating <= 2.5) return 'Dễ - TB';
  if (starRating <= 3.5) return 'Trung bình';
  if (starRating <= 4.5) return 'Khá khó';
  return 'Khó';
}

export function getQuizByLevelId(levelId: string) {
  return quizzesByLevelId[levelId] ?? [];
}

export function getRoleplayCustomerByLevelId(levelId: string) {
  return roleplayCustomersByLevelId[levelId];
}

export function getRoleplayResultByLevelId(levelId: string) {
  return roleplayResultsByLevelId[levelId];
}

export function getResultRatingLabel(totalScore: number, maxTotalScore: number): string {
  const ratio = totalScore / maxTotalScore;
  if (ratio >= 0.85) return 'Xuất sắc';
  if (ratio >= 0.7) return 'Khá tốt';
  if (ratio >= 0.5) return 'Trung bình';
  return 'Cần cải thiện';
}

// ---- Practice (màn luyện tập với hồ sơ khách hàng thật) ----

export function getCustomerProfileById(id: string) {
  return customerProfiles.find((c) => c.id === id);
}

export function getCustomerRoleplayConfig(customerId: string) {
  return customerRoleplayConfigsByCustomerId[customerId];
}

export function searchCustomerProfiles(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return customerProfiles;
  const digits = q.replace(/\D/g, '');
  return customerProfiles.filter((c) => {
    if (c.name.toLowerCase().includes(q)) return true;
    if (digits && c.phone.includes(digits)) return true;
    return false;
  });
}

export function getCustomerDifficultyLabel(difficulty: import('./types').CustomerDifficulty): string {
  switch (difficulty) {
    case 'De':
      return 'Dễ';
    case 'TrungBinh':
      return 'Trung bình';
    case 'Kho':
      return 'Khó';
    case 'RatKho':
      return 'Rất khó';
  }
}

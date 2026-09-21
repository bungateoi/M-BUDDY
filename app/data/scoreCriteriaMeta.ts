// Metadata hiển thị (label/icon) cho 6 tiêu chí chấm điểm — dùng chung giữa
// mock (roleplayResults.ts) và mapper cho điểm thật từ backend
// (scoringMapper.ts) để tránh lệch label/icon giữa 2 nguồn.

import type { SkillScore } from './types';

export interface ScoreCriterionMeta {
  /** Khớp tên field trong ScoringResult (app/lib/ai.ts), bỏ hậu tố "_score". */
  key: string;
  label: string;
  icon: string;
}

export const SCORE_CRITERIA_META: ScoreCriterionMeta[] = [
  { key: 'customer_understanding', label: 'Hiểu khách hàng', icon: 'people' },
  { key: 'knowledge', label: 'Kiến thức sản phẩm', icon: 'reader' },
  { key: 'communication', label: 'Giao tiếp & thái độ', icon: 'happy' },
  { key: 'objection_handling', label: 'Xử lý từ chối', icon: 'shield-checkmark' },
  { key: 'insight_discovery', label: 'Khai thác nhu cầu / Insight', icon: 'search' },
  { key: 'closing', label: 'Kỹ năng chốt sale', icon: 'locate' },
];

// shortLabel/icon (outline) riêng cho radar chart — khớp phong cách radar ở
// màn Home/Phân tích chi tiết/Nhóm của tôi (icon filled ở trên dùng cho
// ResultCriterionRow, không đổi để tránh lệch giao diện màn Kết quả).
const RADAR_DISPLAY: Record<string, { shortLabel: string; icon: string }> = {
  customer_understanding: { shortLabel: 'Hiểu KH', icon: 'people-outline' },
  knowledge: { shortLabel: 'Kiến thức SP', icon: 'reader-outline' },
  communication: { shortLabel: 'Giao tiếp', icon: 'happy-outline' },
  objection_handling: { shortLabel: 'Xử lý từ chối', icon: 'shield-checkmark-outline' },
  insight_discovery: { shortLabel: 'Khai thác NC', icon: 'search-outline' },
  closing: { shortLabel: 'Chốt sale', icon: 'locate-outline' },
};

/** profiles.skill_scores (jsonb, key khớp SCORE_CRITERIA_META) -> SkillScore[]
 * cho SkillRadarChart — dùng chung giữa hồ sơ cá nhân thật (lib/authData.ts)
 * và team thật (Nhóm của tôi). */
export function buildSkillScoresFromRaw(raw: Record<string, number> | null | undefined): SkillScore[] {
  return SCORE_CRITERIA_META.map((c) => {
    const display = RADAR_DISPLAY[c.key];
    return {
      key: c.key,
      label: c.label,
      shortLabel: display?.shortLabel ?? c.label,
      value: Math.round(raw?.[c.key] ?? 0),
      icon: display?.icon ?? c.icon,
    };
  });
}

/** Điểm trung bình 6 tiêu chí — dùng cho "Tổng điểm" (PersonalAnalysisScreen)
 * và trung bình từng thành viên (TeamMemberTable). */
export function averageSkillScore(raw: Record<string, number> | null | undefined): number {
  const values = SCORE_CRITERIA_META.map((c) => raw?.[c.key] ?? 0);
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

/** Điểm trung bình CẢ ĐỘI theo từng tiêu chí — cho radar "Đội nhóm" (màn
 * Nhóm của tôi + màn Phân tích Kiến thức & Kỹ năng > tab Đội nhóm). Dùng
 * chung giữa 2 màn đó để không lệch công thức tính. */
export function averageTeamSkills(members: { scores: Record<string, number> }[]): SkillScore[] {
  if (members.length === 0) return buildSkillScoresFromRaw({});
  const raw: Record<string, number> = {};
  for (const c of SCORE_CRITERIA_META) {
    const total = members.reduce((sum, m) => sum + (m.scores[c.key] ?? 0), 0);
    raw[c.key] = total / members.length;
  }
  return buildSkillScoresFromRaw(raw);
}

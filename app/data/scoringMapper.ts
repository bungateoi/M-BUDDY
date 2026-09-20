import type { RoleplayTurn, ScoringResult } from '../lib/ai';
import type { RoleplayResult, RoleplayScoreCriterion, TranscriptMessage } from './types';
import { SCORE_CRITERIA_META } from './scoreCriteriaMeta';

// Logic giống hệt getResultRatingLabel ở data/index.ts — không import trực
// tiếp từ đó để tránh circular import (index.ts re-export nhiều module con).
function ratingLabelFor(totalScore: number, maxTotalScore: number): string {
  const ratio = totalScore / maxTotalScore;
  if (ratio >= 0.85) return 'Xuất sắc';
  if (ratio >= 0.7) return 'Khá tốt';
  if (ratio >= 0.5) return 'Trung bình';
  return 'Cần cải thiện';
}

function scoreBandFeedback(score: number): string {
  if (score >= 85) return 'Làm rất tốt ở tiêu chí này.';
  if (score >= 70) return 'Ổn, có thể cải thiện thêm.';
  if (score >= 50) return 'Trung bình — cần chú ý hơn ở điểm này.';
  return 'Cần cải thiện nhiều ở tiêu chí này.';
}

/**
 * Gắn turn_feedback (index-based, xem SPEC.md mục 2) vào đúng transcript
 * gốc đã gửi lên /score — chỉ role="seller" mới có isGood/comment. Backend
 * giờ luôn trả comment cho MỌI lượt (khen + gợi ý diễn đạt hay hơn khi đã
 * đúng, không chỉ khi sai) — giữ nguyên comment bất kể isGood, xem
 * ConversationHistoryModal.tsx.
 */
function buildTranscriptMessages(transcript: RoleplayTurn[], turnFeedback: ScoringResult['turn_feedback']): TranscriptMessage[] {
  const feedbackByIndex = new Map(turnFeedback.map((f) => [f.turn_index, f]));
  return transcript.map((turn, index) => {
    if (turn.role !== 'seller') return { role: turn.role, text: turn.text };
    const feedback = feedbackByIndex.get(index);
    return {
      role: turn.role,
      text: turn.text,
      isGood: feedback?.is_good,
      comment: feedback?.comment ?? undefined,
    };
  });
}

/**
 * Chuyển ScoringResult thật từ backend (POST /score, xem SPEC.md) sang
 * RoleplayResult — shape mà ResultScreen/ResultCriterionRow đã dùng sẵn
 * (trước đây chỉ có mock ở roleplayResults.ts).
 */
export function buildRoleplayResultFromScoring(levelId: string, scoring: ScoringResult, transcript: RoleplayTurn[]): RoleplayResult {
  const scoresByKey: Record<string, number> = {
    customer_understanding: scoring.customer_understanding_score,
    knowledge: scoring.knowledge_score,
    communication: scoring.communication_score,
    objection_handling: scoring.objection_handling_score,
    insight_discovery: scoring.insight_discovery_score,
    closing: scoring.closing_score,
  };

  const criteria: RoleplayScoreCriterion[] = SCORE_CRITERIA_META.map((meta) => {
    const score = scoresByKey[meta.key] ?? 0;
    return {
      key: meta.key,
      label: meta.label,
      icon: meta.icon,
      score,
      maxScore: 100,
      feedback: scoreBandFeedback(score),
    };
  });

  const totalScore = Math.round(criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length);
  const maxTotalScore = 100;
  const ratingLabel = ratingLabelFor(totalScore, maxTotalScore);

  const insightSummary = scoring.strengths.length
    ? `Bạn làm tốt: ${scoring.strengths.join(' ')}`
    : 'Buổi luyện tập này chưa ghi nhận điểm mạnh nổi bật.';

  const insightTips = scoring.improvements.map((text) => ({ icon: '💡', text }));

  return {
    levelId,
    totalScore,
    maxTotalScore,
    ratingLabel,
    summary: scoring.next_level_suggestion,
    criteria,
    insightSummary,
    insightTips,
    transcript: buildTranscriptMessages(transcript, scoring.turn_feedback),
  };
}

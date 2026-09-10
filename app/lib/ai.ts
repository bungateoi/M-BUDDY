import type {
  GeneratedCustomerPersona,
  Level,
  LevelObjection,
  Persona,
  PersonaCriteria,
  PersonaCriteriaInput,
  Product,
} from '../data/types';

// Client gọi backend AI (agent/main.py, deploy trên GreenNode AgentBase).
// Contract input/output: xem /agent/SPEC.md — PHẢI khớp chính xác field
// names với những gì main.py đọc/trả về (không đổi tuỳ tiện ở phía app).

export interface RoleplayTurn {
  role: 'customer' | 'seller';
  text: string;
}

// Type HẸP hơn Persona/Product/Level đầy đủ — backend chỉ đọc đúng các
// field này (xem build_roleplay_system_prompt/build_scoring_prompt trong
// agent/main.py), nên chỉ cần "structurally" khớp ngần này là đủ. Persona/
// Product/Level (dùng cho role-play trong Map) có nhiều field hơn nên vẫn
// gán được thẳng vào đây — không cần đổi gì ở RolePlayScreen/MapScreen.
// Cho phép cả nguồn khác (vd. hồ sơ khách hàng thật ở màn Practice) tự
// build persona/product/level "tối giản" mà không phải bịa field thừa.
export interface RoleplayPersonaInput {
  name: string;
  criteria: PersonaCriteria;
  behaviorNote: string;
}
export interface RoleplayProductInput {
  name: string;
  shortDescription: string;
  keySellingPoints?: string[];
}
export interface RoleplayLevelInput {
  winCriteria: string;
  objectionBank: LevelObjection[];
}

export interface RoleplayAIParams {
  persona: RoleplayPersonaInput | Persona;
  product: RoleplayProductInput | Product;
  level: RoleplayLevelInput | Level;
  roleplayDurationSec: number;
  secondsElapsed: number;
  /** Lịch sử hội thoại TRƯỚC lượt nói hiện tại — không gồm sellerUtterance. */
  history: RoleplayTurn[];
  /** Câu nhân viên sales vừa nói (đã chuyển từ giọng nói sang chữ). Rỗng ('') cho lượt mở đầu cuộc gọi. */
  sellerUtterance: string;
}

export interface RoleplayAIResult {
  customerReply: string;
  emotion: 'curious' | 'skeptical' | 'warming_up' | 'satisfied' | 'annoyed' | 'ending_call';
  shouldEndCall: boolean;
  endReason: 'convinced' | 'not_interested' | 'ran_out_of_patience' | null;
  /** v1: luôn null — logic gợi ý thật sẽ làm sau, xem SPEC.md. */
  hintForSeller: string | null;
}

/** Nhận xét cho ĐÚNG 1 lượt nói role="seller" trong transcript đã gửi lên —
 * turn_index là index (0-based) của lượt đó trong mảng transcript gốc. */
export interface TurnFeedback {
  turn_index: number;
  is_good: boolean;
  /** Chỉ có giá trị khi is_good=false — xem SPEC.md mục 2. */
  comment: string | null;
}

// 6 tiêu chí theo /docs/sales-skill-scoring-rubric.md (bản đầy đủ 6 tiêu chí,
// khuyến nghị dùng thay bản rút gọn 3 tiêu chí cho MVP).
export interface ScoringResult {
  customer_understanding_score: number;
  knowledge_score: number;
  communication_score: number;
  objection_handling_score: number;
  insight_discovery_score: number;
  closing_score: number;
  strengths: string[];
  improvements: string[];
  next_level_suggestion: string;
  turn_feedback: TurnFeedback[];
}

export interface ScoringAIParams {
  product: RoleplayProductInput | Product;
  transcript: RoleplayTurn[];
}

function getBackendUrl(): string {
  const url = process.env.EXPO_PUBLIC_BACKEND_URL;
  if (!url) {
    throw new Error(
      'EXPO_PUBLIC_BACKEND_URL chưa được cấu hình — xem app/.env.example.'
    );
  }
  return url.replace(/\/+$/, '');
}

/** Gọi AI đóng vai khách hàng, trả về lời thoại tiếp theo + trạng thái cuộc gọi. */
export async function callRoleplayAI(params: RoleplayAIParams): Promise<RoleplayAIResult> {
  const res = await fetch(`${getBackendUrl()}/roleplay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      persona: params.persona,
      product: params.product,
      level: params.level,
      roleplayDurationSec: params.roleplayDurationSec,
      secondsElapsed: params.secondsElapsed,
      history: params.history,
      sellerUtterance: params.sellerUtterance,
    }),
  });

  if (!res.ok) {
    throw new Error(`callRoleplayAI thất bại: HTTP ${res.status}`);
  }
  return (await res.json()) as RoleplayAIResult;
}

/** Gọi AI sinh 1 chân dung khách hàng + cấu hình role-play trực tiếp từ
 * tiêu chí người dùng chọn ở màn "Tạo khách hàng theo tiêu chí". */
export async function callGeneratePersona(criteria: PersonaCriteriaInput): Promise<GeneratedCustomerPersona> {
  const res = await fetch(`${getBackendUrl()}/generate-persona`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ criteria }),
  });

  if (!res.ok) {
    throw new Error(`callGeneratePersona thất bại: HTTP ${res.status}`);
  }
  return (await res.json()) as GeneratedCustomerPersona;
}

/** Gọi AI chấm điểm toàn bộ transcript sau khi kết thúc role-play. */
export async function callScoringAI(params: ScoringAIParams): Promise<ScoringResult> {
  const res = await fetch(`${getBackendUrl()}/score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product: params.product,
      transcript: params.transcript,
    }),
  });

  if (!res.ok) {
    throw new Error(`callScoringAI thất bại: HTTP ${res.status}`);
  }
  return (await res.json()) as ScoringResult;
}

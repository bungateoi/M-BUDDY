import type { QuizQuestion } from './types';
import quizBankJson from './quizBank.json';

// Sinh bởi scripts/generateQuizBank.mts (AI, dựa trên keySellingPoints +
// objectionBank của products.ts + personas.ts + levels.ts), đã được duyệt
// nội dung — 25/25 level x 5 câu. Chạy lại script để tái tạo nếu cần.
// JSON import infers `options[].id`/`correctOptionId` as plain `string`,
// not the QuizOptionId literal union — the generator script only ever
// writes 'A'|'B'|'C'|'D' (see toQuizQuestions in generateQuizBank.mts), so
// asserting the shape here is safe.
export let quizzesByLevelId: Record<string, QuizQuestion[]> = quizBankJson as unknown as Record<
  string,
  QuizQuestion[]
>;

/** Gọi bởi hydrateContentFromBackend() sau khi fetch bảng quiz_questions. */
export function replaceQuizzes(next: Record<string, QuizQuestion[]>) {
  quizzesByLevelId = next;
}

import { useEffect, useState } from 'react';
import { buildRoleplayResultFromScoring } from '../data/scoringMapper';
import type { RoleplayResult } from '../data/types';
import type { NavigationParams } from '../navigation/NavigationContext';
import { callScoringAI, type RoleplayLevelInput, type RoleplayProductInput, type RoleplayTurn } from './ai';
import { applySkillScores, recordActivity, recordLevelProgress, saveRoleplayHistory } from './authData';

// Hàng đợi chấm điểm chạy NGẦM, sống ngoài vòng đời React (module-level
// singleton) — mục đích: bấm "Xem sau" ở RolePlayScreen điều hướng về Home
// NGAY LẬP TỨC (unmount RolePlayScreen) nhưng việc gọi /score + lưu XP/lịch
// sử vẫn phải chạy tiếp cho xong, không bị huỷ theo component. Nếu đặt
// promise này trong 1 state/ref của RolePlayScreen, nó sẽ "chết" cùng
// component khi điều hướng đi — đây là lý do PHẢI tách thành singleton độc
// lập thay vì async function nội bộ màn hình như trước (xem phản hồi người
// dùng: thời gian chấm điểm dài, cần chạy ngầm + có thể xem lại ở Ôn tập).
export type ScoringJobStatus = 'pending' | 'done' | 'error';

export interface ScoringJob {
  id: string;
  status: ScoringJobStatus;
  createdAt: string;
  titleLine: string;
  subtitleLine: string;
  resultParams: NavigationParams;
  roleplayResult?: RoleplayResult;
  unlockedChaptersUpTo?: number;
  /** true nếu buổi này có thể xuất hiện ở Ôn tập khi xong (level Map hoặc hồ
   * sơ Practice thật) — khách hàng tự tạo theo tiêu chí thì không, xem
   * RolePlayScreen.tsx#buildHistoryEntry. Dùng để lọc job nào cần hiện thẻ
   * "Đang đánh giá" ở PracticeHistoryScreen. */
  hasHistoryTarget: boolean;
}

export interface ScoringJobInput {
  product: RoleplayProductInput;
  transcript: RoleplayTurn[];
  globalRules: string;
  level: RoleplayLevelInput;
  /** levelId ?? practiceCustomerId ?? generatedCustomer?.name ?? '' — id gắn
   * vào RoleplayResult.levelId, xem buildRoleplayResultFromScoring. */
  resultId: string;
  levelId?: string;
  isSkipAhead: boolean;
  hasHistoryTarget: boolean;
  /** Params gốc (levelId/practiceCustomerId/generatedCustomer) — dùng làm
   * nền cho navigate('result', ...) dù thành công hay lỗi. */
  resultParams: NavigationParams;
  titleLine: string;
  subtitleLine: string;
  buildHistoryEntry: (result: RoleplayResult) => Parameters<typeof saveRoleplayHistory>[0] | undefined;
  refreshProfile: () => Promise<void>;
}

const jobs = new Map<string, ScoringJob>();
const jobListeners = new Map<string, Set<(job: ScoringJob) => void>>();
const listListeners = new Set<() => void>();

// Job đã xong (done/error) được dọn khỏi Map sau 1 khoảng đủ dài để mọi màn
// đang mở kịp đọc trạng thái cuối — tránh rò rỉ bộ nhớ nếu người dùng luyện
// tập nhiều buổi liên tiếp trong 1 phiên mà không mở lại RolePlayScreen cũ.
const CLEANUP_DELAY_MS = 5 * 60 * 1000;

function notifyJob(id: string) {
  const job = jobs.get(id);
  if (!job) return;
  jobListeners.get(id)?.forEach((listener) => listener(job));
}

function notifyList() {
  listListeners.forEach((listener) => listener());
}

function patchJob(id: string, patch: Partial<ScoringJob>) {
  const job = jobs.get(id);
  if (!job) return;
  jobs.set(id, { ...job, ...patch });
  notifyJob(id);
  notifyList();
  if (patch.status === 'done' || patch.status === 'error') {
    setTimeout(() => jobs.delete(id), CLEANUP_DELAY_MS);
  }
}

/** Bắt đầu chấm điểm 1 buổi role-play NGẦM — trả về ngay 1 jobId, không chờ
 * kết quả. Gọi 1 lần duy nhất từ RolePlayScreen.finishCall(). */
export function startScoringJob(input: ScoringJobInput): string {
  const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  jobs.set(id, {
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
    titleLine: input.titleLine,
    subtitleLine: input.subtitleLine,
    resultParams: input.resultParams,
    hasHistoryTarget: input.hasHistoryTarget,
  });
  notifyList();

  (async () => {
    try {
      const scoring = await callScoringAI({
        product: input.product,
        transcript: input.transcript,
        globalRules: input.globalRules,
        level: input.level,
      });
      const roleplayResult = buildRoleplayResultFromScoring(input.resultId, scoring, input.transcript);

      // Lỗi ở khối lưu-trữ (mạng, chưa đăng nhập...) không được chặn kết quả
      // chấm điểm đã có — chỉ đơn giản là Home/Xếp hạng/Team/Map/Ôn tập chưa
      // cập nhật lần luyện này, giống hành vi cũ trước khi tách job ngầm.
      try {
        const tasks: Promise<unknown>[] = [recordActivity(), applySkillScores(scoring, roleplayResult.totalScore)];
        if (input.levelId) {
          tasks.push(recordLevelProgress(input.levelId, roleplayResult.totalScore, input.isSkipAhead));
        }
        const historyEntry = input.buildHistoryEntry(roleplayResult);
        if (historyEntry) tasks.push(saveRoleplayHistory(historyEntry));
        await Promise.all(tasks);
        await input.refreshProfile();
      } catch {
        // im lặng bỏ qua — không phải lỗi người dùng cần xử lý ngay.
      }

      const unlockedChaptersUpTo =
        input.isSkipAhead && input.levelId && roleplayResult.totalScore >= 60
          ? Number(input.levelId.split('.')[0])
          : undefined;

      patchJob(id, { status: 'done', roleplayResult, unlockedChaptersUpTo });
    } catch {
      patchJob(id, { status: 'error' });
    }
  })();

  return id;
}

export function getJob(id: string): ScoringJob | undefined {
  return jobs.get(id);
}

/** Theo dõi 1 job cụ thể — dùng ở RolePlayScreen để tự điều hướng sang màn
 * Kết quả ngay khi job xong, MIỄN LÀ màn đó còn đang mở (bấm "Xem sau" sẽ
 * unmount effect này qua cleanup, nên job xong sau đó sẽ không tự điều
 * hướng lung tung nữa — xem RolePlayScreen.tsx). */
export function subscribeToJob(id: string, listener: (job: ScoringJob) => void): () => void {
  if (!jobListeners.has(id)) jobListeners.set(id, new Set());
  jobListeners.get(id)!.add(listener);
  return () => {
    jobListeners.get(id)?.delete(listener);
  };
}

function getPendingHistoryJobs(): ScoringJob[] {
  return Array.from(jobs.values()).filter((job) => job.status === 'pending' && job.hasHistoryTarget);
}

function subscribeToPendingJobsChanged(listener: () => void): () => void {
  listListeners.add(listener);
  return () => {
    listListeners.delete(listener);
  };
}

/** Danh sách job đang chấm điểm dở mà khi xong sẽ có mặt ở Ôn tập — dùng để
 * hiện thẻ "Đang đánh giá" ở PracticeHistoryScreen kể cả khi người dùng đã
 * rời khỏi RolePlayScreen (bấm "Xem sau"). */
export function usePendingHistoryJobs(): ScoringJob[] {
  const [pending, setPending] = useState<ScoringJob[]>(() => getPendingHistoryJobs());
  useEffect(() => {
    setPending(getPendingHistoryJobs());
    return subscribeToPendingJobsChanged(() => setPending(getPendingHistoryJobs()));
  }, []);
  return pending;
}

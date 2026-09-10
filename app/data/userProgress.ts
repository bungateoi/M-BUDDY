import type { DailyChallengeSummary } from './types';

// Nội dung Daily Challenge — tĩnh/CMS, chưa cá nhân hoá theo user, ngoài
// phạm vi đợt này.
export const mockDailyChallenge: DailyChallengeSummary = {
  title: 'Daily Challenge',
  isNew: true,
  description: 'Hoàn thành thử thách mỗi ngày nhận thêm XP và phần thưởng!',
  rewardXp: 50,
};

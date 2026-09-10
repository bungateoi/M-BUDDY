import { supabase } from './supabaseClient';
import { buildSkillScoresFromRaw, averageSkillScore } from '../data/scoreCriteriaMeta';
import type { RoleplayAvatarKey } from '../data/roleplayAvatars';
import type { ScoringResult } from './ai';
import type {
  AdminMemberRow,
  LeaderboardEntry,
  PracticeHistoryEntry,
  RoleplayResult,
  TeamMember,
  UserProgress,
  UserRole,
  WeekDayProgress,
} from '../data/types';

// Lớp truy cập dữ liệu thật (Supabase) cho danh tính người dùng, bảng xếp
// hạng, và team — thay cho mock trong data/userProgress.ts (đã xoá) /
// data/leaderboardEntries.ts, data/teamMembers.ts (đã xoá). Xem schema đầy
// đủ: /Users/mac/Desktop/M-BUDDY/supabase/migrations/0001_init.sql

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  avatar_key: string;
  job_title: string;
  branch: string;
  role: UserRole;
  manager_id: string | null;
  xp: number;
  current_streak: number;
  longest_streak: number;
  streak_freeze_count: number;
  skill_scores: Record<string, number>;
}

const XP_PER_LEVEL = 200;
const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function fmtDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Tuần hiện tại (Thứ 2 -> CN), đánh dấu ngày nào có hoạt động thật (từ
 * daily_activity) — thay cho mảng weekProgress tĩnh trước đây. */
function buildWeekProgress(activeDateKeys: Set<string>): WeekDayProgress[] {
  const today = new Date();
  const todayKey = fmtDateKey(today);
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(monday.getDate() - mondayOffset);

  return WEEKDAY_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const key = fmtDateKey(d);
    let status: WeekDayProgress['status'];
    if (key === todayKey) status = 'today';
    else if (d > today) status = 'upcoming';
    else status = activeDateKeys.has(key) ? 'completed' : 'locked';
    return { label, status };
  });
}

function mapProfileRow(row: ProfileRow, weekProgress: WeekDayProgress[]): UserProgress {
  const initials = row.full_name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  const skills = buildSkillScoresFromRaw(row.skill_scores);
  const overallSkillScore = averageSkillScore(row.skill_scores);

  return {
    userId: row.id,
    fullName: row.full_name || 'Bạn',
    avatarInitials: initials || 'B',
    avatarKey: row.avatar_key,
    jobTitle: row.job_title,
    branch: row.branch,
    role: row.role,
    xp: row.xp,
    level: Math.floor(row.xp / XP_PER_LEVEL) + 1,
    levelProgress: (row.xp % XP_PER_LEVEL) / XP_PER_LEVEL,
    hasUnreadNotification: false,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    streakFreezeCount: row.streak_freeze_count,
    weekProgress,
    skills,
    overallSkillScore,
    overallSkillTrend: 'flat',
    dailyChallenge: { title: '', isNew: false, description: '', rewardXp: 0 }, // xem data/userProgress.ts mockDailyChallenge — HomeScreen dùng mock riêng cho phần này
  };
}

/** true nếu có session đăng nhập hiện tại. */
export async function hasActiveSession(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

/** Hồ sơ + tuần hoạt động của user đang đăng nhập. Ném lỗi nếu chưa đăng nhập. */
export async function fetchMyProfile(): Promise<UserProgress> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Chưa đăng nhập.');

  const [{ data: profileRow, error: profileError }, { data: activityRows, error: activityError }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userData.user.id).single(),
    supabase
      .from('daily_activity')
      .select('activity_date')
      .eq('user_id', userData.user.id)
      .gte('activity_date', fmtDateKey(new Date(Date.now() - 7 * 86400000))),
  ]);

  if (profileError || !profileRow) throw new Error(profileError?.message ?? 'Không tải được hồ sơ.');
  if (activityError) throw new Error(activityError.message);

  const activeDateKeys = new Set((activityRows ?? []).map((r: { activity_date: string }) => r.activity_date));
  return mapProfileRow(profileRow as ProfileRow, buildWeekProgress(activeDateKeys));
}

/** Top N bảng xếp hạng — đọc từ view public.leaderboard (không lộ skill_scores/branch). */
export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.from('leaderboard').select('*').order('xp', { ascending: false }).limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: { id: string; full_name: string; avatar_key: string; xp: number; current_streak: number }, i: number) => ({
    rank: i + 1,
    name: row.full_name || 'Bạn',
    avatarKey: row.avatar_key,
    xp: row.xp,
    streakDays: row.current_streak,
  }));
}

/** Thứ hạng của user hiện tại trong toàn bộ bảng xếp hạng (không giới hạn limit). */
export async function fetchMyLeaderboardRank(): Promise<number> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return 0;
  const { data: mine } = await supabase.from('profiles').select('xp').eq('id', userData.user.id).single();
  if (!mine) return 0;
  const { count, error } = await supabase.from('leaderboard').select('*', { count: 'exact', head: true }).gt('xp', mine.xp);
  if (error) throw new Error(error.message);
  return (count ?? 0) + 1;
}

/** Report trực tiếp của user hiện tại (chỉ khả dụng nếu role='manager' — với
 * nhân viên thường, RLS khiến kết quả này luôn rỗng). */
export async function fetchMyTeam(): Promise<TeamMember[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];
  const { data, error } = await supabase.from('profiles').select('*').eq('manager_id', userData.user.id);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: ProfileRow) => ({
    id: row.id,
    name: row.full_name || 'Chưa đặt tên',
    jobTitle: row.job_title || 'Chuyên viên',
    avatarKey: row.avatar_key,
    scores: row.skill_scores,
  }));
}

/** Tiến độ Map của user hiện tại — map levelId -> điểm cao nhất đã đạt (chỉ
 * chứa các level ĐÃ hoàn thành; level chưa có trong map này là chưa học/chưa
 * mở khoá). Xem supabase/migrations/0002_level_progress.sql. */
export async function fetchMyLevelProgress(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('level_progress').select('level_id, best_score');
  if (error) throw new Error(error.message);
  const map: Record<string, number> = {};
  (data ?? []).forEach((row: { level_id: string; best_score: number }) => {
    map[row.level_id] = row.best_score;
  });
  return map;
}

/** Ghi nhận vừa hoàn thành 1 level ở Map — isSkipAhead=true + score>=60 sẽ
 * mở khoá toàn bộ các chặng trước đó (xử lý trong RPC, xem migration). */
export async function recordLevelProgress(levelId: string, score: number, isSkipAhead: boolean): Promise<void> {
  const { error } = await supabase.rpc('record_level_progress', {
    p_level_id: levelId,
    p_score: score,
    p_is_skip_ahead: isSkipAhead,
  });
  if (error) throw new Error(error.message);
}

interface RoleplayHistoryRow {
  id: string;
  source: 'map' | 'practice';
  level_id: string | null;
  practice_customer_id: string | null;
  title_line: string;
  subtitle_line: string;
  total_score: number;
  skill_scores: Record<string, number>;
  result: RoleplayResult;
  created_at: string;
}

/** Toàn bộ lịch sử luyện tập của user hiện tại (Map + Practice), mới nhất
 * trước — màn "Ôn tập". Ghi bằng saveRoleplayHistory() ngay sau khi 1 buổi
 * role-play (không phải buổi với khách hàng tự tạo) chấm điểm xong. */
export async function fetchPracticeHistory(): Promise<PracticeHistoryEntry[]> {
  const { data, error } = await supabase
    .from('roleplay_history')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: RoleplayHistoryRow) => ({
    id: row.id,
    source: row.source,
    levelId: row.level_id ?? undefined,
    practiceCustomerId: row.practice_customer_id ?? undefined,
    titleLine: row.title_line,
    subtitleLine: row.subtitle_line,
    totalScore: row.total_score,
    skillScores: row.skill_scores,
    createdAt: row.created_at,
    result: row.result,
  }));
}

export async function saveRoleplayHistory(entry: {
  source: 'map' | 'practice';
  levelId?: string;
  practiceCustomerId?: string;
  titleLine: string;
  subtitleLine: string;
  totalScore: number;
  skillScores: Record<string, number>;
  result: RoleplayResult;
}): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Chưa đăng nhập.');
  const { error } = await supabase.from('roleplay_history').insert({
    user_id: userData.user.id,
    source: entry.source,
    level_id: entry.levelId ?? null,
    practice_customer_id: entry.practiceCustomerId ?? null,
    title_line: entry.titleLine,
    subtitle_line: entry.subtitleLine,
    total_score: entry.totalScore,
    skill_scores: entry.skillScores,
    result: entry.result,
  });
  if (error) throw new Error(error.message);
}

/** Đánh dấu hôm nay là ngày có hoạt động cho user hiện tại + tính lại streak. */
export async function recordActivity(): Promise<void> {
  const { error } = await supabase.rpc('record_activity');
  if (error) throw new Error(error.message);
}

/** Trộn điểm 6 tiêu chí 1 buổi role-play vừa chấm vào skill_scores + cộng XP. */
export async function applySkillScores(scoring: ScoringResult, xpGain: number): Promise<void> {
  const newScores = {
    customer_understanding: scoring.customer_understanding_score,
    knowledge: scoring.knowledge_score,
    communication: scoring.communication_score,
    objection_handling: scoring.objection_handling_score,
    insight_discovery: scoring.insight_discovery_score,
    closing: scoring.closing_score,
  };
  const { error } = await supabase.rpc('apply_skill_scores', { new_scores: newScores, xp_gain: xpGain });
  if (error) throw new Error(error.message);
}

/** Đổi avatar của chính user hiện tại — cột avatar_key được cấp quyền UPDATE
 * trực tiếp cho self trong RLS (không cần RPC như xp/skill_scores). */
export async function updateMyAvatar(avatarKey: RoleplayAvatarKey): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Chưa đăng nhập.');
  const { error } = await supabase.from('profiles').update({ avatar_key: avatarKey }).eq('id', userData.user.id);
  if (error) throw new Error(error.message);
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// ---- Quản trị hệ thống (chỉ profile.role === 'admin', chặn thật bởi RLS +
// admin_set_role/admin_set_manager RPC — is_admin() check trong
// supabase/migrations/0001_init.sql, không chỉ ẩn ở UI). ----

/** Toàn bộ tài khoản trong hệ thống — chỉ trả về dữ liệu thật nếu người gọi
 * là admin (RLS chặn ở phía database, không phải chặn ở đây). */
export async function fetchAllProfiles(): Promise<AdminMemberRow[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: ProfileRow) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name || '(chưa đặt tên)',
    jobTitle: row.job_title,
    branch: row.branch,
    role: row.role,
    managerId: row.manager_id,
  }));
}

/** Đổi role 1 tài khoản bất kỳ — chỉ admin gọi được (RPC tự kiểm tra is_admin()). */
export async function setMemberRole(userId: string, role: UserRole): Promise<void> {
  const { error } = await supabase.rpc('admin_set_role', { target_user_id: userId, new_role: role });
  if (error) throw new Error(error.message);
}

/** Thêm/gỡ 1 thành viên khỏi team của 1 trưởng nhóm — managerId=null để gỡ. */
export async function setMemberManager(userId: string, managerId: string | null): Promise<void> {
  const { error } = await supabase.rpc('admin_set_manager', { target_user_id: userId, new_manager_id: managerId });
  if (error) throw new Error(error.message);
}

/** Điền/sửa họ tên, chức danh, chi nhánh — cần cho tài khoản tạo qua Supabase
 * Dashboard (chưa có sẵn thông tin này). */
export async function setMemberProfile(
  userId: string,
  fields: { fullName?: string; jobTitle?: string; branch?: string }
): Promise<void> {
  const { error } = await supabase.rpc('admin_set_profile', {
    target_user_id: userId,
    new_full_name: fields.fullName ?? null,
    new_job_title: fields.jobTitle ?? null,
    new_branch: fields.branch ?? null,
  });
  if (error) throw new Error(error.message);
}

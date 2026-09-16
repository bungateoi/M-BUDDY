// Data model cho M-BUDDY.
// LƯU Ý: /docs/data-model.md được nhắc tới trong ai-prompts.md và
// roleplay-scenarios.md nhưng chưa tồn tại trong /docs khi file này được
// tạo. Các type dưới đây được suy ra từ cấu trúc dữ liệu mà products.md,
// personas.md, roleplay-scenarios.md và ai-prompts.md mô tả. Nếu sau này
// có data-model.md chính thức, đối chiếu lại và điều chỉnh cho khớp.

export interface ProductObjection {
  question: string;
  sampleAnswer: string;
}

export interface Product {
  id: string;
  order: number;
  name: string;
  /** Tên rút gọn 1 dòng, dùng cho không gian hẹp (node/card trên màn Map). Mặc định = name nếu không set. */
  shortName?: string;
  shortDescription: string;
  targetAudience: string;
  benefits: string[];
  basicConditions: string;
  /** Dùng để AI đối chiếu "kiến thức sản phẩm" khi chấm điểm. */
  keySellingPoints: string[];
  objectionBank: ProductObjection[];
  /** Chỉ có ở sản phẩm có yếu tố đầu tư (Bảo hiểm liên kết, Combo). */
  complianceNote?: string;
  /** Ẩn sản phẩm này khỏi TOÀN BỘ chặng trên màn Map — set qua "Quản trị
   * hành trình & tri thức" (app/screens/ProductEditScreen.tsx). */
  isHidden?: boolean;
  /** Ẩn sản phẩm này CHỈ ở 1 số chặng cụ thể (chapterNumber) — độc lập với
   * isHidden. Xem isLevelVisible() trong app/data/index.ts. */
  hiddenChapterNumbers?: number[];
  /**
   * Trích đoạn kiến thức sản phẩm ĐẦY ĐỦ, nguồn: v2_docs/MSB_Product_Knowledge_Base.md
   * — gửi nguyên văn cho AI (chấm điểm "kiến thức sản phẩm" +  đối chiếu số
   * liệu khi khách hỏi) thay vì chỉ dựa vào benefits/keySellingPoints rút
   * gọn ở trên (vốn chỉ để hiển thị UI cho gọn). Không hiển thị trực tiếp
   * trên UI admin — chỉ dùng làm ngữ cảnh cho backend (agent/main.py).
   */
  knowledgeBase?: string;
}

export interface PersonaCriteria {
  age: string;
  occupation: string;
  incomeLevel: string;
  needs: string;
  painPoints: string;
  expectations: string;
  barriers: string;
}

export interface Persona {
  id: string;
  /** Số thứ tự chặng, 1-5, tương ứng 1 ải trong màn Map. */
  chapterNumber: number;
  name: string;
  /** Độ khó persona, 1-5 sao (chưa tính độ khó riêng của từng level). */
  starRating: number;
  criteria: PersonaCriteria;
  /** "Cách phản ứng trong role-play" — dùng để nạp vào prompt AI khách hàng. */
  behaviorNote: string;
  /** "Chiến thuật chung nên dùng" (từ roleplay-scenarios.md) — gợi ý tiếp cận cho người chơi. */
  generalTactic: string;
  /** "Chiến thắng của nhân viên sales". */
  winCondition: string;
  recommendedProductId: string;
  isBossChapter?: boolean;
  /** Ẩn TOÀN BỘ chặng này khỏi màn Map — set qua "Quản trị hành trình &
   * tri thức" (app/screens/PersonaEditScreen.tsx). */
  isHidden?: boolean;

  // ---- Nguồn: v2_docs/Persona_5_nhan_vat.md + v2_docs/Rule_chung.md (mục
  // B — chi tiết từng persona) — nạp vào prompt AI đóng vai khách hàng để
  // xưng hô/giọng điệu/ngưỡng kiên nhẫn khớp ĐÚNG từng persona thay vì ép
  // cứng 1 kiểu xưng hô chung cho tất cả (xem agent/main.py). Tất cả optional
  // để không phá vỡ các persona sinh bởi AI (generate-persona) hoặc hồ sơ
  // Practice cũ — những persona đó không có các field chi tiết này.

  /** Đại từ nhân xưng CỐ ĐỊNH của khách trong suốt phiên, vd "bác"/"tôi"/"anh". */
  selfAddress?: string;
  /** Cách khách gọi nhân viên sales, vd "cháu"/"bạn"/"em". */
  sellerAddress?: string;
  /** "Cách nói chuyện đặc trưng" — mô tả phong cách khẩu ngữ + ví dụ câu nói mẫu. */
  speakingStyle?: string;
  /** "Mức độ kiên nhẫn" — mô tả định tính + ngưỡng cụ thể (Loại 1: tư vấn
   * chưa tốt: Loại 2: thái độ tệ) theo Rule_chung.md mục B. */
  patienceNote?: string;
  /** "Tín hiệu sẵn sàng chốt" — dấu hiệu cho AI biết khi nào nên để khách tiến gần quyết định. */
  closingSignal?: string;
  /** "Dữ liệu tài chính" — số liệu cụ thể (thu nhập, tài sản, sản phẩm đang dùng...) để khách trả lời nhất quán khi được hỏi. */
  financialData?: string;
  /** "Dữ liệu ẩn" — thông tin chỉ lộ khi Sales hỏi đúng cách, kèm gợi ý câu hỏi "trúng". */
  hiddenData?: string;
  /** "Ví dụ đối lập" — 1 câu Sales trả lời ổn (✅) vs 1 câu chưa ổn (❌) để AI hiệu chỉnh mức độ phản ứng. */
  contrastExample?: string;
}

export interface LevelObjection {
  trigger: string;
  guidance: string;
}

export interface Level {
  /** Mã level dạng "{chapterNumber}.{thứ tự trong chặng}", vd "1.1", "4.3" —
   * KHÔNG còn cố định đúng 5 level/chặng (xem v2_docs/Kich_ban_training.md,
   * mỗi chặng có thể có số level khác nhau: chặng 4 chỉ có 3, các chặng
   * khác có 4). */
  id: string;
  chapterNumber: number;
  personaId: string;
  productId: string;
  /** Độ khó tổng của level (persona + độ hợp lý bán sản phẩm đó cho persona đó), 1-5, có thể lẻ .5. */
  starRating: number;
  /** Câu mở màn của khách hàng khi AI bắt đầu hội thoại role-play. */
  openingLine: string;
  /** Gợi ý luồng xử lý cho người chơi — không phải lời thoại bắt buộc. */
  sampleFlow: string[];
  objectionBank: LevelObjection[];
  /** Tiêu chí để chấm/đánh giá người chơi có hoàn thành level hay không. */
  winCriteria: string;
  /** true cho level 5.5 — boss cuối, khó nhất toàn app. */
  isFinalBoss?: boolean;
  /**
   * Kịch bản phân nhánh ĐẦY ĐỦ cho level này, nguồn: nguyên văn từng mục
   * (### x.y — ...) trong v2_docs/Kich_ban_training.md — gồm bối cảnh, các
   * mốc thời gian, nhánh phản ứng theo từng cách Sale xử lý, và điều kiện
   * WIN/LOSE. Đây là ngữ cảnh CHÍNH cho AI đóng vai khách hàng phản ứng
   * đúng theo kịch bản thay vì chỉ dựa vào winCriteria/objectionBank rút
   * gọn ở trên (vẫn giữ 2 field đó để hiển thị UI admin cho gọn). Optional
   * để không phá vỡ persona/level sinh bởi AI (generate-persona, Practice).
   */
  trainingScript?: string;
}

// ---- Tiến độ người dùng (màn Home) ----
// Chưa có trong docs gốc — suy ra từ ui-draft/man-home.png + PRD mục 3.1
// (streak, gap kiến thức/kỹ năng dạng %/ring, CTA daily challenge).

export type WeekDayStatus = 'completed' | 'today' | 'upcoming' | 'locked';

export interface WeekDayProgress {
  /** Nhãn thứ trong tuần, "T2".."T7", "CN". */
  label: string;
  status: WeekDayStatus;
}

export interface SkillScore {
  key: string;
  label: string;
  /** Nhãn rút gọn để hiển thị quanh radar chart mini (không gian hẹp). */
  shortLabel: string;
  /** 0-100 */
  value: number;
  /** Tên icon Ionicons. */
  icon: string;
}

export interface DailyChallengeSummary {
  title: string;
  isNew: boolean;
  description: string;
  rewardXp: number;
}

// ---- Tiến độ theo từng level (màn Map) ----
// Dữ liệu thật nằm ở bảng level_progress (Supabase, xem
// supabase/migrations/0002_level_progress.sql) — 1 dòng tồn tại = đã hoàn
// thành. LevelStatus là trạng thái HIỂN THỊ suy ra ở client (MapScreen.tsx#resolveStatus),
// không lưu trực tiếp trong DB.

export type LevelStatus = 'locked' | 'current' | 'completed';

export type UserRole = 'employee' | 'manager' | 'admin';

export interface UserProgress {
  userId: string;
  fullName: string;
  avatarInitials: string;
  /** Khớp key trong roleplayAvatars.ts — dùng cho màn Tôi. */
  avatarKey: string;
  jobTitle: string;
  branch: string;
  /** 'manager' mới thấy được "Nhóm của tôi", 'admin' mới thấy "Quản trị hệ thống" — xem lib/authData.ts. */
  role: UserRole;
  xp: number;
  level: number;
  /** Tiến độ trong level hiện tại, 0-1. */
  levelProgress: number;
  hasUnreadNotification: boolean;
  currentStreak: number;
  longestStreak: number;
  streakFreezeCount: number;
  /** Luôn đủ 7 phần tử, thứ tự T2 → CN. */
  weekProgress: WeekDayProgress[];
  /**
   * Đúng 6 trục kỹ năng dùng cho radar chart, thứ tự xuôi theo chiều kim
   * đồng hồ bắt đầu từ trục trên-phải.
   */
  skills: SkillScore[];
  overallSkillScore: number;
  overallSkillTrend: 'up' | 'down' | 'flat';
  dailyChallenge: DailyChallengeSummary;
}

// ---- Ôn tập nhanh (5 câu trắc nghiệm trước role-play, PRD mục 3.3) ----

export type QuizOptionId = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  id: QuizOptionId;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: QuizOptionId;
  /** Giải thích hiển thị sau khi trả lời, dùng cho cả 2 trường hợp đúng/sai. */
  explanation: string;
}

// ---- Role-play (màn gọi điện với khách hàng ảo, PRD mục 3.4) ----

export interface RoleplayCustomer {
  /** Tên xưng hô hiển thị, vd "Anh Minh", "Cô Hạnh". */
  name: string;
  /** Khớp key trong roleplayAvatars.ts. */
  avatarKey: string;
}

/** Chỉ chọn avatar minh hoạ theo level Map — tên hiển thị lấy trực tiếp từ
 * persona.name (xem splitPersonaName trong RolePlayScreen.tsx), không lưu ở
 * đây để tránh lệch dữ liệu mỗi khi personas.ts đổi. */
export interface LevelAvatarConfig {
  avatarKey: string;
}

// ---- Hồ sơ khách hàng thật cho màn Practice (PRD mục 3.6) ----
// Nguồn: /docs/ho_so_khach_hang.md — 20 hồ sơ giả lập, sắp xếp Dễ → Rất khó.

export type CustomerDifficulty = 'De' | 'TrungBinh' | 'Kho' | 'RatKho';
export type CustomerSegment = 'Mass' | 'Affluent' | 'Priority';

export interface CustomerProfile {
  /** "kh01".."kh20". */
  id: string;
  /** Mã hiển thị trong docs, "KH01".."KH20" — không hiển thị trên UI, chỉ để đối chiếu nguồn. */
  code: string;
  name: string;
  phone: string;
  age: number;
  gender: 'Nam' | 'Nữ';
  occupation: string;
  incomeText: string;
  /** Số tiền/tháng (VNĐ) suy từ incomeText — dùng để tính segment. */
  incomeMonthlyVnd: number;
  region: string;
  needs: string;
  /** Nhãn ngắn cho cột "Nhu cầu" trên bảng danh sách. */
  needsShort: string;
  currentBehavior: string;
  painPoints: string;
  expectations: string;
  motivation: string;
  barrier: string;
  difficulty: CustomerDifficulty;
  segment: CustomerSegment;
  /** Khớp key trong roleplayAvatars.ts — suy từ age + gender. */
  avatarKey: string;
  /** Tên xưng hô cho màn Role-play, vd "Chị Anh" — suy từ gender/độ tuổi + tên. */
  displayName: string;
}

// ---- Tạo khách hàng theo tiêu chí (màn Practice, nút "Tạo ngay") ----
// Nguồn: /docs/tao_chan_dung_KH.md — người dùng tự chọn tiêu chí, AI sinh
// TRỰC TIẾP (không sinh sẵn như 20 hồ sơ cố định) 1 chân dung khách hàng +
// cấu hình role-play tương ứng ngay khi bấm "Tạo chân dung khách hàng".

/** 1 câu trả lời cho 1 field trong picker — `selected` là các option đã bấm
 * chọn, `custom` là nội dung gõ thêm ở "Khác / Tự nhập" (rỗng nếu không dùng). */
export interface PersonaFieldAnswer {
  selected: string[];
  custom: string;
}

/** Payload gửi lên backend — field nào không có giá trị thì bỏ qua (không bắt
 * buộc điền hết, xem "Gợi ý vận hành" trong docs/tao_chan_dung_KH.md). */
export interface PersonaCriteriaInput {
  age?: string;
  gender?: string;
  occupation?: string;
  income?: string;
  region?: string;
  needs?: string[];
  behavior?: string[];
  painPoints?: string[];
  expectations?: string[];
  motivation?: string[];
  barrier?: string[];
}

/** Chân dung khách hàng + cấu hình role-play do AI sinh trực tiếp từ
 * PersonaCriteriaInput — gộp chung vai trò của CustomerProfile +
 * CustomerRoleplayConfig (không cần tách vì không lưu lại, chỉ dùng ngay
 * cho 1 lượt role-play rồi thôi). */
export interface GeneratedCustomerPersona {
  name: string;
  age: number;
  gender: 'Nam' | 'Nữ';
  occupation: string;
  incomeText: string;
  region: string;
  needs: string;
  currentBehavior: string;
  painPoints: string;
  expectations: string;
  motivation: string;
  barrier: string;
  difficulty: CustomerDifficulty;
  behaviorNote: string;
  openingLine: string;
  winCriteria: string;
  objectionBank: LevelObjection[];
  product: {
    name: string;
    shortDescription: string;
    keySellingPoints: string[];
  };
}

/** Sinh sẵn 1 lần (xem scripts/generateCustomerRoleplayConfigs.mts) — cùng vai trò
 * với Persona.behaviorNote + Level.winCriteria/objectionBank ở phần Map, nhưng
 * tạo riêng cho từng hồ sơ khách hàng thật thay vì persona cố định. */
export interface CustomerRoleplayConfig {
  behaviorNote: string;
  openingLine: string;
  winCriteria: string;
  objectionBank: LevelObjection[];
  product: {
    name: string;
    shortDescription: string;
    keySellingPoints: string[];
  };
}

// ---- Kết quả role-play (màn Kết quả, PRD mục 3.5) ----
// 6 tiêu chí theo bản đầy đủ trong sales-skill-scoring-rubric.md mục 5
// (customer_understanding, knowledge, communication, objection_handling,
// insight_discovery, closing) — khác với UserProgress.skills (hồ sơ năng
// lực dài hạn trên màn Home), đây là điểm của MỘT lần luyện tập cụ thể.

export interface RoleplayScoreCriterion {
  key: string;
  label: string;
  /** Tên icon Ionicons. */
  icon: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface RoleplayInsightTip {
  icon: string;
  text: string;
}

/** 1 lượt nói trong "Lịch sử hội thoại" ở màn Kết quả — role="seller" có
 * thêm `isGood`/`comment` (từ ScoringResult.turn_feedback, xem
 * data/scoringMapper.ts) để tô màu bong bóng chat + hiện gợi ý cải thiện. */
export interface TranscriptMessage {
  role: 'customer' | 'seller';
  text: string;
  /** Chỉ có ý nghĩa khi role === 'seller'. */
  isGood?: boolean;
  /** Chỉ có khi role === 'seller' và isGood === false. */
  comment?: string;
}

export interface RoleplayResult {
  levelId: string;
  totalScore: number;
  maxTotalScore: number;
  /** Nhãn xếp loại, vd "Khá tốt" — suy từ totalScore, xem getResultRatingLabel. */
  ratingLabel: string;
  summary: string;
  /** Đúng 6 phần tử, theo thứ tự hiển thị trong "Chi tiết đánh giá". */
  criteria: RoleplayScoreCriterion[];
  insightSummary: string;
  insightTips: RoleplayInsightTip[];
  /** Toàn bộ transcript cuộc role-play, cho component "Lịch sử hội thoại".
   * Rỗng/undefined ở mock data cũ (chưa có transcript thật). */
  transcript?: TranscriptMessage[];
}

// ---- Lịch sử luyện tập (màn "Ôn tập") ----
// Dữ liệu thật nằm ở bảng roleplay_history (Supabase, xem
// supabase/migrations/0003_roleplay_history.sql) — 1 dòng/buổi role-play đã
// hoàn thành ở Map hoặc Practice (KHÔNG có buổi với khách hàng tự tạo theo
// tiêu chí).

export interface PracticeHistoryEntry {
  id: string;
  source: 'map' | 'practice';
  /** Chỉ có khi source='map'. */
  levelId?: string;
  /** Chỉ có khi source='practice'. */
  practiceCustomerId?: string;
  /** "Chặng {n} – Level {m}" (map) hoặc "Practice" (practice). */
  titleLine: string;
  /** "{persona} – {product}" (map) hoặc tên khách hàng (practice). */
  subtitleLine: string;
  totalScore: number;
  /** 6 key khớp SCORE_CRITERIA_META. */
  skillScores: Record<string, number>;
  /** ISO timestamp lúc hoàn thành. */
  createdAt: string;
  /** Y hệt dữ liệu màn Kết quả — dùng lại nguyên vẹn cho màn Lịch sử chi tiết. */
  result: RoleplayResult;
}

// ---- Xếp hạng (màn Xếp hạng, PRD mục 3.7) ----

export type BadgeTierId = 'dong' | 'bac' | 'vang' | 'bachkim' | 'kimcuong';

export interface BadgeTier {
  id: BadgeTierId;
  label: string;
  /** XP tối thiểu để đạt hạng này. */
  minXp: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  /** Khớp key trong roleplayAvatars.ts — dùng lại đúng bộ avatar đã có. */
  avatarKey: string;
  xp: number;
  streakDays: number;
}

// ---- Phân tích chi tiết (màn Home > "Kiến thức & Kỹ năng" > Xem chi tiết) ----

export interface KnowledgeTopicProgress {
  id: string;
  label: string;
  /** Tên icon Ionicons. */
  icon: string;
  /** 0-100 */
  value: number;
}

export interface PracticeRecommendation {
  id: string;
  /** Tên icon Ionicons. */
  icon: string;
  title: string;
  subtitle: string;
  /** Level cụ thể (Level.id, vd "3.4") mà gợi ý này trỏ tới — bấm "Luyện
   * lại" sẽ vào thẳng Ôn tập nhanh của đúng level này. */
  levelId: string;
}

// ---- Quản lý đội nhóm (màn Tôi > "Nhóm của bạn") ----

export interface TeamMember {
  id: string;
  name: string;
  jobTitle: string;
  /** Khớp key trong roleplayAvatars.ts. */
  avatarKey: string;
  /** key khớp SCORE_CRITERIA_META[].key (scoreCriteriaMeta.ts), value 0-100. */
  scores: Record<string, number>;
}

// ---- Quản trị hệ thống (Tôi > "Quản trị hệ thống", chỉ role='admin') ----

export interface AdminMemberRow {
  id: string;
  email: string;
  fullName: string;
  jobTitle: string;
  branch: string;
  role: UserRole;
  /** id của quản lý trực tiếp — null nếu chưa gán. */
  managerId: string | null;
}

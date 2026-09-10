import type { CustomerDifficulty, RoleplayAvatarKey } from '../data';

export interface VoiceProfile {
  pitch: number;
  rate: number;
}

// Hầu hết thiết bị chỉ cài sẵn 1 giọng đọc tiếng Việt (không có nhiều
// "voice" nam/nữ riêng biệt như tiếng Anh để expo-speech chọn), nên
// pitch/rate là đòn bẩy đáng tin cậy nhất — chạy được trên mọi máy — để
// tạo cảm giác khác biệt giữa các nhân vật khi đọc to (Speech.speak).
//
// Pitch theo avatarKey (tuổi/giới tính suy ra từ ảnh đại diện, xem
// roleplayAvatars.ts) — 1.0 = mặc định, càng cao càng "thanh", càng thấp
// càng "trầm".
const PITCH_BY_AVATAR_KEY: Record<RoleplayAvatarKey, number> = {
  'old-women': 1.15,
  'old-men': 0.75,
  'adult-women': 1.05,
  'adult-men': 0.85,
  'nam-tre': 1.0,
  'nu-tre': 1.1,
};

// Rate (tốc độ nói) theo TÍNH CÁCH persona (behaviorNote trong
// personas.ts) — tách riêng khỏi avatarKey vì cùng 1 nhóm tuổi/giới tính
// vẫn có thể có tính cách rất khác nhau giữa các persona.
const RATE_BY_PERSONA_ID: Record<string, number> = {
  'noi-tro-tiet-kiem': 0.88, // dễ tính nhưng hay hỏi lại nhiều lần — chậm rãi
  'nv-van-phong-tre': 1.15, // hỏi nhanh, đi thẳng vào lợi ích, dễ mất kiên nhẫn
  'chu-ho-kinh-doanh': 1.0, // đặt câu hỏi khó, cần bằng chứng — chắc chắn, bình thường
  'nguoi-da-nghi': 0.92, // chất vấn liên tục, dè chừng — chậm rãi, dò xét
  'khach-vip': 0.95, // kiểm soát cuộc trò chuyện, uy quyền — chậm rãi có chủ đích
};

// Fallback rate cho các persona KHÔNG có trong bảng trên (vd. 20 hồ sơ
// khách hàng thật ở màn Practice, xem customerProfiles.ts) — dùng độ khó
// (đã gắn sẵn theo từng hồ sơ) làm proxy cho tính cách: khách càng khó
// càng nói chậm rãi, chắc chắn hơn, giống cách "khach-vip"/"nguoi-da-nghi"
// ở trên đã được gán.
const RATE_BY_DIFFICULTY: Record<CustomerDifficulty, number> = {
  De: 1.05,
  TrungBinh: 1.0,
  Kho: 0.92,
  RatKho: 0.88,
};

export function getVoiceProfile(
  avatarKey: RoleplayAvatarKey,
  personaId: string,
  difficultyFallback?: CustomerDifficulty
): VoiceProfile {
  const rate =
    RATE_BY_PERSONA_ID[personaId] ?? (difficultyFallback ? RATE_BY_DIFFICULTY[difficultyFallback] : 1.0);
  return {
    pitch: PITCH_BY_AVATAR_KEY[avatarKey] ?? 1.0,
    rate,
  };
}

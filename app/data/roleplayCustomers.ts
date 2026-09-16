import type { LevelAvatarConfig } from './types';

// Avatar minh hoạ cho từng level Map — tên hiển thị lấy trực tiếp từ
// persona.name (xem personas.ts + splitPersonaName trong RolePlayScreen.tsx),
// KHÔNG lưu tên ở đây nữa để tránh lệch dữ liệu mỗi khi personas.ts đổi.
// Avatar chọn theo đúng bộ quy tắc persona → nhân vật minh hoạ:
// - Chặng 1 (Bác Lan, nội trợ tiết kiệm)      → old-women
// - Chặng 2 (My, nhân viên văn phòng trẻ)     → nu-tre
// - Chặng 3 (Ông Thắng, chủ hộ kinh doanh)    → adult-men
// - Chặng 4 (Bà Thuý, đa nghi / từng bị lừa)  → old-women
// - Chặng 5 (Ông Việt, VIP / đàm phán cứng)   → adult-men
export const roleplayCustomersByLevelId: Record<string, LevelAvatarConfig> = {
  '1.1': { avatarKey: 'old-women' },
  '1.2': { avatarKey: 'old-women' },
  '1.3': { avatarKey: 'old-women' },
  '1.4': { avatarKey: 'old-women' },

  '2.1': { avatarKey: 'nu-tre' },
  '2.2': { avatarKey: 'nu-tre' },
  '2.3': { avatarKey: 'nu-tre' },
  '2.4': { avatarKey: 'nu-tre' },

  '3.1': { avatarKey: 'adult-men' },
  '3.2': { avatarKey: 'adult-men' },
  '3.3': { avatarKey: 'adult-men' },
  '3.4': { avatarKey: 'adult-men' },

  '4.1': { avatarKey: 'old-women' },
  '4.2': { avatarKey: 'old-women' },
  '4.3': { avatarKey: 'old-women' },

  '5.1': { avatarKey: 'adult-men' },
  '5.2': { avatarKey: 'adult-men' },
  '5.3': { avatarKey: 'adult-men' },
  '5.4': { avatarKey: 'adult-men' },
};

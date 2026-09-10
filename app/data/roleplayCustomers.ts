import type { RoleplayCustomer } from './types';

// Tên + avatar khách hàng cho từng level — avatar chọn theo đúng bộ quy
// tắc persona → nhân vật minh hoạ mà người dùng cung cấp:
// - Chặng 1 (Nội trợ tiết kiệm)      → old-women
// - Chặng 2 (NV văn phòng trẻ)       → nam-tre / nu-tre tuỳ level
//   (2.2 Thẻ tín dụng & 2.4 Bảo hiểm khớp đúng ví dụ tình huống được cho)
// - Chặng 3 (Chủ hộ kinh doanh)      → adult-women
// - Chặng 4 (Người đa nghi)          → old-men
// - Chặng 5 (Khách VIP / Boss)       → adult-men
export const roleplayCustomersByLevelId: Record<string, RoleplayCustomer> = {
  '1.1': { name: 'Cô Hạnh', avatarKey: 'old-women' },
  '1.2': { name: 'Cô Hạnh', avatarKey: 'old-women' },
  '1.3': { name: 'Cô Hạnh', avatarKey: 'old-women' },
  '1.4': { name: 'Cô Hạnh', avatarKey: 'old-women' },
  '1.5': { name: 'Cô Hạnh', avatarKey: 'old-women' },

  '2.1': { name: 'Anh Tuấn', avatarKey: 'nam-tre' },
  '2.2': { name: 'Anh Minh', avatarKey: 'nam-tre' },
  '2.3': { name: 'Anh Tuấn', avatarKey: 'nam-tre' },
  '2.4': { name: 'Chị Linh', avatarKey: 'nu-tre' },
  '2.5': { name: 'Chị Trang', avatarKey: 'nu-tre' },

  '3.1': { name: 'Chị Hương', avatarKey: 'adult-women' },
  '3.2': { name: 'Chị Hương', avatarKey: 'adult-women' },
  '3.3': { name: 'Chị Hương', avatarKey: 'adult-women' },
  '3.4': { name: 'Chị Hương', avatarKey: 'adult-women' },
  '3.5': { name: 'Chị Hương', avatarKey: 'adult-women' },

  '4.1': { name: 'Chú Bình', avatarKey: 'old-men' },
  '4.2': { name: 'Chú Bình', avatarKey: 'old-men' },
  '4.3': { name: 'Chú Bình', avatarKey: 'old-men' },
  '4.4': { name: 'Chú Bình', avatarKey: 'old-men' },
  '4.5': { name: 'Chú Bình', avatarKey: 'old-men' },

  '5.1': { name: 'Anh Đức', avatarKey: 'adult-men' },
  '5.2': { name: 'Anh Đức', avatarKey: 'adult-men' },
  '5.3': { name: 'Anh Đức', avatarKey: 'adult-men' },
  '5.4': { name: 'Anh Đức', avatarKey: 'adult-men' },
  '5.5': { name: 'Anh Đức', avatarKey: 'adult-men' },
};

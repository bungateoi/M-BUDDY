import type { CustomerRoleplayConfig } from './types';
import customerRoleplayConfigsJson from './customerRoleplayConfigs.json';

// Sinh bởi scripts/generateCustomerRoleplayConfigs.mts (AI, dựa trên
// customerProfiles.ts) — mỗi hồ sơ khách hàng (20) được sinh sẵn 1 lần:
// behaviorNote/objectionBank/winCriteria/openingLine tương ứng tính cách +
// độ khó của khách đó, dùng lại đúng RolePlayScreen + backend /roleplay,
// /score như phần luyện tập trong Map — không gọi AI lúc bấm "Luyện tập".
// Chạy lại script để tái tạo nếu cần.
export const customerRoleplayConfigsByCustomerId: Record<string, CustomerRoleplayConfig> =
  customerRoleplayConfigsJson as unknown as Record<string, CustomerRoleplayConfig>;

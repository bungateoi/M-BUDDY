// Ảnh đại diện khách hàng dùng cho màn Role-play — chọn theo persona của
// từng ải, đúng bộ quy tắc người dùng cung cấp (không dùng mascot chung
// cho vai khách hàng nữa, vì role-play cần cảm giác "người thật").
export const roleplayAvatarSources = {
  'old-women': require('../assets/avatar-old-women.png'),
  'old-men': require('../assets/avatar-old-men.png'),
  'adult-women': require('../assets/avatar-adult-women.png'),
  'adult-men': require('../assets/avatar-adult-men.png'),
  'nam-tre': require('../assets/avatar-nam-tre.png'),
  'nu-tre': require('../assets/avatar-nu-tre.png'),
} as const;

export type RoleplayAvatarKey = keyof typeof roleplayAvatarSources;

export function getRoleplayAvatarSource(key: RoleplayAvatarKey) {
  return roleplayAvatarSources[key];
}

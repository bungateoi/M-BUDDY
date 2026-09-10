import { createClient } from '@supabase/supabase-js';

// Client Supabase (tài khoản + database thật — khác hẳn EXPO_PUBLIC_BACKEND_URL
// trong lib/ai.ts, vốn là backend AI role-play/chấm điểm trên GreenNode).
// Xem kế hoạch: /Users/mac/.claude/plans/vivid-leaping-sphinx.md
//
// anon key an toàn để nhúng client — mọi quyền truy cập dữ liệu thật sự được
// chặn bởi Row Level Security (RLS) ở phía database, xem supabase/migrations/.

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY chưa được cấu hình — xem app/.env.example.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Web: mặc định lưu session vào localStorage — đủ dùng cho bản web link
    // ưu tiên trước. Khi có bản native (iOS/Android) cần thêm
    // @react-native-async-storage/async-storage làm storage adapter ở đây,
    // nếu không session sẽ không tồn tại lại sau khi tắt app.
    persistSession: true,
    autoRefreshToken: true,
  },
});

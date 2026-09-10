import { createContext, useContext, useState, type ReactNode } from 'react';
import type { GeneratedCustomerPersona, RoleplayResult } from '../data/types';

// Điều hướng nhẹ, tự viết — KHÔNG dùng react-navigation vì luồng hiện tại
// không phải back-theo-lịch-sử thông thường (nhiều nút "quay lại" đều
// nhảy thẳng về Home bất kể đến từ đâu), nên một Context lưu {screen,
// params} hiện tại + hàm navigate() là đủ và đơn giản hơn nhiều so với
// cấu hình 1 stack navigator + reset action cho từng trường hợp.

export type ScreenName =
  | 'home'
  | 'map'
  | 'quiz'
  | 'roleplay'
  | 'result'
  | 'practice'
  | 'createCustomer'
  | 'leaderboard'
  | 'leaderboardFull'
  | 'profile'
  | 'teamManagement'
  | 'personalAnalysis'
  | 'admin'
  | 'skipAheadIntro'
  | 'practiceHistory'
  | 'contentManagement'
  | 'productEdit'
  | 'personaEdit';

export interface NavigationParams {
  levelId?: string;
  /** Luyện tập với 1 hồ sơ khách hàng thật (trong 20 hồ sơ cố định) ở màn
   * Practice — loại trừ lẫn nhau với levelId/generatedCustomer. */
  practiceCustomerId?: string;
  /** Luyện tập với 1 khách hàng do AI sinh trực tiếp từ tiêu chí người dùng
   * chọn (màn "Tạo khách hàng theo tiêu chí") — loại trừ lẫn nhau với
   * levelId/practiceCustomerId. RolePlayScreen/ResultScreen chỉ đọc đúng 1
   * trong 3 nguồn này. */
  generatedCustomer?: GeneratedCustomerPersona;
  /** Kết quả chấm điểm THẬT từ backend cho lượt role-play vừa xong — nếu
   * không có (vd. vào thẳng màn Kết quả), ResultScreen sẽ fallback về mock
   * trong roleplayResultsByLevelId. */
  roleplayResult?: RoleplayResult;
  /** true nếu vào level này qua nút "Học vượt" ở màn Map — đạt >=60% sẽ mở
   * khoá toàn bộ các chặng trước đó (xem MapScreen.tsx, RolePlayScreen.tsx#finishCall). */
  isSkipAhead?: boolean;
  /** Chỉ có khi vừa học vượt thành công — số chặng (1..N) vừa được mở khoá,
   * ResultScreen dùng để hiện banner chúc mừng. */
  unlockedChaptersUpTo?: number;
  /** Màn productEdit — id sản phẩm cần sửa; không có = chế độ "thêm mới". */
  productId?: string;
  /** Màn personaEdit — id chặng cần sửa; không có = chế độ "thêm mới". */
  personaId?: string;
}

interface NavigationState {
  screen: ScreenName;
  params: NavigationParams;
}

interface NavigationContextValue extends NavigationState {
  navigate: (screen: ScreenName, params?: NavigationParams) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavigationState>({ screen: 'home', params: {} });

  const navigate = (screen: ScreenName, params: NavigationParams = {}) => {
    setState({ screen, params });
  };

  return <NavigationContext.Provider value={{ ...state, navigate }}>{children}</NavigationContext.Provider>;
}

export function useAppNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useAppNavigation phải được gọi bên trong NavigationProvider');
  return ctx;
}

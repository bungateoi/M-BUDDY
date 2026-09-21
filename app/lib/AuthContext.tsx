import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { fetchMyProfile, signOut as signOutRequest } from './authData';
import type { UserProgress } from '../data/types';

// Nguồn "user hiện tại" DUY NHẤT cho toàn app — mọi màn trước đây đọc
// mockUserProgress giờ đọc profile từ đây (useAuth()). Fetch 1 lần khi có
// session, không fetch lại mỗi lần chuyển màn — gọi refreshProfile() sau khi
// ghi dữ liệu thật (vd. sau khi hoàn thành role-play) để đồng bộ lại.

interface AuthContextValue {
  session: Session | null;
  profile: UserProgress | null;
  /** true trong lúc đang xác định có session hay không, hoặc đang tải profile lần đầu. */
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    // Thử lại vài lần trước khi kết luận "không có profile" — phần lớn lỗi ở
    // đây là thoáng qua (mạng chập chờn, hoặc getUser()/query profiles vừa
    // gọi đúng lúc session mới refresh xong nên chưa ổn định), chứ không
    // phải profile thật sự không tồn tại. Trước đây chỉ thử 1 lần nên gặp
    // đúng lúc mạng chớp nhoáng là rơi thẳng vào màn báo lỗi, dù đăng xuất
    // vào lại là hết (vì lúc đó gọi lại và không còn dính lỗi thoáng qua).
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const p = await fetchMyProfile();
        setProfile(p);
        return;
      } catch {
        if (attempt === maxAttempts) {
          setProfile(null);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, attempt * 800));
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session) await loadProfile();
      if (active) setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      if (newSession) {
        setLoading(true);
        await loadProfile();
        if (active) setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await signOutRequest();
  }, []);

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile: loadProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được gọi bên trong AuthProvider');
  return ctx;
}

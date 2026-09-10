import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, primaryGradient } from './theme';
import type { LevelStatus } from '../data/types';

export function MapLevelNode({ status, size = 64 }: { status: LevelStatus; size?: number }) {
  if (status === 'locked') {
    return (
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.lockedBg },
        ]}
      >
        <Ionicons name="lock-closed" size={size * 0.4} color={colors.lockedIcon} />
      </View>
    );
  }

  // 'current' — bài tiếp theo cần học, luôn hiện ngôi sao + gradient cam
  // (không còn là hiệu ứng hover nữa — đây là bước tiếp theo THẬT trong
  // tiến độ, xem MapScreen.tsx#resolveStatus).
  if (status === 'current') {
    return (
      <View style={styles.currentWrap}>
        <View
          style={[
            styles.currentRing,
            { width: size + 10, height: size + 10, borderRadius: (size + 10) / 2 },
          ]}
        >
          <LinearGradient
            colors={primaryGradient.colors}
            start={primaryGradient.start}
            end={primaryGradient.end}
            style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
          >
            <Ionicons name="star" size={size * 0.42} color={colors.white} />
          </LinearGradient>
        </View>
      </View>
    );
  }

  // 'completed'.
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.success },
      ]}
    >
      <Ionicons name="checkmark" size={size * 0.52} color={colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  currentWrap: { alignItems: 'center', justifyContent: 'center' },
  currentRing: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C4460F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

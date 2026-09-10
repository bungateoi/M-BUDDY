import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors } from './theme';

export function NotificationBell({ hasUnread }: { hasUnread?: boolean }) {
  return (
    <View style={styles.circle}>
      <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
      {hasUnread && <View style={styles.dot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  dot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E63946',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { colors, fontFamily, radii, spacing } from './theme';
import type { CustomerProfile, CustomerSegment } from '../data/types';

const SEGMENT_STYLE: Record<CustomerSegment, { bg: string; text: string; label: string }> = {
  Mass: { bg: '#E7F8ED', text: '#2ECC71', label: 'Mass' },
  Affluent: { bg: '#FFF3E0', text: '#F5A623', label: 'Affluent' },
  Priority: { bg: '#FDEAF0', text: '#E6398F', label: 'Priority' },
};

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/);
  const givenName = words.slice(-2);
  return givenName.map((w) => w[0]).join('').toUpperCase();
}

export function PracticeCustomerRow({
  customer,
  onPress,
  onPressPractice,
}: {
  customer: CustomerProfile;
  onPress?: () => void;
  onPressPractice?: () => void;
}) {
  const segment = SEGMENT_STYLE[customer.segment];
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Avatar initials={initialsOf(customer.name)} size={44} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {customer.name}
        </Text>
        <Text style={styles.phone}>{customer.phone}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText} numberOfLines={1}>
            {customer.age} tuổi · {customer.occupation}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <View style={[styles.segmentBadge, { backgroundColor: segment.bg }]}>
            <Text style={[styles.segmentText, { color: segment.text }]}>{segment.label}</Text>
          </View>
          <Text style={styles.needsText} numberOfLines={1}>
            {customer.needsShort}
          </Text>
        </View>
      </View>
      <Pressable onPress={onPressPractice} style={styles.practiceButton} hitSlop={6}>
        <Text style={styles.practiceButtonText}>Luyện tập</Text>
        <Ionicons name="arrow-forward" size={13} color={colors.white} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EBE3',
  },
  info: { flex: 1, gap: 3 },
  name: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.textPrimary },
  phone: { fontFamily: fontFamily.semiBold, fontSize: 11, color: colors.textMuted },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  metaText: { fontFamily: fontFamily.semiBold, fontSize: 11, color: colors.textMuted, flexShrink: 1 },
  segmentBadge: { borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 2 },
  segmentText: { fontFamily: fontFamily.extraBold, fontSize: 9.5 },
  needsText: { fontFamily: fontFamily.semiBold, fontSize: 11, color: colors.textPrimary, flexShrink: 1 },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  practiceButtonText: { fontFamily: fontFamily.extraBold, fontSize: 11, color: colors.white },
});

import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';
import type { CustomerProfile } from '../data/types';

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/);
  return words
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function DetailSection({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

export function PracticeCustomerDetail({
  customer,
  onBack,
  onPressPractice,
}: {
  customer: CustomerProfile;
  onBack?: () => void;
  onPressPractice?: () => void;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {customer.name}
          </Text>
          <Text style={styles.headerSubtitle}>{customer.phone}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.identityCard}>
          <Avatar initials={initialsOf(customer.name)} size={56} />
          <View style={styles.identityText}>
            <Text style={styles.identityName}>{customer.name}</Text>
            <Text style={styles.identityPhone}>{customer.phone}</Text>
          </View>
        </Card>

        <View style={styles.statGrid}>
          <StatChip label="Tuổi" value={`${customer.age}`} />
          <StatChip label="Giới tính" value={customer.gender} />
          <StatChip label="Khu vực" value={customer.region} />
          <StatChip label="Nghề nghiệp" value={customer.occupation} />
          <StatChip label="Thu nhập" value={customer.incomeText} />
          <StatChip label="Phân khúc" value={customer.segment} />
        </View>

        <DetailSection title="Nhu cầu / Mục tiêu" text={customer.needs} />
        <DetailSection title="Hành vi hiện tại" text={customer.currentBehavior} />
        <DetailSection title="Pain points" text={customer.painPoints} />
        <DetailSection title="Kỳ vọng" text={customer.expectations} />
        <DetailSection title="Động lực" text={customer.motivation} />
        <DetailSection title="Rào cản" text={customer.barrier} />

        <Pressable onPress={onPressPractice} style={styles.practiceButton}>
          <Text style={styles.practiceButtonText}>Luyện tập role-play</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7E0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  headerTextCol: { flex: 1, gap: 1 },
  headerTitle: { fontFamily: fontFamily.extraBold, fontSize: 16.5, color: colors.textPrimary },
  headerSubtitle: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted },
  content: { padding: spacing.xl, gap: spacing.md, paddingBottom: spacing.xxl },
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  identityText: { gap: 2 },
  identityName: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.textPrimary },
  identityPhone: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textMuted },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statChip: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.sm,
    gap: 2,
  },
  statLabel: { fontFamily: fontFamily.semiBold, fontSize: 10, color: colors.textMuted },
  statValue: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.textPrimary },
  section: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: 4 },
  sectionTitle: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.primary },
  sectionText: { fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textPrimary, lineHeight: 19 },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  practiceButtonText: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.white },
});

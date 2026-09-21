import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
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
          <Ionicons name="arrow-back" size={20} color={colors2.white} />
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
          <Ionicons name="arrow-forward" size={16} color={colors2.white} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.black },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    paddingHorizontal: spacing2.md,
    paddingTop: spacing2.xs,
    paddingBottom: spacing2.md,
    backgroundColor: colors2.black,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors2.cardOptionIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: { flex: 1, gap: 1 },
  headerTitle: { fontFamily: fontFamily2.semiBold, fontSize: 16.5, color: colors2.white },
  headerSubtitle: { fontFamily: fontFamily2.regular, fontSize: 11.5, color: colors2.whiteMuted },
  content: { padding: spacing2.md, gap: spacing2.md, paddingBottom: spacing2.xl },
  identityCard: { flexDirection: 'row', alignItems: 'center', gap: spacing2.md, padding: spacing2.md },
  identityText: { gap: 2 },
  identityName: { fontFamily: fontFamily2.semiBold, fontSize: 16, color: colors2.white },
  identityPhone: { fontFamily: fontFamily2.regular, fontSize: 12.5, color: colors2.whiteMuted },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing2.xs },
  statChip: {
    flexBasis: '31%',
    flexGrow: 1,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.xs,
    gap: 2,
  },
  statLabel: { fontFamily: fontFamily2.regular, fontSize: 10, color: colors2.whiteMuted },
  statValue: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.white },
  section: { backgroundColor: colors2.cardOptionIdle, borderRadius: radii2.card, padding: spacing2.md, gap: 4 },
  sectionTitle: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.orange },
  sectionText: { fontFamily: fontFamily2.regular, fontSize: 13, color: colors2.white, lineHeight: 19 },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors2.orange,
    borderRadius: radii2.pill,
    paddingVertical: spacing2.md,
    marginTop: spacing2.xs,
  },
  practiceButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.white },
});

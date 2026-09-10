import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { badgeTierIcons, badgeTiers, getBadgeTierProgress } from '../data';
import { colors, fontFamily, radii, spacing } from './theme';

const mascotSource = require('../assets/mascot-leaderboard.png');

function formatXp(xp: number): string {
  return xp.toLocaleString('vi-VN');
}

export function BadgeTierCard({ xp }: { xp: number }) {
  const { current, next } = getBadgeTierProgress(xp);
  const currentIndex = badgeTiers.findIndex((t) => t.id === current.id);
  // % chiều dài đoạn line đã "đi qua" — tới đúng tâm cột hạng hiện tại.
  const lineProgressPct = ((currentIndex + 0.5) / badgeTiers.length) * 100;

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>HUY HIỆU KINH NGHIỆM</Text>
        <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
      </View>

      <View style={styles.trackRow}>
        <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />

        <View style={styles.tiers}>
          <View style={styles.lineTrack} pointerEvents="none">
            <View style={styles.lineBase} />
            <View style={[styles.lineActive, { width: `${lineProgressPct}%` }]} />
          </View>

          {badgeTiers.map((tier, index) => {
            const isCurrent = tier.id === current.id;
            const isReached = index <= currentIndex;
            return (
              <View key={tier.id} style={[styles.tierColumn, isCurrent && styles.tierColumnActive]}>
                <Image source={badgeTierIcons[tier.id]} style={styles.tierIcon} resizeMode="contain" />
                <View style={[styles.dot, isReached && styles.dotActive]} />
                <Text style={[styles.tierLabel, isCurrent && styles.tierLabelActive]} numberOfLines={1}>
                  {tier.label}
                </Text>
                <Text style={styles.tierXp}>{formatXp(tier.minXp)} XP</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusLeft}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={styles.statusText}>
            Bạn đang ở hạng <Text style={styles.statusTierName}>{current.label}</Text>
          </Text>
        </View>
        <Text style={styles.statusXp}>
          {formatXp(xp)} / {formatXp(next?.minXp ?? current.minXp)} XP
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, gap: spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.textPrimary, letterSpacing: 0.3 },
  trackRow: { flexDirection: 'row', alignItems: 'center' },
  mascot: { width: 64, height: 74, marginRight: -4 },
  tiers: { flex: 1, flexDirection: 'row', position: 'relative' },
  lineTrack: { position: 'absolute', left: '10%', right: '10%', top: 42, height: 2 },
  lineBase: { position: 'absolute', left: 0, right: 0, top: 0, height: 2, backgroundColor: '#F1E7E0' },
  lineActive: { position: 'absolute', left: 0, top: 0, height: 2, backgroundColor: colors.primary },
  tierColumn: { flex: 1, alignItems: 'center', gap: 3, borderRadius: radii.md, paddingVertical: 4 },
  tierColumnActive: { backgroundColor: colors.primaryLight },
  tierIcon: { width: 40, height: 40 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#E3D5CC' },
  dotActive: { backgroundColor: colors.primary },
  tierLabel: { fontFamily: fontFamily.bold, fontSize: 10.5, color: colors.textMuted },
  tierLabelActive: { color: colors.primary, fontFamily: fontFamily.extraBold },
  tierXp: { fontFamily: fontFamily.semiBold, fontSize: 9, color: colors.textMuted },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1E7E0',
    paddingTop: spacing.sm,
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textPrimary },
  statusTierName: { fontFamily: fontFamily.extraBold, color: colors.primary },
  statusXp: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.primary },
});

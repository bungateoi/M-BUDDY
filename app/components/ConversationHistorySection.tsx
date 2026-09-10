import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleplayAvatarSource } from '../data';
import type { TranscriptMessage } from '../data/types';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';

// Cố định ở NGOÀI ScrollView chính của màn Kết quả (xem ResultScreen.tsx) —
// không phải sticky header — nên nút thu gọn LUÔN đứng yên, kể cả khi đang
// cuộn xem hội thoại dài bên trong khung messagesScroll của chính nó.
const MESSAGES_MAX_HEIGHT = 420;

function MessageRow({ message, sellerAvatarKey }: { message: TranscriptMessage; sellerAvatarKey: string }) {
  if (message.role === 'customer') {
    return (
      <View style={styles.customerRow}>
        <View style={styles.customerAvatar}>
          <Ionicons name="person" size={14} color={colors.primary} />
        </View>
        <View style={styles.bubbleCol}>
          <Text style={styles.senderLabel}>Khách hàng</Text>
          <View style={styles.customerBubble}>
            <Text style={styles.bubbleText}>{message.text}</Text>
          </View>
        </View>
      </View>
    );
  }

  const isBad = message.isGood === false;

  return (
    <View style={styles.sellerMessageGroup}>
      <View style={styles.sellerRow}>
        <View style={styles.bubbleColRight}>
          <Text style={[styles.senderLabel, styles.senderLabelRight]}>Bạn</Text>
          <View style={[styles.sellerBubble, isBad ? styles.sellerBubbleBad : styles.sellerBubbleGood]}>
            {isBad && <Ionicons name="warning" size={13} color={colors.error} style={styles.warnIcon} />}
            <Text style={styles.bubbleText}>{message.text}</Text>
          </View>
        </View>
        <Image source={getRoleplayAvatarSource(sellerAvatarKey as any)} style={styles.sellerAvatar} />
      </View>

      {isBad && message.comment && (
        <View style={styles.tipRow}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>{message.comment}</Text>
        </View>
      )}
    </View>
  );
}

export function ConversationHistorySection({
  transcript,
  sellerAvatarKey,
}: {
  transcript: TranscriptMessage[];
  sellerAvatarKey: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.toggleBar} onPress={() => setExpanded((e) => !e)}>
        <View style={styles.toggleIconCircle}>
          <Ionicons name="chatbubble-ellipses" size={15} color={colors.white} />
        </View>
        <Text style={styles.toggleLabel}>Lịch sử hội thoại</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          {transcript.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dữ liệu hội thoại cho buổi luyện tập này.</Text>
          ) : (
            <ScrollView
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {transcript.map((message, index) => (
                <MessageRow key={index} message={message} sellerAvatarKey={sellerAvatarKey} />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  toggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    ...cardShadow,
  },
  toggleIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabel: { flex: 1, fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.textPrimary },
  body: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    ...cardShadow,
  },
  emptyText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12.5,
    color: colors.textMuted,
    padding: spacing.lg,
    textAlign: 'center',
  },
  messagesScroll: { maxHeight: MESSAGES_MAX_HEIGHT },
  messagesContent: { padding: spacing.md, gap: spacing.md },
  senderLabel: { fontFamily: fontFamily.bold, fontSize: 11, color: colors.textMuted, marginBottom: 3 },
  senderLabelRight: { textAlign: 'right' },
  bubbleText: { fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textPrimary, lineHeight: 18 },

  customerRow: { flexDirection: 'row', gap: spacing.sm, maxWidth: '85%' },
  customerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleCol: { flexShrink: 1 },
  customerBubble: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderTopLeftRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  sellerRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, alignSelf: 'flex-end', maxWidth: '85%' },
  bubbleColRight: { flexShrink: 1, alignItems: 'flex-end' },
  sellerBubble: {
    borderRadius: radii.md,
    borderTopRightRadius: 4,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  sellerBubbleGood: { backgroundColor: colors.successLight, borderColor: colors.success },
  sellerBubbleBad: { backgroundColor: colors.errorLight, borderColor: colors.error },
  warnIcon: { marginBottom: 2 },
  sellerAvatar: { width: 28, height: 28, borderRadius: 14 },

  sellerMessageGroup: { gap: 6 },
  tipRow: { flexDirection: 'row', gap: 6, paddingLeft: 36, paddingRight: spacing.sm },
  tipIcon: { fontSize: 13 },
  tipText: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.primary, lineHeight: 16 },
});

import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CancelCircleFillIcon, CheckCircleFillIcon, CloseXIcon } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { TranscriptMessage } from '../data/types';

// Thay thế HOÀN TOÀN ConversationHistorySection.tsx (khối mở rộng/thu gọn
// nằm ngay trong màn Kết quả) — thiết kế mới (node-id=76-5140) là 1 màn
// riêng dạng bottom sheet phủ gần kín màn Kết quả phía sau (chừa đúng
// khoảng status bar ở trên, giống các "StatusBar/iPhone 14" mock khác trong
// Figma), bấm vào "Lịch sử hội thoại" ở ResultSummaryCard mới mở ra — không
// còn là 1 section cuộn chung trang.
const TOP_PEEK_HEIGHT = 47;

function MessageBubble({ message }: { message: TranscriptMessage }) {
  if (message.role === 'customer') {
    return (
      <View style={styles.customerRow}>
        <View style={styles.customerBubble}>
          <Text style={styles.bubbleText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  const isBad = message.isGood === false;

  return (
    <View style={styles.sellerGroup}>
      <View style={styles.sellerRow}>
        {isBad ? <CancelCircleFillIcon size={16} /> : <CheckCircleFillIcon size={16} />}
        <View style={[styles.sellerBubble, isBad ? styles.sellerBubbleBad : styles.sellerBubbleGood]}>
          <Text style={styles.bubbleText}>{message.text}</Text>
        </View>
      </View>
      {isBad && message.comment && <Text style={styles.commentText}>{message.comment}</Text>}
    </View>
  );
}

export function ConversationHistoryModal({
  visible,
  transcript,
  onClose,
}: {
  visible: boolean;
  transcript: TranscriptMessage[];
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.topPeek} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.topBar}>
            <Text style={styles.title}>Lịch sử hội thoại</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <CloseXIcon size={24} />
            </Pressable>
          </View>

          {transcript.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có dữ liệu hội thoại cho buổi luyện tập này.</Text>
          ) : (
            <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
              {transcript.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors2.overlayDark },
  topPeek: { height: TOP_PEEK_HEIGHT },
  sheet: {
    flex: 1,
    backgroundColor: colors2.black,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
    padding: spacing2.md,
    gap: spacing2.md,
  },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing2.md },
  title: { flex: 1, fontFamily: fontFamily2.semiBold, fontSize: 24, lineHeight: 32, color: colors2.white },
  emptyText: { fontFamily: fontFamily2.regular, fontSize: 13, color: colors2.whiteMuted, textAlign: 'center', paddingTop: spacing2.xl },
  messages: { gap: spacing2.md, paddingBottom: spacing2.xl },

  customerRow: { alignItems: 'flex-start' },
  customerBubble: {
    maxWidth: 300,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    borderBottomLeftRadius: 0,
    padding: 12,
  },
  bubbleText: { fontFamily: fontFamily2.regular, fontSize: 14, lineHeight: 20, color: colors2.white },

  sellerGroup: { alignItems: 'flex-end', gap: spacing2.xs },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs },
  sellerBubble: {
    maxWidth: 300,
    borderRadius: radii2.card,
    borderBottomRightRadius: 0,
    padding: 12,
  },
  sellerBubbleGood: { backgroundColor: colors2.green800 },
  sellerBubbleBad: { backgroundColor: colors2.red800 },
  commentText: {
    maxWidth: 300,
    fontFamily: fontFamily2.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors2.red500,
    textAlign: 'right',
  },
});

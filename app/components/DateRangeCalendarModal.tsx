import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors2, fontFamily2, radii2, spacing2, webPhoneFrameMaxWidth } from './theme';

const WEEKDAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_LABELS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function fmtDMY(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

/** Lưới các tuần trong tháng, tuần bắt đầu từ Thứ 2 — ô null là ngày "đệm"
 * thuộc tháng trước/sau, chỉ để lấp đầy hàng, không bấm được. */
function buildMonthWeeks(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function DateRangeCalendarModal({
  visible,
  initialStart,
  initialEnd,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  initialStart: Date;
  initialEnd: Date;
  onConfirm: (start: Date, end: Date) => void;
  onClose: () => void;
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialStart.getFullYear(), initialStart.getMonth(), 1));
  const [draftStart, setDraftStart] = useState(initialStart);
  const [draftEnd, setDraftEnd] = useState<Date | null>(initialEnd);

  // Mỗi lần modal MỞ LẠI, nạp lại đúng khoảng đang áp dụng — tránh giữ dở
  // lựa chọn cũ từ lần mở trước đó bị đóng ngang (bấm X/tap ra ngoài).
  useEffect(() => {
    if (!visible) return;
    setVisibleMonth(new Date(initialStart.getFullYear(), initialStart.getMonth(), 1));
    setDraftStart(initialStart);
    setDraftEnd(initialEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const shiftMonth = (delta: number) => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const handleDayPress = (day: Date) => {
    // Đang có đủ start+end (kể cả từ props ban đầu) -> bấm ngày mới bắt đầu
    // 1 lượt chọn khoảng MỚI, không cộng dồn vào khoảng cũ.
    if (draftEnd || !draftStart) {
      setDraftStart(day);
      setDraftEnd(null);
      return;
    }
    if (isSameDay(day, draftStart)) return;
    if (day < draftStart) {
      setDraftEnd(draftStart);
      setDraftStart(day);
    } else {
      setDraftEnd(day);
    }
  };

  const handleConfirm = () => {
    onConfirm(draftStart, draftEnd ?? draftStart);
    onClose();
  };

  const weeks = buildMonthWeeks(visibleMonth.getFullYear(), visibleMonth.getMonth());
  const today = new Date();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Chọn khoảng thời gian</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors2.white} />
            </Pressable>
          </View>

          <Text style={styles.rangeSummary}>
            {fmtDMY(draftStart)} {draftEnd ? `- ${fmtDMY(draftEnd)}` : '- ...'}
          </Text>

          <View style={styles.monthNav}>
            <Pressable onPress={() => shiftMonth(-1)} hitSlop={8} style={styles.monthNavBtn}>
              <Ionicons name="chevron-back" size={18} color={colors2.orange} />
            </Pressable>
            <Text style={styles.monthLabel}>
              {MONTH_LABELS[visibleMonth.getMonth()]}, {visibleMonth.getFullYear()}
            </Text>
            <Pressable onPress={() => shiftMonth(1)} hitSlop={8} style={styles.monthNavBtn}>
              <Ionicons name="chevron-forward" size={18} color={colors2.orange} />
            </Pressable>
          </View>

          <View style={styles.calendarWrap}>
            <View style={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((label) => (
                <Text key={label} style={styles.weekdayLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {weeks.map((week, wi) => (
              <View key={wi} style={styles.weekRow}>
                {week.map((day, di) => {
                  if (!day) return <View key={di} style={styles.dayCell} />;
                  const isStart = isSameDay(day, draftStart);
                  const isEnd = !!draftEnd && isSameDay(day, draftEnd);
                  const inRange = !!draftEnd && day > draftStart && day < draftEnd;
                  const isEdge = isStart || isEnd;
                  const isToday = isSameDay(day, today);
                  return (
                    <Pressable
                      key={di}
                      onPress={() => handleDayPress(day)}
                      style={[styles.dayCell, inRange && styles.dayCellInRange, isEdge && styles.dayCellEdge]}
                    >
                      <View style={[styles.dayCircle, isEdge && styles.dayCircleSelected]}>
                        <Text style={[styles.dayText, isEdge && styles.dayTextSelected, isToday && !isEdge && styles.dayTextToday]}>
                          {day.getDate()}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          <Pressable onPress={handleConfirm} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Xong</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const CELL_SIZE = 40;

const styles = StyleSheet.create({
  // alignItems:'center' + sheet có width/maxWidth — trên web, Modal portal
  // thẳng ra document.body (ngoài khung "phản chiếu điện thoại" bọc quanh
  // phần còn lại của app, xem App.tsx#WebPhoneFrame) nên nếu không giới hạn,
  // sheet sẽ kéo giãn full chiều rộng desktop thay vì thẳng hàng với khung.
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', alignItems: 'center' },
  backdropDismiss: { ...StyleSheet.absoluteFill },
  sheet: {
    width: '100%',
    maxWidth: webPhoneFrameMaxWidth,
    backgroundColor: colors2.black,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
    paddingHorizontal: spacing2.lg,
    paddingBottom: spacing2.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing2.lg,
    paddingBottom: spacing2.xs,
  },
  sheetTitle: { fontFamily: fontFamily2.semiBold, fontSize: 16, color: colors2.white },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors2.cardOptionIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeSummary: {
    fontFamily: fontFamily2.semiBold,
    fontSize: 13.5,
    color: colors2.orange,
    textAlign: 'center',
    marginBottom: spacing2.xs,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing2.lg,
    marginBottom: spacing2.xs,
  },
  monthNavBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors2.cardOptionIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: { fontFamily: fontFamily2.semiBold, fontSize: 14.5, color: colors2.white, minWidth: 130, textAlign: 'center' },
  calendarWrap: { alignItems: 'center' },
  weekdayRow: { flexDirection: 'row' },
  weekdayLabel: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontFamily: fontFamily2.semiBold,
    fontSize: 11.5,
    color: colors2.whiteMuted,
    marginBottom: 4,
  },
  weekRow: { flexDirection: 'row' },
  dayCell: { width: CELL_SIZE, height: CELL_SIZE, alignItems: 'center', justifyContent: 'center' },
  dayCellInRange: { backgroundColor: colors2.cardOptionIdle },
  dayCellEdge: { backgroundColor: colors2.cardOptionIdle },
  dayCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayCircleSelected: { backgroundColor: colors2.orange },
  dayText: { fontFamily: fontFamily2.semiBold, fontSize: 13, color: colors2.white },
  dayTextSelected: { fontFamily: fontFamily2.semiBold, color: colors2.white },
  dayTextToday: { fontFamily: fontFamily2.semiBold, color: colors2.orange },
  doneButton: {
    marginTop: spacing2.md,
    backgroundColor: colors2.orange,
    borderRadius: radii2.pill,
    paddingVertical: spacing2.md,
    alignItems: 'center',
  },
  doneButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.white },
});

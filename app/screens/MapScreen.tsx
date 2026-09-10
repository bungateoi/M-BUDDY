import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  MapHeader,
  CurrentLevelBanner,
  MapLevelRow,
  MapPathLine,
  BottomNavBar,
  computeMapNodeCenters,
  cardShadow,
  colors,
  fontFamily,
  radii,
  spacing,
} from '../components';
import { levels, personas, getLevelsByChapter, getProductById, getPositionInChapter, isLevelVisible } from '../data';
import type { LevelStatus } from '../data/types';
import { fetchMyLevelProgress } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { showAlert } from '../lib/platformAlert';
import { useAppNavigation } from '../navigation/NavigationContext';

const INITIAL_LANE_WIDTH = Dimensions.get('window').width - spacing.xl * 2;
// Chặng cao nhất trên cùng, chặng thấp nhất dưới cùng — cùng chiều với thứ
// tự level trong 1 chặng (level cao hơn ở trên). Danh sách chặng CÒN HIỂN
// THỊ (bỏ chặng bị admin ẩn qua "Quản trị hành trình & tri thức") được tính
// động trong MapScreen (biến chapterOrder) thay vì hardcode [5,4,3,2,1] —
// xem chapterOrder/defaultViewChapter bên dưới.
// Banner "Chặng N" cố định — CHỈ 1 instance duy nhất, render đè lên trên
// ScrollView (không dùng stickyHeaderIndices nữa vì mỗi section 1 sticky
// header riêng gây hiện tượng chồng 2 banner lúc chuyển giao giữa 2
// chặng). Nội dung banner đổi theo scroll qua state activeChapterNumber.
const STICKY_BANNER_HEIGHT = 124;
const CHAPTER_DIVIDER_HEIGHT = 44;
const CHAPTER_BLOCK_MARGIN_TOP = spacing.lg;
const CHAPTER_BLOCK_MARGIN_BOTTOM = spacing.xxl;
// "Học vượt" của chặng N nằm NGAY SAU level 1 của chặng N (level 1 luôn ở
// TRÊN — chặng render theo chapterOrder giảm dần nên level1 của chặng N là
// node cuối cùng/thấp nhất của chặng N, ngay phía trên chặng liền trước còn
// hiển thị) — tức đứng ở ranh giới giữa 2 chặng, đúng vị trí "cửa tắt" để
// nhảy qua chặng trước đó. Cộng thẳng vào chiều cao của chặng N
// (getChapterFlowHeight) vì nó "thuộc về" chặng N trong luồng cuộn.
const SKIP_AHEAD_BLOCK_HEIGHT = 60;

/** id của level ĐỨNG SAU CÙNG (vị trí cao nhất còn hiển thị) trong 1 chặng —
 * mục tiêu của nút "Học vượt" đứng sau level 1 của chặng kế tiếp (vd học
 * vượt sau chặng 5 -> chơi level cuối của chặng 4). Tính động qua
 * getLevelsByChapter (đã lọc level ẩn) thay vì hardcode ".5" — đúng cả khi
 * 1 chặng không có đủ/đúng 5 sản phẩm hoặc có sản phẩm bị ẩn riêng chặng đó. */
function lastLevelIdOfChapter(chapterNumber: number): string | undefined {
  const chapterLevels = getLevelsByChapter(chapterNumber);
  return chapterLevels[chapterLevels.length - 1]?.id;
}

function getChapterStatuses(chapterNumber: number, resolveStatus: (levelId: string) => LevelStatus) {
  const chapterLevels = getLevelsByChapter(chapterNumber);
  const displayLevels = [...chapterLevels].reverse();
  const statuses: LevelStatus[] = displayLevels.map((l) => resolveStatus(l.id));
  return { displayLevels, statuses };
}

// Chiều cao THẬT của khối [divider + ChapterBlock + (Học vượt nếu có)] 1
// chặng trong luồng cuộn — dùng computeMapNodeCenters (nguồn tính toán DUY
// NHẤT, y hệt cái ChapterBlock dùng để vẽ) để không bao giờ lệch với layout thực tế.
function getChapterFlowHeight(
  chapterNumber: number,
  resolveStatus: (levelId: string) => LevelStatus,
  showSkipAhead: boolean
) {
  const { statuses } = getChapterStatuses(chapterNumber, resolveStatus);
  const { totalHeight } = computeMapNodeCenters(statuses, 0);
  const skipBlock = showSkipAhead ? SKIP_AHEAD_BLOCK_HEIGHT : 0;
  return CHAPTER_DIVIDER_HEIGHT + CHAPTER_BLOCK_MARGIN_TOP + totalHeight + CHAPTER_BLOCK_MARGIN_BOTTOM + skipBlock;
}

// Định nghĩa NGOÀI MapScreen (không phải component lồng bên trong) — bắt
// buộc để tránh bị remount lại mỗi lần MapScreen re-render (sẽ làm mất
// hover state, gây onLayout lặp vô hạn...).
function ChapterBlock({
  chapterNumber,
  laneWidth,
  onLaneWidthChange,
  resolveStatus,
  onPressLevel,
}: {
  chapterNumber: number;
  laneWidth: number;
  onLaneWidthChange: (width: number) => void;
  resolveStatus: (levelId: string) => LevelStatus;
  onPressLevel: (levelId: string) => void;
}) {
  const { displayLevels, statuses } = getChapterStatuses(chapterNumber, resolveStatus);
  const { points, totalHeight } = computeMapNodeCenters(statuses, laneWidth);

  const handleLayout = (e: LayoutChangeEvent) => {
    onLaneWidthChange(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.chapterBlock} onLayout={handleLayout}>
      <MapPathLine points={points} height={totalHeight} width={laneWidth} />
      {displayLevels.map((level, index) => {
        const product = getProductById(level.productId);
        if (!product) return null;
        return (
          <MapLevelRow
            key={level.id}
            status={statuses[index]}
            positionInChapter={getPositionInChapter(level.id)}
            productName={product.shortName ?? product.name}
            offsetIndex={index}
            laneWidth={laneWidth}
            alignLeft={index % 2 === 0}
            isLast={index === displayLevels.length - 1}
            onPressStart={() => onPressLevel(level.id)}
          />
        );
      })}
    </View>
  );
}

// Chỉ 1 nút nhỏ, căn giữa — icon tia sét + "Học vượt", không mô tả thêm.
function SkipAheadButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.skipAheadRow}>
      <Pressable style={styles.skipAheadPill} onPress={onPress}>
        <Ionicons name="flash" size={16} color={colors.primary} />
        <Text style={styles.skipAheadPillText}>Học vượt</Text>
      </Pressable>
    </View>
  );
}

export function MapScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [laneWidth, setLaneWidth] = useState(INITIAL_LANE_WIDTH);
  const scrollRef = useRef<ScrollView>(null);
  const hasAutoScrolledRef = useRef(false);
  const [levelProgress, setLevelProgress] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetchMyLevelProgress()
      .then(setLevelProgress)
      .catch(() => setLevelProgress({}));
  }, []);

  const isAdmin = profile?.role === 'admin';
  const completedLevelIds = useMemo(() => new Set(Object.keys(levelProgress ?? {})), [levelProgress]);
  // Danh sách chặng CÒN HIỂN THỊ (bỏ chặng bị admin ẩn), chặng cao nhất
  // trước — nguồn DUY NHẤT cho thứ tự render + tính "chặng liền trước" cho
  // học vượt. Chỉ tính lại nếu personas đổi (hydrate/tạo mới) — trong 1
  // lượt mở màn coi như tĩnh, giống cách orderedLevelIds bên dưới cũng chỉ
  // tính 1 lần.
  const chapterOrder = useMemo(
    () =>
      personas
        .filter((p) => !p.isHidden)
        .map((p) => p.chapterNumber)
        .sort((a, b) => b - a),
    []
  );
  const defaultViewChapter = chapterOrder[chapterOrder.length - 1] ?? 1;
  // Thứ tự tiến độ THẬT (tăng dần theo id) — khác chapterOrder (chỉ để
  // hiển thị chặng cao nhất trên cùng), dùng để suy level "hiện tại" (bước
  // tiếp theo). Chỉ tính trên level CÒN HIỂN THỊ — level bị ẩn không được
  // tính vào chuỗi khoá tuần tự (không chặn tiến độ vì 1 bài không ai thấy).
  const orderedLevelIds = useMemo(() => levels.filter(isLevelVisible).map((l) => l.id).sort(), []);
  const firstIncompleteLevelId = useMemo(
    () => orderedLevelIds.find((id) => !completedLevelIds.has(id)),
    [orderedLevelIds, completedLevelIds]
  );

  const resolveStatus = (levelId: string): LevelStatus => {
    if (isAdmin) return 'completed';
    if (completedLevelIds.has(levelId)) return 'completed';
    if (levelId === firstIncompleteLevelId) return 'current';
    return 'locked';
  };

  /** Chặng liền trước chapterNumber TRONG DANH SÁCH CÒN HIỂN THỊ (không
   * phải chapterNumber-1 theo số — nếu 1 chặng bị ẩn, "học vượt" của chặng
   * kế tiếp phải trỏ đúng chặng còn hiển thị gần nhất). undefined nếu
   * chapterNumber đang là chặng thấp nhất còn hiển thị. */
  const prevVisibleChapter = (chapterNumber: number): number | undefined => {
    const idx = chapterOrder.indexOf(chapterNumber);
    return idx >= 0 ? chapterOrder[idx + 1] : undefined;
  };

  const shouldShowSkipAhead = (chapterNumber: number): boolean => {
    if (isAdmin) return false;
    const prevChapter = prevVisibleChapter(chapterNumber);
    if (prevChapter === undefined) return false;
    const targetLevelId = lastLevelIdOfChapter(prevChapter);
    return !!targetLevelId && !completedLevelIds.has(targetLevelId);
  };

  const [activeChapterNumber, setActiveChapterNumber] = useState(defaultViewChapter);

  // Vị trí Y (trong nội dung cuộn, TÍNH TỪ SAU paddingTop) mà divider của
  // mỗi chặng bắt đầu — tính lại đúng 1 lần SAU khi tiến độ thật tải xong
  // (levelProgress đổi từ null -> object đúng 1 lần/lượt mở màn, xem
  // TeamManagementScreen cho pattern fetch-once tương tự), vì chiều cao mỗi
  // chặng phụ thuộc trạng thái khoá/mở của từng level (locked cao hơn) và
  // có hiện khối "Học vượt" hay không.
  const chapterStartY = useMemo(() => {
    const map: Record<number, number> = {};
    let cumulativeY = 0;
    chapterOrder.forEach((chapterNum) => {
      map[chapterNum] = cumulativeY;
      cumulativeY += getChapterFlowHeight(chapterNum, resolveStatus, shouldShowSkipAhead(chapterNum));
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelProgress, isAdmin]);

  const handleLaneWidthChange = (width: number) => {
    if (Math.abs(width - laneWidth) > 1) setLaneWidth(width);
  };

  // Banner "Chặng N" là 1 overlay CỐ ĐỊNH đè lên đầu ScrollView (không
  // cuộn) — nội dung đổi theo activeChapterNumber, cập nhật mỗi lần cuộn
  // dựa trên chapterStartY đã tính sẵn ở trên.
  //
  // Chặng thấp nhất còn hiển thị (cuối chapterOrder, dưới cùng) là 1 trường
  // hợp riêng: nếu khối nội dung của nó thấp hơn 1 màn hình, scrollY tối đa
  // có thể KHÔNG BAO GIỜ chạm tới chapterStartY tương ứng dù chặng đó đã
  // hiện trọn vẹn trên màn (ScrollView hết cỡ chỉ cho scrollY tới
  // contentHeight - viewportHeight). Nhận diện "đã cuộn chạm đáy"
  // (isAtBottom) qua contentSize/layoutMeasurement thật của ScrollView để
  // banner vẫn chuyển đúng ngay khi chạm đáy.
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollY = contentOffset.y;
    const isAtBottom = scrollY + layoutMeasurement.height >= contentSize.height - 2;
    let nextActive = chapterOrder[chapterOrder.length - 1];
    if (!isAtBottom) {
      nextActive = chapterOrder[0];
      for (const chapterNum of chapterOrder) {
        if (chapterStartY[chapterNum] <= scrollY) nextActive = chapterNum;
      }
    }
    setActiveChapterNumber((prev) => (prev === nextActive ? prev : nextActive));
  };

  // Vào màn là cuộn thẳng tới ĐẦU chặng thấp nhất còn hiển thị, thấy được
  // cả banner lẫn các level trong chặng đó — thay vì luôn bắt đầu ở chặng
  // cao nhất (trên cùng của toàn bộ hành trình).
  const handleContentLayout = () => {
    if (hasAutoScrolledRef.current) return;
    hasAutoScrolledRef.current = true;
    scrollRef.current?.scrollTo({ y: chapterStartY[defaultViewChapter] ?? 0, animated: false });
  };

  const activePersona = personas.find((p) => p.chapterNumber === activeChapterNumber);

  const handlePressLevel = (levelId: string) => {
    if (resolveStatus(levelId) === 'locked') {
      showAlert('Chưa mở khoá', 'Hoàn thành các bài trước đó (hoặc dùng "Học vượt") để mở khoá bài này.');
      return;
    }
    navigate('quiz', { levelId });
  };

  // Danh sách con PHẲNG [divider, block, ...] cho từng chặng — "Học vượt"
  // giờ nằm BÊN TRONG ChapterBlock (ngay trước level 1), không còn là 1 item
  // riêng ở đây nữa. Banner "Chặng N" cũng KHÔNG nằm trong danh sách này, nó
  // là 1 overlay riêng đè cố định lên trên (xem JSX bên dưới).
  const children: ReactElement[] = [];

  chapterOrder.forEach((chapterNum) => {
    const persona = personas.find((p) => p.chapterNumber === chapterNum);
    children.push(
      <View key={`divider-${chapterNum}`} style={[styles.chapterDivider, { height: CHAPTER_DIVIDER_HEIGHT }]}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText} numberOfLines={1}>
          {persona?.name ?? ''}
        </Text>
        <View style={styles.dividerLine} />
      </View>
    );
    children.push(
      <ChapterBlock
        key={`block-${chapterNum}`}
        chapterNumber={chapterNum}
        laneWidth={laneWidth}
        onLaneWidthChange={handleLaneWidthChange}
        resolveStatus={resolveStatus}
        onPressLevel={handlePressLevel}
      />
    );
    // Ngay SAU level 1 của chặng N (đứng trên) — ranh giới giữa chặng N và
    // chặng liền trước còn hiển thị (đứng dưới) — ẩn hẳn nếu đã học/vượt
    // qua tới đó rồi.
    const prevChapter = prevVisibleChapter(chapterNum);
    const skipTargetLevelId = prevChapter !== undefined ? lastLevelIdOfChapter(prevChapter) : undefined;
    if (shouldShowSkipAhead(chapterNum) && skipTargetLevelId) {
      children.push(
        <SkipAheadButton
          key={`skip-${chapterNum}`}
          onPress={() => navigate('skipAheadIntro', { levelId: skipTargetLevelId })}
        />
      );
    }
  });

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <MapHeader
        title="Hành trình học tập"
        streakDays={profile.currentStreak}
        onBack={() => navigate('home')}
      />

      <LinearGradient
        colors={[colors.mapBackgroundStart, colors.mapBackgroundEnd]}
        style={styles.gradientFlex}
      >
        {!levelProgress ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.content}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            >
              <View onLayout={handleContentLayout}>{children}</View>
            </ScrollView>

            <View style={styles.stickyOverlay} pointerEvents="none">
              <CurrentLevelBanner chapterNumber={activeChapterNumber} personaName={activePersona?.name} />
            </View>
          </>
        )}
      </LinearGradient>

      <BottomNavBar
        active="map"
        onPressItem={(key) => {
          if (key === 'home') navigate('home');
          if (key === 'practice') navigate('practice');
          if (key === 'xephang') navigate('leaderboard');
          if (key === 'ontap') navigate('practiceHistory');
          if (key === 'toi') navigate('profile');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  gradientFlex: { flex: 1, position: 'relative' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    paddingTop: STICKY_BANNER_HEIGHT,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  stickyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: STICKY_BANNER_HEIGHT,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  chapterDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E3D5CC' },
  dividerText: { fontFamily: fontFamily.semiBold, fontSize: 14, color: colors.textMuted },
  chapterBlock: {
    position: 'relative',
    marginTop: CHAPTER_BLOCK_MARGIN_TOP,
    marginBottom: CHAPTER_BLOCK_MARGIN_BOTTOM,
  },
  skipAheadRow: { height: SKIP_AHEAD_BLOCK_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  skipAheadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    ...cardShadow,
  },
  skipAheadPillText: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.primary },
});

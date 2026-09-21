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
import { Ionicons } from '@expo/vector-icons';
import {
  MapHeader,
  CurrentLevelBanner,
  MapLevelRow,
  MapPathLine,
  RoadDecorCluster,
  CLUSTER_HEIGHT,
  HomeBottomNavBar,
  computeMapNodeCenters,
  MAP_ROW_PITCH,
  MAP_NODE_LABEL_HEIGHT,
  MAP_NODE_LABEL_GAP,
  MAP_NODE_CIRCLE_HEIGHT,
  colors2,
  fontFamily2,
  radii2,
  spacing2,
} from '../components';
import { levels, personas, getLevelsByChapter, getProductById, getPositionInChapter, isLevelVisible } from '../data';
import type { LevelStatus } from '../data/types';
import { fetchMyLevelProgress } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { showAlert } from '../lib/platformAlert';
import { useAppNavigation } from '../navigation/NavigationContext';

const INITIAL_LANE_WIDTH = Dimensions.get('window').width - spacing2.md * 2;
// Chặng cao nhất trên cùng, chặng thấp nhất dưới cùng — cùng chiều với thứ
// tự level trong 1 chặng (level cao hơn ở trên). Danh sách chặng CÒN HIỂN
// THỊ (bỏ chặng bị admin ẩn qua "Quản trị hành trình & tri thức") được tính
// động trong MapScreen (biến chapterOrder) thay vì hardcode [5,4,3,2,1] —
// xem chapterOrder/defaultViewChapter bên dưới.
// Banner "Chặng N" giờ nằm HẲN trong phần header cố định (không cuộn) thay
// vì đè overlay lên ScrollView như trước — tránh hiện tượng che nội dung
// scroll bên dưới lúc kéo (phần trong suốt quanh overlay từng lộ ra node
// bên dưới). Nội dung banner vẫn đổi theo scroll qua state activeChapterNumber.
const CHAPTER_DIVIDER_HEIGHT = 44;
const CHAPTER_BLOCK_MARGIN_TOP = spacing2.md;
const CHAPTER_BLOCK_MARGIN_BOTTOM = spacing2.lg;
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

// Đệm nhỏ phía trên node "2 hàng trước level đang học" khi tự cuộn vào màn
// (xem SCROLL_TOP_PADDING trong handleContentLayout) — để label của node đó
// không dính sát mép trên viewport.
const SCROLL_TOP_PADDING = 24;
// computeMapNodeCenters trả toạ độ Y là TÂM vòng tròn — quy đổi ngược về mép
// TRÊN của cả cột (nhãn "Level N" + khoảng cách + vòng tròn) để canh đúng
// mép viewport khi tự cuộn (xem handleContentLayout).
const NODE_COL_TOP_OFFSET = MAP_NODE_LABEL_HEIGHT + MAP_NODE_LABEL_GAP + MAP_NODE_CIRCLE_HEIGHT / 2;

/** Toạ độ Y TUYỆT ĐỐI (trong nội dung cuộn) của 1 node level cụ thể — dùng
 * để tự cuộn vào đúng vị trí "level đang học nằm ở hàng thứ 3" lúc mở màn
 * (xem handleContentLayout). Không phụ thuộc laneWidth (toạ độ Y trong
 * computeMapNodeCenters không dùng tới nó) nên truyền 0 cũng cho kết quả
 * đúng. Trả về undefined nếu không tìm thấy (level bị ẩn, chặng không còn
 * hiển thị...). */
function getLevelNodeGlobalY(
  levelId: string,
  chapterNumber: number,
  resolveStatus: (levelId: string) => LevelStatus,
  chapterStartY: Record<number, number>
): number | undefined {
  const chapterStart = chapterStartY[chapterNumber];
  if (chapterStart === undefined) return undefined;
  const { displayLevels, statuses } = getChapterStatuses(chapterNumber, resolveStatus);
  const idx = displayLevels.findIndex((l) => l.id === levelId);
  if (idx === -1) return undefined;
  const { points } = computeMapNodeCenters(statuses, 0);
  return chapterStart + CHAPTER_DIVIDER_HEIGHT + CHAPTER_BLOCK_MARGIN_TOP + points[idx].y;
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
      {/* Trang trí ven đường (bụi cây + xe đồ chơi) — 1 cụm mỗi hàng, đặt ở
          làn ĐỐI DIỆN với node hàng đó (node bên phải -> cụm lấp bên trái và
          ngược lại), đúng nhịp xen kẽ như Figma (node-id=76-5842). Xoay vòng
          3 kiểu xe theo index cho đỡ lặp. */}
      {points.map((point, index) => {
        const isRight = index % 2 === 0;
        return (
          <RoadDecorCluster
            key={`decor-${index}`}
            variant={index % 3}
            flipX={isRight}
            style={
              isRight
                ? { position: 'absolute', left: 0, top: point.y - CLUSTER_HEIGHT / 2 }
                : { position: 'absolute', right: 0, top: point.y - CLUSTER_HEIGHT / 2 }
            }
          />
        );
      })}
      {displayLevels.map((level, index) => {
        const product = getProductById(level.productId);
        if (!product) return null;
        return (
          <MapLevelRow
            key={level.id}
            status={statuses[index]}
            positionInChapter={getPositionInChapter(level.id)}
            offsetIndex={index}
            laneWidth={laneWidth}
            isLast={index === displayLevels.length - 1}
            onPressStart={() => onPressLevel(level.id)}
          />
        );
      })}
    </View>
  );
}

// Chỉ 1 nút nhỏ, căn giữa — icon tia sét + "Học vượt", không mô tả thêm.
// Figma không thiết kế riêng nút này (chỉ 1 chặng, chưa cần học vượt) —
// dùng lại đúng ngôn ngữ pill tối màu như nút "Chi tiết" ở Home.
function SkipAheadButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.skipAheadRow}>
      <Pressable style={styles.skipAheadPill} onPress={onPress}>
        <Ionicons name="flash" size={16} color={colors2.yellow} />
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
  // Thứ tự tiến độ THẬT (tăng dần theo id) — khác chapterOrder (chỉ để
  // hiển thị chặng cao nhất trên cùng), dùng để suy level "hiện tại" (bước
  // tiếp theo). Chỉ tính trên level CÒN HIỂN THỊ — level bị ẩn không được
  // tính vào chuỗi khoá tuần tự (không chặn tiến độ vì 1 bài không ai thấy).
  const orderedLevelIds = useMemo(() => levels.filter(isLevelVisible).map((l) => l.id).sort(), []);
  const firstIncompleteLevelId = useMemo(
    () => orderedLevelIds.find((id) => !completedLevelIds.has(id)),
    [orderedLevelIds, completedLevelIds]
  );
  // Chặng ban đầu hiện trên banner cố định — khớp với chặng mà
  // handleContentLayout sắp tự cuộn tới (chặng chứa level đang học; đã học
  // hết thì mặc định chặng cao nhất) để banner không "nháy" sai chặng trước
  // khi sự kiện scroll đầu tiên bắn ra.
  const currentLevelChapterNumber = firstIncompleteLevelId
    ? levels.find((l) => l.id === firstIncompleteLevelId)?.chapterNumber
    : undefined;
  const initialActiveChapter = currentLevelChapterNumber ?? chapterOrder[0] ?? 1;

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

  const [activeChapterNumber, setActiveChapterNumber] = useState(initialActiveChapter);

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

  // Vào màn tự cuộn tới đúng vị trí "đang học dở" thay vì luôn về 1 điểm cố
  // định — 1 màn hình xem trọn được 4 level, nên canh sao cho level đang
  // học (firstIncompleteLevelId) nằm ở hàng thứ 3 từ trên xuống: 2 hàng
  // TRÊN nó (chưa học, level/chặng cao hơn) + chính nó + 1 hàng DƯỚI nó (đã
  // học). Không tự set giới hạn trên/dưới — nhờ ScrollView tự kẹp giá trị
  // scrollTo vào [0, max] hộ:
  //  - Chưa học gì (level đang học = level 1 chặng 1, node CUỐI CÙNG/thấp
  //    nhất của toàn bộ hành trình): trừ đi 2 hàng sẽ ra 1 số vượt quá đáy
  //    nội dung -> tự kẹp về đáy -> level 1 nằm dưới cùng, thấy đủ 4 level
  //    đầu (đúng yêu cầu, không cần case riêng).
  //  - Đã học hết (không còn level nào "đang học"): không có node để canh
  //    giữa -> cuộn thẳng lên đỉnh (chặng cao nhất), tự nhiên khớp bằng 0.
  const handleContentLayout = () => {
    if (hasAutoScrolledRef.current) return;
    hasAutoScrolledRef.current = true;

    // Tính lại "chặng đang học" NGAY LÚC NÀY (không dùng initialActiveChapter
    // tính lúc mount — khi đó tiến độ thật (levelProgress) có thể chưa tải
    // xong nên firstIncompleteLevelId lúc đó chưa chắc đúng) rồi set thẳng
    // cho banner — không trông chờ vào sự kiện scroll đầu tiên để tự sửa,
    // vì nếu target vừa hay trùng đúng vị trí đang đứng (vd 0), ScrollView
    // không bắn onScroll (không có gì thay đổi) nên banner sẽ kẹt sai chặng.
    let targetY = 0;
    let targetChapter = chapterOrder[0] ?? 1;
    if (firstIncompleteLevelId) {
      const currentLevel = levels.find((l) => l.id === firstIncompleteLevelId);
      if (currentLevel) {
        targetChapter = currentLevel.chapterNumber;
        const nodeY = getLevelNodeGlobalY(currentLevel.id, currentLevel.chapterNumber, resolveStatus, chapterStartY);
        if (nodeY !== undefined) {
          targetY = Math.max(0, nodeY - 2 * MAP_ROW_PITCH - NODE_COL_TOP_OFFSET - SCROLL_TOP_PADDING);
        }
      }
    }
    setActiveChapterNumber(targetChapter);
    scrollRef.current?.scrollTo({ y: targetY, animated: false });
  };

  const activePersona = personas.find((p) => p.chapterNumber === activeChapterNumber);

  const handlePressLevel = (levelId: string) => {
    if (resolveStatus(levelId) === 'locked') {
      showAlert('Chưa mở khoá', 'Hoàn thành các bài trước đó (hoặc dùng "Học vượt") để mở khoá bài này.');
      return;
    }
    navigate('quiz', { levelId, backTo: 'map' });
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
      {/* Banner "Chặng N" thuộc HẲN phần header cố định (không cuộn) — nền
          xanh liền với header, không còn là overlay trong suốt đè lên
          ScrollView (từng lộ node bên dưới lúc kéo qua vùng trong suốt
          quanh banner). */}
      <View style={styles.header}>
        <MapHeader title="Hành trình bứt phá" />
        <View style={styles.bannerWrap}>
          <CurrentLevelBanner chapterNumber={activeChapterNumber} personaName={activePersona?.name} />
        </View>
      </View>

      <View style={styles.body}>
        {!levelProgress ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors2.white} />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <View onLayout={handleContentLayout}>{children}</View>
          </ScrollView>
        )}
      </View>

      <HomeBottomNavBar
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
  safe: { flex: 1, backgroundColor: colors2.black },
  header: { backgroundColor: colors2.black },
  bannerWrap: { paddingHorizontal: spacing2.md, paddingBottom: spacing2.md },
  body: { flex: 1, position: 'relative' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: {
    paddingTop: spacing2.md,
    paddingHorizontal: spacing2.md,
    paddingBottom: spacing2.md,
  },
  chapterDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors2.navBorder, opacity: 0.4 },
  dividerText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.whiteMuted },
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
    backgroundColor: colors2.black,
    borderRadius: radii2.pill,
    paddingHorizontal: spacing2.md,
    paddingVertical: 10,
  },
  skipAheadPillText: { fontFamily: fontFamily2.semiBold, fontSize: 13, color: colors2.yellow },
});

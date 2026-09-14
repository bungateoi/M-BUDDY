import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import {
  QuizTopBar,
  CountdownRing,
  RolePlayCustomerAvatar,
  RolePlayControls,
  RolePlayTipCard,
  colors2,
  fontFamily2,
  spacing2,
} from '../components';
import { PhoneCallIcon } from '../components/icons2';
import {
  getLevelById,
  getPersonaById,
  getProductById,
  getPositionInChapter,
  getRoleplayCustomerByLevelId,
  getRoleplayAvatarSource,
  getCustomerProfileById,
  getCustomerRoleplayConfig,
} from '../data';
import type { CustomerDifficulty, GeneratedCustomerPersona, RoleplayCustomer, RoleplayResult } from '../data/types';
import { buildRoleplayResultFromScoring } from '../data/scoringMapper';
import {
  callRoleplayAI,
  callScoringAI,
  type RoleplayLevelInput,
  type RoleplayPersonaInput,
  type RoleplayProductInput,
  type RoleplayTurn,
} from '../lib/ai';
import { applySkillScores, recordActivity, recordLevelProgress, saveRoleplayHistory } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { getVoiceProfile } from '../lib/voiceProfiles';
import { useAppNavigation, type NavigationParams } from '../navigation/NavigationContext';

// Level chưa có field thời lượng cuộc gọi riêng trong data model — dùng
// hằng số chung, khớp giá trị mặc định roleplayDurationSec=150 ở backend
// (agent/main.py, xem SPEC.md). Nếu sau này cần thời lượng riêng theo
// từng level, thêm field vào Level (data/types.ts) và dùng ở đây.
const CALL_DURATION_SECONDS = 150;

type CallPhase = 'connecting' | 'speaking' | 'idle' | 'recording' | 'thinking' | 'ending';

const STATUS_TEXT: Record<CallPhase, string> = {
  connecting: 'Đang kết nối...',
  speaking: 'Khách đang nói...',
  idle: 'Bấm để bắt đầu nói',
  recording: 'Đang nghe bạn...',
  thinking: 'Khách đang trả lời...',
  // Hết giờ hoặc khách chủ động cúp máy -> đang chấm điểm + lưu kết quả,
  // KHÔNG còn ai "nói"/"trả lời" nữa — tránh gây hiểu lầm là cuộc gọi vẫn
  // đang tiếp diễn (xem phản hồi người dùng).
  ending: 'Đang xử lý kết quả...',
};

const MIC_LABEL: Record<CallPhase, string> = {
  connecting: 'Đang kết nối',
  speaking: 'Khách đang nói',
  idle: 'Bấm để bắt đầu nói',
  recording: 'Bấm để dừng ghi âm',
  thinking: 'Đang xử lý',
  ending: 'Đang xử lý',
};

// Nguồn dữ liệu cho 1 buổi role-play — 2 nguồn khả dĩ, loại trừ lẫn nhau:
// (1) 1 level cố định trong Map (persona/product/level đã hand-author sẵn),
// (2) 1 hồ sơ khách hàng thật ở màn Practice (persona/level dựng từ
// customerProfiles.ts + customerRoleplayConfigs.ts, sinh sẵn bởi
// scripts/generateCustomerRoleplayConfigs.mts). Cả 2 đều gọi đúng cùng 1
// backend /roleplay, /score (xem lib/ai.ts) nên chỉ cần quy về 1 shape
// chung là dùng lại được toàn bộ phần còn lại của màn hình.
interface RoleplaySetup {
  persona: RoleplayPersonaInput;
  product: RoleplayProductInput;
  level: RoleplayLevelInput;
  customer: RoleplayCustomer;
  titleLine: string;
  tip: string;
  resultParams: NavigationParams;
  /** Khớp key trong voiceProfiles.RATE_BY_PERSONA_ID nếu có (persona cố định
   * trong Map) — nếu không, dùng voiceDifficultyFallback để suy tốc độ nói. */
  voicePersonaKey: string;
  voiceDifficultyFallback?: CustomerDifficulty;
}

function buildMapSetup(levelId: string): RoleplaySetup | undefined {
  const level = getLevelById(levelId);
  const persona = level ? getPersonaById(level.personaId) : undefined;
  const product = level ? getProductById(level.productId) : undefined;
  const customer = getRoleplayCustomerByLevelId(levelId);
  if (!level || !persona || !product || !customer) return undefined;
  return {
    persona,
    product,
    level,
    customer,
    titleLine: `Chặng ${level.chapterNumber} • Level ${getPositionInChapter(level.id)}`,
    tip: level.sampleFlow[0],
    resultParams: { levelId },
    voicePersonaKey: persona.id,
  };
}

function avatarKeyForGenerated(age: number, gender: 'Nam' | 'Nữ'): string {
  if (age < 35) return gender === 'Nữ' ? 'nu-tre' : 'nam-tre';
  if (age < 55) return gender === 'Nữ' ? 'adult-women' : 'adult-men';
  return gender === 'Nữ' ? 'old-women' : 'old-men';
}

function displayNameForGenerated(name: string, age: number, gender: 'Nam' | 'Nữ'): string {
  const given = name.trim().split(/\s+/).slice(-1)[0] ?? name;
  const honorific = age >= 55 ? (gender === 'Nữ' ? 'Cô' : 'Chú') : gender === 'Nữ' ? 'Chị' : 'Anh';
  return `${honorific} ${given}`;
}

function buildGeneratedSetup(g: GeneratedCustomerPersona): RoleplaySetup {
  return {
    persona: {
      name: g.name,
      criteria: {
        age: `${g.age} tuổi`,
        occupation: g.occupation,
        incomeLevel: g.incomeText,
        needs: g.needs,
        painPoints: g.painPoints,
        expectations: g.expectations,
        barriers: g.barrier,
      },
      behaviorNote: g.behaviorNote,
    },
    product: g.product,
    level: { winCriteria: g.winCriteria, objectionBank: g.objectionBank },
    customer: { name: displayNameForGenerated(g.name, g.age, g.gender), avatarKey: avatarKeyForGenerated(g.age, g.gender) },
    titleLine: 'Luyện tập',
    tip: `Khách kỳ vọng: ${g.expectations}`,
    resultParams: { generatedCustomer: g },
    voicePersonaKey: `generated-${g.name}`,
    voiceDifficultyFallback: g.difficulty,
  };
}

function buildPracticeSetup(customerId: string): RoleplaySetup | undefined {
  const profile = getCustomerProfileById(customerId);
  const config = getCustomerRoleplayConfig(customerId);
  if (!profile || !config) return undefined;
  return {
    persona: {
      name: profile.name,
      criteria: {
        age: `${profile.age} tuổi`,
        occupation: profile.occupation,
        incomeLevel: profile.incomeText,
        needs: profile.needs,
        painPoints: profile.painPoints,
        expectations: profile.expectations,
        barriers: profile.barrier,
      },
      behaviorNote: config.behaviorNote,
    },
    product: config.product,
    level: { winCriteria: config.winCriteria, objectionBank: config.objectionBank },
    customer: { name: profile.displayName, avatarKey: profile.avatarKey },
    titleLine: 'Luyện tập',
    tip: `Khách kỳ vọng: ${profile.expectations}`,
    resultParams: { practiceCustomerId: customerId },
    // Không khớp bất kỳ persona.id cố định nào trong voiceProfiles.ts —
    // luôn rơi vào nhánh fallback theo độ khó, xem getVoiceProfile.
    voicePersonaKey: `practice-${profile.id}`,
    voiceDifficultyFallback: profile.difficulty,
  };
}

// Dựng entry lưu vào roleplay_history (màn "Ôn tập") — CHỈ cho level Map
// hoặc hồ sơ Practice thật, KHÔNG lưu buổi luyện với khách hàng tự tạo theo
// tiêu chí (generatedCustomer, không có levelId/practiceCustomerId) — trả
// undefined ở case đó để finishCall biết bỏ qua, không gọi saveRoleplayHistory.
function buildHistoryEntry(
  levelId: string | undefined,
  practiceCustomerId: string | undefined,
  roleplayResult: RoleplayResult
): Parameters<typeof saveRoleplayHistory>[0] | undefined {
  const skillScores = Object.fromEntries(roleplayResult.criteria.map((c) => [c.key, c.score]));

  if (levelId) {
    const level = getLevelById(levelId);
    const persona = level ? getPersonaById(level.personaId) : undefined;
    const product = level ? getProductById(level.productId) : undefined;
    if (!level || !persona || !product) return undefined;
    return {
      source: 'map',
      levelId,
      titleLine: `Chặng ${level.chapterNumber} – Level ${getPositionInChapter(level.id)}`,
      subtitleLine: `${persona.name} – ${product.shortName ?? product.name}`,
      totalScore: roleplayResult.totalScore,
      skillScores,
      result: roleplayResult,
    };
  }

  if (practiceCustomerId) {
    const profile = getCustomerProfileById(practiceCustomerId);
    if (!profile) return undefined;
    return {
      source: 'practice',
      practiceCustomerId,
      titleLine: 'Practice',
      subtitleLine: profile.name,
      totalScore: roleplayResult.totalScore,
      skillScores,
      result: roleplayResult,
    };
  }

  return undefined;
}

export function RolePlayScreen({
  levelId,
  practiceCustomerId,
  generatedCustomer,
  isSkipAhead,
}: {
  levelId?: string;
  practiceCustomerId?: string;
  generatedCustomer?: GeneratedCustomerPersona;
  /** true nếu vào level này qua nút "Học vượt" ở Map — xem finishCall. */
  isSkipAhead?: boolean;
}) {
  const { navigate } = useAppNavigation();
  const { profile: authProfile, refreshProfile } = useAuth();
  const setup = levelId
    ? buildMapSetup(levelId)
    : practiceCustomerId
      ? buildPracticeSetup(practiceCustomerId)
      : generatedCustomer
        ? buildGeneratedSetup(generatedCustomer)
        : undefined;

  const [phase, setPhase] = useState<CallPhase>('connecting');
  const [history, setHistory] = useState<RoleplayTurn[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(CALL_DURATION_SECONDS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Trên web di động (Safari/Chrome Android), speechSynthesis chỉ được phép
  // phát nếu lần gọi ĐẦU TIÊN nằm trong đúng thao tác chạm của người dùng —
  // cuộc gọi trước đây tự bắt đầu qua useEffect (không phải thao tác chạm)
  // nên khách không phát được tiếng gì trên điện thoại. Chặn lại bằng 1 nút
  // "Chạm để bắt đầu", "mở khoá" âm thanh ngay trong handler chạm đó. Native
  // (app thật) dùng TTS hệ điều hành, không bị giới hạn này nên bỏ qua bước chờ.
  const [awaitingTapToStart, setAwaitingTapToStart] = useState(Platform.OS === 'web');
  // "Mẹo cho bạn" mặc định ẩn — chỉ hiện khi bấm nút "Gợi ý", tránh chiếm
  // diện tích màn hình lúc đang gọi.
  const [showTip, setShowTip] = useState(false);

  // Refs mirror state đang đổi liên tục — cần cho callback của event
  // listener native (expo-speech-recognition) và timer, tránh stale closure.
  const historyRef = useRef<RoleplayTurn[]>([]);
  const secondsLeftRef = useRef(CALL_DURATION_SECONDS);
  const callEndedRef = useRef(false);
  const hasStartedRef = useRef(false);
  // continuous:true chia lời nói thành nhiều "segment" — mỗi 'result'
  // isFinal:true chỉ chứa ĐOẠN MỚI, không phải toàn bộ câu từ đầu, nên phải
  // tự gộp dần vào finalTranscriptRef (xem README của expo-speech-recognition,
  // mục "Continuous recognition"). transcriptRef là bản "tốt nhất hiện có"
  // (final đã gộp + interim đang nói dở) để dùng ngay khi 'end' bắn ra.
  const finalTranscriptRef = useRef('');
  const transcriptRef = useRef('');
  // true từ lúc bắt đầu ghi âm tới khi lượt ghi âm được "tiêu thụ" (bởi
  // 'end' hoặc bởi grace-timeout trong handleMicPress, xem bên dưới) — đảm
  // bảo chỉ submit đúng 1 lần dù đường nào tới trước. Cần cả 2 đường vì trên
  // web (Chrome), stop() ở chế độ continuous đôi khi không kịp bắn 'end' kèm
  // kết quả cuối trước khi người dùng đã bấm dừng từ lâu.
  const recordingSessionActiveRef = useRef(false);
  // true từ lúc bấm "Bắt đầu nói" (đang xin quyền micro, `await`) cho tới
  // khi ghi âm thật sự start() xong — chặn bấm đúp trong khoảng hở đó (phase
  // vẫn còn 'idle' vì setPhase('recording') chỉ chạy SAU khi quyền đã có),
  // tránh gọi start() 2 lần chồng nhau nếu người dùng bấm liên tiếp rất
  // nhanh trong lúc đang chờ quyền.
  const micBusyRef = useRef(false);
  // 2 timer của lượt speak() hiện tại (xem hàm speak bên dưới) — giữ lại để
  // hủy được khi có lượt speak() mới đè lên, hoặc khi cuộc gọi kết thúc/màn
  // unmount giữa chừng, tránh 1 callback trễ gọi nhầm vào state đã cũ.
  const speakTimersRef = useRef<{ start?: ReturnType<typeof setTimeout>; watchdog?: ReturnType<typeof setTimeout> }>(
    {}
  );

  useEffect(() => {
    historyRef.current = history;
  }, [history]);
  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  // Giọng đọc khớp với vai — pitch theo tuổi/giới tính (avatarKey), rate
  // theo tính cách persona (behaviorNote) hoặc độ khó hồ sơ khách hàng thật,
  // xem lib/voiceProfiles.ts.
  const voiceProfile = setup
    ? getVoiceProfile(setup.customer.avatarKey as any, setup.voicePersonaKey, setup.voiceDifficultyFallback)
    : undefined;

  // ĐÃ THỬ pause()/resume() định kỳ để chống bug "khựng giữa chừng" của
  // speechSynthesis trên Chrome nhưng không hiệu quả — bug người dùng gặp
  // (mất hẳn 1 đoạn nội dung, không phải một khoảng lặng ở ranh giới câu)
  // xảy ra quá sớm/quá thất thường để watchdog theo chu kỳ bắt kịp, và bản
  // thân pause()/resume() trên Chrome cũng có bug làm rớt nội dung khi
  // resume. Đây là giới hạn thật của Web Speech API trên trình duyệt, không
  // sửa được triệt để bằng JS — giải pháp bền là chuyển sang TTS cloud trả
  // về file audio thật (xem trao đổi với người dùng).
  //
  // 2 mitigation thêm ở đây cho đúng triệu chứng "hiện đang nói mà không
  // nghe thấy gì, hoặc 1 lúc sau mới nghe":
  // 1) Delay ngắn giữa stop() và speak() mới — gọi speak() ngay sát sau
  //    stop() liên tiếp là 1 bug đã biết của Chrome/Safari khiến utterance
  //    mới bị bỏ qua HOÀN TOÀN trong im lặng (không lỗi, không callback).
  // 2) Watchdog theo thời lượng đọc ước tính — nếu speechSynthesis lặng
  //    thinh không bắn callback nào (đúng bug trên), cuộc gọi trước đây sẽ
  //    treo vô thời hạn chờ onDone không bao giờ tới; giờ tự ép kết thúc
  //    lượt nói sau khoảng thời gian hợp lý để cuộc gọi luôn tiếp tục được.
  const clearSpeakTimers = () => {
    if (speakTimersRef.current.start) clearTimeout(speakTimersRef.current.start);
    if (speakTimersRef.current.watchdog) clearTimeout(speakTimersRef.current.watchdog);
    speakTimersRef.current = {};
  };

  const speak = (text: string, onDone: () => void) => {
    Speech.stop();
    clearSpeakTimers();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearSpeakTimers();
      onDone();
    };

    const rate = voiceProfile?.rate ?? 1;
    const estimatedMs = Math.min(20000, Math.max(2500, (text.length / 12 / rate) * 1000 + 2500));
    speakTimersRef.current.watchdog = setTimeout(finish, estimatedMs);

    speakTimersRef.current.start = setTimeout(() => {
      Speech.speak(text, {
        language: 'vi-VN',
        pitch: voiceProfile?.pitch,
        rate: voiceProfile?.rate,
        onDone: finish,
        onStopped: finish,
        onError: finish,
      });
    }, 80);
  };

  const finishCall = async (finalHistory: RoleplayTurn[]) => {
    if (callEndedRef.current) return;
    callEndedRef.current = true;
    Speech.stop();
    clearSpeakTimers();
    ExpoSpeechRecognitionModule.stop();
    setPhase('ending');

    if (!setup) {
      navigate('result', {});
      return;
    }
    try {
      const scoring = await callScoringAI({ product: setup.product, transcript: finalHistory });
      const roleplayResult = buildRoleplayResultFromScoring(
        levelId ?? practiceCustomerId ?? generatedCustomer?.name ?? '',
        scoring,
        finalHistory
      );

      // Ghi lại streak + trộn điểm kỹ năng/XP thật + tiến độ Map (nếu đây là
      // 1 level Map, không áp dụng cho Practice/generated) cho user hiện tại
      // — lỗi ở đây (mạng, chưa đăng nhập...) không được chặn màn Kết quả,
      // chỉ đơn giản là Home/Xếp hạng/Team/Map sẽ chưa cập nhật lần luyện này.
      try {
        const tasks = [recordActivity(), applySkillScores(scoring, roleplayResult.totalScore)];
        if (levelId) tasks.push(recordLevelProgress(levelId, roleplayResult.totalScore, isSkipAhead ?? false));
        const historyEntry = buildHistoryEntry(levelId, practiceCustomerId, roleplayResult);
        if (historyEntry) tasks.push(saveRoleplayHistory(historyEntry));
        await Promise.all(tasks);
        await refreshProfile();
      } catch {
        // im lặng bỏ qua — không phải lỗi người dùng cần xử lý ngay.
      }

      // Học vượt đạt >=60% -> ngưỡng khớp đúng RPC record_level_progress (xem
      // migration) -> tự tính ở client để hiện banner chúc mừng ở màn Kết
      // quả, không cần đợi RPC trả về gì.
      const unlockedChaptersUpTo =
        isSkipAhead && levelId && roleplayResult.totalScore >= 60 ? Number(levelId.split('.')[0]) : undefined;

      navigate('result', { ...setup.resultParams, roleplayResult, unlockedChaptersUpTo });
    } catch {
      // Chấm điểm lỗi mạng — vẫn cho qua màn Kết quả (fallback mock) thay vì kẹt lại đây.
      navigate('result', setup.resultParams);
    }
  };

  const submitTurn = async (sellerText: string) => {
    if (callEndedRef.current || !setup) return;
    // Lượt mở đầu (chưa ai nói gì) dùng đúng text "Đang kết nối..." thay vì
    // "Khách đang trả lời..." — lúc này chưa có hội thoại nào để "trả lời"
    // cả, chỉ là đang chờ khách bắt máy/mở lời lần đầu (xem phản hồi người dùng).
    setPhase(sellerText.trim() ? 'thinking' : 'connecting');
    setErrorMessage(null);
    try {
      const result = await callRoleplayAI({
        persona: setup.persona,
        product: setup.product,
        level: setup.level,
        roleplayDurationSec: CALL_DURATION_SECONDS,
        secondsElapsed: CALL_DURATION_SECONDS - secondsLeftRef.current,
        history: historyRef.current,
        sellerUtterance: sellerText,
      });

      // Cuộc gọi có thể đã kết thúc (hết giờ, hoặc khách cúp máy ở lượt
      // trước) TRONG LÚC đang chờ phản hồi này — finishCall() đã tự chuyển
      // phase sang 'ending' và bắt đầu chấm điểm; 1 phản hồi tới trễ ở đây
      // không được phép ghi đè lại phase/history hay phát TTS nữa (bug đã
      // gặp: hết giờ giữa lúc đang chờ AI trả lời vẫn thấy UI "sống lại").
      if (callEndedRef.current) return;

      const trimmed = sellerText.trim();
      const newTurns: RoleplayTurn[] = trimmed
        ? [
            { role: 'seller', text: trimmed },
            { role: 'customer', text: result.customerReply },
          ]
        : [{ role: 'customer', text: result.customerReply }];
      const updatedHistory = [...historyRef.current, ...newTurns];
      historyRef.current = updatedHistory;
      setHistory(updatedHistory);
      setPhase('speaking');

      speak(result.customerReply, () => {
        if (result.shouldEndCall) {
          finishCall(updatedHistory);
        } else if (!callEndedRef.current) {
          setPhase('idle');
        }
      });
    } catch {
      if (callEndedRef.current) return;
      setErrorMessage('Không kết nối được với khách hàng ảo. Giữ mic để thử lại.');
      setPhase('idle');
    }
  };

  // Mở đầu cuộc gọi — gọi 1 lần khi vào màn (hoặc khi người dùng chạm nút
  // "Bắt đầu" trên web, xem startCallOnWeb), sellerUtterance rỗng để AI tự
  // mở lời (xem SPEC.md). Guard bằng ref để tránh double-call do
  // StrictMode double-invoke effect ở dev.
  useEffect(() => {
    if (hasStartedRef.current || !setup || awaitingTapToStart) return;
    hasStartedRef.current = true;
    submitTurn('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setup, awaitingTapToStart]);

  // "Mở khoá" phát âm thanh trên trình duyệt di động — phải gọi Speech.speak
  // NGAY trong handler chạm này (đồng bộ, chưa qua await nào) để trình duyệt
  // tính đây là phát âm thanh do người dùng khởi tạo. Sau khi đã mở khoá 1
  // lần, các speak() gọi sau đó từ code async (trong submitTurn, sau khi có
  // phản hồi AI) mới phát được tiếng — nếu không, khách sẽ hoàn toàn im lặng.
  const startCallOnWeb = () => {
    if (hasStartedRef.current) return;
    Speech.stop();
    Speech.speak(' ', { onDone: () => {}, onError: () => {} });
    setAwaitingTapToStart(false);
  };

  // Đếm ngược — hết giờ mà chưa kết thúc thì tự động kết thúc cuộc gọi. Chờ
  // qua bước "Chạm để bắt đầu" trên web (nếu có) để không mất thời gian gọi
  // của người dùng trong lúc họ còn chưa bấm bắt đầu.
  useEffect(() => {
    if (callEndedRef.current || awaitingTapToStart) return;
    if (secondsLeft <= 0) {
      finishCall(historyRef.current);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, awaitingTapToStart]);

  // Dọn dẹp khi rời màn hình (back giữa chừng...).
  useEffect(() => {
    return () => {
      Speech.stop();
      clearSpeakTimers();
      ExpoSpeechRecognitionModule.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dùng chung cho cả 2 đường "tiêu thụ" kết quả ghi âm (xem
  // recordingSessionActiveRef ở trên) — chỉ chạy 1 lần cho mỗi lượt ghi âm.
  const consumeRecordingResult = () => {
    if (!recordingSessionActiveRef.current || callEndedRef.current) return;
    recordingSessionActiveRef.current = false;
    micBusyRef.current = false;
    const text = transcriptRef.current;
    transcriptRef.current = '';
    finalTranscriptRef.current = '';
    // Bấm dừng mà chưa nói được từ nào (bấm nhầm, dừng quá sớm...) — không
    // gửi turn rỗng lên AI (khiến nó phải tự bịa 1 câu không có gì để bám
    // vào), chỉ quay lại trạng thái chờ.
    if (!text.trim()) {
      setErrorMessage('Chưa nghe thấy gì, bấm để nói lại nhé.');
      setPhase('idle');
      return;
    }
    submitTurn(text);
  };

  useSpeechRecognitionEvent('result', (event) => {
    const chunk = event.results[0]?.transcript ?? '';
    if (event.isFinal) {
      finalTranscriptRef.current = `${finalTranscriptRef.current} ${chunk}`.trim();
      transcriptRef.current = finalTranscriptRef.current;
    } else {
      transcriptRef.current = `${finalTranscriptRef.current} ${chunk}`.trim();
    }
  });
  useSpeechRecognitionEvent('end', consumeRecordingResult);
  useSpeechRecognitionEvent('error', (event) => {
    if (phase !== 'recording') return;
    recordingSessionActiveRef.current = false;
    micBusyRef.current = false;
    setPhase('idle');
    if (event.error !== 'no-speech') {
      setErrorMessage('Không nghe rõ, bấm để nói lại nhé.');
    }
  });

  // Bấm-để-bật/tắt thay vì giữ-để-nói (trước đây press-in/press-out) — dễ
  // dùng hơn trên di động, không phụ thuộc việc giữ đúng ngón tay suốt câu
  // nói. Bấm lần 1 (đang 'idle') -> xin quyền micro + bắt đầu ghi âm; bấm
  // lần 2 (đang 'recording') -> dừng ghi âm, submit transcript đã ghi được.
  const handleMicPress = async () => {
    if (phase === 'recording') {
      ExpoSpeechRecognitionModule.stop();
      // Fallback cho trường hợp 'end' không bắn ra kịp kèm kết quả cuối (gặp
      // trên web/Chrome ở chế độ continuous) — chờ 1 nhịp ngắn cho kết quả
      // cuối kịp về rồi tự tiêu thụ, nếu 'end' chưa xử lý trước đó.
      setTimeout(consumeRecordingResult, 400);
      return;
    }
    if (phase !== 'idle' || micBusyRef.current) return;
    micBusyRef.current = true;
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      micBusyRef.current = false;
      setErrorMessage('Cần cấp quyền micro để luyện tập bằng giọng nói.');
      return;
    }
    transcriptRef.current = '';
    finalTranscriptRef.current = '';
    recordingSessionActiveRef.current = true;
    setErrorMessage(null);
    setPhase('recording');
    // continuous:true — nếu false, engine tự dừng sau ~3s im lặng (kể cả
    // khi người dùng còn chưa bấm dừng, chỉ ngừng nói để suy nghĩ), cắt cụt
    // câu giữa chừng. continuous:true giao quyền dừng hẳn cho người dùng
    // (bấm lần 2 -> handleMicPress -> stop()).
    ExpoSpeechRecognitionModule.start({ lang: 'vi-VN', interimResults: true, continuous: true });
  };

  if (!setup || !authProfile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Chưa có dữ liệu role-play.</Text>
          <Pressable onPress={() => navigate('home')} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Về Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <QuizTopBar title={setup.product.name} subtitle={setup.titleLine} onClose={() => navigate('home')} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.timerRow}>
          <CountdownRing secondsLeft={secondsLeft} totalSeconds={CALL_DURATION_SECONDS} />
        </View>

        <View style={styles.centerArea}>
          <RolePlayCustomerAvatar
            avatarSource={getRoleplayAvatarSource(setup.customer.avatarKey as any)}
            name={setup.customer.name}
            personaLabel={setup.persona.name}
            statusText={STATUS_TEXT[phase]}
          />
        </View>

        {errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {awaitingTapToStart ? (
          <Pressable onPress={startCallOnWeb} style={styles.startCallWrap}>
            <View style={styles.startCallBtn}>
              <PhoneCallIcon size={30} />
            </View>
            <Text style={styles.startCallText}>Chạm để bắt đầu cuộc gọi</Text>
            <Text style={styles.startCallHint}>Cần chạm 1 lần để điện thoại phát được tiếng khách</Text>
          </Pressable>
        ) : (
          <RolePlayControls
            isRecording={phase === 'recording'}
            micLabel={MIC_LABEL[phase]}
            micDisabled={phase !== 'idle' && phase !== 'recording'}
            hintActive={showTip}
            onMicPress={handleMicPress}
            onPressHint={() => setShowTip((v) => !v)}
            onPressEnd={() => finishCall(historyRef.current)}
          />
        )}

        {showTip && <RolePlayTipCard tip={setup.tip} />}
      </ScrollView>

      <View style={styles.homeIndicatorArea}>
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.black },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing2.md,
    paddingBottom: spacing2.xl,
    gap: spacing2.xl,
  },
  timerRow: { alignItems: 'flex-end' },
  centerArea: { alignItems: 'center' },
  errorBanner: {
    backgroundColor: colors2.red800,
    borderRadius: 12,
    paddingVertical: spacing2.sm,
    paddingHorizontal: spacing2.md,
  },
  errorText: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.red500, textAlign: 'center' },
  startCallWrap: { alignItems: 'center', gap: spacing2.sm },
  startCallBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors2.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startCallText: { fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.white },
  startCallHint: { fontFamily: fontFamily2.regular, fontSize: 12, color: colors2.whiteMuted, textAlign: 'center' },
  homeIndicatorArea: { height: 34, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  homeIndicator: { width: 134, height: 5, borderRadius: 100, backgroundColor: colors2.white },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing2.lg, padding: spacing2.xl },
  emptyText: { fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.white },
  emptyButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors2.white,
    paddingHorizontal: spacing2.lg,
    paddingVertical: spacing2.sm,
  },
  emptyButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 13, color: colors2.white },
});

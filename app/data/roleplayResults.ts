import type { RoleplayResult } from './types';

// Mock kết quả chấm điểm role-play — hiện chỉ có level "2.3" (Vay tiêu
// dùng, ải Nhân viên văn phòng trẻ), đúng level đang "current". Nội dung
// nhận xét bám theo bộ 6 tiêu chí trong sales-skill-scoring-rubric.md và
// văn phong gợi ý ở ai-prompts.md (strengths/improvements/next step).
//
// Thang điểm khớp với backend (agent/main.py ScoringOutput, xem SPEC.md):
// 6 tiêu chí ĐỘC LẬP, mỗi tiêu chí 0-100 (không cộng dồn thành 100 tổng).
// totalScore/maxTotalScore chỉ để hiển thị 1 số lớn ở đầu màn Kết quả —
// = trung bình cộng của 6 điểm trên, tính ở đây (không phải field backend trả về).
export const roleplayResultsByLevelId: Record<string, RoleplayResult> = {
  '2.3': {
    levelId: '2.3',
    totalScore: 72,
    maxTotalScore: 100,
    ratingLabel: 'Khá tốt',
    summary: 'Còn nhiều cơ hội để nâng cao khả năng khai thác nhu cầu và chốt bước tiếp theo.',
    criteria: [
      {
        key: 'customer_understanding',
        label: 'Hiểu khách hàng',
        icon: 'people',
        score: 75,
        maxScore: 100,
        feedback: 'Nắm được nhu cầu chính, nhưng chưa khai thác đủ bối cảnh trước khi tư vấn.',
      },
      {
        key: 'knowledge',
        label: 'Kiến thức sản phẩm',
        icon: 'reader',
        score: 82,
        maxScore: 100,
        feedback: 'Kiến thức khá tốt, còn lúng túng ở vài điều kiện chi tiết.',
      },
      {
        key: 'communication',
        label: 'Giao tiếp & thái độ',
        icon: 'happy',
        score: 90,
        maxScore: 100,
        feedback: 'Tự nhiên, lịch sự và tạo được cảm giác tin cậy.',
      },
      {
        key: 'objection_handling',
        label: 'Xử lý từ chối',
        icon: 'shield-checkmark',
        score: 65,
        maxScore: 100,
        feedback: 'Phản hồi tốt nhưng cần tìm hiểu sâu hơn lý do khách còn băn khoăn.',
      },
      {
        key: 'insight_discovery',
        label: 'Khai thác nhu cầu / Insight',
        icon: 'search',
        score: 55,
        maxScore: 100,
        feedback: 'Chuyển sang tư vấn hơi sớm, chưa khai thác đủ insight quan trọng.',
      },
      {
        key: 'closing',
        label: 'Kỹ năng chốt sale',
        icon: 'locate',
        score: 65,
        maxScore: 100,
        feedback: 'Đã dẫn dắt tốt nhưng chưa đưa ra bước tiếp theo đủ rõ ràng.',
      },
    ],
    insightSummary:
      'Bạn có nền tảng tốt về kiến thức sản phẩm và giao tiếp, đặc biệt là khả năng tạo cảm giác lịch sự và tin cậy với khách hàng. Tuy nhiên, bạn có xu hướng chuyển sang tư vấn khá sớm khi chưa khai thác đầy đủ nhu cầu và lý do thực sự phía sau sự do dự của khách.',
    insightTips: [
      {
        icon: '💡',
        text: 'Ở lần luyện tiếp theo, hãy ưu tiên đặt thêm câu hỏi mở để hiểu rõ mục tiêu, ưu tiên và rào cản của khách trước khi đề xuất giải pháp.',
      },
      {
        icon: '🎯',
        text: 'Khi khách từ chối, thử làm rõ nguyên nhân thay vì phản hồi ngay — điều này giúp bạn dẫn dắt hội thoại và chốt bước tiếp theo tự nhiên hơn.',
      },
    ],
  },
};

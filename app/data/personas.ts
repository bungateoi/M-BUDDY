import type { Persona } from './types';

// Nguồn: /docs/personas.md (đối chiếu thêm phần "Chân dung persona" /
// "Chiến thuật chung nên dùng" trong /docs/roleplay-scenarios.md) — SEED mặc
// định, xem comment tương tự ở đầu app/data/products.ts.
export let personas: Persona[] = [
  {
    id: 'noi-tro-tiet-kiem',
    chapterNumber: 1,
    name: 'Nội trợ tiết kiệm',
    starRating: 1,
    criteria: {
      age: '38–55 tuổi',
      occupation: 'Nội trợ, quản lý chi tiêu gia đình',
      incomeLevel: 'Thu nhập chồng + thu nhập phụ, ổn định ở mức trung bình',
      needs: 'Gửi tiết kiệm an toàn, sinh lời ổn định cho khoản tiền nhàn rỗi trong nhà',
      painPoints:
        'Sợ rủi ro mất tiền; không rành công nghệ tài chính, ngại thao tác app phức tạp',
      expectations: 'Giải thích rõ ràng, chậm rãi, dùng từ ngữ đơn giản, không thuật ngữ chuyên môn',
      barriers: 'Cần người thân/quen giới thiệu hoặc giải thích thật đơn giản mới yên tâm',
    },
    behaviorNote:
      'Dễ tính, ít phản bác gay gắt, nhưng hay hỏi lại nhiều lần cho chắc, cần được trấn an về độ an toàn.',
    generalTactic:
      'Nói chậm, ví dụ đời thường (so sánh với đi chợ, sổ tiết kiệm giấy...), trấn an an toàn trước khi nói lợi ích.',
    winCondition:
      'Khách đồng ý gửi tiết kiệm, hoặc ít nhất đồng ý thử thao tác app cùng nhân viên/hẹn quay lại.',
    recommendedProductId: 'tiet-kiem-online',
  },
  {
    id: 'nv-van-phong-tre',
    chapterNumber: 2,
    name: 'Nhân viên văn phòng trẻ',
    starRating: 2,
    criteria: {
      age: '24–32 tuổi',
      occupation: 'Nhân viên văn phòng',
      incomeLevel: 'Thu nhập ổn định',
      needs: 'Quản lý chi tiêu thông minh, tiện lợi, có ưu đãi khi mua sắm online',
      painPoints:
        'Không có nhiều thời gian; dễ mất kiên nhẫn nếu bị tư vấn lan man, không đúng trọng tâm',
      expectations:
        'Ngắn gọn, đúng trọng tâm, có thể thao tác hoàn tất ngay trên điện thoại trong cuộc gọi',
      barriers:
        'Đã quen dùng ví điện tử/thẻ ngân hàng khác, cần thấy lợi ích khác biệt rõ ràng ngay từ đầu',
    },
    behaviorNote:
      'Hỏi nhanh, đi thẳng vào lợi ích cụ thể ("được gì?"), dễ mất kiên nhẫn nếu nhân viên vòng vo quá lâu.',
    generalTactic:
      'Đi thẳng vào lợi ích, dùng số liệu/con số cụ thể, tôn trọng thời gian của khách.',
    winCondition: 'Khách đồng ý mở sản phẩm hoặc để lại thông tin đăng ký ngay trong cuộc gọi.',
    recommendedProductId: 'the-tin-dung',
  },
  {
    id: 'chu-ho-kinh-doanh',
    chapterNumber: 3,
    name: 'Chủ hộ kinh doanh',
    starRating: 3,
    criteria: {
      age: '35–55 tuổi',
      occupation: 'Tự kinh doanh (tạp hoá/shop online/quán ăn...)',
      incomeLevel: 'Thu nhập biến động theo kinh doanh, có tài sản tích luỹ',
      needs: 'Vốn xoay vòng kinh doanh, quản lý dòng tiền hiệu quả',
      painPoints: 'Sợ lãi suất tăng bất ngờ; sợ thủ tục phức tạp làm mất thời gian kinh doanh',
      expectations: 'Câu trả lời cụ thể, có số liệu rõ ràng, không thích bị "quảng cáo" chung chung',
      barriers:
        'Đã có quan hệ tín dụng với ngân hàng khác, cần thấy lợi thế cạnh tranh cụ thể bằng số liệu',
    },
    behaviorNote:
      'Đặt câu hỏi khó, hay so sánh trực tiếp với đối thủ/ngân hàng khác, cần bằng chứng thuyết phục.',
    generalTactic:
      'Luôn chuẩn bị số liệu cụ thể (lãi suất, thời gian giải ngân, phí), so sánh trực diện với đối thủ nếu được hỏi.',
    winCondition: 'Khách đồng ý cung cấp hồ sơ để xét duyệt, hoặc hẹn gặp trực tiếp bàn kỹ hơn.',
    recommendedProductId: 'vay-tieu-dung',
  },
  {
    id: 'nguoi-da-nghi',
    chapterNumber: 4,
    name: 'Người đa nghi / từng bị lừa',
    starRating: 4,
    criteria: {
      age: 'Không giới hạn cụ thể, đa số trung niên trở lên',
      occupation: 'Đa dạng',
      incomeLevel: 'Đa dạng, có nhu cầu tài chính thật',
      needs: 'Bảo vệ rủi ro, tích luỹ — nhưng cần được xây dựng niềm tin trước khi mở lòng',
      painPoints:
        'Sợ bị lừa lần nữa; sợ đọc không kỹ hợp đồng rồi thiệt hại về sau; từng bị tư vấn sai, mất tiền',
      expectations: 'Minh bạch tuyệt đối, giải thích kỹ từng điều khoản, không bị hối thúc chốt nhanh',
      barriers: 'Niềm tin thấp với ngành tài chính nói chung, không dễ bị thuyết phục bằng lời nói suông',
    },
    behaviorNote:
      'Chất vấn liên tục, có thể kể lại trải nghiệm xấu trước đó, dễ cúp máy nếu cảm thấy bị "bán" ép.',
    generalTactic:
      'Minh bạch mọi điều khoản/phí ngay cả khi bất lợi, không hối thúc, thừa nhận rủi ro thay vì né tránh, kiên nhẫn lắng nghe câu chuyện cũ của khách trước khi tư vấn.',
    winCondition:
      'Khách bắt đầu cởi mở, đặt câu hỏi thật thay vì phòng thủ, hoặc đồng ý tìm hiểu thêm tài liệu — không nhất thiết phải chốt được ngay.',
    recommendedProductId: 'bao-hiem-lien-ket',
  },
  {
    id: 'khach-vip',
    chapterNumber: 5,
    name: 'Khách VIP / đàm phán cứng',
    starRating: 5,
    criteria: {
      age: 'Trung niên trở lên, thành đạt',
      occupation: 'Doanh nhân / chuyên gia cấp cao',
      incomeLevel: 'Tài sản/thu nhập cao',
      needs: 'Tối ưu hoá tài chính tổng thể, dịch vụ cá nhân hoá đúng nhu cầu riêng',
      painPoints: 'Ghét bị tư vấn kiểu đại trà, rập khuôn; không thích bị "bán" một cách lộ liễu',
      expectations:
        'Nhân viên phải hiểu rõ nhu cầu tổng thể trước khi đề xuất bất kỳ sản phẩm nào, không chăm chăm chốt 1 thứ',
      barriers: 'Đã có nhiều mối quan hệ ngân hàng khác, đòi hỏi cao, khó gây ấn tượng bằng cách tư vấn thông thường',
    },
    behaviorNote:
      'Kiểm soát cuộc trò chuyện, đặt câu hỏi sắc, thử thách nhân viên, không dễ bị thuyết phục nhanh.',
    generalTactic:
      'Thể hiện đẳng cấp tư vấn (kiến thức sâu, số liệu chính xác), cá nhân hoá mọi đề xuất, giữ thái độ tự tin nhưng không xu nịnh.',
    winCondition:
      'Nếu bán được combo là xuất sắc; nếu chưa chốt được ngay, khai thác được insight/nhu cầu thật của khách trước khi kết thúc cuộc gọi vẫn được tính là hoàn thành mục tiêu.',
    recommendedProductId: 'combo',
    isBossChapter: true,
  },
];

/** Gọi bởi hydrateContentFromBackend() sau khi fetch bảng personas. */
export function replacePersonas(next: Persona[]) {
  personas = next;
}

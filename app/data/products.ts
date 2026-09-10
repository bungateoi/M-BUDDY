import type { Product } from './types';

// Nguồn: /docs/products.md — đây là SEED mặc định, dùng khi Supabase chưa
// có dữ liệu (chưa chạy migration 0004/0005) hoặc lúc app chưa hydrate
// xong. Sau khi hydrateContentFromBackend() (app/lib/contentData.ts) chạy
// xong lúc mở app, mảng này bị THAY THẾ bằng dữ liệu thật từ DB qua
// replaceProducts() — nhờ ES module live-binding, mọi nơi `import {
// products } from '../data'` tự thấy dữ liệu mới, không cần sửa gì thêm.
export let products: Product[] = [
  {
    id: 'tiet-kiem-online',
    order: 1,
    name: 'Tiết kiệm online',
    shortDescription:
      'Gửi tiết kiệm hoàn toàn qua app, không cần ra quầy, lãi suất ưu đãi hơn so với gửi tại quầy.',
    targetAudience: 'Người có tiền nhàn rỗi, ưu tiên an toàn, ít chấp nhận rủi ro.',
    benefits: [
      'Lãi suất ưu đãi hơn 0.1–0.3%/năm so với gửi tại quầy',
      'Kỳ hạn linh hoạt (1–36 tháng)',
      'Tất toán trước hạn vẫn được hưởng lãi không kỳ hạn cho phần đã gửi đủ',
      'Thao tác 100% trên app, không cần ra chi nhánh',
    ],
    basicConditions: 'Có tài khoản thanh toán MSB, số tiền gửi tối thiểu 1.000.000đ',
    keySellingPoints: [
      'Lãi suất cao hơn tại quầy',
      'An toàn tuyệt đối, được bảo hiểm tiền gửi theo quy định NHNN',
      'Linh hoạt kỳ hạn, rút trước hạn không mất hết lãi',
      'Thao tác nhanh, không cần ra chi nhánh',
    ],
    objectionBank: [
      {
        question: 'Gửi online có an toàn không, lỡ mất tiền thì sao?',
        sampleAnswer:
          'Gửi online an toàn tương đương tại quầy, tiền gửi được bảo hiểm theo quy định của Nhà nước, sổ tiết kiệm điện tử có giá trị pháp lý như sổ giấy.',
      },
      {
        question: 'Lãi suất online cao hơn tại quầy thật không hay chỉ quảng cáo?',
        sampleAnswer:
          'Đây là chính sách chính thức của ngân hàng — có thể xem trực tiếp bảng lãi suất trong app, minh bạch và cập nhật theo thời gian thực.',
      },
      {
        question: 'Tôi cần tiền gấp thì rút giữa chừng có bị mất hết lãi không?',
        sampleAnswer:
          'Không mất hết — phần tiền gửi đủ kỳ hạn tối thiểu vẫn được tính lãi không kỳ hạn, không bị mất trắng như trước đây.',
      },
      {
        question: 'Thao tác trên app tôi không rành công nghệ.',
        sampleAnswer:
          'Thao tác chỉ 3 bước đơn giản, có hướng dẫn từng bước trong app, và luôn có tổng đài/nhân viên hỗ trợ nếu cần.',
      },
    ],
  },
  {
    id: 'the-tin-dung',
    order: 2,
    name: 'Thẻ tín dụng',
    shortDescription:
      'Thẻ tín dụng quốc tế, chi tiêu trước – trả tiền sau, kèm ưu đãi hoàn tiền/tích điểm.',
    targetAudience:
      'Người có thu nhập ổn định, thường xuyên chi tiêu online/mua sắm, hay đi công tác/du lịch.',
    benefits: [
      'Miễn lãi tới 45–55 ngày',
      'Hoàn tiền theo danh mục chi tiêu (ăn uống, mua sắm online, xăng dầu...)',
      'Miễn phí thường niên năm đầu',
      'Tích điểm đổi quà/dặm bay',
    ],
    basicConditions:
      'Đủ 18 tuổi, chứng minh được thu nhập (lương chuyển khoản hoặc hợp đồng lao động)',
    keySellingPoints: [
      'Miễn lãi tới 45–55 ngày',
      'Hoàn tiền/tích điểm theo thói quen chi tiêu',
      'Miễn phí thường niên năm đầu',
      'Mở thẻ nhanh, duyệt qua app',
    ],
    objectionBank: [
      {
        question: 'Dùng thẻ tín dụng dễ nợ nần, tôi sợ không kiểm soát được.',
        sampleAnswer:
          'App có công cụ theo dõi chi tiêu theo thời gian thực, có thể tự đặt hạn mức cảnh báo, hạn mức thẻ cũng được cấp dựa trên thu nhập nên không vượt khả năng chi trả.',
      },
      {
        question: 'Phí thường niên có đắt không?',
        sampleAnswer:
          'Miễn phí hoàn toàn năm đầu, các năm sau có thể tiếp tục được miễn nếu đạt doanh số chi tiêu tối thiểu theo chính sách.',
      },
      {
        question: 'Tôi đã có thẻ ngân hàng khác rồi.',
        sampleAnswer:
          'Vậy anh/chị đang thấy thẻ hiện tại còn thiếu ưu đãi gì? (khai thác nhu cầu) — sau đó so sánh điểm khác biệt về hoàn tiền/tích điểm.',
      },
      {
        question: 'Thủ tục mở thẻ có phức tạp không?',
        sampleAnswer: 'Hoàn toàn qua app, hồ sơ đơn giản, thời gian duyệt chỉ vài phút.',
      },
    ],
  },
  {
    id: 'vay-tieu-dung',
    order: 3,
    name: 'Vay tiêu dùng',
    shortDescription:
      'Vay tín chấp phục vụ nhu cầu tiêu dùng cá nhân (sửa nhà, mua sắm, y tế, du lịch...), không cần tài sản đảm bảo.',
    targetAudience: 'Người có nhu cầu tài chính ngắn–trung hạn, thu nhập ổn định.',
    benefits: [
      'Giải ngân nhanh, có thể trong ngày',
      'Không cần tài sản thế chấp',
      'Lãi suất cạnh tranh',
      'Trả góp linh hoạt theo tháng',
    ],
    basicConditions: 'Chứng minh thu nhập, độ tuổi 20–60, lịch sử tín dụng tốt (không nợ xấu)',
    keySellingPoints: [
      'Giải ngân nhanh, không cần thế chấp',
      'Lãi suất cạnh tranh, minh bạch',
      'Kỳ hạn và số tiền vay linh hoạt theo nhu cầu',
      'Hồ sơ đơn giản, xét duyệt online',
    ],
    objectionBank: [
      {
        question: 'Lãi suất vay tiêu dùng thường cao lắm.',
        sampleAnswer:
          'Mức lãi suất cụ thể phụ thuộc hồ sơ từng người, nhưng vẫn thấp hơn nhiều so với vay nóng bên ngoài, và hoàn toàn minh bạch ngay từ đầu.',
      },
      {
        question: 'Tôi sợ không trả nợ đúng hạn.',
        sampleAnswer:
          'Có thể cùng tính toán số tiền trả góp phù hợp với thu nhập trước khi quyết định vay, chọn kỳ hạn sao cho khoản trả hàng tháng thoải mái nhất.',
      },
      {
        question: 'Thủ tục vay có phức tạp, mất nhiều thời gian không?',
        sampleAnswer:
          'Hồ sơ đơn giản, xét duyệt hoàn toàn online, có thể giải ngân ngay trong ngày nếu hồ sơ đầy đủ.',
      },
      {
        question: 'Tôi chưa có nhu cầu vay ngay bây giờ.',
        sampleAnswer:
          'Không sao, có thể giữ liên hệ và giới thiệu một hạn mức vay dự phòng sẵn có, khi nào cần chỉ cần thao tác trên app.',
      },
    ],
  },
  {
    id: 'bao-hiem-lien-ket',
    order: 4,
    name: 'Bảo hiểm liên kết',
    shortDescription:
      'Sản phẩm bảo hiểm nhân thọ liên kết đầu tư — kết hợp bảo vệ tài chính trước rủi ro và tích lũy dài hạn.',
    targetAudience:
      'Người có thu nhập ổn định, mong muốn bảo vệ tài chính cho bản thân/gia đình kết hợp tích lũy dài hạn.',
    benefits: [
      'Bảo vệ trước rủi ro (bệnh hiểm nghèo, tai nạn, tử vong)',
      'Giá trị tài khoản tích lũy tăng theo thời gian',
      'Có thể rút một phần giá trị khi cần',
    ],
    basicConditions: 'Đóng phí định kỳ (năm/quý/tháng), thời hạn hợp đồng dài hạn (10–20 năm)',
    keySellingPoints: [
      'Vừa bảo vệ vừa tích lũy — 2 trong 1',
      'Linh hoạt chọn mức rủi ro của phần đầu tư',
      'Có quyền cân nhắc/hủy trong 21 ngày đầu (thời gian cân nhắc)',
      'Phí thấp hơn nếu tham gia sớm',
    ],
    objectionBank: [
      {
        question: 'Bảo hiểm liên kết đầu tư có rủi ro mất tiền không?',
        sampleAnswer:
          'Sản phẩm gồm 2 phần rõ ràng: phần bảo vệ cố định và phần đầu tư có nhiều mức rủi ro để lựa chọn — mọi thông tin đều được công khai minh bạch trong hợp đồng và minh họa quyền lợi.',
      },
      {
        question: 'Tôi từng nghe nhiều người bị tư vấn sai, đóng xong không rút được.',
        sampleAnswer:
          'Rất hiểu lo lắng này — chúng ta sẽ cùng đọc kỹ từng điều khoản trước khi ký, và anh/chị có 21 ngày cân nhắc sau khi ký để xem xét lại, hoàn toàn chủ động.',
      },
      {
        question: 'Phí đóng hàng năm cao quá, tôi không đủ khả năng.',
        sampleAnswer:
          'Có thể điều chỉnh mức phí phù hợp với thu nhập hiện tại, không nhất thiết phải chọn gói cao nhất ngay từ đầu.',
      },
      {
        question: 'Tôi còn trẻ, chưa cần bảo hiểm.',
        sampleAnswer:
          'Tham gia càng sớm, mức phí càng thấp và thời gian tích lũy càng dài — đây chính là thời điểm tối ưu nhất để bắt đầu.',
      },
    ],
    complianceNote:
      'BẮT BUỘC phải nói rõ đây là sản phẩm có yếu tố đầu tư (không cam kết lợi nhuận cố định) và nhắc khách hàng về quyền cân nhắc 21 ngày. Đây là 1 tiêu chí trong checklist "Tuân thủ quy trình" ở phần chấm điểm.',
  },
  {
    id: 'combo',
    order: 5,
    name: 'Combo (Tài khoản số + Bảo hiểm + Đầu tư)',
    shortName: 'Combo',
    shortDescription:
      'Gói combo tích hợp mở tài khoản số miễn phí, kèm bảo hiểm cơ bản và sản phẩm đầu tư (quỹ mở/chứng chỉ quỹ) — sản phẩm bán chéo, khó nhất trong 5 sản phẩm, đòi hỏi khai thác nhu cầu tổng thể trước khi đề xuất.',
    targetAudience:
      'Khách hàng đã có quan hệ với ngân hàng, có khả năng tài chính tốt, phù hợp để bán chéo/upsell.',
    benefits: [
      'Tiết kiệm chi phí khi mua combo so với mua lẻ từng sản phẩm',
      'Tối ưu hoá tài chính toàn diện trong 1 lần tư vấn',
      'Ưu đãi riêng dành cho khách hàng combo',
    ],
    basicConditions:
      'Thường yêu cầu số dư/thu nhập cao hơn mức trung bình, cần tư vấn kỹ nhu cầu tổng thể trước khi đề xuất.',
    keySellingPoints: [
      'Tiết kiệm chi phí tổng thể so với mua lẻ',
      'Giải pháp tài chính toàn diện, không phải chắp vá từng phần',
      'Có thể tuỳ chỉnh từng phần trong combo theo nhu cầu thật',
      'Ưu đãi độc quyền cho khách combo',
    ],
    objectionBank: [
      {
        question: 'Tôi chỉ cần 1 sản phẩm thôi, sao phải mua combo?',
        sampleAnswer:
          'Hoàn toàn hiểu — combo không bắt buộc trọn gói, mỗi phần đều là sản phẩm độc lập hữu ích, chỉ là khi kết hợp sẽ tiết kiệm chi phí hơn đáng kể.',
      },
      {
        question: 'Nghe combo là thấy bị ép mua thêm cái không cần.',
        sampleAnswer:
          'Không hề ép buộc — anh/chị hoàn toàn có quyền tuỳ chỉnh, bỏ bớt phần không phù hợp, mình chỉ đề xuất dựa trên đúng nhu cầu đã trao đổi.',
      },
      {
        question: 'Tôi đã có sản phẩm đầu tư ở nơi khác rồi.',
        sampleAnswer:
          'Vậy sản phẩm hiện tại anh/chị đang hài lòng nhất ở điểm nào? (khai thác insight) — từ đó chỉ ra điểm khác biệt của combo, ví dụ liên kết trực tiếp với tài khoản đang dùng.',
      },
      {
        question: 'Tôi cần thời gian suy nghĩ, việc này lớn quá.',
        sampleAnswer:
          'Hoàn toàn tôn trọng — có thể gửi tài liệu tham khảo chi tiết và hẹn trao đổi lại vào thời điểm anh/chị thuận tiện hơn.',
      },
    ],
    complianceNote:
      'Có yếu tố đầu tư (qua phần bảo hiểm liên kết/quỹ) — áp dụng cùng lưu ý compliance như Bảo hiểm liên kết: không cam kết lợi nhuận cố định, nhắc quyền cân nhắc nếu áp dụng.',
  },
];

/** Gọi bởi hydrateContentFromBackend() sau khi fetch bảng products từ
 * Supabase — thay hẳn seed tĩnh bằng dữ liệu thật. */
export function replaceProducts(next: Product[]) {
  products = next;
}

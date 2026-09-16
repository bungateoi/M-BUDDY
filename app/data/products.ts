import type { Product } from './types';

// Nguồn: v2_docs/MSB_Product_Knowledge_Base.md — thay thế hoàn toàn bộ 5
// "sản phẩm mẫu" cũ (docs/products.md) bằng đúng các sản phẩm MSB thật được
// dùng trong v2_docs/Kich_ban_training.md (không còn 5 sản phẩm giống nhau
// cho mọi chặng — xem levels.ts). `knowledgeBase` chứa trích đoạn kiến thức
// ĐẦY ĐỦ (đã bỏ các marker trích dẫn nghiên cứu dạng "citeturn..." không
// dùng được) — gửi cho AI làm ngữ cảnh chấm điểm "kiến thức sản phẩm" và
// đối chiếu số liệu khi khách hỏi (xem agent/main.py). benefits/
// keySellingPoints/objectionBank ở dưới CHỈ là bản rút gọn cho UI admin dễ
// đọc — không phải nguồn đầy đủ. SEED mặc định, xem comment ở data/index.ts.
export let products: Product[] = [
  {
    id: 'tiet-kiem-ong-vang',
    order: 1,
    name: 'Tiết kiệm Ong Vàng',
    shortDescription: 'Tiết kiệm gửi góp linh hoạt, giao dịch tại quầy hoặc online, kỳ hạn 3–36 tháng.',
    targetAudience: 'Khách hàng từ 18 tuổi có khoản tiền nhàn rỗi muốn gửi tiết kiệm an toàn, linh hoạt.',
    benefits: [
      'Kỳ hạn đa dạng: 3–13, 15, 18, 24, 36 tháng',
      'Gửi lần đầu tối thiểu 1 triệu VND (hoặc 100 USD), gửi thêm tối thiểu 50.000 VND (hoặc 2 USD)',
      'Trả lãi cuối kỳ; rút trước hạn vẫn hưởng lãi không kỳ hạn thay vì mất trắng',
      'Rút gốc từng phần: tại quầy tối đa 5 lần, online không giới hạn',
    ],
    basicConditions: 'Khách hàng cá nhân từ 18 tuổi, tiền gửi ban đầu tối thiểu 1 triệu VND/100 USD.',
    keySellingPoints: [
      'Kỳ hạn linh hoạt 3–36 tháng, VND hoặc USD',
      'Rút trước hạn không mất hết lãi (hưởng lãi không kỳ hạn)',
      'Có thể mở/quản lý ngay trên MSB Digital Bank',
      'Đáo hạn tự động chuyển sang sản phẩm lãi suất cao nhất tương ứng nếu không tất toán',
    ],
    objectionBank: [
      { question: 'Gửi online có an toàn không?', sampleAnswer: 'An toàn tương đương tại quầy, sổ tiết kiệm điện tử có giá trị pháp lý như sổ giấy, tiền gửi được bảo hiểm theo quy định.' },
      { question: 'Rút trước hạn có mất hết lãi không?', sampleAnswer: 'Không mất hết — phần đã gửi vẫn được hưởng lãi không kỳ hạn, chỉ thấp hơn lãi kỳ hạn ban đầu, gốc giữ nguyên.' },
      { question: 'Không tất toán khi đáo hạn thì sao?', sampleAnswer: 'Hệ thống tự động chuyển cả gốc và lãi sang sản phẩm "Tiết kiệm lãi suất cao nhất" cho kỳ hạn tương ứng nếu không có thoả thuận khác.' },
    ],
    knowledgeBase: `Tiết kiệm Ong Vàng — giải pháp tiết kiệm gửi góp linh hoạt cho khách hàng từ 18 tuổi, giao dịch tại quầy hoặc trực tuyến.
Đặc điểm: kỳ hạn 3–13/15/18/24/36 tháng; tiền tệ VND hoặc USD; tiền gửi ban đầu tối thiểu 1 triệu VND hoặc 100 USD; gửi thêm định kỳ tối thiểu 50.000 VND hoặc 2 USD; trả lãi cuối kỳ; rút trước hạn hưởng lãi không kỳ hạn theo chính sách.
Đáo hạn: nếu không tất toán và không có thoả thuận khác, MSB tự động chuyển cả gốc + lãi sang sản phẩm "Tiết kiệm lãi suất cao nhất" cho kỳ hạn tương ứng theo mức lãi suất áp dụng tại thời điểm đó.
Mở online: đăng nhập MSB Digital Bank → Tiền gửi và đầu tư → Mở mới tiền gửi → chọn sản phẩm → nhập tài khoản nguồn/số tiền/kỳ hạn/lãi suất/phương thức đáo hạn → đồng ý điều khoản → xác thực → hoàn tất.
FAQ: rút gốc từng phần tại quầy tối đa 5 lần, online không giới hạn; có thể ủy quyền người khác tất toán tại quầy theo quy định; có thể mở tối đa 10 sổ/lần cho mục đích bảo mật.`,
  },
  {
    id: 'tiet-kiem-mang-non',
    order: 2,
    name: 'Tiết kiệm Măng Non',
    shortDescription: 'Tiết kiệm gửi góp dành cho mục tiêu tích lũy cho con, kỳ hạn tới 15 năm.',
    targetAudience: 'Cha mẹ muốn tích lũy học phí hoặc tạo quỹ dài hạn cho con.',
    benefits: [
      'Kỳ hạn linh hoạt: 3–13, 15, 18, 24, 36 tháng, hoặc dài hạn 4–15 năm',
      'Gửi lần đầu ≥1 triệu VND/100 USD, gửi thêm ≥50.000 VND/2 USD',
      'Trả lãi cuối kỳ, có thể rút trước hạn với lãi không kỳ hạn',
      'Người lớn đứng tên gửi/đại diện theo quy định',
    ],
    basicConditions: 'Người đại diện hợp pháp đứng tên gửi cho trẻ, gửi lần đầu tối thiểu 1 triệu VND/100 USD.',
    keySellingPoints: [
      'Kỳ hạn dài tới 15 năm, phù hợp mục tiêu học phí/quỹ tương lai cho con',
      'Gửi góp định kỳ, không cần 1 khoản lớn ngay từ đầu',
      'Vẫn rút trước hạn được nếu cần gấp',
    ],
    objectionBank: [
      { question: 'Khác gì tiết kiệm thường?', sampleAnswer: 'Cùng cơ chế tiết kiệm gửi góp nhưng có thêm kỳ hạn dài 4–15 năm, phù hợp mục tiêu tích lũy dài hạn cho con thay vì chỉ gửi ngắn hạn.' },
      { question: 'Rút trước hạn thì sao?', sampleAnswer: 'Vẫn rút được, phần đã gửi hưởng lãi không kỳ hạn, không mất gốc.' },
    ],
    knowledgeBase: `Tiết kiệm Măng Non — sản phẩm gửi góp dành cho mục tiêu tích lũy cho trẻ, người lớn là người đứng tên gửi/đại diện theo quy định.
Đặc điểm: kỳ hạn 3–13/15/18/24/36 tháng hoặc 4–15 năm; tiền tệ VND/USD; gửi lần đầu ≥1 triệu VND hoặc ≥100 USD; gửi thêm ≥50.000 VND hoặc ≥2 USD; trả lãi cuối kỳ; có thể rút trước hạn với lãi không kỳ hạn.
Sales Trigger: cha mẹ muốn tích lũy học phí; muốn tạo quỹ dài hạn cho con; muốn gửi đều đặn thay vì bỏ một khoản tiền lớn ngay từ đầu.`,
  },
  {
    id: 'tien-gui-ky-han-truc-tuyen',
    order: 3,
    name: 'Tiền gửi có kỳ hạn trực tuyến',
    shortDescription: 'Kênh gửi tiết kiệm có kỳ hạn qua MSB Digital Bank/mBank, lãi suất online có thể cao hơn tại quầy.',
    targetAudience: 'Khách hàng cá nhân cư trú tại Việt Nam, từ 18 tuổi, đã có tài khoản thanh toán MSB.',
    benefits: [
      'Giao dịch mọi lúc mọi nơi, không cần ra quầy',
      'Lãi suất online có thể cao hơn tại quầy tới 0,5% tuỳ kỳ hạn/thời điểm',
      'Số tiền gửi tối thiểu chỉ 1 triệu VND',
      'Không mất gốc khi rút trước hạn — chỉ tính lại lãi theo mức không kỳ hạn',
    ],
    basicConditions: 'Từ 18 tuổi, đã có tài khoản thanh toán MSB, số tiền tối thiểu 1 triệu VND.',
    keySellingPoints: [
      'Không mất gốc khi rút trước hạn, không có phí ẩn dạng "phí phá hợp đồng"',
      'Được bảo vệ bởi bảo hiểm tiền gửi tối đa 350 triệu đồng/người (gồm gốc và lãi)',
      'Lãi tiền gửi được miễn thuế thu nhập cá nhân theo quy định hiện hành',
      'Tự động quay vòng kỳ hạn mới theo lãi suất công bố nếu không tất toán khi đáo hạn',
    ],
    objectionBank: [
      { question: 'Có mất gốc khi rút trước hạn không?', sampleAnswer: 'Không. Chỉ có phần lãi bị tính lại thấp hơn theo lãi suất không kỳ hạn tại thời điểm rút, gốc giữ nguyên.' },
      { question: 'Có phí ẩn không?', sampleAnswer: 'Không có phí ẩn dạng phí phá hợp đồng như bảo hiểm liên kết đầu tư — chỉ là cơ chế tính lại lãi khi rút sớm, đã công khai theo điều kiện sản phẩm.' },
      { question: 'Ngân hàng có vấn đề thì tiền của tôi sao?', sampleAnswer: 'Tiền gửi được bảo hiểm tiền gửi bảo vệ tối đa 350 triệu đồng/người (gồm cả gốc và lãi) theo quy định hiện hành.' },
      { question: 'Có phải đóng thuế lãi tiền gửi không?', sampleAnswer: 'Không — lãi tiền gửi tại tổ chức tín dụng thuộc diện miễn thuế thu nhập cá nhân theo quy định hiện hành.' },
    ],
    knowledgeBase: `Tiền gửi có kỳ hạn trực tuyến — gửi online qua MSB Digital Bank/MSB mBank.
Điểm nổi bật: giao dịch mọi lúc mọi nơi; lãi suất online có thể cao hơn quầy theo từng sản phẩm/chính sách (tới 0,5% theo công bố MSB); quản lý tiền gửi online; có các phương án trả lãi tuỳ sản phẩm.
Điều kiện: khách hàng cá nhân Việt Nam cư trú, từ 18 tuổi, có tài khoản thanh toán MSB, số tiền tối thiểu 1 triệu VND.
Đáo hạn: nếu bật tự động quay vòng và không tất toán khi đáo hạn, hệ thống tự động chuyển sang kỳ hạn mới theo lãi suất công bố tại thời điểm quay vòng.
Bảng câu trả lời chuẩn (đối chiếu KB, để AI không bịa số liệu ngoài phạm vi):
- Mất gốc khi rút trước hạn? Không, chỉ phần lãi bị tính lại thấp hơn (theo lãi suất tiền gửi không kỳ hạn thấp nhất tại thời điểm rút), gốc giữ nguyên.
- Rút trước hạn thì sao? Được rút, nhưng không còn hưởng lãi suất kỳ hạn ban đầu cho phần rút trước hạn — áp mức lãi không kỳ hạn (thấp hơn nhiều).
- Có phí ẩn không? Không có phí ẩn dạng "phí phá hợp đồng" như bảo hiểm liên kết đầu tư — chỉ là cơ chế tính lại lãi suất khi rút sớm, đã nêu công khai theo điều kiện sản phẩm.
- Lãi suất online so với tại quầy? Có thể cao hơn tới 0,5% so với tại quầy theo công bố của MSB — mức cụ thể tuỳ kỳ hạn/thời điểm, không phải một con số cố định.
- Nếu ngân hàng có vấn đề thì sao? Tiền gửi được bảo hiểm tiền gửi bảo vệ tối đa 350 triệu đồng/người/tổ chức (gồm cả gốc và lãi) theo quy định hiện hành.
- Có phải đóng thuế lãi tiền gửi không? Không — thu nhập từ lãi tiền gửi tại tổ chức tín dụng thuộc diện miễn thuế thu nhập cá nhân theo quy định hiện hành.
Lưu ý cho AI đóng vai: không tự ý đưa ra một con số lãi suất % cụ thể cố định nếu KB không có — nếu Sale chốt cứng "chắc chắn không đổi", khách được phép tỏ ra nghi ngờ nhẹ vì bản chất lãi suất tiền gửi thay đổi theo thời điểm/kỳ hạn/kênh.`,
  },
  {
    id: 'm-flexcare',
    order: 4,
    name: 'M-FlexCare',
    shortName: 'M-Flexcare',
    shortDescription: 'Bảo hiểm sức khỏe toàn cầu cho cá nhân/gia đình, hỗ trợ nội trú, ngoại trú, tai nạn, thai sản.',
    targetAudience: 'Cá nhân/gia đình từ 60 ngày tuổi đến 65 tuổi muốn bảo vệ sức khỏe toàn diện.',
    benefits: [
      '4 chương trình: Đồng, Vàng, Bạch Kim, Kim Cương — quyền lợi tăng dần',
      'Chi trả nội trú, ngoại trú, nha khoa, thai sản, phẫu thuật, xe cấp cứu, điều dưỡng tại nhà...',
      'Trẻ dưới 6 tuổi tham gia cùng cha/mẹ trong cùng hợp đồng',
      'Đóng phí hàng năm, thời hạn 1 năm',
    ],
    basicConditions: 'Tham gia từ 60 ngày tuổi, kết thúc tối đa 65 tuổi theo điều kiện; đóng phí hàng năm.',
    keySellingPoints: [
      'Quyền lợi rộng: tai nạn, bệnh tật, thai sản, nha khoa, phục hồi chức năng',
      '4 mức chương trình phù hợp nhiều ngân sách khác nhau',
      'Thời gian chờ rõ ràng theo từng loại quyền lợi (tai nạn hiệu lực ngay, thai sản 60 ngày...)',
    ],
    objectionBank: [
      { question: 'Tôi đã có bảo hiểm sức khỏe/BHYT rồi.', sampleAnswer: 'Có thể có nhiều hợp đồng bảo hiểm sức khỏe cùng lúc, nhưng tổng chi trả bị giới hạn theo hóa đơn/quyền lợi hợp đồng — nên vẫn có thể bổ sung để tăng mức bảo vệ.' },
    ],
    knowledgeBase: `M-FlexCare — bảo hiểm sức khỏe toàn cầu cho cá nhân/gia đình, hỗ trợ chi phí điều trị nội trú, ngoại trú, tai nạn, thai sản và các quyền lợi bổ sung tùy chương trình.
Độ tuổi: từ 60 ngày tuổi, kết thúc tối đa 65 tuổi; trẻ dưới 6 tuổi cần tham gia cùng cha/mẹ trong cùng hợp đồng.
Thời hạn: 1 năm, phí đóng hàng năm.
Thời gian chờ chính: tai nạn hiệu lực ngay sau khi đóng đủ phí; nha khoa/bệnh thông thường 30 ngày; thai sản/tình trạng liên quan 60 ngày; sinh thường/sinh mổ 270 ngày; bệnh có sẵn/đặc biệt 365 ngày trong năm đầu hoặc khi không tái tục liên tục.
Các chương trình: Đồng, Vàng, Bạch Kim, Kim Cương.
Một số quyền lợi theo chương trình (Đồng/Vàng/Bạch Kim/Kim Cương): tử vong/TTTBVV do tai nạn 200m/500m/1 tỷ/2 tỷ; chi phí y tế do tai nạn 20m/50m/100m/200m; nội trú bệnh/tật/thai sản/năm 75m/150m/300m/450m; trợ cấp ngày nằm viện 1,5m/3m/7m/12m; phẫu thuật/năm 50m/100m/200m/300m; ngoại trú+nha khoa/năm 5m/12m/20m/30m; thai sản/năm 10m/20m/40m/60m; tử vong do bệnh/TTTBVV 100m/250m/500m/1 tỷ.
Quyền lợi chi tiết khác: trước nhập viện, sau xuất viện, xe cấp cứu, điều dưỡng tại nhà, phục hồi chức năng, điều trị ung thư, trợ cấp bệnh viện công, nha khoa, thai sản.
FAQ: có thể có nhiều hợp đồng bảo hiểm sức khỏe nhưng tổng chi trả bị giới hạn theo hóa đơn/quyền lợi hợp đồng; gia hạn trong thời gian ân hạn có thể giúp duy trì tính liên tục; vật lý trị liệu có thể được chi trả nếu có chỉ định y khoa và đáp ứng điều kiện.`,
  },
  {
    id: 'huong-dan-mbank',
    order: 5,
    name: 'Hướng dẫn mở sổ tiết kiệm online / dùng MSB mBank',
    shortName: 'Hướng dẫn app mBank',
    shortDescription: 'Hướng dẫn khách thao tác mở sổ tiết kiệm/ngân hàng số ngay trên app MSB Digital Bank/mBank.',
    targetAudience: 'Khách hàng đã đồng ý dùng sản phẩm online nhưng chưa quen thao tác app.',
    benefits: [
      'Quy trình 9 bước rõ ràng, có thể làm mẫu cùng khách ngay tại quầy/qua điện thoại',
      'Không mất phí thao tác',
      'Có hỗ trợ hotline nếu khách cần trợ giúp thêm',
    ],
    basicConditions: 'Khách đã có tài khoản MSB Digital Bank hoặc sẵn sàng đăng ký mới.',
    keySellingPoints: [
      'Thao tác đơn giản, có hướng dẫn từng bước',
      'Nhân viên có thể ngồi cạnh hướng dẫn trực tiếp lần đầu',
    ],
    objectionBank: [
      { question: 'Tôi không rành công nghệ, sợ bấm nhầm mất tiền.', sampleAnswer: 'Có bước xác nhận lại trước khi hoàn tất mọi giao dịch, không mất tiền do bấm nhầm; nhân viên có thể hướng dẫn từng bước tới khi khách tự tin thao tác.' },
    ],
    knowledgeBase: `Hướng dẫn mở sổ tiết kiệm online — quy trình chuẩn: Đăng nhập MSB Digital Bank → Tiền gửi và đầu tư → Mở mới tiền gửi → Chọn sản phẩm → Nhập tài khoản nguồn + số tiền + kỳ hạn/lãi suất → Chọn phương thức đáo hạn → Đồng ý điều khoản → Xác thực → Mở thành công → Theo dõi khoản tiền gửi trên app.
Sales Trigger — nếu khách hàng nói: "Tôi không muốn ra ngân hàng", "Tôi muốn gửi tiền lúc tối", "Có thể mở trên app không?", "Tôi muốn chia tiền thành nhiều sổ" → Sales nên dẫn sang tiền gửi online và hướng dẫn thao tác trực tiếp.`,
  },
  {
    id: 'visa-online',
    order: 6,
    name: 'MSB Visa Online',
    shortName: 'Thẻ Visa Online',
    shortDescription: 'Thẻ tín dụng hoàn 10% chi tiêu online (Shopee, Lazada, TikTok, vé xem phim...), phí thường niên 399.000đ/năm.',
    targetAudience: 'Khách hàng trẻ, mua sắm/thanh toán thương mại điện tử thường xuyên, thu nhập từ 5 triệu/tháng.',
    benefits: [
      'Hoàn 10% chi tiêu online khi đạt 3 triệu/kỳ sao kê',
      'Phí thường niên 399.000đ/năm, được hoàn năm đầu nếu chi ≥500.000đ/30 ngày',
      'Hoàn phí năm sau nếu chi tiêu năm trước ≥60 triệu',
      'Hạn mức từ 100 triệu, thu nhập tham chiếu chỉ từ 5 triệu/tháng',
    ],
    basicConditions: 'Từ 18–65 tuổi (lưu ý FAQ hiện hành ghi 20 tuổi trở lên), thu nhập chuyển khoản từ 5 triệu/tháng.',
    keySellingPoints: [
      'Hoàn tiền cao (10%) đúng nhóm chi tiêu online phổ biến với người trẻ',
      'Thu nhập yêu cầu thấp nhất trong nhóm thẻ hoàn tiền của MSB',
      'Có thể được miễn phí thường niên nếu duy trì chi tiêu đều',
    ],
    objectionBank: [
      { question: 'Phí thường niên có đắt không?', sampleAnswer: 'Chỉ 399.000đ/năm, được hoàn ngay năm đầu nếu chi từ 500.000đ trong 30 ngày đầu, và hoàn tiếp các năm sau nếu chi tiêu năm trước đạt 60 triệu.' },
      { question: 'Tôi chỉ mua hàng online thôi.', sampleAnswer: 'Đúng đối tượng luôn — thẻ hoàn 10% đúng nhóm chi tiêu online như Shopee, Lazada, TikTok, vé xem phim khi đạt 3 triệu/kỳ sao kê.' },
    ],
    knowledgeBase: `MSB Visa Online. Ưu đãi: hoàn 10% chi tiêu online (Shopee, Lazada, TikTok, vé xem phim CGV/BHD/Galaxy/Lotte/Cinestar...), điều kiện tổng chi tiêu đạt 3 triệu/kỳ sao kê.
Phí và điều kiện: phí thường niên 399.000 VNĐ/năm; hoàn năm đầu nếu chi ≥500.000/30 ngày; hoàn năm sau nếu chi tiêu năm trước ≥60 triệu; hạn mức 100 triệu; thẻ phụ 3; độ tuổi 18–65 (lưu ý: FAQ hiện hành của MSB nêu điều kiện chung 20 tuổi trở lên, cần re-validate); thu nhập chuyển khoản từ 5 triệu/tháng — thấp nhất trong nhóm thẻ hoàn tiền.
Đặc điểm chung nhóm thẻ tín dụng MSB: trả góp 0% lãi suất tới 12 tháng tại Samsung, Nguyễn Kim, FPT Shop, CellphoneS; hỗ trợ Apple Pay/Samsung Pay và Contactless theo kênh. Hồ sơ cơ bản: đơn đăng ký, CCCD gắn chip hoặc giấy tờ tùy thân hợp lệ, giấy tờ chứng minh thu nhập/tài sản theo chính sách.
Trigger: khách hàng mua sắm online, đặt vé/xem phim, thanh toán thương mại điện tử.`,
  },
  {
    id: 'tai-khoan-luong-mpro',
    order: 7,
    name: 'Tài khoản lương + gói M-Pro',
    shortName: 'Tài khoản lương + M-Pro',
    shortDescription: 'Mở tài khoản nhận lương qua MSB kèm gói dịch vụ M-Pro (miễn nhiều loại phí giao dịch cơ bản).',
    targetAudience: 'Người vừa chuyển việc/công ty mới trả lương qua MSB.',
    benefits: [
      'Mở tài khoản nhanh, có thể làm online không cần ra quầy',
      'M-Pro miễn phí phát hành thẻ, miễn phí Internet/Mobile Banking',
      'Miễn phí duy trì gói nếu số dư bình quân ≥2 triệu',
    ],
    basicConditions: 'Có quyết định/xác nhận lương chuyển khoản qua MSB từ công ty.',
    keySellingPoints: [
      'Thao tác mở tài khoản hoàn toàn online, không mất phí thêm',
      'Gói M-Pro đi kèm không phát sinh phí nếu duy trì số dư tối thiểu',
    ],
    objectionBank: [
      { question: 'Gói M-Pro có tốn phí gì thêm không?', sampleAnswer: 'Không phát sinh phí thêm nếu số dư bình quân từ 2 triệu trở lên; dưới mức đó mới áp phí duy trì gói theo biểu phí hiện hành.' },
    ],
    knowledgeBase: `M-Pro — CẢNH BÁO DỮ LIỆU: thông tin dưới đây lấy từ biểu phí PDF năm 2022, không được coi là biểu phí hiện hành nếu chưa re-validate; chỉ dùng để role-play ở mức khái quát, không chốt cứng số phí cụ thể với khách.
Theo PDF cũ: phí tài khoản năm miễn phí; không yêu cầu số dư tối thiểu; đi kèm Visa Debit Classic; phí phát hành thẻ miễn phí; phí thường niên thẻ 22.000 VNĐ/năm; Internet/Mobile Banking miễn phí; SMS biến động số dư 8.000 VNĐ/tháng/tài khoản; phí duy trì gói: số dư bình quân ≥2 triệu miễn phí, dưới 2 triệu 22.000 VNĐ/tháng; nộp tiền mặt miễn phí; rút tiền sau 2 ngày làm việc miễn phí, rút trong 2 ngày làm việc 0,05% (tối thiểu 20.000, tối đa 1 triệu).
Quy tắc AI: chỉ dùng M-Pro để role-play ở mức khái quát (có gói kèm theo tài khoản lương, không phát sinh phí nếu duy trì số dư), không nêu số phí cụ thể như một sự thật chắc chắn hiện hành.`,
  },
  {
    id: 'vay-mua-nha',
    order: 8,
    name: 'Vay mua nhà dự án',
    shortName: 'Vay mua nhà/BĐS',
    shortDescription: 'Vay mua nhà tại các dự án MSB liên kết, thời hạn tới 40 năm, có chương trình hỗ trợ lãi suất.',
    targetAudience: 'Người trẻ/gia đình đang tích lũy để mua căn hộ, cần vay bổ sung phần còn thiếu.',
    benefits: [
      'Thời hạn vay tới 40 năm, ân hạn gốc tối đa 60 tháng',
      'Có chương trình lãi suất hỗ trợ 0% giai đoạn đầu tại một số dự án',
      'Thu nhập tối thiểu chỉ từ 8 triệu/tháng',
    ],
    basicConditions: 'Tuổi 22–70 (cuối kỳ không quá 80), thu nhập tối thiểu 8 triệu/tháng, có tài sản đảm bảo (thường là chính căn nhà mua).',
    keySellingPoints: [
      'Ân hạn gốc dài (tới 60 tháng) giúp giảm áp lực trả nợ giai đoạn đầu',
      'Áp dụng cho các dự án MSB liên kết/triển khai chính sách hỗ trợ lãi suất',
    ],
    objectionBank: [
      { question: 'Tôi chưa đủ tiền, chỉ mới để dành được một phần.', sampleAnswer: 'Có thể tính cụ thể phần còn thiếu để vay bổ sung — nếu cho biết giá trị căn hộ và số tiền đã có, có thể ước lượng ngay khoản vay cần thiết và khả năng trả góp hàng tháng.' },
      { question: 'Lãi suất hỗ trợ 0% có thật không?', sampleAnswer: 'Trong thời gian chủ đầu tư hỗ trợ lãi suất, khoản vay vẫn phát sinh lãi bình thường — phần hỗ trợ do chủ đầu tư thanh toán cho ngân hàng theo chương trình, khách vẫn phải trả nợ gốc và các khoản khác theo hợp đồng.' },
    ],
    knowledgeBase: `Vay mua nhà dự án. Điểm nổi bật: thời hạn tới 40 năm; lãi suất từ 0% trong các chương trình hỗ trợ theo dự án; ân hạn gốc tối đa 60 tháng.
Điều kiện: tuổi 22–70 (cuối kỳ không quá 80); thu nhập tối thiểu 8 triệu/tháng; tài sản đảm bảo là nhà mua hoặc tài sản khác đủ điều kiện; áp dụng cho các dự án MSB liên kết/triển khai chính sách.
Hồ sơ: CCCD, giấy tờ cư trú, giấy tờ tài sản đảm bảo, chứng minh thu nhập, hợp đồng mua bán/chuyển nhượng, thông báo tiến độ thanh toán của chủ đầu tư, chứng từ nộp tiền đặt cọc/thanh toán.
Lưu ý về lãi suất hỗ trợ: trong thời gian chủ đầu tư hỗ trợ lãi suất, khoản vay vẫn có phát sinh lãi; phần hỗ trợ được chủ đầu tư thanh toán cho ngân hàng theo chương trình. Khách hàng vẫn cần thực hiện nghĩa vụ trả nợ gốc và các khoản khác theo hợp đồng.`,
  },
  {
    id: 'tai-khoan-so-dep',
    order: 9,
    name: 'Tài khoản số đẹp',
    shortDescription: 'Tài khoản thanh toán cá nhân hóa bằng số đẹp (phong thủy, ngày sinh, tự chọn...).',
    targetAudience: 'Khách muốn số tài khoản dễ nhớ, hợp phong thủy, hoặc dùng cho thương hiệu kinh doanh.',
    benefits: [
      'Nhiều nhóm số: phong thủy/ngũ hành, con giáp, thần số học, tự chọn, theo ngày sinh',
      'Số đẹp theo ngày sinh có thể miễn phí khi đăng ký trên MSB mBank',
      'Vẫn là tài khoản thanh toán đầy đủ chức năng bình thường',
    ],
    basicConditions: 'Đăng ký qua MSB Digital Bank, một số số đẹp có phí sở hữu một lần.',
    keySellingPoints: [
      'Nhiều mức giá theo độ "đẹp" của số, có lựa chọn miễn phí (số theo ngày sinh)',
      'Thao tác chọn số hoàn toàn online',
    ],
    objectionBank: [
      { question: 'Có cái nào không đắt không?', sampleAnswer: 'Có nhiều mức giá khác nhau tùy nhóm số — số theo ngày sinh có thể miễn phí, còn lại tùy độ đẹp sẽ có phí sở hữu một lần, có thể báo cụ thể theo tầm giá khách muốn.' },
    ],
    knowledgeBase: `Tài khoản số đẹp — tài khoản thanh toán được cá nhân hóa bằng số tài khoản đẹp.
Nhóm số: theo phong thủy/ngũ hành, theo con giáp, theo thần số học, tự chọn, theo ngày sinh.
Mở online: tải MSB Digital Bank → đăng ký người dùng → mở tài khoản thanh toán → chọn số đẹp.
Đặc điểm: vẫn là tài khoản thanh toán thông thường, có thể nhận/chuyển tiền, thanh toán hóa đơn và dùng các dịch vụ thanh toán; số đẹp ngày sinh có thể miễn phí khi đăng ký trên MSB mBank; một số số đẹp khác có thể có phí sở hữu một lần.
Sales Trigger: khách muốn số tài khoản dễ nhớ; khách kinh doanh muốn số đẹp cho thương hiệu/cá nhân; khách quan tâm phong thủy/tài lộc.`,
  },
  {
    id: 'vay-bo-sung-von',
    order: 10,
    name: 'Cho vay bổ sung vốn kinh doanh',
    shortName: 'Vay bổ sung vốn KD',
    shortDescription: 'Bổ sung vốn lưu động cho hộ kinh doanh/doanh nghiệp, kể cả kinh doanh online, lãi từ 0,55%/tháng.',
    targetAudience: 'Chủ hộ kinh doanh, chủ doanh nghiệp nhỏ, người kinh doanh online/social commerce.',
    benefits: [
      'Lãi suất từ 0,55%/tháng, hạn mức tới 50 tỷ đồng',
      'Không yêu cầu đăng ký kinh doanh trong một số trường hợp chính sách cho phép',
      'Thời hạn tối đa 36 tháng, đánh giá lại hạn mức định kỳ 12 tháng',
    ],
    basicConditions: 'Tuổi 20–70 (tất toán không quá 75), có hoạt động kinh doanh hợp pháp, kinh nghiệm ≥1 năm (≥2 năm nếu đăng ký online).',
    keySellingPoints: [
      'Hạn mức cao (tới 50 tỷ), phù hợp cả hộ kinh doanh nhỏ lẫn quy mô lớn hơn',
      'Có thể vay từng lần, hạn mức tín dụng, hoặc vay trung/dài hạn tùy nhu cầu',
      'Có thể tiếp nhận/thẩm định nhanh, giải ngân online hoặc tại chi nhánh',
    ],
    objectionBank: [
      { question: 'Tôi không có đăng ký kinh doanh.', sampleAnswer: 'Vẫn có thể xem xét trong một số trường hợp chính sách cho phép — nếu thuộc diện phải ĐKKD nhưng chưa có, có thể dùng chứng từ nộp thuế/phí, xác nhận của đơn vị quản lý chợ/TTTM/UBND, hoặc cam kết bổ sung ĐKKD trong 6 tháng.' },
      { question: 'Lãi suất có cố định không?', sampleAnswer: 'Lãi từ 0,55%/tháng theo thông tin sản phẩm hiện hành — mức cụ thể áp dụng theo hồ sơ và chính sách tại thời điểm vay, không cam kết cố định vĩnh viễn.' },
    ],
    knowledgeBase: `Cho vay bổ sung vốn kinh doanh. Nhu cầu: bổ sung vốn lưu động/phục vụ sản xuất kinh doanh, kể cả kinh doanh online, social commerce, e-commerce.
Điểm nổi bật: lãi suất từ 0,55%/tháng; hạn mức tới 50 tỷ đồng; không yêu cầu đăng ký kinh doanh trong các trường hợp chính sách cho phép.
Điều kiện: tuổi 20–70 (tất toán không quá 75); có hoạt động kinh doanh hợp pháp; kinh nghiệm kinh doanh ≥1 năm (≥2 năm nếu đăng ký online); đối tượng: chủ hộ kinh doanh, chủ doanh nghiệp, vợ/chồng chủ cơ sở, người góp vốn, một số doanh nghiệp siêu nhỏ.
Hồ sơ: CCCD, giấy tờ cư trú, chứng minh hoạt động kinh doanh, chứng minh thu nhập, phương án vay/kế hoạch kinh doanh.
Thời hạn: tối đa 36 tháng, MSB có thể đánh giá lại hạn mức định kỳ 12 tháng.
Phương thức: vay từng lần, hạn mức tín dụng, vay trung/dài hạn.
Quy trình: online có thể được tiếp nhận/thẩm định nhanh theo chính sách; giải ngân online hoặc tại chi nhánh tùy trường hợp.`,
  },
  {
    id: 'the-mastercard-hybrid',
    order: 11,
    name: 'MSB Mastercard Hybrid',
    shortName: 'Thẻ Hybrid',
    shortDescription: 'Thẻ 2-trong-1 tích hợp chức năng ghi nợ + tín dụng, có cơ chế tích điểm/hoàn tiền.',
    targetAudience: 'Khách hàng muốn 1 thẻ duy nhất dùng được cả 2 chế độ ghi nợ và tín dụng.',
    benefits: [
      'Tích hợp ghi nợ + tín dụng trong 1 thẻ',
      'Có cơ chế tích điểm/hoàn tiền theo chính sách sản phẩm',
    ],
    basicConditions: 'Theo chính sách phát hành thẻ hiện hành của MSB (dữ liệu sơ bộ, cần re-validate trước khi tư vấn số liệu cụ thể).',
    keySellingPoints: [
      'Gọn 1 thẻ thay vì phải mang 2 thẻ riêng (ghi nợ + tín dụng)',
      'Phù hợp khách đã quen giao dịch tại quầy/ATM, muốn nâng cấp thêm tính năng tín dụng',
    ],
    objectionBank: [
      { question: 'Khác gì thẻ ATM thường?', sampleAnswer: 'Thẻ Hybrid tích hợp thêm chức năng tín dụng bên cạnh ghi nợ thông thường, tức là vẫn dùng để rút tiền/thanh toán từ tài khoản như cũ nhưng có thêm hạn mức chi tiêu trước trả sau khi cần.' },
      { question: 'Phí có phát sinh thêm không?', sampleAnswer: 'Sẽ cần kiểm tra biểu phí hiện hành theo đúng chính sách tại thời điểm đăng ký để báo chính xác, tránh nói sai số liệu.' },
    ],
    knowledgeBase: `MSB Mastercard Hybrid — thẻ 2-trong-1, tích hợp chức năng ghi nợ + tín dụng, có cơ chế tích điểm/hoàn tiền theo chính sách sản phẩm.
Lưu ý dữ liệu: sản phẩm mới có thông tin sơ bộ trong danh mục KB (mức độ hoàn thiện "Sơ bộ") — chưa đủ dữ liệu chi tiết (phí/hạn mức cụ thể) để AI dùng làm tư vấn định lượng chính xác; khi role-play, tránh chốt cứng số liệu cụ thể chưa được xác nhận.`,
  },
  {
    id: 'thau-chi-tieu-dung',
    order: 12,
    name: 'Thấu chi tiêu dùng',
    shortDescription: 'Chi tiêu trước – cân đối sau, dùng được hạn mức ngay cả khi số dư tài khoản về 0, có tài sản đảm bảo.',
    targetAudience: 'Cá nhân/hộ kinh doanh cần xoay vòng tiền mặt ngắn hạn gấp.',
    benefits: [
      'Dùng ngay khi số dư tài khoản về 0, không cần chờ duyệt lại từng lần',
      'Chỉ tính lãi trên phần thực dùng, không tính trên cả hạn mức được cấp',
      'Thời hạn cấp tới 12 tháng',
      'Kinh doanh online không ĐKKD vẫn có thể được tài trợ tới 1 tỷ đồng',
    ],
    basicConditions: 'Tuổi 20–70, có tài sản đảm bảo là BĐS của khách hàng hoặc bên thứ ba.',
    keySellingPoints: [
      'Cơ chế lãi minh bạch: chỉ tính trên phần thực sự dùng',
      'Phê duyệt nhanh (~16 giờ làm việc kể từ khi đủ hồ sơ theo dữ liệu sản phẩm)',
      'Linh hoạt cho cả trường hợp kinh doanh chưa có ĐKKD (dùng chứng từ thay thế)',
    ],
    objectionBank: [
      { question: 'Có phí ẩn không?', sampleAnswer: 'Cơ chế lãi công khai trong hợp đồng, chỉ tính trên phần thực dùng — không phát sinh phí ẩn ngoài những gì đã nêu rõ khi ký.' },
      { question: 'Tôi không có đăng ký kinh doanh.', sampleAnswer: 'Nếu kinh doanh online, có thể chứng minh qua đơn hàng trên sàn TMĐT và sao kê tài khoản ngân hàng, có thể được tài trợ tới 1 tỷ đồng theo chính sách hiện hành.' },
    ],
    knowledgeBase: `Thấu chi tiêu dùng — giải pháp chi tiêu trước, cân đối sau, dùng được hạn mức ngay cả khi số dư tài khoản về 0. Thời hạn cấp tới 12 tháng, yêu cầu tài sản đảm bảo là BĐS của khách hàng hoặc bên thứ ba.
Điều kiện: tuổi 20–70; có tài sản đảm bảo (BĐS thuộc sở hữu khách hàng hoặc của bên thứ ba/người bảo lãnh); linh hoạt chứng minh thu nhập theo hồ sơ.
Hồ sơ: CMND/CCCD, sổ hộ khẩu/giấy tờ cư trú, giấy chứng nhận TSBĐ, chứng minh thu nhập, hợp đồng/đơn đặt hàng liên quan nếu cần.
Phê duyệt & giải ngân: phê duyệt khoảng 16 giờ làm việc kể từ khi đủ hồ sơ; giải ngân ngay sau khi hoàn thiện đăng ký giao dịch bảo đảm.
Trường hợp kinh doanh không có ĐKKD: không yêu cầu ĐKKD trong một số trường hợp; nếu thuộc diện phải ĐKKD nhưng chưa có, dùng 1 trong: chứng từ nộp thuế/phí, xác nhận của đơn vị quản lý chợ/TTTM/UBND phường xã, hoặc cam kết bổ sung ĐKKD trong 6 tháng. Kinh doanh online: chứng minh qua đơn hàng trên sàn TMĐT + sao kê tài khoản ngân hàng, có thể được tài trợ tới 1 tỷ đồng.`,
  },
  {
    id: 'bao-hiem-chung-cu-4-0',
    order: 13,
    name: 'Bảo hiểm chung cư 4.0',
    shortDescription: 'Bảo hiểm tài sản cho căn hộ, bảo vệ rủi ro cháy/nổ và trách nhiệm với bên thứ ba, phí từ 0,055% giá trị tài sản.',
    targetAudience: 'Chủ căn hộ, đặc biệt khách vừa vay mua nhà/chung cư.',
    benefits: [
      'Phạm vi rộng: cháy, nổ, sét, bão/lũ, vỡ đường ống nước, trộm cắp, hư hỏng, chi phí thuê nhà tạm',
      'Trách nhiệm pháp lý với căn hộ xung quanh khi xảy ra sự cố, tới 1,2 tỷ tùy cấu hình',
      'Phí thấp: từ 0,055% giá trị tài sản (có sprinkler) hoặc 0,1% (không sprinkler)',
    ],
    basicConditions: 'Cá nhân sống tại Việt Nam, có quyền sở hữu căn hộ theo điều kiện.',
    keySellingPoints: [
      'Phí rất thấp so với giá trị tài sản được bảo vệ',
      'Phù hợp giới thiệu ngay khi khách vừa hoàn tất vay mua nhà',
    ],
    objectionBank: [
      { question: 'Không phải ưu tiên của tôi lúc này.', sampleAnswer: 'Hoàn toàn hiểu, có thể để lại thông tin ngắn gọn để tham khảo sau, không cần quyết định ngay.' },
    ],
    knowledgeBase: `Bảo hiểm chung cư 4.0 — bảo hiểm tài sản dành cho căn hộ, tập trung vào rủi ro cháy/nổ và các quyền lợi mở rộng.
Điểm nổi bật: phí từ 0,055% giá trị tài sản theo gói/điều kiện; bảo vệ căn hộ + trách nhiệm với bên thứ ba; có thể phát hành hợp đồng/policy nhanh theo kênh đăng ký.
Thời hạn: 1 năm, đóng phí hàng năm.
Phạm vi: cháy, nổ, sét, bão/lũ, vỡ đường ống nước, trộm cắp, hư hỏng, chi phí thuê nhà tạm thời, trách nhiệm pháp lý đối với căn hộ xung quanh khi xảy ra sự cố.
Mức phí chuẩn: có sprinkler 0,055% x giá trị nhà; không sprinkler 0,1% x giá trị nhà.
Các gói quyền lợi (tiêu chuẩn/ưu việt/toàn mỹ): contents 400 triệu (tối đa 20 triệu/vật) / 600 triệu (tối đa 30 triệu/vật) / 800 triệu (tối đa 50 triệu/vật); trách nhiệm bên thứ ba có thể tới 1,2 tỷ theo cấu hình.
Sales Trigger: khách mua căn hộ; khách đang vay mua nhà/chung cư; khách quan tâm bảo vệ tài sản.`,
  },
  {
    id: 'pru-bao-ve-toi-da',
    order: 14,
    name: 'Bảo hiểm liên kết chung Pru – Bảo vệ tối đa',
    shortName: 'Pru-Bảo vệ tối đa',
    shortDescription: 'Bảo hiểm nhân thọ liên kết chung do Prudential phát hành qua MSB — kết hợp bảo vệ trước rủi ro và tích lũy đầu tư.',
    targetAudience: 'Khách hàng có dòng tiền ổn định, muốn vừa bảo vệ dài hạn vừa tích lũy cho gia đình.',
    benefits: [
      'Bảo vệ trước rủi ro tử vong/thương tật toàn bộ vĩnh viễn, kết hợp tích lũy qua Giá trị tài khoản',
      'Đóng phí linh hoạt từ năm hợp đồng thứ 5',
      'Có cơ chế thưởng tri ân/duy trì hợp đồng nếu đóng phí liên tục nhiều năm',
    ],
    basicConditions: 'Từ 30 ngày tuổi đến 70 tuổi, có tài khoản thanh toán MSB, BẮT BUỘC đóng đủ phí 4 năm đầu.',
    keySellingPoints: [
      'Kết hợp bảo vệ + tích lũy trong 1 sản phẩm, do Prudential bảo hiểm/phát hành',
      'Có thể rút Giá trị tài khoản đóng thêm bất kỳ lúc nào',
      'Giá trị tài khoản cơ bản được rút từ năm hợp đồng thứ 2 (phải duy trì mức tối thiểu)',
    ],
    objectionBank: [
      { question: 'Tôi sợ đóng phí nhiều năm.', sampleAnswer: 'Bắt buộc đóng đủ 4 năm đầu, nhưng từ năm thứ 5 có thể tăng/giảm/tạm ngưng phí theo điều kiện hợp đồng, khá linh hoạt so với hình dung ban đầu.' },
      { question: 'Lãi suất có đảm bảo không?', sampleAnswer: 'Lãi được ghi nhận theo cơ chế Quỹ Liên kết chung, do Prudential công bố theo quy định — không thấp hơn mức lãi suất đầu tư cam kết tối thiểu theo điều khoản.' },
      { question: 'Nếu tôi cần tiền giữa chừng thì sao?', sampleAnswer: 'Giá trị tài khoản đóng thêm có thể rút bất kỳ lúc nào tới 100%; Giá trị tài khoản cơ bản được rút từ năm hợp đồng thứ 2, chỉ cần duy trì mức tối thiểu theo quy định.' },
      { question: 'Tại sao không gửi tiết kiệm cho đơn giản?', sampleAnswer: 'Đây là bảo hiểm liên kết chung — khác bản chất tiết kiệm vì vừa có bảo vệ trước rủi ro tử vong/thương tật vừa tích lũy qua Giá trị tài khoản, không phải chỉ đơn thuần gửi có lãi.' },
    ],
    complianceNote:
      'BẮT BUỘC giải thích đúng bản chất bảo hiểm liên kết chung (không gọi đây là "gửi tiết kiệm có lãi"), nêu rõ nghĩa vụ đóng đủ phí 4 năm đầu và không cam kết lợi nhuận cố định.',
    knowledgeBase: `Bảo hiểm liên kết chung Pru – Bảo vệ tối đa. Bản chất: bảo hiểm nhân thọ liên kết chung do Prudential Việt Nam cung cấp/phát hành, phân phối qua MSB — kết hợp bảo vệ trước rủi ro tử vong/Thương tật toàn bộ vĩnh viễn (TTTBVV) và tích lũy/đầu tư qua Giá trị tài khoản. Giải pháp hoạch định tài chính dài hạn, đóng phí linh hoạt từ năm hợp đồng thứ 5, có quyền rút Giá trị tài khoản theo điều kiện.
Độ tuổi: từ 30 ngày tuổi đến 70 tuổi; kết thúc hợp đồng tối đa 100 tuổi.
Đóng phí: thời hạn đóng phí bằng thời hạn hợp đồng; BẮT BUỘC đóng đủ 4 năm đầu; từ năm thứ 5 có thể tăng/giảm/tạm ngưng phí theo điều kiện hợp đồng; tạm ngưng/giảm phí quá lâu có thể ảnh hưởng hiệu lực nếu Giá trị tài khoản không đủ chi trả các loại phí.
Quyền lợi tử vong/TTTBVV: Gói Cơ bản = giá trị lớn hơn giữa (Số tiền bảo hiểm; Giá trị tài khoản cơ bản) cộng Giá trị tài khoản đóng thêm nếu có. Gói Nâng cao = Số tiền bảo hiểm + Giá trị tài khoản cơ bản + Giá trị tài khoản đóng thêm nếu có.
Quyền lợi đầu tư: lãi ghi nhận theo cơ chế Quỹ Liên kết chung, do Prudential công bố theo quy định, không thấp hơn mức lãi suất đầu tư cam kết tối thiểu theo điều khoản.
Thưởng: Thưởng Tri ân khách hàng 150% phí bảo hiểm cơ bản năm đầu nếu đóng phí liên tục 10 năm, 75% cho mỗi 5 năm tiếp theo. Thưởng Duy trì hợp đồng: 4% Giá trị tài khoản cơ bản trung bình 60 tháng tại mốc năm 20 và các mốc 5 năm tiếp theo.
Rút tiền: Giá trị tài khoản đóng thêm rút bất kỳ lúc nào tới 100%; Giá trị tài khoản cơ bản rút từ năm hợp đồng thứ 2 nhưng phải duy trì mức tối thiểu theo quy định.
Đối tượng: cá nhân sinh sống tại Việt Nam, có tài khoản thanh toán MSB.
Objection cần luyện: "Tôi sợ đóng phí nhiều năm", "Lãi suất có đảm bảo không?", "Nếu tôi cần tiền giữa chừng thì sao?", "Tại sao không gửi tiết kiệm?", "Bảo hiểm có phải đầu tư không?", "Tôi có mất tiền nếu dừng đóng không?"
AI phải giải thích đúng bản chất bảo hiểm liên kết chung, không gọi đây đơn thuần là "gửi tiết kiệm có lãi".`,
  },
  {
    id: 'bao-hiem-benh-hiem-ngheo',
    order: 15,
    name: 'Bảo hiểm bệnh hiểm nghèo',
    shortDescription: 'Hỗ trợ tài chính khi mắc bệnh hiểm nghèo, chi trả 100% số tiền bảo hiểm theo chẩn đoán, 3 gói Silver/Gold/Platinum.',
    targetAudience: 'Cá nhân 16–55 tuổi (gia hạn tới 65) muốn có khoản dự phòng tài chính khi mắc bệnh hiểm nghèo.',
    benefits: [
      'Chi trả 100% số tiền bảo hiểm cho ung thư, nhồi máu cơ tim, đột quỵ... theo chẩn đoán',
      '3 gói Silver/Gold/Platinum, mức chi trả từ 100–200 triệu tùy gói/bệnh',
      'Thời hạn 1 năm, đóng phí hàng năm, phí theo tuổi và gói',
    ],
    basicConditions: 'Tham gia 16–55 tuổi, có thể gia hạn tới 65 tuổi; thời gian chờ 90–365 ngày tùy bệnh.',
    keySellingPoints: [
      'Chi trả dựa trên chẩn đoán, không phải hoàn lại chi phí viện phí thực tế — nhận tiền nhanh khi cần',
      'Mức phí rõ ràng theo từng độ tuổi/gói, dễ tư vấn minh bạch',
    ],
    objectionBank: [
      { question: 'Tôi đã có BHYT/bảo hiểm sức khỏe rồi.', sampleAnswer: 'Sản phẩm này chi trả theo chẩn đoán và số tiền bảo hiểm đã chọn, độc lập với BHYT/bảo hiểm sức khỏe — dùng để bù đắp phần chi phí gián tiếp (mất thu nhập, chi phí phát sinh) mà BHYT không chi trả.' },
      { question: 'Nếu mắc bệnh nhưng chi phí thấp thì có được nhận không?', sampleAnswer: 'Có — quyền lợi chi trả 100% số tiền bảo hiểm theo chẩn đoán đủ điều kiện, không phụ thuộc vào chi phí điều trị thực tế cao hay thấp.' },
    ],
    knowledgeBase: `Bảo hiểm bệnh hiểm nghèo. Bản chất: hỗ trợ tài chính khi mắc bệnh hiểm nghèo thuộc phạm vi bảo hiểm; quyền lợi chi trả dựa trên chẩn đoán và số tiền bảo hiểm, KHÔNG phải hoàn lại chi phí bệnh viện thực tế.
Độ tuổi: tham gia 16–55 tuổi, có thể gia hạn tới 65 tuổi theo điều kiện. Thời hạn: 1 năm, đóng phí hàng năm.
Thời gian chờ: nhồi máu cơ tim lần đầu/đột quỵ lần đầu 90 ngày; ung thư giai đoạn sớm/giai đoạn cuối 365 ngày; một số bệnh khác 90 ngày; người được bảo hiểm phải sống tối thiểu 7 ngày sau chẩn đoán.
Quyền lợi: chi trả 100% số tiền bảo hiểm cho các quyền lợi đủ điều kiện (ung thư giai đoạn sớm/cuối, nhồi máu cơ tim lần đầu, đột quỵ lần đầu).
Gói (Ung thư sớm/Ung thư muộn/NMCT lần đầu/Đột quỵ lần đầu/Tối đa): Silver 60tr/100tr/100tr/100tr/100tr; Gold 60tr/150tr/150tr/150tr/150tr; Platinum 60tr/200tr/200tr/200tr/200tr.
Phí theo tuổi (Silver/Gold/Platinum): 16–24: 290k/420k/739k; 35–39: 480k/710k/1,245tr; 40–44: 800k/1,18tr/2,076tr; 45–49: 1,27tr/1,89tr/3,332tr; 50–55: 2,18tr/3,23tr/5,713tr; 56–65 (gia hạn liên tục từ trước 55 tuổi): 4,06tr/6,02tr/10,644tr.
Objection: "Tôi đã có BHYT rồi", "Tôi đã có bảo hiểm sức khỏe", "Nếu tôi nằm viện thì có được thanh toán không?", "Nếu mắc bệnh nhưng chi phí thấp thì có được nhận không?"
Cách giải thích cốt lõi: sản phẩm chi trả theo quyền lợi chẩn đoán/số tiền bảo hiểm, không đơn thuần hoàn chi phí thực tế.`,
  },
  {
    id: 'combo-ca-nhan-hoa',
    order: 16,
    name: 'Combo cá nhân hoá (Chứng chỉ tiền gửi + M-First + World Elite)',
    shortName: 'Combo cá nhân hoá',
    shortDescription: 'Gói tư vấn cá nhân hoá cho khách hàng ưu tiên (affluent/HNW): kết hợp CCTG lãi cao, đặc quyền M-First và thẻ World Elite.',
    targetAudience: 'Khách hàng tài sản lớn (affluent/HNW), đã có quan hệ với nhiều ngân hàng, kỳ vọng dịch vụ cá nhân hoá.',
    benefits: [
      'Chứng chỉ tiền gửi (CCTG) sinh lời tới 6,9%/năm, có thể tới 7,6%/năm theo chương trình M-First',
      'M-First: chuyên viên quan hệ riêng, ưu tiên giao dịch, đặc quyền lifestyle (lounge, sự kiện, resort...)',
      'Thẻ World Elite: hoàn 10% du lịch/ẩm thực/khách sạn (tối đa 36 triệu/năm), miễn phí ngoại tệ, hơn 1.200 phòng chờ toàn cầu',
    ],
    basicConditions: 'Đáp ứng 1 trong các tiêu chí M-First (tài sản ≥1 tỷ, dư nợ tín dụng ≥5 tỷ, tiền gửi không kỳ hạn ≥150 triệu, phí bảo hiểm nhân thọ ≥100 triệu, hoặc chuyển tiền quốc tế lũy kế 12 tháng ≥3 tỷ).',
    keySellingPoints: [
      'M-First là PHÂN KHÚC/GIẢI PHÁP khách hàng ưu tiên, không phải 1 sản phẩm đơn lẻ — chỉ cần đạt 1 trong các tiêu chí (OR, không phải AND)',
      'Cá nhân hoá theo đúng nhu cầu tổng thể, không giới thiệu tất cả sản phẩm cùng lúc',
      'CCTG có thể chuyển nhượng trước hạn, xem lợi tức tham chiếu theo thời gian nắm giữ thực tế',
    ],
    objectionBank: [
      { question: 'Tôi có được M-First không?', sampleAnswer: 'Chỉ cần đạt MỘT trong các tiêu chí (tài sản, dư nợ tín dụng, tiền gửi không kỳ hạn, phí bảo hiểm nhân thọ, hoặc doanh số chuyển tiền quốc tế) là có thể thuộc diện xem xét — không cần đạt tất cả cùng lúc.' },
      { question: 'CCTG có rủi ro không?', sampleAnswer: 'Chứng chỉ tiền gửi có tính chất tương đương khoản tiền gửi, có thể chuyển nhượng linh hoạt — mức lãi cụ thể tuỳ chương trình/thời điểm nên sẽ báo chính xác theo đúng thời điểm đăng ký thay vì chốt cứng một con số.' },
      { question: 'Ba ngân hàng khác đang mời tôi rồi.', sampleAnswer: 'Vậy có thể chia sẻ thêm anh đang ưu tiên điều gì nhất ở dịch vụ ngân hàng, để đề xuất đúng combo phù hợp thay vì chỉ so lãi suất đơn thuần.' },
    ],
    complianceNote: 'M-First là phân khúc/giải pháp khách hàng, không phải sản phẩm tài chính đơn lẻ — không giới thiệu như 1 sản phẩm có thể "mua" trực tiếp.',
    knowledgeBase: `Combo cá nhân hoá — kết hợp 3 cấu phần cho khách hàng affluent/HNW:
(1) Chứng chỉ tiền gửi (CCTG): giấy tờ có giá do MSB phát hành, tương đương khoản tiền gửi, có thể chuyển nhượng theo quy định. Giá trị danh nghĩa từ 100.000 VNĐ; giao dịch chuyển nhượng online, khung giờ 8:00–21:00 thứ Hai–thứ Sáu; mức tham gia tối thiểu 11 triệu VND theo FAQ; không phí chuyển/nhận chuyển nhượng; lợi tức miễn thuế TNCN. Lãi/lợi tức: trang sản phẩm nêu "sinh lời đến 6,9%/năm"; trang M-First nêu CCTG có thể tới 7,6%/năm cho khách hàng/điều kiện thuộc chương trình tương ứng — KHÔNG hard-code một mức lãi duy nhất, cần gắn theo segment/chương trình/thời điểm. Khi chuyển nhượng trước hạn, hệ thống hiển thị mức lợi tức tham chiếu theo thời gian nắm giữ thực tế.
(2) M-First — KHÔNG phải một sản phẩm tài chính đơn lẻ, là PHÂN KHÚC/GIẢI PHÁP khách hàng ưu tiên của MSB. Điều kiện (đạt MỘT TRONG CÁC tiêu chí — logic OR không phải AND): tài sản bình quân 90 ngày ≥1 tỷ VND; dư nợ tín dụng quy đổi bình quân 90 ngày ≥5 tỷ VND; số dư tiền gửi không kỳ hạn bình quân 90 ngày ≥150 triệu VND; tổng phí bảo hiểm nhân thọ còn hiệu lực mua qua MSB ≥100 triệu VND; doanh số chuyển tiền quốc tế đi lũy kế 12 tháng ≥3 tỷ VND. Đặc quyền: CCTG ưu đãi, thẻ tín dụng cao cấp, hạn mức tín dụng cao, khoản vay có TSBĐ, thấu chi, dịch vụ FX, tiết kiệm ưu đãi (tài chính); sự kiện cao cấp, chăm sóc sức khỏe, resort, lounge sân bay, fitness/yoga, voucher Xanh SM, giáo dục/đầu tư (lifestyle); trợ lý tài chính cá nhân, tư vấn FX/đầu tư, hỗ trợ đời sống, M-Private, hotline ưu tiên (dịch vụ); tích điểm M-Point x4 Standard. AI nên nhận diện M-First qua tín hiệu tài sản/dòng tiền lớn rồi khai thác mục tiêu tài chính, KHÔNG giới thiệu tất cả đặc quyền cùng lúc.
(3) MSB Mastercard World Elite: thẻ tín dụng cao cấp nhất. Hoàn 10% chi tiêu du lịch/thời trang cao cấp/ẩm thực/khách sạn 5 sao, tối đa 36 triệu/năm; miễn 100% phí giao dịch ngoại tệ; hơn 1.200 phòng chờ toàn cầu không giới hạn cho chủ thẻ, +10 lượt/năm cho người thân; trả góp 0% lãi suất tới 12 tháng tại một số đối tác. Phí thường niên 15.000.000 VNĐ/năm (hoàn 100% nếu chi ≥100 triệu/30 ngày đầu, hoàn 50% nếu chi ≥30 triệu); hạn mức tối thiểu 500 triệu; hiệu lực thẻ 5 năm; đối tượng sơ bộ 18–65 tuổi, lương chuyển khoản từ 200 triệu/tháng. Nhóm "thẻ đen"/KHUT-HNW: tuổi 25–65, không nợ nhóm 2 (12 tháng)/nhóm 3 (24 tháng), tổng số dư tiết kiệm+trái phiếu bình quân 3 tháng ≥10 tỷ HOẶC lương 3 tháng liên tiếp tối thiểu 100 triệu.
Ví dụ objection nhóm CCTG+M-First (advanced sales): "Tôi đang gửi tiết kiệm rồi, tại sao phải mua CCTG?", "CCTG có rủi ro không?", "Tôi cần tiền trước hạn thì sao?", "Tôi có 10 tỷ thì có được M-First không?", "Tôi chỉ đạt một tiêu chí M-First thôi có đủ không?", "Tôi muốn một thẻ có lounge quốc tế."`,
  },
  {
    id: 'chuyen-tien-quoc-te',
    order: 17,
    name: 'Chuyển tiền quốc tế / mua bán ngoại tệ',
    shortName: 'Chuyển tiền quốc tế',
    shortDescription: 'Dịch vụ chuyển tiền quốc tế (SWIFT) và mua bán ngoại tệ cho khách hàng cá nhân/doanh nghiệp.',
    targetAudience: 'Khách hàng có nhu cầu thanh toán/nhận tiền quốc tế, đặc biệt khách affluent giao dịch thường xuyên.',
    benefits: [
      'Xử lý chuyển tiền quốc tế theo cam kết thời gian rõ ràng',
      'Khách thuộc diện M-First được ưu tiên xử lý nhanh hơn',
    ],
    basicConditions: 'Cần cung cấp số tiền, loại ngoại tệ, thông tin người nhận theo quy định chuyển tiền quốc tế hiện hành.',
    keySellingPoints: [
      'Phù hợp nhu cầu thanh toán đối tác nước ngoài/nhập khẩu gấp',
      'Có thể gắn với đặc quyền M-First (ưu tiên xử lý, tư vấn FX) nếu khách đủ điều kiện',
    ],
    objectionBank: [
      { question: 'Xử lý được nhanh không?', sampleAnswer: 'Cần xác nhận số tiền và loại ngoại tệ cụ thể để cam kết đúng thời gian xử lý, đặc biệt nếu thuộc diện khách hàng M-First sẽ được ưu tiên xử lý nhanh hơn.' },
    ],
    knowledgeBase: `Chuyển tiền quốc tế/mua bán ngoại tệ — dịch vụ SWIFT/FX cho khách hàng cá nhân và doanh nghiệp, thường gắn với nhu cầu thanh toán đối tác nước ngoài hoặc nhập khẩu.
Đây là 1 trong các đặc quyền tài chính của phân khúc M-First (dịch vụ chuyển tiền quốc tế/FX, tư vấn FX) — khách hàng đạt tiêu chí M-First (bao gồm cả tiêu chí "doanh số chuyển tiền quốc tế đi lũy kế 12 tháng ≥3 tỷ VND") được ưu tiên xử lý và tư vấn FX riêng.
Lưu ý dữ liệu: KB hiện chưa có bảng phí/tỷ giá/thời gian xử lý chi tiết cho dịch vụ này — khi role-play, Sales cần cam kết THỜI GIAN xử lý rõ ràng và hỏi đúng số tiền/loại ngoại tệ, không tự đưa ra tỷ giá hay mức phí cụ thể chưa được xác nhận.`,
  },
  {
    id: 'vay-mua-oto-bds-ca-nhan',
    order: 18,
    name: 'Vay tiêu dùng có tài sản bảo đảm (mua ô tô/BĐS cá nhân)',
    shortName: 'Vay mua ô tô/BĐS cá nhân',
    shortDescription: 'Vay tiêu dùng có TSBĐ phục vụ mua ô tô/BĐS cá nhân, hạn mức tới 5 tỷ, lãi từ 0,65%/tháng, vay tới 10 năm.',
    targetAudience: 'Khách hàng cá nhân có tài sản đảm bảo, thu nhập ổn định, cần vốn mua ô tô hoặc BĐS cá nhân.',
    benefits: [
      'Hạn mức tới 5 tỷ đồng, thời gian vay tới 10 năm',
      'Lãi suất từ 0,65%/tháng',
      'Phê duyệt nhanh, khoảng 8 giờ làm việc kể từ khi đủ hồ sơ',
    ],
    basicConditions: 'Thu nhập tối thiểu 8 triệu/tháng (Hà Nội/TP.HCM) hoặc 6 triệu/tháng (tỉnh khác), có tài sản đảm bảo, thời gian công tác tối thiểu 6 tháng.',
    keySellingPoints: [
      'Hạn mức và thời gian vay linh hoạt, phù hợp cả mua ô tô lẫn BĐS cá nhân',
      'Phê duyệt nhanh trong ngày làm việc nếu đủ hồ sơ',
      'Với khách VIP/M-First có thể có ưu đãi riêng về hạn mức/điều kiện',
    ],
    objectionBank: [
      { question: 'Vay bên ngân hàng khác lãi thấp hơn.', sampleAnswer: 'Có thể so sánh cụ thể theo đúng hồ sơ và tài sản đảm bảo — nếu là khách hàng ưu tiên (M-First) sẽ có thêm ưu đãi riêng ngoài lãi suất niêm yết thông thường.' },
      { question: 'Bao lâu được giải ngân?', sampleAnswer: 'Phê duyệt khoảng 8 giờ làm việc kể từ khi đủ hồ sơ, giải ngân ngay sau khi hoàn tất đăng ký giao dịch bảo đảm.' },
    ],
    knowledgeBase: `Vay tiêu dùng có tài sản bảo đảm. Nhu cầu: vay phục vụ tiêu dùng cá nhân, bao gồm mua ô tô/BĐS cá nhân theo phương án vay phù hợp.
Thông số: hạn mức tới 5 tỷ đồng; lãi suất từ 0,65%/tháng; thời gian vay tới 10 năm; phê duyệt khoảng 8 giờ làm việc kể từ khi đủ hồ sơ.
Điều kiện: thu nhập tối thiểu 8 triệu/tháng tại Hà Nội/TP.HCM, 6 triệu/tháng tại tỉnh/thành khác; thời gian công tác tối thiểu 6 tháng (3 tháng với một số lãnh đạo cấp cao) hoặc biên chế nhà nước/HĐLĐ từ 12 tháng; có tài sản đảm bảo.
Hồ sơ: CMND/CCCD, sổ hộ khẩu/giấy tờ cư trú, VNeID nếu yêu cầu, giấy chứng nhận TSBĐ, chứng minh thu nhập, phương án vay.
Phí/chi phí liên quan: phí định giá tài sản đảm bảo, phí công chứng, phí đăng ký giao dịch bảo đảm, bảo hiểm tài sản theo yêu cầu.
Nghĩa vụ: gốc quá hạn có thể chịu lãi suất bằng 150% lãi suất trong hạn; lãi chậm trả có thể phát sinh theo hợp đồng/chính sách. Không diễn đạt các mức lãi/phạt như "luôn luôn" nếu chưa kiểm tra hợp đồng/chính sách hiện hành.`,
  },
];

/** Gọi bởi hydrateContentFromBackend() sau khi fetch bảng products từ
 * Supabase — thay hẳn seed tĩnh bằng dữ liệu thật. */
export function replaceProducts(next: Product[]) {
  products = next;
}

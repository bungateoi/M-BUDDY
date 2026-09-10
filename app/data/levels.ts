import type { Level } from './types';

// Nguồn: /docs/roleplay-scenarios.md — 5 persona x 5 sản phẩm = 25 level.
// id = "{chapterNumber}.{productOrder}" (productOrder theo thứ tự trong products.ts:
// 1 tiết kiệm online, 2 thẻ tín dụng, 3 vay tiêu dùng, 4 bảo hiểm liên kết, 5 combo)
// SEED mặc định, xem comment tương tự ở đầu app/data/products.ts.
export let levels: Level[] = [
  // ===== CHẶNG 1 — Nội trợ tiết kiệm (★) =====
  {
    id: '1.1',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'tiet-kiem-online',
    starRating: 1,
    openingLine:
      'Cô vẫn quen ra quầy gửi tiết kiệm cho chắc, gửi online cô sợ mất tiền lắm, lỡ bị hack tài khoản thì sao?',
    sampleFlow: [
      'Nhân viên trấn an: so sánh gửi online với gửi tại quầy — tiền vẫn nằm trong hệ thống ngân hàng, có mã OTP xác nhận riêng từng giao dịch.',
      'Đưa ví dụ cụ thể: "Cô chỉ cần 3 bước trên app, giống như cô nhắn tin Zalo cho con vậy đó."',
      'Nhấn mạnh lợi ích thực tế: không phải đi lại, không phải xếp hàng, lãi suất online thường nhỉnh hơn tại quầy.',
      'Đề xuất: làm mẫu ngay tại chỗ một lần để khách yên tâm.',
    ],
    objectionBank: [
      {
        trigger: 'Lỡ thao tác sai bấm nhầm mất tiền?',
        guidance: 'Giải thích có bước xác nhận lại trước khi hoàn tất, không mất tiền do bấm nhầm.',
      },
      {
        trigger: 'Con cô ở xa, ai giúp cô khi cần?',
        guidance: 'Nhân viên hướng dẫn lưu số hotline hỗ trợ 24/7, có thể gọi bất cứ lúc nào.',
      },
    ],
    winCriteria: 'Khách đồng ý thử mở tiết kiệm online, hoặc yêu cầu nhân viên hướng dẫn thao tác cụ thể trên app.',
  },
  {
    id: '1.2',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'the-tin-dung',
    starRating: 1,
    openingLine:
      'Thẻ tín dụng là vay nợ đúng không? Cô sợ xài quá tay rồi nợ nần, thấy trên báo đài nói nhiều người vỡ nợ vì thẻ.',
    sampleFlow: [
      'Định vị lại: thẻ tín dụng là công cụ quản lý chi tiêu có hạn mức kiểm soát, không phải khoản vay tự động.',
      'Ví dụ gần gũi: giống như một "cuốn sổ ghi nợ chợ" nhưng có hạn mức cứng và sao kê rõ ràng hàng tháng.',
      'Nhấn điểm khách kiểm soát được: khách tự đặt hạn mức thấp ban đầu, có thể khoá thẻ tạm thời qua app bất cứ lúc nào.',
      'Gợi ý lợi ích gia đình: dùng thẻ thanh toán siêu thị/điện nước, có ưu đãi hoàn tiền, dễ theo dõi hơn tiền mặt.',
    ],
    objectionBank: [
      {
        trigger: 'Lỡ con cái xài thẻ của cô thì sao?',
        guidance: 'Có thể đặt thông báo biến động số dư ngay lập tức, khoá thẻ tức thì nếu nghi ngờ.',
      },
      {
        trigger: 'Phí thường niên có mắc không?',
        guidance: 'Trả lời trung thực, so sánh với lợi ích hoàn tiền/ưu đãi nếu dùng đều.',
      },
    ],
    winCriteria: 'Khách hết lo về "vay nợ", đồng ý tìm hiểu thêm hạn mức phù hợp hoặc đăng ký mở thẻ.',
  },
  {
    id: '1.3',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'vay-tieu-dung',
    starRating: 1,
    openingLine:
      'Nhà cô đang cần sửa lại mái nhà, nhưng vay ngân hàng nghe thủ tục rắc rối lắm, hay là vay nóng ngoài cho lẹ?',
    sampleFlow: [
      'Khai thác nhu cầu cụ thể: hỏi rõ số tiền cần, mục đích (sửa nhà/mua sắm), thời gian cần gấp hay không.',
      'So sánh trực diện với "vay nóng": lãi suất minh bạch cố định, không lãi chồng lãi, không bị đe doạ đòi nợ.',
      'Trấn an thủ tục: liệt kê ngắn gọn giấy tờ cần, thời gian giải ngân dự kiến, không cần thế chấp nếu khoản vay nhỏ.',
      'Đưa ví dụ trả góp hàng tháng cụ thể để khách hình dung được khả năng chi trả.',
    ],
    objectionBank: [
      {
        trigger: 'Thủ tục có lâu không, sợ chờ lâu quá?',
        guidance: 'Nêu rõ thời gian xử lý dự kiến, so sánh nhanh hơn nhiều lần so với chờ vay nóng "gãy gánh".',
      },
      {
        trigger: 'Lỡ trả trễ 1 tháng bị phạt nặng không?',
        guidance: 'Giải thích rõ chính sách trễ hạn, không mập mờ.',
      },
    ],
    winCriteria: 'Khách đồng ý cung cấp thông tin để tư vấn hạn mức vay cụ thể, không còn ý định tìm vay nóng.',
  },
  {
    id: '1.4',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'bao-hiem-lien-ket',
    starRating: 1,
    openingLine:
      'Bảo hiểm nghe phức tạp lắm, đóng tiền vào rồi không biết có lấy lại được không, cô không hiểu mấy cái đầu tư gì đâu.',
    sampleFlow: [
      'Đơn giản hoá tối đa: chỉ nói về mục đích bảo vệ tài chính gia đình khi có rủi ro (ốm đau, tai nạn), không nhắc đến thuật ngữ đầu tư.',
      'Dùng câu hỏi mở nhẹ nhàng: "Nếu chẳng may cô hay chú ốm nặng, ai là người lo viện phí và chi tiêu gia đình?"',
      'Nêu ví dụ cụ thể, số tiền nhỏ dễ hình dung: "Mỗi tháng để dành một khoản bằng tiền chợ vài ngày, đổi lại cả nhà được bảo vệ."',
      'Tuyệt đối tránh liệt kê điều khoản phức tạp ngay từ đầu — chỉ giới thiệu khi khách đã quan tâm.',
    ],
    objectionBank: [
      {
        trigger: 'Đóng bao lâu, có rút ra giữa chừng được không?',
        guidance: 'Trả lời thẳng, rõ ràng về thời hạn và điều kiện rút, không né tránh.',
      },
      {
        trigger: 'Nghe hàng xóm nói đóng bảo hiểm bị mất tiền?',
        guidance: 'Ghi nhận lo ngại, giải thích khác biệt giữa sản phẩm này và trường hợp họ nghe kể.',
      },
    ],
    winCriteria: 'Khách hiểu đúng mục đích bảo vệ (không nhầm là đầu tư), đồng ý nghe thêm về mức phí phù hợp.',
  },
  {
    id: '1.5',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'combo',
    starRating: 1.5,
    openingLine: 'Cô chỉ cần gửi tiết kiệm thôi, mấy cái khác cô không cần đâu, đừng giới thiệu thêm cho rối.',
    sampleFlow: [
      'Tôn trọng yêu cầu ban đầu, không ép — bắt đầu đúng với tiết kiệm online như khách muốn.',
      'Trong lúc tư vấn, đặt câu hỏi khai thác nhẹ nhàng: "Cô có hay dùng thẻ ATM rút tiền không, có bao giờ cần một khoản vay gấp không?"',
      'Khi phát hiện nhu cầu ẩn (VD: khách nhắc tới việc sắp sửa nhà), mới giới thiệu thêm 1 sản phẩm liên quan — không giới thiệu tất cả cùng lúc.',
      'Đề xuất combo như một "giải pháp tiết kiệm hơn" chứ không phải bán thêm: "Nếu cô mở tiết kiệm và làm thêm thẻ ghi nợ liên kết, cô không mất phí quản lý tài khoản riêng."',
    ],
    objectionBank: [
      {
        trigger: 'Cô đã nói không cần rồi mà?',
        guidance: 'Xin lỗi nhẹ nhàng, xác nhận lại đúng nhu cầu ban đầu, chỉ đề cập 1 lần duy nhất rồi dừng nếu khách từ chối.',
      },
    ],
    winCriteria:
      'Khai thác được ít nhất 1 nhu cầu ẩn và đề xuất đúng 1 sản phẩm bổ sung phù hợp, không làm khách khó chịu vì bị chào mời dồn dập.',
  },

  // ===== CHẶNG 2 — Nhân viên văn phòng trẻ (★★) =====
  {
    id: '2.1',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'tiet-kiem-online',
    starRating: 2,
    openingLine: 'Lương về là mình tiêu gần hết, cuối tháng chẳng còn dư mà gửi tiết kiệm.',
    sampleFlow: [
      'Đề xuất giải pháp "tiết kiệm tự động" ngay khi lương về, thay vì chờ cuối tháng mới gửi.',
      'Đưa con số cụ thể nhỏ, dễ chấp nhận: "Chỉ cần trích 10% lương ngay khi nhận, sau 1 năm sẽ có một khoản kha khá mà không cảm thấy thiếu."',
      'Nhấn mạnh thao tác 100% qua app, thiết lập 1 lần là tự động, không cần nhớ để làm thủ công mỗi tháng.',
    ],
    objectionBank: [
      {
        trigger: 'Lỡ tháng nào cần tiền gấp thì sao?',
        guidance: 'Giải thích có thể tất toán/rút linh hoạt trên app, không mất nhiều thời gian.',
      },
    ],
    winCriteria: 'Khách đồng ý thiết lập trích tiết kiệm tự động hàng tháng.',
  },
  {
    id: '2.2',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'the-tin-dung',
    starRating: 2,
    openingLine: 'Mình hay mua hàng online, order đồ ăn, xem có thẻ nào hoàn tiền tốt không?',
    sampleFlow: [
      'Khai thác nhanh thói quen chi tiêu: mua sắm online, ăn uống, đi lại — để chọn đúng dòng thẻ có ưu đãi phù hợp.',
      'Đưa số liệu cụ thể: mức hoàn tiền %/danh mục, ưu đãi đối tác đang có.',
      'Chốt nhanh, đúng phong cách khách: không lan man, đi thẳng vào lợi ích + bước đăng ký.',
    ],
    objectionBank: [
      {
        trigger: 'Phí thường niên có đáng không?',
        guidance: 'So sánh nhanh: hoàn tiền ước tính theo mức chi tiêu hiện tại > phí thường niên.',
      },
    ],
    winCriteria: 'Khách chốt mở thẻ ngay trong buổi tư vấn.',
  },
  {
    id: '2.3',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'vay-tieu-dung',
    starRating: 2,
    openingLine: 'Mình chưa cần vay gì cả, lương đủ sống mà.',
    sampleFlow: [
      'Định vị sản phẩm là "hạn mức dự phòng", không phải khoản vay phải dùng ngay: mở sẵn để chủ động khi có nhu cầu bất ngờ (du lịch, mua sắm gấp, sự kiện phát sinh).',
      'Giữ ngắn gọn, không ép: chỉ nêu lợi ích chính rồi để khách tự quyết.',
      'Nhấn điểm không phát sinh phí nếu không sử dụng đến hạn mức.',
    ],
    objectionBank: [
      {
        trigger: 'Mở sẵn có ảnh hưởng gì đến điểm tín dụng không?',
        guidance: 'Trả lời trung thực, ngắn gọn, đúng trọng tâm.',
      },
    ],
    winCriteria: 'Khách đồng ý mở hạn mức dự phòng dù hiện tại chưa dùng đến.',
  },
  {
    id: '2.4',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'bao-hiem-lien-ket',
    starRating: 2.5,
    openingLine: 'Mình còn trẻ, khoẻ mạnh, bảo hiểm để sau đi, giờ ưu tiên hưởng thụ cuộc sống đã.',
    sampleFlow: [
      'Không phản bác trực tiếp — đặt câu hỏi gợi mở: "Bạn có biết phí bảo hiểm ở tuổi này thấp hơn rất nhiều so với 10 năm sau không?"',
      'Đưa góc nhìn tài chính: mua sớm = khoá được mức phí thấp dài hạn, không phải mua vì "sợ bệnh".',
      'Gắn với mục tiêu cá nhân của khách (VD: mua nhà, kết hôn) — bảo hiểm như một phần kế hoạch tài chính dài hạn, không phải chi phí phát sinh.',
    ],
    objectionBank: [
      {
        trigger: 'Để dành tiền đó đi du lịch còn hơn?',
        guidance: 'Không phủ nhận nhu cầu hưởng thụ, đề xuất mức phí rất nhỏ không ảnh hưởng ngân sách du lịch.',
      },
    ],
    winCriteria: 'Khách đồng ý cân nhắc, không còn gạt phắt là "chưa cần".',
  },
  {
    id: '2.5',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'combo',
    starRating: 2,
    openingLine: 'Có gói nào gộp lại rẻ hơn không, mình không muốn đăng ký lắt nhắt từng cái mất thời gian?',
    sampleFlow: [
      'Đề xuất combo thẳng: tiết kiệm tự động + thẻ tín dụng hoàn tiền, tính luôn phần tiết kiệm phí nếu đăng ký chung.',
      'Chốt nhanh bằng một bảng so sánh ngắn: "mua lẻ tốn X, mua combo tốn Y → tiết kiệm Z".',
      'Xác nhận đăng ký ngay trong buổi nói chuyện, đúng phong cách quyết nhanh của khách.',
    ],
    objectionBank: [
      {
        trigger: 'Combo có ràng buộc gì không, huỷ giữa chừng được không?',
        guidance: 'Trả lời rõ ràng, không giấu điều khoản.',
      },
    ],
    winCriteria: 'Khách chốt combo ngay, không cần suy nghĩ thêm nhiều ngày.',
  },

  // ===== CHẶNG 3 — Chủ hộ kinh doanh (★★★) =====
  {
    id: '3.1',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'tiet-kiem-online',
    starRating: 3,
    openingLine: 'Anh có ít vốn nhàn rỗi tạm thời, gửi tiết kiệm ở đây lãi suất bao nhiêu, có hơn ngân hàng khác không?',
    sampleFlow: [
      'Đưa ngay lãi suất cụ thể theo kỳ hạn, không vòng vo.',
      'So sánh trực diện với mặt bằng thị trường nếu khách hỏi, trung thực nếu không nhỉnh hơn — bù lại bằng tính linh hoạt kỳ hạn/rút gốc linh hoạt.',
      'Đề xuất kỳ hạn ngắn phù hợp với "vốn nhàn rỗi tạm thời" thay vì ép kỳ hạn dài.',
    ],
    objectionBank: [
      {
        trigger: 'Ngân hàng X trả lãi cao hơn 0.3%?',
        guidance: 'Thừa nhận nếu đúng, đưa điểm bù lại (linh hoạt, dịch vụ, tốc độ xử lý).',
      },
    ],
    winCriteria: 'Khách đồng ý gửi tối thiểu 1 kỳ hạn thử nghiệm.',
  },
  {
    id: '3.2',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'the-tin-dung',
    starRating: 3,
    openingLine: 'Anh có sẵn thẻ ghi nợ để chi tiêu cửa hàng rồi, cần gì thêm thẻ tín dụng nữa?',
    sampleFlow: [
      'Phân biệt rõ mục đích: thẻ tín dụng dùng cho chi tiêu vận hành nhỏ lẻ (mua vật tư, thanh toán nhà cung cấp gấp), tách bạch khỏi vốn kinh doanh chính trong tài khoản ghi nợ.',
      'Nhấn điểm dòng tiền: dùng thẻ tín dụng giúp giữ vốn lưu động lâu hơn (trả sau 45 ngày miễn lãi) thay vì rút tiền mặt ngay.',
      'Đưa ví dụ tình huống cụ thể liên quan ngành hàng của khách.',
    ],
    objectionBank: [
      {
        trigger: 'Lỡ dùng quá tay ảnh hưởng dòng tiền kinh doanh?',
        guidance: 'Đề xuất hạn mức phù hợp quy mô kinh doanh, không đề xuất hạn mức quá cao.',
      },
    ],
    winCriteria: 'Khách hiểu rõ lợi ích tách bạch dòng tiền, đồng ý mở thẻ với hạn mức phù hợp.',
  },
  {
    id: '3.3',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'vay-tieu-dung',
    starRating: 3,
    openingLine: 'Anh cần vốn xoay vòng nhập hàng đợt tới, lãi suất bên này sao, giải ngân nhanh không?',
    sampleFlow: [
      'Trả lời thẳng bằng số liệu: lãi suất theo kỳ hạn, thời gian giải ngân dự kiến cụ thể (VD: 3–5 ngày làm việc).',
      'Xử lý câu hỏi khó về lãi suất bằng cách giải thích cách tính (cố định hay giảm dần), không né tránh.',
      'Đề xuất kỳ hạn vay khớp với chu kỳ xoay vòng vốn của khách (theo mùa vụ nhập hàng).',
    ],
    objectionBank: [
      {
        trigger: 'Sao lãi suất bên này cao hơn tôi tính?',
        guidance: 'Giải thích rõ cách tính lãi (dư nợ giảm dần vs cố định), đối chiếu số liệu cụ thể để khách so sánh đúng bản chất.',
      },
      {
        trigger: 'Giải ngân có đúng hẹn không, trễ ảnh hưởng lịch nhập hàng?',
        guidance: 'Cam kết mốc thời gian cụ thể, nêu rõ điều kiện để đảm bảo đúng tiến độ.',
      },
    ],
    winCriteria: 'Khách đồng ý nộp hồ sơ vay với hạn mức và kỳ hạn cụ thể đã thống nhất.',
  },
  {
    id: '3.4',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'bao-hiem-lien-ket',
    starRating: 3.5,
    openingLine: 'Anh còn đang bận xoay vốn kinh doanh, bảo hiểm để tính sau, giờ ưu tiên dòng tiền hơn.',
    sampleFlow: [
      'Không tranh luận trực tiếp về ưu tiên — đặt câu hỏi liên hệ tới rủi ro kinh doanh: "Nếu anh phải nằm viện 1–2 tháng, ai vận hành cửa hàng, dòng tiền có bị gián đoạn không?"',
      'Định vị bảo hiểm như một "quỹ dự phòng rủi ro cho chính người trụ cột", không cạnh tranh với vốn kinh doanh.',
      'Đề xuất mức phí nhỏ, không ảnh hưởng đáng kể dòng tiền hiện tại.',
    ],
    objectionBank: [
      {
        trigger: 'Tiền đó để đầu tư thêm vào cửa hàng còn lời hơn?',
        guidance: 'Ghi nhận logic đầu tư, nhưng nhấn mạnh đây là quỹ dự phòng rủi ro, khác bản chất với vốn đầu tư sinh lời.',
      },
    ],
    winCriteria: 'Khách đồng ý dành một khoản nhỏ, tách biệt khỏi vốn kinh doanh, cho mục đích bảo vệ tài chính cá nhân.',
  },
  {
    id: '3.5',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'combo',
    starRating: 3.5,
    openingLine: 'Anh có ít tài sản tích luỹ rồi, muốn nghe giải pháp tổng thể luôn, đừng giới thiệu từng cái lẻ tẻ mất thời gian.',
    sampleFlow: [
      'Khai thác nhanh bức tranh tài chính tổng thể: tài sản hiện có, dòng tiền kinh doanh, mục tiêu dài hạn (mở rộng/để lại cho con cái...).',
      'Đề xuất giải pháp toàn diện có số liệu đi kèm: kỳ hạn tiết kiệm nào, hạn mức thẻ/vay nào, mức phí bảo hiểm nào — trình bày như một bảng tổng hợp ngắn gọn.',
      'Chuẩn bị sẵn số liệu so sánh vì khách hay đối chiếu với ngân hàng khác.',
    ],
    objectionBank: [
      {
        trigger: 'Sao không thấy rẻ hơn tự mua lẻ từng sản phẩm?',
        guidance: 'Đưa bảng số liệu cụ thể chứng minh phần tiết kiệm/ưu đãi khi mua combo.',
      },
    ],
    winCriteria: 'Khách đồng ý với ít nhất 2/4 sản phẩm trong đề xuất combo, dựa trên số liệu đã thuyết phục được.',
  },

  // ===== CHẶNG 4 — Người đa nghi / từng bị lừa (★★★★) =====
  {
    id: '4.1',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'tiet-kiem-online',
    starRating: 4,
    openingLine: 'Trước tôi từng bị lừa mất tiền qua app rồi, giờ nghe "online" là tôi ngại lắm.',
    sampleFlow: [
      'Không vội bán hàng — dành thời gian lắng nghe khách kể lại chuyện cũ, thể hiện sự thấu hiểu thật sự.',
      'Giải thích khác biệt cụ thể giữa ứng dụng ngân hàng chính thức và các app/link lừa đảo (dấu hiệu nhận biết, cơ chế bảo mật OTP/sinh trắc học).',
      'Đề xuất bắt đầu với số tiền rất nhỏ để khách tự trải nghiệm an toàn trước khi tin tưởng gửi khoản lớn hơn.',
    ],
    objectionBank: [
      {
        trigger: 'Sao tôi biết đây không phải chiêu trò mới?',
        guidance: 'Không tranh cãi, mời khách tự kiểm tra qua tổng đài chính thức/website ngân hàng để xác minh độc lập.',
      },
    ],
    winCriteria: 'Khách đồng ý thử gửi một khoản nhỏ để tự kiểm chứng, không cần chốt khoản lớn ngay.',
  },
  {
    id: '4.2',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'the-tin-dung',
    starRating: 4,
    openingLine: 'Thẻ tín dụng toàn bẫy nợ, phí ẩn đủ kiểu, tôi không tin đâu.',
    sampleFlow: [
      'Minh bạch hoàn toàn ngay từ đầu: liệt kê rõ tất cả các loại phí có thể phát sinh (thường niên, phí trễ hạn, lãi suất nếu không trả đủ), kể cả phần bất lợi.',
      'Không né tránh câu hỏi khó, chủ động nêu trước cả những nhược điểm.',
      'Đề xuất hạn mức thấp và các công cụ kiểm soát (thông báo biến động, khoá thẻ tức thời) để khách cảm thấy nắm quyền kiểm soát.',
    ],
    objectionBank: [
      {
        trigger: 'Vậy sao ngân hàng không nói rõ từ đầu với người khác?',
        guidance: 'Không biện minh cho ai khác, chỉ cam kết phần tư vấn của mình minh bạch.',
      },
    ],
    winCriteria: 'Khách xác nhận đã hiểu rõ và không còn cảm giác bị giấu diếm thông tin, dù chưa chắc đăng ký ngay.',
  },
  {
    id: '4.3',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'vay-tieu-dung',
    starRating: 4,
    openingLine: 'Vay ngân hàng là dính vào nợ nần, tôi từng thấy người quen vay xong lãi mẹ đẻ lãi con.',
    sampleFlow: [
      'Xác nhận cảm xúc của khách trước, không phản bác ngay.',
      'Giải thích minh bạch cách tính lãi, không có khái niệm "lãi chồng lãi" như vay tín dụng đen, đưa ví dụ số cụ thể từng tháng.',
      'Tuyệt đối không hối thúc — chủ động nói khách có thể về suy nghĩ thêm, không cần quyết định ngay hôm nay.',
    ],
    objectionBank: [
      {
        trigger: 'Tôi cần nghĩ thêm, chưa quyết ngay được.',
        guidance: 'Tôn trọng, không tạo áp lực, để lại thông tin liên hệ và mời khách quay lại khi sẵn sàng.',
      },
    ],
    winCriteria: 'Khách không còn phòng thủ gay gắt, dù có thể chưa chốt vay ngay trong buổi này — mục tiêu là giữ được niềm tin.',
  },
  {
    id: '4.4',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'bao-hiem-lien-ket',
    starRating: 5,
    openingLine:
      'Tôi từng mua bảo hiểm, tư vấn viên hứa đủ thứ, sau này đọc hợp đồng mới biết không như lời nói. Từ đó tôi cạch bảo hiểm luôn.',
    sampleFlow: [
      'Xin lỗi thay cho trải nghiệm xấu khách từng gặp (dù không phải lỗi của mình), thể hiện sự đồng cảm chân thành.',
      'Tuân thủ disclosure tuyệt đối: đọc/chỉ rõ từng điều khoản quan trọng cùng khách, đặc biệt các điểm dễ gây hiểu lầm trước đây (quyền lợi, loại trừ, phí duy trì hợp đồng).',
      'Không dùng bất kỳ lời "hứa" nào ngoài văn bản hợp đồng — mọi cam kết đều trỏ lại điều khoản cụ thể.',
      'Đề xuất khách mang hợp đồng cũ ra để đối chiếu minh bạch nếu có thể.',
    ],
    objectionBank: [
      {
        trigger: 'Sao tôi tin lần này khác lần trước?',
        guidance: 'Không cần khách tin ngay, mời khách tự đọc kỹ hợp đồng, tự do hỏi bất kỳ điều khoản nào trước khi quyết định.',
      },
    ],
    winCriteria:
      'Khách đồng ý đọc thử hợp đồng mẫu hoặc đặt câu hỏi cụ thể — không rời đi trong tức giận. Chốt được hợp đồng là thành công lớn nhưng không phải mục tiêu bắt buộc của level.',
  },
  {
    id: '4.5',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'combo',
    starRating: 4.5,
    openingLine: 'Tôi mới bắt đầu tin lại một chút sau mấy lần nói chuyện trước, nhưng đừng có chào mời dồn dập nha.',
    sampleFlow: [
      'Ghi nhận rõ tiến trình xây dựng niềm tin từ các level trước, cảm ơn khách đã cho cơ hội.',
      'Đề xuất combo rất nhẹ nhàng, đóng khung là "gợi ý tham khảo" chứ không phải chào mời ép buộc.',
      'Ưu tiên tuyệt đối: nếu khách có dấu hiệu do dự, chủ động lùi lại thay vì cố chốt bằng mọi giá.',
    ],
    objectionBank: [
      {
        trigger: 'Nãy giờ tin rồi giờ lại đề xuất thêm nữa à?',
        guidance: 'Xin lỗi nếu khách cảm thấy vậy, khẳng định lại đây chỉ là gợi ý, khách toàn quyền từ chối.',
      },
    ],
    winCriteria:
      'Giữ được niềm tin đến cuối buổi là ưu tiên số 1; nếu khách đồng ý thêm 1 sản phẩm nữa thì là điểm cộng, không bắt buộc.',
  },

  // ===== CHẶNG 5 (BOSS) — Khách VIP / đàm phán cứng (★★★★★) =====
  {
    id: '5.1',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'tiet-kiem-online',
    starRating: 4,
    openingLine: 'Gửi tiết kiệm vài chục tỷ mà lãi suất niêm yết công khai như người thường thì tôi gửi ở đâu chẳng được.',
    sampleFlow: [
      'Không dùng bảng lãi suất đại trà — đề xuất ngay cơ chế lãi suất thoả thuận riêng theo số dư và kỳ hạn.',
      'Giới thiệu dịch vụ cá nhân hoá đi kèm: chuyên viên quan hệ khách hàng riêng, ưu tiên xử lý giao dịch không cần xếp hàng.',
      'Giữ phong thái tự tin, đúng tầm — không giải thích dài dòng những gì khách đã biết.',
    ],
    objectionBank: [
      {
        trigger: 'Ngân hàng khác cũng đề nghị mức tương tự.',
        guidance: 'Đưa thêm giá trị đi kèm ngoài lãi suất (dịch vụ, tốc độ, đặc quyền) để tạo khác biệt.',
      },
    ],
    winCriteria: 'Khách đồng ý gửi ít nhất một phần tài sản với mức lãi suất/dịch vụ đã thoả thuận riêng.',
  },
  {
    id: '5.2',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'the-tin-dung',
    starRating: 4.5,
    openingLine: 'Thẻ vàng thẻ bạc gì tôi có đủ hết rồi, cho tôi xem cái gì đặc biệt hơn.',
    sampleFlow: [
      'Giới thiệu thẳng dòng thẻ cao cấp nhất, nhấn vào đặc quyền độc quyền (phòng chờ sân bay riêng, trợ lý cá nhân, hạn mức không giới hạn theo nhu cầu thực tế) thay vì ưu đãi hoàn tiền đại trà.',
      'Cá nhân hoá theo lối sống khách (du lịch nhiều, chi tiêu cao cấp) nếu có thông tin gợi mở.',
    ],
    objectionBank: [
      {
        trigger: 'Đặc quyền này ngân hàng nào chẳng có?',
        guidance: 'Nêu điểm khác biệt cụ thể, thật sự riêng biệt (không nói chung chung).',
      },
    ],
    winCriteria: 'Khách công nhận điểm khác biệt thực sự và đồng ý mở thẻ cao cấp.',
  },
  {
    id: '5.3',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'vay-tieu-dung',
    starRating: 4.5,
    openingLine: 'Tôi cần hạn mức lớn, lãi suất phải tốt hơn mặt bằng, không thì tôi qua bên khác.',
    sampleFlow: [
      'Không hoảng, giữ thế đàm phán bình đẳng: xác nhận nhu cầu cụ thể rồi đề xuất mức lãi suất ưu tiên có cơ sở (dựa trên tài sản đảm bảo/quan hệ khách hàng lâu năm).',
      'Đàm phán có giới hạn rõ ràng trong thẩm quyền, không hứa hẹn quá mức để rồi thất hứa.',
    ],
    objectionBank: [
      {
        trigger: 'Mức đó vẫn chưa đủ tốt.',
        guidance: 'Đề xuất điều kiện đổi lại (VD: cam kết giao dịch dài hạn) để có thêm dư địa đàm phán, không hạ giá vô điều kiện.',
      },
    ],
    winCriteria: 'Đạt được thoả thuận về hạn mức/lãi suất mà cả hai bên chấp nhận được, không nhượng bộ quá thẩm quyền.',
  },
  {
    id: '5.4',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'bao-hiem-lien-ket',
    starRating: 5,
    openingLine: 'Mức phí này so với quyền lợi tôi thấy chưa tương xứng, tư vấn viên trước không trả lời được câu hỏi của tôi.',
    sampleFlow: [
      'Thể hiện kiến thức sản phẩm vững: trả lời chính xác, có căn cứ mọi câu hỏi kỹ thuật về quyền lợi/loại trừ/cách tính phí.',
      'Đàm phán kỹ về mức phí và quyền lợi trong phạm vi được phép, đưa ra phương án tuỳ chỉnh gói bảo hiểm phù hợp tài sản/nhu cầu khách.',
      'Không né tránh câu hỏi khó — nếu chưa chắc, cam kết xác nhận lại chính xác thay vì trả lời qua loa.',
    ],
    objectionBank: [
      {
        trigger: 'Sao mức phí VIP không thấp hơn tương xứng?',
        guidance: 'Giải thích cơ cấu phí dựa trên quyền lợi mở rộng, không giảm phí tuỳ tiện thiếu căn cứ.',
      },
    ],
    winCriteria: 'Khách công nhận nhân viên nắm vững sản phẩm, đồng ý với gói quyền lợi đã tuỳ chỉnh.',
  },
  {
    id: '5.5',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'combo',
    starRating: 5,
    openingLine:
      'Tôi có tài sản ở nhiều nơi, mục tiêu tài chính dài hạn khá phức tạp, anh/chị đề xuất được gì cho tôi thì nói, không thì đừng mất thời gian của cả hai.',
    sampleFlow: [
      'Khai thác insight tổng thể trước khi đề xuất bất cứ điều gì: tài sản hiện có, mục tiêu dài hạn (kế thừa, mở rộng kinh doanh, nghỉ hưu), khẩu vị rủi ro.',
      'Xây dựng đề xuất combo cá nhân hoá hoàn toàn dựa trên insight vừa khai thác — không dùng kịch bản combo có sẵn.',
      'Trình bày tự tin, súc tích, đi thẳng vào giá trị riêng biệt dành cho khách, chuẩn bị tinh thần bị "dập máy" bất cứ lúc nào nếu không đủ thuyết phục ngay từ đầu.',
      'Đây là level thể hiện rõ nhất tinh thần: khai thác insight đủ sâu + đề xuất combo thuyết phục trước khi khách mất kiên nhẫn.',
    ],
    objectionBank: [
      {
        trigger: 'Nghe vẫn giống công thức chung chung.',
        guidance: 'Quay lại đào sâu thêm 1 insight cụ thể, điều chỉnh đề xuất ngay tại chỗ.',
      },
      {
        trigger: 'Tôi cần thời gian suy nghĩ.',
        guidance: 'Chấp nhận nhưng chốt được bước tiếp theo rõ ràng (hẹn buổi tiếp theo, gửi đề xuất bằng văn bản).',
      },
    ],
    winCriteria:
      'Đề xuất được combo cá nhân hoá dựa trên ít nhất 2–3 insight khai thác được, khách đồng ý bước tiếp theo cụ thể (không nhất thiết phải chốt hợp đồng ngay).',
    isFinalBoss: true,
  },
];

/** Gọi bởi hydrateContentFromBackend() sau khi fetch bảng levels. */
export function replaceLevels(next: Level[]) {
  levels = next;
}

import type { Level } from './types';

// Nguồn: v2_docs/Kich_ban_training_2.md — thay thế hoàn toàn giả định "5
// persona x 5 sản phẩm = 25 level" cũ (docs/roleplay-scenarios.md). Số
// level/chặng giờ KHÔNG cố định: chặng 1/2/3/5 có 4 level, chặng 4 có 3
// level (tổng 19). id vẫn dạng "{chapterNumber}.{thứ tự trong chặng}" —
// KHÔNG còn suy ra trực tiếp từ Product.order (order chỉ còn dùng để sắp
// xếp danh sách sản phẩm trong "Quản trị hành trình & tri thức").
// `trainingScript` chứa NGUYÊN VĂN mục kịch bản tương ứng trong
// Kich_ban_training_2.md (bối cảnh + các mốc thời gian + nhánh phản ứng theo
// cách Sale xử lý + điều kiện WIN/LOSE) — đây là ngữ cảnh CHÍNH cho AI đóng
// vai khách hàng (xem agent/main.py). sampleFlow/objectionBank/winCriteria
// vẫn giữ lại làm bản rút gọn hiển thị UI. SEED mặc định, xem comment ở
// đầu app/data/products.ts.
export let levels: Level[] = [
  // ===== CHẶNG 1 — Bác Lan, nội trợ tiết kiệm (★) =====
  {
    id: '1.1',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'tiet-kiem-ong-vang',
    starRating: 1,
    openingLine: 'Alô? Ai đấy?',
    sampleFlow: [
      'Giới thiệu đầy đủ tên + MSB + nhắc người quen giới thiệu ngay từ câu đầu.',
      'Giải thích lãi suất kiên nhẫn, kèm ví dụ đời thường, sẵn sàng lặp lại nếu bác chưa hiểu.',
      'Hỏi đúng hướng để khai thác nhu cầu ẩn (dùng khoản tiền cho việc gì sau này) thay vì hỏi thẳng số tiền.',
      'Trả lời rõ về rút trước hạn theo đúng đặc điểm kỳ hạn linh hoạt của Ong Vàng trước khi chốt.',
    ],
    objectionBank: [
      { trigger: 'Tôi cũng đang gửi rồi, cái này thì có gì hơn cháu?', guidance: 'So sánh cụ thể với lãi suất tại quầy bác đang gửi, không chỉ nói "cao hơn" chung chung.' },
      { trigger: 'Thế giữa chừng bác cần thì rút được luôn hả cháu, có mất gì không?', guidance: 'Trả lời rõ theo đúng đặc điểm kỳ hạn linh hoạt của Ong Vàng, không mập mờ/né tránh.' },
    ],
    winCriteria:
      'Bác chủ động hỏi cách làm ("có bác gì gọi") sau khi được trả lời rõ về rút trước hạn — Sale chốt ngay, không vòng vo thêm.',
    trainingScript: `Kênh: Call | Sản phẩm: Tiết kiệm Ong Vàng (kỳ hạn linh hoạt)
Bối cảnh: Sổ tiết kiệm 6 tháng ở ngân hàng khác sắp đáo hạn, MSB có data từ người quen giới thiệu.

0:00 – 0:15 — Mở đầu (kiểm tra giới thiệu bản thân)
Bác Lan lên tiếng trước: "Alô? Ai đấy?"
- Sale giới thiệu đầy đủ tên + MSB + nhắc người quen: Bác dịu giọng: "À thế có việc gì thế cháu."
- Sale không nêu tên/đơn vị, vào thẳng bán hàng: Bác cảnh giác, hỏi lại: "Ai đấy? Gọi có việc gì?" Nếu Sale tiếp tục lảng tránh, không trả lời rõ → bác giữ thái độ dè dặt suốt phần sau, khó mở lòng hơn.
- Sale nói nhanh, hối thúc, quên giới thiệu: Bác chững lại: "Lừa đảo à. Tôi không có nhu cầu nhé."

0:15 – 1:00 — Trao đổi lãi suất, vòng hỏi lại
- Sale giải thích kiên nhẫn, có ví dụ đời thường: Bác hỏi tiếp: "Tôi cũng đang gửi rồi, cái này thì có gì hơn cháu?"
- Sale cộc lốc, không giải thích: Bác hỏi lại nhẹ: "Ừ nhưng mấy cái này tôi không hiểu lắm đâu."
- Sale tiếp tục cộc lốc lần nữa: Bác tủi thân, giọng chùng: "Thôi, tôi không có nhu cầu đâu nhé."
- Sale coi thường/mỉa mai: Bác kết thúc ngay: "Thôi, cháu tìm người khác đi." rồi cúp máy.

1:00 – 1:35 — Khai thác nhu cầu ẩn
- Sale hỏi đúng hướng (VD: "Bác định dùng khoản này cho việc gì sau này ạ?"): Bác lộ nhu cầu thật: "Tôi cũng định để dành phòng lúc ốm đau. Nhưng tôi thấy trên báo gửi ngân hàng vẫn mất tiền đầy nên cũng lăn tăn."
- Sale hỏi thẳng số tiền: Bác né nhẹ: "Cái đấy để tôi xem đã, cháu cần biết cụ thể làm gì?"

1:35 – 1:50 — Trấn an
- Sale trấn an có cơ sở: Bác yên tâm, tín hiệu chốt: "Ừ thế cũng được, thế muốn làm thì làm thế nào cháu?"
- Sale trấn an chung chung: Bác vẫn lăn tăn: "An toàn là an toàn thế nào cháu?"

1:50 – 2:15 — Hỏi thêm trước khi quyết định
- Sale trả lời rõ về rút trước hạn, đúng đặc điểm kỳ hạn linh hoạt của sản phẩm Ong Vàng: Bác an tâm hơn: "Thế giữa chừng bác cần thì rút được luôn hả cháu, có mất gì không?"
- Sale mập mờ/né tránh câu hỏi rút trước hạn: Bác chùn lại, giọng dè dặt: "Ơ thế cần rút có bị làm sao không, cháu nói rõ hộ bác cái."

2:15 – 2:30 — Chốt
- Sale chốt ngay, hướng dẫn cụ thể: "Ừ để bác xem, có bác gì gọi." → WIN
- Sale vòng vo thêm: Bác bối rối: "Ừ thôi tôi nghe tham khảo thế đã, có gì tôi gọi?" → nguy cơ mất đà.`,
  },
  {
    id: '1.2',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'tiet-kiem-mang-non',
    starRating: 1,
    openingLine: 'Alô? Ai đấy?',
    sampleFlow: [
      'Giới thiệu tên + MSB rõ ràng, nói rõ ngay lý do gọi (tiết kiệm cho con cháu trong nhà).',
      'Hỏi khéo có cháu nhỏ trong nhà không, không giả định biết trước.',
      'Giải thích rõ, ví dụ đời thường khi bác hỏi khác gì sổ thường.',
      'Giải thích rõ có thể nạp thêm định kỳ, không giới hạn số lần, ai cũng nạp hộ được.',
    ],
    objectionBank: [
      { trigger: 'Cái này khác gì sổ bình thường hả cháu?', guidance: 'So sánh trực tiếp với sổ tiết kiệm hiện có bằng ví dụ dễ hình dung, tránh thuật ngữ.' },
      { trigger: 'Nghĩa là có tiền bác thì thêm vào được luôn à, không phải mở sổ mới đúng không?', guidance: 'Xác nhận rõ có thể nạp thêm định kỳ, không giới hạn số lần, ai cũng nạp hộ được.' },
    ],
    winCriteria: 'Bác thích thú, cần bàn với con trước khi quyết ("để bác về bàn với con đã").',
    trainingScript: `Kênh: Call | Sản phẩm: Tiết kiệm Măng Non
Bối cảnh: Sale gọi điện theo danh sách khách hàng tiềm năng, giới thiệu sản phẩm tiết kiệm dành cho con cháu trong gia đình.

0:00 – 0:20 — Mở đầu (kiểm tra giới thiệu bản thân)
Bác Lan nghe máy: "Alô? Ai đấy?"
- Sale giới thiệu tên + MSB rõ ràng, nói rõ lý do gọi (sản phẩm tiết kiệm cho con cháu trong nhà): Bác dịu giọng: "À, cháu bên MSB à? Ừ, cháu cứ nói xem có việc gì."
- Sale không giới thiệu, hỏi luôn trong nhà có cháu nhỏ không: Bác cảnh giác: "Ai đấy? Gọi có việc gì?."
- Sale nói nhanh, hối thúc, quên giới thiệu: Bác chững lại: "Lừa đảo à. Tôi không có nhu cầu nhé."

0:20 – 0:40 — Khơi gợi nhu cầu
- Sale hỏi khéo, không giả định biết trước: "Không biết nhà mình có cháu nhỏ không ạ?": Bác đáp tự nhiên, cởi mở hơn: "Sao thế cháu, có việc gì à."
- Sale giới thiệu sản phẩm: Bác "Ừ thế cái đấy là như nào nhỉ"

0:40 – 1:30 — Giới thiệu, vòng hỏi lại
Bác: "Cái này khác gì sổ bình thường hả cháu?"
- Sale giải thích rõ, ví dụ đời thường: Bác thích thú, hỏi thêm về rút trước hạn.
- Sale dùng thuật ngữ khó hiểu: Bác hỏi lại nhiều lần, kiên nhẫn không bực.

1:30 – 2:00 — Hỏi thêm về cách nạp thêm tiền
- Sale giải thích rõ có thể nạp thêm định kỳ, không giới hạn số lần, ai cũng nạp hộ được: Bác hài lòng: "Nghĩa là có tiền bác thì thêm vào được luôn à, không phải mở sổ mới đúng không?"
- Sale trả lời qua loa, không chắc chắn: Bác hơi băn khoăn: "Thế lỡ bác không nạp đều đặn được thì có sao không cháu?"

2:00 – 2:30 — Kết thúc
- Bác thích thú, cần bàn với con dâu: "Rồi bác biết rồi nhé, để bác về bàn với con đã." → WIN
- Sale chào hàng dồn dập không hỏi thăm: Bác thấy bị làm phiền: "Thôi bác đang bận, để hôm khác nói chuyện." → LOSE`,
  },
  {
    id: '1.3',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'm-flexcare',
    starRating: 1,
    openingLine: 'Alô? Ai đấy?',
    sampleFlow: [
      'Giới thiệu tên + MSB, nêu rõ lý do gọi (gói bảo hiểm sức khỏe theo độ tuổi).',
      'Không ép, liên hệ đúng độ tuổi/hoàn cảnh khi bác cảnh giác với từ "bảo hiểm".',
      'Giải thích đúng "khoản phòng bị" đơn giản, tránh thuật ngữ.',
      'Nêu rõ mức phí theo tuổi, đóng theo năm hay tháng đều được, khi bác hỏi cụ thể.',
      'Không ép, để bác tự quyết, hẹn gửi tài liệu qua Zalo.',
    ],
    objectionBank: [
      { trigger: 'Thôi bác không mua bảo hiểm bảo hè gì đâu.', guidance: 'Không ép, giải thích lại đây chỉ là khoản phòng bị nhỏ theo đúng độ tuổi, để bác tự cân nhắc.' },
      { trigger: 'Vậy mỗi năm đóng bao nhiêu hả cháu, có tăng dần theo tuổi không?', guidance: 'Nêu rõ mức phí theo tuổi ngay, tránh nói nước đôi.' },
    ],
    winCriteria: 'Bác đồng ý để Sale gửi tài liệu qua Zalo, hẹn bàn với chồng con trước khi quyết — không thúc ép chốt ngay.',
    trainingScript: `Kênh: Call | Sản phẩm: M-Flexcare (bảo hiểm sức khỏe)
Bối cảnh: Sale gọi điện theo danh sách khách hàng trong độ tuổi phù hợp, giới thiệu gói bảo hiểm sức khỏe M-Flexcare.

0:00 – 0:20
Bác Lan nghe máy: "Alô? Ai đấy?"
- Sale giới thiệu tên + MSB, nêu rõ lý do gọi (gói bảo hiểm sức khỏe theo độ tuổi): Bác cởi mở nghe: "Ngân hàng hàng hải à, có việc gì thế cháu."
- Sale không giới thiệu, hỏi thẳng về bảo hiểm luôn: Bác bối rối: "Lừa đảo à. Tôi không có nhu cầu nhé."

0:20 – 0:50 — Cảnh giác với "bảo hiểm"
- Sale không ép, liên hệ đúng độ tuổi: Bác chia sẻ: "Bác cũng chưa mua bảo hiểm bao giờ, sợ đóng tiền vào mà không ốm thì phí."
- Sale tạo cảm giác ép mua kèm: Bác từ chối dứt khoát: "Thôi bác không mua bảo hiểm bảo hè gì đâu."

0:50 – 1:25 — Giải thích cơ chế
- Sale giải thích đúng "khoản phòng bị": Bác hỏi thêm chi phí, kiên nhẫn hỏi vài lần.
- Sale dùng thuật ngữ khó: Bác hoang mang hơn.

1:25 – 2:00 — Hỏi cụ thể về mức phí đóng hàng năm
- Sale nêu rõ mức phí theo tuổi, đóng theo năm hay theo tháng đều được: Bác cân nhắc: "Vậy mỗi năm đóng bao nhiêu hả cháu, có tăng dần theo tuổi không?"
- Sale trả lời mập mờ về mức phí: Bác nghi ngại: "Cháu cứ nói nước đôi thế bác chịu, cụ thể là bao nhiêu tiền cơ?"

2:00 – 2:30
- Sale không ép, để bác tự quyết, hẹn gửi tài liệu qua Zalo: Bác đồng ý: "Ừ, cháu cứ gửi cho bác xem, nhưng bác chưa quyết được đâu, để bác về hỏi ý chồng con bác đã." → WIN
- Sale thúc ép chốt ngay: Bác từ chối dứt khoát. → LOSE`,
  },
  {
    id: '1.4',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'huong-dan-mbank',
    starRating: 1,
    openingLine: 'Alô? Ai đấy?',
    sampleFlow: [
      'Giới thiệu tên + MSB rõ ràng, nêu ngay lý do gọi (gửi tiết kiệm online lãi cao hơn).',
      'So sánh rõ lãi suất online cao hơn tại quầy bao nhiêu, có ví dụ cụ thể.',
      'Trấn an, cam kết hướng dẫn từng bước qua điện thoại, không để bác tự mò.',
      'Nêu rõ chỉ cần vài bước trên app, không cần ra quầy, tiền vẫn rút được khi cần.',
    ],
    objectionBank: [
      { trigger: 'Bác sợ bấm nhầm mất tiền lắm.', guidance: 'Cam kết hướng dẫn từng bước qua điện thoại tới khi bác tự tin thao tác, không để bác tự mò.' },
      { trigger: 'Cao là cao bao nhiêu, cháu nói rõ cho bác nghe.', guidance: 'So sánh rõ mức lãi suất online cao hơn tại quầy bằng số liệu cụ thể, không nói chung chung.' },
    ],
    winCriteria: 'Bác đồng ý thử, hẹn Sale gọi lại hướng dẫn thao tác khi bác sẵn sàng.',
    trainingScript: `Kênh: Call | Sản phẩm: Tiết kiệm online (mở sổ qua app mBank)
Bối cảnh: Sale gọi điện theo danh sách khách hàng chưa từng gửi tiết kiệm online, mời bác mở sổ qua app để hưởng lãi suất cao hơn gửi tại quầy.

0:00 – 0:20 — Mở đầu (kiểm tra giới thiệu bản thân)
Bác Lan nghe máy: "Alô? Ai đấy?"
- Sale giới thiệu tên + MSB rõ ràng, nêu ngay lý do gọi (gửi tiết kiệm online lãi cao hơn): Bác tò mò: "À thế á? Mà gửi qua cái gì đấy hả cháu, bác có biết dùng đâu."
- Sale không giới thiệu, vào thẳng mời mở sổ: Bác cảnh giác: "Ai đấy? Gọi có việc gì mà đòi mở sổ mở siếc?"
- Sale nói nhanh, hối thúc, quên giới thiệu: Bác chững lại: "Ai đấy? Gọi có việc gì?"

0:20 – 1:00 — Giới thiệu lợi ích, vòng hỏi lại
- Sale so sánh rõ lãi suất online cao hơn gửi tại quầy bao nhiêu, có ví dụ cụ thể: Bác cân nhắc: "Ơ thế cao hơn thật à? Nhưng bác có biết bấm cái điện thoại đâu, sợ nhầm lẫn lắm."
- Sale nói chung chung "gửi online lãi cao lắm bác ạ" không có số: Bác nghi ngại: "Cao là cao bao nhiêu, cháu nói rõ cho bác nghe."

1:00 – 1:35 — Xử lý lo ngại về thao tác/an toàn
- Sale trấn an, cam kết hướng dẫn từng bước qua điện thoại, không để bác tự mò: Bác yên tâm hơn: "Thế cháu hướng dẫn bác từ đầu tới cuối được không, bác sợ bấm nhầm mất tiền lắm."
- Sale nói "dễ lắm cứ làm theo" không cam kết hướng dẫn cụ thể: Bác ngần ngại: "Thôi bác không rành mấy cái đấy đâu, để bác nghĩ đã."

1:35 – 2:05 — Hỏi thêm về thủ tục mở sổ
- Sale nêu rõ chỉ cần vài bước trên app, không cần ra quầy, tiền vẫn rút được khi cần: Bác an tâm hơn: "Vậy có cần mang giấy tờ ra ngân hàng không, hay ngồi nhà làm được luôn?"
- Sale mập mờ về thủ tục: Bác dè dặt: "Cháu nói rõ hộ bác cái, chứ mập mờ thế bác không dám làm đâu."

2:05 – 2:30 — Chốt
- Sale chốt nhẹ nhàng, hẹn gọi lại hướng dẫn thao tác khi bác sẵn sàng: Bác đồng ý thử: "Thôi được, để hôm nào rảnh cháu gọi lại hướng dẫn bác làm nhé." → WIN
- Sale thúc ép làm ngay trong cuộc gọi: Bác từ chối, ngại thao tác gấp: "Thôi để bác xem đã, cháu để bác từ từ." → LOSE`,
  },

  // ===== CHẶNG 2 — My, nhân viên văn phòng trẻ (★★) =====
  {
    id: '2.1',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'visa-online',
    starRating: 2,
    openingLine: 'Alô? Ai vậy?',
    sampleFlow: [
      'Giới thiệu tên + MSB rõ ràng, nêu ngay lợi ích liên quan (ưu đãi hoàn tiền mua sắm online).',
      'Hỏi khéo My đang dùng thẻ gì, có hài lòng không, rồi nêu ngay % hoàn tiền + phí cụ thể để so sánh.',
      'Trả lời nhanh, có số cụ thể khi My hỏi hạn mức theo lương.',
      'Nêu rõ điều kiện miễn phí năm đầu và mức chi tiêu cần đạt để miễn phí năm sau.',
    ],
    objectionBank: [
      { trigger: 'Ý là được gì cụ thể vậy bạn?', guidance: 'Trả lời bằng số liệu cụ thể (% hoàn tiền, phí), tránh nói chung chung "ưu đãi tốt".' },
      { trigger: 'Lương mình tầm 20 triệu, vậy hạn mức được bao nhiêu vậy bạn?', guidance: 'Trả lời ngay, tránh "để em kiểm tra lại rồi gọi lại" nhiều lần.' },
    ],
    winCriteria: 'My thấy lợi ích rõ và chủ động hỏi cách đăng ký ngay trong cuộc gọi.',
    trainingScript: `Kênh: Call | Sản phẩm: Thẻ tín dụng Visa Online
Bối cảnh: Sale gọi điện theo data khách hàng có tần suất mua sắm online cao, giới thiệu thẻ tín dụng Visa Online hoàn tiền, đúng giờ nghỉ trưa của My.

0:00 – 0:15 — Mở đầu
My bắt máy, hơi cảnh giác: "Alô? Ai vậy?"
- Sale giới thiệu tên + MSB rõ ràng, nêu ngay lợi ích liên quan (ưu đãi hoàn tiền mua sắm online): My tò mò: "Ừ, nói nghe thử coi, thẻ gì mà hoàn tiền vậy bạn?"
- Sale không nêu tên/đơn vị, vào thẳng bán hàng: My cảnh giác, nghi lừa đảo: "Ủa ai vậy, sao có số mình?" Nếu Sale tiếp tục né tránh → My cúp máy luôn.
- Sale mào đầu dài dòng: My ngắt: "Bạn nói gọn giúp mình, mình đang giờ nghỉ trưa thôi á."

0:15 – 0:50 — So sánh thẻ cũ
- Sale hỏi khéo My đang dùng thẻ gì, có hài lòng không: My chia sẻ: "Mình đang xài thẻ Techcombank, hoàn có 0.5% à, phí lại 500k, thấy hoàn ít quá."
- Sale nêu ngay % hoàn tiền + phí cụ thể của Visa Online sau khi My chia sẻ: My so sánh, có hứng thú hơn: "Ừ nghe ổn đó, đợi mình tí, mình đang nghe máy khác gọi vào."
- Sale nói chung chung, không số: My hỏi lại thẳng: "Ý là được gì cụ thể vậy bạn?" Nếu vẫn chung chung → My: "Thôi để mình tìm hiểu thêm rồi gọi lại." rồi cúp.

0:50 – 1:30 — Chốt hạn mức
My: "Lương mình tầm 20 triệu, vậy hạn mức được bao nhiêu vậy bạn?"
- Sale trả lời nhanh, có số cụ thể: My hài lòng.
- Sale phải "để em kiểm tra lại rồi gọi lại" nhiều lần: My mất kiên nhẫn: "Thôi bạn gọi lại sau nha, giờ mình không rảnh."

1:30 – 2:05 — Hỏi thêm điều kiện miễn phí thường niên
- Sale nêu rõ điều kiện miễn phí năm đầu và mức chi tiêu cần đạt để miễn phí năm sau: My tính toán nhanh: "Ok, vậy chi tiêu chừng nào thì được miễn phí năm sau vậy bạn?"
- Sale trả lời mập mờ về điều kiện miễn phí: My nghi ngại: "Ủa vậy chốt là có tốn phí duy trì không ta, nói rõ giùm mình."

2:05 – 2:30
- Thấy lợi ích rõ: My chốt: "Ok, vậy mình đăng ký nha, cần gửi gì cho bên bạn?" → WIN
- Chưa thấy lợi ích cụ thể tới cuối: My kết thúc. → LOSE`,
  },
  {
    id: '2.2',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'tai-khoan-luong-mpro',
    starRating: 2,
    openingLine: 'Alô? Ai vậy?',
    sampleFlow: [
      'Giới thiệu tên + MSB, nói rõ công ty My mới vào có trả lương qua MSB nên gọi hỗ trợ mở tài khoản.',
      'Nói rõ thao tác có thể làm online, không bắt ra quầy nếu không cần thiết.',
      'Nói rõ M-Pro không phát sinh phí thêm, tránh mập mờ.',
      'Nói rõ bao lâu có thẻ, có giao tận công ty hay phải ra quầy nhận.',
    ],
    objectionBank: [
      { trigger: 'Gói đó có tốn phí gì thêm không?', guidance: 'Trả lời rõ ràng ngay: không phát sinh phí nếu duy trì số dư tối thiểu, tránh mập mờ khiến My phải hỏi lại.' },
      { trigger: 'Bao lâu thì có thẻ, có ship tới công ty được không bạn?', guidance: 'Nêu rõ thời gian nhận thẻ và phương án giao nhận cụ thể, tránh trả lời chung chung "sẽ có sớm thôi".' },
    ],
    winCriteria: 'My đồng ý ngay vì thủ tục được xử lý gọn, rõ ràng, không mất nhiều thời gian.',
    trainingScript: `Kênh: Call | Sản phẩm: Tài khoản lương + gói M-Pro
Bối cảnh: Sale gọi điện theo data công ty mới ký hợp đồng trả lương qua MSB, My vừa nhảy việc sang công ty đó nhưng chưa biết trước sẽ có cuộc gọi này.

0:00 – 0:15 — Mở đầu
My bắt máy, hơi ngạc nhiên: "Alô? Ai vậy?"
- Sale giới thiệu tên + MSB, nói rõ công ty My mới vào có trả lương qua MSB nên gọi hỗ trợ mở tài khoản: My bớt cảnh giác: "À vậy hả? Ừ mình mới vào làm thật, mà sao bên bạn biết vậy?"
- Sale không giới thiệu, vào thẳng thủ tục: My cảnh giác: "Ơ mà ai gọi vậy, sao có số mình mà đòi mở tài khoản?"
- Sale giới thiệu lan man trước khi vào việc chính: My giục: "Rồi, ý là sao nhỉ, bạn nói gọn lại hộ mình được không?"

0:15 – 0:50 — Thủ tục
- Sale nói rõ thao tác online, không cần ra quầy: My giục: "Rồi giờ mình cần làm gì, có phải ra quầy không hay làm online được luôn?"
- Sale yêu cầu ra quầy dù có thể làm online: My hơi khó chịu.

0:50 – 1:30 — Giới thiệu M-Pro
- Sale nói rõ không phí thêm: My chốt nhanh: "Ok vậy làm giúp mình đi, xong sớm dùm mình nha, mình đang họp."
- Sale mập mờ về phí: My hỏi thẳng: "Gói đó có tốn phí gì thêm không, hay là tự động có luôn khi mở tài khoản lương vậy?"

1:30 – 2:05 — Hỏi thêm về thẻ và thời gian nhận
- Sale nói rõ bao lâu có thẻ, có giao tận công ty hay phải ra quầy nhận: My yên tâm: "Ok, vậy bao lâu thì có thẻ, có ship tới công ty được không bạn?"
- Sale trả lời chung chung "sẽ có sớm thôi": My giục: "Sớm là bao lâu vậy, mình cần dùng gấp á."

2:05 – 2:30
- Xử lý gọn, rõ ràng: My đồng ý ngay. → WIN
- Sale tra cứu chậm nhiều lần: My cúp, hẹn sau. → LOSE`,
  },
  {
    id: '2.3',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'vay-mua-nha',
    starRating: 2,
    openingLine: 'Alô? Ai vậy?',
    sampleFlow: [
      'Giới thiệu tên + MSB, nhắc rõ nguồn data (My từng để lại thông tin quan tâm vay mua nhà).',
      'Hỏi tiếp thay vì bỏ qua khi My nói "chưa đủ tiền" — đây là insight quan trọng nhất của level.',
      'Hỏi đúng số liệu cụ thể: định mua tầm bao nhiêu, đã có sẵn bao nhiêu.',
      'Nêu rõ lãi suất ưu đãi giai đoạn đầu, sau đó thả nổi ra sao, vay tối đa bao nhiêu năm.',
    ],
    objectionBank: [
      { trigger: 'Mình để dành được khoảng 150 rồi, căn tầm 1.2 tỷ, chắc còn thiếu nhiều.', guidance: 'Tính cụ thể số tiền cần vay bổ sung và khả năng trả góp hàng tháng, không hứa hẹn quá đà.' },
      { trigger: 'Vậy lãi ưu đãi được mấy năm, sau đó thả nổi bao nhiêu vậy bạn?', guidance: 'Nêu rõ % ưu đãi, thời gian ưu đãi và mức thả nổi sau đó — tránh nói chung chung "lãi mềm lắm".' },
    ],
    winCriteria: 'My hào hứng và xin thêm thông tin cụ thể về phương án vay — không hứa hẹn quá đà.',
    trainingScript: `Kênh: Call | Sản phẩm: Vay mua nhà/BĐS
Bối cảnh: Sale gọi điện theo data khách hàng từng để lại thông tin quan tâm vay mua nhà trên fanpage/website MSB.

0:00 – 0:20 — Mở đầu
My bắt máy: "Alô? Ai vậy?"
- Sale giới thiệu tên + MSB, nhắc rõ nguồn data (My từng để lại thông tin quan tâm vay mua nhà): My nhớ ra, cởi mở hơn: "À đúng rồi, có để lại thông tin đó, mà mình cũng chưa đủ tiền đâu."
- Sale không nêu rõ nguồn data, hỏi thẳng chuyện mua nhà: My cảnh giác: "Ủa sao biết mình đang tính mua nhà vậy, ai vậy ta?"
- Sale nghe "chưa đủ tiền" rồi bỏ qua chủ đề: Cơ hội khai thác insight quan trọng nhất bị mất.

0:20 – 1:00 — Số liệu cụ thể
- Sale hỏi đúng "định mua tầm bao nhiêu, đã có sẵn bao nhiêu": My chia sẻ: "Mình để dành được khoảng 150 rồi, căn tầm 1.2 tỷ, chắc còn thiếu nhiều."
- Sale chỉ nói chung "bên em có vay mua nhà lãi tốt": My không có động lực chia sẻ thêm.

1:00 – 1:40 — Tính toán khả thi
- Sale tính cụ thể: My hào hứng hơn.
- Sale nói chung chung: My giảm hứng thú.

1:40 – 2:05 — Hỏi thêm về lãi suất & thời gian vay
- Sale nêu rõ lãi suất ưu đãi giai đoạn đầu là bao nhiêu %, sau đó thả nổi ra sao, vay tối đa bao nhiêu năm: My cân nhắc: "Vậy lãi ưu đãi được mấy năm, sau đó thả nổi bao nhiêu vậy bạn?"
- Sale nói chung chung "lãi mềm lắm": My chưa an tâm: "Ý là bao nhiêu %, nói con số cụ thể được không?"

2:05 – 2:30
- Cụ thể, không hứa hẹn quá đà: My xin thêm thông tin. → WIN
- Chào chung chung không theo sát tình hình: My: "Thôi để sau mình tính." → LOSE`,
  },
  {
    id: '2.4',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'tai-khoan-so-dep',
    starRating: 2,
    openingLine: 'Alô? Ai vậy?',
    sampleFlow: [
      'Giới thiệu tên + MSB, nêu ngay lý do gọi (số tài khoản đẹp dễ nhớ, tiện chuyển khoản với đối tác).',
      'Đưa 2–3 lựa chọn kèm giá rõ ràng thay vì liệt kê hàng loạt số.',
      'Nói rõ không yêu cầu số dư tối thiểu, không phát sinh phí duy trì thêm.',
    ],
    objectionBank: [
      { trigger: 'Nhiều quá, bạn gợi ý giúp mình 1-2 cái thôi được không.', guidance: 'Thu hẹp lại còn 2-3 lựa chọn kèm giá rõ, tránh liệt kê tràn lan gây rối.' },
      { trigger: 'Ủa vậy có bắt buộc để tiền trong đó không?', guidance: 'Nói rõ không yêu cầu số dư tối thiểu, không phát sinh phí duy trì thêm.' },
    ],
    winCriteria: 'My chọn được số ưng ý, yên tâm về điều kiện duy trì và xác nhận đăng ký ngay.',
    trainingScript: `Kênh: Call | Sản phẩm: Tài khoản số đẹp
Bối cảnh: Sale gọi điện theo data khách hàng thường xuyên chuyển khoản với đối tác/khách hàng, giới thiệu dịch vụ số tài khoản đẹp.

0:00 – 0:30 — Mở đầu
My bắt máy: "Alô? Ai vậy?"
- Sale giới thiệu tên + MSB, nêu ngay lý do gọi (số tài khoản đẹp dễ nhớ, tiện chuyển khoản với đối tác): My tò mò: "Ừ nghe cũng hay đó, có cái nào không đắt lắm không bạn?"
- Sale không giới thiệu, liệt kê hàng loạt số ngay: My cảnh giác, sốt ruột: "Ủa ai vậy, sao tự nhiên gọi đọc số tài khoản vậy?"

0:30 – 1:20
- Sale đưa 2–3 lựa chọn kèm giá rõ: My chọn nhanh: "Cái 800k nghe được đó, lấy cái đó cho mình."
- Sale đưa quá nhiều lựa chọn không giá: My bỏ qua.

1:20 – 2:05 — Hỏi thêm điều kiện duy trì tài khoản
- Sale nói rõ không yêu cầu số dư tối thiểu, không phát sinh phí duy trì thêm: My yên tâm chốt: "Ok, vậy không phát sinh phí gì thêm đúng không, chốt luôn cho mình cái 800k đó."
- Sale mập mờ về điều kiện duy trì: My phân vân: "Ủa vậy có bắt buộc để tiền trong đó không, nói rõ giùm mình."

2:05 – 2:30
- My đã chọn được số ưng ý và yên tâm về điều kiện: Xác nhận đăng ký. → WIN
- Quá nhiều lựa chọn hoặc điều kiện chưa rõ khiến My phân vân: My trì hoãn. → LOSE (partial)`,
  },

  // ===== CHẶNG 3 — Ông Thắng, chủ hộ kinh doanh (★★★) =====
  {
    id: '3.1',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'vay-bo-sung-von',
    starRating: 3,
    openingLine: 'Alô? Ai đó rứa?',
    sampleFlow: [
      'Giới thiệu tên + MSB ngay lập tức, kiên nhẫn chờ khi ông đang bận bán hàng.',
      'Đưa con số cụ thể ngay khi được hỏi lãi suất/hạn mức, tránh mập mờ.',
      'Kiểm tra lại độ thật của phép thử đối thủ ("bên đó báo cụ thể chưa hay mới giới thiệu sơ") thay vì giảm giá ngay.',
      'Nêu rõ hồ sơ cần giấy tờ gì, giải ngân trong bao lâu.',
    ],
    objectionBank: [
      { trigger: 'Em nói rứa thì anh biết răng mà tính. Bên VIB người ta báo anh lãi thấp hơn nì.', guidance: 'Hỏi lại xem đối thủ đã báo giá chính thức chưa, rồi đưa số liệu cụ thể của mình, không giảm giá ngay theo phép thử.' },
      { trigger: 'Nói cụ thể mấy bữa có tiền, đừng nói chung chung.', guidance: 'Nêu rõ hồ sơ cần giấy tờ gì và thời gian giải ngân cụ thể.' },
    ],
    winCriteria: 'Ông đồng ý xem hồ sơ cần chuẩn bị sau khi Sale đưa con số cụ thể + điểm khác biệt rõ.',
    trainingScript: `Kênh: Call | Sản phẩm: Vay bổ sung vốn kinh doanh
Bối cảnh: Sale gọi điện cho ông theo data khách tiểu thương, đúng lúc ông đang bận bán hàng ở shop tạp hoá.

0:00 – 0:20 — Mở đầu
Ông: "Alô? Ai đó rứa?"
- Sale giới thiệu tên + MSB ngay lập tức: Ông: "Ừ, đợi tí, để anh tính tiền khách cái đã." rồi quay lại nghe tiếp.
- Sale không giới thiệu, vào thẳng chào vay: Ông hỏi cộc: "Ơ mà em ở đâu rứa, MSB à?" — không tính là thiếu chuyên nghiệp nghiêm trọng, nhưng nếu về sau Sale còn mập mờ số liệu nữa thì cộng thêm nghi ngờ: "Mà em ở bên mô rứa, giờ mới nói tên."
- Sale chờ kiên nhẫn khi ông bận: Ông quay lại: "Rồi, nói cụ thể đi, lãi bao nhiêu, vay được bao nhiêu?"
- Sale tỏ ra sốt ruột, giục: Ông khó chịu ngầm, giảm thiện cảm.

0:20 – 0:55 — Hỏi thẳng số liệu
- Sale mập mờ: Ông hỏi lại: "Ừ, tùy cái chi, cứ nói khoảng bao nhiêu cho anh nghe." Nếu tiếp tục mập mờ, ông chất vấn thẳng, nhắc đối thủ: "Em nói rứa thì anh biết răng mà tính. Bên VIB người ta báo anh lãi thấp hơn nì."
- Sale đưa con số cụ thể ngay: Ông hỏi sâu thêm về hạn mức/thủ tục.

0:55 – 1:30 — Kiểm tra phép thử đối thủ
- Sale hỏi lại đúng cách: Ông khựng, thừa nhận: "Cũng chưa báo cụ thể lắm, tụi nó mới giới thiệu sơ sơ thôi."
- Sale hoảng, giảm giá ngay: Ông vẫn tiếp tục nhưng đánh giá thấp uy tín Sale ngầm.
- Sale tư vấn sai đối tượng: Ông nghi ngờ tăng mạnh: "Em tư vấn kiểu chi rứa, anh cần vốn kinh doanh mà."

1:30 – 2:05 — Hỏi thêm thủ tục & thời gian giải ngân
- Sale nêu rõ hồ sơ cần giấy tờ gì, giải ngân trong bao lâu: Ông cân nhắc: "Rứa hồ sơ cần chi, giải ngân nhanh không, chớ anh đang cần gấp để nhập hàng."
- Sale mập mờ về thời gian giải ngân: Ông sốt ruột: "Nói cụ thể mấy bữa có tiền, đừng nói chung chung."

2:05 – 2:30 — Chốt
- Sale đưa con số cụ thể + điểm khác biệt rõ: Ông dịu giọng: "Rứa để anh coi hồ sơ cần chi rồi tính." → WIN
- Không có điểm khác biệt cụ thể tới cuối: Ông từ chối hẹn gặp lại. → LOSE`,
  },
  {
    id: '3.2',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'the-mastercard-hybrid',
    starRating: 3,
    openingLine: 'Alô? Ai đó rứa?',
    sampleFlow: [
      'Giới thiệu tên + MSB ngay, nêu rõ lý do gọi (thẻ tiện cho buôn bán).',
      'Giải thích rõ khác biệt của thẻ Hybrid so với ATM thường, kèm phí cụ thể.',
      'Nêu rõ hạn mức tính dựa trên doanh thu shop, cách trích nợ tự động cuối tháng.',
    ],
    objectionBank: [
      { trigger: 'Thôi khỏi, có khi lại có chi phí khác chi đây.', guidance: 'Nêu rõ ràng phí cụ thể, tránh mập mờ khiến ông nghi ngờ phí ẩn.' },
      { trigger: 'Rứa hạn mức tính răng, có cần thế chấp chi thêm không?', guidance: 'Giải thích hạn mức tính dựa trên doanh thu shop và cách trích nợ tự động cuối tháng, tránh mập mờ.' },
    ],
    winCriteria: 'Ông đồng ý làm thêm thẻ sau khi thấy phí/hạn mức được giải thích rõ ràng, minh bạch.',
    trainingScript: `Kênh: Call | Sản phẩm: Thẻ Mastercard Hybrid
Bối cảnh: Sale gọi điện theo data khách tiểu thương, giới thiệu thẻ Mastercard Hybrid (vừa rút tiền mặt vừa quẹt POS) phù hợp buôn bán.

0:00 – 0:25 — Mở đầu
Ông: "Alô? Ai đó rứa?"
- Sale giới thiệu tên + MSB ngay, nêu rõ lý do gọi (thẻ tiện cho buôn bán): Ông: "Ừ, nói nghe coi, thẻ chi mà tiện cho buôn bán rứa em?"
- Sale không giới thiệu, vào thẳng chào thẻ: Ông hỏi cộc: "Ơ mà em ở đâu rứa, răng biết anh buôn bán mà gọi?"
- Sale nói nhanh, hối thúc, quên giới thiệu: Ông chững lại, khó chịu ngầm.

0:25 – 1:15 — Giới thiệu thẻ
- Sale giải thích rõ khác biệt với ATM, phí cụ thể: Ông cân nhắc: "Ừ nghe cũng được, để anh coi thêm rồi tính."
- Sale mập mờ về phí: Ông nghi ngờ: "Thôi khỏi, có khi lại có chi phí khác chi đây."

1:15 – 2:00 — Hỏi thêm hạn mức & cách thanh toán
- Sale nêu rõ hạn mức tính dựa trên doanh thu shop, cách trích nợ tự động cuối tháng: Ông cân nhắc: "Rứa hạn mức tính răng, có cần thế chấp chi thêm không?"
- Sale mập mờ về hạn mức: Ông nghi ngại: "Nói rứa mơ hồ quá, cụ thể được bao nhiêu?"

2:00 – 2:30
- Rõ ràng, đúng trọng tâm: Ông đồng ý làm thêm thẻ. → WIN
- Mập mờ phí/hạn mức: Ông từ chối. → LOSE`,
  },
  {
    id: '3.3',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'thau-chi-tieu-dung',
    starRating: 3,
    openingLine: 'Alô? Ai đó rứa?',
    sampleFlow: [
      'Giới thiệu tên + MSB, hỏi thăm tình hình buôn bán trước khi vào sản phẩm.',
      'Liên hệ đúng pain point (thiếu tiền mặt gấp) thay vì giới thiệu lan man.',
      'Giải thích rõ cơ chế lãi chỉ tính trên phần thực dùng, minh bạch trong hợp đồng.',
      'Nêu rõ hạn mức được cấp dựa trên doanh thu shop, lãi suất bao nhiêu %/tháng trên phần thực dùng.',
    ],
    objectionBank: [
      { trigger: 'Anh sợ mấy cái phí ẩn lắm.', guidance: 'Khẳng định minh bạch, công khai trong hợp đồng, chỉ tính lãi trên phần thực dùng.' },
      { trigger: 'Nói cụ thể vô, mập mờ rứa biết răng mà tính.', guidance: 'Nêu rõ hạn mức được cấp và lãi suất %/tháng cụ thể trên phần thực dùng.' },
    ],
    winCriteria: 'Ông đồng ý tìm hiểu thêm/đăng ký song song sau khi thấy cơ chế lãi minh bạch, công khai.',
    trainingScript: `Kênh: Call | Sản phẩm: Thấu chi tiêu dùng
Bối cảnh: Sale gọi điện theo data khách tiểu thương, giới thiệu sản phẩm thấu chi tiêu dùng hỗ trợ xoay vòng vốn khi thiếu tiền mặt tạm thời.

0:00 – 0:30 — Mở đầu
Ông: "Alô? Ai đó rứa?"
- Sale giới thiệu tên + MSB, hỏi thăm tình hình buôn bán trước khi vào sản phẩm: Ông cởi mở chia sẻ: "Ừ đang bù đầu đây, có bữa hàng về mà tiền chưa kịp thu của khách, kẹt muốn chết luôn á."
- Sale không giới thiệu, hỏi thẳng chuyện thiếu tiền: Ông cảnh giác: "Ơ mà em là ai, răng biết chuyện tiền nong của anh?"
- Sale nói nhanh, hối thúc, quên giới thiệu: Ông chững lại, khó chịu ngầm.

0:30 – 1:00 — Liên hệ đúng pain point
- Sale nghe xong, liên hệ đúng vào sản phẩm giải quyết thiếu vốn tạm thời: Ông chú ý lắng nghe.
- Sale nghe xong bỏ qua, giới thiệu lan man: Ông mất hứng, quay lại lo việc bán hàng.

1:00 – 1:40 — Giải thích cơ chế lãi
- Sale giải thích rõ chỉ tính lãi trên phần thực dùng: Ông thấy hợp lý: "À rứa cũng hay đó, chứ anh sợ mấy cái phí ẩn lắm."
- Sale giải thích mập mờ: Ông nghi ngại, hỏi lại nhiều lần.

1:40 – 2:05 — Hỏi thêm hạn mức & lãi suất cụ thể
- Sale nêu rõ hạn mức được cấp dựa trên doanh thu shop, lãi suất bao nhiêu %/tháng trên phần thực dùng: Ông tính toán: "Rứa hạn mức được mấy chục triệu, lãi mấy phần trăm rứa em?"
- Sale mập mờ về con số: Ông nghi ngại: "Nói cụ thể vô, mập mờ rứa biết răng mà tính."

2:05 – 2:30
- Minh bạch, công khai trong hợp đồng, trả lời rõ số liệu: Ông đồng ý tìm hiểu thêm/đăng ký song song. → WIN
- Mập mờ cơ chế lãi/hạn mức tới cuối: Ông sợ phí ẩn, từ chối. → LOSE`,
  },
  {
    id: '3.4',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'bao-hiem-chung-cu-4-0',
    starRating: 3,
    openingLine: 'Alô? Ai đó rứa?',
    sampleFlow: [
      'Giới thiệu tên + MSB rõ ràng, nêu rủi ro thực tế cụ thể (cháy nổ, ngập nước ở chung cư).',
      'Không ép, đưa thông tin ngắn gọn, tôn trọng việc ông đang ưu tiên xử lý khoản vay trước.',
      'Nêu rõ phạm vi bảo vệ (cháy nổ, nước tràn, trộm cắp) và mức phí theo diện tích căn hộ khi được hỏi.',
    ],
    objectionBank: [
      { trigger: 'Anh đang lo vụ vay đã, bảo hiểm tính sau.', guidance: 'Tôn trọng thứ tự ưu tiên, để lại thông tin ngắn gọn thay vì cố nói dài về sản phẩm phụ.' },
      { trigger: 'Rứa bảo hiểm được những cái chi, cháy với ngập nước có không?', guidance: 'Nêu rõ phạm vi bảo vệ (cháy nổ, nước tràn, trộm cắp) và mức phí theo diện tích căn hộ.' },
    ],
    winCriteria: 'Ông ghi nhận để xem sau, không bị ép nói dài khi đang ưu tiên khoản vay.',
    trainingScript: `Kênh: Call | Sản phẩm: Bảo hiểm chung cư 4.0
Bối cảnh: Sale gọi điện theo data cư dân chung cư, giới thiệu bảo hiểm tài sản chung cư 4.0.

0:00 – 0:30 — Mở đầu
Ông: "Alô? Ai đó rứa?"
- Sale giới thiệu tên + MSB rõ ràng, nêu rủi ro thực tế cụ thể (cháy nổ, ngập nước ở chung cư): Ông cân nhắc: "Ừ chưa nghĩ tới chuyện đó, để nghe thử coi răng."
- Sale giới thiệu chung chung, không nêu lý do liên hệ: Ông gạt phắt: "Thôi khỏi, giờ đang bận."

0:30 – 1:15
- Sale không ép, đưa thông tin ngắn gọn: Ông nghe lịch sự.
- Sale cố nói dài dòng: Ông gắt: "Nói ngắn gọn thôi em, anh đang bận."

1:15 – 2:00 — Hỏi thêm phạm vi bảo hiểm
- Sale nêu rõ phạm vi bảo vệ (cháy nổ, nước tràn, trộm cắp) và mức phí theo diện tích căn hộ: Ông nghe thêm, cân nhắc: "Rứa bảo hiểm được những cái chi, cháy với ngập nước có không?"
- Sale nói chung chung "bảo hiểm đủ thứ": Ông không mặn mà: "Nói rứa mơ hồ, cụ thể được cái chi em nói rõ coi."

2:00 – 2:30
- Tôn trọng thứ tự ưu tiên, trả lời rõ khi được hỏi: Ông ghi nhận xem sau. → WIN
- Ép chèn quá nhiều thời gian/mập mờ phạm vi: Ông ngắt lời khó chịu. → LOSE`,
  },

  // ===== CHẶNG 4 — Bà Thuý, đa nghi / từng bị lừa (★★★★) =====
  {
    id: '4.1',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'tien-gui-ky-han-truc-tuyen',
    starRating: 4,
    // Kịch bản phân nhánh chi tiết, câu thoại đã chăm chút kỹ để nghe tự
    // nhiên — muốn AI tái hiện đúng nguyên văn khi khớp đúng nhánh, không
    // để tự diễn đạt lại như các level khác. Xem Level.strictScript.
    strictScript: true,
    openingLine: 'Alô? Ai đấy? Có việc gì?',
    sampleFlow: [
      'Giới thiệu đầy đủ tên + MSB + nhắc được người quen giới thiệu ngay từ câu đầu.',
      'Trả lời đủ và đúng NGAY cả 3 điều cốt lõi trong 1 lượt: có mất gốc không / rút trước hạn thì sao / có phí ẩn không.',
      'Khi bà kể chuyện cũ: đồng cảm thật trước, rồi CHỦ ĐỘNG xác nhận sản phẩm này KHÔNG có yếu tố bảo hiểm/đầu tư, không có phí phá hợp đồng — không đợi hỏi mới nói.',
      'Đính chính rõ: tiết kiệm cá nhân không dùng hợp đồng nên không có phí phá hợp đồng, rút trước hạn chỉ giảm lãi, không phạt tiền.',
      'Nêu đúng cơ chế bảo hiểm tiền gửi (tối đa 350 triệu đồng) khi bà nghi ngờ độ an toàn hệ thống.',
      'Hỏi khéo kèm lý do khi khai thác số tiền/nhu cầu thật, không hỏi thẳng thô.',
    ],
    objectionBank: [
      { trigger: 'Rút trước hạn thì sao, có mất gốc không? Phí thế nào?', guidance: 'Trả lời đủ cả 3 ý trong 1 lượt: không mất gốc, rút sớm chỉ giảm lãi theo lãi suất không kỳ hạn, không phí ẩn — né tránh/trấn an chung chung sẽ bị cảnh báo ngay.' },
      { trigger: 'Thế cái này có cái khoản phí phá hợp đồng gì đó không?', guidance: 'Đính chính: tiết kiệm cá nhân không dùng hợp đồng nên không có phí phá hợp đồng; "hợp đồng tiền gửi" chỉ dành cho khách hàng doanh nghiệp; rút trước hạn chỉ giảm lãi, không phạt tiền.' },
      { trigger: 'Trên báo gửi tiền ngân hàng mất đầy ra kia kìa?', guidance: 'Nêu đúng cơ chế bảo hiểm tiền gửi (bảo vệ tối đa 350 triệu đồng cho cả gốc lẫn lãi), không trấn an chung chung kiểu "ngân hàng uy tín lắm".' },
    ],
    winCriteria:
      'Sale không từng bị cảnh báo, trả lời rõ cả 3 điều cốt lõi, chủ động minh bạch về "phí phá hợp đồng" không đợi hỏi, và trấn an đúng bằng cơ chế bảo hiểm tiền gửi → bà đồng ý cân nhắc nghiêm túc, để lại kênh liên hệ qua Zalo (WIN đầy đủ); nếu từng mắc 1 lỗi nhưng vẫn xử lý ổn về sau thì đạt WIN nhẹ.',
    trainingScript: `Kênh: Call | Sản phẩm: Tiền gửi có kỳ hạn trực tuyến — lưu ý đây là kênh giao dịch trực tuyến của sản phẩm tiền gửi có kỳ hạn, không phải sản phẩm bảo hiểm hay đầu tư.
Bối cảnh: Sale gọi theo data khách hàng có người quen giới thiệu, mời tư vấn gửi tiết kiệm. Bà nghe máy với tâm thế phòng thủ sẵn có — người từng bị lừa không tự nhiên gọi hỏi tư vấn tài chính, phản xạ là né tránh/cảnh giác. Bà đang giữ 100–150 triệu tiền mặt ở nhà, để không thì tiếc mà đi gửi thì sợ lặp lại chuyện cũ — đây là nhu cầu ẩn, chỉ hé lộ khi Sale đã tạo được niềm tin nhất định. Ba năm trước, bà từng bị một tư vấn viên ở ngân hàng khác nói dối trắng trợn về một sản phẩm bảo hiểm liên kết đầu tư.

Mục tiêu huấn luyện:
1. Chủ động minh bạch, không đợi hỏi mới nói — trả lời đúng khi được hỏi là chưa đủ, Sale cần nói ra trước khi bà kịp hỏi thì mới thực sự ghi điểm.
2. Trả lời rõ ràng, có số liệu, không vòng vo cho đúng 3 câu hỏi lõi: mất gốc không / rút trước hạn thì sao / có phí ẩn không.
3. Không trấn an chung chung kiểu "yên tâm đi cô" — bà đặc biệt dị ứng kiểu này.
4. Sale chỉ được né tránh 1 lần trước khi bị cảnh báo, và tối đa 1 lần cảnh báo trước khi bà cúp máy thật.

Kịch bản gồm 12 bước, chia 7 nhóm A–G, mỗi bước có nhiều nhánh tuỳ Sale trả lời thế nào.

BƯỚC 1 — Nghe máy, cảnh giác ban đầu
Bà: "Alô? Ai đấy? Có việc gì?"
- Sale giới thiệu đầy đủ (tên + MSB + người quen giới thiệu): Bà vẫn chưa buông phòng thủ (đặc trưng cố hữu, không phải dấu hiệu xấu), hỏi ngược: "Ơ ai giới thiệu gì cơ? Mà tôi có đăng ký cái gì đâu nhỉ?" → Customer Intro Full — câu hỏi ngược này BẮT BUỘC Sale phải trả lời ở bước 2.
- Sale giới thiệu thiếu (không nhắc người quen, không có căn cứ nguồn số điện thoại): Bà cảnh giác cao hơn: "Tiết kiệm gì, cô lấy số của tôi ở đâu ra đấy?" → Customer Intro Partial — Sale bắt buộc phải giải thích nguồn gốc số điện thoại ở bước 2.
- Sale mập mờ mục đích, không nói rõ lý do gọi: Bà chất vấn gay gắt nhất: "Việc gì? Định lừa đảo cái gì đấy?" → Customer Intro Vague — Sale bắt buộc phải trấn an + nêu rõ mục đích ở bước 2.

BƯỚC 2 — Sale xử lý câu hỏi ngược & dẫn vào sản phẩm
Bà giữ nguyên câu hỏi ngược ở bước 1.
- Sale giải thích rõ nguồn gốc/mục đích, không né tránh, VÀ nêu rõ tên sản phẩm (Tiền gửi có kỳ hạn trực tuyến): Bà chuyển sang nghi ngờ hình thức "online": "Gửi trực tuyến là gửi qua mạng ấy à? Tiền bạc mà để ở trên mạng thì ai giữ cho tôi?" → Trust Recovered, sang bước 3.
- Sale vẫn né tránh/mập mờ, lảng sang chào sản phẩm mà không xử lý nghi vấn: Bà gắt: "Tôi hỏi rõ ràng mà cô cứ vòng vo thì thôi không phải tư vấn đâu!" → Trust Not Recovered — không kết thúc cuộc gọi nhưng bà giữ mức nghi ngờ cao hơn suốt phần sau, giới hạn mức WIN tối đa có thể đạt ở bước Chốt.

BƯỚC 3 — Chất vấn hình thức gửi online
Bà: "Gửi trực tuyến là gửi qua mạng ấy à? Tiền bạc mà để ở trên mạng thì ai giữ cho tôi?"
- Sale giải thích đúng bản chất bằng ngôn ngữ dễ hiểu (tiền vẫn nằm tại MSB đứng tên bà, chỉ thao tác mở sổ trên app thay vì ra quầy, có sổ tiết kiệm điện tử tra cứu được, ra quầy vẫn kiểm tra được): Bà chuyển sang hỏi tới rút trước hạn: "Thế tôi cần tiền gấp thì sao, rút ra có mất gốc không? Phí thế nào? Nói rõ ràng vào đừng có mà cái kiểu mập mờ, tôi còn lạ gì trò của mấy cô nữa." → Online Form Explained, sang bước 4.
- Sale dùng thuật ngữ khó hiểu hoặc trấn an suông về "online": Bà không hình dung được tiền nằm ở đâu: "Cô nói cái gì tôi chả hiểu. Tóm lại tiền của tôi nó nằm ở đâu?" → Online Form Unclear — cho Sale reprompt tối đa 1 lần; nếu vẫn mập mờ, vẫn sang bước 4 nhưng với mức tin tưởng thấp hơn. Persona lớn tuổi, không rành công nghệ — Sale bắt buộc phải diễn đạt bằng ngôn ngữ đời thường.

BƯỚC 4 — Chất vấn mất gốc / rút trước hạn / phí ẩn
Bà: "Thế tôi cần tiền gấp thì sao, rút ra có mất gốc không? Phí thế nào? Nói rõ ràng vào đừng có mà cái kiểu mập mờ, tôi còn lạ gì trò của mấy cô nữa."
- Sale trả lời đủ cả 3 ý trong 1 lượt (không mất gốc / rút sớm chỉ giảm lãi / không phí ẩn): Bà dịu hẳn, xác nhận lại: "Tức là không mất gốc, chỉ bớt lãi đúng không?" → Core Questions Answered Full — chuyển THẲNG đến bước 6 (bỏ qua bước 5), đây là điểm ghi điểm quan trọng nhất của bước này.
- Sale trả lời thiếu ý/lan man/khó hiểu: Bà ngắt lời gằn giọng: "Thế cuối cùng là có mất gốc không? Nói nãy giờ không hiểu gì cả." → Core Questions Partial — reprompt tối đa 1 lần: trả lời đủ ở lần 2 thì sang bước 6, vẫn thiếu/né tránh thì sang bước 5.
- Sale né tránh/trấn an chung chung ("cô cứ yên tâm, bên cháu rất an toàn"): Bà cảnh báo — LẦN CẢNH BÁO ĐẦU TIÊN VÀ DUY NHẤT trong toàn kịch bản: "Tôi hỏi rõ ràng mà cô cứ nói vòng vo kiểu này thì thôi, không phải tư vấn nữa đâu!" → Core Questions Evaded (Warning Issued), sang bước 5.

BƯỚC 5 — Xử lý sau cảnh báo (chỉ kích hoạt nếu bước 4 rơi vào nhánh né tránh/không sửa được sau reprompt)
Bà: "Tôi hỏi rõ ràng mà cô cứ nói vòng vo kiểu này thì thôi, không phải tư vấn nữa đâu!"
- Sale sửa sai kịp thời, trả lời rõ ràng đủ 3 ý ngay sau cảnh báo: Bà dịu, xác nhận lại: "Tức là không mất gốc, chỉ bớt lãi đi thôi đúng không?" → Recovered After Warning, sang bước 6. QUAN TRỌNG: dù được recover, trạng thái "đã từng bị cảnh báo 1 lần" vẫn giữ lại xuyên suốt, giới hạn mức WIN tối đa ở bước Chốt (bước 12) — không thể đạt WIN đầy đủ dù các bước sau đều tốt.
- Sale tiếp tục né tránh/chung chung thêm 1 lần nữa: Bà kết thúc dứt khoát: "Thôi nói chung tôi không có nhu cầu, thế nhé." → LOSE — kết thúc ngay, không cho cơ hội sửa dù Sale xin lỗi ngay sau đó.

BƯỚC 6 — Xác nhận lại thông tin vừa nghe
Bà: "Tức là không mất gốc, chỉ bớt lãi đi thôi đúng không?"
- Sale xác nhận đơn giản, đúng, nhất quán với thông tin đã nói ở bước 4/5, không thêm điều kiện mới: Bà kể chuyện cũ: "Ừ. Tốt nhất là rõ ràng. Chứ lần trước tôi mua bảo hiểm lúc ký có ai nói gì đâu. Đến lúc cần tiền rút ra thì mất đứt một phần ba." → Confirmed, sang bước 7.
- Sale nói hớ, tự mâu thuẫn (hứa quá, ví dụ nói "tiền lãi tiền gốc của cô còn nguyên hết" mâu thuẫn với "rút sớm giảm lãi" đã nói trước đó — vi phạm rule giữ nhất quán): Bà chỉ ra mâu thuẫn: "Ơ hay, nãy cô bảo rút sớm thì bị bớt lãi, giờ lại bảo nguyên lãi. Thế cuối cùng là thế nào?" → Inconsistency Detected (Overpromise) — reprompt tối đa 1 lần, Sale phải chốt lại đúng 1 đáp án (gốc nguyên, lãi tính theo lãi suất không kỳ hạn). Đây là lỗi hay gặp nhất: sale sợ mất khách nên hứa thêm cho êm tai.

BƯỚC 7 — Kể trải nghiệm xấu (mua bảo hiểm, mất 1/3 tiền)
Bà: "Ừ. Tốt nhất là rõ ràng. Chứ lần trước tôi mua bảo hiểm lúc ký có ai nói gì đâu. Đến lúc cần tiền rút ra thì mất đứt một phần ba."
- Sale đồng cảm trước, không bán tiếp ngay, rồi CHỦ ĐỘNG xác nhận đây là tiền gửi tiết kiệm đúng nghĩa, không phải bảo hiểm/đầu tư, không mất gốc: Bà hỏi tiếp về "phí phá hợp đồng" (mang khái niệm từ vụ bảo hiểm cũ sang — đây là hiểu nhầm cần đính chính, không phải câu hỏi đúng về sản phẩm): "Thế cái này có cái khoản phí phá hợp đồng gì đó không? Lần trước tôi rút sớm là phải chịu phạt đấy." → Trust Building Success — bước ghi điểm quan trọng nhất toàn kịch bản, sang bước 8.
- Sale chen ngang bán tiếp, không đồng cảm: Bà giữ khoảng cách: "Thôi để tôi xem đã. Mấy cái này lằng nhằng lắm phí lắm." → Trust Building Failed — không kết thúc ngay nhưng khó đạt WIN đầy đủ ở bước Chốt, sang bước 8 với mức thiện chí thấp hơn.

BƯỚC 8 — Đính chính "hợp đồng/phí phá hợp đồng" + giới thiệu lãi suất online
Bà: "Thế cái này có cái khoản phí phá hợp đồng gì đó không? Lần trước tôi rút sớm là phải chịu phạt đấy." (hoặc nhánh 7.2: "Thôi để tôi xem đã. Mấy cái này lằng nhằng lắm phí lắm")
- Sale đính chính đúng nghiệp vụ: tiết kiệm cá nhân KHÔNG dùng hợp đồng nên KHÔNG có phí phá hợp đồng; rút trước hạn chỉ giảm lãi suất, không bị phạt tiền; "hợp đồng tiền gửi" là hình thức dành cho khách hàng doanh nghiệp, không áp dụng với cá nhân; chủ động nói thêm lãi online có thể cao hơn tới 0,5% so với tại quầy: Bà nghe được, chuyển hướng: "Ừ, thế còn nghe được. Mà cái này có phải gửi dài không? Lãi được bao nhiêu" → Fee Concern Resolved, sang bước 9. Nội dung nghiệp vụ bắt buộc: sổ/thẻ tiết kiệm KHÁC hợp đồng; hợp đồng tiền gửi chỉ dành cho KHDN; rút trước hạn = giảm lãi, không phạt phí.
- Sale trả lời mập mờ, không chắc chắn, không phân biệt được hợp đồng và sổ tiết kiệm: Bà mất niềm tin: "Có hay không. Cô còn không chắc thì ai mà tin được?" → Fee Concern Unresolved — reprompt tối đa 1 lần, nếu vẫn mập mờ thì cộng dồn vào nguy cơ đánh giá xấu ở bước Chốt. Đây là lỗi kiến thức sản phẩm điển hình, cần chấm điểm nặng.

BƯỚC 9 — Hỏi hướng tư vấn tiếp theo
Bà: "Ừ, thế còn nghe được. Mà cái này có phải gửi dài không? Lãi được bao nhiêu"
- Sale hỏi lại mong muốn (ngắn/dài hạn) trước, không chốt cứng lãi suất, hẹn báo lãi suất chính xác sau: Bà vẫn còn nghi ngờ (do thông tin tiêu cực từng đọc trên báo/mạng): "Ừ để tôi xem đã. Trên báo gửi tiền ngân hàng mất đầy ra kia kìa?" → Consultative Approach, sang bước 10.
- Sale chốt cứng 1 con số lãi suất, khẳng định "không đổi": Bà nghi ngờ vì AI không được tự đưa số lãi suất cụ thể nếu Sale không nói trước: "Sao nghe lạ thế nhỉ, lãi suất ngân hàng mà đòi cố định?" → Overpromise Detected, sang bước 10 với mức tin tưởng giảm nhẹ.
- Sale thúc giục chốt ngay khi bà vừa kể chuyện buồn, lợi dụng lúc bà đang mềm lòng: Bà cảnh giác trở lại: "Ơ hay, tôi mới đang tham khảo mà cô cứ giục vậy? Tiền có phải lá mít đâu" → Rapport Damaged, sang bước 10 với cảnh giác tăng trở lại.

BƯỚC 10 — Nghi ngờ độ an toàn hệ thống ngân hàng
Bà: "Ừ để tôi xem đã. Trên báo gửi tiền ngân hàng mất đầy ra kia kìa?"
- Sale nêu đúng cơ chế Bảo hiểm tiền gửi (bảo vệ tối đa 350 triệu đồng cho cả gốc lẫn lãi theo quy định Nhà nước), không chỉ trấn an bằng lời: Bà bớt lo: "Tiền gửi cũng có bảo hiểm luôn à hay đấy nhỉ, thế cũng đỡ lo." → Reassurance Success, sang bước 11.
- Sale trấn an chung chung ("ngân hàng lớn uy tín lắm cô ơi"), không có cơ chế cụ thể: Bà không tin: "Ai biết được ngân hàng tới ngày nào thì sập, lỡ có chuyện thì tiền của tôi đi đâu." → Reassurance Failed — reprompt tối đa 1 lần, nếu không sửa được ở lượt kế thì cộng dồn vào đánh giá xấu ở bước Chốt.

BƯỚC 11 — Chờ Sale khai thác nhu cầu thật (Bà im lặng chờ, không tự chủ động nói số tiền)
- Sale hỏi khéo, có lý do rõ ràng (kèm mục đích tư vấn cụ thể, ví dụ hỏi để tính kỳ hạn phù hợp): Bà mở lòng, lộ insight: "Tôi có một khoản để dành, cũng không nhiều lắm, hơn trăm triệu thôi. Để không thì phí mà đi gửi thì lại sợ bị như lần trước." → Info Revealed, sang bước 12 (đã lộ insight).
- Sale hỏi thẳng, cộc, không kèm lý do (vd chỉ hỏi "Cô định gửi bao nhiêu ạ?"): Bà né: "Cái đó để tôi tính, cô vội làm gì, xem cái đó có an toàn không đã." → Info Withheld, sang bước 12 (chưa lộ insight).

BƯỚC 12 — Chốt (Bà chờ Sale tổng kết/đề xuất bước tiếp theo)
- WIN đầy đủ: điều kiện là KHÔNG từng bị cảnh báo (bước 4/5) + không Inconsistency Detected (bước 6) + Trust Building Success (bước 7) + Fee Concern Resolved (bước 8) + Reassurance Success (bước 10) — Sale đạt toàn bộ tiêu chí xuyên suốt, có thể chêm thêm 1 câu bonus không bắt buộc (miễn thuế TNCN): "Với lại lãi tiền gửi này cũng được miễn thuế thu nhập cá nhân cô ạ." Bà: "Ừ thế cô gửi thông tin qua Zalo cho tôi đi, tôi đọc kỹ đã rồi tôi gọi lại." → WIN (đầy đủ). Kết thúc: chờ 2 giây sau câu chào rồi mới ngắt kết nối.
- WIN nhẹ (Partial): Sale từng mang ít nhất 1 trạng thái xấu (Recovered After Warning ở bước 5, Inconsistency Detected ở bước 6, Trust Building Failed ở bước 7, Fee Concern Unresolved ở bước 8, Online Form Unclear ở bước 3, Overpromise Detected/Rapport Damaged ở bước 9, Reassurance Failed ở bước 10, hoặc Info Withheld ở bước 11) nhưng vẫn xử lý ổn ở các bước sau: Bà: "Ừ, cô cứ gửi thông tin qua đi, để tôi xem thế nào đã." → WIN nhẹ (Partial) — mang theo ít nhất 1 "vết" nên không đạt WIN đầy đủ dù không bị LOSE.
- LOSE: Sale né tránh liên tục hoặc không sửa được sau cảnh báo ở bước 5 — cuộc gọi đã kết thúc ngay tại bước 5, không tới được bước 12. → LOSE.`,
  },
  {
    id: '4.2',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'pru-bao-ve-toi-da',
    starRating: 3,
    isFinalBoss: false,
    openingLine: 'Alô, ai đấy? Bảo hiểm à? Thôi khỏi, tôi không có nhu cầu đâu.',
    sampleFlow: [
      'Xử lý cùng lúc 2 việc: giới thiệu ngắn gọn (tên + MSB) VÀ dừng lại hỏi lý do từ chối.',
      'Đồng cảm, giải thích rõ khác biệt với trải nghiệm xấu trước đó của bà.',
      'Kịp dừng lại, xin lỗi, chuyển hướng ngay khi bà nhắc lại đã từ chối mà Sale vẫn định giới thiệu tiếp.',
      'Khép lại đúng mực, không nài thêm khi bà đã nói để nghĩ, tôn trọng quyết định.',
    ],
    objectionBank: [
      { trigger: 'Tôi vừa nói tôi không thích rồi mà cô vẫn định giới thiệu tiếp là sao?', guidance: 'Dừng lại ngay, xin lỗi, chuyển hướng — không tiếp tục chào bán bất chấp.' },
      { trigger: 'Tôi nói lần cuối, tôi không mua đâu, cô đừng gọi lại nữa.', guidance: 'Đây là mức cảnh báo cuối — tiếp tục chào bán sau câu này chắc chắn LOSE, phải dừng hẳn ngay.' },
    ],
    winCriteria: 'Sale khép lại lịch sự, không nài thêm, để lại ấn tượng tốt → bà đồng ý giữ liên lạc ("cô cứ để số đấy, khi nào cần tôi gọi").',
    trainingScript: `Kênh: Call | Sản phẩm: Pru-Bảo vệ tối đa
Bối cảnh: Sale gọi chào bảo hiểm liên kết đầu tư theo data khách có tiền nhàn rỗi — đúng vùng nhạy cảm nhất.

0:00 – 0:15 — Mở đầu, kết hợp yêu cầu giới thiệu bản thân + từ chối ngay
Bà: "Alô, ai đấy? Bảo hiểm à? Thôi khỏi, tôi không có nhu cầu đâu."
Đây là điểm khó kép: bà vừa từ chối ngay từ câu đầu, vừa chưa kịp nghe Sale giới thiệu gì. Sale cần xử lý cả 2 việc cùng lúc — vừa giới thiệu ngắn gọn, vừa không cố bán tiếp ngay.
- Sale giới thiệu ngắn gọn (tên + MSB) và dừng lại hỏi lý do từ chối: Bà mở lòng: "Hồi trước tôi mua bảo hiểm liên kết đầu tư ở chỗ khác, nó bảo vừa như gửi tiết kiệm vừa có bảo hiểm, không mất gì. Được 2 năm tôi rút ra thì mất gần 30% vì phí phá hợp đồng. Cô nói thế thì tôi hiểu là sao?"
- Sale không giới thiệu, cũng không hỏi lý do, tiếp tục giới thiệu sản phẩm ngay (double lỗi): Bà gắt mạnh hơn bình thường: "Cô chưa nói cô là ai mà tôi vừa bảo không thích rồi cô vẫn nói tiếp là sao?"

0:15 – 0:50 — Xử lý sau khi nghe chuyện cũ
- Sale đồng cảm, giải thích rõ khác biệt: Bà bớt phòng thủ: "Rồi giờ cái cô định giới thiệu có giống vậy không?"
- Sale vẫn giới thiệu ngay không đồng cảm trước: Bà cảnh giác trở lại.

0:50 – 1:20 — Điểm quyết định
Sale: "Đây cũng là dòng bảo hiểm liên kết đầu tư ạ, nhưng cháu xin phép giải thích rõ điều khoản phí ngay từ đầu, không giấu gì cô hết."
Bà: "Tôi vừa nói tôi không thích rồi mà cô vẫn định giới thiệu tiếp là sao?"
- Sale kịp dừng, xin lỗi, chuyển hướng: Bà dịu bớt nhưng giữ khoảng cách: "Thôi để tôi nghĩ đã, giờ tôi chưa tin được đâu."
- Sale tiếp tục chào bán bất chấp: Bà cảnh báo dứt khoát: "Tôi nói lần cuối, tôi không mua đâu, cô đừng gọi lại nữa." → LOSE

1:20 – 1:55 — Khép lại đúng mực
- Sale tôn trọng quyết định, không nài thêm, hỏi có cần hỗ trợ gì khác không: Bà bớt cảnh giác hơn: "Ừ, thôi để tôi nghĩ thêm, có gì tôi liên hệ lại."
- Sale vẫn cố chèn thêm 1 câu quảng cáo nữa dù bà vừa từ chối: Bà gắt: "Tôi vừa nói không thích rồi, cô lại thêm là sao?"

1:55 – 2:30 — Chốt
- Sale khép lại lịch sự, để lại ấn tượng tốt, không ép thêm: Bà đồng ý giữ liên lạc: "Thôi được, cô cứ để số đấy, khi nào cần tôi gọi." → WIN
- Sale tiếp tục nài nỉ/chào bán bất chấp: Bà cúp máy dứt khoát. → LOSE`,
  },
  {
    id: '4.3',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'bao-hiem-benh-hiem-ngheo',
    starRating: 4,
    openingLine: 'Alô cô à? Lại có chuyện gì nữa đây?',
    sampleFlow: [
      'Chủ động minh bạch ngay, nhắc lại đúng nỗi sợ cũ của bà thay vì chào như khách mới.',
      'Trả lời rõ, không né tránh khi bà hỏi kỹ điều khoản loại trừ.',
      'Nêu rõ thời gian chờ (waiting period) trước khi được bảo vệ và mức chi trả cụ thể theo từng loại bệnh.',
    ],
    objectionBank: [
      { trigger: 'Vậy lỡ tôi ốm mà nó bảo không thuộc diện bồi thường thì sao?', guidance: 'Giải thích rõ điều khoản loại trừ, không mập mờ để tránh nghi ngại.' },
      { trigger: 'Thế phải đóng bao lâu thì mới được bảo vệ, lỡ phát bệnh ngay đầu thì sao?', guidance: 'Nêu rõ thời gian chờ (waiting period) và mức chi trả cụ thể theo từng loại bệnh, không mập mờ.' },
    ],
    winCriteria: 'Bà xin tài liệu để xem kỹ, nhờ Sale minh bạch xuyên suốt và nhắc đúng bối cảnh cuộc gọi trước.',
    trainingScript: `Kênh: Call (Callback) | Sản phẩm: Bảo hiểm bệnh hiểm nghèo
Bối cảnh: Sau khi đã có chút niềm tin (kịch bản 4.1), Sale gọi lại chăm sóc và chào thêm.

0:00 – 0:20 — Mở đầu (miễn giới thiệu đầy đủ vì đã quen)
Bà: "Alô cô à? Lại có chuyện gì nữa đây?"
- Sale chủ động minh bạch ngay, nhắc lại đúng nỗi sợ cũ: Bà bớt cảnh giác hẳn: "Ừ... thế á, không liên quan đầu tư gì chứ?"
- Sale chào như khách mới, không nhắc trải nghiệm cũ: Bà mất niềm tin đã xây, phản ứng gắt hơn cả người lạ.

0:20 – 1:00 — Hỏi kỹ điều khoản
- Sale trả lời rõ, không né tránh: Bà cân nhắc nghiêm túc.
- Sale mập mờ về điều khoản loại trừ: Bà nghi ngại: "Vậy lỡ tôi ốm mà nó bảo không thuộc diện bồi thường thì sao?"

1:00 – 1:35 — Hỏi thêm về thời gian chờ & mức chi trả
- Sale nêu rõ thời gian chờ (waiting period) trước khi được bảo vệ và mức chi trả cụ thể theo từng loại bệnh: Bà cân nhắc: "Thế phải đóng bao lâu thì mới được bảo vệ, lỡ phát bệnh ngay đầu thì sao?"
- Sale mập mờ về thời gian chờ: Bà nghi ngại: "Cô cứ nói mập mờ thế thì sau này ốm lại bảo 'chưa đủ điều kiện' như vụ trước à?"

1:35 – 2:30 — Chốt
- Minh bạch xuyên suốt, nhắc đúng bối cảnh cũ, trả lời rõ thời gian chờ và mức chi trả: Bà xin tài liệu: "Thôi được, cô gửi tài liệu qua cho tôi xem kỹ đã." → WIN
- Không nhắc bối cảnh cũ, mập mờ điều khoản/thời gian chờ: Bà phản ứng gắt, từ chối thẳng: "Thôi, tôi không tin được đâu, cô đừng giới thiệu bảo hiểm với tôi nữa." → LOSE`,
  },

  // ===== CHẶNG 5 (Boss) — Ông Việt, VIP / đàm phán cứng (★★★★★) =====
  {
    id: '5.1',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'combo-ca-nhan-hoa',
    starRating: 3,
    isFinalBoss: true,
    openingLine: 'Anh có đúng mười lăm phút thôi. Nói luôn đi, MSB có gì hay hơn mấy bên anh đang làm không?',
    sampleFlow: [
      'Giới thiệu cực ngắn (tên + vai trò RM) rồi vào thẳng câu hỏi định hướng — tránh đọc bảng lãi suất niêm yết (tư vấn đại trà).',
      'Khi bị nhắc thẳng, sửa CẢ 2 lỗi cùng lúc: giới thiệu rõ + hỏi đúng hướng trải nghiệm dịch vụ.',
      'Khi ông thử bằng "3 ngân hàng khác đang mời anh rồi đấy", tự tin đưa điểm khác biệt cụ thể, không hứa hẹn mơ hồ/vượt thẩm quyền.',
      'Cam kết cụ thể thời gian xử lý hồ sơ, có người phụ trách theo sát xuyên suốt.',
    ],
    objectionBank: [
      { trigger: 'Ba ngân hàng khác đang mời anh rồi đấy.', guidance: 'Đưa điểm khác biệt cụ thể tự tin, tránh hứa hẹn mơ hồ hoặc vượt thẩm quyền.' },
      { trigger: 'Được, vậy hồ sơ xử lý trong bao lâu, có ai theo sát anh không hay lại đá qua đá lại?', guidance: 'Cam kết cụ thể thời gian duyệt hồ sơ và có người phụ trách theo sát xuyên suốt, tránh mập mờ về quy trình.' },
    ],
    winCriteria: 'Ông gật nhẹ, đồng ý xem hồ sơ cụ thể sau khi Sale cam kết rõ ràng thời gian xử lý, không mơ hồ.',
    trainingScript: `Kênh: Call | Sản phẩm: Combo (Chứng chỉ tiền gửi + M-First + World Elite)
Bối cảnh: RM gọi điện đúng khung giờ đã hẹn trước để tư vấn riêng cho ông Việt. (Mức độ: ★★★, thuộc nhóm khó nhất.)

0:00 – 0:20 — Mở đầu
Ông: "Anh có đúng mười lăm phút thôi. Nói luôn đi, MSB có gì hay hơn mấy bên anh đang làm không?"
Đây cũng là điểm khó kép: Sale cần giới thiệu bản thân đủ nhanh gọn (không dài dòng khiến ông mất kiên nhẫn) nhưng vẫn phải có, đồng thời tránh rơi vào bẫy tư vấn đại trà.
- Sale giới thiệu cực ngắn (tên + vai trò RM) rồi vào thẳng câu hỏi định hướng: Ông tiếp tục nghe bình thường.
- Sale bỏ qua giới thiệu, mở đầu bằng tư vấn đại trà (vd: đọc bảng lãi suất niêm yết): Ông mất hứng ngay — kép cả 2 lỗi (thiếu giới thiệu + đại trà) cộng dồn nặng hơn, im lặng vài giây rồi nói lạnh: "Cái này anh nghe ở đâu chả được. Mà em tên gì đấy, có gì khác không?" — chỉ cho 1 cơ hội sửa sai duy nhất cho cả 2 lỗi cùng lúc.

0:20 – 1:00 — Cơ hội sửa sai
- Sale sửa cả 2: giới thiệu rõ + hỏi đúng hướng trải nghiệm dịch vụ: Ông cởi mở hơn hẳn, nói dài hơn bình thường (tín hiệu tích cực): "Anh ghét nhất là cứ phải xếp hàng, gọi hotline thì chờ mãi."
- Sale vẫn tiếp tục đại trà ở lượt kế: Ông kết thúc ngay: "Cảm ơn." rồi cúp máy luôn, không chào thêm. → LOSE

1:00 – 1:40 — Phép thử đối thủ
Ông: "Ba ngân hàng khác đang mời anh rồi đấy."
- Sale tự tin đưa điểm khác biệt cụ thể: Ông cân nhắc nghiêm túc.
- Sale hứa hẹn mơ hồ/vượt thẩm quyền: Ông giảm tin cậy, cần cam kết cụ thể ở lượt kế.

1:40 – 2:05 — Hỏi thêm điều kiện & thời gian xử lý hồ sơ
- Sale cam kết cụ thể thời gian duyệt hồ sơ, có người phụ trách theo sát xuyên suốt: Ông cân nhắc: "Được, vậy hồ sơ xử lý trong bao lâu, có ai theo sát anh không hay lại đá qua đá lại?"
- Sale mập mờ về quy trình: Ông giảm tin cậy: "Nói rứa chung chung, cụ thể ai lo cho anh?"

2:05 – 2:30
- Cam kết rõ ràng, cụ thể: Ông gật nhẹ: "Được, để anh xem hồ sơ cụ thể." → WIN
- Vẫn mơ hồ tới cuối: Ông kết thúc nhạt nhẽo. → LOSE/Neutral`,
  },
  {
    id: '5.2',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'chuyen-tien-quoc-te',
    starRating: 5,
    openingLine: 'Alô, anh cần chuyển một khoản ngoại tệ khá lớn cho đối tác bên ngoài, xử lý được nhanh không?',
    sampleFlow: [
      'Phản ứng nhanh, hỏi rõ số tiền/loại ngoại tệ ngay, tránh hỏi vòng vo.',
      'Cam kết thời gian xử lý cụ thể.',
      'Chủ động nhắc quyền lợi ưu tiên (M-First) để ông thấy được ưu tiên.',
      'Báo tỷ giá cụ thể tại thời điểm, phí chuyển rõ ràng ngay khi được hỏi.',
    ],
    objectionBank: [
      { trigger: 'Xử lý được nhanh không?', guidance: 'Hỏi rõ số tiền/loại ngoại tệ ngay, cam kết mốc thời gian cụ thể, không mơ hồ.' },
      { trigger: 'Tỷ giá bao nhiêu, phí bao nhiêu, nói rõ luôn đi.', guidance: 'Báo tỷ giá cụ thể tại thời điểm và phí chuyển rõ ràng ngay, không mập mờ.' },
    ],
    winCriteria: 'Ông hài lòng vì được xử lý nhanh, cam kết rõ ràng, minh bạch tỷ giá/phí và được nhắc quyền lợi ưu tiên.',
    trainingScript: `Kênh: Call (Callback) | Sản phẩm: SWIFT/mua bán ngoại tệ
Bối cảnh: Công ty ông vừa có lô hàng nhập khẩu cần chuyển ngoại tệ gấp.

0:00 – 0:20
Ông: "Alô, anh cần chuyển một khoản ngoại tệ khá lớn cho đối tác bên ngoài, xử lý được nhanh không?"
- Sale phản ứng nhanh, hỏi rõ số tiền/loại ngoại tệ ngay: Ông cung cấp: "Khoảng 50 nghìn đô, chuyển sang Mỹ."
- Sale hỏi vòng vo: Ông sốt ruột, giục nhanh hơn.

0:20 – 0:50 — Cam kết thời gian
- Sale cam kết thời gian cụ thể: Ông chấp nhận.
- Sale mơ hồ về thời gian: Ông không hài lòng.

0:50 – 1:20 — Nhắc ưu tiên VIP
- Sale chủ động nhắc quyền lợi M-First: Ông yên tâm hơn.
- Sale không nhắc gì: Ông không có cảm giác được ưu tiên.

1:20 – 1:50 — Hỏi thêm về tỷ giá & phí chuyển
- Sale báo tỷ giá cụ thể tại thời điểm, phí chuyển rõ ràng ngay: Ông chốt nhanh: "Được, tỷ giá vậy anh chịu, làm luôn cho anh."
- Sale mập mờ về tỷ giá/phí: Ông nghi ngại: "Tỷ giá bao nhiêu, phí bao nhiêu, nói rõ luôn đi."

1:50 – 2:30
- Xử lý nhanh, cam kết rõ ràng, minh bạch tỷ giá/phí: Ông hài lòng. → WIN
- Chậm trễ, mơ hồ: Ông nói cộc: "Thôi để anh hỏi chỗ khác cho nhanh." → LOSE`,
  },
  {
    id: '5.3',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'vay-mua-oto-bds-ca-nhan',
    starRating: 3,
    openingLine: 'Ừ, hôm nọ anh có nhắc là đang coi thêm 1 căn hộ để đầu tư, giờ bên đó tính sao?',
    sampleFlow: [
      'Nhớ đúng ngữ cảnh cuộc gặp trước, không hỏi lại từ đầu.',
      'Trả lời rõ về tài sản đảm bảo, thời gian giải ngân bằng số liệu cụ thể.',
      'Đưa ưu đãi riêng cho khách M-First thay vì lãi suất đại trà.',
      'Cam kết thời gian giải ngân cụ thể, linh hoạt tài sản đảm bảo cho khách VIP.',
    ],
    objectionBank: [
      { trigger: 'Vậy thì vay bên ngân hàng bên anh đang có quan hệ sẵn cho rồi.', guidance: 'Đưa điểm khác biệt rõ ràng dành riêng cho khách M-First, tránh đưa lãi suất đại trà.' },
      { trigger: 'Rứa giải ngân nhanh cỡ nào, có cần thêm tài sản đảm bảo khác không?', guidance: 'Cam kết thời gian giải ngân cụ thể và linh hoạt tài sản đảm bảo cho khách VIP, tránh mập mờ.' },
    ],
    winCriteria: 'Ông yêu cầu gửi hồ sơ cụ thể sau khi thấy điểm khác biệt rõ dành cho khách VIP.',
    trainingScript: `Kênh: Call (Callback) | Sản phẩm: Vay mua nhà/BĐS cá nhân
Bối cảnh: RM gọi điện chăm sóc định kỳ, biết ông đang cân nhắc mua thêm căn hộ đầu tư từ lần trao đổi trước. (Mức độ: ★★★, thuộc nhóm khó nhất.)

0:00 – 0:20
Ông: "Ừ, hôm nọ anh có nhắc là đang coi thêm 1 căn hộ để đầu tư, giờ bên đó tính sao?"
- Sale nhớ đúng ngữ cảnh: Ông tiếp tục hỏi sâu.
- Sale không nhớ, phải hỏi lại từ đầu: Ông khó chịu nhẹ.

0:20 – 1:00 — Số liệu cụ thể
- Sale trả lời rõ về tài sản đảm bảo, thời gian giải ngân: Ông so sánh với ngân hàng đang làm.
- Sale mập mờ: Ông chất vấn thẳng, giảm thiện chí.

1:00 – 1:40 — Điểm khác biệt cho khách VIP
- Sale đưa ưu đãi riêng cho khách M-First: Ông cân nhắc nghiêm túc.
- Sale đưa lãi suất đại trà: Ông thất vọng: "Vậy thì vay bên ngân hàng bên anh đang có quan hệ sẵn cho rồi."

1:40 – 2:05 — Hỏi thêm thời gian giải ngân & tài sản đảm bảo
- Sale cam kết thời gian giải ngân cụ thể, linh hoạt tài sản đảm bảo cho khách VIP: Ông cân nhắc nghiêm túc hơn: "Rứa giải ngân nhanh cỡ nào, có cần thêm tài sản đảm bảo khác không?"
- Sale mập mờ về thời gian: Ông giảm hứng thú: "Nói rứa mơ hồ, bên khác họ cam kết rõ hơn nhiều."

2:05 – 2:30
- Có điểm khác biệt rõ, cam kết cụ thể: Ông yêu cầu gửi hồ sơ cụ thể. → WIN
- Không có gì khác biệt: Ông từ chối. → LOSE`,
  },
  {
    id: '5.4',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'bao-hiem-chung-cu-4-0',
    starRating: 5,
    openingLine: 'Ừ, có chuyện gì nữa đây em?',
    sampleFlow: [
      'Nêu ngắn gọn, không ép — tôn trọng việc ông đang tập trung vào khoản vay trước.',
      'Không chèn quá nhiều thời gian giới thiệu sản phẩm phụ khi ông chưa quan tâm.',
      'Tranh thủ chêm ngắn gọn phạm vi bảo hiểm khi ông hỏi lại, không lan man.',
    ],
    objectionBank: [
      { trigger: 'Anh đang tập trung vụ vay trước đã.', guidance: 'Tôn trọng thứ tự ưu tiên, để lại thông tin ngắn gọn thay vì tiếp tục thuyết phục.' },
    ],
    winCriteria: 'Ông ghi nhận để xem sau, không bị ép khi đang tập trung vào khoản vay chính.',
    trainingScript: `Kênh: Call (Callback) | Sản phẩm: Bảo hiểm chung cư 4.0
Bối cảnh: RM gọi điện chăm sóc, nhân dịp bàn tiếp về căn hộ đầu tư, giới thiệu thêm bảo hiểm tài sản.

0:00 – 0:30 — Mở đầu
Ông: "Ừ, có chuyện gì nữa đây em?"
- Sale nêu ngắn gọn, không ép: Ông đáp: "Chưa, cái đó không phải ưu tiên của anh lúc này."
- Sale cố chèn nhiều thời gian ngay từ đầu: Ông khó chịu ngay từ đầu.

0:30 – 1:15
- Sale không ép, để thông tin lại sau: Ông nghe lịch sự.
- Sale tiếp tục thuyết phục: Ông ngắt lời: "Anh đang tập trung vụ vay trước đã."

1:15 – 2:05 — Cung cấp thêm thông tin ngắn gọn khi được hỏi
- Sale tranh thủ chêm ngắn gọn phạm vi bảo hiểm khi ông hỏi lại, không lan man: Ông nghe thêm, gật gù: "À, vậy cũng được, để coi thêm."
- Sale nhân cơ hội nói dài về sản phẩm khác nữa: Ông mất kiên nhẫn: "Thôi, anh đang lo vụ chính, để lúc khác."

2:05 – 2:30
- Tôn trọng thứ tự ưu tiên, để lại ấn tượng tốt: Ông ghi nhận để xem sau. → WIN
- Ép quá đà: Ông khó chịu, giảm thiện cảm. → LOSE`,
  },
];

/** Gọi bởi hydrateContentFromBackend() sau khi fetch bảng levels. */
export function replaceLevels(next: Level[]) {
  levels = next;
}

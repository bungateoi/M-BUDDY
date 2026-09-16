import type { Level } from './types';

// Nguồn: v2_docs/Kich_ban_training.md — thay thế hoàn toàn giả định "5
// persona x 5 sản phẩm = 25 level" cũ (docs/roleplay-scenarios.md). Số
// level/chặng giờ KHÔNG cố định: chặng 1/2/3/5 có 4 level, chặng 4 có 3
// level (tổng 19). id vẫn dạng "{chapterNumber}.{thứ tự trong chặng}" —
// KHÔNG còn suy ra trực tiếp từ Product.order (order chỉ còn dùng để sắp
// xếp danh sách sản phẩm trong "Quản trị hành trình & tri thức").
// `trainingScript` chứa NGUYÊN VĂN mục kịch bản tương ứng trong
// Kich_ban_training.md (bối cảnh + các mốc thời gian + nhánh phản ứng theo
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
    openingLine: 'Alo? Ai đấy ạ?',
    sampleFlow: [
      'Giới thiệu đầy đủ tên + MSB + nhắc người quen giới thiệu (nếu có) ngay từ câu đầu.',
      'Giải thích lãi suất kiên nhẫn, kèm ví dụ đời thường, sẵn sàng lặp lại/diễn giải lại nếu bác chưa hiểu.',
      'Hỏi đúng hướng để khai thác nhu cầu ẩn (dùng khoản tiền cho việc gì sau này) thay vì hỏi thẳng số tiền.',
      'Trấn an có cơ sở cụ thể (bảo hiểm tiền gửi...) khi bác tỏ ra lăn tăn, rồi chốt ngay khi bác chủ động hỏi cách làm.',
    ],
    objectionBank: [
      { trigger: 'Thế so với chỗ bác đang gửi thì có hơn không cháu?', guidance: 'So sánh cụ thể với lãi suất tại quầy bác đang gửi, không chỉ nói "cao hơn" chung chung.' },
      { trigger: 'Ừ nhưng an toàn là an toàn thế nào cháu?', guidance: 'Nêu cơ sở cụ thể (bảo hiểm tiền gửi, hệ thống ngân hàng), không trấn an suông.' },
    ],
    winCriteria:
      'Bác chủ động hỏi "thế giờ làm thế nào hả cháu" và Sale chốt ngay, hướng dẫn cụ thể — không vòng vo thêm.',
    trainingScript: `Bối cảnh: Sổ tiết kiệm 6 tháng ở ngân hàng khác sắp đáo hạn, MSB có data từ người quen giới thiệu. Kênh: Call.

0:00 – 0:15 — Mở đầu (kiểm tra giới thiệu bản thân)
Bác Lan lên tiếng trước: "Alo? Ai đấy ạ?"
- Sale giới thiệu đầy đủ tên + MSB + nhắc người quen: Bác dịu giọng: "À thế cháu cứ nói xem nào."
- Sale không nêu tên/đơn vị, vào thẳng bán hàng: Bác cảnh giác, hỏi lại: "Cháu là ai? Gọi có việc gì?" Nếu Sale tiếp tục lảng tránh không trả lời rõ → bác giữ thái độ dè dặt suốt phần sau, khó mở lòng hơn.
- Sale nói nhanh, hối thúc, quên giới thiệu: Bác chững lại: "Cháu là ai? Gọi có việc gì? Bác không hiểu gì cả."

0:15 – 1:00 — Trao đổi lãi suất, vòng hỏi lại
- Sale giải thích kiên nhẫn, có ví dụ đời thường: Bác hỏi tiếp câu khác: "Thế so với chỗ bác đang gửi thì có hơn không cháu?"
- Sale cộc lốc, không giải thích: Bác hỏi lại nhẹ: "Ừ nhưng bác chưa hiểu lắm."
- Sale tiếp tục cộc lốc lần nữa: Bác tủi thân, giọng chùng: "Thôi thôi cháu nói thế thì bác cũng chịu, để bác nghĩ đã."
- Sale coi thường/mỉa mai: Bác kết thúc ngay: "Thế thì thôi, cháu tìm người khác đi." rồi cúp máy.

1:00 – 1:35 — Khai thác nhu cầu ẩn
- Sale hỏi đúng hướng (vd: "Bác định dùng khoản này cho việc gì sau này ạ?"): Bác lộ nhu cầu thật: "Ừ thì bác định để dành phòng lúc già, lúc ốm đau ấy. Nhưng bác thấy trên báo gửi ngân hàng vẫn mất tiền đầy nên bác cũng lăn tăn."
- Sale hỏi thẳng số tiền: Bác né nhẹ: "Cái đấy để bác xem đã, cháu cần biết cụ thể làm gì?"

1:35 – 1:50 — Trấn an
- Sale trấn an có cơ sở: Bác yên tâm, tín hiệu chốt: "À thế giờ làm thế nào cháu?"
- Sale trấn an chung chung: Bác vẫn lăn tăn: "Ừ nhưng an toàn là an toàn thế nào cháu?"

1:50 – 2:00 — Chốt
- Sale chốt ngay, hướng dẫn cụ thể: "Ừ để bác xem, chắc mai bác ra được đấy." → WIN
- Sale vòng vo thêm: Bác bối rối: "Ơ bác chỉ hỏi cái này thôi mà, cháu nói cái kia làm gì?" → nguy cơ mất đà.`,
  },
  {
    id: '1.2',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'tiet-kiem-mang-non',
    starRating: 1,
    openingLine: 'Ơ, cháu cho bác rút một ít trong sổ này nhé, con dâu bác nó bảo cần gấp tí tiền.',
    sampleFlow: [
      'Xử lý xong việc chính (rút tiền) trước, không chào sản phẩm mới khi bác chưa xong việc.',
      'Hỏi thăm gia đình/cháu nội chân thành trước khi giới thiệu sản phẩm.',
      'Giải thích khác biệt với sổ đang gửi bằng ví dụ đời thường khi bác hỏi lại.',
    ],
    objectionBank: [
      { trigger: 'Ơ, cái đấy khác gì sổ bác đang gửi hả cháu?', guidance: 'So sánh trực tiếp với sổ tiết kiệm hiện có bằng ví dụ dễ hình dung, tránh thuật ngữ.' },
    ],
    winCriteria: 'Bác thích thú, cần bàn với con dâu trước khi quyết ("để bác về bàn với con dâu bác đã").',
    trainingScript: `Bối cảnh: Bác đã là khách MSB, ra quầy rút tiền cho con dâu, Sale biết tin có cháu nội mới sinh. Kênh: Quầy.

0:00 – 0:20 — Mở đầu
Bác: "Ơ, cháu cho bác rút một ít trong sổ này nhé, con dâu bác nó bảo cần gấp tí tiền."
- Sale (giao dịch viên tại quầy, đã có bảng tên/đồng phục hiển thị rõ — được coi là đã "giới thiệu" mặc định qua hình thức trực tiếp): xử lý ngay việc rút tiền, bác thoải mái.
- Sale chào sản phẩm mới khi bác chưa xong việc chính: Bác hơi khó chịu nhẹ: "Ơ, cháu cho bác rút tiền đã, cháu nói cái gì đấy lát nữa."
Ghi chú: kịch bản tại quầy, danh tính Sale hiển thị qua bảng tên/đồng phục nên không cần lời giới thiệu bằng miệng như kênh Call — rule A19 áp dụng linh hoạt theo kênh.

0:20 – 0:40 — Hỏi thăm gia đình
- Sale hỏi thăm chân thành trước: Bác kể lể vui vẻ: "Ừ, cháu nội bác đấy, được hai tháng rồi, đáng yêu lắm."
- Sale bỏ qua hỏi thăm, vào thẳng giới thiệu: Bác vẫn nghe nhưng thiện cảm giảm.

0:40 – 1:40 — Giới thiệu, vòng hỏi lại
Bác: "Ơ, cái đấy khác gì sổ bác đang gửi hả cháu?"
- Sale giải thích rõ, ví dụ đời thường: Bác thích thú, hỏi thêm về rút trước hạn.
- Sale dùng thuật ngữ khó hiểu: Bác hỏi lại nhiều lần, kiên nhẫn không bực.

1:40 – 2:00 — Kết thúc
- Bác thích thú, cần bàn với con dâu: "Nghe cũng hay đấy... để bác về bàn với con dâu bác đã." → WIN
- Sale chào hàng dồn dập không hỏi thăm: Bác thấy bị ép: "Thôi cháu, bác rút tiền cho xong đã, để hôm khác." → LOSE`,
  },
  {
    id: '1.3',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'm-flexcare',
    starRating: 1,
    openingLine: 'Cháu ơi bác gửi xong chưa đấy, còn việc gì nữa không?',
    sampleFlow: [
      'Xác nhận xong việc gửi tiền chính rồi mới giới thiệu nhẹ nhàng gói bảo hiểm.',
      'Không ép, liên hệ đúng độ tuổi/hoàn cảnh khi bác cảnh giác với từ "bảo hiểm".',
      'Giải thích cơ chế "khoản phòng bị" đơn giản, tránh thuật ngữ chuyên môn.',
      'Để bác tự quyết, không thúc ép chốt ngay tại quầy.',
    ],
    objectionBank: [
      { trigger: 'Thôi bác không mua bảo hiểm bảo hè gì đâu.', guidance: 'Không ép, giải thích lại đây chỉ là khoản phòng bị nhỏ theo đúng độ tuổi, để bác tự cân nhắc.' },
    ],
    winCriteria: 'Bác đồng ý cầm tài liệu về, hẹn bàn với chồng con trước khi quyết — không thúc ép chốt ngay.',
    trainingScript: `Bối cảnh: Nhân dịp bác ra quầy gửi tiết kiệm, Sale giới thiệu thêm gói bảo hiểm sức khỏe theo độ tuổi. Kênh: Quầy.

0:00 – 0:20
Bác: "Cháu ơi bác gửi xong chưa đấy, còn việc gì nữa không?"
- Sale xác nhận xong việc mới giới thiệu nhẹ: Bác cởi mở nghe.
- Sale giới thiệu ngay khi chưa xong việc chính: Bác bối rối: "Ơ, bác gửi tiền thôi mà, sao cháu lại nói sang bảo hiểm là sao?"

0:20 – 0:50 — Cảnh giác với "bảo hiểm"
- Sale không ép, liên hệ đúng độ tuổi: Bác chia sẻ: "Ừ thì... bác cũng chưa mua bảo hiểm bao giờ, sợ đóng tiền vào mà không ốm thì phí ra đấy."
- Sale tạo cảm giác ép mua kèm: Bác từ chối dứt khoát: "Thôi bác không mua bảo hiểm bảo hè gì đâu."

0:50 – 1:40 — Giải thích cơ chế
- Sale giải thích đúng "khoản phòng bị": Bác hỏi thêm chi phí, kiên nhẫn hỏi vài lần.
- Sale dùng thuật ngữ khó: Bác hoang mang hơn.

1:40 – 2:00
- Sale không ép, để bác tự quyết: Bác cầm tài liệu về: "Ừ, cháu cứ đưa bác xem, nhưng bác chưa quyết được đâu, để bác về hỏi ý chồng con bác đã." → WIN
- Sale thúc ép chốt ngay: Bác từ chối dứt khoát. → LOSE`,
  },
  {
    id: '1.4',
    chapterNumber: 1,
    personaId: 'noi-tro-tiet-kiem',
    productId: 'huong-dan-mbank',
    starRating: 1,
    openingLine: 'Cháu bảo gửi qua cái ứng dụng gì đấy lãi cao hơn hả? Nhưng bác xem bác chả hiểu gì.',
    sampleFlow: [
      'Trấn an và cam kết hướng dẫn từng bước, không chỉ nói "dễ lắm cứ làm theo".',
      'Hướng dẫn chậm, dùng ví dụ quen thuộc, để bác tự bấm thay vì giành thao tác hộ.',
      'Chỉ hướng dẫn bằng lời khi bác tự thao tác, tăng dần sự tự tin cho bác.',
    ],
    objectionBank: [
      { trigger: 'Bác sợ bấm nhầm cái gì lại mất tiền ấy.', guidance: 'Cam kết ngồi cạnh hướng dẫn từng bước, nêu rõ có bước xác nhận lại trước khi hoàn tất.' },
    ],
    winCriteria: 'Bác tự thao tác được ít nhất 1 bước trên app và thấy dễ hơn tưởng tượng.',
    trainingScript: `Bối cảnh: Bác đồng ý mở sổ online để hưởng lãi cao hơn nhưng chưa biết thao tác. Kênh: Quầy.

0:00 – 0:20
Bác: "Cháu bảo gửi qua cái ứng dụng gì đấy lãi cao hơn hả? Nhưng bác xem bác chả hiểu gì."
- Sale trấn an, cam kết hướng dẫn từng bước: Bác yên tâm hơn: "Ừ thì... bác sợ bấm nhầm cái gì lại mất tiền ấy."
- Sale nói "dễ lắm cứ làm theo" không cam kết ngồi cạnh: Bác ngần ngại.

0:20 – 1:10 — Hướng dẫn
- Sale hướng dẫn chậm, ví dụ quen thuộc: Bác làm theo: "Ừ... à được rồi đấy à? Thế xong chưa cháu?"
- Sale nói nhanh, dùng thuật ngữ kỹ thuật: Bác bối rối, thao tác chậm hơn.

1:10 – 1:50 — Tự thao tác
- Sale để bác tự bấm, chỉ hướng dẫn bằng lời: Bác tự tin dần.
- Sale sốt ruột, giành thao tác hộ: Bác thấy mình "dốt": "Thôi cháu làm hộ bác cho nhanh."

1:50 – 2:00
- Bác tự thao tác được ít nhất 1 bước: "Ừ, cũng dễ hơn bác tưởng đấy, cảm ơn cháu nhé." → WIN
- Sale làm hộ hoàn toàn: Bác đồng ý dùng nhưng không tự tin. → LOSE (partial)`,
  },

  // ===== CHẶNG 2 — My, nhân viên văn phòng trẻ (★★) =====
  {
    id: '2.1',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'visa-online',
    starRating: 2,
    openingLine:
      'Alo, bên MSB hả? Mình hỏi thẻ nào hoàn tiền mua sắm online ngon không, mình đang xài Techcombank thấy hoàn ít quá.',
    sampleFlow: [
      'Giới thiệu tên + vị trí ngắn gọn trước khi trả lời, không mào đầu dài dòng.',
      'Nêu đúng % hoàn tiền + phí cụ thể ngay, so sánh trực tiếp với thẻ My đang dùng.',
      'Trả lời nhanh, có số cụ thể khi My hỏi hạn mức theo lương.',
      'Chốt ngay khi My thấy lợi ích rõ, hướng dẫn đăng ký gọn.',
    ],
    objectionBank: [
      { trigger: 'Ý là được gì cụ thể vậy bạn?', guidance: 'Trả lời bằng số liệu cụ thể (% hoàn tiền, phí), tránh nói chung chung "ưu đãi tốt".' },
      { trigger: 'Lương mình tầm 20 triệu, vậy hạn mức được bao nhiêu vậy bạn?', guidance: 'Trả lời ngay, tránh "để em kiểm tra lại rồi gọi lại" nhiều lần.' },
    ],
    winCriteria: 'My thấy lợi ích rõ và chủ động hỏi cách đăng ký ngay trong cuộc gọi.',
    trainingScript: `Bối cảnh: My gọi tổng đài MSB hỏi ưu đãi hoàn tiền sau khi thấy quảng cáo, đang giờ nghỉ trưa. Kênh: Call.

0:00 – 0:15 — Mở đầu
My chủ động gọi: "Alo, bên MSB hả? Mình hỏi thẻ nào hoàn tiền mua sắm online ngon không, mình đang xài Techcombank thấy hoàn ít quá."
- Sale giới thiệu tên + vị trí rõ ràng trước khi trả lời: My tập trung: "Ok, vậy phí năm bao nhiêu vậy bạn?"
- Sale trả lời ngay không xưng danh: My không hỏi lại gay gắt (do My chủ động gọi tới nên ít quan tâm việc này), nhưng vẫn buông 1 câu xác nhận cụt: "Ừ mà bạn tên gì vậy ta?" rồi tiếp tục — không kéo dài.
- Sale mào đầu dài dòng: My ngắt: "Bạn nói gọn giúp mình cái thẻ đó được gì đi, mình sắp họp rồi."

0:15 – 0:50 — So sánh thẻ cũ
- Sale nêu đúng % hoàn tiền + phí cụ thể: My so sánh: "Ừ nghe ổn đó. Thẻ mình đang xài TCB hoàn có 0.5% à, phí lại 500k, đợi mình tí, mình đang nghe máy khác gọi vào."
- Sale nói chung chung, không số: My hỏi lại thẳng: "Ý là được gì cụ thể vậy bạn?" Nếu vẫn chung chung → My: "Thôi để mình tìm hiểu thêm rồi gọi lại." rồi cúp.
- Sale hỏi đúng "có gì chưa ưng ý": My lộ điểm chưa hài lòng: "Ừ ừ, mình đang bị hoàn có 0.5% à, phí thì cao mà hoàn thấp."

0:50 – 1:45 — Chốt hạn mức
My: "Lương mình tầm 20 triệu, vậy hạn mức được bao nhiêu vậy bạn?"
- Sale trả lời nhanh, có số cụ thể: My hài lòng.
- Sale phải "để em kiểm tra lại rồi gọi lại" nhiều lần: My mất kiên nhẫn: "Thôi bạn gọi lại sau nha, giờ mình không rảnh."

1:45 – 2:00
- Thấy lợi ích rõ: My chốt: "Ok vậy mình đăng ký, cần gửi gì cho bên bạn vậy?" → WIN
- Chưa thấy lợi ích cụ thể tới cuối: My kết thúc. → LOSE`,
  },
  {
    id: '2.2',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'tai-khoan-luong-mpro',
    starRating: 2,
    openingLine: 'Alo, bên MSB hả? Ừ công ty mình có báo là sẽ có người gọi mở tài khoản lương đúng không?',
    sampleFlow: [
      'Giới thiệu tên + đơn vị trước khi vào thủ tục, dù My đã biết trước có cuộc gọi này.',
      'Nói rõ thao tác có thể làm online, không bắt ra quầy nếu không cần thiết.',
      'Nói rõ M-Pro không phát sinh phí thêm, tránh mập mờ.',
    ],
    objectionBank: [
      { trigger: 'Gói đó có tốn phí gì thêm không?', guidance: 'Trả lời rõ ràng ngay: không phát sinh phí nếu duy trì số dư tối thiểu, tránh mập mờ khiến My phải hỏi lại.' },
    ],
    winCriteria: 'My đồng ý ngay vì thủ tục được xử lý gọn, rõ ràng, không mất nhiều thời gian.',
    trainingScript: `Bối cảnh: My vừa nhảy việc, công ty mới trả lương qua MSB. Kênh: Call.

0:00 – 0:15 — Mở đầu
My: "Alo, bên MSB hả? Ừ công ty mình có báo là sẽ có người gọi mở tài khoản lương đúng không?"
- Sale giới thiệu tên + đơn vị trước khi vào việc: My xác nhận, tiếp tục nghe bình thường.
- Sale không giới thiệu, vào thẳng thủ tục: My hơi khựng nhẹ: "Ừ mà ai gọi vậy ta, bên MSB đúng không?" rồi tiếp tục — không phản ứng gắt vì đã biết trước có cuộc gọi này.
- Sale giới thiệu lan man trước khi vào việc chính: My giục: "Ừ ừ, rồi, ý là sao nhỉ, bạn nói gọn lại hộ mình được không."

0:15 – 0:50 — Thủ tục
- Sale nói rõ thao tác online, không cần ra quầy: My giục: "Rồi giờ mình cần làm gì, có phải ra quầy không hay làm online được luôn?"
- Sale yêu cầu ra quầy dù có thể làm online: My hơi khó chịu.

0:50 – 1:30 — Giới thiệu M-Pro
- Sale nói rõ không phí thêm: My chốt nhanh: "Ok vậy làm giúp mình đi, xong sớm dùm mình nha, mình đang họp."
- Sale mập mờ về phí: My hỏi thẳng: "Gói đó có tốn phí gì thêm không, hay là tự động có luôn khi mở tài khoản lương vậy?"

1:30 – 2:00
- Xử lý gọn, rõ ràng: My đồng ý ngay. → WIN
- Sale tra cứu chậm nhiều lần: My cúp, hẹn sau. → LOSE`,
  },
  {
    id: '2.3',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'vay-mua-nha',
    starRating: 2,
    openingLine: 'Ừ cũng có nghĩ tới đó, nhưng mình chưa đủ tiền đâu.',
    sampleFlow: [
      'Hỏi tiếp thay vì bỏ qua khi My nói "chưa đủ tiền" — đây là insight quan trọng nhất của level.',
      'Hỏi đúng số liệu cụ thể: định mua tầm bao nhiêu, đã có sẵn bao nhiêu.',
      'Tính toán khả thi cụ thể (số tiền còn thiếu, khả năng vay) thay vì nói chung chung.',
    ],
    objectionBank: [
      { trigger: 'Mình để dành được khoảng 150 rồi, căn tầm 1.2 tỷ, chắc còn thiếu nhiều.', guidance: 'Tính cụ thể số tiền cần vay bổ sung và khả năng trả góp hàng tháng, không hứa hẹn quá đà.' },
    ],
    winCriteria: 'My hào hứng và xin thêm thông tin cụ thể về phương án vay — không hứa hẹn quá đà.',
    trainingScript: `Bối cảnh: My ra quầy giao dịch định kỳ, RM đã quen từ trước nhân tiện hỏi thăm và chạm đúng chủ đề mua nhà My đang ấp ủ. Kênh: Quầy (Callback — khách hàng cũ).

0:00 – 0:20 — Mở đầu (được miễn giới thiệu đầy đủ vì đã quen)
RM hỏi thăm và nhắc vay mua nhà. My đáp: "Ừ cũng có nghĩ tới đó, nhưng mình chưa đủ tiền đâu."
- Sale hỏi tiếp thay vì bỏ qua: My chia sẻ thêm.
- Sale nghe "chưa đủ tiền" rồi bỏ qua chủ đề: Cơ hội khai thác insight quan trọng nhất bị mất.

0:20 – 1:00 — Số liệu cụ thể
- Sale hỏi đúng "định mua tầm bao nhiêu, đã có sẵn bao nhiêu": My chia sẻ: "Mình để dành được khoảng 150 rồi, căn tầm 1.2 tỷ, chắc còn thiếu nhiều."
- Sale chỉ nói chung "bên em có vay mua nhà lãi tốt": My không có động lực chia sẻ thêm.

1:00 – 1:40 — Tính toán khả thi
- Sale tính cụ thể: My hào hứng hơn.
- Sale nói chung chung: My giảm hứng thú.

1:40 – 2:00
- Cụ thể, không hứa hẹn quá đà: My xin thêm thông tin. → WIN
- Chào chung chung không theo sát tình hình: My: "Thôi để sau mình tính." → LOSE`,
  },
  {
    id: '2.4',
    chapterNumber: 2,
    personaId: 'nv-van-phong-tre',
    productId: 'tai-khoan-so-dep',
    starRating: 2,
    openingLine: 'Alo, mình đang cần số tài khoản đẹp cho công việc á, có cái nào không đắt lắm không bạn?',
    sampleFlow: [
      'Giới thiệu ngắn gọn rồi hỏi lại tầm giá My mong muốn.',
      'Đưa 2–3 lựa chọn kèm giá rõ ràng thay vì liệt kê hàng loạt số.',
      'Để My chọn nhanh khi đã ưng ý, không kéo dài thêm lựa chọn.',
    ],
    objectionBank: [
      { trigger: 'Nhiều quá, bạn gợi ý giúp mình 1-2 cái thôi được không.', guidance: 'Thu hẹp lại còn 2-3 lựa chọn kèm giá rõ, tránh liệt kê tràn lan gây rối.' },
    ],
    winCriteria: 'My chọn được số ưng ý và xác nhận đăng ký ngay.',
    trainingScript: `Bối cảnh: My gọi điện hỏi về số tài khoản đẹp cho công việc, hay chuyển khoản với đối tác. Kênh: Call.

0:00 – 0:30 — Mở đầu
My: "Alo, mình đang cần số tài khoản đẹp cho công việc á, có cái nào không đắt lắm không bạn?"
- Sale giới thiệu ngắn gọn rồi hỏi lại tầm giá: My trả lời: "Ừ ừ, tầm dưới 1 triệu thôi."
- Sale bỏ qua giới thiệu, liệt kê hàng loạt số ngay: My phải lọc lại, dễ sốt ruột: "Nhiều quá, bạn gợi ý giúp mình 1-2 cái thôi được không."

0:30 – 1:20
- Sale đưa 2–3 lựa chọn kèm giá rõ: My chọn nhanh: "Cái 800k nghe được đó, lấy cái đó cho mình."
- Sale đưa quá nhiều lựa chọn không giá: My bỏ qua.

1:20 – 2:00
- My đã chọn được số ưng ý: Xác nhận đăng ký. → WIN
- Quá nhiều lựa chọn khiến My phân vân: My trì hoãn. → LOSE (partial)`,
  },

  // ===== CHẶNG 3 — Ông Thắng, chủ hộ kinh doanh (★★★) =====
  {
    id: '3.1',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'vay-bo-sung-von',
    starRating: 3,
    openingLine: 'Ai đó? Tìm ai rứa?',
    sampleFlow: [
      'Giới thiệu tên + MSB ngay lập tức, kiên nhẫn chờ khi ông đang bận bán hàng.',
      'Đưa con số cụ thể ngay khi được hỏi lãi suất/hạn mức, tránh mập mờ.',
      'Kiểm tra lại độ thật của phép thử đối thủ ("bên đó báo cụ thể chưa hay mới giới thiệu sơ") thay vì giảm giá ngay.',
      'Đưa điểm khác biệt rõ ràng cụ thể trước khi chốt hẹn gặp/hồ sơ.',
    ],
    objectionBank: [
      { trigger: 'Em nói rứa thì anh biết răng mà tính. Bên VIB người ta báo anh lãi thấp hơn nì.', guidance: 'Hỏi lại xem đối thủ đã báo giá chính thức chưa, rồi đưa số liệu cụ thể của mình, không giảm giá ngay theo phép thử.' },
    ],
    winCriteria: 'Ông đồng ý xem hồ sơ cần chuẩn bị sau khi Sale đưa con số cụ thể + điểm khác biệt rõ.',
    trainingScript: `Bối cảnh: Sale đến trực tiếp shop tạp hoá, ông đang bận bán hàng. Kênh: Trực tiếp.

0:00 – 0:20 — Mở đầu
Ông: "Ai đó? Tìm ai rứa?"
- Sale giới thiệu tên + MSB ngay lập tức: Ông: "Ừ, đợi tí, để anh tính tiền khách cái đã." rồi quay lại nghe tiếp.
- Sale không giới thiệu, vào thẳng chào vay: Ông hỏi cộc: "Ơ mà em ở đâu tới rứa, MSB à?" — không tính là thiếu chuyên nghiệp nghiêm trọng, nhưng nếu về sau Sale còn mập mờ số liệu nữa thì cộng thêm nghi ngờ: "Mà em ở bên mô rứa, giờ mới nói tên."
- Sale chờ kiên nhẫn khi ông bận: Ông quay lại: "Rồi, nói cụ thể đi, lãi bao nhiêu, vay được bao nhiêu?"
- Sale tỏ ra sốt ruột, giục: Ông khó chịu ngầm, giảm thiện cảm.

0:20 – 0:55 — Hỏi thẳng số liệu
- Sale mập mờ: Ông hỏi lại: "Ừ thì tùy cái chi, cứ nói khoảng bao nhiêu cho anh nghe." Nếu tiếp tục mập mờ, ông chất vấn thẳng, nhắc đối thủ: "Em nói rứa thì anh biết răng mà tính. Bên VIB người ta báo anh lãi thấp hơn nì."
- Sale đưa con số cụ thể ngay: Ông hỏi sâu thêm về hạn mức/thủ tục.

0:55 – 1:30 — Kiểm tra phép thử đối thủ
- Sale hỏi lại đúng cách: Ông khựng, thừa nhận: "Ừ thì... cũng chưa báo cụ thể lắm, tụi nó mới giới thiệu sơ sơ thôi."
- Sale hoảng, giảm giá ngay: Ông vẫn tiếp tục nhưng đánh giá thấp uy tín Sale ngầm.
- Sale tư vấn sai đối tượng: Ông nghi ngờ tăng mạnh: "Em tư vấn kiểu chi rứa, anh cần vốn kinh doanh mà."

1:30 – 2:00 — Chốt
- Sale đưa con số cụ thể + điểm khác biệt rõ: Ông dịu giọng: "Rứa để anh coi hồ sơ cần chi rồi tính." → WIN
- Không có điểm khác biệt cụ thể tới cuối: Ông từ chối hẹn gặp lại. → LOSE`,
  },
  {
    id: '3.2',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'the-mastercard-hybrid',
    starRating: 3,
    openingLine: 'Alo, răng rồi em, hồ sơ vay tới mô rồi?',
    sampleFlow: [
      'Cập nhật tiến độ hồ sơ vay rõ ràng, có mốc thời gian, trước khi chào thêm.',
      'Giải thích rõ khác biệt của thẻ Hybrid so với ATM thường, kèm phí cụ thể.',
    ],
    objectionBank: [
      { trigger: 'Thôi khỏi, có khi lại có chi phí khác chi đây.', guidance: 'Nêu rõ ràng phí cụ thể, tránh mập mờ khiến ông nghi ngờ phí ẩn.' },
    ],
    winCriteria: 'Ông đồng ý làm thêm thẻ sau khi thấy tiến độ vay rõ ràng và thẻ được giải thích minh bạch.',
    trainingScript: `Bối cảnh: Sau khi hồ sơ vay đang xử lý, Sale gọi lại cập nhật tiến độ và chào thêm thẻ. Kênh: Call (Callback).

0:00 – 0:25 — Mở đầu (miễn giới thiệu đầy đủ vì đã quen)
Ông: "Alo, răng rồi em, hồ sơ vay tới mô rồi?"
- Sale cập nhật rõ ràng, có mốc thời gian: Ông yên tâm.
- Sale trả lời mập mờ về tiến độ: Ông sốt ruột, không mặn mà nghe chào thẻ.

0:25 – 1:20 — Giới thiệu thẻ
- Sale giải thích rõ khác biệt với ATM, phí cụ thể: Ông cân nhắc: "Ừ nghe cũng được, để coi khi mô hồ sơ vay xong rồi tính luôn thể."
- Sale mập mờ về phí: Ông nghi ngờ: "Thôi khỏi, có khi lại có chi phí khác chi đây."

1:20 – 2:00
- Rõ ràng, đúng trọng tâm: Ông đồng ý làm thêm thẻ. → WIN
- Mập mờ phí: Ông từ chối. → LOSE`,
  },
  {
    id: '3.3',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'thau-chi-tieu-dung',
    starRating: 3,
    openingLine: 'Có bữa hàng về mà tiền chưa kịp thu của khách, kẹt muốn chết luôn á.',
    sampleFlow: [
      'Liên hệ đúng pain point (thiếu tiền mặt gấp) thay vì giới thiệu lan man.',
      'Giải thích rõ cơ chế lãi chỉ tính trên phần thực dùng, minh bạch trong hợp đồng.',
    ],
    objectionBank: [
      { trigger: 'Anh sợ mấy cái phí ẩn lắm.', guidance: 'Khẳng định minh bạch, công khai trong hợp đồng, chỉ tính lãi trên phần thực dùng.' },
    ],
    winCriteria: 'Ông đồng ý tìm hiểu thêm/đăng ký song song sau khi thấy cơ chế lãi minh bạch, công khai.',
    trainingScript: `Bối cảnh: Ông than vãn thiếu tiền mặt gấp để nhập hàng khi chưa kịp thu tiền khách nợ. Kênh: Trực tiếp.

0:00 – 0:30 — Mở đầu
Ông: "Có bữa hàng về mà tiền chưa kịp thu của khách, kẹt muốn chết luôn á."
(Đây là kịch bản Sale đã có mặt tại shop trước đó — có thể là tiếp nối từ 3.1, nên vẫn cần Sale xưng lại tên nếu là buổi gặp mới, tương tự nhánh mở đầu ở 3.1.)
- Sale liên hệ đúng pain point: Ông chú ý lắng nghe.
- Sale không liên hệ được, giới thiệu lan man: Ông mất hứng, quay lại bán hàng.

0:30 – 1:20 — Giải thích cơ chế lãi
- Sale giải thích rõ chỉ tính lãi trên phần thực dùng: Ông thấy hợp lý: "À rứa cũng hay đó, chứ anh sợ mấy cái phí ẩn lắm."
- Sale giải thích mập mờ: Ông nghi ngại, hỏi lại nhiều lần.

1:20 – 2:00
- Minh bạch, công khai trong hợp đồng: Ông đồng ý tìm hiểu thêm/đăng ký song song. → WIN
- Mập mờ cơ chế lãi tới cuối: Ông sợ phí ẩn, từ chối. → LOSE`,
  },
  {
    id: '3.4',
    chapterNumber: 3,
    personaId: 'chu-ho-kinh-doanh',
    productId: 'bao-hiem-chung-cu-4-0',
    starRating: 3,
    openingLine: 'Ừ, chuyện chi rứa?',
    sampleFlow: [
      'Nêu rủi ro thực tế cụ thể liên quan tới căn nhà đã có sổ đỏ, không giới thiệu chung chung.',
      'Không ép, đưa thông tin ngắn gọn, tôn trọng việc ông đang ưu tiên xử lý khoản vay trước.',
    ],
    objectionBank: [
      { trigger: 'Anh đang lo vụ vay đã, bảo hiểm tính sau.', guidance: 'Tôn trọng thứ tự ưu tiên, để lại thông tin ngắn gọn thay vì cố nói dài về sản phẩm phụ.' },
    ],
    winCriteria: 'Ông ghi nhận để xem sau, không bị ép nói dài khi đang ưu tiên khoản vay.',
    trainingScript: `Bối cảnh: Sale biết ông có sổ đỏ nhà, nhân tiện giới thiệu bảo hiểm tài sản. Kênh: Trực tiếp.

0:00 – 0:30
- Sale nêu rủi ro thực tế cụ thể: Ông cân nhắc: "Ừ chưa nghĩ tới chuyện đó, giờ đang lo vụ vay đã."
- Sale giới thiệu chung chung: Ông gạt phắt: "Thôi khỏi, giờ đang lo vụ khác."

0:30 – 1:20
- Sale không ép, đưa thông tin ngắn gọn: Ông nghe lịch sự.
- Sale cố nói dài về sản phẩm phụ: Ông gắt: "Anh đang lo vụ vay đã, bảo hiểm tính sau."

1:20 – 2:00
- Tôn trọng thứ tự ưu tiên: Ông ghi nhận để xem sau. → WIN
- Ép chèn quá nhiều thời gian: Ông ngắt lời khó chịu. → LOSE`,
  },

  // ===== CHẶNG 4 — Bà Thuý, đa nghi / từng bị lừa (★★★★) =====
  {
    id: '4.1',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'tien-gui-ky-han-truc-tuyen',
    starRating: 4,
    openingLine: 'Alo? Ai gọi đấy? Có việc gì đấy?',
    sampleFlow: [
      'Giới thiệu tên + MSB + nhắc được người quen giới thiệu ngay từ câu đầu.',
      'Trả lời đủ và đúng NGAY cả 3 điều cốt lõi trong 1 lượt: có mất gốc không / rút trước hạn thì sao / có phí ẩn không.',
      'Khi bà kể chuyện cũ: đồng cảm thật trước, rồi mới xác nhận sản phẩm này KHÔNG có yếu tố bảo hiểm/đầu tư, không có phí phá hợp đồng.',
      'Chủ động minh bạch thêm (bảo hiểm tiền gửi, miễn thuế TNCN) KHÔNG đợi hỏi mới nói — đặc điểm quyết định của persona này.',
      'Hỏi khéo kèm lý do khi khai thác số tiền/nhu cầu thật, không hỏi thẳng thô.',
    ],
    objectionBank: [
      { trigger: 'Có mất gốc khi rút trước hạn không?', guidance: 'Không mất gốc, chỉ phần lãi bị tính lại thấp hơn theo lãi suất không kỳ hạn — trả lời đủ cả 3 ý cốt lõi trong 1 lượt.' },
      { trigger: 'Ai biết được lần này có giống lần trước không?', guidance: 'Nêu đúng cơ chế bảo hiểm tiền gửi (tối đa 350 triệu đồng), không trấn an chung chung kiểu "ngân hàng uy tín lắm".' },
    ],
    winCriteria:
      'Sale tôn trọng ranh giới, trả lời rõ cả 3 điều cốt lõi, chủ động minh bạch ít nhất 1 lần không đợi hỏi, không né tránh quá 1 lần → bà đồng ý cân nhắc nghiêm túc, để lại kênh liên hệ.',
    trainingScript: `Bối cảnh: Sale chủ động gọi cho bà Thuý theo data khách hàng có người quen giới thiệu, mời tư vấn gửi tiết kiệm. Bà nghe máy với tâm thế phòng thủ sẵn có của người bị gọi bất ngờ. Bà đang giữ 100–150 triệu tiền mặt ở nhà, trong lòng có chút bất an nhưng đây là nhu cầu ẩn, chỉ hé lộ sau khi Sale đã tạo được niềm tin nhất định. Bà từng bị một nhân viên tư vấn tài chính ở ngân hàng khác nói dối trắng trợn về một sản phẩm bảo hiểm liên kết đầu tư 3 năm trước. Kênh: Call. Sản phẩm: Tiền gửi có kỳ hạn trực tuyến — lưu ý đây là kênh giao dịch trực tuyến của sản phẩm tiền gửi có kỳ hạn, KHÔNG phải bảo hiểm hay đầu tư.

Mục tiêu huấn luyện của level này:
1. Tôn trọng ranh giới ngay khi bà nêu ra — bà chặn trước "không mua bảo hiểm", Sale không được lái sang hướng đó dù chỉ 1 câu.
2. Chủ động minh bạch, không đợi hỏi mới nói — đặc điểm khác biệt lớn nhất của persona này.
3. Trả lời rõ ràng, có số liệu, không vòng vo cho đúng 3 câu hỏi lõi: mất gốc không / rút trước hạn thì sao / có phí ẩn không.
4. Không trấn an chung chung kiểu "yên tâm đi cô" — bà đặc biệt dị ứng với kiểu này.
5. Sale chỉ được 1 lần né tránh trước khi bà cảnh báo, và tối đa 1 lần cảnh báo trước khi cúp máy thật.

0:00 – 0:20 — Mở đầu: nghe máy cảnh giác
Bà (giọng khô, không niềm nở): "Alo? Ai gọi đấy? Có việc gì đấy?"
- Sale giới thiệu tên + MSB + nhắc được tên người quen giới thiệu và hỏi về nhu cầu gửi tiết kiệm: Bà bớt gằn nhưng vẫn chưa buông phòng thủ, chặn ranh giới ngay: "Tiết kiệm gì nhỉ? Mà tôi có đăng ký cái gì đâu nhỉ?"
- Sale giới thiệu nhưng không nhắc được người quen nào giới thiệu: Bà gắt: "Tiết kiệm gì, cô lấy số của tôi ở đâu ra đấy?"
- Sale mập mờ, không nói rõ mục đích: Bà chất vấn thẳng: "Việc gì? Định lừa đảo cái gì đấy?"

0:20 – 0:45 — Hỏi dồn 3 điều cốt lõi (trước khi quan tâm lãi suất)
Bà: "Tiền gửi trực tuyến là gửi qua mạng ấy gì? Thế rút trước hạn thì sao, có mất gốc không, có phát sinh chi phí gì không? Nói rõ ràng vào đừng có mà cái kiểu mập mờ xong bảo 'tuỳ trường hợp', tôi còn lạ gì trò của mấy cô nữa."
- Sale trả lời đủ và đúng cả 3 ý ngay trong 1 lượt: Bà dịu hẳn: "Tức là không mất gốc, chỉ bớt lãi đi thôi đúng không?"
- Sale trả lời thiếu ý/lan man/dùng từ khó hiểu: Bà ngắt lời, gằn từng chữ: "Thế cuối cùng là có mất gốc không? Nói nãy giờ không hiểu gì cả."
- Sale né tránh/trả lời chung chung ("cô cứ yên tâm, bên cháu rất an toàn"): Bà cảnh báo — lần cảnh báo đầu tiên và duy nhất: "Tôi hỏi 3 câu rõ ràng mà cô cứ nói vòng vo kiểu này thì thôi, không phải tư vấn nữa đâu nhé"

0:45 – 1:00 — Kể chuyện cũ (điểm quyết định lòng tin) + xử lý sau cảnh báo nếu có
Nếu Sale vừa bị cảnh báo: trả lời rõ ràng ngay, đúng trọng tâm → Bà dịu, chuyển sang kể chuyện cũ. Sale né tránh thêm lần nữa → Bà cúp máy thật. → LOSE
Bà (giọng chậm hẳn, trầm xuống, có khoảng dừng): "Ừ, nói chung là tư vấn cẩn thận đầy đủ vào, chứ tôi từng mất tiền vì gửi tiết kiệm kiểu này rồi. Một phát mất gần một phần ba tiền. Lúc rút đòi hết phí này tới phí kia, lúc ký có ai nói rõ với tôi đâu."
- Sale không vội chen vào bán tiếp, đồng cảm thật rồi mới xác nhận sản phẩm này KHÔNG có yếu tố bảo hiểm/đầu tư, KHÔNG có phí phá hợp đồng: Bà hạ phòng thủ rõ rệt: "Thế cái này có cái khoản phí phá hợp đồng gì gì đó không?" → Sale xác nhận không có, có thể nói thêm ngắn gọn lãi online có thể cao hơn tới 0,5% so với tại quầy (không chốt cứng số %) → Bà: "Ừ, thế còn nghe được. Mà cái này có phải gửi kỳ hạn dài không?"
- Sale vội chen ngang, không đồng cảm/xác nhận gì: Bà gắt, khép lại: "Ừ được rồi, tôi biết thế đã nhé."

1:00 – 1:20 — Chuyển từ đồng cảm sang tư vấn cụ thể (gợi ý kỳ hạn phù hợp)
- Sale hỏi lại mong muốn của bà trước khi đề xuất, không chốt cứng con số lãi suất: Bà thấy Sale cẩn trọng, không vẽ vời: "Ừ cũng được."
- Sale chốt cứng ngay 1 con số lãi suất và khẳng định chắc chắn không đổi: Bà nghi ngờ nhẹ, hỏi vặn lại: "Sao nghe lạ thế nhỉ, lãi suất ngân hàng có phải muốn là cố định được đâu?"
- Sale tranh thủ lúc bà vừa kể chuyện buồn để thúc giục chốt ngay: Bà cảnh giác trở lại, cảm thấy bị lợi dụng lúc đang mềm lòng: "Ơ hay, tôi mới đang tham khảo mà cô đã giục tôi gửi luôn là sao?"

1:20 – 1:40 — Trấn an bằng cơ chế bảo vệ thật (không hứa hẹn suông)
Bà: "Mà ai biết được lần này có giống lần trước không? Trên báo gửi tiền ngân hàng mất đầy ra kia kìa?"
- Sale nêu đúng cơ chế bảo hiểm tiền gửi (tối đa 350 triệu đồng cho cả gốc lẫn lãi): Bà bớt lo, giọng dịu hơn nhưng chưa tự nói số tiền cụ thể ngay: "À thế tiền gửi cũng có bảo hiểm luôn à hay đấy nhỉ thế thì đỡ lo hơn."
- Sale trấn an chung chung ("ngân hàng lớn uy tín lắm cô ơi"): Bà không tin: "Ai biết được ngân hàng tới ngày nào thì sập, lỡ có chuyện thì tiền của tôi đi đâu."

1:40 – 1:55 — Khai thác số tiền & nhu cầu thật
Lưu ý khai thác: Bà chưa hề tự nói số tiền hay lý do gửi. Hỏi thẳng thô sẽ bị né, chỉ khi Sale đã minh bạch đúng lúc VÀ hỏi khéo có kèm lý do thì bà mới mở lòng nói thật.
- Sale hỏi thẳng, cộc, không kèm lý do: Bà né, cảnh giác trở lại: "Cái đó để tôi tính, cô hỏi làm gì, cứ nói cái đó có an toàn không đã."
- Sale hỏi khéo, có lý do rõ ràng: Bà mở lòng, lần đầu hé lộ nhu cầu thật: "Tôi có một khoản để dành, cũng không nhiều lắm, hơn trăm triệu thôi. Để không thì phí mà giữ tiền mặt ở nhà tôi cũng sợ, đi gửi thì lại sợ bị như lần trước."

1:55 – 2:10 — Chốt
- Nếu Sale đã: (1) tôn trọng ranh giới, (2) trả lời rõ cả 3 điều cốt lõi, (3) chủ động minh bạch ít nhất 1 lần không đợi hỏi, (4) không né tránh quá 1 lần: Sale có thể chủ động chêm nhanh 1 câu bonus không bắt buộc ("với lại lãi tiền gửi này cũng được miễn thuế thu nhập cá nhân cô ạ") — Bà xuống giọng, đồng ý cân nhắc nghiêm túc: "Thế giờ cô gửi thông tin cụ thể qua Zalo cho tôi đi, để tôi đọc kỹ lại đã rồi tôi gọi lại." → WIN
- Nếu Sale từng bị cảnh báo và không sửa kịp, hoặc né tránh lặp lại từ 2 lần trở lên: Bà kết thúc dứt khoát: "Thôi khỏi, tôi chưa có nhu cầu, cảm ơn." rồi cúp máy. → LOSE
- Nếu Sale trả lời đúng nhưng luôn bị động (chỉ trả lời khi bị hỏi, chưa từng chủ động nói thêm): Bà vẫn đồng ý nghe thêm nhưng giữ khoảng cách, không hé lộ số tiền cụ thể: "Ừ, cô cứ gửi thông tin qua đi, để tôi xem thế nào đã." → WIN nhẹ (partial) — qua được ải nhưng chưa khai thác được insight thật.`,
  },
  {
    id: '4.2',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'pru-bao-ve-toi-da',
    starRating: 3,
    isFinalBoss: false,
    openingLine: 'Alo, ai đấy? Bảo hiểm à? Thôi khỏi, tôi không có nhu cầu đâu.',
    sampleFlow: [
      'Xử lý cùng lúc 2 việc: giới thiệu ngắn gọn (tên + MSB) VÀ dừng lại hỏi lý do từ chối.',
      'Đồng cảm, giải thích rõ khác biệt với trải nghiệm xấu trước đó của bà.',
      'Kịp dừng lại, xin lỗi, chuyển hướng ngay khi bà nhắc lại đã từ chối mà Sale vẫn định giới thiệu tiếp.',
    ],
    objectionBank: [
      { trigger: 'Tôi vừa nói tôi không thích rồi mà cậu vẫn định giới thiệu tiếp là sao?', guidance: 'Dừng lại ngay, xin lỗi, chuyển hướng — không tiếp tục chào bán bất chấp.' },
    ],
    winCriteria: 'Bà dịu bớt, đồng ý "để tôi nghĩ đã" — dù chưa tin ngay nhưng không cúp máy trong ấm ức.',
    trainingScript: `Bối cảnh: Sale gọi chào bảo hiểm liên kết đầu tư theo data khách có tiền nhàn rỗi — đúng vùng nhạy cảm nhất. Kênh: Call. (Mức độ: ★★★, thuộc nhóm khó nhất.)

0:00 – 0:15 — Mở đầu, kết hợp yêu cầu giới thiệu bản thân + từ chối ngay
Bà: "Alo, ai đấy? Bảo hiểm à? Thôi khỏi, tôi không có nhu cầu đâu."
Đây là điểm khó kép: bà vừa từ chối ngay từ câu đầu, vừa chưa kịp nghe Sale giới thiệu gì. Sale cần xử lý cả 2 việc cùng lúc — vừa giới thiệu ngắn gọn, vừa không cố bán tiếp ngay.
- Sale giới thiệu ngắn gọn (tên + MSB) VÀ dừng lại hỏi lý do từ chối: Bà mở lòng: "Hồi trước tôi mua bảo hiểm liên kết đầu tư ở chỗ khác, nó bảo vừa như gửi tiết kiệm vừa có bảo hiểm, không mất gì. Được 2 năm tôi rút ra thì mất gần 30% vì phí phá hợp đồng. Cậu nói thế thì tôi hiểu là sao?"
- Sale không giới thiệu, cũng không hỏi lý do, tiếp tục giới thiệu sản phẩm ngay (double lỗi): Bà gắt mạnh hơn bình thường: "Cậu còn chưa biết cậu là ai mà tôi vừa nói không thích rồi mà cứ nói tiếp là sao?"

0:15 – 0:50 — Xử lý sau khi nghe chuyện cũ
- Sale đồng cảm, giải thích rõ khác biệt: Bà bớt phòng thủ: "Rồi giờ cái cậu định giới thiệu có giống vậy không?"
- Sale vẫn giới thiệu ngay không đồng cảm trước: Bà cảnh giác trở lại.

0:50 – 1:30 — Điểm quyết định
Sale: "Đây cũng là dòng bảo hiểm liên kết đầu tư ạ, nhưng cháu xin phép giải thích rõ điều khoản phí ngay từ đầu, không giấu gì cô hết."
Bà: "Tôi vừa nói tôi không thích rồi mà cậu vẫn định giới thiệu tiếp là sao?"
- Sale kịp dừng, xin lỗi, chuyển hướng: Bà dịu bớt nhưng giữ khoảng cách: "Thôi để tôi nghĩ đã, giờ tôi chưa tin được đâu." → WIN
- Sale tiếp tục chào bán bất chấp: Bà cảnh báo rồi cúp máy dứt khoát. → LOSE`,
  },
  {
    id: '4.3',
    chapterNumber: 4,
    personaId: 'nguoi-da-nghi',
    productId: 'bao-hiem-benh-hiem-ngheo',
    starRating: 4,
    openingLine: 'Alo cậu à? Lại có chuyện gì nữa đây?',
    sampleFlow: [
      'Chủ động minh bạch ngay, nhắc lại đúng nỗi sợ cũ của bà thay vì chào như khách mới.',
      'Trả lời rõ, không né tránh khi bà hỏi kỹ điều khoản loại trừ.',
      'Minh bạch xuyên suốt, nhắc đúng bối cảnh cũ để giữ niềm tin đã xây.',
    ],
    objectionBank: [
      { trigger: 'Vậy lỡ tôi ốm mà nó bảo không thuộc diện bồi thường thì răng?', guidance: 'Giải thích rõ điều khoản loại trừ, không mập mờ để tránh nghi ngại.' },
    ],
    winCriteria: 'Bà xin tài liệu để xem, nhờ Sale minh bạch xuyên suốt và nhắc đúng bối cảnh cuộc gọi trước.',
    trainingScript: `Bối cảnh: Sau khi đã có chút niềm tin (kịch bản 4.1), Sale gọi lại chăm sóc và chào thêm. Kênh: Call (Callback).

0:00 – 0:20 — Mở đầu (miễn giới thiệu đầy đủ vì đã quen)
Bà: "Alo cậu à? Lại có chuyện gì nữa đây?"
- Sale chủ động minh bạch ngay, nhắc lại đúng nỗi sợ cũ: Bà bớt cảnh giác hẳn: "Ừ... thế á, không liên quan đầu tư gì chứ?"
- Sale chào như khách mới, không nhắc trải nghiệm cũ: Bà mất niềm tin đã xây, phản ứng gắt hơn cả người lạ.

0:20 – 1:00 — Hỏi kỹ điều khoản
- Sale trả lời rõ, không né tránh: Bà cân nhắc nghiêm túc.
- Sale mập mờ về điều khoản loại trừ: Bà nghi ngại: "Vậy lỡ tôi ốm mà nó bảo không thuộc diện bồi thường thì răng?"

1:00 – 2:00
- Minh bạch xuyên suốt, nhắc đúng bối cảnh cũ: Bà xin tài liệu. → WIN
- Không nhắc bối cảnh cũ, mập mờ điều khoản: Bà phản ứng gắt. → LOSE`,
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
      'Cam kết cụ thể, rõ ràng ở lượt cuối để chốt.',
    ],
    objectionBank: [
      { trigger: 'Ba ngân hàng khác đang mời anh rồi đấy.', guidance: 'Đưa điểm khác biệt cụ thể tự tin, tránh hứa hẹn mơ hồ hoặc vượt thẩm quyền.' },
    ],
    winCriteria: 'Ông gật nhẹ, đồng ý xem hồ sơ cụ thể sau khi Sale cam kết rõ ràng, không mơ hồ.',
    trainingScript: `Bối cảnh: RM hẹn gặp riêng tại phòng khách VIP. Kênh: Quầy VIP. Sản phẩm: Combo (Chứng chỉ tiền gửi + M-First + World Elite). (Mức độ: ★★★, thuộc nhóm khó nhất.)

0:00 – 0:20 — Mở đầu
Ông: "Anh có đúng mười lăm phút thôi. Nói luôn đi, MSB có gì hay hơn mấy bên anh đang làm không?"
Đây cũng là điểm khó kép: Sale cần giới thiệu bản thân đủ nhanh gọn (không dài dòng khiến ông mất kiên nhẫn) nhưng vẫn phải có, đồng thời tránh rơi vào bẫy tư vấn đại trà.
- Sale giới thiệu cực ngắn (tên + vai trò RM) rồi vào thẳng câu hỏi định hướng: Ông tiếp tục nghe bình thường.
- Sale bỏ qua giới thiệu, mở đầu bằng tư vấn đại trà (vd: đọc bảng lãi suất niêm yết): Ông mất hứng ngay — kép cả 2 lỗi (thiếu giới thiệu + đại trà) cộng dồn nặng hơn, im lặng vài giây rồi nói lạnh: "Cái này anh nghe ở đâu chả được. Mà em tên gì đấy, có gì khác không?" — chỉ cho 1 cơ hội sửa sai duy nhất cho cả 2 lỗi cùng lúc.

0:20 – 1:00 — Cơ hội sửa sai
- Sale sửa cả 2: giới thiệu rõ + hỏi đúng hướng trải nghiệm dịch vụ: Ông cởi mở hơn hẳn, nói dài hơn bình thường (tín hiệu tích cực): "Anh ghét nhất là cứ phải xếp hàng, gọi hotline thì chờ mãi."
- Sale vẫn tiếp tục đại trà ở lượt kế: Ông kết thúc ngay, đứng dậy, "Cảm ơn" rồi đi thẳng không chào thêm. → LOSE

1:00 – 1:40 — Phép thử đối thủ
Ông: "Ba ngân hàng khác đang mời anh rồi đấy."
- Sale tự tin đưa điểm khác biệt cụ thể: Ông cân nhắc nghiêm túc.
- Sale hứa hẹn mơ hồ/vượt thẩm quyền: Ông giảm tin cậy, cần cam kết cụ thể ở lượt kế.

1:40 – 2:00
- Cam kết rõ ràng, cụ thể: Ông gật nhẹ: "Được, để anh xem hồ sơ cụ thể." → WIN
- Vẫn mơ hồ tới cuối: Ông kết thúc nhạt nhẽo. → LOSE/Neutral`,
  },
  {
    id: '5.2',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'chuyen-tien-quoc-te',
    starRating: 5,
    openingLine: 'Alo, anh cần chuyển một khoản ngoại tệ khá lớn cho đối tác bên ngoài, xử lý được nhanh không?',
    sampleFlow: [
      'Phản ứng nhanh, hỏi rõ số tiền/loại ngoại tệ ngay, tránh hỏi vòng vo.',
      'Cam kết thời gian xử lý cụ thể.',
      'Chủ động nhắc quyền lợi ưu tiên (M-First) để ông thấy được ưu tiên.',
    ],
    objectionBank: [
      { trigger: 'Xử lý được nhanh không?', guidance: 'Hỏi rõ số tiền/loại ngoại tệ ngay, cam kết mốc thời gian cụ thể, không mơ hồ.' },
    ],
    winCriteria: 'Ông hài lòng vì được xử lý nhanh, cam kết rõ ràng và được nhắc quyền lợi ưu tiên.',
    trainingScript: `Bối cảnh: Công ty ông vừa có lô hàng nhập khẩu cần chuyển ngoại tệ gấp. Kênh: Call (Callback). Sản phẩm: SWIFT/mua bán ngoại tệ.

0:00 – 0:20
Ông: "Alo, anh cần chuyển một khoản ngoại tệ khá lớn cho đối tác bên ngoài, xử lý được nhanh không?"
- Sale phản ứng nhanh, hỏi rõ số tiền/loại ngoại tệ ngay: Ông cung cấp: "Khoảng 50 nghìn đô, chuyển sang Mỹ."
- Sale hỏi vòng vo: Ông sốt ruột, giục nhanh hơn.

0:20 – 0:50 — Cam kết thời gian
- Sale cam kết thời gian cụ thể: Ông chấp nhận.
- Sale mơ hồ về thời gian: Ông không hài lòng.

0:50 – 1:20 — Nhắc ưu tiên VIP
- Sale chủ động nhắc quyền lợi M-First: Ông yên tâm hơn.
- Sale không nhắc gì: Ông không có cảm giác được ưu tiên.

1:20 – 2:00
- Xử lý nhanh, cam kết rõ ràng: Ông hài lòng. → WIN
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
    ],
    objectionBank: [
      { trigger: 'Vậy thì vay bên ngân hàng bên anh đang có quan hệ sẵn cho rồi.', guidance: 'Đưa điểm khác biệt rõ ràng dành riêng cho khách M-First, tránh đưa lãi suất đại trà.' },
    ],
    winCriteria: 'Ông yêu cầu gửi hồ sơ cụ thể sau khi thấy điểm khác biệt rõ dành cho khách VIP.',
    trainingScript: `Bối cảnh: Ông cân nhắc mua thêm căn hộ đầu tư, RM biết thông tin từ lần gặp trước. Kênh: Quầy VIP (Callback). Sản phẩm: Vay mua nhà/BĐS cá nhân. (Mức độ: ★★★, thuộc nhóm khó nhất.)

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

1:40 – 2:00
- Có điểm khác biệt rõ: Ông yêu cầu gửi hồ sơ cụ thể. → WIN
- Không có gì khác biệt: Ông từ chối. → LOSE`,
  },
  {
    id: '5.4',
    chapterNumber: 5,
    personaId: 'khach-vip',
    productId: 'bao-hiem-chung-cu-4-0',
    starRating: 5,
    openingLine: 'Chưa, cái đó không phải ưu tiên của anh lúc này.',
    sampleFlow: [
      'Nêu ngắn gọn, không ép — tôn trọng việc ông đang tập trung vào khoản vay trước.',
      'Không chèn quá nhiều thời gian giới thiệu sản phẩm phụ khi ông chưa quan tâm.',
    ],
    objectionBank: [
      { trigger: 'Anh đang tập trung vụ vay trước đã.', guidance: 'Tôn trọng thứ tự ưu tiên, để lại thông tin ngắn gọn thay vì tiếp tục thuyết phục.' },
    ],
    winCriteria: 'Ông ghi nhận để xem sau, không bị ép khi đang tập trung vào khoản vay chính.',
    trainingScript: `Bối cảnh: Nhân dịp bàn về căn hộ đầu tư, Sale giới thiệu thêm bảo hiểm tài sản. Kênh: Quầy VIP (Callback).

0:00 – 0:30
- Sale nêu ngắn gọn, không ép: Ông đáp: "Chưa, cái đó không phải ưu tiên của anh lúc này."
- Sale cố chèn nhiều thời gian ngay từ đầu: Ông khó chịu ngay từ đầu.

0:30 – 1:30
- Sale không ép, để thông tin lại sau: Ông nghe lịch sự.
- Sale tiếp tục thuyết phục: Ông ngắt lời: "Anh đang tập trung vụ vay trước đã."

1:30 – 2:00
- Tôn trọng thứ tự ưu tiên: Ông ghi nhận để xem sau. → WIN
- Ép quá đà: Ông khó chịu, giảm thiện cảm. → LOSE`,
  },
];

/** Gọi bởi hydrateContentFromBackend() sau khi fetch bảng levels. */
export function replaceLevels(next: Level[]) {
  levels = next;
}

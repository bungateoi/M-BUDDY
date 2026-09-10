# Design System — M-BUDDY

> Lưu ý: các mã màu dưới đây là ước lượng từ ảnh draft. Trước khi build,
> nên dùng công cụ chọn màu (color picker) trên chính file PDF gốc để lấy
> mã hex chính xác, rồi thay lại vào file này.

## 1. Thương hiệu & mascot

- Tên app: **M-BUDDY** — tagline "Your learning buddy" — thuộc hệ sinh thái MSB
- Mascot: chú gà con màu cam, phong cách dễ thương, thân thiện (tương tự
  Duolingo owl nhưng là gà)
- Cần chuẩn bị nhiều biến thể cảm xúc của mascot cho các màn khác nhau, ví dụ:
  - `mascot-happy` — màn Kết quả khi làm tốt
  - `mascot-thinking` — màn Ôn tập nhanh
  - `mascot-calling` — màn Role-play
  - `mascot-encouraging` — màn Home / streak
  - `mascot-sad-or-neutral` — khi kết quả chưa tốt
  - Nếu chưa có đủ, dùng tạm 1 mascot chung cho tất cả các màn

- Mascot sử dụng Khi role play phải phù hợp với nhân vật trong kịch bản
  - `Adult_men.png`
    **Persona phù hợp:** Khách VIP / Đàm phán cứng
    **Kịch bản nên sử dụng:**
    - Khách hàng có tài sản lớn, có nhiều lựa chọn ngân hàng để so sánh.
    - Khách có kỳ vọng cao về dịch vụ và yêu cầu tư vấn chuyên sâu.
    - Tình huống đàm phán về lãi suất, hạn mức, phí và các đặc quyền riêng.
    - Khách yêu cầu giải pháp tài chính được cá nhân hóa thay vì ưu đãi đại trà.
    - Phù hợp làm nhân vật **Boss** cho các level có độ khó cao.
    **Ví dụ tình huống:**
    > "Tôi có tài sản ở nhiều nơi, anh/chị đề xuất được gì phù hợp với tôi thì nói, không thì đừng mất thời gian của cả hai."
  - `Adult_women.png`
      **Persona phù hợp:** Chủ hộ kinh doanh
      **Kịch bản nên sử dụng:**
      - Chủ cửa hàng, hộ kinh doanh hoặc doanh nghiệp nhỏ.
      - Khách trực tiếp quản lý dòng tiền và các hoạt động kinh doanh.
      - Quan tâm đến lãi suất, hạn mức, chi phí và thời gian giải ngân.
      - Thường xuyên so sánh sản phẩm, điều khoản giữa các ngân hàng.
      - Phù hợp với ác tình huống cần khai thác nhu cầu về vốn xoay vòng hoặc quản lý dòng tiền.

      **Ví dụ tình huống:**
      > "Tôi cần vốn xoay vòng để nhập hàng đợt tới, lãi suất bên mình thế nào và giải ngân có nhanh không?"
  - `Nam_tre.png`
      **Persona phù hợp:** Nhân viên văn phòng trẻ
      **Kịch bản nên sử dụng:**
      - Nam trong độ tuổi 24–32, có thu nhập ổn định.
      - Bận rộn, quen sử dụng ứng dụng và các dịch vụ tài chính số.
      - Quan tâm đến sự tiện lợi, ưu đãi, hoàn tiền và tốc độ xử lý.
      - Không thích tư vấn dài dòng, muốn đi thẳng vào lợi ích.
      - Phù hợp với các sản phẩm như thẻ tín dụng, tiết kiệm online và các giải pháp số.
      **Ví dụ tình huống:**
      > "Mình hay mua hàng online, order đồ ăn, có thẻ nào hoàn tiền tốt không?"
  -  `Nu_tre.png`
      **Persona phù hợp:** Nhân viên văn phòng trẻ
      **Kịch bản nên sử dụng:**
      - Nữ trong độ tuổi 24–32, có thu nhập ổn định.
      - Quen thao tác 100% qua ứng dụng, ưu tiên trải nghiệm nhanh và thuận tiện.
      - Quan tâm đến chi tiêu, ưu đãi, mua sắm, du lịch và kế hoạch tài chính cá nhân.
      - Có thể chưa quan tâm đến các sản phẩm tài chính dài hạn như bảo hiểm hoặc tiết kiệm.
      - Phù hợp để tạo các tình huống cần thuyết phục khách về nhu cầu tài chính trong tương lai.
      **Ví dụ tình huống:**
      > "Mình còn trẻ, sức khỏe tốt, bảo hiểm để sau đi. Giờ mình muốn ưu tiên tận hưởng cuộc sống hơn."
  - `Old_men.png`
      **Persona phù hợp:** Người đa nghi / Từng có trải nghiệm xấu
      **Kịch bản nên sử dụng:**
      - Khách hàng có mức độ cảnh giác cao với các sản phẩm và lời chào mời tài chính.
      - Từng bị lừa đảo hoặc có trải nghiệm không tốt với ngân hàng, bảo hiểm hoặc các dịch vụ tài chính.
      - Thường xuyên nghi ngờ về phí ẩn, điều khoản và tính minh bạch.
      - Đặt nhiều câu hỏi khó và không dễ đưa ra quyết định ngay.
      - Mục tiêu chính của kịch bản là xây dựng niềm tin thay vì cố gắng chốt sản phẩm ngay.
      **Ví dụ tình huống:**
      > "Trước tôi từng bị lừa mất tiền qua app rồi, giờ nghe đến giao dịch online là tôi không tin lắm."
  - `Old_women.png`
      **Persona phù hợp:** Nội trợ tiết kiệm
      **Kịch bản nên sử dụng:**
      - Khách hàng quản lý chi tiêu gia đình.
      - Thận trọng với tiền bạc và ưu tiên sự an toàn, chắc chắn.
      - Không quá thành thạo công nghệ tài chính hoặc giao dịch số.
      - Lo lắng về rủi ro khi sử dụng app, vay nợ hoặc các sản phẩm tài chính phức tạp.
      - Cần được tư vấn chậm rãi, sử dụng ngôn ngữ đơn giản và ví dụ gần gũi.
      **Ví dụ tình huống:**
      > "Cô vẫn quen ra quầy gửi tiết kiệm cho chắc, gửi online cô sợ mất tiền lắm, lỡ bị hack tài khoản thì sao?"

## 2. Bảng màu (placeholder — cần chỉnh theo màu thật từ PDF)

| Vai trò | Mã màu ước lượng | Ghi chú |
|---|---|---|
| Primary (cam thương hiệu) | `#f85b26` | Dùng cho CTA chính, mascot, streak icon | 
| Primary light | `#FFE4D1` | Nền card, badge nhẹ |
| Success | `#2ECC71` | Điểm số tốt, hoàn thành |
| Warning / gap | `#F5A623` | Cảnh báo gap kiến thức |
| Neutral text | `#2D2D2D` | Chữ chính |
| Neutral muted | `#8A8A8A` | Chữ phụ, subtitle |
| Background | `#FFFFFF` / `#FDF6F0` | Nền trắng hoặc trắng ngà ấm |

## 3. Typography

- Font: sans-serif tròn trịa, dễ đọc, thân thiện (kiểu Nunito, Baloo 2, hoặc
  SF Rounded) — ưu tiên font có sẵn hỗ trợ tiếng Việt có dấu đầy đủ
- Heading: đậm (bold/700), cỡ lớn cho tiêu đề màn hình
- Body: regular (400-500), dễ đọc trên mobile

## 4. Component pattern lặp lại (nhận diện từ ảnh draft)

- **Card bo góc lớn** (rounded-2xl trở lên), có shadow nhẹ — dùng cho hầu hết
  khối nội dung (streak card, level card, kết quả...)
- **Progress ring / circular progress** — dùng cho % kiến thức, % kỹ năng,
  điểm số tổng
- **Radar chart** — dùng ở màn Phân tích chi tiết để thể hiện nhiều kỹ năng
  cùng lúc
- **Badge tròn nhỏ** — hiển thị streak (số ngày, icon lửa), level, huy hiệu
- **Bottom navigation bar** — cố định dưới cùng, icon + label, xuất hiện ở
  hầu hết màn hình chính (Home, Map, Học tập, Xếp hạng, Quản lý đội nhóm)
- **Leaderboard row** — avatar + tên + điểm/kinh nghiệm, dùng ở màn Xếp hạng
- **CTA nút lớn, bo tròn, màu cam nổi bật** — luôn đặt ở vị trí dễ bấm bằng
  ngón cái (gần đáy màn hình)
- **Map dạng đường đi (path) có các node ải/level** — giống bản đồ game,
  mỗi node là 1 level, có trạng thái khoá/mở/hoàn thành

## 5. Tông giọng & cảm xúc thiết kế

- Thân thiện, khích lệ, giống trò chơi hơn là app công việc khô khan
- Dùng emoji/icon minh hoạ nhiều (lửa cho streak, cúp cho xếp hạng, chuông
  cho nhắc nhở...)
- Thông báo kết quả nên mang tính động viên ngay cả khi điểm chưa cao, đi kèm
  gợi ý cụ thể thay vì chỉ chê

## 6. Việc cần làm trước khi build

- [ ] Lấy mã hex chính xác từ PDF (dùng color picker)
- [ ] Xác định font chữ chính xác đang dùng trong ảnh (hoặc chọn font gần
      giống nhất có hỗ trợ tiếng Việt)
- [ ] Chuẩn bị các file ảnh mascot (PNG nền trong suốt) theo danh sách ở mục 1
- [ ] Crop từng màn trong PDF thành ảnh riêng, lưu vào `ui-draft/`

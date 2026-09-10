# PRD — M-BUDDY

## 1. Tổng quan

M-BUDDY ("Your learning buddy" — thương hiệu MSB) là app học nội bộ dành cho
Sales RB (Retail Banking), giúp nhân viên luyện tập kiến thức sản phẩm và kỹ
năng bán hàng thông qua role-play với khách hàng ảo (AI đóng vai), có chấm
điểm và gợi ý cải thiện tự động. Thiết kế theo hướng gamified, phong cách
gần giống Duolingo — mascot dẫn dắt, streak, level, bảng xếp hạng.

- **Nền tảng**: mobile app (ưu tiên tuyệt đối, không cần bản web).
- **Đối tượng dùng**: nhân viên Sales RB (người học), quản lý đội nhóm (theo dõi).

## 2. Vòng lặp học chính (core loop)

```
Home (streak + gap kiến thức/kỹ năng)
   ↓
Map (chọn ải = phân khúc khách hàng, mỗi ải nhiều level,
     mỗi level = 1 sản phẩm)
   ↓
Ôn tập nhanh (5 câu trắc nghiệm về kiến thức liên quan)
   ↓
Role-play (gọi điện với khách hàng ảo, 2.5–5 phút,
           mục tiêu bán được / khai thác insight trước khi
           khách hàng cúp máy)
   ↓
Kết quả (AI chấm điểm hội thoại: kiến thức, kỹ năng,
         cách xử lý tình huống + gợi ý luyện tập tiếp theo)
```

Đây là luồng bắt buộc phải hoạt động mượt nhất — ưu tiên build và polish
trước tất cả các phần khác.

## 3. Danh sách màn hình & tính năng

### 3.1 Màn Home
- Theo dõi streak (số ngày luyện tập liên tiếp)
- Theo dõi gap về kiến thức, kỹ năng (hiển thị dạng % / ring)
- Call to action bắt đầu luyện tập daily challenge

### 3.2 Màn Map
- Luyện tập daily challenge
- Nhiều ải — mỗi ải là 1 phân khúc khách hàng (persona)
- Trong mỗi ải sẽ có nhiều level
- Mỗi level là 1 sản phẩm / nhóm sản phẩm

### 3.3 Màn Ôn tập nhanh
- 1 bài daily challenge gồm 1 phần ôn tập nhanh: 5 câu hỏi trắc nghiệm về
  kiến thức liên quan đến level đang chọn

### 3.4 Màn Role-play
- Sau khi ôn tập kiến thức sẽ bắt đầu role-play
- Mục tiêu: trong 1 thời gian nhất định phải bán được, hoặc đến khi khách
  hàng dập máy thì khai thác được insight gì đó
- Thời gian role-play khoảng 2.5 phút hoặc 5 phút, chốt sau khi hết giờ

### 3.5 Màn Kết quả
- M-BUDDY phân tích cuộc hội thoại, đánh giá kiến thức, kỹ năng và cách xử
  lý tình huống
- Chỉ ra điểm mạnh, điểm cần cải thiện
- Gợi ý nội dung luyện tập phù hợp cho lần tiếp theo

### 3.6 Màn Practice
- Luyện tập role-play với khách hàng "thật" (do người dùng tự chọn/tạo, khác
  với role-play trong daily challenge)
- M-BUDDY đề xuất 10 khách hàng tiềm năng nhất
- Có thể tìm kiếm khách hàng khác để luyện tập
- Hoặc tự tạo khách hàng để luyện tập theo nhu cầu

### 3.7 Màn Tạo KH (khách hàng)
- Tạo khách hàng theo các tiêu chí để tự luyện tập (dùng cho màn Practice)

### 3.8 Màn Học tập
- Học tập với nhân viên mới: cần học gì, thứ tự học, tiến độ
- Học tập với sản phẩm/chính sách mới: học nhanh nội dung quan trọng, học
  theo từng module ngắn, có Quiz, Case study

### 3.9 Màn Phân tích chi tiết
- Dashboard AI: radar năng lực, điểm yếu
- Gợi ý hành động cá nhân hóa

### 3.10 Màn Xếp hạng
- Theo dõi thứ hạng, kinh nghiệm tích lũy và thành tích học tập
- Tạo động lực duy trì việc học thông qua bảng xếp hạng và streak

### 3.11 Màn Quản lý đội nhóm
- Giúp quản lý theo dõi tiến độ, hiệu suất học tập, kiến thức và kỹ năng
  của đội ngũ
- Nhận diện các thành viên cần hỗ trợ và có kế hoạch phát triển phù hợp

## 4. Thứ tự ưu tiên build (khi thời gian có hạn)

1. Core loop đầy đủ: Home → Map → Ôn tập nhanh → Role-play → Kết quả
2. Màn Phân tích chi tiết (ấn tượng trực quan, dùng lại dữ liệu điểm số)
3. Màn Xếp hạng
4. Màn Practice + Tạo KH
5. Màn Học tập
6. Màn Quản lý đội nhóm (thường dành cho vai trò quản lý, không phải người
   học chính, ưu tiên thấp nhất nếu thiếu thời gian)

# Cấu hình tạo chân dung khách hàng theo nhu cầu

## Dùng cho luyện tập Sales Retail Banking (RB)

> **Mục đích:** Cho phép Sales tự tạo một hình tượng khách hàng theo nhu cầu để AI đóng vai và thực hiện role-play.
>
> **Nguyên tắc thiết kế:** Ưu tiên **chọn nhanh từ Options**, đồng thời hỗ trợ **Khác / Tự nhập** đối với các tiêu chí cần linh hoạt. Các trường liên quan đến nhu cầu và hành vi có thể chọn nhiều đáp án.

---

# 1. Tuổi

**Loại nhập liệu:** Single select + Tự nhập

- Dưới 22 tuổi
- 22–25 tuổi
- 26–30 tuổi
- 31–35 tuổi
- 36–45 tuổi
- 46–55 tuổi
- Trên 55 tuổi
- Tự nhập

# 2. Giới tính

**Loại nhập liệu:** Single select

- Nam
- Nữ
- Không muốn xác định
- Khác

# 3. Nghề nghiệp

**Loại nhập liệu:** Single select hoặc chọn từ nhóm + Khác / Tự nhập

### Sinh viên / Nhân viên
- Sinh viên
- Nhân viên văn phòng
- Chuyên viên
- Nhân viên kinh doanh / Sales
- Nhân viên ngành đặc thù

### Quản lý / Chuyên môn cao
- Quản lý cấp trung
- Quản lý cấp cao
- Chuyên gia
- Bác sĩ / Nhân viên y tế
- Giáo viên / Giảng viên
- Luật sư
- Kỹ sư / CNTT

### Kinh doanh
- Chủ hộ kinh doanh
- Chủ doanh nghiệp nhỏ
- Kinh doanh online
- Freelancer

### Khác
- Nghỉ hưu
- Nội trợ
- Khác / Tự nhập

# 4. Thu nhập

**Loại nhập liệu:** Single select + Tự nhập

> Đơn vị mặc định: Thu nhập bình quân mỗi tháng.

- Chưa có / Không ổn định
- Dưới 10 triệu VNĐ
- 10–20 triệu VNĐ
- 20–30 triệu VNĐ
- 30–50 triệu VNĐ
- 50–100 triệu VNĐ
- 100–200 triệu VNĐ
- Trên 200 triệu VNĐ
- Thu nhập biến động theo mùa / doanh thu
- Tự nhập

# 5. Khu vực

**Loại nhập liệu:** Single select + Tự nhập

- Hà Nội
- TP. Hồ Chí Minh
- Thành phố lớn khác
- Tỉnh / thành phát triển
- Khu vực khu công nghiệp
- Khu vực nông thôn
- Miền Bắc
- Miền Trung
- Miền Nam
- Khác / Tự nhập

# 6. Nhu cầu / Mục tiêu

**Loại nhập liệu:** Multi-select, khuyến nghị chọn tối đa 2–3 + Tự nhập

### Giao dịch hằng ngày
- Mở tài khoản
- Nhận lương
- Chuyển tiền / Thanh toán
- Mở thẻ tín dụng
- Chi tiêu qua thẻ

### Tiết kiệm / Tích lũy
- Gửi tiết kiệm
- Tích lũy định kỳ
- Xây dựng quỹ dự phòng
- Tích lũy cho mục tiêu cụ thể

### Vay vốn
- Vay mua nhà
- Vay mua xe
- Vay tiêu dùng
- Vay phục vụ kinh doanh
- Cần thêm vốn trong ngắn hạn

### Đầu tư / Tài sản
- Đầu tư tiền nhàn rỗi
- Tăng trưởng tài sản
- Bảo toàn tài sản
- Lập kế hoạch tài chính dài hạn

### Mục tiêu cuộc sống
- Mua nhà
- Mua xe
- Du lịch
- Kết hôn
- Sinh con / Chăm lo gia đình
- Giáo dục cho con
- Chuẩn bị nghỉ hưu

### Khác
- Chưa xác định rõ nhu cầu
- Khác / Tự nhập

# 7. Hành vi hiện tại

**Loại nhập liệu:** Multi-select + Tự nhập

### Hành vi sử dụng ngân hàng
- Đã sử dụng dịch vụ ngân hàng khác
- Chỉ sử dụng một ngân hàng chính
- Sử dụng nhiều ngân hàng
- Thường xuyên so sánh các ngân hàng
- Đã có quan hệ với RM / Sales khác

### Hành vi giao dịch
- Ưu tiên giao dịch trên ứng dụng
- Thích tự tìm hiểu trước khi quyết định
- Ít sử dụng ngân hàng số
- Thích được tư vấn trực tiếp
- Ít có thời gian

### Hành vi tài chính
- Chi tiêu theo kế hoạch
- Chi tiêu khá cảm tính
- Thường xuyên có tiền nhàn rỗi
- Đã có khoản tiết kiệm
- Đã có khoản vay
- Đã có danh mục đầu tư

### Hành vi ra quyết định
- Quyết định nhanh
- Cần thời gian suy nghĩ
- Thích so sánh kỹ
- Thường hỏi nhiều câu hỏi
- Cần tham khảo gia đình / người thân
- Tự nghiên cứu rất kỹ trước khi gặp Sales

### Khác
- Khác / Tự nhập

# 8. Pain points

**Loại nhập liệu:** Multi-select, khuyến nghị chọn tối đa 3 + Tự nhập

### Về sản phẩm
- Lo lãi suất cao
- Lo các loại phí
- Không hiểu rõ sản phẩm
- Sợ sản phẩm không phù hợp
- Điều kiện sản phẩm quá phức tạp

### Về quy trình
- Ngại thủ tục phức tạp
- Không có thời gian làm hồ sơ
- Ngại cung cấp nhiều giấy tờ
- Từng có trải nghiệm không tốt
- Lo phải chờ đợi lâu

### Về niềm tin
- Sợ rủi ro
- Lo bị lừa đảo
- Không tin quảng cáo
- Không tin nhân viên tư vấn
- Sợ bị ép mua
- Lo thông tin không minh bạch

### Về tài chính
- Thu nhập không ổn định
- Lo áp lực trả nợ
- Chưa đủ khả năng tài chính
- Khó cân đối dòng tiền

### Tình huống nâng cao
- Không thấy sự khác biệt giữa các ngân hàng
- Đã có giải pháp ở ngân hàng khác
- Chưa thấy nhu cầu cấp thiết
- Từng bị từ chối vay / sử dụng sản phẩm

### Khác
- Khác / Tự nhập

# 9. Kỳ vọng

**Loại nhập liệu:** Multi-select, khuyến nghị chọn tối đa 3 + Tự nhập

### Về tư vấn
- Tư vấn dễ hiểu
- Tư vấn đúng nhu cầu
- Thông tin minh bạch
- Có phân tích / so sánh rõ ràng
- Không chèo kéo

### Về trải nghiệm
- Nhanh chóng
- Thủ tục đơn giản
- Có thể thực hiện online
- Được hỗ trợ tận tình
- Được phục vụ chủ động

### Về giải pháp
- Lãi suất tốt
- Phí thấp
- Nhiều ưu đãi
- Giải pháp linh hoạt
- Cá nhân hóa theo nhu cầu
- Được tư vấn tài chính tổng thể

### Khác
- Khác / Tự nhập

# 10. Động lực

**Loại nhập liệu:** Multi-select, khuyến nghị chọn tối đa 2–3 + Tự nhập

- Muốn tiết kiệm chi phí
- Muốn nhận ưu đãi
- Có nhu cầu cấp thiết
- Muốn đạt mục tiêu tài chính
- Muốn tiết kiệm thời gian
- Muốn tăng trưởng tài sản
- Muốn bảo vệ tài chính gia đình
- Được người quen giới thiệu
- Tin tưởng thương hiệu ngân hàng
- Đã có trải nghiệm tốt trước đây
- Khác / Tự nhập

# 11. Rào cản

**Loại nhập liệu:** Multi-select, khuyến nghị chọn tối đa 2–3 + Tự nhập

- Chưa đủ tin tưởng
- Sợ rủi ro
- Đang sử dụng ngân hàng khác
- Chưa thấy nhu cầu cấp thiết
- Thiếu thời gian
- Sợ thủ tục phức tạp
- Lo chi phí
- Cần tham khảo người thân
- Muốn so sánh thêm
- Đã từng có trải nghiệm không tốt
- Khác / Tự nhập

# 12. Độ khó mong muốn của tình huống

**Loại nhập liệu:** Single select

> Tiêu chí này dùng để AI điều chỉnh cách khách hàng phản hồi trong quá trình role-play.

## Dễ
- Khách hàng hợp tác
- Sẵn sàng chia sẻ thông tin
- Nhu cầu tương đối rõ
- Ít phản đối
- Sales chỉ cần khai thác đúng nhu cầu và tư vấn cơ bản

## Trung bình
- Khách hàng chưa xác định hoàn toàn nhu cầu
- Có một số băn khoăn hoặc phản đối
- Cần Sales đặt câu hỏi khai thác tốt
- Có xu hướng so sánh trước khi quyết định

## Khó
- Khách hàng dè dặt, không dễ chia sẻ
- Có nhiều pain points
- Đặt nhiều câu hỏi
- So sánh với ngân hàng khác
- Cần Sales xử lý phản đối và xây dựng niềm tin

## Thử thách
- Khách hàng hoài nghi cao
- Hiểu biết tương đối tốt về sản phẩm / tài chính
- Có nhiều lựa chọn thay thế
- Thường xuyên thương lượng hoặc phản biện
- Có thể đưa ra phản đối bất ngờ
- Sales cần khai thác sâu, xử lý tình huống và tạo khác biệt rõ ràng

---

> **Gợi ý vận hành:** Không nhất thiết bắt buộc điền toàn bộ tiêu chí. Chỉ cần 3–5 thông tin cốt lõi, AI đã có thể tạo chân dung khách hàng. Càng cung cấp nhiều thông tin, persona và tình huống role-play càng cụ thể.

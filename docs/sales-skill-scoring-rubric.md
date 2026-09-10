# Sales Skill Framework & Scoring Rubric — M-BUDDY

## 1. Khung bán hàng chuẩn (5 bước)

Đây là khung ngắn gọn, không lý thuyết hàn lâm, dùng làm cơ sở để AI đánh
giá "kỹ năng giao tiếp" và "kỹ năng chốt sale" trong transcript.

1. **Mở đầu tạo thiện cảm** — Chào hỏi tự nhiên, tạo không khí thoải mái,
   không vào thẳng bán hàng ngay lập tức.
2. **Khám phá nhu cầu** — Đặt câu hỏi mở để tìm hiểu tình huống, mong muốn
   thật của khách hàng (không phải hỏi dẫn dắt ép mua).
3. **Trình bày giải pháp khớp nhu cầu** — Giới thiệu sản phẩm dựa trên
   đúng nhu cầu vừa khai thác được, không đọc thuộc lòng tính năng chung
   chung.
4. **Xử lý từ chối** — Khi khách phản đối/do dự, phản hồi bình tĩnh, đúng
   trọng tâm lo ngại của khách (không né tránh, không tranh cãi).
5. **Chốt rõ ràng** — Đưa ra lời đề nghị hành động cụ thể (đăng ký ngay,
   hẹn lịch, gửi tài liệu...), không để cuộc gọi kết thúc mập mờ.

## 2. Checklist tuân thủ quy trình (compliance)

Dùng cho tiêu chí "Tuân thủ quy trình" ở rubric bên dưới — đây là các bước
bắt buộc không được bỏ sót, tuỳ sản phẩm:

- [ ] Xác minh đúng nhu cầu/thông tin cơ bản của khách trước khi tư vấn sâu
- [ ] Nói rõ lãi suất/phí áp dụng (không mập mờ, không chỉ nói "ưu đãi")
- [ ] Với sản phẩm có yếu tố đầu tư (Bảo hiểm liên kết, Combo): phải nói
      rõ đây không phải cam kết lợi nhuận cố định, có yếu tố rủi ro
- [ ] Với Bảo hiểm liên kết: phải nhắc đến quyền cân nhắc 21 ngày
- [ ] Không tạo cảm giác ép buộc/hối thúc khách chốt ngay lập tức
- [ ] Xin phép/xác nhận sự đồng ý của khách trước khi tiến hành các bước
      tiếp theo (đăng ký, gửi thông tin...)

## 3. Bảng objection theo sản phẩm

Đã có đầy đủ trong `products.md` — mỗi sản phẩm có 4 câu hỏi/phản đối
thường gặp kèm câu trả lời mẫu. AI chấm điểm sẽ đối chiếu cách nhân viên
xử lý objection trong transcript với các câu trả lời mẫu này để đánh giá
tiêu chí "Xử lý từ chối".

## 4. Rubric chấm điểm — 6 tiêu chí

| Tiêu chí | Mô tả | Cách đo (gợi ý cho AI) |
|---|---|---|
| Kiến thức sản phẩm | Trả lời đúng thông tin sản phẩm | Đối chiếu câu trả lời của nhân viên với "Key selling points" chuẩn trong `products.md` |
| Kỹ năng giao tiếp/thái độ | Giọng điệu, sự đồng cảm, cách xưng hô | AI đánh giá qua ngôn từ trong transcript (lịch sự, đồng cảm, tự nhiên hay máy móc) |
| Xử lý từ chối | Phản ứng khi khách nói "không cần"/do dự | Đếm số objection khách đưa ra và tỷ lệ được xử lý mượt (đối chiếu với objection bank) |
| Khai thác nhu cầu/Insight | Đặt câu hỏi mở, tìm ra nhu cầu thật | Đếm số câu hỏi khám phá nhu cầu chất lượng (không phải câu hỏi đóng kiểu có/không) |
| Kỹ năng chốt sale | Có đưa ra lời chốt rõ ràng, đúng thời điểm | AI nhận diện "closing signal" — câu đề nghị hành động cụ thể ở cuối hội thoại |
| Tuân thủ quy trình | Có bỏ sót bước bắt buộc không | Đối chiếu với checklist compliance ở mục 2 |

## 5. Đoạn rubric rút gọn — sẵn sàng dán vào prompt AI chấm điểm

Đoạn dưới đây có thể copy thẳng vào biến `{rubric}` trong prompt chấm điểm
ở `ai-prompts.md` (thay cho phiên bản rút gọn 3 tiêu chí cũ, nếu bạn muốn
dùng đủ 6 tiêu chí thay vì 3):

```
Đánh giá nhân viên sales dựa trên toàn bộ cuộc hội thoại và mức độ xử lý khách hàng. 
Chấm theo 6 tiêu chí sau, thang điểm từ 0–100 cho mỗi tiêu chí:

1. customer_understanding_score — Hiểu khách hàng:
   Đánh giá nhân viên có khai thác và hiểu đúng bối cảnh, nhu cầu, mục tiêu,
   mối quan tâm và vấn đề thực sự của khách hàng hay không. Đồng thời đánh giá
   giải pháp được đề xuất có phù hợp với những gì khách hàng đã chia sẻ hay không.

2. knowledge_score — Kiến thức sản phẩm:
   Đánh giá khả năng cung cấp thông tin sản phẩm chính xác, đầy đủ và phù hợp
   với câu hỏi hoặc nhu cầu của khách hàng. Không đưa ra thông tin sai lệch,
   thiếu chính xác hoặc không chắc chắn.

3. communication_score — Kỹ năng giao tiếp & thái độ:
   Đánh giá giọng điệu, cách diễn đạt, sự đồng cảm, khả năng lắng nghe và phản hồi,
   cách xưng hô và mức độ chuyên nghiệp trong suốt cuộc hội thoại.

4. objection_handling_score — Xử lý từ chối:
   Đánh giá cách phản ứng khi khách hàng do dự, băn khoăn hoặc từ chối. Nhân viên
   có nhận diện đúng lý do phía sau sự từ chối, làm rõ băn khoăn và phản hồi đúng
   trọng tâm hay không. Đánh giá mức độ xử lý các phản đối một cách tự nhiên,
   thuyết phục và không gây áp lực cho khách hàng.

5. insight_discovery_score — Khai thác nhu cầu / Insight:
   Đánh giá khả năng đặt câu hỏi để khám phá nhu cầu sâu hơn của khách hàng.
   Ưu tiên đánh giá chất lượng câu hỏi mở, khả năng đào sâu từ câu trả lời của
   khách hàng và khả năng tìm ra insight, động cơ hoặc nhu cầu thực sự.
   Không đánh giá cao việc chỉ đặt nhiều câu hỏi đóng dạng có/không.

6. closing_score — Kỹ năng chốt sale:
   Đánh giá khả năng nhận biết thời điểm phù hợp để dẫn dắt cuộc hội thoại đến
   bước tiếp theo. Nhân viên có tóm tắt được giá trị/giải pháp phù hợp và đưa ra
   lời đề nghị hành động rõ ràng hay không, ví dụ: xác nhận nhu cầu, đăng ký,
   hẹn gặp lại hoặc thống nhất bước follow-up tiếp theo. Không để cuộc hội thoại
   kết thúc mập mờ khi đã có cơ hội dẫn dắt khách hàng.

Khi đánh giá, xem xét hành trình bán hàng tổng thể theo logic:
Mở đầu tạo thiện cảm → Khai thác nhu cầu → Hiểu khách hàng → Đề xuất giải pháp
phù hợp → Xử lý băn khoăn/từ chối → Chốt hoặc thống nhất bước tiếp theo.

Trả về CHỈ MỘT JSON object, không thêm text nào khác:

{
  "customer_understanding_score": number,
  "knowledge_score": number,
  "communication_score": number,
  "objection_handling_score": number,
  "insight_discovery_score": number,
  "closing_score": number,
  "strengths": string[],
  "improvements": string[],
  "next_level_suggestion": string
}
```

> Lưu ý: bản 3 tiêu chí gốc trong `ai-prompts.md` (knowledge / skill /
> situation_handling) vẫn dùng tốt cho MVP nếu bạn muốn giữ đơn giản khi
> demo. Bản 6 tiêu chí ở trên chi tiết hơn, phù hợp nếu bạn có đủ thời
> gian để build màn Kết quả/Phân tích chi tiết hiển thị đủ 6 chỉ số (radar
> chart 6 trục sẽ rất đẹp mắt khi demo).

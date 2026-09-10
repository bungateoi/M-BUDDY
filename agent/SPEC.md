# Spec Kit — M-BUDDY AI Agent Backend

Trạng thái: **CONFIRMED — sẵn sàng scaffold code.**

Nguồn tham chiếu:
- `../app/lib/ai.ts` — contract phía client đã tồn tại (`RoleplayAIParams`,
  `ScoringAIParams`, `ScoringResult`) — backend phải khớp field/kiểu dữ
  liệu với các type này, không tự đặt tên khác.
- `../docs/ai-prompts.md` — 2 system prompt gốc cho role-play và chấm điểm.
- `../docs/sales-skill-scoring-rubric.md` — định nghĩa 6 tiêu chí chấm điểm.
- `../app/data/types.ts` — `Persona`, `Product`, `Level` đầy đủ field.

Model: **Qwen 3.6 Flash**, qua GreenNode AI Platform (OpenAI-compatible
endpoint, cấu hình ở bước `/agentbase-llm` sau khi spec này được duyệt).

---

## 1. Function: Role-play (`POST /roleplay`)

### Input

```json
{
  "persona": {
    "id": "nv-van-phong-tre",
    "name": "Nhân viên văn phòng trẻ",
    "criteria": {
      "age": "24–32 tuổi",
      "occupation": "Nhân viên văn phòng",
      "incomeLevel": "Thu nhập ổn định",
      "needs": "Quản lý chi tiêu thông minh, tiện lợi...",
      "painPoints": "Không có nhiều thời gian...",
      "expectations": "Ngắn gọn, đúng trọng tâm...",
      "barriers": "Đã quen dùng ví điện tử/thẻ ngân hàng khác..."
    },
    "behaviorNote": "Hỏi nhanh, đi thẳng vào lợi ích cụ thể...",
    "generalTactic": "Đi thẳng vào lợi ích, dùng số liệu cụ thể..."
  },
  "product": {
    "id": "vay-tieu-dung",
    "name": "Vay tiêu dùng",
    "shortDescription": "Vay tín chấp phục vụ nhu cầu tiêu dùng cá nhân...",
    "keySellingPoints": ["Giải ngân nhanh, không cần thế chấp", "..."]
  },
  "level": {
    "id": "2.3",
    "openingLine": "Mình chưa cần vay gì cả, lương đủ sống mà.",
    "objectionBank": [
      { "trigger": "Mở sẵn có ảnh hưởng gì đến điểm tín dụng không?", "guidance": "Trả lời trung thực, ngắn gọn..." }
    ],
    "winCriteria": "Khách đồng ý mở hạn mức dự phòng dù hiện tại chưa dùng đến."
  },
  "roleplayDurationSec": 150,
  "secondsElapsed": 42,
  "history": [
    { "role": "customer", "text": "Mình chưa cần vay gì cả, lương đủ sống mà." },
    { "role": "seller", "text": "Dạ em hiểu, đây không phải khoản vay phải dùng ngay ạ..." }
  ],
  "sellerUtterance": "Anh/chị có thể mở sẵn hạn mức để dùng khi cần gấp, không mất phí nếu không dùng đến."
}
```

**Ghi chú field**:
- `persona` / `product` — subset field thực sự cần cho prompt (không cần
  gửi nguyên `Persona`/`Product` đầy đủ như `starRating`, `isBossChapter`…
  nếu backend không dùng tới). Cắt gọn để giảm token, nhưng field name
  phải khớp `app/data/types.ts`.
- `level` — dùng để inject "Mục tiêu"/objection bank thật của level vào
  prompt, đúng gợi ý trong `roleplay-scenarios.md` mục "Cách dùng khi build".
- `history` — các lượt **trước đó**, chưa gồm `sellerUtterance` mới nhất.
- `sellerUtterance` — câu vừa nói của nhân viên sales, tách riêng khỏi
  `history` cho rõ ràng. **[CONFIRMED]** Đây là 1 thay đổi so với
  `RoleplayAIParams.history` hiện tại trong `app/lib/ai.ts` (đang gộp
  chung) — cần đồng bộ lại type đó khi bắt đầu code (Step 5), không phải
  việc của backend.

### Output — JSON có cấu trúc (không phải text tự do)

```json
{
  "customerReply": "Ừ nghe cũng hay, nhưng mà mở sẵn có tốn phí gì không?",
  "emotion": "curious",
  "shouldEndCall": false,
  "endReason": null,
  "hintForSeller": null
}
```

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `customerReply` | string | Lời thoại khách hàng — nội dung chính hiển thị/đọc trên màn Role-play. |
| `emotion` | enum: `curious` \| `skeptical` \| `warming_up` \| `satisfied` \| `annoyed` \| `ending_call` | Trạng thái cảm xúc hiện tại — app dùng để đổi trạng thái mascot/khách hàng sau này (hiện màn Role-play có ô "Đang lắng nghe..." có thể nâng cấp theo field này). |
| `shouldEndCall` | boolean | `true` nếu AI quyết định khách hàng cúp máy ngay (đúng tinh thần PRD: "nếu nhân viên không đi vào đúng vấn đề... tìm lý do hợp lý để kết thúc cuộc gọi"). App sẽ tự điều hướng sang màn Kết quả thay vì chờ người dùng bấm "Kết thúc". |
| `endReason` | enum: `null` \| `convinced` \| `not_interested` \| `ran_out_of_patience` | Lý do kết thúc, chỉ có giá trị khi `shouldEndCall = true`. |
| `hintForSeller` | `string \| null` | **[CONFIRMED — schema only, logic sau]** Gợi ý cho nút "Gợi ý" trên màn Role-play. Field đã có trong contract từ bây giờ để không phải đổi schema lần 2, nhưng backend v1 luôn trả `null` — logic sinh gợi ý thật (vd dựa trên objection vừa nhận ra) sẽ làm ở phiên bản sau, ưu tiên xong role-play + chấm điểm core trước. |

---

## 2. Function: Chấm điểm (`POST /score`)

### Input

```json
{
  "product": {
    "id": "vay-tieu-dung",
    "name": "Vay tiêu dùng",
    "keySellingPoints": ["Giải ngân nhanh, không cần thế chấp", "..."],
    "objectionBank": [
      { "question": "Lãi suất vay tiêu dùng thường cao lắm.", "sampleAnswer": "Mức lãi suất cụ thể phụ thuộc hồ sơ..." }
    ]
  },
  "transcript": [
    { "role": "customer", "text": "Mình chưa cần vay gì cả, lương đủ sống mà." },
    { "role": "seller", "text": "..." }
  ],
  "rubric": "(tuỳ chọn) string tự do — mô tả 6 tiêu chí, thay thế phần rubric mặc định trong prompt. Không có thì dùng DEFAULT_SCORING_RUBRIC trong main.py (khớp sales-skill-scoring-rubric.md §5). Không đổi 6 field điểm/schema output — chỉ đổi PHẦN MÔ TẢ tiêu chí gửi cho LLM."
}
```

Khớp `ScoringAIParams` hiện có trong `app/lib/ai.ts` — không đổi (`rubric` là field mở rộng optional, không có trong `ScoringAIParams`, app có thể bỏ qua nếu không cần).

### Output — khớp CHÍNH XÁC `ScoringResult` đã định nghĩa sẵn trong `app/lib/ai.ts`

```json
{
  "customer_understanding_score": 75,
  "knowledge_score": 80,
  "communication_score": 70,
  "objection_handling_score": 60,
  "insight_discovery_score": 47,
  "closing_score": 60,
  "strengths": [
    "Xác nhận đúng nhu cầu ban đầu của khách trước khi đề xuất giải pháp.",
    "Giọng điệu tự nhiên, không gây áp lực."
  ],
  "improvements": [
    "Chưa đào sâu insight — mới dừng ở 1 câu hỏi mở, chưa khai thác lý do thật phía sau sự do dự."
  ],
  "next_level_suggestion": "Luyện thêm kỹ năng khai thác insight ở level 2.4 (Bảo hiểm liên kết).",
  "turn_feedback": [
    { "turn_index": 1, "is_good": false, "comment": "Khách đã nêu rõ nỗi đau chi tiêu vượt kế hoạch, thay vì hỏi câu đóng \"có muốn dùng thử không\" bạn nên chủ động giới thiệu app quản lý tài chính và mời khách trải nghiệm trực tiếp." },
    { "turn_index": 3, "is_good": true, "comment": null }
  ]
}
```

> **[CONFIRMED]** Chấm theo **6 tiêu chí độc lập, mỗi tiêu chí 0–100**
> (khớp `ai-prompts.md` + `ScoringResult` hiện có trong `app/lib/ai.ts`
> — KHÔNG đổi cấu trúc type này). Backend trả về đúng 6 field điểm +
> `strengths`/`improvements`/`next_level_suggestion` như trên, không thêm
> field tổng điểm vào response.
>
> **`turn_feedback`** (thêm sau, cho màn "Lịch sử hội thoại" ở màn Kết
> quả): 1 phần tử cho MỖI lượt `role: "seller"` trong `transcript` đã gửi
> lên — `turn_index` là index (0-based) của lượt đó trong mảng `transcript`
> gốc. `is_good: false` PHẢI kèm `comment` — nhận xét dựa trên câu nói của
> khách ngay trước đó + bối cảnh hội thoại + tính cách khách hàng (ý thật
> của khách là gì, vì sao câu trả lời chưa tốt, đúng ra nên nói gì). App
> dùng field này để tô xanh (tốt) / cam-đỏ kèm gợi ý (chưa tốt) từng bong
> bóng chat của "Bạn" khi mở "Lịch sử hội thoại" — xem
> `app/data/scoringMapper.ts` (`buildRoleplayResultFromScoring`).
>
> **Điểm tổng hiển thị ở màn Kết quả = trung bình cộng của 6 điểm trên**,
> tính ở phía hiển thị (mobile app), không phải field do backend trả về.
>
> ⚠️ **Follow-up cần làm riêng, ngoài phạm vi backend này**: mock data
> hiện tại ở `app/data/roleplayResults.ts` (`roleplayResultsByLevelId`)
> đang dùng thang điểm cũ (trọng số 20/20/15/15/15/15 = 100/level), khác
> với quyết định này (0–100 độc lập, tổng = trung bình cộng). Cần sửa lại
> mock đó + `ResultCriterionRow`/`ResultSummaryCard` (đơn vị hiển thị
> "/100" trên từng tiêu chí thay vì "/20" hoặc "/15") khi rảnh tay, để
> app khớp đúng với backend thật. Chưa làm ngay vì không thuộc scope
> "build backend" đang làm.

---

## 3. Ngoài phạm vi function (nhưng liên quan)

- **Auth giữa app mobile ↔ backend**: chưa định nghĩa (JWT? IAM token
  của AgentBase? API key riêng?). Cần chốt ở bước Step 4 (Identity) của
  wizard.
- **Rate limit / timeout**: role-play cần phản hồi nhanh (trong lúc gọi
  điện, có đồng hồ đếm ngược) — nên đặt timeout ngắn (~5-8s) và có
  fallback reply nếu LLM chậm. Sẽ chốt cụ thể khi viết code (Step 5).
- **Framework**: đề xuất **LangChain, không cần Memory persistent** (mỗi
  role-play chỉ trong 1 phiên, `history` gửi kèm mỗi request — không cần
  AgentBase Memory service) — trừ khi bạn muốn lưu lịch sử luyện tập dài
  hạn cho phân tích sau này (màn "Phân tích chi tiết"), lúc đó mới cần
  `/agentbase-memory`.

---

## Đã xác nhận (2026-08-31)

1. ✅ Tách `sellerUtterance` khỏi `history`.
2. ✅ Thêm `hintForSeller` vào schema ngay (v1 luôn trả `null`, logic thật làm sau).
3. ✅ Chấm theo 6 tiêu chí độc lập 0–100, không đổi `ScoringResult`. Tổng
   điểm = trung bình cộng, tính ở phía app (không phải field backend trả).

→ Sẵn sàng chuyển sang **Bước 2/9: Scaffold Project**.

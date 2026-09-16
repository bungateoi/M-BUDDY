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
    "id": "noi-tro-tiet-kiem",
    "name": "Bác Lan, nội trợ tiết kiệm",
    "criteria": {
      "age": "52 tuổi",
      "occupation": "Nội trợ, chồng hưu trí",
      "incomeLevel": "Chồng hưu ~6–7 triệu/tháng, có 150–250 triệu nhàn rỗi",
      "needs": "Gửi tiết kiệm an toàn, sinh lời ổn định...",
      "painPoints": "Sợ rủi ro mất tiền; không rành công nghệ...",
      "expectations": "Giải thích rõ ràng, chậm rãi, đơn giản...",
      "barriers": "Cần người thân/quen giới thiệu mới yên tâm..."
    },
    "behaviorNote": "Dễ tính, ít phản bác gay gắt, hay hỏi lại nhiều lần...",
    "generalTactic": "Nói chậm, ví dụ đời thường, trấn an an toàn trước...",
    "selfAddress": "bác",
    "sellerAddress": "cháu",
    "speakingStyle": "Chậm, hay ngập ngừng, đứt quãng giữa câu...",
    "patienceNote": "Rất cao. Loại 1: 4–5 lần liên tiếp không đáp ứng → tủi thân...",
    "closingSignal": "Chủ động hỏi \"thế giờ làm thế nào hả cháu\"...",
    "financialData": "Chồng hưu ~6–7 triệu/tháng, có 150–250 triệu nhàn rỗi...",
    "hiddenData": "Số tiền cụ thể: lộ khi hỏi \"Bác định để dành khoảng bao nhiêu ạ?\"...",
    "contrastExample": "✅ \"Dạ khoản này an toàn ạ...\" / ❌ \"An toàn mà bác.\""
  },
  "product": {
    "id": "tiet-kiem-ong-vang",
    "name": "Tiết kiệm Ong Vàng",
    "shortDescription": "Giải pháp tiết kiệm gửi góp linh hoạt...",
    "keySellingPoints": ["Kỳ hạn linh hoạt 3–36 tháng", "..."],
    "knowledgeBase": "Trích đoạn kiến thức sản phẩm ĐẦY ĐỦ (nguồn MSB_Product_Knowledge_Base.md) — dùng để đối chiếu số liệu/điều kiện khi khách hỏi, tránh AI bịa số ngoài phạm vi."
  },
  "level": {
    "id": "1.1",
    "openingLine": "Alo? Ai đấy ạ?",
    "objectionBank": [
      { "trigger": "Thế so với chỗ bác đang gửi thì có hơn không cháu?", "guidance": "So sánh cụ thể với lãi suất tại quầy..." }
    ],
    "winCriteria": "Bác chủ động hỏi cách làm và Sale chốt ngay...",
    "trainingScript": "Kịch bản phân nhánh ĐẦY ĐỦ (nguồn Kich_ban_training.md): bối cảnh + các mốc thời gian + nhánh phản ứng theo cách Sale xử lý + điều kiện WIN/LOSE — ngữ cảnh CHÍNH để AI phản ứng đúng, không phải lời thoại đọc lại nguyên văn."
  },
  "roleplayDurationSec": 150,
  "secondsElapsed": 42,
  "history": [
    { "role": "customer", "text": "Mình chưa cần vay gì cả, lương đủ sống mà." },
    { "role": "seller", "text": "Dạ em hiểu, đây không phải khoản vay phải dùng ngay ạ..." }
  ],
  "sellerUtterance": "Anh/chị có thể mở sẵn hạn mức để dùng khi cần gấp, không mất phí nếu không dùng đến.",
  "globalRules": "Nguyên văn v2_docs/Rule_chung.md mục A (quy tắc chung áp dụng mọi persona: xưng hô cố định, không tự tiết lộ dữ liệu ẩn, A19 bắt buộc giới thiệu bản thân...) — xem app/data/rules.ts#GLOBAL_ROLEPLAY_RULES."
}
```

**Ghi chú field**:
- `persona` / `product` — subset field thực sự cần cho prompt (không cần
  gửi nguyên `Persona`/`Product` đầy đủ như `starRating`, `isBossChapter`…
  nếu backend không dùng tới). Cắt gọn để giảm token, nhưng field name
  phải khớp `app/data/types.ts`.
- `persona.selfAddress`/`sellerAddress`/`speakingStyle`/`patienceNote`/
  `closingSignal`/`financialData`/`hiddenData`/`contrastExample` —
  **[CẬP NHẬT — v2 content]** optional, nguồn `v2_docs/Persona_5_nhan_vat.md`
  + `Rule_chung.md` mục B. Thiếu field nào thì backend fallback hợp lý
  (vd `selfAddress`/`sellerAddress` mặc định "tôi"/"bạn") — không bắt buộc
  cho persona sinh bởi AI (`/generate-persona`) hay hồ sơ Practice cũ.
- `product.knowledgeBase` — **[CẬP NHẬT — v2 content]** optional, trích đoạn
  đầy đủ từ `MSB_Product_Knowledge_Base.md`, dùng làm ngữ cảnh grounding cho
  cả role-play (khách không tự mâu thuẫn số liệu) và chấm điểm
  (`knowledge_score`).
- `level` — dùng để inject "Mục tiêu"/objection bank thật của level vào
  prompt, đúng gợi ý trong `roleplay-scenarios.md` mục "Cách dùng khi build".
- `level.trainingScript` — **[CẬP NHẬT — v2 content]** optional, kịch bản
  phân nhánh đầy đủ nguồn `Kich_ban_training.md` — ngữ cảnh CHÍNH để AI biết
  phản ứng theo cách Sale xử lý, không phải "đọc lại nguyên văn"; số
  level/chặng không còn cố định 5 (chặng 4 chỉ có 3 level, các chặng khác 4).
- `globalRules` — **[MỚI — v2 content]** optional, nguyên văn mục A của
  `Rule_chung.md` — quy tắc áp dụng chung mọi persona (xem
  `app/data/rules.ts`). App luôn gửi field này cho luồng role-play theo Map;
  các luồng khác (generated persona, Practice) có thể bỏ trống.
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
    ],
    "knowledgeBase": "(tuỳ chọn) trích đoạn kiến thức sản phẩm đầy đủ — xem mục 1."
  },
  "transcript": [
    { "role": "customer", "text": "Mình chưa cần vay gì cả, lương đủ sống mà." },
    { "role": "seller", "text": "..." }
  ],
  "rubric": "(tuỳ chọn) string tự do — mô tả 6 tiêu chí, thay thế phần rubric mặc định trong prompt. Không có thì dùng DEFAULT_SCORING_RUBRIC trong main.py (khớp sales-skill-scoring-rubric.md §5). Không đổi 6 field điểm/schema output — chỉ đổi PHẦN MÔ TẢ tiêu chí gửi cho LLM.",
  "globalRules": "(tuỳ chọn) nguyên văn Rule_chung.md mục A — dùng để chấm tiêu chí độc lập A19 (bắt buộc giới thiệu bản thân) vào communication_score, xem app/data/rules.ts.",
  "level": "(tuỳ chọn) Level đầy đủ hoặc rút gọn — dùng level.trainingScript (nếu có) để đối chiếu đúng nhánh WIN/LOSE của tình huống khi chấm insight_discovery_score/closing_score."
}
```

Khớp `ScoringAIParams` hiện có trong `app/lib/ai.ts` (`rubric`/`globalRules`/`level` đều optional, app có thể bỏ qua nếu không cần — **[CẬP NHẬT — v2 content]** `globalRules`/`level` là field mới, xem mục 1).

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

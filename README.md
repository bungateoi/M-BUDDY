# M-BUDDY — Trợ lý luyện tập bán hàng AI cho nhân viên MSB

M-BUDDY là ứng dụng huấn luyện kỹ năng bán hàng cho nhân viên ngân hàng MSB
bằng role-play thoại trực tiếp với khách hàng ảo (AI), kèm chấm điểm tự động
theo 6 tiêu chí và phân tích tiến bộ theo thời gian (cá nhân + đội nhóm cho
trưởng nhóm).

## Demo

- **Web app**: https://mbuddy-v2.vercel.app

## Kiến trúc & dịch vụ bên thứ ba

```
app/       Ứng dụng di động/web (Expo + React Native), chạy trên iOS/Android/web
agent/     Backend AI agent (Python), triển khai trên GreenNode AgentBase
supabase/  Schema + migration cho Postgres (Supabase) — dữ liệu người dùng,
           tiến độ học, nội dung role-play (chặng/persona/sản phẩm)
```

| Dịch vụ / model | Vai trò |
|---|---|
| **GreenNode AgentBase** | Runtime triển khai backend AI agent (`agent/`) — build Docker image, chạy autoscaling, endpoint HTTPS công khai |
| **GreenNode AI Platform** | Cung cấp model LLM qua endpoint OpenAI-compatible |
| **Qwen 3.6 Flash** (qua GreenNode AIP) | Model chính cho role-play (khách hàng ảo trả lời) và chấm điểm |
| **Google Gemma 4 31B-IT** (qua GreenNode AIP) | Model dự phòng — tự động chuyển sang khi model chính bị giới hạn tần suất (rate limit) hoặc lỗi, xem `agent/main.py` (`LLM_MODEL_FALLBACK`) |
| **Supabase** | Postgres + Auth (đăng nhập email/mật khẩu) + Row Level Security cho toàn bộ dữ liệu người dùng/tiến độ/nội dung |
| **Vercel** | Hosting bản web (static export từ Expo) |

Toàn bộ dữ liệu huấn luyện (persona khách hàng, kịch bản hội thoại, sản
phẩm ngân hàng) là nội dung phục vụ mô phỏng, không phải
dữ liệu khách hàng thật hay thông tin nội bộ MSB.

## Chạy thử ở local

### 1. Backend agent (`agent/`)

```bash
cd agent
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # điền LLM_API_KEY/LLM_BASE_URL/LLM_MODEL (xem /agentbase-llm)
python3 main.py         # chạy ở http://127.0.0.1:8080
```

### 2. App (`app/`)

```bash
cd app
npm install
cp .env.example .env   # điền EXPO_PUBLIC_SUPABASE_URL/EXPO_PUBLIC_SUPABASE_ANON_KEY/EXPO_PUBLIC_BACKEND_URL
npx expo start          # quét QR bằng Expo Go, hoặc bấm "w" để mở bản web
```

### 3. Database (`supabase/`)

Chạy lần lượt các file trong `supabase/migrations/` (theo đúng thứ tự số)
trên project Supabase của bạn qua SQL Editor, hoặc `supabase db push` nếu
dùng Supabase CLI.


## Tài liệu thêm

- [`agent/SPEC.md`](agent/SPEC.md) — hợp đồng input/output đầy đủ của 2
  function AI (role-play, chấm điểm)
- [`v2_docs/`](v2_docs/) — kịch bản huấn luyện gốc dùng để sinh nội dung
  19 level trong `app/data/levels.ts`

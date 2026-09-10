"""M-BUDDY AI agent backend — role-play (virtual customer) + scoring +
persona generation.

Contract: see SPEC.md. HTTP endpoints (not the SDK's default single
/invocations path — GreenNodeAgentBaseApp is a plain Starlette subclass,
so extra routes are added directly):

  POST /roleplay          -> structured JSON reply from the virtual customer
  POST /score             -> 6-criteria rubric score for a full transcript
  POST /generate-persona  -> 1 customer persona + role-play config, generated
                              live from user-picked criteria (Practice screen,
                              "Tạo khách hàng theo tiêu chí")
  POST /admin/products    -> admin-only: create/update 1 sản phẩm, tự sinh
                              lại quiz + kịch bản role-play cho level liên quan
  POST /admin/personas    -> admin-only: create/update 1 chặng, tự sinh lại
                              quiz + kịch bản role-play cho level liên quan
  GET  /health            -> provided by the SDK (@app.ping below)
"""

import json
import os
import re
from datetime import datetime, timezone
from typing import Literal, Optional

import httpx
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from greennode_agentbase import (
    GreenNodeAgentBaseApp,
    PingStatus,
)

load_dotenv()

app = GreenNodeAgentBaseApp()

# No auth/cookies on these endpoints (see SPEC.md §3 — auth mechanism not
# decided yet), and the mobile app calls this from a plain fetch() — allow
# all origins so both the RN app and any web/browser client (e.g. Expo web
# preview) can call it without a CORS preflight failure.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LLM Configuration ---
# Uses any OpenAI-compatible LLM provider. For M-BUDDY: GreenNode AI
# Platform, model = Qwen 3.6 Flash. Set LLM_BASE_URL / LLM_API_KEY /
# LLM_MODEL in .env — see /agentbase-llm to get a platform API key.
LLM_MODEL = os.environ.get("LLM_MODEL", "")
LLM_BASE_URL = os.environ.get("LLM_BASE_URL", "")
LLM_API_KEY = os.environ.get("LLM_API_KEY", "")
if not LLM_MODEL or not LLM_BASE_URL or not LLM_API_KEY:
    raise ValueError(
        "LLM_MODEL, LLM_BASE_URL, and LLM_API_KEY environment variables are required. "
        "Set them in your .env file or use /agentbase-llm to get a platform API key."
    )

# Role-play happens live during a timed call — keep it snappy with a short
# timeout + a graceful fallback reply (see roleplay_handler) instead of a
# hard failure. Scoring runs after the call ends, not time-critical.
# max_tokens giới hạn thấp — vừa ép customerReply ngắn gọn tự nhiên như hội
# thoại điện thoại thật (không thuyết trình dài), vừa giảm độ trễ sinh phản hồi.
llm_roleplay = ChatOpenAI(model=LLM_MODEL, base_url=LLM_BASE_URL, api_key=LLM_API_KEY, timeout=10, temperature=0.4, max_tokens=250)
llm_scoring = ChatOpenAI(model=LLM_MODEL, base_url=LLM_BASE_URL, api_key=LLM_API_KEY, timeout=25)
# Sinh chân dung khách hàng — không time-critical (chạy 1 lần khi bấm "Tạo
# chân dung khách hàng", không phải giữa 1 cuộc gọi), temperature cao hơn để
# mỗi lần tạo ra 1 khách hàng đa dạng, không lặp lại y hệt nhau.
llm_persona = ChatOpenAI(model=LLM_MODEL, base_url=LLM_BASE_URL, api_key=LLM_API_KEY, timeout=25, temperature=0.9)
# Sinh lại nội dung "Quản trị hành trình & tri thức" (quiz + kịch bản
# role-play) khi admin sửa/thêm sản phẩm/chặng — không time-critical (thao
# tác quản trị, không phải giữa 1 cuộc gọi), temperature khớp
# scripts/generateQuizBank.mts (0.7) để giữ văn phong nhất quán với 125 câu
# hỏi đã sinh sẵn trước đó.
llm_content = ChatOpenAI(model=LLM_MODEL, base_url=LLM_BASE_URL, api_key=LLM_API_KEY, timeout=25, temperature=0.7)


# --- Supabase (chỉ dùng cho /admin/* — quản lý nội dung, xem "Quản trị hành
# trình & tri thức" trong /Users/mac/.claude/plans/vivid-leaping-sphinx.md).
# KHÔNG bắt buộc như LLM_* — nếu thiếu, /admin/* trả lỗi 500 rõ ràng thay vì
# làm sập cả app (roleplay/score/generate-persona vẫn phải chạy bình
# thường dù chưa cấu hình 2 biến này). ---
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")


class AdminAuthError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(message)


def _supabase_headers(extra: Optional[dict] = None) -> dict:
    headers = {"apikey": SUPABASE_SERVICE_ROLE_KEY, "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}"}
    if extra:
        headers.update(extra)
    return headers


async def verify_admin(request: Request) -> str:
    """Xác thực người gọi có role='admin' qua access token Supabase gửi
    trong header Authorization — chặn THẬT ở backend (không chỉ ẩn UI),
    vì /admin/* ghi thẳng vào DB bằng service-role key (bỏ qua RLS). Trả về
    user id nếu hợp lệ, raise AdminAuthError nếu không."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise AdminAuthError(500, "Backend chưa cấu hình SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY.")

    auth_header = request.headers.get("authorization", "")
    if not auth_header.lower().startswith("bearer "):
        raise AdminAuthError(401, "Thiếu access token — cần đăng nhập.")
    access_token = auth_header[7:].strip()

    async with httpx.AsyncClient(timeout=10) as client:
        user_res = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers={"apikey": SUPABASE_SERVICE_ROLE_KEY, "Authorization": f"Bearer {access_token}"},
        )
        if user_res.status_code != 200:
            raise AdminAuthError(401, "Access token không hợp lệ hoặc đã hết hạn.")
        user_id = user_res.json().get("id")
        if not user_id:
            raise AdminAuthError(401, "Access token không hợp lệ.")

        profile_res = await client.get(
            f"{SUPABASE_URL}/rest/v1/profiles",
            params={"id": f"eq.{user_id}", "select": "role"},
            headers=_supabase_headers(),
        )
        rows = profile_res.json() if profile_res.status_code == 200 else []
        if not rows or rows[0].get("role") != "admin":
            raise AdminAuthError(403, "Chỉ admin mới được thực hiện thao tác này.")

    return user_id


async def supabase_select(client: httpx.AsyncClient, table: str, params: dict) -> list[dict]:
    res = await client.get(f"{SUPABASE_URL}/rest/v1/{table}", params=params, headers=_supabase_headers())
    if res.status_code >= 300:
        raise RuntimeError(f"Supabase select {table} thất bại: HTTP {res.status_code} {res.text[:300]}")
    return res.json()


async def supabase_upsert(client: httpx.AsyncClient, table: str, rows: list[dict], on_conflict: str) -> list[dict]:
    if not rows:
        return []
    res = await client.post(
        f"{SUPABASE_URL}/rest/v1/{table}",
        params={"on_conflict": on_conflict},
        headers=_supabase_headers({"Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=representation"}),
        json=rows,
    )
    if res.status_code >= 300:
        raise RuntimeError(f"Supabase upsert {table} thất bại: HTTP {res.status_code} {res.text[:300]}")
    return res.json()


def db_row_to_product(row: dict) -> dict:
    """DB row (snake_case) -> dict camelCase khớp app/data/types.ts#Product,
    dùng lại được thẳng trong các prompt builder bên dưới (đọc field kiểu
    product.get("shortDescription") như build_scoring_prompt đã làm)."""
    return {
        "id": row["id"],
        "order": row["order_num"],
        "name": row["name"],
        "shortName": row.get("short_name"),
        "shortDescription": row["short_description"],
        "targetAudience": row["target_audience"],
        "benefits": row.get("benefits") or [],
        "basicConditions": row["basic_conditions"],
        "keySellingPoints": row.get("key_selling_points") or [],
        "objectionBank": row.get("objection_bank") or [],
        "complianceNote": row.get("compliance_note"),
    }


def db_row_to_persona(row: dict) -> dict:
    return {
        "id": row["id"],
        "chapterNumber": row["chapter_number"],
        "name": row["name"],
        "starRating": row["star_rating"],
        "criteria": row.get("criteria") or {},
        "behaviorNote": row["behavior_note"],
        "generalTactic": row["general_tactic"],
        "winCondition": row["win_condition"],
    }


# --- Output schemas (SPEC.md) ---


class RoleplayLLMOutput(BaseModel):
    """What the LLM itself produces. `hintForSeller` is added afterwards —
    v1 always returns null (generation logic is a later iteration, per
    SPEC.md decision 2), so we don't waste a structured-output slot on it."""

    customerReply: str = Field(description="Lời thoại tiếp theo của khách hàng, tiếng Việt, tự nhiên.")
    emotion: Literal["curious", "skeptical", "warming_up", "satisfied", "annoyed", "ending_call"]
    shouldEndCall: bool = Field(description="true nếu khách hàng quyết định cúp máy ở lượt này.")
    endReason: Optional[Literal["convinced", "not_interested", "ran_out_of_patience"]] = None


class GeneratedObjection(BaseModel):
    trigger: str
    guidance: str


class GeneratedProduct(BaseModel):
    name: str
    shortDescription: str
    keySellingPoints: list[str]


class GeneratedPersonaOutput(BaseModel):
    """1 chân dung khách hàng + cấu hình role-play, sinh trực tiếp từ tiêu
    chí người dùng chọn ở màn Practice > "Tạo khách hàng theo tiêu chí"
    (xem docs/tao_chan_dung_KH.md). Khác với 20 hồ sơ cố định (sinh sẵn 1
    lần bằng script) — cái này sinh MỚI mỗi lần người dùng bấm nút."""

    name: str = Field(description="Tên đầy đủ tiếng Việt hợp lý, khớp giới tính.")
    age: int = Field(ge=16, le=90)
    gender: Literal["Nam", "Nữ"]
    occupation: str
    incomeText: str
    region: str
    needs: str
    currentBehavior: str
    painPoints: str
    expectations: str
    motivation: str
    barrier: str
    difficulty: Literal["De", "TrungBinh", "Kho", "RatKho"] = Field(
        description="Độ khó tư vấn khách hàng này, suy từ toàn bộ hồ sơ vừa tạo."
    )
    behaviorNote: str
    openingLine: str
    winCriteria: str
    objectionBank: list[GeneratedObjection]
    product: GeneratedProduct


class TurnFeedback(BaseModel):
    """Nhận xét cho ĐÚNG 1 lượt nói của nhân viên sales (role="seller") trong
    transcript — turn_index trỏ thẳng vào vị trí (0-based) của lượt đó trong
    mảng transcript gốc đã gửi lên, giúp app tô màu/gắn nhận xét đúng bong
    bóng chat mà không cần suy luận lại."""

    turn_index: int = Field(description="Index (0-based) của lượt nói này trong transcript gốc.")
    is_good: bool = Field(description="true nếu đây là câu trả lời tốt, false nếu chưa tốt và cần cải thiện.")
    comment: Optional[str] = Field(
        default=None,
        description=(
            "CHỈ điền khi is_good=false. Nhận xét ngắn gọn nhưng rõ ý, PHẢI dựa trên "
            "ĐÚNG câu nói của khách ở index (turn_index - 1) — dòng NGAY TRƯỚC lượt này "
            "trong transcript, theo số thứ tự index, KHÔNG PHẢI dòng nào khác — cùng bối "
            "cảnh hội thoại từ đầu tới đó và tính cách khách hàng: chỉ ra ý thật của khách "
            "ở dòng (turn_index - 1) là gì, vì sao câu trả lời của sales ở turn_index chưa "
            "tốt, và đúng ra nên nói/hỏi gì. TUYỆT ĐỐI không dùng nội dung khách nói ở các "
            "index LỚN HƠN turn_index để phân tích/nhận xét — lúc lượt turn_index diễn ra, "
            "nhân viên sales CHƯA THỂ biết trước khách sẽ nói gì ở những lượt sau đó. Không "
            "nhận xét chung chung kiểu 'cần cải thiện thêm'. BẮT BUỘC viết TOÀN BỘ bằng "
            "tiếng Việt — không chêm bất kỳ từ/cụm từ tiếng Anh, tiếng Trung hay ngôn ngữ "
            "nào khác vào câu."
        ),
    )


class ScoringOutput(BaseModel):
    customer_understanding_score: int = Field(ge=0, le=100)
    knowledge_score: int = Field(ge=0, le=100)
    communication_score: int = Field(ge=0, le=100)
    objection_handling_score: int = Field(ge=0, le=100)
    insight_discovery_score: int = Field(ge=0, le=100)
    closing_score: int = Field(ge=0, le=100)
    strengths: list[str] = Field(description="2-3 điểm mạnh, viết bằng tiếng Việt 100%, không chêm tiếng Anh/Trung.")
    improvements: list[str] = Field(
        description="2-3 điểm cần cải thiện, viết bằng tiếng Việt 100%, không chêm tiếng Anh/Trung."
    )
    next_level_suggestion: str = Field(
        description=(
            "1 nội dung nên luyện tập tiếp theo. Viết bằng tiếng Việt 100% — dịch hẳn "
            "sang tiếng Việt tên kỹ năng/phương pháp, KHÔNG chú thích thêm tên gốc tiếng "
            "Anh trong ngoặc đơn (vd SAI: 'lắng nghe chủ động (Active Listening)')."
        )
    )
    turn_feedback: list[TurnFeedback] = Field(
        description="1 phần tử cho MỖI lượt nói role=\"seller\" trong transcript — không bỏ sót lượt nào."
    )


class GeneratedQuizQuestion(BaseModel):
    question: str
    options: list[str] = Field(min_length=4, max_length=4)
    correct_index: int = Field(ge=0, le=3)
    explanation: str


class GeneratedQuizBank(BaseModel):
    """5 câu hỏi trắc nghiệm "Ôn tập nhanh" cho 1 level — xem
    build_quiz_prompt (port từ scripts/generateQuizBank.mts)."""

    questions: list[GeneratedQuizQuestion] = Field(min_length=5, max_length=5)


class GeneratedLevelObjection(BaseModel):
    trigger: str
    guidance: str


class GeneratedLevelScript(BaseModel):
    """Kịch bản role-play cho 1 level (tổ hợp chặng x sản phẩm) — khớp
    openingLine/sampleFlow/objectionBank/winCriteria của Level trong
    app/data/types.ts, đúng văn phong docs/roleplay-scenarios.md."""

    opening_line: str = Field(description="Câu ĐẦU TIÊN khách hàng nói khi vừa nhấc máy nghe điện thoại sales gọi tới.")
    sample_flow: list[str] = Field(description="3-5 bước gợi ý xử lý tình huống cho nhân viên sales, không phải lời thoại bắt buộc.")
    objection_bank: list[GeneratedLevelObjection] = Field(description="2-3 cặp phản đối cụ thể của tình huống này.")
    win_criteria: str = Field(description="Tiêu chí cụ thể để coi là nhân viên sales đã tư vấn thành công trong đúng tình huống này.")


# method="function_calling": the default ("json_schema") sends
# response_format=json_object, which this endpoint rejects unless the
# literal word "json" appears in the prompt. Tool-calling avoids that.
roleplay_llm_structured = llm_roleplay.with_structured_output(RoleplayLLMOutput, method="function_calling")
scoring_llm_structured = llm_scoring.with_structured_output(ScoringOutput, method="function_calling")
persona_llm_structured = llm_persona.with_structured_output(GeneratedPersonaOutput, method="function_calling")
quiz_llm_structured = llm_content.with_structured_output(GeneratedQuizBank, method="function_calling")
level_script_llm_structured = llm_content.with_structured_output(GeneratedLevelScript, method="function_calling")


# --- Prompt building (adapted from docs/ai-prompts.md) ---


def build_roleplay_system_prompt(persona: dict, product: dict, level: dict, roleplay_duration_sec: int, seconds_elapsed: int) -> str:
    criteria = persona.get("criteria", {})
    objection_lines = "\n".join(
        f'- "{o.get("trigger")}" -> {o.get("guidance")}' for o in level.get("objectionBank", [])
    )
    behavior_note = persona.get("behaviorNote", "")
    return f"""XƯNG HÔ (quy tắc ưu tiên cao nhất, ĐỌC TRƯỚC KHI LÀM GÌ KHÁC): trong SUỐT
cuộc gọi, bạn LUÔN xưng "tôi" và gọi nhân viên sales là "bạn" — không bao giờ
dùng đại từ nào khác (không em/anh/chị/cô/chú/con/mày/tao...), bất kể tuổi
tác, giới tính, địa vị của persona bên dưới, và bất kể đang vui vẻ, khó chịu
hay gắt gỏng. Nếu nhìn lại lịch sử hội thoại thấy lượt trước lỡ dùng sai đại
từ, PHẢI tự sửa lại đúng "tôi"/"bạn" ngay từ lượt này trở đi, không lặp lại
lỗi đó.

BƯỚC KIỂM TRA BẮT BUỘC — LÀM TRƯỚC TIÊN, TRƯỚC KHI NGHĨ NỘI DUNG TRẢ LỜI, ƯU
TIÊN CAO HƠN MỌI HƯỚNG DẪN KHÁC TRONG PROMPT NÀY (kể cả hướng dẫn "bám sát
câu vừa nghe" bên dưới):
Đọc kỹ câu VỪA NÓI của nhân viên sales (sellerUtterance / tin nhắn cuối
cùng). Hỏi: câu đó có mất bình tĩnh, thiếu chuyên nghiệp, tỏ thái độ, quy
chụp/đổ lỗi cho khách, mỉa mai hay công kích khách theo bất kỳ cách nào
không? Ví dụ các câu PHẢI coi là vi phạm: "sao chị/anh khó chịu vậy", "chị/
anh đã không có nhu cầu thì để lại thông tin làm gì", "em chỉ tư vấn giúp
chị/anh thôi mà", hoặc bất kỳ câu nào có ý trách móc/quy trách nhiệm ngược
lại cho khách thay vì nhận lỗi/xin lỗi.
- NẾU CÓ: customerReply BẮT BUỘC là 1 câu RẤT NGẮN thể hiện sự bực mình/gắt
  lại (được phép nặng lời, KHÔNG thô tục), rồi PHẢI đặt shouldEndCall=true
  và endReason="ran_out_of_patience" — CÚP MÁY NGAY TRONG LƯỢT NÀY, không
  tiếp tục nội dung tư vấn, không hỏi han gì thêm, không cho thêm cơ hội,
  bất kể đang ở giây thứ mấy của cuộc gọi hay level dễ/khó.
- NẾU KHÔNG: bỏ qua bước này, tiếp tục theo các hướng dẫn bên dưới như bình
  thường.

Bạn đóng vai một khách hàng với hồ sơ sau:
- Tên: {persona.get("name")}
- Độ tuổi: {criteria.get("age")}
- Nghề nghiệp: {criteria.get("occupation")}
- Mức thu nhập: {criteria.get("incomeLevel")}
- Nhu cầu chính: {criteria.get("needs")}
- Nỗi đau / trở ngại: {criteria.get("painPoints")}
- Kỳ vọng khi được tư vấn: {criteria.get("expectations")}
- Rào cản khi ra quyết định: {criteria.get("barriers")}

Tính cách / cách phản ứng trong cuộc gọi (BẮT BUỘC thể hiện rõ qua văn
phong, từ ngữ, độ dài câu trả lời — không chỉ nội dung mà cả GIỌNG ĐIỆU
viết ra phải khớp đúng tính cách này):
{behavior_note or "Phản ứng tự nhiên, trung tính, không có nét tính cách đặc biệt nào."}

Giọng điệu tổng thể: không phải lúc nào khách cũng niềm nở, dễ tính — nếu
tính cách/hoàn cảnh persona ở trên cho thấy đây là người bận rộn, khó tính,
hoài nghi cao hay đang ở 1 level khó, ĐƯỢC PHÉP và NÊN thể hiện rõ sự phiền
phức, khó chịu, mất kiên nhẫn qua giọng điệu (cộc lốc, hỏi vặn, ngắt lời,
thở dài bằng lời...) khi hợp lý — không phải khách nào cũng dễ chịu.

Một nhân viên sales đang gọi điện tư vấn sản phẩm: {product.get("name")} ({product.get("shortDescription")}).

Mục tiêu của level này (để bạn phản ứng đúng ngữ cảnh, KHÔNG đọc lại nguyên văn):
{level.get("winCriteria", "")}

Các phản đối bạn có thể đưa ra nếu hợp lý trong hội thoại:
{objection_lines or "(không có, cứ phản ứng tự nhiên theo persona)"}

Độ dài lời thoại (BẮT BUỘC): customerReply phải NGẮN như một câu nói thật
trong cuộc gọi điện thoại đời thường — 1-2 câu, không quá ~40 từ. TUYỆT ĐỐI
không thuyết trình dài dòng, không liệt kê nhiều ý cùng lúc, không kể lể lại
nguyên văn hay gần nguyên văn các mô tả trong hồ sơ persona (needs,
painPoints, expectations...) như đọc gạch đầu dòng — hồ sơ đó chỉ để bạn HIỂU
nhân vật, không phải nội dung phải nói ra. Không chủ động mớm sẵn quá nhiều
insight/ý định cho sales — để họ phải tự hỏi, tự khai thác.

QUAN TRỌNG NHẤT — bám sát đúng câu vừa nghe, không trả lời theo kịch bản:
- Tin nhắn cuối cùng bạn nhận được (từ nhân viên sales) là câu họ VỪA NÓI XONG. Đọc kỹ câu đó, xác định rõ họ đang làm gì (chào hỏi, hỏi thông tin cụ thể, giới thiệu sản phẩm, xử lý phản đối, chốt đơn...).
- BẮT BUỘC phản hồi TRỰC TIẾP, đúng trọng tâm nội dung/câu hỏi vừa nghe trước tiên, rồi mới thể hiện thêm tính cách/mối bận tâm của persona. Nếu họ hỏi một câu hỏi cụ thể (ví dụ đang dùng sản phẩm/dịch vụ gì, thói quen chi tiêu ra sao, ngân hàng nào...), PHẢI trả lời câu hỏi đó bằng thông tin cụ thể, hợp lý (được phép tự bịa chi tiết nhỏ — tên ngân hàng khác, con số cụ thể... — miễn khớp hồ sơ persona ở trên), TUYỆT ĐỐI không né tránh hay lái sang chủ đề không liên quan.
- KHÔNG được lặp lại một kịch bản cố định bất kể nhân viên nói gì. Mỗi câu trả lời của bạn là phản ứng THẬT với đúng câu vừa nghe — không phải câu tiếp theo trong một kịch bản đã định sẵn từ trước. "Mục tiêu của level" và "các phản đối có thể đưa ra" bên trên chỉ là định hướng ngữ cảnh, không phải lời thoại phải nói ra theo đúng thứ tự.

Thái độ khi sales tư vấn KHÔNG tốt (BẮT BUỘC áp dụng ở MỌI cuộc gọi, không
chỉ tìm cớ kết thúc lịch sự cho có — lưu ý: nếu sales mất bình tĩnh/thiếu
chuyên nghiệp/tỏ thái độ với bạn thì áp dụng "BƯỚC KIỂM TRA BẮT BUỘC" ở đầu
prompt, KHÔNG áp dụng mục này):
- Sales trả lời không rõ ràng / né tránh / chưa thực sự giải đáp đúng nhu
  cầu bạn vừa nêu, NHƯNG nhìn chung vẫn có thiện chí, đang cố hiểu và giúp
  bạn (chỉ là chưa tới nơi): tỏ ý CHƯA HÀI LÒNG ngắn gọn (hỏi lại, nhắc
  đúng ý mình cần), CHO SALES THÊM CƠ HỘI — chưa kết thúc cuộc gọi. Không
  dài dòng, không mớm sẵn ý cho họ.
- Nếu tình trạng "không rõ ràng / không giải đáp / không thoả mãn nhu cầu"
  đó LẶP LẠI dù đã được nhắc, hoặc câu trả lời hoàn toàn lạc đề/qua loa,
  không có thiện chí: BẮT BUỘC thể hiện rõ sự khó chịu — mắng nhẹ hoặc nói
  thẳng kiểu "Thôi dài dòng quá, tôi không có nhu cầu đâu nhé" — rồi CHỦ
  ĐỘNG kết thúc cuộc gọi ngay lúc đó. Đặt shouldEndCall=true,
  endReason="ran_out_of_patience".
- Mức độ "khó tính" khi áp dụng gạch đầu dòng trên tỉ lệ thuận với tính
  cách/độ khó của persona ở mục "Tính cách..." bên trên — persona càng khó
  tính/khó chịu thì càng ít kiên nhẫn, càng dễ mắng và cúp máy sớm hơn.

Quy tắc phản ứng khác:
- Trả lời tự nhiên như một khách hàng thật, không phải trợ lý AI.
- Thể hiện đúng tính cách, mối bận tâm của persona trên — hỏi ngược lại, thể hiện phân vân, so sánh với lựa chọn khác nếu hợp lý.
- Nếu nhân viên tư vấn thuyết phục, đúng trọng tâm nhu cầu — dần thể hiện cởi mở hơn, tiến gần tới quyết định mua. Đặt shouldEndCall=true, endReason="convinced" khi đã đồng ý.
- Nếu nhân viên không đi vào đúng vấn đề của bạn sau nhiều lượt trao đổi một cách ÔN HOÀ (không hẳn tệ, chỉ là chưa thuyết phục), hãy tìm lý do hợp lý để kết thúc cuộc gọi lịch sự (bận việc, cần suy nghĩ thêm, không có nhu cầu...). Đặt shouldEndCall=true, endReason="not_interested". Còn nếu rơi vào các trường hợp ở mục "Thái độ khi sales tư vấn KHÔNG tốt" bên trên thì áp dụng đúng hướng dẫn ở đó (endReason="ran_out_of_patience").
- Cuộc gọi có giới hạn thời gian {roleplay_duration_sec} giây, đã trôi qua {seconds_elapsed} giây — càng gần hết giờ, càng cần nhân viên chốt được vấn đề rõ ràng, nếu không thì bạn chủ động kết thúc.
- customerReply CHỈ chứa lời thoại tự nhiên của khách hàng. Không giải thích, không thoát vai, không thêm ghi chú ngoài lời thoại.

Nhắc lại lần cuối: dù đang vui vẻ, phân vân hay khó chịu/mắng sales, luôn
xưng "tôi", gọi sales là "bạn" — không đổi sang đại từ nào khác."""


def history_to_messages(history: list[dict]) -> list:
    """role='customer' (the persona this agent plays) -> AIMessage.
    role='seller' (the trainee) -> HumanMessage, from the model's point of view."""
    messages = []
    for turn in history:
        if turn.get("role") == "customer":
            messages.append(AIMessage(content=turn.get("text", "")))
        else:
            messages.append(HumanMessage(content=turn.get("text", "")))
    return messages


# Default rubric text — matches sales-skill-scoring-rubric.md §5 (the
# "sẵn sàng dán vào prompt" 6-criteria block already confirmed in SPEC.md).
# Callers may override this via the optional `rubric` field in POST /score
# so the criteria descriptions can be tweaked without redeploying — the
# 6 score keys themselves stay fixed (ScoringOutput), only their prose
# description here is swappable.
DEFAULT_SCORING_RUBRIC = """Chấm theo 6 tiêu chí, thang điểm từ 0-100 cho mỗi tiêu chí, ĐỘC LẬP với nhau
(không cộng dồn thành 100 tổng):

1. customer_understanding_score - Hiểu khách hàng: có khai thác và hiểu đúng
   bối cảnh, nhu cầu, mục tiêu, mối quan tâm thực sự của khách hàng không.
2. knowledge_score - Kiến thức sản phẩm: cung cấp thông tin chính xác, đầy
   đủ, phù hợp nhu cầu khách hàng, không sai lệch.
3. communication_score - Kỹ năng giao tiếp & thái độ: giọng điệu, sự đồng
   cảm, khả năng lắng nghe và phản hồi, mức độ chuyên nghiệp.
4. objection_handling_score - Xử lý từ chối: nhận diện đúng lý do phía sau
   sự từ chối, phản hồi đúng trọng tâm, tự nhiên, không gây áp lực.
5. insight_discovery_score - Khai thác nhu cầu / Insight: chất lượng câu hỏi
   mở, khả năng đào sâu, tìm ra insight/động cơ thực sự. Không đánh giá cao
   việc chỉ đặt câu hỏi đóng dạng có/không.
6. closing_score - Kỹ năng chốt sale: nhận biết thời điểm phù hợp, tóm tắt
   giá trị, đưa ra lời đề nghị hành động rõ ràng, không để hội thoại kết
   thúc mập mờ.

Đồng thời chỉ ra:
- strengths: 2-3 điểm mạnh cụ thể, dựa trên hành vi/câu nói thực tế trong
  transcript. Không nhận xét chung chung.
- improvements: 2-3 điểm cần cải thiện cụ thể, kèm gợi ý ngắn cách xử lý
  tốt hơn.
- next_level_suggestion: đề xuất 1 nội dung nên luyện tập tiếp theo, dựa
  trên điểm yếu ảnh hưởng lớn nhất đến hiệu quả cuộc hội thoại.
- turn_feedback: chấm TỪNG lượt nói của nhân viên sales (role="seller") —
  KHÔNG bỏ sót lượt nào, kể cả lượt tốt. Với mỗi lượt tại index i:
  - is_good=true nếu đây là 1 phản hồi tốt (không cần comment).
  - is_good=false nếu câu trả lời chưa tối ưu — PHẢI kèm comment giải thích
    dựa trên ĐÚNG câu nói của khách ở index (i - 1) — dòng NGAY TRƯỚC lượt
    i, xác định bằng số thứ tự index chứ không phải suy đoán theo ngữ nghĩa
    — cùng bối cảnh hội thoại từ đầu tới đó và tính cách/hoàn cảnh của
    khách hàng này: khách ở dòng (i - 1) thực sự đang muốn nói gì, vì sao
    cách trả lời của sales ở lượt i chưa tốt, và đúng ra nên nói/hỏi gì.
    TUYỆT ĐỐI KHÔNG được dùng nội dung khách nói ở các dòng SAU lượt i
    (index > i) để phân tích lượt i — tại thời điểm lượt i diễn ra, nhân
    viên sales chưa nghe được những gì khách nói sau đó. Ví dụ văn phong
    mong muốn: "Phần này khách đã nêu rõ nỗi đau của họ, thay vì hỏi 1 câu
    hỏi đóng 'có muốn không' bạn nên chủ động giới thiệu sản phẩm và những
    lợi ích mang lại và mời khách trải nghiệm trực tiếp." Ngắn gọn (1-2
    câu) nhưng đủ ý, không nhận xét chung chung."""


def build_scoring_prompt(product: dict, transcript: list[dict], rubric: Optional[str] = None) -> str:
    transcript_lines = "\n".join(
        f'[{i}] {"Khách hàng" if t.get("role") == "customer" else "Nhân viên sales"}: {t.get("text")}'
        for i, t in enumerate(transcript)
    )
    seller_indices = [i for i, t in enumerate(transcript) if t.get("role") != "customer"]
    key_points = "\n".join(f"- {p}" for p in product.get("keySellingPoints", []))
    rubric_text = rubric.strip() if rubric and rubric.strip() else DEFAULT_SCORING_RUBRIC
    return f"""Bạn là chuyên gia đào tạo sales ngân hàng. Dưới đây là transcript của một
cuộc gọi role-play giữa nhân viên sales và khách hàng (khách hàng do AI đóng
vai để luyện tập). Mỗi dòng có sẵn index [n] — dùng ĐÚNG các index này khi
điền turn_index trong turn_feedback.

QUAN TRỌNG VỀ NGỮ CẢNH: khi viết comment cho lượt seller tại index i, CHỈ
được đọc và dùng nội dung transcript từ index 0 tới (i - 1) — đúng những gì
ĐÃ xảy ra trước lượt i, đặc biệt là câu khách nói ở index (i - 1). TUYỆT ĐỐI
KHÔNG được đọc/dùng nội dung ở index LỚN HƠN i (những gì khách nói SAU lượt
i) để giải thích/phân tích lượt i — tại thời điểm nhân viên sales nói lượt
i, họ chưa hề nghe được những gì khách sẽ nói tiếp theo, nên comment dựa
trên nội dung sau đó là SAI hoàn toàn về mặt logic thời gian.

QUAN TRỌNG: Toàn bộ nội dung text bạn viết ra (strengths, improvements,
next_level_suggestion, comment trong turn_feedback...) PHẢI viết bằng tiếng
Việt 100% — tuyệt đối không chêm từ/cụm từ tiếng Anh, tiếng Trung hay bất kỳ
ngôn ngữ nào khác vào giữa câu. Kể cả khi nhắc tên 1 kỹ năng/phương pháp có
gốc tiếng Anh, PHẢI dịch hẳn sang tiếng Việt, KHÔNG chú thích thêm tên gốc
tiếng Anh trong ngoặc đơn. Ví dụ SAI: "lắng nghe chủ động (Active
Listening)", "phương pháp LARA (Listen - Acknowledge - Respond - Ask)".
Ví dụ ĐÚNG: "lắng nghe chủ động", "phương pháp lắng nghe - ghi nhận - phản
hồi - đặt câu hỏi".

Sản phẩm đang tư vấn: {product.get("name")} — {product.get("shortDescription", "")}
Điểm bán chính cần thể hiện:
{key_points}

Transcript:
{transcript_lines}

Các index thuộc về nhân viên sales (role="seller"), PHẢI có đủ turn_feedback
cho từng index này, không thiếu không thừa: {seller_indices}

Hãy đánh giá nhân viên sales dựa trên toàn bộ cuộc hội thoại với khách hàng.
{rubric_text}"""


PERSONA_CRITERIA_LABELS = {
    "age": "Tuổi",
    "gender": "Giới tính",
    "occupation": "Nghề nghiệp",
    "income": "Thu nhập",
    "region": "Khu vực",
    "needs": "Nhu cầu / Mục tiêu",
    "behavior": "Hành vi hiện tại",
    "painPoints": "Pain points",
    "expectations": "Kỳ vọng",
    "motivation": "Động lực",
    "barrier": "Rào cản",
}


def build_persona_criteria_prompt(criteria: dict) -> str:
    lines = []
    for key, label in PERSONA_CRITERIA_LABELS.items():
        value = criteria.get(key)
        if isinstance(value, list):
            value = ", ".join(v for v in value if v)
        if not value:
            continue
        lines.append(f"- {label}: {value}")
    criteria_block = "\n".join(lines) if lines else (
        "(người dùng không chọn tiêu chí cụ thể nào — tự sáng tạo 1 khách "
        "hàng cá nhân hợp lý cho ngành ngân hàng bán lẻ)"
    )

    intro = f"""Bạn là chuyên gia thiết kế kịch bản luyện tập (role-play) cho nhân viên
sales ngân hàng bán lẻ (RB) tại Việt Nam.

Người dùng (nhân viên sales) đã chọn các tiêu chí sau để mô tả 1 khách hàng
họ muốn luyện tập cùng — đây CHỈ LÀ GỢI Ý (có thể là 1 khoảng, vd "26–30
tuổi", hoặc nhiều lựa chọn cùng lúc), bạn cần TỰ QUYẾT ĐỊNH 1 giá trị cụ
thể, nhất quán, hợp lý (vd chọn đúng 1 số tuổi cụ thể trong khoảng đã chọn):

{criteria_block}

Nhiệm vụ: tạo 1 chân dung khách hàng cụ thể (bịa tên, số liệu hợp lý nếu
tiêu chí chưa đủ chi tiết) VÀ cấu hình cho 1 buổi role-play gọi điện tư vấn,
trong đó AI sẽ đóng vai CHÍNH khách hàng này khi luyện tập với nhân viên
sales.

1. name: tên đầy đủ tiếng Việt hợp lý, khớp giới tính.
2. age: 1 số tuổi cụ thể, hợp lý trong khoảng đã chọn (nếu có).
3. gender: "Nam" hoặc "Nữ" — nếu người dùng chọn "Không muốn xác định"/
   "Khác"/không chọn, tự quyết định 1 giá trị hợp lý.
4. occupation, incomeText, region: cụ thể hoá đúng tiêu chí đã chọn (nếu
   có), hoặc tự tạo hợp lý nếu chưa chọn.
5. needs, currentBehavior, painPoints, expectations, motivation, barrier:
   viết thành câu/đoạn tự nhiên (KHÔNG liệt kê thô lại các lựa chọn), tổng
   hợp đúng các tiêu chí đã chọn ở trên (nếu có) — nếu thiếu, tự bổ sung
   hợp lý, nhất quán với phần còn lại của hồ sơ.
6. difficulty: đánh giá độ khó tư vấn khách hàng này, suy từ TOÀN BỘ hồ sơ
   vừa tạo (nghề nghiệp, thu nhập, pain points, hành vi...). Ví dụ: sinh
   viên/nhân viên trẻ mới đi làm thường "De"; chủ doanh nghiệp/giám đốc/
   khách hoài nghi cao thường "Kho" hoặc "RatKho".
7. behaviorNote: mô tả CÁCH khách hàng này phản ứng/nói chuyện trong cuộc
   gọi (giọng điệu, mức độ khó tính, tốc độ ra quyết định...) — PHẢI khớp
   đúng difficulty vừa chọn và khớp nghề nghiệp/hoàn cảnh cụ thể của khách.
   2-3 câu, cụ thể, không chung chung.
8. openingLine: câu đầu tiên khách hàng nói khi vừa nhấc máy nghe điện
   thoại sales gọi tới — ngắn gọn, tự nhiên, đúng tính cách.
9. winCriteria: tiêu chí cụ thể để coi là nhân viên sales đã tư vấn thành
   công trong đúng tình huống của khách hàng này.
10. objectionBank: 2-4 câu phản đối/nghi ngại cụ thể mà khách hàng này CÓ
    THỂ đưa ra (trigger), kèm hướng xử lý gợi ý cho nhân viên (guidance) —
    bám sát đúng painPoints/rào cản/kỳ vọng ở trên.
11. product: sản phẩm/giải pháp ngân hàng phù hợp NHẤT để tư vấn đúng nhu
    cầu của khách hàng này — name (ngắn gọn), shortDescription (1-2 câu),
    keySellingPoints (3-4 điểm bán chính cụ thể)."""

    schema = (
        '\n\nTrả về CHỈ MỘT JSON object, không thêm text hay markdown nào khác, '
        'đúng format sau: {"name": string, "age": number, "gender": "Nam"|"Nữ", '
        '"occupation": string, "incomeText": string, "region": string, "needs": string, '
        '"currentBehavior": string, "painPoints": string, "expectations": string, '
        '"motivation": string, "barrier": string, "difficulty": "De"|"TrungBinh"|"Kho"|"RatKho", '
        '"behaviorNote": string, "openingLine": string, "winCriteria": string, '
        '"objectionBank": [{"trigger": string, "guidance": string}, ...2-4 phần tử], '
        '"product": {"name": string, "shortDescription": string, "keySellingPoints": [string, ...3-4 phần tử]}}'
    )
    return intro + schema


def build_quiz_prompt(product: dict, persona: dict, level: dict) -> str:
    """Port từ buildPrompt() trong scripts/generateQuizBank.mts — giữ
    NGUYÊN VĂN nội dung prompt để văn phong 5 câu hỏi mới sinh nhất quán
    với 125 câu đã duyệt trước đó."""
    criteria = persona.get("criteria", {})
    key_selling_points = "\n".join(f"- {p}" for p in product.get("keySellingPoints", []))
    product_objections = "\n".join(
        f'- Hỏi: "{o.get("question")}" -> Trả lời chuẩn: {o.get("sampleAnswer")}' for o in product.get("objectionBank", [])
    )
    level_objections = "\n".join(
        f'- "{o.get("trigger")}" -> {o.get("guidance")}' for o in level.get("objectionBank", [])
    ) or "(không có)"

    return f"""Bạn là chuyên gia đào tạo sales ngân hàng, soạn câu hỏi trắc nghiệm kiểm
tra kiến thức sản phẩm cho nhân viên TRƯỚC KHI họ luyện tập role-play gọi
điện tư vấn khách hàng.

Sản phẩm: {product.get("name")} — {product.get("shortDescription")}
Điều kiện cơ bản: {product.get("basicConditions")}
Đối tượng khách hàng trong tình huống này: {persona.get("name")}, {criteria.get("occupation")}, {criteria.get("age")} tuổi.

Key selling points cần nhân viên nắm chắc:
{key_selling_points}

Objection bank của sản phẩm (câu hỏi khách hay hỏi + câu trả lời chuẩn):
{product_objections}

Objection bank riêng của tình huống này:
{level_objections}

Soạn ĐÚNG 5 câu hỏi trắc nghiệm tiếng Việt, kiểm tra trực tiếp kiến thức
sản phẩm và cách xử lý phản đối ở trên (không hỏi chung chung ngoài phạm vi
những gì liệt kê). Mỗi câu có ĐÚNG 4 phương án, chỉ 1 phương án đúng, kèm
giải thích ngắn gọn (1-2 câu) sau khi trả lời."""


def build_level_script_prompt(product: dict, persona: dict) -> str:
    """Sinh kịch bản role-play (openingLine/sampleFlow/objectionBank/
    winCriteria) cho 1 level mới hoặc sinh lại — bám đúng cấu trúc/văn
    phong docs/roleplay-scenarios.md (mở đầu khách nói / kịch bản mẫu /
    objection bank / tiêu chí chốt)."""
    criteria = persona.get("criteria", {})
    key_selling_points = ", ".join(product.get("keySellingPoints", []))
    return f"""Bạn là chuyên gia thiết kế kịch bản luyện tập (role-play) cho nhân viên
sales ngân hàng bán lẻ tại Việt Nam.

Thiết kế 1 tình huống role-play cụ thể: nhân viên sales gọi điện tư vấn
sản phẩm "{product.get("name")}" ({product.get("shortDescription")}) cho
khách hàng thuộc phân khúc "{persona.get("name")}":
- Độ tuổi: {criteria.get("age")}
- Nghề nghiệp: {criteria.get("occupation")}
- Mức thu nhập: {criteria.get("incomeLevel")}
- Nhu cầu chính: {criteria.get("needs")}
- Nỗi đau / trở ngại: {criteria.get("painPoints")}
- Kỳ vọng khi được tư vấn: {criteria.get("expectations")}
- Rào cản khi ra quyết định: {criteria.get("barriers")}
- Cách phản ứng trong role-play: {persona.get("behaviorNote")}

Điều kiện cơ bản của sản phẩm: {product.get("basicConditions")}
Key selling points: {key_selling_points}

Soạn:
1. opening_line: câu ĐẦU TIÊN khách hàng nói khi vừa nhấc máy nghe điện
   thoại sales gọi tới — ngắn gọn, tự nhiên, thể hiện đúng nỗi lo/rào cản
   của phân khúc khách hàng này với sản phẩm này.
2. sample_flow: 3-5 bước gợi ý xử lý tình huống cho nhân viên sales (KHÔNG
   phải lời thoại bắt buộc, chỉ là định hướng cách tiếp cận), theo đúng
   chiến thuật chung của phân khúc: {persona.get("generalTactic")}
3. objection_bank: 2-3 cặp phản đối cụ thể (trigger) mà khách hàng NÀY có
   thể đưa ra khi được tư vấn sản phẩm NÀY, kèm hướng xử lý gợi ý
   (guidance) — bám sát đúng painPoints/rào cản ở trên, khác với objection
   bank chung của sản phẩm.
4. win_criteria: tiêu chí cụ thể để coi là nhân viên sales đã tư vấn thành
   công trong đúng tình huống này, dựa trên: {persona.get("winCondition")}

Toàn bộ nội dung viết bằng tiếng Việt tự nhiên, cụ thể, không chung chung."""


# --- Route handlers ---


def strip_strings_deep(value):
    """Recursively trim leading/trailing whitespace on every string in a
    dict/list — the LLM occasionally emits trailing "\\n    " artifacts
    (copied indentation from its own tool-call arguments) inside field
    values via structured/function-calling output."""
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, list):
        return [strip_strings_deep(v) for v in value]
    if isinstance(value, dict):
        return {k: strip_strings_deep(v) for k, v in value.items()}
    return value


def strip_json_fences(text: str) -> str:
    """Best-effort cleanup for a raw LLM completion that wraps JSON in a
    ```json ... ``` code fence or adds stray text around it."""
    text = text.strip()
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text


# Vùng ký tự Hán tự (CJK Unified Ideographs + phần mở rộng thường gặp) —
# dùng để phát hiện tiếng Trung lẫn vào output, dù prompt đã yêu cầu tiếng
# Việt 100% (xem CẢNH BÁO trong build_scoring_prompt + Field description
# TurnFeedback.comment) — best-effort ở tầng prompt vẫn thỉnh thoảng bị bỏ
# qua, nên thêm 1 lớp kiểm tra + sửa lại quyết định ở đây thay vì chỉ tin
# vào prompt.
CJK_PATTERN = re.compile(r"[一-鿿㐀-䶿豈-﫿]")


def _scoring_texts(result: "ScoringOutput") -> list[str]:
    texts = list(result.strengths) + list(result.improvements) + [result.next_level_suggestion]
    texts += [tf.comment for tf in result.turn_feedback if tf.comment]
    return texts


def _has_cjk(result: "ScoringOutput") -> bool:
    return any(CJK_PATTERN.search(t) for t in _scoring_texts(result) if t)


def _strip_cjk_from_scoring(result: "ScoringOutput") -> "ScoringOutput":
    result.strengths = [CJK_PATTERN.sub("", s) for s in result.strengths]
    result.improvements = [CJK_PATTERN.sub("", s) for s in result.improvements]
    result.next_level_suggestion = CJK_PATTERN.sub("", result.next_level_suggestion)
    for tf in result.turn_feedback:
        if tf.comment:
            tf.comment = CJK_PATTERN.sub("", tf.comment)
    return result


async def ensure_scoring_is_vietnamese_only(result: "ScoringOutput", prompt: str) -> "ScoringOutput":
    """Best-effort guardrail: model đôi khi vẫn chêm tiếng Trung dù prompt đã
    yêu cầu tiếng Việt 100% (xem phản hồi người dùng, 2026-09-07) — thử sinh
    lại 1 lần với cảnh báo mạnh hơn; nếu vẫn còn thì cắt bỏ hẳn ký tự Hán tự
    khỏi kết quả thay vì để lọt ra màn Kết quả."""
    if not _has_cjk(result):
        return result
    app.logger.warning("scoring output contains CJK characters, retrying with stronger correction")
    try:
        corrective_prompt = (
            prompt
            + "\n\n[CẢNH BÁO] Ở lần trả lời trước, bạn đã chêm ký tự tiếng Trung/Hán tự vào câu "
            "trả lời — đây là lỗi NGHIÊM TRỌNG, không được lặp lại. Lần này viết lại TOÀN BỘ nội "
            "dung text CHỈ bằng chữ cái tiếng Việt (bảng chữ Latin có dấu thanh), TUYỆT ĐỐI không "
            "dùng bất kỳ ký tự Hán tự/Kanji/Trung Quốc nào, kể cả 1 chữ."
        )
        retry_result = await invoke_structured_with_retry(
            scoring_llm_structured, [HumanMessage(content=corrective_prompt)], attempts=1
        )
        return retry_result if not _has_cjk(retry_result) else _strip_cjk_from_scoring(retry_result)
    except Exception:
        app.logger.exception("CJK-correction retry failed, stripping CJK chars from original result")
        return _strip_cjk_from_scoring(result)


ROLEPLAY_FALLBACK_REPLY = {
    # Lý do hợp lý cho 1 cuộc gọi điện thoại thật (không phải cuộc gọi
    # internet) — "mạng chập chờn" không hợp lý cho sales gọi qua số điện
    # thoại, xem phản hồi người dùng.
    "customerReply": "Alo, bạn nói lại được không, mình chưa nghe rõ.",
    "emotion": "curious",
    "shouldEndCall": False,
    "endReason": None,
}

STRUCTURED_CALL_ATTEMPTS = 2


async def invoke_structured_with_retry(structured_llm, messages, attempts: int = STRUCTURED_CALL_ATTEMPTS):
    """Gọi 1 LLM đã bọc with_structured_output(method="function_calling"),
    thử lại tối đa `attempts` lần nếu model không trả về tool call hợp lệ.

    Log thực tế trên runtime (2026-09) cho thấy phần lớn lần rơi xuống
    fallback "Alo, bạn nói lại được không..."/lỗi chấm điểm là do
    provider thỉnh thoảng trả về completion RỖNG (result=None, hoặc raw
    content='' khiến JSONDecodeError ở fallback JSON thô) — không phải lỗi
    logic hay timeout thật sự. Thử lại 1 lần thường qua ngay, giảm đáng kể
    tần suất phải rơi xuống fallback.
    """
    last_error: Exception = ValueError("invoke_structured_with_retry: no attempts made")
    for attempt in range(attempts):
        try:
            result = await structured_llm.ainvoke(messages)
            if result is None:
                raise ValueError("LLM không trả về tool call hợp lệ (kết quả rỗng)")
            return result
        except Exception as e:
            last_error = e
            app.logger.exception(f"structured call failed (attempt {attempt + 1}/{attempts})")
    raise last_error


async def roleplay_handler(request: Request) -> JSONResponse:
    try:
        body = await request.json()
        persona = body["persona"]
        product = body["product"]
        level = body["level"]
        roleplay_duration_sec = body.get("roleplayDurationSec", 150)
        seconds_elapsed = body.get("secondsElapsed", 0)
        history = body.get("history", [])
        seller_utterance = body["sellerUtterance"]
    except (KeyError, ValueError) as e:
        return JSONResponse({"error": f"Invalid request body: missing/malformed field {e}"}, status_code=400)

    system_prompt = build_roleplay_system_prompt(persona, product, level, roleplay_duration_sec, seconds_elapsed)

    # Opening turn: app calls this with sellerUtterance="" and history=[]
    # right when the screen loads, before the seller has said anything, so
    # the customer answers the phone first (see SPEC.md).
    is_opening_turn = not history and not seller_utterance.strip()
    if is_opening_turn:
        system_prompt += (
            "\n\nLƯU Ý ĐẶC BIỆT: Đây là lượt mở đầu cuộc gọi — điện thoại vừa reo và "
            "bạn (khách hàng) vừa nhấc máy, CHƯA nghe nhân viên sales nói gì. Hãy chủ "
            "động mở lời trước theo đúng tính cách persona, ví dụ 'Alô, ai đấy ạ?' hoặc "
            "tương tự — ngắn gọn, tự nhiên như một người thật vừa bắt máy."
        )
        opening_messages = [SystemMessage(content=system_prompt), HumanMessage(content="(Điện thoại vừa reo, bạn vừa nhấc máy.)")]
        messages = opening_messages
    else:
        messages = [SystemMessage(content=system_prompt), *history_to_messages(history), HumanMessage(content=seller_utterance)]

    try:
        # Primary path: tool-calling structured output — the LLM never emits
        # raw text here, so there's no JSON/markdown to clean up. Thử lại
        # vài lần trước khi rơi xuống fallback (xem invoke_structured_with_retry).
        result: RoleplayLLMOutput = await invoke_structured_with_retry(roleplay_llm_structured, messages)
        response = result.model_dump()
    except Exception:
        app.logger.exception("structured roleplay call failed after retries, falling back to raw JSON parse")
        try:
            # Fallback path: plain completion, in case the model didn't
            # produce a tool call. Strip code fences before parsing since a
            # raw completion may wrap the JSON in ```json ... ```.
            fallback_messages = [
                SystemMessage(
                    content=system_prompt
                    + '\n\nTrả lời DUY NHẤT một JSON object hợp lệ theo schema sau, không thêm text hay markdown nào khác: '
                    '{"customerReply": string, "emotion": "curious"|"skeptical"|"warming_up"|"satisfied"|"annoyed"|"ending_call", '
                    '"shouldEndCall": boolean, "endReason": "convinced"|"not_interested"|"ran_out_of_patience"|null}'
                ),
                *(messages[1:]),
            ]
            raw = await llm_roleplay.ainvoke(fallback_messages)
            if not raw.content or not raw.content.strip():
                raise ValueError("LLM trả về content rỗng")
            parsed = json.loads(strip_json_fences(raw.content))
            response = RoleplayLLMOutput.model_validate(parsed).model_dump()
        except Exception:
            # Timed, live call — never hard-fail the mobile app mid-conversation.
            app.logger.exception("raw JSON fallback also failed")
            response = dict(ROLEPLAY_FALLBACK_REPLY)

    # Deterministic safety net: don't rely solely on the LLM noticing the
    # clock ran out — force the call to end once the time limit is hit.
    if seconds_elapsed >= roleplay_duration_sec:
        response["shouldEndCall"] = True

    # The model sometimes sets shouldEndCall=true (e.g. seller was rude —
    # see the "BƯỚC KIỂM TRA BẮT BUỘC" gate in the system prompt) but
    # forgets to also fill endReason. Never leave it null when the call is
    # ending for a reason other than the customer agreeing — default to
    # "ran_out_of_patience" rather than surface a null the app doesn't expect.
    if response.get("shouldEndCall") and not response.get("endReason"):
        response["endReason"] = "ran_out_of_patience"

    response["hintForSeller"] = None  # v1: always null, see SPEC.md
    return JSONResponse(response)


async def score_handler(request: Request) -> JSONResponse:
    try:
        body = await request.json()
        product = body["product"]
        transcript = body["transcript"]
        rubric = body.get("rubric")  # optional free-text override, see SPEC.md
    except (KeyError, ValueError) as e:
        return JSONResponse({"error": f"Invalid request body: missing/malformed field {e}"}, status_code=400)

    prompt = build_scoring_prompt(product, transcript, rubric)

    try:
        # Primary path: tool-calling structured output.
        result: ScoringOutput = await invoke_structured_with_retry(scoring_llm_structured, [HumanMessage(content=prompt)])
        result = await ensure_scoring_is_vietnamese_only(result, prompt)
        return JSONResponse(strip_strings_deep(result.model_dump()))
    except Exception:
        app.logger.exception("structured scoring call failed after retries, falling back to raw JSON parse")

    try:
        # Fallback path: plain completion, in case the model didn't produce
        # a tool call. Strip code fences before parsing since a raw
        # completion may wrap the JSON in ```json ... ```.
        raw = await llm_scoring.ainvoke([HumanMessage(
            content=prompt
            + '\n\nTrả lời DUY NHẤT một JSON object hợp lệ theo schema sau, không thêm text hay markdown nào khác: '
            '{"customer_understanding_score": number, "knowledge_score": number, "communication_score": number, '
            '"objection_handling_score": number, "insight_discovery_score": number, "closing_score": number, '
            '"strengths": string[], "improvements": string[], "next_level_suggestion": string, '
            '"turn_feedback": [{"turn_index": number, "is_good": boolean, "comment": string|null}, ...]}'
        )])
        if not raw.content or not raw.content.strip():
            raise ValueError("LLM trả về content rỗng")
        parsed = json.loads(strip_json_fences(raw.content))
        result = ScoringOutput.model_validate(parsed)
        result = await ensure_scoring_is_vietnamese_only(result, prompt)
        return JSONResponse(strip_strings_deep(result.model_dump()))
    except Exception:
        # No safe default score to fabricate here (unlike roleplay's
        # live-call apology fallback) — surface the failure so the app can
        # retry rather than showing the seller a made-up score.
        app.logger.exception("raw JSON fallback also failed")
        return JSONResponse({"error": "Scoring failed — LLM call error. Please retry."}, status_code=502)


async def generate_persona_handler(request: Request) -> JSONResponse:
    try:
        body = await request.json()
        criteria = body.get("criteria") or {}
    except ValueError as e:
        return JSONResponse({"error": f"Invalid request body: {e}"}, status_code=400)

    prompt = build_persona_criteria_prompt(criteria)

    try:
        # Primary path: tool-calling structured output.
        result: GeneratedPersonaOutput = await invoke_structured_with_retry(persona_llm_structured, [HumanMessage(content=prompt)])
        return JSONResponse(strip_strings_deep(result.model_dump()))
    except Exception:
        app.logger.exception("structured persona generation failed after retries, falling back to raw JSON parse")

    try:
        # Fallback path: plain completion, in case the model didn't produce
        # a tool call. Strip code fences before parsing since a raw
        # completion may wrap the JSON in ```json ... ```.
        raw = await llm_persona.ainvoke([HumanMessage(
            content=prompt
            + '\n\nTrả lời DUY NHẤT một JSON object hợp lệ theo đúng schema trên, không thêm text hay markdown nào khác.'
        )])
        if not raw.content or not raw.content.strip():
            raise ValueError("LLM trả về content rỗng")
        parsed = json.loads(strip_json_fences(raw.content))
        result = GeneratedPersonaOutput.model_validate(parsed)
        return JSONResponse(strip_strings_deep(result.model_dump()))
    except Exception:
        # Không có fallback "mặc định" hợp lý để bịa ra ở đây (khác
        # roleplay's live-call apology) — để app biết mà báo lỗi/thử lại.
        app.logger.exception("raw JSON fallback also failed")
        return JSONResponse({"error": "Persona generation failed — LLM call error. Please retry."}, status_code=502)


async def generate_level_script(product: dict, persona: dict) -> GeneratedLevelScript:
    prompt = build_level_script_prompt(product, persona)
    try:
        result: GeneratedLevelScript = await invoke_structured_with_retry(level_script_llm_structured, [HumanMessage(content=prompt)])
        return result
    except Exception:
        app.logger.exception("structured level-script generation failed after retries, falling back to raw JSON parse")
        raw = await llm_content.ainvoke([HumanMessage(
            content=prompt
            + '\n\nTrả lời DUY NHẤT một JSON object hợp lệ theo schema sau, không thêm text hay markdown nào khác: '
            '{"opening_line": string, "sample_flow": string[], '
            '"objection_bank": [{"trigger": string, "guidance": string}, ...2-3 phần tử], "win_criteria": string}'
        )])
        if not raw.content or not raw.content.strip():
            raise ValueError("LLM trả về content rỗng")
        parsed = json.loads(strip_json_fences(raw.content))
        return GeneratedLevelScript.model_validate(parsed)


async def generate_quiz(product: dict, persona: dict, level: dict) -> GeneratedQuizBank:
    prompt = build_quiz_prompt(product, persona, level)
    try:
        result: GeneratedQuizBank = await invoke_structured_with_retry(quiz_llm_structured, [HumanMessage(content=prompt)])
        return result
    except Exception:
        app.logger.exception("structured quiz generation failed after retries, falling back to raw JSON parse")
        raw = await llm_content.ainvoke([HumanMessage(
            content=prompt
            + '\n\nTrả lời DUY NHẤT một JSON object hợp lệ theo schema sau, không thêm text hay markdown nào khác: '
            '{"questions": [{"question": string, "options": [string,string,string,string], '
            '"correct_index": 0|1|2|3, "explanation": string}, ...đúng 5 phần tử]}'
        )])
        if not raw.content or not raw.content.strip():
            raise ValueError("LLM trả về content rỗng")
        parsed = json.loads(strip_json_fences(raw.content))
        return GeneratedQuizBank.model_validate(parsed)


LETTERS = ["A", "B", "C", "D"]


async def regenerate_level(client: httpx.AsyncClient, product: dict, persona: dict) -> str:
    """Sinh lại (hoặc sinh mới) 1 level = tổ hợp (persona, product): gọi LLM
    tạo kịch bản role-play rồi quiz 5 câu dựa trên kịch bản đó, upsert cả 2
    bảng levels/quiz_questions. Trả về level_id vừa xử lý.

    Cố ý KHÔNG đưa is_final_boss vào payload upsert — upsert dùng
    "resolution=merge-duplicates" chỉ SET đúng các cột có mặt trong JSON, nên
    bỏ qua field này giữ nguyên giá trị cũ nếu level đã tồn tại (vd level
    "5.5" - boss cuối - không bị mất cờ isFinalBoss khi sinh lại), còn level
    mới thì nhận default false của cột.
    """
    level_id = f"{persona['chapterNumber']}.{product['order']}"
    script = await generate_level_script(product, persona)
    level_for_quiz = {"objectionBank": [o.model_dump() for o in script.objection_bank]}
    quiz = await generate_quiz(product, persona, level_for_quiz)

    now = datetime.now(timezone.utc).isoformat()
    level_row = {
        "id": level_id,
        "chapter_number": persona["chapterNumber"],
        "persona_id": persona["id"],
        "product_id": product["id"],
        "star_rating": float(persona["starRating"]),
        "opening_line": script.opening_line,
        "sample_flow": script.sample_flow,
        "objection_bank": [o.model_dump() for o in script.objection_bank],
        "win_criteria": script.win_criteria,
        "updated_at": now,
    }
    await supabase_upsert(client, "levels", [level_row], on_conflict="id")

    quiz_rows = [
        {
            "level_id": level_id,
            "question_order": i + 1,
            "question": q.question,
            "options": [{"id": LETTERS[idx], "text": text} for idx, text in enumerate(q.options)],
            "correct_option_id": LETTERS[q.correct_index],
            "explanation": q.explanation,
        }
        for i, q in enumerate(quiz.questions)
    ]
    await supabase_upsert(client, "quiz_questions", quiz_rows, on_conflict="level_id,question_order")

    return level_id


async def admin_save_product_handler(request: Request) -> JSONResponse:
    try:
        await verify_admin(request)
    except AdminAuthError as e:
        return JSONResponse({"error": e.message}, status_code=e.status_code)

    try:
        body = await request.json()
        product_id = body["id"]
        is_new = bool(body.get("isNew"))
        name = body["name"]
        short_description = body["shortDescription"]
        target_audience = body["targetAudience"]
        basic_conditions = body["basicConditions"]
    except (KeyError, ValueError) as e:
        return JSONResponse({"error": f"Invalid request body: missing/malformed field {e}"}, status_code=400)

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            if is_new:
                existing = await supabase_select(client, "products", {"select": "order_num", "order": "order_num.desc", "limit": "1"})
                order_num = (existing[0]["order_num"] + 1) if existing else 1
            else:
                current = await supabase_select(client, "products", {"id": f"eq.{product_id}", "select": "order_num"})
                if not current:
                    return JSONResponse({"error": f"Không tìm thấy sản phẩm '{product_id}'."}, status_code=404)
                order_num = current[0]["order_num"]

            product_row = {
                "id": product_id,
                "order_num": order_num,
                "name": name,
                "short_name": body.get("shortName"),
                "short_description": short_description,
                "target_audience": target_audience,
                "benefits": body.get("benefits", []),
                "basic_conditions": basic_conditions,
                "key_selling_points": body.get("keySellingPoints", []),
                "objection_bank": body.get("objectionBank", []),
                "compliance_note": body.get("complianceNote"),
                "is_hidden": bool(body.get("isHidden", False)),
                "hidden_chapter_numbers": body.get("hiddenChapterNumbers", []),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
            await supabase_upsert(client, "products", [product_row], on_conflict="id")
            product_dict = db_row_to_product(product_row)

            if is_new:
                apply_to_chapter_numbers = body.get("applyToChapterNumbers", [])
                if apply_to_chapter_numbers:
                    in_list = ",".join(str(int(n)) for n in apply_to_chapter_numbers)
                    persona_rows = await supabase_select(client, "personas", {"chapter_number": f"in.({in_list})", "select": "*"})
                else:
                    persona_rows = []
            else:
                existing_levels = await supabase_select(client, "levels", {"product_id": f"eq.{product_id}", "select": "persona_id"})
                persona_ids = sorted({lv["persona_id"] for lv in existing_levels})
                if persona_ids:
                    in_list = ",".join(persona_ids)
                    persona_rows = await supabase_select(client, "personas", {"id": f"in.({in_list})", "select": "*"})
                else:
                    persona_rows = []

            affected_level_ids: list[str] = []
            for persona_row in persona_rows:
                persona_dict = db_row_to_persona(persona_row)
                level_id = await regenerate_level(client, product_dict, persona_dict)
                affected_level_ids.append(level_id)
    except RuntimeError as e:
        app.logger.exception("admin_save_product_handler failed")
        return JSONResponse({"error": str(e)}, status_code=502)

    return JSONResponse({"productId": product_id, "affectedLevelIds": affected_level_ids})


async def admin_save_persona_handler(request: Request) -> JSONResponse:
    try:
        await verify_admin(request)
    except AdminAuthError as e:
        return JSONResponse({"error": e.message}, status_code=e.status_code)

    try:
        body = await request.json()
        persona_id = body["id"]
        is_new = bool(body.get("isNew"))
        name = body["name"]
        criteria = body["criteria"]
        behavior_note = body["behaviorNote"]
        general_tactic = body["generalTactic"]
        win_condition = body["winCondition"]
    except (KeyError, ValueError) as e:
        return JSONResponse({"error": f"Invalid request body: missing/malformed field {e}"}, status_code=400)

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            if is_new:
                existing = await supabase_select(client, "personas", {"select": "chapter_number", "order": "chapter_number.desc", "limit": "1"})
                chapter_number = (existing[0]["chapter_number"] + 1) if existing else 1
                existing_is_boss_chapter = False
            else:
                current = await supabase_select(client, "personas", {"id": f"eq.{persona_id}", "select": "chapter_number,is_boss_chapter"})
                if not current:
                    return JSONResponse({"error": f"Không tìm thấy chặng '{persona_id}'."}, status_code=404)
                chapter_number = current[0]["chapter_number"]
                existing_is_boss_chapter = bool(current[0].get("is_boss_chapter"))

            # isBossChapter không có control trong ProductEditScreen/PersonaEditScreen
            # (không nằm trong phạm vi yêu cầu) — nếu FE không gửi field này, GIỮ
            # NGUYÊN giá trị cũ thay vì mặc định false, tránh vô tình xoá cờ "boss
            # cuối" của level 5.5 khi admin chỉ sửa các field khác của chặng 5.
            is_boss_chapter = bool(body["isBossChapter"]) if "isBossChapter" in body else existing_is_boss_chapter

            persona_row = {
                "id": persona_id,
                "chapter_number": chapter_number,
                "name": name,
                "star_rating": int(body.get("starRating", 1)),
                "criteria": criteria,
                "behavior_note": behavior_note,
                "general_tactic": general_tactic,
                "win_condition": win_condition,
                "recommended_product_id": body.get("recommendedProductId"),
                "is_boss_chapter": is_boss_chapter,
                "is_hidden": bool(body.get("isHidden", False)),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
            await supabase_upsert(client, "personas", [persona_row], on_conflict="id")
            persona_dict = db_row_to_persona(persona_row)

            if is_new:
                apply_to_product_ids = body.get("applyToProductIds", [])
                if apply_to_product_ids:
                    in_list = ",".join(apply_to_product_ids)
                    product_rows = await supabase_select(client, "products", {"id": f"in.({in_list})", "select": "*"})
                else:
                    product_rows = []
            else:
                existing_levels = await supabase_select(client, "levels", {"persona_id": f"eq.{persona_id}", "select": "product_id"})
                product_ids = sorted({lv["product_id"] for lv in existing_levels})
                if product_ids:
                    in_list = ",".join(product_ids)
                    product_rows = await supabase_select(client, "products", {"id": f"in.({in_list})", "select": "*"})
                else:
                    product_rows = []

            affected_level_ids: list[str] = []
            for product_row in product_rows:
                product_dict = db_row_to_product(product_row)
                level_id = await regenerate_level(client, product_dict, persona_dict)
                affected_level_ids.append(level_id)
    except RuntimeError as e:
        app.logger.exception("admin_save_persona_handler failed")
        return JSONResponse({"error": str(e)}, status_code=502)

    return JSONResponse({"personaId": persona_id, "affectedLevelIds": affected_level_ids})


app.add_route("/roleplay", roleplay_handler, methods=["POST"])
app.add_route("/score", score_handler, methods=["POST"])
app.add_route("/generate-persona", generate_persona_handler, methods=["POST"])
app.add_route("/admin/products", admin_save_product_handler, methods=["POST"])
app.add_route("/admin/personas", admin_save_persona_handler, methods=["POST"])


@app.ping
def health_check() -> PingStatus:
    return PingStatus.HEALTHY


if __name__ == "__main__":
    app.run(port=8080, host="0.0.0.0")

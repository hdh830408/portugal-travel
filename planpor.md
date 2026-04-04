# 🤖 포르투갈 AI 여행 어시스턴트 (RAG 챗봇) 구현 계획서

## 1. 프로젝트 목표 (Goal)
현재 작성된 포르투갈 여행 가이드(`portugal_guides.js`), 맛집/일정 데이터(`portugal_data.js`), 종합 일정표(`plan.md`, `schedule.md`)를 기반으로 사용자의 질문에 답변하는 **맞춤형 AI RAG 챗봇**을 구축합니다.

사용자가 "상벤투 역 근처에서 평점 4.5 이상인 프란세지냐 맛집 찾아줘" 혹은 "리스본 비파나 맛집에서 추천하는 메뉴가 뭐야?"라고 물으면, 로컬에 저장된 가이드라인과 데이터를 검색하여 가장 정확하고 유용한 답변을 LLM이 생성하도록 만듭니다.

---

> [!CAUTION]
> ## User Review Required
> 해당 시스템은 파이썬(Python) 기반의 백엔드 서버(FastAPI)가 추가적으로 실행되어야 하며, OpenAI 또는 Anthropic의 API 키가 필요합니다. 
> 구현을 시작하기 전 아래 **Open Questions**에 대한 답변과 진행 승인이 필요합니다!

---

## 2. 제안하는 아키텍처 및 변경 사항 (Proposed Changes)

프론트엔드(HTML/JS) 클라이언트와 파이썬(Python) 기반의 백엔드로 구조를 분리합니다.

### 🐍 [Backend (Python)]
파이썬 서버는 텍스트를 임베딩하고 벡터 검색을 통해 LLM과 통신하는 중추 역할을 합니다.

#### [NEW] `backend/requirements.txt`
- `langchain-core`, `langchain-community`, `langchain-openai`, `langchain-anthropic`, `langchain-text-splitters`, `langsmith`
- `fastapi`, `uvicorn` (웹 서버)
- `chromadb` 혹은 `faiss-cpu` (벡터 데이터베이스)

#### [NEW] `backend/ingest_data.py`
- `portugal_data.js`, `portugal_guides.js`, `schedule.md` 등 저장된 데이터를 읽어와서 의미 단위로 쪼개고(chunking), Embedding 모델을 사용해 벡터DB에 적재하는 스크립트.

#### [NEW] `backend/main.py`
- 프론트엔드 통신용 FastAPI 서버.
- `/api/chat` 엔드포인트를 열어, 사용자 질문 -> 벡터DB 검색(Retrieval) -> LLM Prompt 조합 -> 응답 반환 로직을 수행합니다.

---

### 🌐 [Frontend (HTML/JS)]
웹사이트 사용자가 챗봇과 대화할 수 있는 UI 컴포넌트를 추가합니다.

#### [MODIFY] `index.html` (또는 메인 HTML 파일)
- 화면 우측 하단에 떠있는 둥근 채팅 아이콘 버튼(FAB) 추가.
- 클릭 시 펼쳐지는 채팅창 UI (메시지 목록 뷰 + 입력창) 추가.

#### [NEW] `js/chatbot.js`
- 사용자의 메시지를 받아 `localhost:8000/api/chat` (FastAPI 서버)로 POST 요청.
- 로딩 스피너 및 AI의 응답 텍스트를 채팅창에 렌더링.

---

## 3. 답변 대기 중인 질문 (Open Questions)

> [!IMPORTANT]
> 아래 질문들에 대해 답변해주시면 구체적인 세팅을 맞추어 개발을 시작하겠습니다.

1. **사용할 LLM 모델 선택**: 
   - `OpenAI (gpt-4o-mini 등)`와 `Anthropic (claude-3.5-sonnet 등)` 중 어느 회사의 API를 메인으로 사용하시겠습니까? (API 키 준비 필요)
2. **벡터 데이터베이스**:
   - 가볍고 설치가 쉬운 `ChromaDB`를 로컬 데이터베이스로 사용할까요?
3. **프론트엔드 디자인**:
   - 챗봇 UI를 기존 포르투갈 다크 테마(또는 현재 UI 컨셉)에 맞춰서 화면 위에 오버레이 되는 형태로 만들까요?

---

## 4. 검증 계획 (Verification Plan)

### Automated / Manual Tests
1. **데이터 임베딩(Ingestion) 테스트**: `backend/ingest_data.py`를 실행하여 `.json`, `.js`, `.md` 파일들이 정상적으로 파싱되고 벡터 DB에 저장되는지 확인.
2. **단독 챗봇 API 테스트**: 브라우저나 cURL을 통해 예상치 못한 질문("스페인 맛집 알려줘", "없는 정보")에 대해 환각(Hallucination) 없이 제대로 거절하거나 정보를 응답하는지 테스트.
3. **통합 UI 연동 테스트**: `index.html`에서 챗봇 창을 열어 자연스럽게 통신이 오가는지 검증 (네트워크 지연, 에러 처리 확인).
4. **LangSmith 모니터링 연동**: 챗봇 추론 과정이 LangSmith 대시보드에 정상적으로 로깅되는지 확인.

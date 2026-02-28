# 🏗️ 포르투갈 여행 시스템 아키텍처 청사진 (v3.0)

본 문서는 **'Runtime Data Fusion'** 아키텍처를 기반으로, 유지보수성과 확장성을 극대화하기 위한 **객체지향적(OOP) 모듈 구성도**를 정의합니다. 최근 진행된 이벤트 핸들러 분리 및 데이터 서비스 중앙화 작업을 반영하고 있습니다.

---

## 1. 시스템 아키텍처 개요 (System Architecture)

전체 시스템은 **데이터(Data) - 상태(State) - 로직(Service) - 뷰(View)**의 4계층으로 명확히 분리됩니다.

```mermaid
graph TD
    User((User)) -->|Event| AppController
    
    subgraph "Presentation Layer (View)"
        AppController[App Controller]
        ViewManager[View Manager]
        Components[UI Components]
        DOM[DOM Elements]
    end

    subgraph "State Layer"
        Store[Store (Pub/Sub)]
        AppState[Global State]
    end

    subgraph "Service Layer (Logic)"
        DataService[Data Service]
        AIService[AI Service]
        LocService[Location Service]
    end

    subgraph "Data Layer (Raw)"
        RawData[(Static JS Files)]
        LocalStorage[(Browser Storage)]
    end

    AppController -->|Dispatch| Store
    Store -->|Notify| ViewManager
    ViewManager -->|Render| Components
    Components -->|Update| DOM
    
    Store -->|Fetch/Update| DataService
    Store -->|Request| AIService
    
    DataService -->|Load| RawData
    DataService -->|Fusion| MasterData[MASTER_PLACES]
```

---

## 2. 상세 객체 구성 (Object-Oriented Design)

### 🧠 Core & Controller
애플리케이션의 진입점이자 흐름을 제어합니다.

*   **`App (app.js)`**:
    *   **역할**: 앱 초기화(`init`), 전역 이벤트 리스너 등록(`setupEventListeners`), 모듈 조율.
    *   **주요 메서드**: `init()`, `setupSubscriptions()`, `resetApp()`.
    *   **업데이트(v2.5)**: HTML 인라인 이벤트(`onclick`)를 제거하고 `addEventListener`로 중앙 집중화함.

*   **`AIController (ai-controller.js)`**:
    *   **역할**: AI 관련 UI 인터랙션 및 설정 관리.
    *   **주요 메서드**: `toggleSettings()`, `sendAI()`, `switchProvider()`.
    *   **특징**: `AIService`와 UI 사이의 중재자 역할.

### 💾 Data & State
데이터의 단일 진실 공급원(SSOT) 및 상태 관리자입니다.

*   **`DataService (data-service.js)`**:
    *   **역할**: 정적 데이터 파일(`portugal_data.js` 등)을 로드하여 관계형 데이터(`MASTER_PLACES`)로 병합.
    *   **주요 메서드**:
        *   `initializeIdSystem()`: 장소별 고유 ID 생성.
        *   `buildMasterData()`: 메타데이터 + 가이드 + 좌표 통합.
        *   `getFilteredPlaces()`: 필터링 및 검색 로직 수행.
        *   `getNearbyFoodsByGPS()`: 위치 기반 검색.

*   **`Store (store.js)`**:
    *   **역할**: Pub/Sub 패턴을 사용한 중앙 상태 관리.
    *   **구조**:
        *   `state`: `filters`, `tab`, `saved`, `route` 등 앱의 현재 상태.
        *   `events`: 구독자 목록.
    *   **주요 메서드**: `subscribe()`, `publish()`, `setTab()`, `toggleSave()`.

### 🛠️ Services
비즈니스 로직을 캡슐화한 순수 객체들입니다.

*   **`AIService (ai-service.js)`**:
    *   **역할**: LLM API (OpenRouter/Gemini) 통신 및 프롬프트 엔지니어링.
    *   **주요 메서드**: `fetchResponse()`, `generateSystemPrompt()`.
*   **`LocationService (utils.js 내장)`**:
    *   **역할**: 거리 계산(Haversine) 및 GPS 좌표 처리.
    *   **주요 메서드**: `getDistance()`.

### 🎨 UI Components & Views
화면을 그리는 렌더링 엔진입니다.

*   **`UI (ui-components.js)`**:
    *   **역할**: 화면 렌더링 함수들의 집합 (네임스페이스 패턴).
    *   **주요 메서드**: `renderFood()`, `renderRoute()`, `setupEventDelegation()`.
    *   **개선 방향**: 향후 `FoodView`, `RouteView` 클래스로 분리 예정.

*   **`Components`**:
    *   **`PlaceCard (place-card.js)`**: 장소 카드 DOM 생성 및 Lazy Loading 처리.
    *   **`Modal (modal.js)`**: 상세 정보 모달 및 가이드 팝업 제어.
    *   **`Toast (toast.js)`**: 알림 메시지 표시.
    *   **`Skeleton (skeleton.js)`**: 로딩 상태 UI 표시.

---

## 3. 최근 리팩토링 현황 (v2.5 Updates)

### ✅ HTML/JS 분리 (Separation of Concerns)
*   **Before**: `index.html`에 `onclick="switchTab('food')"`와 같은 인라인 핸들러가 산재함.
*   **After**: `index.html`은 순수 마크업만 유지. `app.js`의 `setupEventListeners()`에서 `id`와 `data-*` 속성을 이용해 이벤트를 바인딩.
    *   유지보수성 향상 및 CSP(Content Security Policy) 준수.

### ✅ 데이터 로직 중앙화 (Data Centralization)
*   **Before**: `renderFood` 함수 내에서 직접 `PLACES` 배열을 필터링하고 거리 계산을 수행.
*   **After**: `DataService.getFilteredPlaces()`로 로직 이관. UI는 데이터만 받아 그리는 역할에 집중.

### ✅ 컴포넌트 모듈화
*   `PlaceCard`, `Modal` 등을 독립 객체로 분리하여 재사용성 확보.
*   `innerHTML` 사용을 줄이고 `document.createElement` 사용을 늘려 보안성(XSS 방지) 강화.

---

## 4. 향후 발전 계획 (Roadmap to v3.0)

1.  **View Class 도입**: 현재 함수형인 `render...` 로직을 `class FoodView extends View` 형태로 전환하여 상태와 DOM을 더 긴밀하게 연결.
2.  **Router 도입**: 탭 전환을 URL 해시(`#food`, `#route`)와 연동하여 뒤로 가기 지원.
3.  **TypeScript 도입 검토**: 데이터 구조(`MASTER_PLACES`)의 타입 안정성 확보.

---
**작성일**: 2025-02-22
**작성자**: Gemini Code Assist
# 🏗️ 포르투갈 여행 시스템 리팩토링 마스터 플랜 (v2.0)

본 문서는 기존 `plan.md`에서 진행된 데이터 정규화 작업을 바탕으로, 애플리케이션의 **아키텍처, 모듈성, 유지보수성**을 극대화하기 위한 심층 리팩토링 계획입니다.

## 1. 현황 분석 및 문제점 진단

### 🚨 아키텍처적 문제
1.  **전역 네임스페이스 오염**: `PLACES`, `APP_DATA`, `AppState` 등 핵심 데이터가 `window` 객체에 노출되어 있어, 의도치 않은 수정이나 충돌 위험이 있음.
2.  **강한 결합도 (Tight Coupling)**: `app.js`가 데이터 로드, 상태 관리, UI 렌더링, 이벤트 처리를 모두 담당하는 'God Object' 형태임.
3.  **비표준 모듈 시스템**: `<script>` 태그의 로딩 순서에 의존하고 있어, 파일 간 의존 관계 파악이 어렵고 번들링이 불가능함.

### ⚠️ 코드 품질 문제
1.  **AI 로직의 파편화**: AI API 호출, 프롬프트 구성, 에러 처리가 `app.js` 내부에 하드코딩되어 있어 확장이 어려움.
2.  **상태 관리의 부재**: `AppState` 객체는 존재하지만, 상태 변경 시 UI가 자동으로 업데이트되지 않아 수동으로 렌더링 함수를 호출해야 함 (`renderFood()` 등).
3.  **매직 넘버/스트링**: 코드 곳곳에 하드코딩된 문자열(API 키, 모델명, CSS 클래스명)이 산재함.

---

## 2. 리팩토링 목표 (To-Be)

*   **ES Modules (ESM) 전면 도입**: `import` / `export` 구문을 사용하여 명시적인 의존성 관리.
*   **관심사의 분리 (SoC)**:
    *   **Services**: 비즈니스 로직 (API, 데이터 가공, 위치 정보).
    *   **Store**: 중앙 집중식 상태 관리 (Reactive State).
    *   **Components**: 순수 UI 렌더링 함수.
    *   **Utils**: 순수 헬퍼 함수.
*   **안정성 강화**: API 키 관리 개선 및 에러 핸들링 중앙화.

---

## 3. 상세 실행 계획 (Step-by-Step)

### [Phase 1] 코드 구조화 및 파일 분리 (Refactoring) (✅ 완료)
로컬 실행 환경(file://) 지원을 위해 ES Modules 도입은 보류하고, 기능별 파일 분리를 통해 구조를 개선합니다.

*   **데이터 및 로직 파일 분리**:
    *   [x] `portugal_data.js`, `portugal_guides.js`, `coords_data.js` (데이터)
    *   [x] `js/state.js` (상태 관리 객체 `AppState`)
    *   [x] `js/utils.js` (순수 유틸리티 함수)
    *   [x] `js/ui-components.js` (UI 렌더링 및 컴포넌트)
    *   [x] `js/app.js` (앱 초기화 및 이벤트 핸들링)
*   **스크립트 로딩 최적화**:
    *   [x] `index.html`에서 의존성 순서에 맞춰 스크립트 로드 (`coords` -> `guides` -> `data` -> `state` -> `utils` -> `ui` -> `app`)

### [Phase 2] 서비스 레이어 추출 (Service Layer)
`app.js`에 뭉쳐있는 로직을 기능별 클래스/모듈로 분리합니다.

1.  **`AIService.js`**:
    *   [x] OpenRouter API 호출 로직 캡슐화.
    *   [x] 시스템 프롬프트 관리 및 생성.
    *   [x] 스트리밍 응답 처리 및 에러 핸들링.
2.  **`DataService.js`**:
    *   [x] `MASTER_PLACES` 구축 로직(`initializeIdSystem` 등) 이동.
    *   [x] 데이터 필터링, 검색, 정렬 로직 담당.
3.  **`LocationService.js`**:
    *   Geolocation API 래핑.
    *   거리 계산(`Haversine formula`) 및 근처 장소 필터링 로직.
4.  **`StorageService.js`**:
    *   `localStorage` 접근 로직 캡슐화 (저장된 장소, 설정, API 키).

### [Phase 3] 상태 관리 시스템 구축 (State Management)
수동 DOM 업데이트를 제거하고, 상태 기반의 UI 갱신 구조를 만듭니다.

*   **`Store.js` 구현**:
    *   Pub/Sub 패턴을 적용한 경량 스토어.
    *   `state` 변경 시 구독된 리스너(UI 렌더러)들에게 자동 알림.
    *   예: `store.subscribe('filter', renderFoodList)`

### [Phase 4] UI 컴포넌트 구조화
`ui-components.js`를 더 작고 재사용 가능한 단위로 쪼갭니다.

*   **`components/` 디렉토리 생성**:
    *   `PlaceCard.js`: 장소 카드 HTML 생성.
    *   `Modal.js`: 상세 정보 모달 제어.
    *   `Toast.js`: 알림 메시지 제어.
    *   `Skeleton.js`: 로딩 UI 생성.
*   **이벤트 위임 최적화**: 각 컴포넌트는 HTML 문자열만 반환하고, 이벤트 바인딩은 상위 컨테이너에서 일괄 처리.

---

## 4. 파일 구조 재구성 (File Structure)

```text
root/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js              (앱 진입점: 초기화 및 모듈 연결)
│   ├── store.js             (상태 관리: Pub/Sub 패턴)
│   ├── config.js            (상수 관리: API 키, 모델명 등)
│   ├── services/            (비즈니스 로직)
│   │   ├── ai-service.js
│   │   ├── data-service.js
│   │   ├── location-service.js
│   │   └── storage-service.js
│   ├── components/          (UI 렌더링)
│   │   ├── place-card.js
│   │   ├── modal.js
│   │   ├── route-view.js
│   │   └── ...
│   └── data/                (데이터 파일 - 모듈화됨)
│       ├── places.js        (구 portugal_data.js)
│       ├── guides.js        (구 portugal_guides.js)
│       └── coords.js        (구 coords_data.js)
└── ...
```

## 5. 기대 효과

1.  **유지보수성 향상**: 기능 수정 시 해당 모듈만 수정하면 되므로 사이드 이펙트 최소화.
2.  **확장성**: 새로운 기능(예: 날씨 API, 번역 기능) 추가 시 서비스 모듈만 추가하면 됨.
3.  **테스트 용이성**: 각 서비스와 함수가 분리되어 있어 단위 테스트(Unit Test) 도입이 가능해짐.
4.  **성능 최적화**: 필요한 모듈만 로드하고, 상태 변경 시 필요한 부분만 다시 렌더링하여 성능 향상.

---
**작성일**: 2025-02-22
**작성자**: Gemini Code Assist
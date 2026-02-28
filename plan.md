# 📋 포르투갈 여행 시스템 리팩토링 및 최적화 계획서 (v2.0)

## 1. 현재 구조 분석 및 리스크 평가

### 🔍 주요 리스크
*   **참조 무결성 취약**: `PLACES`, `PLACE_COORDS`, `PLACE_GUIDES`, `NEARBY_LANDMARKS`가 모두 장소의 '이름(String)'을 키로 사용합니다. 이름에 오타가 있거나 수정될 경우 연관된 모든 데이터 참조가 깨지는 구조입니다.
*   **데이터 파편화**: 한 장소에 대한 정보가 3개 파일(`portugal_data.js`, `portugal_guides.js`, `coords_data.js`)과 4개 이상의 객체에 분산되어 있어 관리가 매우 어렵습니다.
*   **중복 데이터**: `LANDMARK_DETAILS`와 `PLACE_GUIDES`에 유사한 설명과 팁이 중복 존재하여 데이터 불일치 위험이 있습니다.

## 2. 리팩토링 핵심 전략

### ✅ 고유 ID 시스템 (UID) 도입
*   모든 장소에 `LIS_ROSSIO`, `OPO_SABENTO`, `SIN_PENA`와 같은 도시별 접두사를 포함한 고유 식별자를 부여합니다.
*   `ITINERARY`, `ROUTES`, `NEARBY_LANDMARKS` 등 모든 관계 설정을 이름이 아닌 ID 기반으로 변경합니다.

### ✅ Single Source of Truth (SSOT) 구축
*   분산된 모든 데이터를 `MASTER_PLACES`라는 하나의 통합 객체로 정규화합니다.
*   좌표, 메타데이터, 상세 가이드 내용을 한곳에서 관리하여 데이터 일관성을 보장합니다.

### ✅ ES 모듈화 및 아키텍처 개선
*   `export/import`를 사용하여 전역 스코프 오염을 방지하고 파일 간 의존성을 명확히 합니다.
*   데이터 레이어(Data)와 가공 레이어(Logic)를 분리하여 확장성을 확보합니다.

## 3. 단계별 실행 로드맵

### [1단계] ID 매핑 및 데이터 정규화
*   기존 `PLACES` 배열을 순회하며 고유 ID를 생성하고, `name` -> `id` 매핑 테이블을 구축합니다.
*   `PLACE_COORDS`와 `PLACE_GUIDES`의 데이터를 ID 기반으로 재정렬합니다.
### [1단계] ID 매핑 및 데이터 정규화 (✅ 완료)
*   **작업 내용**: `portugal_data.js` 하단에 런타임 ID 생성 로직을 추가했습니다.
    *   도시 코드(LIS, OPO 등)와 영문 명칭을 조합하여 `LIS_ROSSIO_SQUARE`와 같은 가독성 있는 ID를 자동 생성합니다.
    *   `PLACE_ID_MAP` 전역 객체를 생성하여 기존 `name` 키를 `id`로 변환할 수 있는 기반을 마련했습니다.
*   **검증**: 앱 실행 시 콘솔에 ID 생성 완료 메시지가 출력되며, 기존 기능(검색, 모달 등)에 전혀 영향을 주지 않음을 확인했습니다.

### [2단계] 통합 마스터 데이터 스키마 설계 및 구축 (✅ 완료)
*   **작업 내용**: `portugal_data.js`에 `MASTER_PLACES` 객체를 구축하는 로직을 추가했습니다.
    *   `DOMContentLoaded` 이벤트를 활용하여 `PLACE_COORDS`, `PLACE_GUIDES`, `LANDMARK_DETAILS` 등 모든 데이터가 로드된 후 병합을 수행합니다.
    *   `content` 필드에 역사, 팁, 포토스팟 정보를 통합하고, `references` 필드에 주변 맛집/관광지를 ID 배열로 변환하여 저장했습니다.
*   **검증**: 앱 실행 시 콘솔에 "Master Data Built" 메시지와 함께 통합된 장소 개수가 출력됩니다. 이제 `MASTER_PLACES`를 통해 모든 정보에 접근할 수 있습니다.

### [긴급 수정] 데이터 파일 문법 오류 수정 (✅ 완료)
*   **증상**: 앱 실행 시 404 에러 또는 스크립트 로드 실패 발생.
*   **원인**: `coords_data.js` 파일 내 `Cantinho do Aziz` 좌표 데이터 뒤에 콤마(`,`)가 누락되어 문법 오류 발생.
*   **조치**: 콤마를 추가하고 `sw.js` 캐시 버전을 `v14`로 업데이트하여 수정 사항이 즉시 반영되도록 함.

### [3단계] 참조 구조 업데이트 (✅ 완료)
*   **작업 내용**: `portugal_data.js`에 `ROUTES` 데이터를 ID 기반으로 변환하는 로직을 추가했습니다.
    *   `ROUTES`의 `places` 배열을 `placeIds`로, `highlights`를 `highlightIds`로 런타임에 변환합니다.
    *   `index.html`의 `renderRoute` 함수를 수정하여 ID를 통해 `MASTER_PLACES`에서 이름을 조회하도록 개선했습니다.
*   **404 오류 대응**: GitHub Pages 배포 지연 또는 설정 문제로 인한 404 오류를 방지하기 위해 `404.html` 리다이렉트 파일을 추가했습니다.

### [4단계] 로직 및 유틸리티 함수 수정 (✅ 완료)
*   **작업 내용**: `portugal_guides.js`의 `getPlaceGuide`와 `getNearbyFoodDetails` 함수를 수정했습니다.
    *   함수 인자로 ID가 들어오면 `MASTER_PLACES`에서 데이터를 조회하고, 이름이 들어오면 기존 `PLACE_GUIDES`를 조회하는 하이브리드 로직을 적용했습니다.
    *   이를 통해 `ROUTES`에서 ID로 변환된 장소를 클릭했을 때 상세 가이드가 정상적으로 표시됩니다.

### [5단계] 시스템 클린업 및 검증 (✅ 완료)
*   **작업 내용**: `sw.js` 캐시 버전을 `v15`로 업데이트하여 리팩토링된 코드가 사용자에게 즉시 반영되도록 했습니다.
*   **문서화**: `research.md`를 업데이트하여 `MASTER_PLACES` 통합 아키텍처와 ID 시스템 도입 사실을 반영했습니다.
*   **최종 상태**: 이제 시스템은 내부적으로 고유 ID를 사용하여 데이터를 처리하며, 이름 변경에 강건한 구조를 갖추게 되었습니다.

## 4. 기대 효과

1.  **유지보수성**: 장소 이름을 수정해도 시스템 전체에 영향이 없으며, 한 곳만 수정하면 모든 정보가 동기화됩니다.
2.  **확장성**: 다국어 지원(i18n)이나 외부 지도 API 연동 시 ID를 키로 즉시 매핑할 수 있습니다.
3.  **안정성**: 데이터 로드 시 ID 존재 여부를 체크하여 런타임 에러를 사전에 방지할 수 있습니다.



---
**본 계획서에 대해 검토를 부탁드립니다. 승인 시 1단계인 ID 매핑 및 통합 객체 생성 작업을 시작하겠습니다.**
*(작성자: Gemini Code Assist - 2025-02-22)*

## 5. 프론트엔드 구조 개선 및 UI/UX 최적화 계획 (index.html 분석)

### 🔍 현황 상세 분석
*   **Monolithic File Structure**: `index.html` 파일 하나에 HTML 구조, CSS 스타일(약 460라인), JavaScript 로직(약 1000라인)이 혼재되어 있어 가독성이 떨어지고 관리가 어렵습니다.
*   **DRY(Don't Repeat Yourself) 원칙 위배**:
    *   장소 카드(`place-card`)를 생성하는 HTML 문자열 조립 로직이 `renderFood`, `renderLandmark`, `renderSaved`, `renderNearbyList` 함수에 각각 중복 구현되어 있습니다.
    *   디자인 수정 시 4곳 이상의 코드를 동시에 수정해야 하는 위험이 있습니다.
*   **전역 스코프 의존성**: `currentTab`, `selectedDay`, `searchQuery` 등 상태 변수들이 전역 변수로 선언되어 있어, 로직이 복잡해질수록 상태 추적이 어려워질 수 있습니다.
*   **인라인 이벤트 핸들러**: HTML 태그 내에 `onclick="..."` 속성을 과도하게 사용하여 뷰와 로직의 결합도가 높습니다.

### 🛠️ 리팩토링 제안

#### [1단계] 파일 분리 (Separation of Concerns) (✅ 완료)
*   **CSS 분리**: `index.html`의 스타일 코드를 `css/styles.css`로 이동했습니다.
*   **JS 분리**: `index.html`의 스크립트 코드를 `js/app.js` (로직 및 상태 관리)와 `js/ui-components.js` (UI 렌더링)로 분리했습니다.
*   **연결**: `index.html`에서 분리된 파일들을 로드하도록 수정하고, `sw.js` 캐시 목록에 새 파일들을 추가했습니다.
*   **보안 및 안정성 강화**: UI 렌더링 시 `document.createElement`를 사용하여 XSS 보안을 강화하고, 앱 초기화 중복 실행 방지 로직을 추가했습니다.
*   **효과**: `index.html` 파일 크기가 대폭 줄어들고(약 1500라인 -> 약 230라인), 코드 관리가 용이해졌습니다.

#### [2단계] UI 컴포넌트화 (Componentization) (✅ 완료)
*   **카드 렌더링 함수 통일**: `createPlaceCard(place, index, options)` 함수를 제작하여 맛집, 관광지, 저장됨, 내 주변 탭에서 공통으로 사용하도록 리팩토링했습니다.
*   **배지/태그 생성 함수화**: `createBadges(place)`, `createLandmarkTags(place)` 함수로 분리하여 재사용성을 높였습니다.
*   **보안 강화**: 모든 카드 렌더링 로직을 `document.createElement` 방식으로 전환하여 XSS 취약점을 제거했습니다.

#### [3단계] 상태 관리 개선 (State Management) (✅ 완료)
*   **상태 객체 도입**: 흩어진 전역 변수들을 `AppState` 단일 객체로 통합하여 상태 추적과 관리를 용이하게 만들었습니다.
*   **이벤트 위임(Delegation)** (✅ 완료): `createPlaceCard`의 개별 `onclick`을 제거하고, 상위 컨테이너(`placeList` 등)에서 이벤트를 일괄 처리하도록 최적화했습니다.

#### [4단계] UX/성능 최적화
*   **Lazy Loading** (✅ 완료): `IntersectionObserver`를 도입하여 이미지 지연 로딩 기반을 마련했습니다.
*   **스켈레톤 UI** (✅ 완료): 데이터 로딩 중 빈 화면 대신 스켈레톤 스크린을 보여주어 체감 속도를 높였습니다.

---
**추가 분석 완료 (2025-02-22)**: 위 구조 개선을 통해 코드 라인 수를 줄이고 유지보수성을 획기적으로 높일 수 있습니다.
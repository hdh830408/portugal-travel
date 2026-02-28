# 🇵🇹 포르투갈 여행 가이드 시스템 심층 분석 보고서 (v3.0)

본 보고서는 `portugal_data.js`, `portugal_guides.js`, `coords_data.js` 및 `index.html` 파일을 정밀 분석하여, 시스템의 아키텍처, 데이터 흐름, 그리고 동선 설계의 공학적 원리를 상세히 기술한 결과입니다.

## 1. 시스템 아키텍처: 런타임 데이터 퓨전 (Runtime Data Fusion)
이 프로젝트는 정적인 JSON 데이터 파일들을 브라우저 런타임에 **관계형 데이터베이스(RDBMS)**와 유사한 구조로 동적 통합하는 **'하이브리드 데이터 엔진'** 방식을 채택하고 있습니다.

### 핵심 데이터 흐름
1.  **Raw Data Layer**: `portugal_data.js`(메타데이터), `portugal_guides.js`(콘텐츠), `coords_data.js`(좌표)에 분산된 정적 데이터.
2.  **Integration Layer**: 앱 초기화 시점(`DOMContentLoaded`)에 `initializeIdSystem()`과 병합 로직이 실행되어 `MASTER_PLACES`라는 단일 진실 공급원(SSOT) 객체를 생성.
3.  **Application Layer**: UI는 통합된 `MASTER_PLACES`와 ID 참조를 통해 데이터를 소비하며, `getPlaceGuide` 등의 헬퍼 함수가 이를 중개.

## 2. 파일별 상세 분석 및 역할

### 📂 `portugal_data.js` (Core Metadata & Logic)
시스템의 뼈대이자 두뇌 역할을 합니다.
*   **`PLACES`**: 150개 이상의 장소에 대한 기본 메타데이터(이름, 평점, 가격, 유형, 영업시간) 배열.
*   **`ITINERARY` & `ROUTES`**: 시간적(Schedule) 및 공간적(Route) 여행 계획 데이터.
*   **`initializeIdSystem()`**: 런타임에 도시 코드(LIS, OPO)와 영문명을 조합하여 고유 ID(예: `LIS_ROSSIO`)를 생성하는 핵심 로직.
*   **`MASTER_PLACES` 구축**: 흩어진 좌표, 가이드, 상세 정보를 ID 기준으로 병합하여 전역 객체로 발행.

### 📂 `portugal_guides.js` (Rich Content Layer)
사용자 경험을 풍부하게 하는 콘텐츠 저장소입니다.
*   **`PLACE_GUIDES`**: 역사적 배경, 포토스팟, 방문 팁 등 텍스트 위주의 대용량 데이터.
*   **`getPlaceGuide(idOrName)`**: ID 기반 조회를 우선하되, 레거시 이름 기반 조회도 지원하는 하이브리드 접근 함수.

###  `coords_data.js` (Spatial Data)
*   **`PLACE_COORDS`**: 장소 이름과 위도/경도(`lat`, `lng`) 매핑 객체.
*   **역할**: 거리 계산 및 지도 연동, '내 주변 찾기' 기능의 기초 데이터 제공.

### 📂 `index.html` (Presentation & Interaction)
*   **SPA 구조**: 탭 기반 네비게이션(맛집, 관광지, 일정, 동선, 저장됨) 구현.
*   **Geolocation Engine**: Haversine 공식을 이용한 사용자 위치 기반 거리 계산 및 정렬 로직(`findMyLocation`) 내장.
*   **AI Integration**: Google Gemini / OpenRouter API와 연동된 여행 어시스턴트 인터페이스.

## 3. 데이터 관계망 및 ID 시스템 (The Nervous System)

### 🆔 동적 ID 할당 시스템
기존의 취약한 이름(String) 기반 참조를 해결하기 위해 도입되었습니다.
*   **생성 규칙**: `[도시코드]_[영문명슬러그]` (예: `Lisboa` + `Rossio Square` -> `LIS_ROSSIO`)
*   **매핑 테이블**: `PLACE_ID_MAP` 객체가 `이름` ↔ `ID` 양방향 변환을 담당하여 구버전 데이터와의 호환성을 유지합니다.

### 🔗 데이터 병합 메커니즘 (`MASTER_PLACES`)
앱 실행 시 다음과 같은 병합 과정이 일어납니다:
```javascript
MASTER_PLACES[ID] = {
  ...PLACES[i],          // 기본 정보 (from portugal_data.js)
  coords: PLACE_COORDS,  // 좌표 정보 (from coords_data.js)
  content: PLACE_GUIDES, // 상세 가이드 (from portugal_guides.js)
  references: {          // 관계 정보 (ID로 변환됨)
    nearbyFoodIds: [...]
  }
}
```

## 4. 동선(Routes) 설계의 공학적 원리

### 📐 위상학적 지형 최적화 (Topological Optimization)
*   **리스본 (Day 2)**: `서쪽 고지대(바이루알투) → 중앙 저지대(바이샤) → 동쪽 고지대(알파마)`의 **U자형 단방향 흐름**으로 설계하여, 불필요한 언덕 오르내림을 최소화했습니다.
*   **신트라 (Day 4)**: 버스로 최정상(`페나궁전`) 이동 후 도보로 하산하는 **중력 도움(Gravity-Assisted)** 동선입니다.
*   **포르투 (Day 9)**: `포르투 → 기마랑이스 → 브라가 → 포르투`의 **삼각형 순환(Triangular Loop)** 구조로 중복 경로를 제거했습니다.

## 5. 공간 정보 로직 (Spatial Logic)

*   **반경 검색**: 사용자의 GPS 좌표를 기준으로 500m 반경 내의 `FOOD_TYPES` 장소를 필터링하여 추천합니다.
*   **하이브리드 추천**: GPS 데이터가 없는 경우, 수동으로 매핑된 `NEARBY_LANDMARKS` 데이터를 백업으로 사용하여 추천의 연속성을 보장합니다.

## 6. 결론 및 제언

이 시스템은 **정적 파일의 단순함**과 **동적 데이터베이스의 강력함**을 동시에 갖춘 효율적인 아키텍처입니다. 특히 런타임 ID 생성 및 데이터 병합 전략은 서버 없이도 복잡한 관계형 데이터를 다룰 수 있는 모범적인 패턴을 보여줍니다.

---
**보고서 최종 업데이트 완료.** (작성자: Gemini Code Assist - 2025-02-22 v3.0)
```

분석 결과, 데이터의 양이 매우 방대하고 체계적으로 정리되어 있어 실제 여행 가이드 앱의 백엔드 데이터로 사용하기에 충분한 수준입니다. 특히 `searchName` 필드를 통해 실용성을 챙긴 점이 인상적입니다.

<!--
[PROMPT_SUGGESTION]portugal_data.js와 portugal_guides.js의 중복된 랜드마크 정보를 통합하는 리팩토링 코드를 작성해줘.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]현재의 전역 변수 구조를 ES 모듈(export/import) 구조로 변경하고, 장소별 고유 ID를 부여하는 예시를 보여줘.[/PROMPT_SUGGESTION]

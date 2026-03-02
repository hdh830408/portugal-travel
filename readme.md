# 🇵🇹 포르투갈 여행 가이드 시스템 (Portugal Travel Guide)

## 📖 프로젝트 개요
이 프로젝트는 포르투갈 9박 10일 여행 일정을 관리하고 시각화하는 정적 웹 애플리케이션입니다.
**Runtime Data Fusion** 아키텍처를 채택하여, 여러 개의 정적 데이터 파일을 브라우저 런타임에 통합하여 하나의 거대한 관계형 데이터(`MASTER_PLACES`)로 구축합니다.

## 📂 파일 구조 및 역할

| 파일명 | 역할 및 데이터 | 중요도 |
| :--- | :--- | :--- |
| **`portugal_data.js`** | **Core Data**. 일정(`ITINERARY`), 지도 경로(`ROUTES`), 장소 메타데이터(`PLACES`) | ⭐⭐⭐ |
| **`coords_data.js`** | **Spatial Data**. 장소명과 위도/경도 매핑 (`lat`, `lng`) | ⭐⭐⭐ |
| **`portugal_guides.js`** | **Content Data**. 상세 설명, 역사, 방문 팁, 포토스팟 | ⭐⭐ |
| `index.html` | UI 렌더링 및 로직 (SPA 구조) | ⭐⭐ |

---

## 🛠️ 시스템 유지보수 및 일정 변경 가이드

일정이 변경되거나 새로운 장소가 추가될 경우, 데이터 간의 **참조 무결성(Referential Integrity)**을 유지하기 위해 아래 프로세스를 반드시 따라야 합니다.

### ⚠️ 핵심 규칙: Name Consistency
모든 파일(`ROUTES`, `PLACES`, `COORDS`, `GUIDES`)에서 사용하는 **장소명(String)은 띄어쓰기 포함 정확히 일치**해야 합니다. 불일치 시 지도 마커가 누락되거나 상세 정보가 뜨지 않습니다.

### 🔄 수정 프로세스 (Step-by-Step)

#### Step 1. 기본 스케줄 및 동선 정의 (`portugal_data.js`)
1.  **`ITINERARY` 수정**: 타임라인 텍스트(`time`, `activity`)를 수정합니다. (단순 표시용)
2.  **`ROUTES` 수정**: 지도에 경로를 그리기 위해 `sections` 내 `places` 배열을 수정합니다. **(시스템의 기본키 역할)**
3.  **`PLACES` 등록**: 신규 장소라면 객체를 추가하고, 기존 장소라면 `days` 배열을 업데이트합니다.
    *   `name`: `ROUTES`의 이름과 일치 필수.
    *   `type`: 아이콘 결정 (`landmark`, `restaurant` 등).
    *   `searchName`: 구글맵 검색 정확도 향상용.

#### Step 2. 지리 정보 등록 (`coords_data.js`)
지도상 마커 표시 및 거리 계산을 위해 좌표를 등록합니다.
*   형식: `"장소명": { lat: 위도, lng: 경도 }`
*   *Tip: 구글맵에서 우클릭하여 좌표 복사.*

#### Step 3. 상세 콘텐츠 작성 (`portugal_guides.js`)
장소 클릭 시 모달에 표시될 상세 정보를 입력합니다.
*   `history`, `visitTips`, `photoSpots` 등 풍부한 콘텐츠를 작성합니다.
*   `nearbyFood`: 주변 맛집 이름을 배열로 넣으면 자동으로 링크됩니다.

#### Step 4. 데이터 정합성 검증 (Checklist)
- [ ] **이름 일치**: `ROUTES`의 장소명이 다른 파일들의 Key와 정확히 일치하는가?
- [ ] **좌표 확인**: 신규 장소의 좌표가 `coords_data.js`에 있는가? (누락 시 지도 오류)
- [ ] **고아 데이터**: `ITINERARY`에는 있는데 `PLACES`에 없는 장소는 없는가?

---

## 💡 효율적인 관리 팁
*   **맛집 추가 시**: `PLACES` 등록 → `coords_data.js` 좌표 등록 → `portugal_guides.js`의 인근 관광지 `nearbyFood` 배열에 추가하면 자동 연결됩니다.
*   **일정 순서 변경**: `ITINERARY`는 텍스트만 변경되지만, 지도의 선 연결 순서를 바꾸려면 `ROUTES`의 `places` 배열 순서도 함께 바꿔야 합니다.

## 🏗️ 아키텍처 참고 (Runtime Data Fusion)
앱 실행 시(`DOMContentLoaded`) 다음과 같은 병합 과정이 일어납니다:
1.  `initializeIdSystem()`: 도시 코드와 영문명을 조합해 고유 ID 생성.
2.  `MASTER_PLACES` 구축: `PLACES` + `COORDS` + `GUIDES` 데이터를 ID 기준으로 병합.
3.  UI 렌더링: 통합된 데이터를 기반으로 화면 표시.
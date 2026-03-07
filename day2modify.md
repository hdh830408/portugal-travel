# 📋 Day 2 일정 및 동선 변경 영향 범위 분석

## 1. 개요
**Day 2 (5/2 토)**: 리스본 시내 (바이샤·시아두·알파마) 일정 변경 시 영향을 받는 데이터 구조와 파일들을 분석합니다.

## 2. 수정 대상 파일 및 데이터

### 📂 `portugal_data.js` (핵심 데이터)
가장 많은 수정이 필요한 파일입니다.

1.  **`ITINERARY` 배열**
    *   `day: "DAY 2"` 객체 내부의 `schedule` 배열 수정 필요.
    *   시간(`time`)과 활동(`activity`) 텍스트를 새로운 동선에 맞춰 업데이트해야 합니다.
    *   *영향*: "일정" 탭의 타임라인 표시.

2.  **`ROUTES` 객체**
    *   `"DAY 2"` 키 내부의 `sections` 배열 수정 필요.
    *   `places` 배열: 지도에 경로를 그리는 순서이므로, 실제 이동 순서대로 장소명(String)을 정확히 나열해야 합니다.
    *   `highlights`: 경로 요약에 표시될 주요 장소 업데이트.
    *   *영향*: "동선" 탭의 지도 경로(Polyline) 및 마커 순서.

3.  **`PLACES` 배열**
    *   **기존 장소**: Day 2에서 제외되는 장소는 `days` 배열에서 `"DAY 2"` 제거.
    *   **신규 장소**: 새로 추가되는 장소는 객체를 생성(또는 찾아서)하고 `days` 배열에 `"DAY 2"` 추가.
    *   *영향*: "맛집/관광지" 탭의 필터링(Day별 보기) 기능.

### 📂 `coords_data.js` (좌표 데이터)
*   **신규 장소 추가 시**: 반드시 해당 장소의 정확한 위도(`lat`), 경도(`lng`)를 `PLACE_COORDS` 객체에 추가해야 합니다.
*   *주의*: 장소명(Key)은 `portugal_data.js`의 이름과 띄어쓰기까지 정확히 일치해야 합니다.

### 📂 `portugal_guides.js` (가이드 콘텐츠)
*   **신규 장소 추가 시**: 상세 설명(`history`, `visitTips`, `photoSpots`)이 필요하다면 `PLACE_GUIDES`에 추가합니다.
*   **기존 장소**: 동선 변경으로 방문 시간대가 바뀌면(예: 낮 → 일몰), `visitTips`나 `photoSpots` 내용을 수정해야 할 수 있습니다.

## 3. 데이터 무결성 체크리스트 (Consistency Check)

변경 작업 후 다음 사항을 반드시 확인해야 합니다.

1.  **Name Consistency (이름 일치)**
    *   `ITINERARY` 텍스트, `ROUTES`의 `places` 배열, `PLACES`의 `name`, `coords_data.js`의 Key가 모두 동일한 철자인가?
    *   *Tip*: `portugal_data.js`의 `PLACES`에 있는 `name`을 기준으로 복사해서 사용하는 것을 권장합니다.

2.  **ID 참조 (시스템 내부)**
    *   시스템이 런타임에 `initializeIdSystem()`을 통해 ID를 생성하므로, 데이터 파일에서는 **사람이 읽을 수 있는 이름(String)**만 정확히 관리하면 됩니다.

3.  **고아 데이터 방지**
    *   `ROUTES`에는 있는데 `coords_data.js`에 좌표가 없으면 지도에 마커가 뜨지 않거나 에러가 발생할 수 있습니다.

## 4. 추천 작업 순서

1.  **기획**: 변경할 동선 확정 (장소 리스트 및 순서).
2.  **좌표 등록**: 신규 장소가 있다면 `coords_data.js`에 먼저 등록.
3.  **메타데이터 등록**: `portugal_data.js`의 `PLACES`에 신규 장소 정보 및 `days` 태그 설정.
4.  **동선 연결**: `portugal_data.js`의 `ROUTES["DAY 2"]` 업데이트.
5.  **일정 텍스트**: `portugal_data.js`의 `ITINERARY` 텍스트 수정.
6.  **가이드 보완**: `portugal_guides.js`에 상세 내용 추가.

---
**작성일**: 2025-02-22
**분석**: Gemini Code Assist
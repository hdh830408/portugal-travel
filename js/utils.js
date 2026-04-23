// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

// 두 좌표 간 거리 계산 (Haversine Formula) -> 미터(m) 단위 반환
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// 전역 노출
window.getDistance = getDistance;

// HTML 이스케이프 유틸리티
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
window.esc = esc;

const LC_FREE_PLACES = [
  '글로리아 푸니쿨라', '산타 주스타', '개선문', '상 조르제', 
  '제로니무스', '발견기념비', '발견 기념비', '벨렝탑', '벨렝 탑', '아주다 궁전', '카르무 성당', 
  '마프라 국립 궁전', '알코바사 수도원', '바탈랴 수도원', '그리스도 수도원'
];

window.getLCBadgeHtml = function(name, activity = '') {
  if (!name && !activity) return '';
  const isTarget = LC_FREE_PLACES.some(p => (name && name.includes(p)) || (activity && activity.includes(p)));
  if (isTarget) return '<span class=\"lc-badge\">LC Free</span>';
  return '';
};
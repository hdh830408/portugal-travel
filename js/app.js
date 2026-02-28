// ═══════════════════════════════════════════════════════════════════════════
// APP LOGIC & STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

let isAppInitialized = false;

function init() {
  if (isAppInitialized) return;
  isAppInitialized = true;

  // 데이터 초기화 로직 실행
  DataService.init();

  if (typeof APP_CONFIG !== 'undefined') {
    document.title = `${APP_CONFIG.flag} ${APP_CONFIG.title}`;
    document.getElementById('appTitle').textContent = `${APP_CONFIG.flag} ${APP_CONFIG.title}`;
    document.getElementById('appDates').textContent = `${APP_CONFIG.dates} · ${APP_CONFIG.duration} 여행 가이드`;
  }
  
  // UI 초기화 함수 호출 (ui-components.js에 정의됨)
  UI.setupEventDelegation();
  
  // 스켈레톤 UI 표시 (초기 로딩 체감 속도 향상)
  UI.renderSkeleton('placeList');
  UI.renderSkeleton('landmarkList');
  UI.renderSkeleton('scheduleList');

  // 실제 데이터 렌더링 (UI 스레드 양보를 위해 지연 실행)
  setTimeout(() => {
    UI.buildDayPills();
    UI.buildCatFilter();
    UI.renderFood();
    UI.buildLandmarkDayFilter();
    UI.buildLandmarkCatFilter();
    UI.renderSchedule();
  }, 10);

  // [AI] 컨트롤러 초기화 (UI 및 이벤트 연결)
  if (typeof AIController !== 'undefined') AIController.init();

  // [Store] 상태 구독 설정
  setupSubscriptions();
  setupEventListeners();
}

// ── 상태 변경 및 이벤트 핸들러 ──
function selectDay(day) {
  Store.setFoodFilter('day', day);
}

function selectCat(cat) {
  Store.setFoodFilter('cat', cat);
}

function onSearch(val) {
  Store.setFoodFilter('search', val.trim());
}

function selectLandmarkDay(day) {
  Store.setLandmarkFilter('day', day);
}

function selectLandmarkCat(cat) {
  Store.setLandmarkFilter('cat', cat);
}

function switchTab(tab) {
  Store.setTab(tab);
}

function onLandmarkSearch(val) {
  Store.setLandmarkFilter('search', val.trim());
}

function selectRouteDay(day) {
  Store.setRouteDay(day);
}

function showPlaceFromRoute(idOrName) {
  let placeName = idOrName;
  if (MASTER_PLACES[idOrName]) placeName = MASTER_PLACES[idOrName].name;
  if (PLACE_GUIDES[placeName]) UI.openGuide(placeName);
  else {
    const place = PLACES.find(p => p.name === placeName);
    if (place) UI.showModal(place);
    else UI.openGuide(placeName);
  }
}

function toggleSave(name) {
  Store.toggleSave(name);
}

function openMap(searchNameOrAddr, placeName) {
  const query = searchNameOrAddr || placeName || '';
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
}

function openDirections(placeName) {
  let query = placeName;
  if (PLACE_COORDS[placeName]) query = `${PLACE_COORDS[placeName].lat},${PLACE_COORDS[placeName].lng}`;
  else {
    const place = PLACES.find(p => p.name === placeName);
    if (place) query = place.searchName || place.name;
  }
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`, '_blank');
}

function openSearch(query) { window.open(`https://www.google.com/search?q=${encodeURIComponent(query||'')}`, '_blank'); }
function openReview(query) { window.open(`https://www.google.com/search?q=${encodeURIComponent((query||'')+' review')}`, '_blank'); }
function openKrReview(query) { window.open(`https://www.google.com/search?q=${encodeURIComponent((query||'')+' 후기 블로그')}`, '_blank'); }

function goToFood(foodName) {
  Store.setTab('food');
  Store.setFoodFilter('day', 'all');
  Store.setFoodFilter('cat', 'all');
  Store.setFoodFilter('nearbyLandmark', null);
  Store.setFoodFilter('search', foodName);
  document.getElementById('searchInput').value = foodName;
}

function filterByLandmark() {
  const name = AppState.ui.tagPopupLandmark;
  Store.setFoodFilter('nearbyLandmark', name);
  UI.closeTagPopup();
}

function clearLandmarkFilter() {
  Store.setFoodFilter('nearbyLandmark', null);
}

function goToNearbyFood(landmarkName) {
  UI.closeGuide();
  UI.closeModal();
  Store.setTab('food');
  Store.setFoodFilter('nearbyLandmark', landmarkName);
}

function findMyLocation() {
  if (!navigator.geolocation) { UI.showToast('❌ 위치 정보를 지원하지 않는 브라우저입니다.'); return; }
  UI.showToast('📍 위치를 찾는 중...');
  navigator.geolocation.getCurrentPosition(
    (pos) => showNearbyPlacesFromUser(pos.coords.latitude, pos.coords.longitude),
    (err) => { console.error(err); UI.showToast('❌ 위치 정보를 가져올 수 없습니다.'); },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}

function showNearbyPlacesFromUser(lat, lng) {
  const isFoodTab = AppState.tab === 'food';
  const targetTypes = isFoodTab ? FOOD_TYPES : LANDMARK_TYPES;
  const containerId = isFoodTab ? 'placeList' : 'landmarkList';
  if (isFoodTab) {
    document.getElementById('searchInput').value = '';
    Store.setFoodFilter('search', '');
    Store.setFoodFilter('day', 'all');
    Store.setFoodFilter('cat', 'all');
  } else {
    document.getElementById('landmarkSearchInput').value = '';
    Store.setLandmarkFilter('search', '');
    Store.setLandmarkFilter('day', 'all');
    Store.setLandmarkFilter('cat', 'all');
  }
  
  const nearby = [];
  PLACES.forEach(p => {
    if (!targetTypes.includes(p.type)) return;
    const coords = PLACE_COORDS[p.name];
    if (!coords) return;
    const dist = getDistance(lat, lng, coords.lat, coords.lng);
    if (dist <= 5000) nearby.push({ ...p, distance: dist });
  });
  nearby.sort((a, b) => a.distance - b.distance);
  if (nearby.length === 0) {
    document.getElementById(containerId).innerHTML = '<div class="empty-state"><div class="icon">🔭</div>5km 이내에 장소가 없어요<br><small>포르투갈에 계신가요?</small></div>';
    UI.showToast('❌ 주변 5km 이내 장소 없음');
    return;
  }
  UI.renderNearbyList(nearby, containerId);
  UI.showToast(`📍 내 주변 ${nearby.length}곳 발견!`);
}

// ── STORE SUBSCRIPTIONS (UI 업데이트) ──
function setupSubscriptions() {
  // 1. 탭 변경
  Store.subscribe('tabChange', (tab) => {
    document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', ['food','landmark','schedule','route','saved'][i] === tab));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + tab).classList.add('active');
    
    if (tab === 'landmark') UI.renderLandmark();
    if (tab === 'saved') UI.renderSaved();
    if (tab === 'route') UI.renderRoute(ROUTES);
    if (tab === 'schedule') UI.renderSchedule();
    if (tab === 'food') UI.renderFood();
  });

  // 2. 맛집 필터 변경
  Store.subscribe('foodFilterChange', ({ key, value }) => {
    if (key === 'day') {
      document.querySelectorAll('#dayPills .day-pill').forEach(el => el.classList.toggle('active', el.textContent.includes(value === 'all' ? '전체' : value.replace('DAY ', 'Day'))));
    }
    if (key === 'cat') {
      document.querySelectorAll('#catFilter .cat-btn').forEach((el, i) => el.classList.toggle('active', i === ['all', ...FOOD_TYPES].indexOf(value)));
    }
    if (key === 'nearbyLandmark') {
      const bar = document.getElementById('landmarkFilterBar');
      const nameEl = document.getElementById('landmarkFilterName');
      if (value) {
        const hasGPS = !!PLACE_COORDS[value];
        const gpsNearby = hasGPS ? DataService.getNearbyFoodsByGPS(value, 500) : [];
        const useGPS = gpsNearby.length > 0;
        const filterText = useGPS ? `${value} (500m 이내)` : `${value} 근처`;
        
        nameEl.textContent = filterText;
        bar.classList.add('active');
        
        if (useGPS) UI.showToast(`🍽️ ${value} 500m 이내 ${gpsNearby.length}곳`);
        else {
          const fallbackCount = DataService.getFoodsByLandmark(value).length;
          UI.showToast(`🍽️ ${value} 근처 ${fallbackCount}곳`);
        }
      } else {
        bar.classList.remove('active');
      }
    }
    UI.renderFood();
  });

  // 3. 관광지 필터 변경
  Store.subscribe('landmarkFilterChange', ({ key, value }) => {
    if (key === 'day') {
      document.querySelectorAll('#landmarkDayPills .day-pill').forEach(el => el.classList.toggle('active', el.textContent.includes(value === 'all' ? '전체' : value.replace('DAY ', 'Day'))));
    }
    if (key === 'cat') {
      document.querySelectorAll('#landmarkCatFilter .cat-btn').forEach((el, i) => el.classList.toggle('active', i === ['all', ...LANDMARK_TYPES].indexOf(value)));
    }
    UI.renderLandmark();
  });

  // 4. 저장 변경
  Store.subscribe('saveChange', ({ name, isSaved }) => {
    UI.renderFood(); // 하트 아이콘 갱신
    if (AppState.tab === 'saved') UI.renderSaved();
    UI.showToast(isSaved ? '⭐ 저장됨!' : '저장 해제');
  });

  // 5. 루트 변경
  Store.subscribe('routeChange', (day) => {
    document.querySelectorAll('.route-day-btn').forEach(btn => btn.classList.toggle('active', btn.textContent === day));
    UI.renderRoute(ROUTES);
  });
}

// ── EVENT LISTENERS (정적 요소) ──
function setupEventListeners() {
  // Header
  document.getElementById('btnToggleAI')?.addEventListener('click', () => AIController.toggleAI());
  document.getElementById('settingsBtn')?.addEventListener('click', () => AIController.toggleSettings());

  // Tabs
  document.querySelectorAll('.tab').forEach(el => {
    el.addEventListener('click', () => switchTab(el.dataset.tab));
  });

  // Food Page
  document.getElementById('searchInput')?.addEventListener('input', (e) => onSearch(e.target.value));
  document.getElementById('btnFindLocationFood')?.addEventListener('click', findMyLocation);
  document.getElementById('btnClearLandmarkFilter')?.addEventListener('click', clearLandmarkFilter);

  // Landmark Page
  document.getElementById('landmarkSearchInput')?.addEventListener('input', (e) => onLandmarkSearch(e.target.value));
  document.getElementById('btnFindLocationLandmark')?.addEventListener('click', findMyLocation);

  // Route Page
  document.querySelectorAll('.route-day-btn').forEach(el => {
    el.addEventListener('click', () => selectRouteDay(el.dataset.day));
  });

  // Settings Panel
  document.getElementById('settingsPanel')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) AIController.toggleSettings();
  });
  document.getElementById('btnSettingsClose')?.addEventListener('click', () => AIController.toggleSettings());
  document.getElementById('btnResetApp')?.addEventListener('click', resetApp);
  document.getElementById('btnSaveApiKey')?.addEventListener('click', () => AIController.saveApiKey());

  document.querySelectorAll('.provider-tab').forEach(el => {
    el.addEventListener('click', () => AIController.switchProvider(el.dataset.provider));
  });

  document.querySelectorAll('.model-option').forEach(el => {
    el.addEventListener('click', () => AIController.selectModel(el.dataset.model, el));
  });

  // AI Panel
  document.getElementById('btnAIClose')?.addEventListener('click', () => AIController.toggleAI());
  document.getElementById('aiSend')?.addEventListener('click', () => AIController.sendAI());
  document.getElementById('aiInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') AIController.sendAI();
  });
  document.querySelectorAll('.ai-sug').forEach(el => {
    el.addEventListener('click', () => AIController.askSuggestion(el.dataset.sug));
  });

  // Modals
  document.getElementById('placeModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('btnModalClose')?.addEventListener('click', closeModal);

  document.getElementById('guideModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeGuide();
  });
  document.getElementById('btnGuideClose')?.addEventListener('click', closeGuide);

  // Tag Popup
  document.getElementById('tagPopupOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeTagPopup();
  });
  document.getElementById('btnFilterByLandmark')?.addEventListener('click', filterByLandmark);
  document.getElementById('btnOpenLandmarkMap')?.addEventListener('click', openLandmarkMap);
  document.getElementById('btnOpenLandmarkGuide')?.addEventListener('click', openLandmarkGuide);
}

async function resetApp() {
  if (confirm('앱을 초기화하고 최신 데이터를 받아오시겠습니까?\n(저장된 설정과 캐시가 모두 삭제됩니다)')) {
    ['pt_model'].forEach(k => localStorage.removeItem(k));
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) await registration.unregister();
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
    } catch (e) { console.error(e); }
    window.location.reload();
  }
}

// 전역 객체에 함수 노출 (HTML onclick 핸들러 지원용)
window.resetApp = resetApp;
window.switchTab = switchTab;
window.onSearch = onSearch;
window.findMyLocation = findMyLocation;
window.clearLandmarkFilter = clearLandmarkFilter;
window.selectDay = selectDay;
window.selectCat = selectCat;
window.onLandmarkSearch = onLandmarkSearch;
window.selectLandmarkDay = selectLandmarkDay;
window.selectLandmarkCat = selectLandmarkCat;
window.selectRouteDay = selectRouteDay;
window.showPlaceFromRoute = showPlaceFromRoute;
window.toggleSave = toggleSave;
window.openMap = openMap;
window.openDirections = openDirections;
window.openSearch = openSearch;
window.openReview = openReview;
window.openKrReview = openKrReview;
window.filterByLandmark = filterByLandmark;
window.goToFood = goToFood;
window.goToNearbyFood = goToNearbyFood;

// UI 컴포넌트에서 필요한 함수들도 전역 노출
window.closeModal = closeModal;
window.closeGuide = closeGuide;
window.closeTagPopup = closeTagPopup;
window.openLandmarkMap = openLandmarkMap;
window.openLandmarkGuide = openLandmarkGuide;
window.toggleDay = toggleDay;
window.updateModalSaveBtn = updateModalSaveBtn;
window.toggleSaveFromGuide = toggleSaveFromGuide;

document.addEventListener('DOMContentLoaded', init);

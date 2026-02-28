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

  // [AI] 서비스 초기화
  AIService.init();

  const hasKey = AIService.getKey();
  if (hasKey) {
    const btn = document.getElementById('settingsBtn');
    if (btn) { btn.style.borderColor = 'var(--green)'; btn.style.color = 'var(--green)'; }
  }
}

// ── 상태 변경 및 이벤트 핸들러 ──
function selectDay(day) {
  AppState.filters.food.day = day;
  document.querySelectorAll('#dayPills .day-pill').forEach(el => el.classList.toggle('active', el.textContent.includes(day === 'all' ? '전체' : day.replace('DAY ', 'Day'))));
  UI.renderFood();
}

function selectCat(cat) {
  AppState.filters.food.cat = cat;
  document.querySelectorAll('#catFilter .cat-btn').forEach((el, i) => el.classList.toggle('active', i === ['all', ...FOOD_TYPES].indexOf(cat)));
  UI.renderFood();
}

function onSearch(val) {
  AppState.filters.food.search = val.trim();
  UI.renderFood();
}

function selectLandmarkDay(day) {
  AppState.filters.landmark.day = day;
  document.querySelectorAll('#landmarkDayPills .day-pill').forEach(el => el.classList.toggle('active', el.textContent.includes(day === 'all' ? '전체' : day.replace('DAY ', 'Day'))));
  UI.renderLandmark();
}

function selectLandmarkCat(cat) {
  AppState.filters.landmark.cat = cat;
  document.querySelectorAll('#landmarkCatFilter .cat-btn').forEach((el, i) => el.classList.toggle('active', i === ['all', ...LANDMARK_TYPES].indexOf(cat)));
  UI.renderLandmark();
}

function switchTab(tab) {
  AppState.tab = tab;
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', ['food','landmark','schedule','route','saved'][i] === tab));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  if (tab === 'landmark') UI.renderLandmark();
  if (tab === 'saved') UI.renderSaved();
  if (tab === 'route') UI.renderRoute(ROUTES);
  if (tab === 'schedule') UI.renderSchedule();
}

function onLandmarkSearch(val) {
  AppState.filters.landmark.search = val.trim();
  UI.renderLandmark();
}

function selectRouteDay(day) {
  AppState.route.day = day;
  document.querySelectorAll('.route-day-btn').forEach(btn => btn.classList.toggle('active', btn.textContent === day));
  UI.renderRoute(ROUTES);
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
  if (AppState.saved.has(name)) AppState.saved.delete(name);
  else AppState.saved.add(name);
  localStorage.setItem('pt_saved', JSON.stringify([...AppState.saved]));
  UI.renderFood();
  UI.showToast(AppState.saved.has(name) ? '⭐ 저장됨!' : '저장 해제');
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
  AppState.tab = 'food';
  AppState.filters.food.day = 'all';
  AppState.filters.food.cat = 'all';
  AppState.filters.food.nearbyLandmark = null;
  AppState.filters.food.search = foodName;
  document.getElementById('searchInput').value = foodName;
  switchTab('food');
  UI.renderFood();
}

function filterByLandmark() {
  const name = AppState.ui.tagPopupLandmark;
  AppState.filters.food.nearbyLandmark = name;
  document.getElementById('landmarkFilterName').textContent = name;
  document.getElementById('landmarkFilterBar').classList.add('active');
  UI.closeTagPopup();
  UI.renderFood();
  UI.showToast(`📍 ${name} 근처 맛집`);
}

function clearLandmarkFilter() {
  AppState.filters.food.nearbyLandmark = null;
  document.getElementById('landmarkFilterBar').classList.remove('active');
  UI.renderFood();
}

function goToNearbyFood(landmarkName) {
  UI.closeGuide();
  UI.closeModal();
  AppState.filters.food.nearbyLandmark = landmarkName;
  const hasGPS = !!PLACE_COORDS[landmarkName];
  const gpsNearby = hasGPS ? DataService.getNearbyFoodsByGPS(landmarkName, 500) : [];
  const useGPS = gpsNearby.length > 0;
  const filterText = useGPS ? `${landmarkName} (500m 이내)` : `${landmarkName} 근처`;
  document.getElementById('landmarkFilterName').textContent = filterText;
  document.getElementById('landmarkFilterBar').classList.add('active');
  switchTab('food');
  UI.renderFood();
  if (useGPS) UI.showToast(`🍽️ ${landmarkName} 500m 이내 ${gpsNearby.length}곳`);
  else {
    const fallbackCount = DataService.getFoodsByLandmark(landmarkName).length;
    UI.showToast(`🍽️ ${landmarkName} 근처 ${fallbackCount}곳`);
  }
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
    AppState.filters.food.search = '';
    AppState.filters.food.day = 'all';
    AppState.filters.food.cat = 'all';
    UI.buildDayPills(); 
    UI.buildCatFilter();
  } else {
    document.getElementById('landmarkSearchInput').value = '';
    AppState.filters.landmark.search = '';
    AppState.filters.landmark.day = 'all';
    AppState.filters.landmark.cat = 'all';
    UI.buildLandmarkDayFilter();
    UI.buildLandmarkCatFilter();
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

// ── SETTINGS & AI (간략화) ──
function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  const btn = document.getElementById('settingsBtn');
  const isOpen = panel.classList.contains('open');
  if (!isOpen) {
    refreshApiStatus();
    switchProvider('openrouter', false);
    // [AI] 설정 창 열 때 저장된 키 표시
    const keyInput = document.getElementById('apiKeyInput');
    if (keyInput) keyInput.value = localStorage.getItem('pt_api_key') || '';
    refreshModelSelection();
  }
  panel.classList.toggle('open', !isOpen);
  btn.classList.toggle('active', !isOpen);
}

function switchProvider(provider, save=true) {
  AppState.ai.provider = 'openrouter';
  
  const secOpen = document.getElementById('section-openrouter');
  if(secOpen) secOpen.style.display = 'block';
  
  ['google', 'anthropic'].forEach(p => {
    const sec = document.getElementById('section-' + p);
    if(sec) sec.style.display = 'none';
    const tab = document.getElementById('tab-' + p);
    if(tab) tab.style.display = 'none';
  });

  const tabOpen = document.getElementById('tab-openrouter');
  if(tabOpen) tabOpen.classList.add('active');
  
  refreshApiStatus();
}

function selectModel(modelId, el) {
  AIService.setModel(modelId);
  el.closest('.model-list').querySelectorAll('.model-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

function refreshModelSelection() {
  document.querySelectorAll('.model-option').forEach(el => {
    const onclick = el.getAttribute('onclick') || '';
    const match = onclick.match(/'([^']+)'/);
    if (match && match[1] === AppState.ai.model) el.classList.add('selected');
    else el.classList.remove('selected');
  });
}

function refreshApiStatus() {
  const el = document.getElementById('apiStatus');
  el.innerHTML = '<div class="settings-status status-ok">✅ 연결됨 · 🔀 OpenRouter · AI 사용 가능</div>';
}

function saveApiKey() {
  // [AI] 입력된 키 저장 로직 복구
  const keyInput = document.getElementById('apiKeyInput');
  if (keyInput && keyInput.value.trim()) {
    AIService.setKey(keyInput.value.trim());
  }
  UI.showToast('✅ 설정 저장 완료!');
  refreshApiStatus();
  const btn = document.getElementById('settingsBtn');
  btn.style.borderColor = 'var(--green)';
  btn.style.color = 'var(--green)';
  document.getElementById('settingsPanel').classList.remove('open');
  document.getElementById('settingsBtn').classList.remove('active');
}

function toggleAI() {
  AppState.ai.open = !AppState.ai.open;
  document.getElementById('aiPanel').classList.toggle('open', AppState.ai.open);
  if (AppState.ai.open) setTimeout(() => document.getElementById('aiInput').focus(), 400);
}

function askSuggestion(text) {
  document.getElementById('aiInput').value = text;
  sendAI();
}

async function sendAI() {
  const input = document.getElementById('aiInput');
  const msg = input.value.trim();
  if (!msg || AppState.ai.loading) return;
  
  input.value = '';
  AppState.ai.loading = true;
  document.getElementById('aiSend').disabled = true;
  addMsg(msg, 'user');
  const loadingEl = addMsg('⏳ 분석 중...', 'ai loading');
  scrollAI();
  
  let fullReply = '';
  let isFirstChunk = true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20초 타임아웃

    await AIService.fetchResponse(msg, controller.signal, (chunk) => {
      if (isFirstChunk) {
        loadingEl.innerHTML = ''; // "분석 중..." 메시지 지우기
        loadingEl.classList.remove('loading');
        isFirstChunk = false;
      }
      fullReply += chunk;
      loadingEl.innerHTML = fullReply.replace(/\n/g, '<br>');
      scrollAI();
    });
    clearTimeout(timeoutId);

    loadingEl.className = 'msg msg-ai';
    // 최종 완료 후 링크 변환 적용
    loadingEl.innerHTML = fullReply.replace(/\n/g, '<br>').replace(/\[([^\]]+)\]\s*\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--blue);text-decoration:underline">$1</a>');
  } catch(e) {
    loadingEl.className = 'msg msg-ai';
    let userMsg = '⚠️ 오류: ' + e.message;
    if (e.name === 'AbortError') userMsg = '⚠️ 응답 시간이 초과되었습니다. 다시 시도해주세요.';
    loadingEl.innerHTML = userMsg;
    console.error(e);
  }
  AppState.ai.loading = false;
  document.getElementById('aiSend').disabled = false;
  scrollAI();
}

function addMsg(text, type) {
  const el = document.createElement('div');
  el.className = `msg msg-${type.includes('ai') ? 'ai' : 'user'}${type.includes('loading')?' loading':''}`;
  el.textContent = text;
  document.getElementById('aiMessages').appendChild(el);
  return el;
}

function scrollAI() {
  const msgs = document.getElementById('aiMessages');
  setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 50);
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
window.toggleSettings = toggleSettings;
window.switchProvider = switchProvider;
window.selectModel = selectModel;
window.saveApiKey = saveApiKey;
window.resetApp = resetApp;
window.toggleAI = toggleAI;
window.askSuggestion = askSuggestion;
window.sendAI = sendAI;
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

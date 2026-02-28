
// ═══════════════════════════════════════════════════════════════════════════
// APP LOGIC & STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

const FOOD_TYPES = ['cafe', 'dessert', 'seafood', 'restaurant', 'budget'];
const LANDMARK_TYPES = ['landmark', 'church', 'viewpoint', 'square', 'transport'];
const FIXED_OPENROUTER_KEY = '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';

// [3단계] 상태 객체 도입 (State Object)
const AppState = {
  tab: 'food',
  filters: {
    food: { day: 'all', cat: 'all', search: '', nearbyLandmark: null },
    landmark: { day: 'all', cat: 'all', search: '' }
  },
  route: { day: 'DAY 7' },
  ui: { tagPopupLandmark: null },
  saved: new Set(JSON.parse(localStorage.getItem('pt_saved') || '[]')),
  ai: {
    open: false,
    loading: false,
    provider: 'openrouter',
    model: localStorage.getItem('pt_model') || 'google/gemini-2.0-flash-lite-preview-02-05:free'
  }
};

// 데이터 변환: PLACES → 날짜별 구조
function buildAppData() {
  const dayMap = {};
  ITINERARY.forEach(d => {
    dayMap[d.day] = { dayNum: d.day, title: `${d.date} — ${d.title.split('—')[1]?.trim() || d.title}`, categories: {} };
  });
  
  PLACES.forEach((place, idx) => {
    place.days.forEach(dayKey => {
      if (!dayMap[dayKey]) return;
      const cat = TYPE_LABELS[place.type] || '🍴 기타';
      if (!dayMap[dayKey].categories[cat]) dayMap[dayKey].categories[cat] = [];
      dayMap[dayKey].categories[cat].push({
        ...place,
        rank: dayMap[dayKey].categories[cat].length + 1,
        day: dayKey,
        category: cat,
        meta: `★ ${place.rating}${place.price}${place.hours}`
      });
    });
  });
  
  const foodByDay = Object.values(dayMap).map(d => ({
    ...d,
    categories: Object.entries(d.categories).map(([cat, places]) => ({ category: cat, places }))
  }));
  
  const allPlaces = PLACES.flatMap((place, idx) => 
    place.days.map(dayKey => ({
      ...place,
      day: dayKey,
      category: TYPE_LABELS[place.type],
      rank: idx + 1,
      meta: `★ ${place.rating}${place.price}${place.hours}`
    }))
  );
  
  const itinerary = ITINERARY.map((d, i) => ({
    id: i + 1,
    dayLabel: d.day + d.date.split(' ')[0],
    title: d.title,
    schedule: d.schedule,
    tips: d.tips,
    transport: d.transport
  }));
  
  return { foodByDay, allPlaces, itinerary };
}

const APP_DATA = buildAppData();

let isAppInitialized = false;

function init() {
  if (isAppInitialized) return;
  isAppInitialized = true;

  if (typeof APP_CONFIG !== 'undefined') {
    document.title = `${APP_CONFIG.flag} ${APP_CONFIG.title}`;
    document.getElementById('appTitle').textContent = `${APP_CONFIG.flag} ${APP_CONFIG.title}`;
    document.getElementById('appDates').textContent = `${APP_CONFIG.dates} · ${APP_CONFIG.duration} 여행 가이드`;
  }
  
  // UI 초기화 함수 호출 (ui-components.js에 정의됨)
  if (typeof setupEventDelegation === 'function') setupEventDelegation();
  
  // 스켈레톤 UI 표시 (초기 로딩 체감 속도 향상)
  if (typeof renderSkeleton === 'function') {
    renderSkeleton('placeList');
    renderSkeleton('landmarkList');
    renderSkeleton('scheduleList');
  }

  // 실제 데이터 렌더링 (UI 스레드 양보를 위해 지연 실행)
  setTimeout(() => {
    if (typeof buildDayPills === 'function') buildDayPills();
    if (typeof buildCatFilter === 'function') buildCatFilter();
    if (typeof renderFood === 'function') renderFood();
    if (typeof buildLandmarkDayFilter === 'function') buildLandmarkDayFilter();
    if (typeof buildLandmarkCatFilter === 'function') buildLandmarkCatFilter();
    if (typeof renderSchedule === 'function') renderSchedule();
  }, 10);

  const hasKey = FIXED_OPENROUTER_KEY;
  if (hasKey) {
    const btn = document.getElementById('settingsBtn');
    if (btn) { btn.style.borderColor = 'var(--green)'; btn.style.color = 'var(--green)'; }
  }
}

// ── 유틸리티 함수 ──
function getLandmarkToFoods() {
  const mapping = {};
  if (typeof NEARBY_LANDMARKS !== 'undefined') {
    Object.entries(NEARBY_LANDMARKS).forEach(([food, landmarks]) => {
      landmarks.forEach(lm => {
        if (!mapping[lm]) mapping[lm] = [];
        if (!mapping[lm].includes(food)) mapping[lm].push(food);
      });
    });
  }
  return mapping;
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getNearbyFoodsByGPS(landmarkName, radiusMeters = 500) {
  const landmarkCoords = typeof PLACE_COORDS !== 'undefined' ? PLACE_COORDS[landmarkName] : null;
  if (!landmarkCoords) return [];
  
  const nearbyFoods = [];
  PLACES.forEach(p => {
    if (!FOOD_TYPES.includes(p.type)) return;
    const foodCoords = PLACE_COORDS[p.name];
    if (!foodCoords) return;
    
    const distance = getDistance(landmarkCoords.lat, landmarkCoords.lng, foodCoords.lat, foodCoords.lng);
    if (distance <= radiusMeters) {
      nearbyFoods.push({ name: p.name, distance: Math.round(distance) });
    }
  });
  return nearbyFoods.sort((a, b) => a.distance - b.distance);
}

function hasNearbyFoods(landmarkName) {
  if (typeof PLACE_COORDS !== 'undefined' && PLACE_COORDS[landmarkName]) {
    const nearby = getNearbyFoodsByGPS(landmarkName, 500);
    if (nearby.length > 0) return true;
  }
  const mapping = getLandmarkToFoods();
  return mapping[landmarkName] && mapping[landmarkName].length > 0;
}

function getNearbyFoodsList(landmarkName) {
  const result = [];
  const lmCoords = typeof PLACE_COORDS !== 'undefined' ? PLACE_COORDS[landmarkName] : null;
  if (!lmCoords) return result;
  const foods = PLACES.filter(p => FOOD_TYPES.includes(p.type));
  foods.forEach(food => {
    const coords = PLACE_COORDS[food.name];
    if (!coords) return;
    const dist = getDistance(lmCoords.lat, lmCoords.lng, coords.lat, coords.lng);
    if (dist <= 500) result.push({ ...food, distance: dist });
  });
  result.sort((a, b) => a.distance - b.distance);
  return result;
}

// ── 상태 변경 및 이벤트 핸들러 ──
function selectDay(day) {
  AppState.filters.food.day = day;
  document.querySelectorAll('#dayPills .day-pill').forEach(el => el.classList.toggle('active', el.textContent.includes(day === 'all' ? '전체' : day.replace('DAY ', 'Day'))));
  renderFood();
}

function selectCat(cat) {
  AppState.filters.food.cat = cat;
  document.querySelectorAll('#catFilter .cat-btn').forEach((el, i) => el.classList.toggle('active', i === ['all', ...FOOD_TYPES].indexOf(cat)));
  renderFood();
}

function onSearch(val) {
  AppState.filters.food.search = val.trim();
  renderFood();
}

function getFilteredPlaces() {
  let places = APP_DATA.allPlaces;
  if (!AppState.filters.food.nearbyLandmark) {
    if (AppState.filters.food.day !== 'all') places = places.filter(p => p.day === AppState.filters.food.day);
    if (AppState.filters.food.cat !== 'all') places = places.filter(p => p.type === AppState.filters.food.cat);
  }
  if (AppState.filters.food.search) {
    const q = AppState.filters.food.search.toLowerCase();
    places = places.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (AppState.filters.food.nearbyLandmark) {
    let nearbyNames = [];
    if (typeof PLACE_COORDS !== 'undefined' && PLACE_COORDS[AppState.filters.food.nearbyLandmark]) {
      const nearbyFoods = getNearbyFoodsByGPS(AppState.filters.food.nearbyLandmark, 500);
      nearbyNames = nearbyFoods.map(f => f.name);
    }
    if (nearbyNames.length === 0) {
      const mapping = getLandmarkToFoods();
      nearbyNames = mapping[AppState.filters.food.nearbyLandmark] || [];
    }
    places = places.filter(p => nearbyNames.includes(p.name));
  }
  const seen = new Set();
  return places.filter(p => {
    const key = AppState.filters.food.nearbyLandmark ? p.name : (p.name + p.day);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getFilteredLandmarks() {
  let places = PLACES.filter(p => LANDMARK_TYPES.includes(p.type));
  if (AppState.filters.landmark.day !== 'all') places = places.filter(p => p.days && p.days.includes(AppState.filters.landmark.day));
  if (AppState.filters.landmark.cat !== 'all') places = places.filter(p => p.type === AppState.filters.landmark.cat);
  if (AppState.filters.landmark.search) {
    const q = AppState.filters.landmark.search.toLowerCase();
    places = places.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  return places;
}

function selectLandmarkDay(day) {
  AppState.filters.landmark.day = day;
  document.querySelectorAll('#landmarkDayPills .day-pill').forEach(el => el.classList.toggle('active', el.textContent.includes(day === 'all' ? '전체' : day.replace('DAY ', 'Day'))));
  renderLandmark();
}

function selectLandmarkCat(cat) {
  AppState.filters.landmark.cat = cat;
  document.querySelectorAll('#landmarkCatFilter .cat-btn').forEach((el, i) => el.classList.toggle('active', i === ['all', ...LANDMARK_TYPES].indexOf(cat)));
  renderLandmark();
}

function switchTab(tab) {
  AppState.tab = tab;
  document.querySelectorAll('.tab').forEach((t, i) => t.classList.toggle('active', ['food','landmark','schedule','route','saved'][i] === tab));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  if (tab === 'landmark') renderLandmark();
  if (tab === 'saved') renderSaved();
  if (tab === 'route') renderRoute();
  if (tab === 'schedule') renderSchedule();
}

function onLandmarkSearch(val) {
  AppState.filters.landmark.search = val.trim();
  renderLandmark();
}

function selectRouteDay(day) {
  AppState.route.day = day;
  document.querySelectorAll('.route-day-btn').forEach(btn => btn.classList.toggle('active', btn.textContent === day));
  renderRoute();
}

function showPlaceFromRoute(idOrName) {
  let placeName = idOrName;
  if (typeof MASTER_PLACES !== 'undefined' && MASTER_PLACES[idOrName]) placeName = MASTER_PLACES[idOrName].name;
  if (typeof PLACE_GUIDES !== 'undefined' && PLACE_GUIDES[placeName]) openGuide(placeName);
  else {
    const place = PLACES.find(p => p.name === placeName);
    if (place) showModal(place);
    else openGuide(placeName);
  }
}

function toggleSave(name) {
  if (AppState.saved.has(name)) AppState.saved.delete(name);
  else AppState.saved.add(name);
  localStorage.setItem('pt_saved', JSON.stringify([...AppState.saved]));
  renderFood();
  if (typeof showToast === 'function') showToast(AppState.saved.has(name) ? '⭐ 저장됨!' : '저장 해제');
}

function openMap(searchNameOrAddr, placeName) {
  const query = searchNameOrAddr || placeName || '';
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
}

function openDirections(placeName) {
  let query = placeName;
  if (typeof PLACE_COORDS !== 'undefined' && PLACE_COORDS[placeName]) query = `${PLACE_COORDS[placeName].lat},${PLACE_COORDS[placeName].lng}`;
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
  renderFood();
}

function filterByLandmark() {
  const name = AppState.ui.tagPopupLandmark;
  AppState.filters.food.nearbyLandmark = name;
  document.getElementById('landmarkFilterName').textContent = name;
  document.getElementById('landmarkFilterBar').classList.add('active');
  closeTagPopup();
  renderFood();
  showToast(`📍 ${name} 근처 맛집`);
}

function clearLandmarkFilter() {
  AppState.filters.food.nearbyLandmark = null;
  document.getElementById('landmarkFilterBar').classList.remove('active');
  renderFood();
}

function goToNearbyFood(landmarkName) {
  closeGuide();
  closeModal();
  AppState.filters.food.nearbyLandmark = landmarkName;
  const hasGPS = typeof PLACE_COORDS !== 'undefined' && PLACE_COORDS[landmarkName];
  const gpsNearby = hasGPS ? getNearbyFoodsByGPS(landmarkName, 500) : [];
  const useGPS = gpsNearby.length > 0;
  const filterText = useGPS ? `${landmarkName} (500m 이내)` : `${landmarkName} 근처`;
  document.getElementById('landmarkFilterName').textContent = filterText;
  document.getElementById('landmarkFilterBar').classList.add('active');
  switchTab('food');
  renderFood();
  if (useGPS) showToast(`🍽️ ${landmarkName} 500m 이내 ${gpsNearby.length}곳`);
  else {
    const mapping = getLandmarkToFoods();
    const fallbackCount = (mapping[landmarkName] || []).length;
    showToast(`🍽️ ${landmarkName} 근처 ${fallbackCount}곳`);
  }
}

function findMyLocation() {
  if (!navigator.geolocation) { showToast('❌ 위치 정보를 지원하지 않는 브라우저입니다.'); return; }
  showToast('📍 위치를 찾는 중...');
  navigator.geolocation.getCurrentPosition(
    (pos) => showNearbyPlacesFromUser(pos.coords.latitude, pos.coords.longitude),
    (err) => { console.error(err); showToast('❌ 위치 정보를 가져올 수 없습니다.'); },
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
    buildDayPills(); 
    buildCatFilter();
  } else {
    document.getElementById('landmarkSearchInput').value = '';
    AppState.filters.landmark.search = '';
    AppState.filters.landmark.day = 'all';
    AppState.filters.landmark.cat = 'all';
    buildLandmarkDayFilter();
    buildLandmarkCatFilter();
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
    showToast('❌ 주변 5km 이내 장소 없음');
    return;
  }
  renderNearbyList(nearby, containerId);
  showToast(`📍 내 주변 ${nearby.length}곳 발견!`);
}

// ── SETTINGS & AI (간략화) ──
function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  const btn = document.getElementById('settingsBtn');
  const isOpen = panel.classList.contains('open');
  if (!isOpen) {
    refreshApiStatus();
    switchProvider('openrouter', false);
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
  AppState.ai.model = modelId;
  localStorage.setItem('pt_model', modelId);
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
  localStorage.setItem('pt_model', AppState.ai.model);
  showToast('✅ 설정 저장 완료!');
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
  
  const provider = 'openrouter';
  const apiKey = FIXED_OPENROUTER_KEY;
  console.log('[AI] Using Fixed OpenRouter Key');
  
  const SAFE_MODELS = [
    'google/gemini-2.0-flash-lite-preview-02-05:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'openrouter/free'
  ];
  
  let model = localStorage.getItem('pt_model') || 'google/gemini-2.0-flash-lite-preview-02-05:free';
  if (!SAFE_MODELS.includes(model)) {
    model = 'google/gemini-2.0-flash-lite-preview-02-05:free';
    localStorage.setItem('pt_model', model);
  }
  
  input.value = '';
  AppState.ai.loading = true;
  document.getElementById('aiSend').disabled = true;
  addMsg(msg, 'user');
  const loadingEl = addMsg('⏳ 분석 중...', 'ai loading');
  scrollAI();
  const dayContext = APP_DATA.foodByDay.map(d => d.dayNum + '(' + d.title + '): ' + d.categories.map(c => c.places.slice(0,3).map(p => p.name + '(★' + p.rating + ')').join(',')).join(' | ')).join('\n');
  const itinContext = APP_DATA.itinerary.slice(0,5).map(d => d.dayLabel + ' ' + d.title + ': ' + d.schedule.slice(0,4).map(s => s.activity).join(', ')).join('\n');
  const systemPrompt = '당신은 포르투갈 여행 전문 AI 어시스턴트입니다. 2026년 5월 1-10일 포르투갈 여행을 도와줍니다.\n\n[맛집 DB]\n' + dayContext + '\n\n[일정]\n' + itinContext + '\n\n규칙: 한국어, 이모지 사용, 구체적 식당명·평점 언급. 장소 추천 시 구글 지도 검색 링크([장소명](https://www.google.com/maps/search/?api=1&query=장소명))를 포함하세요. 3-5문장 간결하게';
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + apiKey, 
        'HTTP-Referer': 'https://portugal-travel-app', 
        'X-Title': 'Portugal Travel 2026' 
      }, 
      body: JSON.stringify({ 
        model: model, 
        max_tokens: 1000, 
        messages: [ {role: 'system', content: systemPrompt}, {role: 'user', content: msg} ] 
      }) 
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error Details:', data);
      throw new Error(data?.error?.message || 'OpenRouter API Error ' + response.status);
    }
    
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'AI로부터 응답을 받지 못했어요. (빈 응답)';
    
    loadingEl.className = 'msg msg-ai';
    loadingEl.innerHTML = reply.replace(/\n/g, '<br>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--blue);text-decoration:underline">$1</a>');
  } catch(e) {
    loadingEl.className = 'msg msg-ai';
    loadingEl.innerHTML = '⚠️ 오류: ' + e.message;
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

document.addEventListener('DOMContentLoaded', init);

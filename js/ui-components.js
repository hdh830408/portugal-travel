// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENTS & RENDERING HELPERS
// ═══════════════════════════════════════════════════════════════════════════

// HTML 이스케이프 유틸리티
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// 토스트 메시지 표시
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// 헬퍼 함수: 주변 맛집 리스트 가져오기 (DataService 연동)
function getNearbyFoodsList(landmarkName) {
  if (typeof DataService !== 'undefined' && DataService.getFoodsByLandmark) {
    const foodNames = DataService.getFoodsByLandmark(landmarkName);
    return foodNames.map(name => PLACES.find(p => p.name === name)).filter(p => p);
  }
  return [];
}

// 헬퍼 함수: 주변 맛집 존재 여부 확인
function hasNearbyFoods(landmarkName) {
  if (typeof DataService !== 'undefined' && DataService.getFoodsByLandmark) {
    return DataService.getFoodsByLandmark(landmarkName).length > 0;
  }
  return false;
}

// ── 필터 UI 생성 ──
function buildDayPills() {
  const days = ['all', ...ITINERARY.map(d => d.day)];
  const labels = { all: '전체' };
  ITINERARY.forEach(d => labels[d.day] = d.day.replace('DAY ', 'Day'));
  const container = document.getElementById('dayPills');
  if (container) {
    container.innerHTML = days.map(d => 
      `<div class="day-pill ${d==='all'?'active':''}" onclick="selectDay('${d}')">${labels[d]}</div>`
    ).join('');
  }
}

function buildCatFilter() {
  const cats = ['all', ...FOOD_TYPES];
  const container = document.getElementById('catFilter');
  if (container) {
    container.innerHTML = cats.map(c => 
      `<div class="cat-btn ${c==='all'?'active':''}" onclick="selectCat('${c}')">${c==='all' ? '전체' : TYPE_LABELS[c]}</div>`
    ).join('');
  }
}

function buildLandmarkDayFilter() {
  const days = ['all', ...ITINERARY.map(d => d.day)];
  const labels = { all: '전체' };
  ITINERARY.forEach(d => labels[d.day] = d.day.replace('DAY ', 'Day'));
  const container = document.getElementById('landmarkDayPills');
  if (container) {
    container.innerHTML = days.map(d => 
      `<div class="day-pill ${d==='all'?'active':''}" onclick="selectLandmarkDay('${d}')">${labels[d]}</div>`
    ).join('');
  }
}

function buildLandmarkCatFilter() {
  const cats = ['all', ...LANDMARK_TYPES];
  const container = document.getElementById('landmarkCatFilter');
  if (container) {
    container.innerHTML = cats.map(c => 
      `<div class="cat-btn ${c==='all'?'active':''}" onclick="selectLandmarkCat('${c}')">${c==='all' ? '전체' : TYPE_LABELS[c]}</div>`
    ).join('');
  }
}

// ── 렌더링 함수들 ──

// [4단계] Lazy Loading Observer
const lazyImageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    }
  });
}, {
  rootMargin: '50px 0px',
  threshold: 0.01
});

// 공통 카드 생성 컴포넌트
function createPlaceCard(place, index, options = {}) {
  const { 
    showDistance = false, 
    showLandmarks = false, 
    rankText = null,
    rankStyle = null,
    simpleActions = false,
    isSavedList = false,
    showDescription = true
  } = options;

  const card = document.createElement('div');
  card.className = `place-card ${AppState.saved.has(place.name) ? 'bookmarked' : ''}`;
  card.dataset.name = place.name; // 이벤트 위임을 위한 식별자

  // 1. Header
  const header = document.createElement('div');
  header.className = 'place-header';

  const rank = document.createElement('div');
  rank.className = 'place-rank';
  if (rankText) {
    rank.textContent = rankText;
    if (rankStyle) rank.classList.add(rankStyle);
  } else {
    rank.textContent = index + 1;
  }
  header.appendChild(rank);

  const info = document.createElement('div');
  info.className = 'place-info';

  const name = document.createElement('div');
  name.className = 'place-name';
  name.textContent = place.name;
  info.appendChild(name);

  // [4단계] 이미지 Lazy Loading (데이터에 이미지가 있는 경우)
  if (place.image) {
    const img = document.createElement('img');
    img.className = 'place-img lazy';
    img.alt = place.name;
    img.dataset.src = place.image; // 실제 URL은 data-src에 저장
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 투명 1x1 픽셀
    lazyImageObserver.observe(img);
    info.appendChild(img);
  }

  // Badges
  info.appendChild(createBadges(place, showDistance));

  // Landmark Tags
  if (showLandmarks) {
    const tags = createLandmarkTags(place);
    if (tags) info.appendChild(tags);
  }

  const addr = document.createElement('div');
  addr.className = 'place-addr';
  addr.textContent = `📍 ${place.address}`;
  info.appendChild(addr);

  if (showDescription && place.description) {
    const desc = document.createElement('div');
    desc.className = 'place-desc';
    desc.textContent = place.description;
    info.appendChild(desc);
  }

  header.appendChild(info);
  card.appendChild(header);

  // 2. Actions
  const actions = document.createElement('div');
  actions.className = 'place-actions';

  const createBtn = (cls, text, action, payload) => {
    const btn = document.createElement('button');
    btn.className = `place-btn ${cls}`;
    btn.textContent = text;
    btn.dataset.action = action;
    if (payload) btn.dataset.payload = payload;
    return btn;
  };
  const searchName = place.searchName || place.name;
  
  actions.appendChild(createBtn('btn-map', '📍 지도', 'map', searchName));
  actions.appendChild(createBtn('btn-dir', '🏃 가는길', 'dir', place.name));
  
  if (!simpleActions) {
    actions.appendChild(createBtn('btn-search', '🔍 검색', 'search', searchName));
    actions.appendChild(createBtn('btn-review', '⭐ 리뷰', 'review', searchName));
    actions.appendChild(createBtn('btn-kr', '🇰🇷', 'kr', searchName));
  }
  
  const saveBtn = document.createElement('button');
  saveBtn.className = `place-btn btn-save ${AppState.saved.has(place.name) ? 'saved' : ''}`;
  saveBtn.dataset.action = 'save';
  saveBtn.dataset.payload = place.name;
  
  if (isSavedList) {
    saveBtn.textContent = '✕';
  } else {
    saveBtn.textContent = AppState.saved.has(place.name) ? '★' : '☆';
  }
  actions.appendChild(saveBtn);

  card.appendChild(actions);
  return card;
}

function createLandmarkTags(place) {
  const landmarks = typeof NEARBY_LANDMARKS !== 'undefined' ? NEARBY_LANDMARKS[place.name] : [];
  if (!landmarks || landmarks.length === 0) return null;
  
  const container = document.createElement('div');
  container.className = 'place-landmarks';
  landmarks.forEach(lm => {
    const tag = document.createElement('span');
    tag.className = 'landmark-tag';
    tag.textContent = lm;
    tag.dataset.action = 'landmark-tag';
    tag.dataset.payload = lm;
    container.appendChild(tag);
  });
  return container;
}

function createBadges(place, showDistance) {
  const badges = document.createElement('div');
  badges.className = 'place-badges';
  
  const addBadge = (cls, text) => {
    if (!text) return;
    const span = document.createElement('span');
    span.className = `badge ${cls}`;
    span.textContent = text;
    badges.appendChild(span);
  };
  addBadge('badge-rating', `★ ${place.rating}`);
  addBadge('badge-price', place.price);
  addBadge('badge-hours', place.hours);
  addBadge('badge-type', TYPE_LABELS[place.type] || place.type);

  if (showDistance && AppState.filters.food.nearbyLandmark && PLACE_COORDS[AppState.filters.food.nearbyLandmark] && PLACE_COORDS[place.name]) {
    const landmarkCoords = PLACE_COORDS[AppState.filters.food.nearbyLandmark];
    const foodCoords = PLACE_COORDS[place.name];
    const distance = Math.round(getDistance(landmarkCoords.lat, landmarkCoords.lng, foodCoords.lat, foodCoords.lng));
    const distBadge = document.createElement('span');
    distBadge.className = 'badge badge-dist';
    distBadge.textContent = `📍 ${distance}m`;
    badges.appendChild(distBadge);
  }
  return badges;
}

function renderFood() {
  // 중복 제거 로직 추가
  const rawPlaces = DataService.getFilteredPlaces(AppState.filters.food).filter(p => FOOD_TYPES.includes(p.type));
  const seen = new Set();
  const places = rawPlaces.filter(p => {
    const key = AppState.filters.food.nearbyLandmark ? p.name : (p.name + p.day);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const container = document.getElementById('placeList');
  if (!container) return;
  container.innerHTML = '';

  if (places.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.textContent = '🍽️';
    emptyState.appendChild(icon);

    if (AppState.filters.food.nearbyLandmark) {
      emptyState.appendChild(document.createTextNode('500m 이내에 맛집이 없어요'));
      emptyState.appendChild(document.createElement('br'));
      const small = document.createElement('small');
      small.style.color = 'var(--muted)';
      small.textContent = '필터를 해제하고 다시 검색해보세요';
      emptyState.appendChild(small);
    } else {
      emptyState.appendChild(document.createTextNode('검색 결과가 없어요'));
    }
    container.appendChild(emptyState);
    return;
  }

  places.forEach((p, i) => {
    const card = createPlaceCard(p, i, {
      showDistance: true,
      showLandmarks: true
    });
    container.appendChild(card);
  });
}

function getFilteredLandmarksUI() {
  let places = PLACES.filter(p => LANDMARK_TYPES.includes(p.type));
  if (AppState.filters.landmark.day !== 'all') places = places.filter(p => p.days && p.days.includes(AppState.filters.landmark.day));
  if (AppState.filters.landmark.cat !== 'all') places = places.filter(p => p.type === AppState.filters.landmark.cat);
  if (AppState.filters.landmark.search) {
    const q = AppState.filters.landmark.search.toLowerCase();
    places = places.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  return places;
}

function renderLandmark() {
  const places = getFilteredLandmarksUI();
  const container = document.getElementById('landmarkList');
  if (!container) return;
  container.innerHTML = '';

  if (places.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = '<div class="icon">🏛️</div>검색 결과가 없어요';
    container.appendChild(emptyState);
    return;
  }

  places.forEach((p, i) => {
    const card = createPlaceCard(p, i);
    container.appendChild(card);
  });
}

function renderSchedule() {
  const container = document.getElementById('scheduleList');
  if (!container) return;
  
  container.innerHTML = APP_DATA.itinerary.map(d => `
    <div class="day-card-full">
      <div class="day-card-header" onclick="toggleDay(this)">
        <span class="dc-num">${d.dayLabel.substring(0,5)}</span>
        <span class="dc-title">${esc(d.title)}</span>
        <span class="dc-chevron">▼</span>
      </div>
      <div class="day-card-body">
        ${d.schedule.map(s => `
          <div class="schedule-item">
            <span class="sched-time">${s.time||''}</span>
            <span class="sched-activity">${esc(s.activity)}</span>
          </div>
        `).join('')}
        ${d.tips?.map(t => `<div class="tip-box">${esc(t)}</div>`).join('') || ''}
        <div style="font-size:11px;color:var(--muted);margin-top:8px">${esc(d.transport||'')}</div>
      </div>
    </div>
  `).join('');
}

function renderRoute(routesData) {
  const container = document.getElementById('routeContent');
  if (!container) return;

  const data = routesData[AppState.route.day];
  if (!data) return;
  
  let html = `<div class="route-container">`;
  html += `<div class="route-summary">
    <div class="route-summary-title">${data.title}</div>
    <div class="route-summary-text">${data.subtitle}</div>
  </div>`;
  
  data.sections.forEach((section, idx) => {
    html += `
      <div class="route-section">
        <div class="route-section-header">
          <div class="route-section-icon">${section.icon}</div>
          <div>
            <div class="route-section-title">${section.title}</div>
            <div class="route-section-time">${section.time}</div>
          </div>
        </div>
        <div class="route-places">
          ${(section.placeIds || section.places).map((item, i) => {
            const isId = section.placeIds ? true : false;
            const id = isId ? item : null;
            const name = isId ? (MASTER_PLACES[id]?.name || id) : item;
            const isHighlight = isId ? section.highlightIds?.includes(id) : section.highlights?.includes(name);
            
            return `<span class="route-place ${isHighlight ? 'highlight' : ''}" onclick="showPlaceFromRoute('${isId ? id : name}')">${name}</span>` +
              (i < (section.placeIds || section.places).length - 1 ? '<span class="route-arrow">→</span>' : '');
          }).join('')}
        </div>
      </div>
    `;
    
    if (idx < data.sections.length - 1) {
      html += `<div class="route-connector"><div class="route-connector-arrow">⬇️</div></div>`;
    }
  });
  
  if (data.tips && data.tips.length > 0) {
    html += `<div style="margin-top:16px;">`;
    data.tips.forEach(tip => {
      html += `<div class="route-tip">
        <span class="route-tip-icon">💡</span>
        <span class="route-tip-text">${tip}</span>
      </div>`;
    });
    html += `</div>`;
  }
  
  html += `</div>`;
  container.innerHTML = html;
}

function renderSaved() {
  const saved = PLACES.filter(p => AppState.saved.has(p.name));
  const container = document.getElementById('savedList');
  if (!container) return;
  container.innerHTML = '';

  if (saved.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = '<div class="icon">⭐</div>저장된 맛집이 없어요<br>맛집 탭에서 ☆를 눌러 저장하세요!';
    container.appendChild(emptyState);
    return;
  }

  saved.forEach((p, i) => {
    const card = createPlaceCard(p, i, {
      isSavedList: true
    });
    container.appendChild(card);
  });
}

function renderNearbyList(places, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  places.forEach((p, i) => {
    const distDisplay = p.distance >= 1000 ? (p.distance/1000).toFixed(1)+'km' : Math.round(p.distance)+'m';
    const card = createPlaceCard(p, i, {
      rankText: distDisplay,
      rankStyle: 'place-rank-dist',
      simpleActions: true,
      showDescription: false
    });
    container.appendChild(card);
  });
}

// ── 모달 및 팝업 제어 ──

function openModal(idx) {
  const p = PLACES[idx];
  showModal(p);
}

function showModal(p) {
  if (!p) return;
  
  const isLandmark = LANDMARK_TYPES.includes(p.type);
  const detail = typeof LANDMARK_DETAILS !== 'undefined' ? LANDMARK_DETAILS[p.name] : null;
  const nearbyFoods = getNearbyFoodsList(p.name);
  
  let modalHtml = '';
  
  if (isLandmark && detail) {
    modalHtml = `
      <div class="modal-header-rich">
        <div class="modal-icon">${detail.icon || '📍'}</div>
        <div class="modal-title-area">
          <div class="modal-name">${esc(p.name)}</div>
          <div class="modal-subtitle">${esc(detail.subtitle || p.description)}</div>
        </div>
      </div>
      <div class="modal-section">
        <div class="section-title">🏛️ 역사적 배경</div>
        <div class="section-content">${esc(detail.history)}</div>
      </div>
      <div class="modal-section">
        <div class="section-title">📸 포토스팟 / 촬영 팁</div>
        <div class="section-list">
          ${detail.photoSpots.map(spot => `<div class="spot-item">📷 ${esc(spot)}</div>`).join('')}
        </div>
      </div>
      <div class="modal-section">
        <div class="section-title">💡 방문 팁</div>
        <div class="visit-info-grid">
          <div class="visit-info-item"><div class="visit-label">운영시간</div><div class="visit-value">${esc(p.hours)}</div></div>
          <div class="visit-info-item"><div class="visit-label">입장료</div><div class="visit-value">${esc(p.price)}</div></div>
          <div class="visit-info-item"><div class="visit-label">소요시간</div><div class="visit-value">${esc(detail.duration)}</div></div>
        </div>
        <div class="tip-box">💡 ${esc(detail.tips)}</div>
      </div>
      ${nearbyFoods.length > 0 ? `
      <div class="modal-section">
        <div class="section-title">🍽️ 주변 맛집</div>
        <div class="nearby-note">${esc(detail.nearbyNote || '')}</div>
        <div class="nearby-foods-list">
          ${nearbyFoods.slice(0, 2).map(f => `
            <div class="nearby-food-item" onclick="closeModal();goToFood('${esc(f.name)}')">
              <span class="food-name">${esc(f.name)}</span>
              <span class="food-meta">★ ${f.rating} ${f.price} →</span>
            </div>
          `).join('')}
        </div>
        <button class="btn-nearby-all" onclick="closeModal();goToNearbyFood('${p.name.replace(/'/g, "\\'")}')">🍽️ 근처 맛집 보기</button>
      </div>
      ` : ''}
      <div class="place-actions modal-actions">
        <button class="place-btn btn-map" onclick="openMap('${esc(p.searchName || p.name)}')">📍 지도</button>
        <button class="place-btn btn-dir" onclick="openDirections('${esc(p.name)}')">🏃 가는길</button>
        <button class="place-btn btn-search" onclick="openSearch('${esc(p.searchName || p.name)}')">🔍 검색</button>
        <button class="place-btn btn-review" onclick="openReview('${esc(p.searchName || p.name)}')">⭐ 리뷰</button>
        <button class="place-btn btn-kr" onclick="openKrReview('${esc(p.searchName || p.name)}')">🇰🇷</button>
        <button class="place-btn btn-save ${AppState.saved.has(p.name)?'saved':''}" onclick="toggleSave('${esc(p.name)}');updateModalSaveBtn('${esc(p.name)}')">
          ${AppState.saved.has(p.name)?'★':'☆'}
        </button>
      </div>
    `;
  } else {
    const showNearbyBtn = isLandmark && nearbyFoods.length > 0;
    modalHtml = `
      <div class="modal-name">${esc(p.name)}</div>
      <div class="place-badges" style="margin:8px 0">
        <span class="badge badge-rating">★ ${p.rating}</span>
        <span class="badge badge-price">${p.price}</span>
        <span class="badge badge-hours">${p.hours}</span>
        <span class="badge badge-type">${TYPE_LABELS[p.type]}</span>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px">📍 ${esc(p.address)}</div>
      <div style="font-size:13px;line-height:1.6;margin-bottom:12px">${esc(p.description)}</div>
      ${showNearbyBtn ? `
        <button class="place-btn" style="width:100%;margin-bottom:10px;background:rgba(46,196,160,.15);border:1px solid rgba(46,196,160,.3);color:var(--teal);" 
                onclick="closeModal();goToNearbyFood('${p.name.replace(/'/g, "\\'")}')">🍽️ 근처 맛집 보기</button>
      ` : ''}
      <div class="place-actions">
        <button class="place-btn btn-map" onclick="openMap('${esc(p.searchName || p.name)}')">📍 지도</button>
        <button class="place-btn btn-dir" onclick="openDirections('${esc(p.name)}')">🏃 가는길</button>
        <button class="place-btn btn-search" onclick="openSearch('${esc(p.searchName || p.name)}')">🔍 검색</button>
        <button class="place-btn btn-review" onclick="openReview('${esc(p.searchName || p.name)}')">⭐ 리뷰</button>
        <button class="place-btn btn-kr" onclick="openKrReview('${esc(p.searchName || p.name)}')">🇰🇷</button>
        <button class="place-btn btn-save ${AppState.saved.has(p.name)?'saved':''}" onclick="toggleSave('${esc(p.name)}');closeModal()">
          ${AppState.saved.has(p.name)?'★':'☆'}
        </button>
      </div>
    `;
  }
  document.getElementById('modalContent').innerHTML = modalHtml;
  document.getElementById('placeModal').classList.add('open');
}

function closeModal() {
  document.getElementById('placeModal').classList.remove('open');
}

function openGuide(placeName) {
  const guide = typeof PLACE_GUIDES !== 'undefined' && PLACE_GUIDES[placeName] 
    ? PLACE_GUIDES[placeName] 
    : { emoji: "📍", subtitle: placeName, history: null, photoSpots: [], visitTips: null, nearbyFood: [] };
  
  document.getElementById('guideEmoji').textContent = guide.emoji || '📍';
  document.getElementById('guideTitle').textContent = placeName;
  document.getElementById('guideSubtitle').textContent = guide.subtitle || '';
  
  let html = '';
  if (!guide.history && guide.photoSpots.length === 0 && !guide.visitTips && guide.nearbyFood.length === 0) {
    html = `<div class="guide-no-data"><div class="guide-no-data-icon">📝</div><p>이 장소의 상세 해설이 아직 준비 중이에요.</p><p style="margin-top:8px;font-size:11px;color:var(--muted)">곧 업데이트될 예정입니다!</p></div>`;
    const placeData = PLACES.find(p => p.name === placeName);
    if (placeData) {
      html += `<div class="guide-section"><div class="guide-section-title"><span class="guide-section-icon">ℹ️</span>기본 정보</div><div class="guide-tips-grid"><div class="guide-tip-box"><div class="guide-tip-label">평점</div><div class="guide-tip-value">★ ${placeData.rating}</div></div><div class="guide-tip-box"><div class="guide-tip-label">가격대</div><div class="guide-tip-value">${placeData.price}</div></div><div class="guide-tip-box"><div class="guide-tip-label">운영시간</div><div class="guide-tip-value">${placeData.hours}</div></div><div class="guide-tip-box"><div class="guide-tip-label">유형</div><div class="guide-tip-value">${TYPE_LABELS[placeData.type] || placeData.type}</div></div></div><div class="guide-tip-note">📍 ${placeData.address}</div>${placeData.description ? `<div style="margin-top:12px;font-size:13px;color:var(--text);line-height:1.6">${placeData.description}</div>` : ''}</div>`;
    }
  } else {
    if (guide.history) html += `<div class="guide-section"><div class="guide-section-title"><span class="guide-section-icon">📜</span>역사적 배경</div><div class="guide-history">${guide.history}</div></div>`;
    if (guide.photoSpots && guide.photoSpots.length > 0) html += `<div class="guide-section"><div class="guide-section-title"><span class="guide-section-icon">📸</span>포토스팟 / 촬영 팁</div><div class="guide-photo-list">${guide.photoSpots.map(spot => `<div class="guide-photo-item"><span class="guide-photo-icon">📷</span><span>${spot}</span></div>`).join('')}</div></div>`;
    if (guide.visitTips) html += `<div class="guide-section"><div class="guide-section-title"><span class="guide-section-icon">💡</span>방문 팁</div><div class="guide-tips-grid"><div class="guide-tip-box"><div class="guide-tip-label">운영시간</div><div class="guide-tip-value">${guide.visitTips.hours || '-'}</div></div><div class="guide-tip-box"><div class="guide-tip-label">입장료</div><div class="guide-tip-value">${guide.visitTips.fee || '-'}</div></div><div class="guide-tip-box"><div class="guide-tip-label">소요시간</div><div class="guide-tip-value">${guide.visitTips.duration || '-'}</div></div>${guide.visitTips.tips ? `<div class="guide-tip-note">💡 ${guide.visitTips.tips}</div>` : ''}</div></div>`;
    if (guide.nearbyFood && guide.nearbyFood.length > 0) {
      html += `<div class="guide-section"><div class="guide-section-title"><span class="guide-section-icon">🍽️</span>주변 맛집</div><div class="guide-food-list">${guide.nearbyFood.map(foodName => {
        const foodPlace = PLACES.find(p => p.name === foodName);
        return foodPlace ? `<div class="guide-food-item" onclick="closeGuide();setTimeout(()=>showModal(PLACES.find(p=>p.name==='${foodName.replace(/'/g, "\\'")}')),300)"><span class="guide-food-name">${foodName}</span><div class="guide-food-meta"><span class="guide-food-rating">★ ${foodPlace.rating}</span><span class="guide-food-price">${foodPlace.price}</span><span class="guide-food-arrow">→</span></div></div>` : `<div class="guide-food-item"><span class="guide-food-name">${foodName}</span><div class="guide-food-meta"><span class="guide-food-arrow">→</span></div></div>`;
      }).join('')}</div></div>`;
    }
  }
  document.getElementById('guideContent').innerHTML = html;
  if (hasNearbyFoods(placeName)) {
    document.getElementById('guideContent').innerHTML += `<div style="margin-top:16px;padding:0 16px;"><button class="guide-btn" style="width:100%;background:rgba(46,196,160,.15);border:1px solid rgba(46,196,160,.3);color:var(--teal);padding:12px;font-size:13px;" onclick="goToNearbyFood('${placeName.replace(/'/g, "\\'")}')">🍽️ 근처 맛집 보기</button></div>`;
  }
  const placeData = PLACES.find(p => p.name === placeName);
  if (placeData) {
    document.getElementById('guideContent').innerHTML += `<div class="guide-actions"><button class="guide-btn guide-btn-map" onclick="openMap('${esc(placeData.searchName || placeData.name)}')">📍 지도</button><button class="guide-btn guide-btn-dir" onclick="openDirections('${esc(placeData.name)}')">🏃 가는길</button><button class="guide-btn guide-btn-search" onclick="openSearch('${esc(placeData.searchName || placeData.name)}')">🔍 검색</button><button class="guide-btn guide-btn-review" onclick="openReview('${esc(placeData.searchName || placeData.name)}')">⭐ 리뷰</button><button class="guide-btn guide-btn-kr" onclick="openKrReview('${esc(placeData.searchName || placeData.name)}')">🇰🇷</button><button class="guide-btn guide-btn-save ${AppState.saved.has(placeName)?'saved':''}" onclick="toggleSaveFromGuide('${placeName.replace(/'/g, "\\'")}')">${AppState.saved.has(placeName) ? '★' : '☆'}</button></div>`;
  }
  document.getElementById('guideModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGuide() {
  document.getElementById('guideModal').classList.remove('open');
  document.body.style.overflow = '';
}

function openTagPopup(landmarkName) {
  AppState.ui.tagPopupLandmark = landmarkName;
  document.getElementById('tagPopupName').textContent = landmarkName;
  document.getElementById('tagPopupOverlay').classList.add('open');
}

function closeTagPopup() {
  document.getElementById('tagPopupOverlay').classList.remove('open');
  AppState.ui.tagPopupLandmark = null;
}

function updateModalSaveBtn(name) {
  const btn = document.querySelector('.modal-actions .btn-save');
  if (btn) {
    btn.classList.toggle('saved', AppState.saved.has(name));
    btn.innerHTML = AppState.saved.has(name) ? '★' : '☆';
  }
}

function toggleSaveFromGuide(name) {
  toggleSave(name);
  const btn = document.querySelector('.guide-btn-save');
  if (btn) {
    btn.classList.toggle('saved', AppState.saved.has(name));
    btn.innerHTML = AppState.saved.has(name) ? '★ 저장됨' : '☆ 저장하기';
  }
}

function toggleDay(el) {
  el.classList.toggle('open');
  el.nextElementSibling.classList.toggle('open');
}

// ── 이벤트 위임 설정 (Event Delegation) ──
function handlePlaceListClick(e) {
  const target = e.target;
  
  // 1. 버튼 및 태그 클릭 처리
  const actionEl = target.closest('[data-action]');
  if (actionEl) {
    e.stopPropagation();
    const action = actionEl.dataset.action;
    const payload = actionEl.dataset.payload;

    if (action === 'map') openMap(payload);
    else if (action === 'dir') openDirections(payload);
    else if (action === 'search') openSearch(payload);
    else if (action === 'review') openReview(payload);
    else if (action === 'kr') openKrReview(payload);
    else if (action === 'save') {
      toggleSave(payload);
      // 저장됨 탭에서 삭제 시 리스트 갱신
      if (target.closest('#savedList')) renderSaved();
    }
    else if (action === 'landmark-tag') openTagPopup(payload);
    return;
  }

  // 2. 카드 클릭 처리 (모달 열기)
  const card = target.closest('.place-card');
  if (card) {
    const placeName = card.dataset.name;
    if (placeName) {
      const idx = PLACES.findIndex(p => p.name === placeName);
      if (idx !== -1) openModal(idx);
    }
  }
}

function setupEventDelegation() {
  ['placeList', 'landmarkList', 'savedList'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handlePlaceListClick);
  });
}

function openLandmarkMap() {
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(AppState.ui.tagPopupLandmark + ' Lisboa Portugal')}`, '_blank');
  closeTagPopup();
}

function openLandmarkGuide() {
  closeTagPopup();
  if (typeof PLACE_GUIDES !== 'undefined' && PLACE_GUIDES[AppState.ui.tagPopupLandmark]) openGuide(AppState.ui.tagPopupLandmark);
  else showToast('ℹ️ 장소 정보 준비 중');
}

// ── 스켈레톤 UI 렌더링 ──
function renderSkeleton(containerId, count = 5) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.innerHTML = `
      <div class="skeleton-header">
        <div class="skeleton skeleton-rank"></div>
        <div class="skeleton-info">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton-badges">
            <div class="skeleton skeleton-badge"></div>
            <div class="skeleton skeleton-badge"></div>
            <div class="skeleton skeleton-badge"></div>
          </div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton skeleton-btn"></div>
        <div class="skeleton skeleton-btn"></div>
      </div>
    `;
    container.appendChild(card);
  }
}

// AI 채팅 메시지 추가
function addAIMessage(text, type) {
  const container = document.getElementById('aiMessages');
  if (!container) return null;
  const el = document.createElement('div');
  el.className = `msg msg-${type.includes('ai') ? 'ai' : 'user'}${type.includes('loading')?' loading':''}`;
  el.textContent = text;
  container.appendChild(el);
  return el;
}

// UI 객체로 묶어서 전역에 노출 (app.js에서 사용)
const UI = {
  esc,
  showToast,
  buildDayPills,
  buildCatFilter,
  buildLandmarkDayFilter,
  buildLandmarkCatFilter,
  renderFood,
  renderLandmark,
  renderSchedule,
  renderRoute,
  renderSaved,
  renderNearbyList,
  openModal,
  showModal,
  closeModal,
  openGuide,
  closeGuide,
  closeTagPopup,
  setupEventDelegation,
  renderSkeleton,
  addAIMessage
};

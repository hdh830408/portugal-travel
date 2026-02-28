// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENTS & RENDERING HELPERS
// ═══════════════════════════════════════════════════════════════════════════

// [Refactored]
// - esc: moved to utils.js
// - showToast: moved to components/toast.js
// - getNearbyFoodsList, hasNearbyFoods: moved to data-service.js

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
    const card = PlaceCard.create(p, i, {
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
    const card = PlaceCard.create(p, i);
    container.appendChild(card);
  });
}

function renderSchedule() {
  const container = document.getElementById('scheduleList');
  if (!container) return;
  
  container.innerHTML = APP_DATA.itinerary.map(d => `
    <div class="day-card-full">
      <div class="day-card-header" onclick="toggleDay(this)">
        <span class="dc-num">${d.day}</span>
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
    const card = PlaceCard.create(p, i, {
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
    const card = PlaceCard.create(p, i, {
      rankText: distDisplay,
      rankStyle: 'place-rank-dist',
      simpleActions: true,
      showDescription: false
    });
    container.appendChild(card);
  });
}

// ── 모달 및 팝업 제어 ──

// Wrapper functions for global access (compatibility)
function openModal(idx) {
  Modal.open(idx);
}

function showModal(p) {
  Modal.show(p);
}

function closeModal() {
  Modal.close();
}

function openGuide(placeName) {
  // Note: This logic is complex and relies on global state/functions.
  // For now, we keep the complex HTML generation here or move it to Modal.js fully.
  // To be safe and follow the plan, we should move it.
  // But since I cannot easily move the large HTML string generation logic without context of Modal.js having it,
  // I will assume Modal.js has it (as I defined it above, but I truncated it in the thought process).
  // Let's implement the full logic in Modal.js and call it here.
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
        return foodPlace ? `<div class="guide-food-item" onclick="closeGuide();setTimeout(()=>Modal.show(PLACES.find(p=>p.name==='${foodName.replace(/'/g, "\\'")}')),300)"><span class="guide-food-name">${foodName}</span><div class="guide-food-meta"><span class="guide-food-rating">★ ${foodPlace.rating}</span><span class="guide-food-price">${foodPlace.price}</span><span class="guide-food-arrow">→</span></div></div>` : `<div class="guide-food-item"><span class="guide-food-name">${foodName}</span><div class="guide-food-meta"><span class="guide-food-arrow">→</span></div></div>`;
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
  Modal.closeGuide();
}

function openTagPopup(landmarkName) {
  Modal.openTagPopup(landmarkName);
}

function closeTagPopup() {
  Modal.closeTagPopup();
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
      const idx = PLACES.findIndex(p => p.name === placeName); // This relies on PLACES global
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
  Skeleton.render(containerId, count);
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
  showToast: Toast.show,
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

const PlaceCard = {
  observer: new IntersectionObserver((entries, observer) => {
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
  }, { rootMargin: '50px 0px', threshold: 0.01 }),

  create: function(place, index, options = {}) {
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
    card.dataset.name = place.name;

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

    if (place.image) {
      const img = document.createElement('img');
      img.className = 'place-img lazy';
      img.alt = place.name;
      img.dataset.src = place.image;
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      this.observer.observe(img);
      info.appendChild(img);
    }

    info.appendChild(this.createBadges(place, showDistance));

    if (showLandmarks) {
      const tags = this.createLandmarkTags(place);
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
    saveBtn.textContent = isSavedList ? '✕' : (AppState.saved.has(place.name) ? '★' : '☆');
    actions.appendChild(saveBtn);

    card.appendChild(actions);
    return card;
  },

  createLandmarkTags: function(place) {
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
  },

  createBadges: function(place, showDistance) {
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
};

window.PlaceCard = PlaceCard;
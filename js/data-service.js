const DataService = {
  masterPlaces: {},
  placeIdMap: {},
  appData: {},
  landmarkToFoodsMap: {},

  init: function() {
    console.log('🔄 [DataService] Initializing...');
    this.initializeIdSystem();
    this.buildMasterData();
    this.buildReverseMaps();
    this.updateRoutes();
    this.buildAppData();
    
    // 전역 호환성 유지 (기존 코드 지원)
    window.MASTER_PLACES = this.masterPlaces;
    window.PLACE_ID_MAP = this.placeIdMap;
    window.APP_DATA = this.appData;
    console.log('✅ [DataService] Initialization Complete');
  },

  // 1. ID 시스템 초기화
  initializeIdSystem: function() {
    const CITY_CODES = {
      'Lisboa': 'LIS', 'Sintra': 'SIN', 'Porto': 'OPO', 'Coimbra': 'COI',
      'Óbidos': 'OBI', 'Fátima': 'FAT', 'Tomar': 'TOM', 'Guimarães': 'GUI',
      'Braga': 'BRA', 'Almada': 'ALM', 'Gaia': 'OPO', 'Matosinhos': 'OPO'
    };
    const STOP_WORDS = ['RESTAURANTE', 'CAFE', 'BAR', 'HOTEL', 'A', 'O', 'DA', 'DO', 'DE'];

    PLACES.forEach(place => {
      let cityCode = 'PRT';
      for (const [city, code] of Object.entries(CITY_CODES)) {
        if ((place.address && place.address.includes(city)) || 
            (place.searchName && place.searchName.includes(city))) {
          cityCode = code;
          break;
        }
      }

      let baseName = place.searchName || place.name;
      let slug = baseName
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .toUpperCase()
        .split(/\s+/)
        .filter(word => !STOP_WORDS.includes(word) && word.length > 1)
        .slice(0, 3)
        .join('_');
      
      if (!slug) slug = 'UNKNOWN_' + Math.floor(Math.random() * 1000);

      let id = `${cityCode}_${slug}`;
      let counter = 1;
      let uniqueId = id;
      while (PLACES.some(p => p.id === uniqueId)) {
        uniqueId = `${id}_${counter++}`;
      }

      place.id = uniqueId;
      this.placeIdMap[place.name] = uniqueId;
    });
  },

  // 2. 마스터 데이터 구축
  buildMasterData: function() {
    PLACES.forEach(place => {
      if (!place.id) return;
      this.masterPlaces[place.id] = {
        id: place.id,
        name: place.name,
        searchName: place.searchName,
        type: place.type,
        metadata: { rating: place.rating, price: place.price, hours: place.hours, address: place.address, description: place.description },
        coords: (typeof PLACE_COORDS !== 'undefined') ? PLACE_COORDS[place.name] : null,
        content: {},
        references: { nearbyFoodIds: [], nearbyLandmarkIds: [] }
      };
    });

    Object.values(this.masterPlaces).forEach(masterPlace => {
      const name = masterPlace.name;
      if (typeof LANDMARK_DETAILS !== 'undefined' && LANDMARK_DETAILS[name]) {
        Object.assign(masterPlace.content, LANDMARK_DETAILS[name]);
      }
      if (typeof PLACE_GUIDES !== 'undefined' && PLACE_GUIDES[name]) {
        const guide = PLACE_GUIDES[name];
        if (guide.subtitle) masterPlace.content.subtitle = guide.subtitle;
        if (guide.history) masterPlace.content.history = guide.history;
        if (guide.photoSpots) masterPlace.content.photoSpots = guide.photoSpots;
        if (guide.visitTips) masterPlace.content.visitTips = guide.visitTips;
        if (guide.emoji) masterPlace.content.icon = guide.emoji;
        if (guide.nearbyFood) masterPlace.references.nearbyFoodIds = guide.nearbyFood.map(n => this.placeIdMap[n]).filter(id => id);
      }
      if (typeof NEARBY_LANDMARKS !== 'undefined' && NEARBY_LANDMARKS[name]) {
        masterPlace.references.nearbyLandmarkIds = NEARBY_LANDMARKS[name].map(n => this.placeIdMap[n]).filter(id => id);
      }
    });
  },

  // 3. 역방향 매핑 및 관계 구축
  buildReverseMaps: function() {
    if (typeof NEARBY_LANDMARKS !== 'undefined') {
      for (const [foodName, landmarks] of Object.entries(NEARBY_LANDMARKS)) {
        landmarks.forEach(landmark => {
          if (!this.landmarkToFoodsMap[landmark]) {
            this.landmarkToFoodsMap[landmark] = [];
          }
          if (!this.landmarkToFoodsMap[landmark].includes(foodName)) {
            this.landmarkToFoodsMap[landmark].push(foodName);
          }
        });
      }
    }
  },

  // 4. 라우트 업데이트
  updateRoutes: function() {
    Object.keys(ROUTES).forEach(dayKey => {
      ROUTES[dayKey].sections.forEach(section => {
        section.placeIds = section.places.map(name => this.placeIdMap[name]).filter(id => id);
        if (section.highlights) section.highlightIds = section.highlights.map(name => this.placeIdMap[name]).filter(id => id);
      });
    });
  },

  // 5. 앱 데이터 구조 생성
  buildAppData: function() {
    const dayMap = {};
    ITINERARY.forEach(d => { dayMap[d.day] = { dayNum: d.day, title: `${d.date} — ${d.title.split('—')[1]?.trim() || d.title}`, categories: {} }; });
    PLACES.forEach((place, idx) => {
      place.days.forEach(dayKey => {
        if (!dayMap[dayKey]) return;
        const cat = TYPE_LABELS[place.type] || '🍴 기타';
        if (!dayMap[dayKey].categories[cat]) dayMap[dayKey].categories[cat] = [];
        dayMap[dayKey].categories[cat].push({ ...place, rank: dayMap[dayKey].categories[cat].length + 1, day: dayKey, category: cat, meta: `★ ${place.rating}${place.price}${place.hours}` });
      });
    });
    this.appData = {
      foodByDay: Object.values(dayMap).map(d => ({ ...d, categories: Object.entries(d.categories).map(([cat, places]) => ({ category: cat, places })) })),
      allPlaces: PLACES.flatMap((place, idx) => place.days.map(dayKey => ({ ...place, day: dayKey, category: TYPE_LABELS[place.type], rank: idx + 1, meta: `★ ${place.rating}${place.price}${place.hours}` }))),
      itinerary: ITINERARY.map((d, i) => ({ id: i + 1, dayLabel: d.day + d.date.split(' ')[0], title: d.title, schedule: d.schedule, tips: d.tips, transport: d.transport }))
    };
  },

  // 6. 필터링 로직
  getFilteredPlaces: function(filters) {
    let places = this.appData.allPlaces || [];
    if (!filters.nearbyLandmark) {
      if (filters.day !== 'all') places = places.filter(p => p.day === filters.day);
      if (filters.cat !== 'all') places = places.filter(p => p.type === filters.cat);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      places = places.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filters.nearbyLandmark) {
      let nearbyNames = [];
      if (typeof PLACE_COORDS !== 'undefined' && PLACE_COORDS[filters.nearbyLandmark]) {
        const nearbyFoods = this.getNearbyFoodsByGPS(filters.nearbyLandmark, 500);
        nearbyNames = nearbyFoods.map(f => f.name);
      }
      if (nearbyNames.length === 0) {
        nearbyNames = this.getFoodsByLandmark(filters.nearbyLandmark);
      }
      places = places.filter(p => nearbyNames.includes(p.name));
    }
    return places;
  },

  // 헬퍼: 특정 랜드마크 근처 맛집 이름 배열 반환
  getFoodsByLandmark: function(landmarkName) {
    return this.landmarkToFoodsMap[landmarkName] || [];
  },

  // 헬퍼: GPS 기반 반경 검색
  getNearbyFoodsByGPS: function(centerPlaceName, radiusMeters = 500) {
    if (typeof PLACE_COORDS === 'undefined' || !PLACE_COORDS[centerPlaceName]) return [];
    
    const center = PLACE_COORDS[centerPlaceName];
    const results = [];
    
    // 전역 getDistance 함수가 없으면 간단한 거리 계산 로직 사용
    const calcDist = (lat1, lon1, lat2, lon2) => {
      if (typeof window.getDistance === 'function') return window.getDistance(lat1, lon1, lat2, lon2);
      // Fallback: Haversine formula approximation
      const R = 6371e3; const φ1 = lat1 * Math.PI/180; const φ2 = lat2 * Math.PI/180;
      const Δφ = (lat2-lat1) * Math.PI/180; const Δλ = (lon2-lon1) * Math.PI/180;
      const a = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    PLACES.forEach(p => {
      if (!FOOD_TYPES.includes(p.type)) return;
      const targetCoords = PLACE_COORDS[p.name];
      if (!targetCoords) return;

      const dist = calcDist(center.lat, center.lng, targetCoords.lat, targetCoords.lng);
      if (dist <= radiusMeters) {
        results.push({ ...p, distance: dist });
      }
    });
    return results.sort((a, b) => a.distance - b.distance);
  }
};
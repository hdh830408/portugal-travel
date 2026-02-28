// ═══════════════════════════════════════════════════════════════════════════
// STORE (Pub/Sub State Management)
// ═══════════════════════════════════════════════════════════════════════════

const Store = {
  state: window.AppState, // js/state.js에서 초기화된 전역 상태 참조
  events: {},

  // 이벤트 구독
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },

  // 이벤트 발행
  publish(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  },

  // ── Actions ──

  // 탭 변경
  setTab(tab) {
    this.state.tab = tab;
    this.publish('tabChange', tab);
  },

  // 맛집 필터 변경
  setFoodFilter(key, value) {
    this.state.filters.food[key] = value;
    this.publish('foodFilterChange', { key, value });
  },

  // 관광지 필터 변경
  setLandmarkFilter(key, value) {
    this.state.filters.landmark[key] = value;
    this.publish('landmarkFilterChange', { key, value });
  },

  // 저장(북마크) 토글
  toggleSave(name) {
    const isSaved = this.state.saved.has(name);
    if (isSaved) this.state.saved.delete(name);
    else this.state.saved.add(name);
    
    localStorage.setItem('pt_saved', JSON.stringify([...this.state.saved]));
    this.publish('saveChange', { name, isSaved: !isSaved });
  },

  // 루트(동선) 요일 변경
  setRouteDay(day) {
    this.state.route.day = day;
    this.publish('routeChange', day);
  },

  // AI 설정 변경
  setAIState(key, value) {
    this.state.ai[key] = value;
    this.publish('aiChange', { key, value });
  },

  // UI 상태 변경 (팝업 등)
  setUIState(key, value) {
    this.state.ui[key] = value;
    // UI 상태는 보통 즉시 반영되므로 별도 이벤트가 필요 없을 수 있음
  }
};

// 전역 노출
window.Store = Store;
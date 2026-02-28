// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL STATE (Phase 3 Store 도입 전 임시 상태 객체)
// ═══════════════════════════════════════════════════════════════════════════

window.AppState = {
  filters: {
    food: { day: 'all', cat: 'all', search: '', nearbyLandmark: null },
    landmark: { day: 'all', cat: 'all', search: '' }
  },
  tab: 'food',
  route: { day: 'DAY 2' },
  saved: new Set(JSON.parse(localStorage.getItem('pt_saved') || '[]')),
  ai: { 
    provider: 'openrouter', 
    model: localStorage.getItem('pt_model') || 'google/gemini-2.0-flash-lite-preview-02-05:free', 
    open: false, 
    loading: false 
  },
  ui: { tagPopupLandmark: null }
};
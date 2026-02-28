const DEFAULT_MODEL = 'google/gemini-2.0-flash-lite-preview-02-05:free';

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
    model: localStorage.getItem('pt_model') || DEFAULT_MODEL
  }
};
// ═══════════════════════════════════════════════════════════════════════════
// AI CONTROLLER (UI Interaction & Event Handling)
// ═══════════════════════════════════════════════════════════════════════════

const AIController = {
  init: function() {
    console.log('🤖 [AIController] Initializing...');
    // AI 서비스 초기화 (모델/키 로드)
    if (typeof AIService !== 'undefined') AIService.init();

    this.updateSettingsButton();
    this.exposeGlobals();
  },

  updateSettingsButton: function() {
    const hasKey = AIService.getKey();
    if (hasKey) {
      const btn = document.getElementById('settingsBtn');
      if (btn) { 
        btn.style.borderColor = 'var(--green)'; 
        btn.style.color = 'var(--green)'; 
      }
    }
  },

  // HTML onclick 핸들러 지원을 위해 전역 노출
  exposeGlobals: function() {
    window.toggleSettings = this.toggleSettings.bind(this);
    window.switchProvider = this.switchProvider.bind(this);
    window.selectModel = this.selectModel.bind(this);
    window.saveApiKey = this.saveApiKey.bind(this);
    window.toggleAI = this.toggleAI.bind(this);
    window.askSuggestion = this.askSuggestion.bind(this);
    window.sendAI = this.sendAI.bind(this);
  },

  // ── Settings UI ──

  toggleSettings: function() {
    const panel = document.getElementById('settingsPanel');
    const btn = document.getElementById('settingsBtn');
    const isOpen = panel.classList.contains('open');
    
    if (!isOpen) {
      this.refreshApiStatus();
      this.switchProvider('openrouter', false);
      const keyInput = document.getElementById('apiKeyInput');
      if (keyInput) keyInput.value = localStorage.getItem('pt_api_key') || '';
      this.refreshModelSelection();
    }
    
    panel.classList.toggle('open', !isOpen);
    btn.classList.toggle('active', !isOpen);
  },

  switchProvider: function(provider, save=true) {
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
    
    this.refreshApiStatus();
  },

  selectModel: function(modelId, el) {
    AIService.setModel(modelId);
    const list = el.closest('.model-list');
    if (list) {
      list.querySelectorAll('.model-option').forEach(e => e.classList.remove('selected'));
    }
    el.classList.add('selected');
  },

  refreshModelSelection: function() {
    document.querySelectorAll('.model-option').forEach(el => {
      const onclick = el.getAttribute('onclick') || '';
      const match = onclick.match(/'([^']+)'/);
      if (match && match[1] === AppState.ai.model) el.classList.add('selected');
      else el.classList.remove('selected');
    });
  },

  refreshApiStatus: function() {
    const el = document.getElementById('apiStatus');
    if (el) el.innerHTML = '<div class="settings-status status-ok">✅ 연결됨 · 🔀 OpenRouter · AI 사용 가능</div>';
  },

  saveApiKey: function() {
    const keyInput = document.getElementById('apiKeyInput');
    if (keyInput && keyInput.value.trim()) {
      AIService.setKey(keyInput.value.trim());
    }
    UI.showToast('✅ 설정 저장 완료!');
    this.refreshApiStatus();
    this.updateSettingsButton();
    
    document.getElementById('settingsPanel').classList.remove('open');
    document.getElementById('settingsBtn').classList.remove('active');
  },

  // ── Chat UI ──

  toggleAI: function() {
    AppState.ai.open = !AppState.ai.open;
    document.getElementById('aiPanel').classList.toggle('open', AppState.ai.open);
    if (AppState.ai.open) setTimeout(() => document.getElementById('aiInput').focus(), 400);
  },

  askSuggestion: function(text) {
    document.getElementById('aiInput').value = text;
    this.sendAI();
  },

  sendAI: async function() {
    const input = document.getElementById('aiInput');
    const msg = input.value.trim();
    if (!msg || AppState.ai.loading) return;
    
    input.value = '';
    AppState.ai.loading = true;
    document.getElementById('aiSend').disabled = true;
    
    // UI 컴포넌트 사용
    UI.addAIMessage(msg, 'user');
    const loadingEl = UI.addAIMessage('⏳ 분석 중...', 'ai loading');
    this.scrollAI();
    
    let fullReply = '';
    let isFirstChunk = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20초 타임아웃

      await AIService.fetchResponse(msg, controller.signal, (chunk) => {
        if (isFirstChunk) {
          loadingEl.innerHTML = '';
          loadingEl.classList.remove('loading');
          isFirstChunk = false;
        }
        fullReply += chunk;
        loadingEl.innerHTML = fullReply.replace(/\n/g, '<br>');
        this.scrollAI();
      });
      clearTimeout(timeoutId);

      loadingEl.className = 'msg msg-ai';
      loadingEl.innerHTML = fullReply
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // 굵은 글씨(**) 지원 추가
        .replace(/\[([^\]]+)\]\s*\(([^)]*)\)/g, (match, text, url) => {
          // 1. 앱 내 장소 데이터에 존재하는지 확인
          const isKnownPlace = typeof PLACES !== 'undefined' && PLACES.some(p => p.name === text);
          
          if (isKnownPlace) {
            // 2. 장소면 앱 내 모달 호출 (showPlaceFromRoute 사용)
            return `<span onclick="showPlaceFromRoute('${text.replace(/'/g, "\\'")}')" style="color:var(--teal);text-decoration:underline;cursor:pointer;font-weight:500">📍 ${text}</span>`;
          }
          // 3. 아니면 일반 외부 링크 (날씨 등)
          return `<a href="${url}" target="_blank" style="color:var(--blue);text-decoration:underline">${text}</a>`;
        });
    } catch(e) {
      loadingEl.className = 'msg msg-ai';
      let userMsg = '⚠️ 오류: ' + e.message;
      if (e.name === 'AbortError') userMsg = '⚠️ 응답 시간이 초과되었습니다. 다시 시도해주세요.';
      loadingEl.innerHTML = userMsg;
      console.error(e);
    }
    AppState.ai.loading = false;
    document.getElementById('aiSend').disabled = false;
    this.scrollAI();
  },

  scrollAI: function() {
    const msgs = document.getElementById('aiMessages');
    setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 50);
  }
};

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
    const provider = AppState.ai.provider || 'openrouter';
    let hasKey = false;
    if (provider === 'google') hasKey = !!localStorage.getItem('pt_gemini_key');
    else hasKey = !!AIService.getKey();
    
    const btn = document.getElementById('settingsBtn');
    if (btn) { 
      if (hasKey) {
        btn.style.borderColor = 'var(--green)'; 
        btn.style.color = 'var(--green)'; 
      } else {
        btn.style.borderColor = 'var(--muted)'; 
        btn.style.color = 'var(--muted)'; 
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
      const provider = localStorage.getItem('pt_ai_provider') || 'openrouter';
      this.switchProvider(provider, false);
      
      const keyInput = document.getElementById('apiKeyInput');
      if (keyInput) keyInput.value = localStorage.getItem('pt_api_key') || '';
      
      const googleKeyInput = document.getElementById('apiKeyInputGoogle');
      if (googleKeyInput) googleKeyInput.value = localStorage.getItem('pt_gemini_key') || '';
      
      this.refreshModelSelection();
      this.refreshApiStatus();
    }
    
    panel.classList.toggle('open', !isOpen);
    btn.classList.toggle('active', !isOpen);
  },

  switchProvider: function(provider, save=true) {
    AppState.ai.provider = provider;
    if (save) localStorage.setItem('pt_ai_provider', provider);
    
    ['openrouter', 'google', 'anthropic'].forEach(p => {
      const sec = document.getElementById('section-' + p);
      if(sec) sec.style.display = (p === provider) ? 'block' : 'none';
      const tab = document.getElementById('tab-' + p);
      if(tab) {
        if (p === provider) tab.classList.add('active');
        else tab.classList.remove('active');
      }
    });

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
    const provider = AppState.ai.provider || 'openrouter';
    const providerName = provider === 'google' ? 'Google Gemini' : (provider === 'anthropic' ? 'Anthropic' : 'OpenRouter');
    
    let hasKey = false;
    if (provider === 'google') hasKey = !!localStorage.getItem('pt_gemini_key');
    else if (provider === 'openrouter') hasKey = !!AIService.getKey();
    
    if (el) {
      if (hasKey) {
        el.innerHTML = `<div class="settings-status status-ok">✅ 연결됨 · 🔀 ${providerName} · AI 사용 가능</div>`;
      } else {
        el.innerHTML = `<div class="settings-status" style="background:rgba(239,68,68,.1);color:#ef4444;border:1px solid rgba(239,68,68,.3)">❌ 키 필요 · 🔀 ${providerName} 선택됨</div>`;
      }
    }
  },

  saveApiKey: function() {
    // OpenRouter Key
    const keyInput = document.getElementById('apiKeyInput');
    if (keyInput && keyInput.value.trim()) {
      AIService.setKey(keyInput.value.trim());
    }
    // Google Key
    const googleKeyInput = document.getElementById('apiKeyInputGoogle');
    if (googleKeyInput && googleKeyInput.value.trim()) {
      localStorage.setItem('pt_gemini_key', googleKeyInput.value.trim());
    } else if (googleKeyInput && googleKeyInput.value === '') {
      localStorage.removeItem('pt_gemini_key');
    }
    
    // Save provider
    localStorage.setItem('pt_ai_provider', AppState.ai.provider);

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
      
      // 링크 생성 헬퍼 함수
      const createLink = (match, text, url) => {
        const name = text.trim();
        const place = typeof PLACES !== 'undefined' ? PLACES.find(p => p.name === name || p.searchName === name) : null;
        
        if (place) {
          return `<span onclick="showPlaceFromRoute('${place.name.replace(/'/g, "\\'")}')" style="color:var(--teal);text-decoration:underline;cursor:pointer;font-weight:500">📍 ${name}</span>`;
        }
        
        let href = (url && url.trim() && url.startsWith('http')) ? url.trim() : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
        if (href.includes('maps.app.goo.gl') || href.includes('goo.gl/maps')) {
          href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
        }
        return `<a href="${href}" target="_blank" style="color:var(--blue);text-decoration:underline">${name}</a>`;
      };

      loadingEl.innerHTML = fullReply
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // 굵은 글씨(**) 지원 추가
        .replace(/\[([^\]]+)\]\s*\(([^)]*)\)/g, createLink) // text 형식
        .replace(/\[([^\]]+)\]/g, (m, t) => createLink(m, t, null)) // [text] 형식
        .replace(/`([^`]+)`/g, (m, t) => createLink(m, t, null)); // `text` 형식
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

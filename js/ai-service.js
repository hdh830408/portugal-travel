const AIService = {
  FIXED_KEY: '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',
  DEFAULT_MODEL: 'google/gemini-2.0-flash-lite-preview-02-05:free',
  SAFE_MODELS: [
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-2.0-pro-exp-02-05:free',
    'google/gemini-2.0-flash-lite-preview-02-05:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free',
    'openrouter/free'
  ],

  init: function() {
    // API 키 초기화
    if (!localStorage.getItem('pt_api_key')) {
      localStorage.setItem('pt_api_key', this.FIXED_KEY);
    }
    
    // 모델 유효성 검사 및 초기화
    let model = localStorage.getItem('pt_model') || this.DEFAULT_MODEL;
    if (!this.SAFE_MODELS.includes(model)) {
      model = this.DEFAULT_MODEL;
      localStorage.setItem('pt_model', model);
    }
    
    // AppState 동기화
    if (typeof AppState !== 'undefined') {
      AppState.ai.model = model;
    }
  },

  getKey: function() {
    return localStorage.getItem('pt_api_key') || this.FIXED_KEY;
  },

  setKey: function(key) {
    if (key && key.trim()) {
      localStorage.setItem('pt_api_key', key.trim());
    }
  },

  setModel: function(modelId) {
    localStorage.setItem('pt_model', modelId);
    if (typeof AppState !== 'undefined') {
      AppState.ai.model = modelId;
    }
  },

  generateSystemPrompt: function() {
    if (typeof APP_DATA === 'undefined') return '';
    
    const dayContext = APP_DATA.foodByDay.map(d => d.dayNum + '(' + d.title + '): ' + d.categories.map(c => c.places.slice(0,3).map(p => p.name + '(★' + p.rating + ')').join(',')).join(' | ')).join('\n');
    const itinContext = APP_DATA.itinerary.slice(0,5).map(d => d.dayLabel + ' ' + d.title + ': ' + d.schedule.slice(0,4).map(s => s.activity).join(', ')).join('\n');
    
    return `당신은 포르투갈 여행 전문 AI 어시스턴트입니다. 2026년 5월 1-10일 포르투갈 여행을 도와줍니다.\n\n[맛집 DB]\n${dayContext}\n\n[일정]\n${itinContext}\n\n규칙: 반드시 자연스러운 한국어로만 답변하세요(영어, 중국어 절대 사용 금지). 이모지 적절히 사용. 답변에 언급되는 모든 장소와 식당 이름은 반드시 [장소명] 형식으로 대괄호로 감싸서 작성하세요. 절대 '링크'라는 단어를 생성하지 마세요. 날씨 질문 시에는 도시명 날씨 링크를 제공하세요. 3-5문장 간결하게.`;
  },

  fetchResponse: async function(userMessage, signal, onChunk) {
    const apiKey = this.getKey();
    const model = AppState.ai.model || this.DEFAULT_MODEL;
    const systemPrompt = this.generateSystemPrompt();

    console.log('[AI] Using Key:', apiKey.substring(0, 10) + '...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', { 
      method: 'POST', 
      mode: 'cors',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + apiKey.trim(), 
        'HTTP-Referer': 'https://portugal-travel.app', 
        'X-Title': 'Portugal Travel 2026' 
      }, 
      body: JSON.stringify({ 
        model: model, 
        max_tokens: 1000, 
        messages: [ {role: 'system', content: systemPrompt}, {role: 'user', content: userMessage} ],
        stream: true
      }),
      signal: signal
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error Details:', data);
      let errorMsg = data?.error?.message || 'API Error ' + response.status;
      if (response.status === 401) errorMsg = 'API 키 오류 (User not found). 설정에서 새 키를 입력해주세요.';
      if (response.status === 429) errorMsg = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      throw new Error(errorMsg);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // 마지막 불완전한 라인은 버퍼에 남김

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') return fullText;
          try {
            const data = JSON.parse(dataStr);
            const content = data.choices[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              if (onChunk) onChunk(content);
            }
          } catch (e) { console.warn('Stream parse error', e); }
        }
      }
    }
    return fullText || 'AI로부터 응답을 받지 못했어요. (빈 응답)';
  }
};
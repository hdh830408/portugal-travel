const fs = require('fs');
let s = fs.readFileSync('d:/portugal-travel/css/styles.css');
// Find the index where UTF-16 starts (null bytes).
let limit = s.length;
for(let i=0; i<s.length-1; i++) {
   if(s[i] === 0x00 && s[i+1] !== 0x00) { limit = i - 100; break; } // rough limit
}
const cleanStr = s.slice(0, limit).toString('utf8');
const lastGoodIdx = cleanStr.lastIndexOf('.check-no { color: var(--red); }');

if (lastGoodIdx !== -1) {
  let goodStr = cleanStr.substring(0, lastGoodIdx + 32);
  
  goodStr += `
/* ── SCHEDULE EDITOR ── */
.schedule-edit-btn  { background: rgba(232,168,74,.15); border: 1px solid rgba(232,168,74,.3); color: var(--accent); padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; cursor: pointer; }
.schedule-editor-area { padding: 12px; background: var(--bg2); border-top: 1px dashed var(--border); border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
.schedule-textarea { width: 100%; min-height: 150px; background: #000; color: var(--text); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-family: inherit; font-size: 13px; line-height: 1.6; resize: vertical; }
.schedule-textarea:focus { outline: none; border-color: var(--accent); }
.schedule-editor-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
.schedule-editor-actions button { padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; border: none; }
.schedule-editor-actions .btn-cancel { background: transparent; color: var(--muted); border: 1px solid var(--border); }
.schedule-editor-actions .btn-save { background: var(--accent); color: #000; }

/* ── PLACE EDITOR ── */
.pe-label { display: block; font-size: 11px; color: var(--muted); margin-bottom: 4px; font-weight: 700; }
.pe-input { width: 100%; box-sizing: border-box; background: var(--bg2); color: var(--text); border: 1px solid var(--border); border-radius: 6px; padding: 10px; font-size: 14px; font-family: inherit; }
.pe-input:focus { outline: none; border-color: var(--accent); }

/* ── LC BADGE ── */
.lc-badge {
  display: inline-block;
  background: var(--gold);
  color: #000;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 800;
  vertical-align: middle;
  margin-left: 6px;
  line-height: normal;
}
.lc-badge::before { content: '💳'; margin-right: 3px; }
`;
  fs.writeFileSync('d:/portugal-travel/css/styles.css', goodStr, 'utf8');
  console.log('Fixed CSS.');
} else {
  console.log('Could not find anchor.', cleanStr.length);
}

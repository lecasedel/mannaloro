/* ============================================================================
   Le Case del Mannaloro — Toolbar di accessibilità (self-contained)
   GDPR-safe: zero richieste esterne, zero tracking. Salva preferenze utente
   in localStorage (consentito senza banner perché strettamente necessario).
   
   Features:
   - Ingrandimento testo (3 livelli)
   - Alto contrasto (nero/bianco)
   - Lettura facile (sans-serif + line-height aumentato)
   - Reset
   
   Per disabilitare: rimuovi <script src="js/a11y.js"> dalle pagine.
   ============================================================================ */
(function() {
  'use strict';

  // ====================== CSS injection ======================
  var css = `
    .a11y-toggle {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #1F2A1A;
      color: #F4EFE6;
      border: 2px solid #F4EFE6;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      cursor: pointer;
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 24px;
      transition: transform 0.15s, background 0.15s;
    }
    .a11y-toggle:hover, .a11y-toggle:focus-visible {
      transform: scale(1.05);
      background: #A14F2D;
      outline: 3px solid #5C6B47;
      outline-offset: 2px;
    }
    .a11y-toggle svg { width: 28px; height: 28px; }
    
    .a11y-panel {
      position: fixed;
      bottom: 5.5rem;
      right: 1.5rem;
      width: 280px;
      max-width: calc(100vw - 3rem);
      background: #FAF7F0;
      color: #1F2A1A;
      border: 1px solid #C9C0AE;
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      padding: 1.25rem;
      z-index: 9999;
      font-family: 'Inter', system-ui, sans-serif;
      display: none;
    }
    .a11y-panel.is-open { display: block; }
    .a11y-panel h2 {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #A14F2D;
      margin: 0 0 1rem;
      padding: 0;
      border: none;
    }
    .a11y-group {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #C9C0AE;
    }
    .a11y-group:last-of-type { border-bottom: none; margin-bottom: 0.5rem; }
    .a11y-group-label {
      font-size: 12px;
      color: #4A5544;
      margin-bottom: 0.5rem;
      letter-spacing: 0.02em;
    }
    .a11y-btn-row {
      display: flex;
      gap: 0.4rem;
    }
    .a11y-btn {
      flex: 1;
      padding: 0.55rem 0.5rem;
      background: #FFFFFF;
      color: #1F2A1A;
      border: 1px solid #C9C0AE;
      border-radius: 3px;
      cursor: pointer;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s, border-color 0.15s;
    }
    .a11y-btn:hover {
      background: #F4EFE6;
      border-color: #A14F2D;
    }
    .a11y-btn:focus-visible {
      outline: 2px solid #A14F2D;
      outline-offset: 2px;
    }
    .a11y-btn[aria-pressed="true"] {
      background: #1F2A1A;
      color: #FAF7F0;
      border-color: #1F2A1A;
    }
    .a11y-reset {
      width: 100%;
      padding: 0.55rem;
      background: transparent;
      color: #4A5544;
      border: 1px dashed #C9C0AE;
      border-radius: 3px;
      cursor: pointer;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-top: 0.5rem;
    }
    .a11y-reset:hover { color: #A14F2D; border-color: #A14F2D; }
    
    /* ====================== Modifiers applied to <html> ====================== */
    html.a11y-text-1 { font-size: 18px; }
    html.a11y-text-2 { font-size: 20px; }
    html.a11y-text-3 { font-size: 22px; }
    
    /* Easy-read: tutto Inter, line-height alto */
    html.a11y-easy-read body,
    html.a11y-easy-read h1,
    html.a11y-easy-read h2,
    html.a11y-easy-read h3,
    html.a11y-easy-read p,
    html.a11y-easy-read a,
    html.a11y-easy-read li,
    html.a11y-easy-read .doc-title,
    html.a11y-easy-read .section-title,
    html.a11y-easy-read .hero-title,
    html.a11y-easy-read .doc-name {
      font-family: 'Inter', Verdana, system-ui, sans-serif !important;
      font-style: normal !important;
      font-variation-settings: normal !important;
    }
    html.a11y-easy-read body,
    html.a11y-easy-read p,
    html.a11y-easy-read li { line-height: 1.85 !important; }
    html.a11y-easy-read em { font-style: normal !important; font-weight: 600 !important; }
    
    /* Alto contrasto: forza nero su bianco e link blu standard */
    html.a11y-high-contrast,
    html.a11y-high-contrast body { background: #FFFFFF !important; color: #000000 !important; }
    html.a11y-high-contrast h1,
    html.a11y-high-contrast h2,
    html.a11y-high-contrast h3,
    html.a11y-high-contrast p,
    html.a11y-high-contrast li,
    html.a11y-high-contrast .doc-meta,
    html.a11y-high-contrast .section-intro,
    html.a11y-high-contrast .intro,
    html.a11y-high-contrast .funding-disclosure,
    html.a11y-high-contrast .eyebrow,
    html.a11y-high-contrast .section-eyebrow,
    html.a11y-high-contrast .doc-eyebrow,
    html.a11y-high-contrast .doc-author { color: #000000 !important; }
    html.a11y-high-contrast a { color: #0000EE !important; text-decoration: underline !important; }
    html.a11y-high-contrast a:visited { color: #551A8B !important; }
    html.a11y-high-contrast .section,
    html.a11y-high-contrast main,
    html.a11y-high-contrast .funding,
    html.a11y-high-contrast .site-header,
    html.a11y-high-contrast .site-footer,
    html.a11y-high-contrast .paper,
    html.a11y-high-contrast .data-table,
    html.a11y-high-contrast .prescribed-quote,
    html.a11y-high-contrast .disclaimer { background: #FFFFFF !important; }
    html.a11y-high-contrast em { color: #000000 !important; font-weight: 700 !important; }
    
    @media print { .a11y-toggle, .a11y-panel { display: none !important; } }
  `;

  var styleEl = document.createElement('style');
  styleEl.id = 'a11y-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ====================== HTML injection ======================
  var toggleBtn = document.createElement('button');
  toggleBtn.className = 'a11y-toggle';
  toggleBtn.setAttribute('aria-label', 'Apri opzioni di accessibilità');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-controls', 'a11y-panel');
  toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="7.5" r="1.2" fill="currentColor"/><path d="M8.5 11 L15.5 11"/><path d="M12 11 L12 16"/><path d="M9 19 L12 14 L15 19"/></svg>';
  document.body.appendChild(toggleBtn);

  var panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Opzioni di accessibilità');
  panel.innerHTML = `
    <h2>Accessibilità</h2>
    <div class="a11y-group">
      <div class="a11y-group-label">Dimensione testo</div>
      <div class="a11y-btn-row" role="group" aria-label="Dimensione del testo">
        <button class="a11y-btn" data-action="text" data-value="0" aria-pressed="true">A</button>
        <button class="a11y-btn" data-action="text" data-value="1" aria-pressed="false">A+</button>
        <button class="a11y-btn" data-action="text" data-value="2" aria-pressed="false">A++</button>
        <button class="a11y-btn" data-action="text" data-value="3" aria-pressed="false">A+++</button>
      </div>
    </div>
    <div class="a11y-group">
      <div class="a11y-group-label">Visualizzazione</div>
      <div class="a11y-btn-row" role="group" aria-label="Opzioni visuali">
        <button class="a11y-btn" data-action="contrast" aria-pressed="false">Alto contrasto</button>
      </div>
      <div class="a11y-btn-row" role="group" aria-label="Opzioni di leggibilità" style="margin-top: 0.4rem;">
        <button class="a11y-btn" data-action="easyread" aria-pressed="false">Lettura facile</button>
      </div>
    </div>
    <button class="a11y-reset" data-action="reset">Ripristina impostazioni</button>
  `;
  document.body.appendChild(panel);

  // ====================== State management ======================
  var STORAGE_KEY = 'casedelmannaloro-a11y';
  var state = { text: 0, contrast: false, easyread: false };
  
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = Object.assign(state, JSON.parse(saved));
  } catch(e) { /* localStorage non disponibile: ok, modalità non persistente */ }

  function applyState() {
    var html = document.documentElement;
    html.classList.remove('a11y-text-1', 'a11y-text-2', 'a11y-text-3');
    if (state.text > 0) html.classList.add('a11y-text-' + state.text);
    html.classList.toggle('a11y-high-contrast', state.contrast);
    html.classList.toggle('a11y-easy-read', state.easyread);
    
    // Update aria-pressed
    panel.querySelectorAll('[data-action="text"]').forEach(function(btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.value == state.text));
    });
    panel.querySelector('[data-action="contrast"]').setAttribute('aria-pressed', String(state.contrast));
    panel.querySelector('[data-action="easyread"]').setAttribute('aria-pressed', String(state.easyread));
  }
  
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch(e) { /* localStorage pieno o non disponibile: ok */ }
  }

  // ====================== Event handlers ======================
  toggleBtn.addEventListener('click', function() {
    var isOpen = panel.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) panel.querySelector('.a11y-btn').focus();
  });

  panel.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.dataset.action;
    if (action === 'text') {
      state.text = parseInt(btn.dataset.value, 10);
    } else if (action === 'contrast') {
      state.contrast = !state.contrast;
    } else if (action === 'easyread') {
      state.easyread = !state.easyread;
    } else if (action === 'reset') {
      state = { text: 0, contrast: false, easyread: false };
    }
    applyState();
    saveState();
  });

  // ESC chiude il pannello
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      panel.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }
  });

  // Click esterno chiude il pannello
  document.addEventListener('click', function(e) {
    if (!panel.contains(e.target) && !toggleBtn.contains(e.target) && panel.classList.contains('is-open')) {
      panel.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Apply stato salvato al caricamento
  applyState();
})();

// ===== THEME (global, persistente)
const THEME_KEY = 'ldk_theme';
const root = document.documentElement;

// ícones minimalistas (traço fino, sem cor de fundo)
const ICON_SUN = `
<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
  <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1.8"/>
  <g stroke="currentColor" stroke-linecap="round" stroke-width="1.8" fill="none">
    <line x1="12" y1="2" x2="12" y2="4"/>
    <line x1="12" y1="20" x2="12" y2="22"/>
    <line x1="2"  y1="12" x2="4"  y2="12"/>
    <line x1="20" y1="12" x2="22" y2="12"/>
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
    <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"/>
  </g>
</svg>`;

const ICON_MOON = `
<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
        fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
</svg>`;

// tema inicial: salvo ou preferência do sistema
function getInitialTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function setTheme(mode){
  if (mode === 'dark') root.setAttribute('data-theme','dark');
  else root.removeAttribute('data-theme');
  localStorage.setItem(THEME_KEY, mode);
  refreshThemeUI();
}

const themeBtn = document.getElementById('theme-toggle');

function refreshThemeUI(){
  if (!themeBtn) return;
  const isDark = root.getAttribute('data-theme') === 'dark';
  themeBtn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
  themeBtn.setAttribute('aria-label', isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro');
  themeBtn.setAttribute('title', isDark ? 'Claro' : 'Escuro');
}

setTheme(getInitialTheme());

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  });
}

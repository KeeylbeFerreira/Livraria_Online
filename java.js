document.addEventListener('DOMContentLoaded', () => {
  console.log('[Livraria do Ke] JS carregado.');

  /* ===========================
     NAV MOBILE
  ============================ */
  const burger = document.querySelector('.burger');
  const links  = document.querySelector('.nav-links');
  if (burger && links) burger.addEventListener('click', () => links.classList.toggle('show'));

  /* ===========================
     TOGGLE SENHA
  ============================ */
  document.querySelectorAll('[data-toggle="password"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const input = document.getElementById(id);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.setAttribute('aria-pressed', input.type !== 'password');
    });
  });

  /* ===========================
     TOAST
  ============================ */
  const toast = (msg) => {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  };

  /* ===========================
     THEME (global, persistente) — ícones minimalistas
  ============================ */
  const THEME_KEY = 'ldk_theme';
  const root = document.documentElement;

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

  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  const themeBtn = document.getElementById('theme-toggle');

  function refreshThemeUI() {
    if (!themeBtn) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
    themeBtn.setAttribute('aria-label', isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro');
    themeBtn.setAttribute('title', isDark ? 'Claro' : 'Escuro');
  }

  function setTheme(mode) {
    if (mode === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    localStorage.setItem(THEME_KEY, mode);
    refreshThemeUI();
  }

  setTheme(getInitialTheme());

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  /* ===========================
     ÁREA DO USUÁRIO NO TOPO
  ============================ */
  (function renderUserArea() {
    const userArea = document.getElementById('user-area');
    const topLogin = document.querySelector('.nav-links a[href="index.html"]'); // "Entrar"
    const current = JSON.parse(localStorage.getItem('ldk_current_user') || 'null');

    if (!userArea) return;

    if (current && (current.name || current.email)) {
      if (topLogin) topLogin.style.display = 'none';
      const firstName = (current.name || current.email).split(' ')[0];

      userArea.innerHTML = '';

      const hello = document.createElement('span');
      hello.className = 'chip';
      hello.textContent = `Olá, ${firstName}`;

      const explorar = document.createElement('a');
      explorar.className = 'btn';
      explorar.href = 'Catalogo.html';
      explorar.textContent = 'Explorar';

      const perfil = document.createElement('a');
      perfil.className = 'btn';
      perfil.href = 'perfil.html';
      perfil.textContent = 'Perfil';

      const sair = document.createElement('button');
      sair.className = 'btn btn-outline';
      sair.textContent = 'Sair';
      sair.addEventListener('click', () => {
        localStorage.removeItem('ldk_current_user');
        location.reload();
      });

      userArea.append(hello, explorar, perfil, sair);
    } else {
      userArea.innerHTML = '';
      const criar = document.createElement('a');
      criar.className = 'btn btn-primary';
      criar.href = 'cadastro.html';
      criar.textContent = 'Criar conta';
      userArea.appendChild(criar);
      if (topLogin) topLogin.style.display = '';
    }
  })();

  /* ===========================
     LOGIN (index.html)
  ============================ */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#email').value.trim().toLowerCase();
      const pass  = loginForm.querySelector('#password').value.trim();
      if (!email || !pass) { toast('Preencha email e senha.'); return; }

      const users = JSON.parse(localStorage.getItem('ldk_users') || '[]');
      const ok = users.find(u => u.email.toLowerCase() === email && u.password === pass);

      if (ok) {
        localStorage.setItem('ldk_current_user', JSON.stringify({ name: ok.name, email: ok.email }));
        toast('Login realizado!');
        setTimeout(() => location.href = 'Pag01.html', 700);
      } else {
        toast('E-mail ou senha inválidos. Crie uma conta.');
      }
    });
  }

  /* ===========================
     CADASTRO (cadastro.html)
  ============================ */
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = signupForm.querySelector('#name').value.trim();
      const email = signupForm.querySelector('#email').value.trim().toLowerCase();
      const pass  = signupForm.querySelector('#password').value.trim();

      if (!name || !email || !pass) { toast('Preencha todos os campos.'); return; }
      if (pass.length < 8) { toast('A senha deve ter pelo menos 8 caracteres.'); return; }

      const users = JSON.parse(localStorage.getItem('ldk_users') || '[]');
      if (users.some(u => u.email === email)) { toast('Este e-mail já está cadastrado.'); return; }

      users.push({ name, email, password: pass });
      localStorage.setItem('ldk_users', JSON.stringify(users));
      localStorage.setItem('ldk_current_user', JSON.stringify({ name, email }));
      toast('Conta criada com sucesso!');
      setTimeout(() => location.href = 'Pag01.html', 700);
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Livraria do Ke] JS carregado.');

  /* ===========================
     HELPERS
  ============================ */
  const $  = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

  /* ===========================
     NAV MOBILE (acessível)
  ============================ */
  const burger = $('.burger');
  const links  = $('.nav-links');

  if (burger && links) {
    burger.setAttribute('aria-expanded', 'false');

    const toggleNav = (force) => {
      const willShow = typeof force === 'boolean' ? force : !links.classList.contains('show');
      links.classList.toggle('show', willShow);
      burger.setAttribute('aria-expanded', String(willShow));
      document.body.classList.toggle('nav-open', willShow);
    };

    burger.addEventListener('click', () => toggleNav());
    // fecha ao clicar em um link
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') toggleNav(false);
    });
    // fecha com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleNav(false);
    });
  }

  /* ===========================
     TOGGLE SENHA
  ============================ */
  $$('[data-toggle="password"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const input = document.getElementById(id);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.setAttribute('aria-pressed', input.type !== 'password');
    });
  });

  /* ===========================
     TOAST (com proteção anti-spam)
  ============================ */
  let toastTimer = null;
  const toast = (msg) => {
    let el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
  };
  // opcional: expõe global p/ usar em outros módulos
  window._toast = toast;

  /* ===========================
     THEME (persistente + acessível)
     - Respeita o tema do sistema se o usuário nunca escolheu
     - Ícone minimalista (sol/lua)
     - Atalho T para alternar
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

  const themeBtn = document.getElementById('theme-toggle');
  const prefersQuery = window.matchMedia?.('(prefers-color-scheme: dark)');

  const refreshThemeUI = () => {
    if (!themeBtn) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
    themeBtn.setAttribute('aria-label', isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro');
    themeBtn.setAttribute('title', isDark ? 'Claro' : 'Escuro');
  };

  const applyTheme = (mode, { persist = false } = {}) => {
    if (mode === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    if (persist) localStorage.setItem(THEME_KEY, mode);
    refreshThemeUI();
  };

  // inicialização: usa salvo; senão, segue o sistema (sem persistir)
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme, { persist: false });
  } else {
    const systemDark = !!prefersQuery?.matches;
    applyTheme(systemDark ? 'dark' : 'light', { persist: false });
    // se o usuário nunca escolheu, reagimos às mudanças do sistema
    prefersQuery?.addEventListener?.('change', (e) => {
      const stillNoChoice = !localStorage.getItem(THEME_KEY);
      if (stillNoChoice) applyTheme(e.matches ? 'dark' : 'light', { persist: false });
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark', { persist: true });
    });
  }
  // Atalho: T alterna o tema (fora de inputs)
  document.addEventListener('keydown', (e) => {
    if (e.key?.toLowerCase() === 't' && !/input|textarea|select/i.test(e.target.tagName)) {
      const isDark = root.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark', { persist: true });
    }
  });

  /* ===========================
     ÁREA DO USUÁRIO NO TOPO
  ============================ */
  (function renderUserArea() {
    const userArea = $('#user-area');
    const topLogin = $('.nav-links a[href="index.html"]'); // "Entrar"
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
  const loginForm = $('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#email').value.trim().toLowerCase();
      const pass  = loginForm.querySelector('#password').value.trim();

      if (!email || !pass) { toast('Preencha email e senha.'); return; }
      // validação simples de e-mail
      if (!/^\S+@\S+\.\S+$/.test(email)) { toast('Informe um e-mail válido.'); return; }

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
  const signupForm = $('#signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = signupForm.querySelector('#name').value.trim();
      const email = signupForm.querySelector('#email').value.trim().toLowerCase();
      const pass  = signupForm.querySelector('#password').value.trim();

      if (!name || !email || !pass) { toast('Preencha todos os campos.'); return; }
      if (!/^\S+@\S+\.\S+$/.test(email)) { toast('Informe um e-mail válido.'); return; }
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

  /* ===========================
     CONTINUAR LENDO (Home)
     - Lê o último progresso salvo em localStorage ("lk:lastReading")
     - Renderiza um card em #continue-reading
     - Estilos do card estão no style.css (.continue-card)
  ============================ */
  (function renderContinueReading(){
    const mount = $('#continue-reading');
    if (!mount) return;

    const data = JSON.parse(localStorage.getItem('lk:lastReading') || 'null');
    if (!data) {
      mount.innerHTML = '<small class="form-hint">Você ainda não iniciou nenhuma leitura.</small>';
      return;
    }

    const { id, title, author, cover, page, ts } = data;
    const when = new Date(ts).toLocaleString();
    const safeCover = cover || 'assets/img/placeholder-cover.png';
    const pageInfo = page ? `Última página: ${page}` : 'Leitura em andamento';

    mount.innerHTML = `
      <article class="continue-card" role="region" aria-label="Continuar lendo">
        <div class="media"><img src="${safeCover}" alt="Capa do livro ${title}"></div>
        <div class="body">
          <div class="card-title">Continuar lendo</div>
          <div class="card-sub"><strong>${title || 'Livro'}</strong>${author ? ' — ' + author : ''}</div>
          <small class="form-hint">${pageInfo} • ${when}</small>
          <div class="actions">
            <a class="btn btn-primary" href="leitura.html?id=${encodeURIComponent(id)}">Continuar</a>
            <a class="btn" href="Catalogo.html">Trocar de livro</a>
          </div>
        </div>
      </article>`;
  })();

  /* ===========================
     (Opcional) Pré-salvar "entrada" ao clicar em Ler
     - Caso o usuário clique em um link para leitura, gravamos um snapshot mínimo.
     - O leitor (leitura.html) sobrescreve com dados completos e página atual.
  ============================ */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="leitura.html"]');
    if (!a) return;
    try {
      const url = new URL(a.getAttribute('href'), location.href);
      const id = url.searchParams.get('id');
      if (!id) return;
      const existing = JSON.parse(localStorage.getItem('lk:lastReading') || 'null') || {};
      const snapshot = Object.assign({}, existing, { id, ts: Date.now() });
      localStorage.setItem('lk:lastReading', JSON.stringify(snapshot));
    } catch {}
  });

});

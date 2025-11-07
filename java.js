document.addEventListener('DOMContentLoaded', () => {
  console.log('[Livraria do Ke] JS carregado.');

  // ===== NAV MOBILE
  const burger = document.querySelector('.burger');
  const links  = document.querySelector('.nav-links');
  if (burger && links) burger.addEventListener('click', () => links.classList.toggle('show'));

  // ===== TOGGLE SENHA
  document.querySelectorAll('[data-toggle="password"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const input = document.getElementById(id);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.setAttribute('aria-pressed', input.type !== 'password');
    });
  });

  // ===== TOAST
  const toast = (msg) => {
    let el = document.querySelector('.toast');
    if(!el){ el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show'); setTimeout(()=> el.classList.remove('show'), 2500);
  };

  // ===== THEME (global, persistente)
  const THEME_KEY = 'ldk_theme';
  const root = document.documentElement;
  function applyTheme(name){
    if (name === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    localStorage.setItem(THEME_KEY, name);
  }
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const refreshLabel = () => themeBtn.textContent =
      (root.getAttribute('data-theme') === 'dark') ? '☀️' : '🌙';
    refreshLabel();
    themeBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
      refreshLabel();
    });
  }

  // ===== ÁREA DO USUÁRIO NO TOPO
  (function renderUserArea(){
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

      const sair = document.createElement('button');
      sair.className = 'btn btn-outline';
      sair.textContent = 'Sair';
      sair.addEventListener('click', () => {
        localStorage.removeItem('ldk_current_user');
        location.reload();
      });

      userArea.append(hello, explorar, sair);
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

  // ===== LOGIN (index.html)
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = loginForm.querySelector('#email').value.trim().toLowerCase();
      const pass  = loginForm.querySelector('#password').value.trim();
      if(!email || !pass){ toast('Preencha email e senha.'); return; }

      const users = JSON.parse(localStorage.getItem('ldk_users') || '[]');
      const ok = users.find(u => u.email.toLowerCase() === email && u.password === pass);

      if (ok) {
        localStorage.setItem('ldk_current_user', JSON.stringify({ name: ok.name, email: ok.email }));
        toast('Login realizado!');
        setTimeout(()=> location.href = 'Pag01.html', 700);
      } else {
        toast('E-mail ou senha inválidos. Crie uma conta.');
      }
    });
  }

  // ===== CADASTRO (cadastro.html)
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = signupForm.querySelector('#name').value.trim();
      const email = signupForm.querySelector('#email').value.trim().toLowerCase();
      const pass  = signupForm.querySelector('#password').value.trim();

      if(!name || !email || !pass){ toast('Preencha todos os campos.'); return; }
      if(pass.length < 8){ toast('A senha deve ter pelo menos 8 caracteres.'); return; }

      const users = JSON.parse(localStorage.getItem('ldk_users') || '[]');
      if (users.some(u => u.email === email)) {
        toast('Este e-mail já está cadastrado.');
        return;
      }

      users.push({ name, email, password: pass });
      localStorage.setItem('ldk_users', JSON.stringify(users));
      localStorage.setItem('ldk_current_user', JSON.stringify({ name, email }));
      toast('Conta criada com sucesso!');
      setTimeout(()=> location.href = 'Pag01.html', 700);
    });
  }
});

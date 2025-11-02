document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');
  if(burger && links){
    burger.addEventListener('click', ()=> links.classList.toggle('show'));
  }

  // Password toggle
  document.querySelectorAll('[data-toggle="password"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-target');
      const input = document.getElementById(id);
      if(!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.setAttribute('aria-pressed', input.type !== 'password');
    });
  });

  // Toast helper
  const toast = (msg) => {
    let el = document.querySelector('.toast');
    if(!el){
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(()=> el.classList.remove('show'), 2500);
  };

  // Simple "login" demo
  const loginForm = document.getElementById('login-form');
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = loginForm.querySelector('#email').value.trim();
      const pass = loginForm.querySelector('#password').value.trim();
      if(!email || !pass){ toast('Preencha email e senha.'); return; }
      localStorage.setItem('lk:user', JSON.stringify({ email }));
      toast('Login realizado com sucesso!');
      setTimeout(()=> window.location.href = 'Pag01.html', 900);
    });
  }

  // Catalog logic
  const catalogEl = document.getElementById('catalog-grid');
  if(catalogEl){
    // sample dataset
    const sampleBooks = Array.from({length: 24}).map((_,i)=>{
      const id = i+1;
      const cats = ['Ficção','Fantasia','Romance','Negócios','Tecnologia','Ciência'];
      const c = cats[i % cats.length];
      return {
        id,
        title: `Livro ${id.toString().padStart(2,'0')}`,
        author: ['A. Souza','B. Lima','C. Pereira','D. Santos'][i%4],
        price: (34.90 + (i%7)*3.1).toFixed(2),
        rating: (3 + (i%3) + (Math.random()*0.6)).toFixed(1),
        category: c,
        cover: `https://picsum.photos/seed/livrariadoke-${id}/400/540`
      };
    });

    const state = {
      books: sampleBooks,
      query: '',
      category: 'Todos',
      page: 1,
      perPage: 9,
    };

    const grid = document.getElementById('catalog-grid');
    const pagination = document.getElementById('pagination');
    const qInput = document.getElementById('q');
    const chips = document.querySelectorAll('[data-cat]');

    const apply = () => {
      let list = state.books.slice();
      if(state.query){
        const q = state.query.toLowerCase();
        list = list.filter(b => (b.title + ' ' + b.author).toLowerCase().includes(q));
      }
      if(state.category !== 'Todos'){
        list = list.filter(b => b.category === state.category);
      }
      return list;
    };

    const renderGrid = () => {
      const list = apply();
      const total = list.length;
      const start = (state.page - 1) * state.perPage;
      const end = start + state.perPage;
      const pageList = list.slice(start, end);

      grid.innerHTML = pageList.map(b => `
        <article class="card" aria-label="${b.title} por ${b.author}">
          <div class="card-media"><img src="${b.cover}" alt="Capa do livro ${b.title}"></div>
          <div class="card-body">
            <div class="card-title">${b.title}</div>
            <div class="card-sub">${b.author} • <span class="rating">★ ${b.rating}</span></div>
            <div class="price">R$ ${b.price}</div>
            <div class="card-actions">
              <button class="btn btn-primary" data-add="${b.id}">Adicionar</button>
              <button class="btn btn-outline" data-fav="${b.id}">Favoritar</button>
            </div>
          </div>
        </article>
      `).join('');

      // bind actions
      grid.querySelectorAll('[data-add]').forEach(btn => {
        btn.addEventListener('click', ()=> toast('Adicionado ao carrinho!'));
      });
      grid.querySelectorAll('[data-fav]').forEach(btn => {
        btn.addEventListener('click', ()=> toast('Adicionado aos favoritos!'));
      });

      // pagination
      const pages = Math.max(1, Math.ceil(total / state.perPage));
      pagination.innerHTML = '';
      const mk = (p, label = p, active=false) => {
        const b = document.createElement('button');
        b.className = 'page-btn' + (active ? ' active': '');
        b.textContent = label;
        b.addEventListener('click', ()=> { state.page = p; renderGrid(); window.scrollTo({top:0, behavior:'smooth'}); });
        return b;
      };
      pagination.appendChild(mk(Math.max(1, state.page-1), '‹'));
      for(let p=1;p<=pages;p++){
        pagination.appendChild(mk(p, String(p), p===state.page));
      }
      pagination.appendChild(mk(Math.min(pages, state.page+1), '›'));
    };

    // Listeners
    if(qInput){
      qInput.addEventListener('input', (e)=>{
        state.query = e.target.value.trim();
        state.page = 1;
        renderGrid();
      });
    }
    chips.forEach(ch => {
      ch.addEventListener('click', ()=>{
        chips.forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
        state.category = ch.dataset.cat;
        state.page = 1;
        renderGrid();
      });
    });

    renderGrid();
  }
});
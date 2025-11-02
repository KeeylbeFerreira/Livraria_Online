document.addEventListener('DOMContentLoaded', () => {
  console.log('[Livraria do Ke] JS carregado.');
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
    console.log('[Livraria do Ke] Render catálogo...');
    const sampleBooks = Array.from({length: 24}).map((_,i)=>{
      const id = i+1;
      const cats = ['Ficção','Fantasia','Romance','Negócios','Tecnologia','Ciência'];
      const c = cats[i % cats.length];
      return {
        id,
        title: `Livro ${id.toString().padStart(2,'0')}`,
        author: ['A. Souza','B. Lima','C. Pereira','D. Santos'][i%4],
        rating: (3 + (i%3) + (Math.random()*0.6)).toFixed(1),
        category: c,
        cover: `https://picsum.photos/seed/livrariadoke-${id}/400/540`
      };
    });

    const state = { books: sampleBooks, query: '', category: 'Todos', page: 1, perPage: 9 };

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
            <div class="card-actions">
              <a class="btn btn-primary" href="leitura.html?book=${encodeURIComponent(b.title)}&seed=${b.id}">Ler</a>
              <button class="btn btn-outline" data-fav="${b.id}">Favoritar</button>
            </div>
          </div>
        </article>
      `).join('');

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
      for(let p=1;p<=pages;p++){ pagination.appendChild(mk(p, String(p), p===state.page)); }
      pagination.appendChild(mk(Math.min(pages, state.page+1), '›'));

      console.log('[Livraria do Ke] Cards renderizados:', pageList.length);
    };

    if(qInput){
      qInput.addEventListener('input', (e)=>{ state.query = e.target.value.trim(); state.page = 1; renderGrid(); });
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

  // Reader Page
  const readerApp = document.getElementById('reader-app');
  if(readerApp){
    const qs = new URLSearchParams(location.search);
    const bookId = qs.get('book') || 'Leitura';

    const contentEl = document.getElementById('content');
    const tocEl = document.getElementById('toc');
    const bookmarksEl = document.getElementById('bookmarks');
    const notesEl = document.getElementById('notes');
    const shell = document.querySelector('.reader-shell');
    const main = document.querySelector('.reader-main');

    const sKey = 'lk:reader:settings';
    const pKey = (id)=> `lk:reader:progress:${id}`;
    const bKey = (id)=> `lk:reader:bookmarks:${id}`;
    const nKey = (id)=> `lk:reader:notes:${id}`;

    const settings = Object.assign({
      theme:'light', font:'serif', size: 1.05, lh: 1.8, width: 70, easy:false
    }, JSON.parse(localStorage.getItem(sKey) || '{}'));

    const applySettings = () => {
      shell.classList.remove('theme-dark','theme-sepia','theme-night');
      if(settings.theme === 'dark') shell.classList.add('theme-dark');
      if(settings.theme === 'sepia') shell.classList.add('theme-sepia');
      if(settings.theme === 'night') shell.classList.add('theme-night');
      const el = document.querySelector('.reader-main .content');
      el.style.setProperty('--fs', settings.size+'rem');
      el.style.setProperty('--lh', settings.lh);
      el.style.setProperty('--reader-max', settings.width+'ch');
      el.style.fontFamily = settings.font === 'serif' ? "'Merriweather', Georgia, serif" : "Poppins, system-ui, sans-serif";
      el.classList.toggle('easy', !!settings.easy);
      localStorage.setItem(sKey, JSON.stringify(settings));
    };

    if(contentEl && !contentEl.children.length){
      const sample = (i)=> `
        <h2 id="cap${i}">Capítulo ${i}: ${(i===1) ? 'Bem-vindo à leitura' : 'Seção ' + i}</h2>
        <p>Este é um ambiente de leitura com foco no conforto visual. Você pode ajustar tamanho de fonte, espaçamento, largura de coluna e tema sem distrações.</p>
        <blockquote>“Ler é viajar em silêncio.”</blockquote>
        <p>O seu progresso é salvo automaticamente.</p>
      `;
      let html = '';
      for(let i=1;i<=6;i++){ html += sample(i); }
      contentEl.innerHTML = html;
    }

    const buildToc = () => {
      tocEl.innerHTML = '';
      const hs = contentEl.querySelectorAll('h2, h3');
      hs.forEach((h, idx) => {
        if(!h.id) h.id = 'h-' + idx;
        const a = document.createElement('a');
        a.href = '#'+h.id;
        a.textContent = h.textContent;
        a.addEventListener('click', ()=> setTimeout(()=> a.classList.add('active'), 50));
        tocEl.appendChild(a);
      });
    };

    const restore = () => {
      try{
        const prog = JSON.parse(localStorage.getItem(pKey(bookId)) || 'null');
        if(prog && typeof prog.scroll === 'number'){
          main.scrollTo({ top: prog.scroll, behavior:'auto' });
        }
      }catch(e){}
    };

    const saveProgress = () => {
      const data = { scroll: main.scrollTop, time: Date.now() };
      localStorage.setItem(pKey(bookId), JSON.stringify(data));
    };

    main.addEventListener('scroll', () => { window.requestAnimationFrame(saveProgress); });

    const loadBookmarks = () => JSON.parse(localStorage.getItem(bKey(bookId)) || '[]');
    const saveBookmarks = (arr) => localStorage.setItem(bKey(bookId), JSON.stringify(arr));
    const renderBookmarks = () => {
      const arr = loadBookmarks();
      bookmarksEl.innerHTML = '';
      arr.forEach((bm) => {
        const div = document.createElement('div');
        div.className = 'bookmark';
        div.innerHTML = `<strong>${bm.title}</strong><br><small>${new Date(bm.time).toLocaleString()}</small>`;
        div.addEventListener('click', ()=> main.scrollTo({top: bm.scroll, behavior:'smooth'}));
        bookmarksEl.appendChild(div);
      });
    };
    document.getElementById('add-bm').addEventListener('click', () => {
      const heading = [...contentEl.querySelectorAll('h2,h3')].find(h => h.offsetTop >= main.scrollTop) || {textContent: bookId};
      const arr = loadBookmarks();
      arr.unshift({ title: heading.textContent, scroll: main.scrollTop, time: Date.now() });
      saveBookmarks(arr.slice(0,50));
      renderBookmarks();
    });

    const loadNotes = () => JSON.parse(localStorage.getItem(nKey(bookId)) || '[]');
    const saveNotes = (arr) => localStorage.setItem(nKey(bookId), JSON.stringify(arr));
    const renderNotes = () => {
      const arr = loadNotes();
      notesEl.innerHTML = '';
      arr.forEach((nt) => {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `<div>${nt.text}</div><small>${new Date(nt.time).toLocaleString()}</small>`;
        div.addEventListener('click', ()=> main.scrollTo({top: nt.scroll, behavior:'smooth'}));
        notesEl.appendChild(div);
      });
    };
    document.getElementById('add-note').addEventListener('click', () => {
      const sel = window.getSelection().toString().trim();
      if(!sel){ alert('Selecione um trecho no texto para salvar como nota.'); return; }
      const arr = loadNotes();
      arr.unshift({ text: sel, scroll: main.scrollTop, time: Date.now() });
      saveNotes(arr.slice(0,200));
      renderNotes();
    });

    const selTheme = document.getElementById('theme');
    const selFont = document.getElementById('font');
    const rngSize = document.getElementById('size');
    const rngLh = document.getElementById('lh');
    const rngWidth = document.getElementById('width');
    const chkEasy = document.getElementById('easy');

    selTheme.value = settings.theme;
    selFont.value = settings.font;
    rngSize.value = settings.size;
    rngLh.value = settings.lh;
    rngWidth.value = settings.width;
    chkEasy.checked = !!settings.easy;
    applySettings();

    selTheme.addEventListener('change', ()=> { settings.theme = selTheme.value; applySettings(); });
    selFont.addEventListener('change', ()=> { settings.font = selFont.value; applySettings(); });
    rngSize.addEventListener('input', ()=> { settings.size = parseFloat(rngSize.value); applySettings(); });
    rngLh.addEventListener('input', ()=> { settings.lh = parseFloat(rngLh.value); applySettings(); });
    rngWidth.addEventListener('input', ()=> { settings.width = parseInt(rngWidth.value, 10); applySettings(); });
    chkEasy.addEventListener('change', ()=> { settings.easy = chkEasy.checked; applySettings(); });

    const words = contentEl.textContent.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words/200));
    document.getElementById('reading-meta').textContent = `${minutes} min de leitura • ${words} palavras`;

    buildToc();
    setTimeout(restore, 50);
  }
});
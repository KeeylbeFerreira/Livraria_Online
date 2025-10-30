// Rolagem suave para âncoras (mantido).
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click',function(e){
    e.preventDefault();
    const el=document.querySelector(this.getAttribute('href'));
    if(el) el.scrollIntoView({behavior:'smooth'});
  });
});

// Hamburger toggle
const btnHamb = document.getElementById('btn-hamburger');
const mainNav = document.getElementById('main-nav');
if(btnHamb){
  btnHamb.addEventListener('click',()=>{
    const expanded = btnHamb.getAttribute('aria-expanded') === 'true';
    btnHamb.setAttribute('aria-expanded', String(!expanded));
    if(mainNav) mainNav.style.display = expanded ? '' : 'block';
  });
}

// Hero search: simula busca com alert
const heroSearch = document.getElementById('hero-search');
if(heroSearch){
  heroSearch.addEventListener('submit', e=>{
    e.preventDefault();
    const q = document.getElementById('q').value.trim();
    if(!q){ alert('Digite um termo para buscar.'); return; }
    alert(`Buscando por: "${q}" (simulação)`); // comportamento pedido
  });
}

// Simple carousel move
(function(){
  const track = document.getElementById('track');
  if(!track) return;
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  let idx=0;
  const cards = track.children;
  function update(){ track.style.transform = `translateX(${-idx * (cards[0].offsetWidth + 16)}px)` }
  next?.addEventListener('click',()=>{ idx = Math.min(idx+1, cards.length-1); update(); });
  prev?.addEventListener('click',()=>{ idx = Math.max(idx-1,0); update(); });
  window.addEventListener('resize', update);
})();

// Catalog: simula dados e paginação
const sampleBooks = (()=>{
  const arr=[];
  for(let i=1;i<=50;i++){
    arr.push({id:i,title:`Livro ${i}`,author:`Autor ${['A','B','C'][i%3]}`,genre:['Fantasia','Romance','Ficção Científica','Mistério'][i%4],cover:`https://picsum.photos/seed/book${i}/200/300`});
  }
  return arr;
})();

function renderCatalog(books,page=1,per=9){
  const root=document.getElementById('catalog-grid');
  if(!root) return;
  root.innerHTML='';
  const start=(page-1)*per;
  const pageItems=books.slice(start,start+per);
  pageItems.forEach(b=>{
    const card=document.createElement('article');
    card.className='catalog-card';
    card.innerHTML=`<img src="${b.cover}" alt="Capa de ${b.title}"><div class="catalog-info"><h4>${b.title}</h4><p class="muted">${b.author}</p><button class="btn" onclick="alert('Abrir leitura de ${b.title} (simulação)')">Ler agora</button></div>`;
    root.appendChild(card);
  });

  // pagination
  const pages = Math.ceil(books.length/per);
  const pnav = document.getElementById('pagination');
  if(pnav){
    pnav.innerHTML='';
    for(let i=1;i<=pages;i++){
      const btn=document.createElement('button');
      btn.textContent=i;
      btn.className = i===page ? 'active' : '';
      btn.addEventListener('click',()=>renderCatalog(books,i,per));
      pnav.appendChild(btn);
    }
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  // initial catalog render
  renderCatalog(sampleBooks,1,9);

  // catalog filters
  const catalogForm = document.getElementById('catalog-search');
  if(catalogForm){
    catalogForm.addEventListener('submit',e=>{
      e.preventDefault();
      const q = document.getElementById('catalog-q').value.trim().toLowerCase();
      const genero = document.getElementById('fGenero')?.value || '';
      const autor = document.getElementById('fAutor')?.value || '';
      const filtered = sampleBooks.filter(b=>{
        return (q==='' || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q))
          && (genero==='' || b.genre===genero)
          && (autor==='' || b.author===autor);
      });
      renderCatalog(filtered,1,9);
    });

    // filter selects change
    ['fGenero','fAutor'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.addEventListener('change',()=>catalogForm.dispatchEvent(new Event('submit')));
    });
  }

  // Login password toggle
  const tpass = document.getElementById('toggle-pass');
  if(tpass){
    tpass.addEventListener('click',()=>{
      const pwd = document.getElementById('password');
      if(!pwd) return;
      pwd.type = pwd.type === 'password' ? 'text' : 'password';
    });
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit',e=>{
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('emailc').value.trim();
      const msg = document.getElementById('mensagem').value.trim();
      if(!nome || !email || !msg){ alert('Por favor preencha nome, e-mail e mensagem.'); return; }
      alert('Mensagem enviada — obrigado! (simulação)');
      contactForm.reset();
    });
  }

  // Leitura: font size and mode toggle
  const reader = document.getElementById('reader');
  if(reader){
    let fsize = 16;
    const pageNum = document.getElementById('page-num');
    const total = document.getElementById('page-total');
    const inc = document.getElementById('increase-font');
    const dec = document.getElementById('decrease-font');
    const toggle = document.getElementById('toggle-mode');
    if(total) total.textContent = 345;
    inc?.addEventListener('click',()=>{ fsize = Math.min(26,fsize+2); reader.style.fontSize = fsize+'px'; });
    dec?.addEventListener('click',()=>{ fsize = Math.max(12,fsize-2); reader.style.fontSize = fsize+'px'; });
    toggle?.addEventListener('change',(e)=>{
      const card = document.getElementById('reading-card');
      if(card) card.style.background = e.target.checked ? '#2b2b2b' : '#fff';
      if(card) card.style.color = e.target.checked ? '#eee' : '#111';
    });
    // options menu
    const optBtn = document.getElementById('options-btn');
    const optMenu = document.getElementById('options-menu');
    optBtn?.addEventListener('click',()=>{ if(optMenu) optMenu.hidden = !optMenu.hidden; });
  }

});

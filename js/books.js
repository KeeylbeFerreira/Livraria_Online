// js/books.js
export const BOOKS = [
  {
    id: "dom-casmurro",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    file: "dom-casmurro.pdf", // em assets/books/
    cover: "assets/capa_livros/capa_domcasmurro.jpg",
    genres: ["Romance", "Clássico"]
  },
  {
    id: "memorias-postumas",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    file: "memorias-postumas.pdf",
    cover: "assets/capa_livros/capa_memorias.PNG",
    genres: ["Romance", "Clássico", "Realismo"]
  },
  {
    id: "quincas-borba",
    title: "Quincas Borba",
    author: "Machado de Assis",
    file: "quincas-borba.pdf",
    cover: "assets/capa_livros/capa_quincas.PNG",
    genres: ["Romance", "Clássico"]
  },
  {
    id: "senhora",
    title: "Senhora",
    author: "José de Alencar",
    file: "senhora.pdf",
    cover: "assets/capa_livros/capa-senhora.PNG",
    genres: ["Romance", "Clássico"]
  },
  {
    id: "iracema",
    title: "Iracema",
    author: "José de Alencar",
    file: "iracema.pdf",
    cover: "assets/capa_livros/capa_iracema.PNG",
    genres: ["Romance", "Indianista", "Clássico"]
  },

  // ===== Novos livros com capas =====
  {
    id: "o-alienista",
    title: "O Alienista",
    author: "Machado de Assis",
    file: "O-Alienista.pdf",
    cover: "assets/capa_livros/capa_alineista.PNG", // atenção ao nome do arquivo (.PNG)
    genres: ["Ficção", "Clássico Brasileiro", "Sátira"]
  },
  {
    id: "arte-da-guerra",
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    file: "A-ARTE-DA-GUERRA.pdf",
    cover: "assets/capa_livros/capa_arte_guerra.PNG",
    genres: ["Estratégia", "Clássico", "Negócios"]
  },
  {
    id: "politica-aristoteles",
    title: "A Política",
    author: "Aristóteles",
    file: "politica.pdf",
    cover: "assets/capa_livros/capa_politica.PNG",
    genres: ["Filosofia", "Política", "Clássico"]
  },
  {
    id: "o-sertanejo",
    title: "O Sertanejo",
    author: "José de Alencar",
    file: "sertanejo.pdf",
    cover: "assets/capa_livros/capa_sertanejo.PNG",
    genres: ["Romance", "Clássico Brasileiro", "Regionalismo"]
  }
];

// fallback opcional se alguma capa faltar
export function generateCoverDataURL(title, author) {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='900'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#0D2A4A'/><stop offset='100%' stop-color='#163a61'/>
    </linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <rect x='40' y='40' width='520' height='820' fill='none' stroke='#D4AF37' stroke-width='4' rx='12'/>
    <text x='50%' y='47%' text-anchor='middle' fill='#ffffff' font-family='Poppins, Arial' font-size='44' font-weight='700'>${title.replace(/&/g,"&amp;")}</text>
    <text x='50%' y='57%' text-anchor='middle' fill='#dbe6f4' font-family='Poppins, Arial' font-size='26'>${author.replace(/&/g,"&amp;")}</text>
  </svg>`;
  const encoded = window.btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${encoded}`;
}

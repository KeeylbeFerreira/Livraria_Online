// /js/books.js
export const BOOKS = [
  {
    id: "dom-casmurro",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    file: "dom-casmurro.pdf",
    genres: ["Romance", "Clássico"],
    cover: null, // deixe null para gerar capa SVG automática
    description: "Narrativa de Bentinho e Capitu, ciúmes e memória em primeira pessoa."
  },
  {
    id: "memorias-postumas",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    file: "memorias-postumas.pdf",
    genres: ["Romance", "Clássico", "Realismo"],
    cover: null,
    description: "Um 'defunto-autor' narra sua vida com humor ácido e filosofia."
  },
  {
    id: "quincas-borba",
    title: "Quincas Borba",
    author: "Machado de Assis",
    file: "quincas-borba.pdf",
    genres: ["Romance", "Clássico"],
    cover: null,
    description: "Rubião herda uma fortuna e uma filosofia: 'Ao vencedor, as batatas'."
  },
  {
    id: "senhora",
    title: "Senhora",
    author: "José de Alencar",
    file: "senhora.pdf",
    genres: ["Romance", "Clássico", "Romantismo"],
    cover: null,
    description: "Aurélia Camargo, poder, dinheiro e amor em um casamento por contrato."
  },
  {
    id: "iracema",
    title: "Iracema",
    author: "José de Alencar",
    file: "iracema.pdf",
    genres: ["Romance", "Indianista", "Clássico"],
    cover: null,
    description: "Poético encontro entre a índia Iracema e o colonizador Martim."
  }
];

// Capa SVG dinâmica (quando não houver imagem)
export function generateCoverDataURL(title, author) {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='900'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#0D2A4A'/>
        <stop offset='100%' stop-color='#163a61'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <rect x='40' y='40' width='520' height='820' fill='none' stroke='#D4AF37' stroke-width='4' rx='12'/>
    <text x='50%' y='47%' text-anchor='middle' fill='#ffffff' font-family='Poppins, Arial' font-size='44' font-weight='700'>
      ${title.replace(/&/g,"&amp;")}
    </text>
    <text x='50%' y='57%' text-anchor='middle' fill='#dbe6f4' font-family='Poppins, Arial' font-size='26'>
      ${author.replace(/&/g,"&amp;")}
    </text>
  </svg>`;
  const encoded = window.btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${encoded}`;
}

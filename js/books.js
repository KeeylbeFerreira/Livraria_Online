// assets/js/books.js
export const BOOKS = [
  {
    id: "dom-casmurro",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: ["Romance", "Clássico"],
    cover: "assets/capa_livros/capa_domcasmurro.jpg",
    file: "assets/books/dom-casmurro.pdf"
  },
  {
    id: "iracema",
    title: "Iracema",
    author: "José de Alencar",
    genre: ["Romance", "Indigenista"],
    cover: "assets/capa_livros/capa_iracema.PNG",
    file: "assets/books/iracema.pdf"
  },
  {
    id: "memorias-postumas",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    genre: ["Romance", "Clássico"],
    cover: "assets/capa_livros/capa_memorias.PNG",
    file: "assets/books/memorias-postumas.pdf"
  },
  {
    id: "quincas-borba",
    title: "Quincas Borba",
    author: "Machado de Assis",
    genre: ["Romance", "Clássico"],
    cover: "assets/capa_livros/capa_quincas.PNG",
    file: "assets/books/quincas-borba.pdf"
  },
  {
    id: "senhora",
    title: "Senhora",
    author: "José de Alencar",
    genre: ["Romance", "Clássico"],
    cover: "assets/capa_livros/capa-senhora.PNG",
    file: "assets/books/senhora.pdf"
  }
];

// (opcional) fallback se algum livro não tiver capa
export function generateCoverDataURL(title, author) {
  const t = encodeURIComponent(title);
  const a = encodeURIComponent(author);
  const bg = "0D2A4A"; // navy do site
  const fg = "FFFFFF";
  return `https://dummyimage.com/600x800/${bg}/${fg}.png&text=${t}%0A${a}`;
}

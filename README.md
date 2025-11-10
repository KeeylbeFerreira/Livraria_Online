# 📚 Livraria do Ke — Catálogo e Leitor de Livros (HTML/CSS/JS)

Projeto front-end estático de uma livraria/estante digital com **catálogo filtrável**, **autenticação didática via `localStorage`**, **modo escuro** e **leitor de PDF** com foco em conforto visual.

> Feito para estudos/portfólio. Sem back-end real, sem coleta de dados. **Não use senhas reais.**

---

## ✨ Principais funcionalidades

- **Home com busca rápida** para o catálogo (“Descubra seu próximo livro favorito”).  
  Arquivo: `Pag01.html`.

- **Catálogo filtrável** por **título/autor** e **chips de gêneros** (+ capa *fallback* SVG).  
  Arquivos: `Catalogo.html` + `js/books.js`.

- **Leitor de PDF** (`leitura.html`) com:
  - **Leitor Pro (pdf.js)**: uma ou duas páginas lado a lado, **zoom ±**, **ajuste Altura/Largura**, **atalhos**:  
    `←/→` navegação • `+/-` zoom • `H` alterna ajuste • `P` uma/duas páginas.  
    Botão **Leitor Pro** para ativar/desativar.
  - **Modo foco** (`F`) e **Largura cheia** (`W`);
  - **Baixar PDF** e **Abrir em nova aba**;
  - Cabeçalho com **título, autor e gêneros**.

- **Autenticação didática** (login/cadastro) usando `localStorage`, com **Perfil** (nome/senha) local.  
  Arquivos: `index.html`, `cadastro.html`, `perfil.html`.

- **Proteção de rotas (client-side)**: **Catálogo, Leitura e Perfil** exigem login.  
  *Como ativar:* adicione `data-requires-auth="true"` no `<body>` da página.

- **Continuar lendo** (Home): card automático com o **último livro aberto** e **página salva** (`lk:lastReading`).  
  Montagem em `#continue-reading` (exibe botão “Continuar”).

- **Tema claro/escuro** persistente (`ldk_theme`) com respeito ao tema do sistema e **atalho `T`**.

- **Navbar mobile acessível**: `aria-expanded`, fecha com `ESC`, bloqueio de rolagem quando aberto.

- **Validações e UX**: e-mail válido, senha mínima (8), *toast* anti-spam, foco visível e landmarks ARIA.

---

## 🗂️ Estrutura do projeto

.
├── Pag01.html # Início (hero + destaques + busca)
├── Catalogo.html # Catálogo com filtros (proteção de rota)
├── leitura.html # Leitor (iframe + Leitor Pro/pdf.js) ← proteção de rota
├── index.html # Login
├── cadastro.html # Cadastro
├── perfil.html # Perfil do usuário ← proteção de rota
├── sobre.html # Institucional
├── style.css # Tokens/cores, componentes, dark mode, estilos do Leitor Pro
├── js/
│ ├── java.js # Navbar, tema, toasts, auth, proteção de rotas, “Continuar lendo”
│ └── books.js # Catálogo (id, título, autor, gêneros, capa, arquivo)
└── assets/
├── books/ # PDFs
└── capa_livros/ # Capas .png/.jpg

markdown
Copiar código

> O **pdf.js** é carregado via CDN em `leitura.html` apenas quando o **Leitor Pro** é usado.

---

## ⚙️ Como rodar localmente

1. Clone o repositório.
2. Abra a pasta no VS Code.
3. Use um servidor estático (ex.: **Live Server**) ou abra `Pag01.html`.
4. Caminhos úteis:
   - Início: `Pag01.html`
   - Catálogo: `Catalogo.html`
   - Login/Cadastro: `index.html` / `cadastro.html`
   - Leitura: `leitura.html?id=<id-do-livro>`

> Confirme que os PDFs apontados em `js/books.js` existem em `assets/books/`.

---

## 🧩 Detalhes técnicos

### Catálogo & busca
- Filtros por query (`?q=`) e gênero (`?genre=`) refletidos na URL.  
- Capa *fallback* gerada em SVG (base64) quando a imagem falha.

### Autenticação (didática)
- Usuários: `ldk_users` • Sessão atual: `ldk_current_user`.
- *Opcional*: cookie simples `ldk_auth=1` para uso futuro em middleware (ex.: Vercel).

### Proteção de rotas
- Páginas com `<body data-requires-auth="true">` redirecionam para `index.html?auth=1` se não houver sessão.
- O link clicado é salvo em `sessionStorage (ldk_return_to)` e retomado após login.

```html
<!-- exemplo -->
<body data-requires-auth="true">
Continuar lendo
Progresso é salvo em localStorage na chave lk:lastReading:

json
Copiar código
{ "id": "dom-casmurro", "title": "Dom Casmurro", "author": "Machado de Assis", "cover": "...", "page": 21, "ts": 1730... }
A Home renderiza um card em #continue-reading com capa, título, última página e ação Continuar.

Leitor Pro (pdf.js)
Navegação: ←/→, Zoom: +/-, Ajuste: H, Modo: P.

UI: pager, zoom, ajuste altura/largura, uma/duas páginas; fallback para iframe padrão.

Tema
ldk_theme (light/dark), alterna data-theme no :root, atalho T.

🧪 Como adicionar livros
Edite js/books.js e inclua um objeto em BOOKS:

js
Copiar código
{
  id: "dom-casmurro",
  title: "Dom Casmurro",
  author: "Machado de Assis",
  file: "assets/books/dom-casmurro.pdf",   // pode ser só "dom-casmurro.pdf"
  cover: "assets/capa_livros/capa_domcasmurro.jpg",
  genres: ["Romance", "Clássico"]
}
Também adicionamos exemplos como Fábulas de Esopo, Mafalda (tiras), Os Pobres, O Menino Maluquinho etc. — confira os caminhos das capas/PDFs.

🎨 Design system
Paleta: Navy #0D2A4A, Dourado #D4AF37 (hover #b89126) + tons para claro/escuro.

Componentes: Navbar sticky, Hero, Cards, Chips, Forms, Toast, Footer, Leitor Pro.

Responsividade: breakpoints 480/768/1024/1280, grids cols-2/3/4, tipografia Poppins/Merriweather.

Acessibilidade: foco visível, aria-current, labels/landmarks.

🚀 Deploy
GitHub Pages: Branch main → pasta root.

Vercel/Netlify: import como Static Site.
(Opcional) Crie um rewrite para mapear / → Pag01.html.

🔐 Avisos
Projeto didático: não armazene dados sensíveis nem use senhas reais.

Garanta que os PDFs tenham licença adequada (domínio público ou autorização).

🛣️ Roadmap
Paginação/lazy no catálogo

PWA com cache offline

Marcar páginas lidas por livro e sincronizar em backend real

Biblioteca do usuário (favoritos / lidos)

🧑‍💻 Tecnologias
HTML5, CSS3 (tokens/utilitários, dark mode), JavaScript (ESM), localStorage, pdf.js (CDN).

🙌 Créditos
UI/UX & Dev: Keeylb Santos
Projeto educacional — ADS

📄 Licença
MIT (exceto arquivos de livros/imagens que possam ter licenças próprias).

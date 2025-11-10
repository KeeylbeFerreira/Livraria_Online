# 📚 Livraria do Ke — Catálogo e Leitor de Livros (HTML/CSS/JS)

Projeto front‑end estático de uma livraria/estante digital com **catálogo filtrável**, **autenticação didática via `localStorage`**, **modo escuro** e **leitor de PDF** com foco em conforto visual.

> Feito para estudos/portfólio. Sem back‑end real, sem coleta de dados. **Não use senhas reais.**

---

## ✨ Principais funcionalidades

- **Home com busca rápida** para o catálogo (“Descubra seu próximo livro favorito”).  
  Arquivo: `Pag01.html`.  
- **Catálogo filtrável** por **título/autor** e por **chips de gêneros**, com geração de capa *fallback* em SVG quando a imagem não carrega.  
  Arquivo: `Catalogo.html` + `js/books.js`.  
- **Leitor de PDF** em `leitura.html` com:
  - Botões **Modo foco** (`F`) e **Largura cheia** (`W`);
  - Links para **Baixar PDF** e **Abrir em nova aba**;
  - Cabeçalho com título, autor e gêneros.  
- **Autenticação didática** (login/cadastro) usando `localStorage`, com **Perfil** para atualizar nome e senha (apenas no navegador).  
  Arquivos: `index.html`, `cadastro.html` e `perfil.html`.  
- **Tema claro/escuro** persistente (**`localStorage` + media query**), com botão fixo na navbar.  
- **Acessibilidade de base**: landmarks, `aria-label` em buscas/menus, foco visível, `aria-current` em navegação.
- **UI consistente** com **variáveis CSS** (navy + dourado) e **grid responsivo**.

---

## 🗂️ Estrutura do projeto

```
.
├── Pag01.html          # Início (hero + destaques + busca que aponta para o Catálogo)
├── Catalogo.html       # Catálogo com filtros (título/autor e chips de gêneros)
├── leitura.html        # Leitor de PDF (iframe) com foco e largura cheia
├── index.html          # Login
├── cadastro.html       # Cadastro
├── perfil.html         # Perfil do usuário (nome/senha/sessão)
├── sobre.html          # Página institucional
├── style.css           # Estilos globais (tokens/cores, componentes, dark mode)
├── java.js             # Navbar, tema, toasts, auth (login/cadastro), user-area
└── js/
    └── books.js        # Catálogo de livros (id, título, autor, gêneros, capa, arquivo)
```
> As capas e PDFs devem ficar em `assets/capa_livros/` e `assets/books/` (ou ajuste os caminhos em `js/books.js`).

---

## ⚙️ Como rodar localmente

1. Baixe/clon​e o repositório.
2. Abra a pasta no VS Code (ou editor de preferência).
3. Sirva a pasta com um servidor estático (ex.: **Live Server** do VS Code) **ou** abra `Pag01.html` no navegador.
4. Navegue:
   - Início: `Pag01.html`
   - Catálogo: `Catalogo.html`
   - Login/Cadastro: `index.html` / `cadastro.html`
   - Leitura: `leitura.html?id=<id-do-livro>`

> Dica: para testar leitura, garanta que o PDF indicado em `js/books.js` exista em `assets/books/`.

---

## 🧩 Detalhes técnicos

- **Catálogo & busca**  
  O estado de filtros (query e gênero) é refletido na URL (`?q=...&genre=...`). Renderização do grid é toda client‑side.
- **Fallback de capa**  
  Quando uma `cover` falta ou falha, uma **capa SVG** é gerada dinamicamente com **título** e **autor** (base64 no `src`).
- **Autenticação didática**  
  - Storage de usuários: `ldk_users`  
  - Sessão: `ldk_current_user`  
  - **Apenas para fins educacionais** (sem criptografia, sem backend).
- **Tema claro/escuro**  
  - Chave: `ldk_theme` (`light`/`dark`)  
  - Botão `#theme-toggle` alterna o atributo `data-theme` no `:root`.
- **Atalhos do leitor**  
  - `F` → liga/desliga **Modo foco** (oculta header/footer e maximiza o leitor);  
  - `W` → alterna **Largura cheia** do contêiner do leitor.

---

## 🧪 Como adicionar livros

Edite `js/books.js` e inclua objetos no array `BOOKS`:

```js
{
  id: "dom-casmurro",
  title: "Dom Casmurro",
  author: "Machado de Assis",
  file: "dom-casmurro.pdf",          // caminho relativo ao projeto (ex.: assets/books/dom-casmurro.pdf)
  cover: "assets/capa_livros/capa_domcasmurro.jpg",
  genres: ["Romance", "Clássico"]
}
```
- **`file`**: pode ser apenas o nome do arquivo (será resolvido para `assets/books/<arquivo>`), ou um caminho já relativo.
- **`genres`**: a lista de chips é criada automaticamente a partir de todos os gêneros definidos.

---

## 🎨 Design system (resumo)

- Paleta: **Navy** `#0D2A4A`, **Dourado** `#D4AF37` (hover `#b89126`), tons claros/escuros para texto e fundos.
- Componentes prontos: **Navbar** com menu móvel, **Hero**, **Cards** de livro, **Chips**, **Forms**, **Toast**, **Footer**.
- Responsividade: *breakpoints* móveis/tablet/desktop com grids `cols-2/3/4` e `@media` simples.
- Acessibilidade: `aria-label` em buscas, `aria-current="page"` nos links ativos, contrastes em dark mode e foco com `box-shadow`.

---

## 🚀 Deploy

- **GitHub Pages** (estático): habilite Pages no repositório → Branch `main` → pasta `/ (root)`.
- **Vercel/Netlify**: “Import Project” → selecione o repositório → *framework* “Other/Static” → deploy.

URLs de entrada sugeridas:
- `Pag01.html` como **home**; mapeie `/` para `Pag01.html` se sua plataforma permitir *rewrite*.

---

## 🔐 Avisos de uso e direitos

- Este projeto é **didático**. Não armazene informações sensíveis nem reutilize senhas reais.
- Confirme que **os PDFs adicionados** estão em **domínio público** ou possuem **licença** compatível com redistribuição.
- Marcas, imagens e nomes são usados apenas para fins educacionais.

---

## 🛣️ Roadmap (sugestões)

- Paginação e/ou *lazy‑loading* no catálogo
- Indicadores de leitura contínua (ex.: salvar página/posição)
- Busca por autor/gênero em *hash* navegável
- PWA (*offline* básico com Service Worker)
- Backend real (cadastro/login com hash de senhas) e biblioteca do usuário
- Indicadores de acessibilidade (salt links, melhor rota de foco)

---

## 🧑‍💻 Tecnologias

- **HTML5**, **CSS3** (variáveis/tokens, responsivo), **JavaScript** (ES Modules)
- **localStorage** para prototipagem de autenticação
- **iFrame** como leitor de PDF

---

## 🙌 Créditos

**UI/UX & Dev:** Keeylb Santos
**Projeto educacional** — Análise e Desenvolvimento de Sistemas (ADS)

---

## 📄 Licença

Este repositório é disponibilizado sob a **MIT License** (exceto arquivos de livros/imagens que possam ter licenças próprias).


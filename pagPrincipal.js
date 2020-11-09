const CUPOM_DESCONTO = "HTMLNAOELINGUAGEM";

function listagemDeFilmes(filmes, elemento) {
  elemento.innerHTML = "";
  for (const filme of filmes) {
    const li = document.createElement("li");
    li.innerHTML = `
			  <img class="poster" src="${filme.poster_path}" />
				  <div class="overlay">
					<img src="pics/Star_2.png" />
					<div class="infoDeFilmes">
					  <h3>${filme.title}</h3>
					  <div class="avaliacao">
						<img src="pics/Star_1.png" /> 
						${filme.vote_average}
					  </div>
					</div>
					<button>
					  <span>Sacola</span>
					  <span class="preco">R$ <span>${filme.price}</span></span>
					</button>
				  </div>
				  `;
    elemento.append(li);

    const elementoBotao = li.querySelector("button");
    elementoBotao.addEventListener("click", () => {
      const valorPersistido = localStorage.getItem("sacola");
      let sacola = [];
      if (valorPersistido) {
        sacola = JSON.parse(valorPersistido);
      }

      const filmeNaSacola = sacola.filter(
        (itemDeSacola) => itemDeSacola.filme.id === filme.id
      )[0];
      if (filmeNaSacola) {
        filmeNaSacola.qtd++;
      } else {
        sacola.push({ qtd: 1, filme: filme });
      }

      localStorage.setItem("sacola", JSON.stringify(sacola));
      popularSacola();
    });
  }
}

fetch(
  "https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR"
)
  .then((res) => res.json())
  .then((respostaJson) => {
    const filmes = respostaJson.results;

    const listagemGeralFilmes = document.querySelector(
      ".listagem.geral .filmes"
    );
    listagemDeFilmes(filmes, listagemGeralFilmes);

    const listagemTopFIlmes = document.querySelector(".listagem.top .filmes");
    listagemDeFilmes(filmes.slice(0, 5), listagemTopFIlmes);
  });

function popularSacola() {
  const valorPersistido = localStorage.getItem("sacola");
  const cupom = localStorage.getItem("cupom");

  let sacola = [];
  if (valorPersistido) {
    sacola = JSON.parse(valorPersistido);
  }

  const elementoItensSacola = document.querySelector(".itens-sacola");
  const elementoSacolaVazia = document.querySelector(".sacola-vazia");
  const elementoBotaoConfirmar = document.querySelector(".sacola .confirmar");
  if (sacola.length === 0) {
    elementoItensSacola.setAttribute("hidden", "");
    elementoBotaoConfirmar.setAttribute("hidden", "");
    elementoSacolaVazia.removeAttribute("hidden");
  } else {
    elementoItensSacola.removeAttribute("hidden");
    elementoBotaoConfirmar.removeAttribute("hidden");
    elementoSacolaVazia.setAttribute("hidden", "");

    elementoItensSacola.innerHTML = "";
    for (const item of sacola) {
      const li = document.createElement("li");
      li.innerHTML = `
		<img src="${item.filme.poster_path}" />
        <div class="metadados">
            <div class="titulo">${item.filme.title}</div>
            <div class="preco">R$ ${item.filme.price}</div>
        </div>
        <div class="acoes">
            <button class="adicionar">+</button>
			<span class="quantidade">${item.qtd}</span>
			<button class="remover">
			${
        item.qtd === 1
          ? `
			<img src="pics/icons8-remover-24.png" />
			`
          : `-`
      }</button>			
        </div>
		`;

      elementoItensSacola.append(li);

      const botaoAdicionar = li.querySelector(".adicionar");
      const botaoRemover = li.querySelector(".remover");

      botaoAdicionar.addEventListener("click", () => {
        item.qtd++;
        localStorage.setItem("sacola", JSON.stringify(sacola));
        popularSacola();
      });

      botaoRemover.addEventListener("click", () => {
        if (item.qtd > 1) {
          item.qtd--;
        } else {
          sacola = sacola.filter(
            (itemDeSacola) => itemDeSacola.filme.id !== item.filme.id
          );
        }

        localStorage.setItem("sacola", JSON.stringify(sacola));
        popularSacola();
      });
    }
    const elementoPrecoTotal = document.querySelector(".confirmar .preco");
    const precoTotal = sacola.reduce((soma, itemDeSacola) => {
      return soma + itemDeSacola.qtd * itemDeSacola.filme.price;
    }, 0);

    elementoPrecoTotal.innerText =
      cupom === CUPOM_DESCONTO ? precoTotal / 2 : precoTotal;
  }
}

//banner contador
const temporizador = document.querySelector(".tempoDoCupom");
const banner = document.querySelector(".bannerDeCupom");
let segundos = 59;
let minutos = 4;

const contador = () => {
  temporizador.innerText = `00:0${minutos}:${segundos}`;
  segundos--;
  if (segundos === 0) {
    minutos--;
    segundos = 59;

    if (minutos === -1) {
      banner.setAttribute("hidden", "");
      clearInterval(tempo);
    }
  }
};

let tempo = setInterval(contador, 1000);

// adicionar cupom clicando no banner
const cupomPreenchido = document.querySelector(".input-cupom input");
banner.addEventListener("click", () => {
  clearInterval(tempo);
  const cupom = document.querySelector(".textoCupom");

  cupomPreenchido.value = cupom.innerText;
  banner.setAttribute("hidden", "");
});

popularSacola();

cupomPreenchido.addEventListener("input", () => {
  localStorage.setItem("cupom", cupomPreenchido.value);
  popularSacola();
});
cupomPreenchido.value = localStorage.getItem("cupom");

const btTodos = document.querySelector(".botoesDosGeneros button:first-child");
btTodos.addEventListener("click", () => {
  fetch(
    "https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR"
  )
    .then((res) => res.json())
    .then((respostaJson) => {
      const filmes = respostaJson.results;

      const listagemGeralFilmes = document.querySelector(
        ".listagem.geral .filmes"
      );
      listagemDeFilmes(filmes, listagemGeralFilmes);
    });
});

fetch(
  "https://tmdb-proxy-workers.vhfmag.workers.dev/3/genre/movie/list?language=pt-BR"
)
  .then((res) => res.json())
  .then((respostaJson) => {
    const generos = respostaJson.genres;

    const elementoFiltros = document.querySelector(".botoesDosGeneros");
    for (const genero of generos.slice(0, 9)) {
      const button = document.createElement("button");
      button.innerText = genero.name;
      elementoFiltros.append(button);

      button.addEventListener("click", () => {
        fetch(
          `https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?with_genres=${genero.id}&language=pt-BR`
        )
          .then((res) => res.json())
          .then((respostaJson) => {
            const filmes = respostaJson.results;
            const listagemGeralFilmes = document.querySelector(
              ".listagem.geral .filmes"
            );
            listagemDeFilmes(filmes, listagemGeralFilmes);
          });
      });
    }
  });

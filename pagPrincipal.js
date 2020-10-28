function listagemDeFilmes(filmes, elemento) {
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
  }
}

fetch(
  "https://tmdb-proxy-workers.vhfmag.workers.dev/3/discover/movie?language=pt-BR"
)
  .then((res) => res.json())
  .then((respostaJson) => {
    const filmes = respostaJson.results;

    const listagemGeralFIlmes = document.querySelector(
      ".listagem.geral .filmes"
    );
    listagemDeFilmes(filmes, listagemGeralFIlmes);

    const listagemTopFIlmes = document.querySelector(".listagem.top .filmes");
    listagemDeFilmes(filmes.slice(0, 5), listagemTopFIlmes);
  });

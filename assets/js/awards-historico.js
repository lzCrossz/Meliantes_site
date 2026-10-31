// Resultados das edições passadas (votadas no Discord), exibidos em awards.html.
//
// Se só souber o vencedor:
//     { categoria: "Melhor jogador", vencedor: { nome: "Cross", img: "assets/lzcross.jpg" } },
//
// Se houve empate, use "vencedores" com uma lista:
//     { categoria: "Mais inteligente", vencedores: [ { nome: "Cross" }, { nome: "Oliveira" } ] },
//
// Se tiver a contagem de votos (a porcentagem é calculada sozinha):
//     { categoria: "Melhor jogador", resultados: [
//         { nome: "Cross", votos: 7, img: "assets/lzcross.jpg" },
//         { nome: "gica", votos: 3 }
//     ] },
//
// "img" é opcional. Para casal/dupla dá para usar duas fotos: img: ["assets/a.jpg", "assets/b.jpg"]
// "detalhe" (opcional) aparece embaixo do nome do vencedor.
// "destaque: true" transforma a categoria no card dourado do prêmio máximo; destaque: "pior" no card vermelho da vergonha.
const awardsHistorico = {
    2025: [
        { categoria: "Mais provável de ser preso", vencedor: { nome: "Oliveira", img: "assets/oliveira.jpg" } },
        { categoria: "Mais provável de ter filho", vencedor: { nome: "Oliveira", img: "assets/oliveira.jpg" } },
        { categoria: "Mais machista", vencedor: { nome: "ZERØ", img: "assets/zero.jpg" } },
        { categoria: "Mais burro", vencedor: { nome: "Bielcachu", img: "assets/bielcachu.jpg" } },
        { categoria: "Mais inteligente", vencedor: { nome: "Gusttxxx", img: "assets/gusttxxx.jpg" } },
        { categoria: "Mais dramático", vencedor: { nome: "gica", img: "assets/gica.jpg" } },
        { categoria: "Mais estressado", vencedor: { nome: "Akimbo", img: "assets/akimbo.jpg" } },
        { categoria: "Pior jogador", vencedor: { nome: "gica", img: "assets/gica.jpg" } },
        { categoria: "Melhor jogador", vencedor: { nome: "Cross", img: "assets/lzcross.jpg" } },
        { categoria: "Melhor coadjuvante", vencedor: { nome: "Morcega", img: "assets/morcega.jpg" } },
        { categoria: "Melhor casal", vencedor: { nome: "Cross & Putridkhan31", img: ["assets/lzcross.jpg", "assets/putridkhan31.jpg"] } },
        { categoria: "Momento do ano", vencedor: { nome: "“Deixa Comigo”", detalhe: "por Bielcachu", img: "assets/bielcachu.jpg" } },
        { categoria: "Jogo do ano (GOTY)", vencedor: { nome: "Silksong", img: "assets/silksong.jpg" } },
        { categoria: "Jogo multiplayer do ano", vencedor: { nome: "R.E.P.O", img: "assets/repo.jpg" } },
        { categoria: "Pior Meliante do ano", destaque: "pior", vencedor: { nome: "Putridkhan31", img: "assets/putridkhan31.jpg" } },
        { categoria: "Melhor Meliante do ano", destaque: true, vencedor: { nome: "Gusttxxx", img: "assets/gusttxxx.jpg" } }
    ],
    2024: [
        { categoria: "Mais provável de ser preso", vencedor: { nome: "Manopombo", img: "assets/manopombo.jpg" } },
        { categoria: "Mais provável de ter filho antes dos 18", vencedor: { nome: "Oliveira", img: "assets/oliveira.jpg" } },
        { categoria: "Mais inteligente", vencedores: [
            { nome: "Gusttxxx", img: "assets/gusttxxx.jpg" },
            { nome: "Oliveira", img: "assets/oliveira.jpg" },
            { nome: "Cross", img: "assets/lzcross.jpg" }
        ] },
        { categoria: "Mais burro", vencedor: { nome: "Manopombo", img: "assets/manopombo.jpg" } },
        { categoria: "Mais gostoso(a)", vencedor: { nome: "Putridkhan31", img: "assets/putridkhan31.jpg" } },
        { categoria: "Mais homossexual", vencedor: { nome: "Manopombo", img: "assets/manopombo.jpg" } },
        { categoria: "Mais hétero", vencedor: { nome: "Oliveira", img: "assets/oliveira.jpg" } },
        { categoria: "Mais preconceituoso", vencedores: [
            { nome: "Putridkhan31", img: "assets/putridkhan31.jpg" },
            { nome: "Manopombo", img: "assets/manopombo.jpg" },
            { nome: "kaktusz", img: "assets/kaktusz.jpg" }
        ] },
        { categoria: "Mais machista", vencedor: { nome: "kaktusz", img: "assets/kaktusz.jpg" } },
        { categoria: "Mais dramático", vencedor: { nome: "Putridkhan31", img: "assets/putridkhan31.jpg" } },
        { categoria: "Pior nos jogos", vencedores: [
            { nome: "Gusttxxx", img: "assets/gusttxxx.jpg" },
            { nome: "Oliveira", img: "assets/oliveira.jpg" }
        ] },
        { categoria: "Melhor jogo do ano", vencedor: { nome: "Roblox", img: "assets/roblox.jpg" } },
        { categoria: "Mais provável de vir a óbito antes de 2025", vencedor: { nome: "Manopombo", img: "assets/manopombo.jpg" } },
        { categoria: "Mais maluco", vencedor: { nome: "Oliveira", img: "assets/oliveira.jpg" } },
        { categoria: "Pior Meliante do ano", destaque: "pior", vencedor: { nome: "Putridkhan31", img: "assets/putridkhan31.jpg" } },
        { categoria: "Melhor Meliante do ano", destaque: true, vencedor: { nome: "JUAN", img: "assets/juan.jpg" } }
    ]
};

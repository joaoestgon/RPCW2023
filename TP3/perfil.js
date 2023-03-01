exports.generatePerfil = function(pessoa){
    var pagHTML = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8"/>
                <link rel="stylesheet" href="w3.css"/>
                <title>Perfil</title>
            </head>
            <body>
                <div class="w3-container">
                    <header class="w3-container w3-indigo">
                        <h2 >${pessoa[0].nome}</h2>
                    </header>
                    <ul class="w3-ul w3-card-4">
                        <li><strong>ID:</strong> ${pessoa[0].id}</li>
                        <li><strong>Idade:</strong> ${pessoa[0].idade}</li>
                        <li><strong>Sexo:</strong> ${pessoa[0].sexo}</li>
                        <li><strong>Cidade:</strong> ${pessoa[0].morada.cidade} (${pessoa[0].morada.distrito})</li>
                        <li><strong>CC:</strong> ${pessoa[0].BI} ${pessoa[0].CC}</li>
                        <li><strong>Profissão:</strong> ${pessoa[0].profissao}</li>
                        <li><strong>Partido Político:</strong> ${pessoa[0].partido_politico.party_name} (${pessoa[0].partido_politico.party_abbr})</li>                        
                        <li><strong>Religião:</strong> ${pessoa[0].religiao}</li>
                        <li><strong>Desporto(s):</strong> ${pessoa[0].desportos}</li>
                        <li><strong>Animais:</strong> ${pessoa[0].animais}</li>
                        <li><strong>Figura(s) Pública(s):</strong> ${pessoa[0].figura_publica_pt}</li>
                        <li><strong>Marca do Carro:</strong> ${pessoa[0].marca_carro}</li>
                        <li><strong>Destino(s) Favorito(s):</strong> ${pessoa[0].destinos_favoritos}</li>
                        <li><strong>Comida Favorita:</strong> ${pessoa[0].atributos.comida_favorita}</li>
                        <li>
                        <strong>Atributos</strong>
                        <ul class="w3-ul w3-card-4">
                            <li><strong>Fumador(a):</strong> ${pessoa[0].atributos.fumador}</li>
                            <li><strong>Gosta de Cinema:</strong> ${pessoa[0].atributos.gosta_cinema}</li>
                            <li><strong>Gosta de Viajar:</strong> ${pessoa[0].atributos.gosta_viajar}</li>
                            <li><strong>Acorda Cedo:</strong> ${pessoa[0].atributos.acorda_cedo}</li>
                            <li><strong>Gosta de Ler:</strong> ${pessoa[0].atributos.gosta_ler}</li>
                            <li><strong>Gosta de Música:</strong> ${pessoa[0].atributos.gosta_musica}</li>
                            <li><strong>Gosta de Comer:</strong> ${pessoa[0].atributos.gosta_comer}</li>
                            <li><strong>Gosta de Animais de Estimação:</strong> ${pessoa[0].atributos.gosta_animais_estimacao}</li>
                            <li><strong>Gosta de Dançar:</strong> ${pessoa[0].atributos.gosta_dancar}</li>
                            </ul>
                        </li>                       
                        </ul>
                </div>
                </div>
                    <footer class="w3-container w3-indigo">
                        <h5>Generated in TPC3 - RPCW2023</h5>
                    </footer>
                </div>
            </body>
        </html>
    `

    return pagHTML
}
var http = require('http')
var axios = require('axios')
var static = require('./static.js')

var {parse} = require('querystring')


function formatDate(date){
    var newDate = new Date(date)
    year = newDate.getFullYear()
    month = newDate.getMonth() + 1
    dt = newDate.getDate()
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return (year + '-' + month + '-' + dt)
}

function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end',() =>{
            console.log(body)
            callback(parse(body))
        })
    }
}

function geraPagPrincipal(tarefas, d, tarefa){
    let realizadas = new Array();
    let naoRealizadas = new Array()

    tarefas.forEach(t => {
        if (t.done == "true"){
            realizadas.push(t)
        } else if (t.done == "false") {
            naoRealizadas.push(t)
        }
    })
    // Preencher o html
    let pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>ToDo List</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-bottombar w3-padding-16">`

            if (JSON.stringify(tarefa) !== '{}'){
                pagHTML += `
                <form class="w3-container" action="/tarefas/${tarefa.id}" method="POST">
                `
            } else {
                pagHTML += `
                <form class="w3-container" action="/tarefas" method="POST">
                `
            }
                
            pagHTML += `<div class="w3-row-padding">`

                    if (JSON.stringify(tarefa) !== '{}'){
                        pagHTML += `<div class="w3-third">
                        <label class="w3-text-indigo"><b>Data limite</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="date" placeholder="${tarefa.deadline}" onfocus="(this.type='date')" onblur="(this.type='text')" name="deadline">
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-indigo"><b>author</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="${tarefa.author}" name="author">
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-indigo"><b>Descrição</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="text" placeholder="${tarefa.desc}" name="desc">
                    </div>`
                    } else {
                        pagHTML += `<div class="w3-third">
                        <label class="w3-text-indigo"><b>Data limite</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="date" name="deadline" required>
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-indigo"><b>Autor</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="text" name="author" required>
                    </div>
                    <div class="w3-third">
                        <label class="w3-text-indigo"><b>Descrição</b></label>
                        <input class="w3-input w3-border w3-round w3-light-grey" type="text" name="desc" required>
                    </div>`
                    }
                    
                    pagHTML += `
                    </div>
                    <div class="w3-center w3-margin-top">
                        <input class="w3-btn w3-round-large w3-indigo" type="submit" value="Registar"/>
                        <input class="w3-btn w3-round-large w3-teal" type="reset" value="Limpar"/>
                    </div>
                </form>
            </div>
            <div class="w3-row">
                <div class="w3-col s6">
                    <h2 class="w3-text-indigo w3-center">Tarefas por Realizar</h2>`

// Adicionar as tarefas por realizar
if (naoRealizadas.length == 0) {
    pagHTML += '<p class="w3-center">Não há tarefas para mostrar.</p>'
}

naoRealizadas.forEach(nr => {
    pagHTML += `<div class="w3-container">`
    pagHTML += `<ul class="w3-ul w3-border">`
    pagHTML += `<li>${nr.author} | ${nr.desc} | Data limite: ${nr.deadline}
                    <a href="http://localhost:7777/tarefas/${nr.id}/editar" class="w3-btn w3-blue w3-round-large w3-padding-small">Editar</a>
                    <a href="http://localhost:7777/tarefas/${nr.id}/feito" class="w3-btn w3-green w3-round-large w3-padding-small">Feito</a>
                    <a href="http://localhost:7777/tarefas/${nr.id}/eliminar" class="w3-btn w3-red w3-round-large w3-padding-small">Eliminar</a>
                </li>`
    pagHTML += `</ul>`
    pagHTML += `</div>`
})

pagHTML += `
                </div>
                <div class="w3-col s6">
                    <h2 class="w3-text-indigo w3-center">Tarefas Realizadas</h2>`

// Adicionar as tarefas realizadas
if (realizadas.length == 0) {
    pagHTML += '<p class="w3-center">Adicione uma Tarefa.</p>'
}

realizadas.forEach(r => {
    pagHTML += `<div class="w3-container">`
    pagHTML += `<ul class="w3-ul w3-border">`
    pagHTML += `<li>${r.author} | ${r.desc}
                    <a href="http://localhost:7777/tarefas/${r.id}/eliminar" class="w3-btn w3-red w3-round-large w3-padding-small">Eliminar</a>
                </li>`
    pagHTML += `</ul>`
    pagHTML += `</div>`
})

pagHTML += `
                </div>
            </div> 
        </body>
    </html>
    `
    return pagHTML
  }

// Serverr

var tarefasServer = http.createServer(function (req, res) {

    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET / ou /tarefas --------------------------------------------------------------------
                if((req.url == "/") || (req.url == "/tarefas")){
                    axios.get("http://localhost:3000/tarefas")
                        .then(response => {
                            var tarefas = response.data
                            console.log('GET da página principal bem sucedido')
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagPrincipal(tarefas, d, {}))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a página principal...")
                            res.end()
                        })
                }
                // GET /tarefas/:id/editar --------------------------------------------------------------------
                else if (/\/tarefas\/[0-9]+\/editar$/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    axios.get('http://localhost:3000/tarefas')
                    .then(respTarefas => {
                        axios.get('http://localhost:3000/tarefas?id=' + idTarefa)
                        .then(respTarefa => {
                            console.log('GET para editar: Tarefa ' + idTarefa)
                            console.log(respTarefa.data);
                            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                            res.write(geraPagPrincipal(respTarefas.data, d, (respTarefa.data)[0]))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                            res.write('<p>Erro no edit: ' + error + '</p>')
                            res.end()
                        });
                    })
                    .catch(error => {
                        console.log('Erro: ' + error);
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                        res.write('<p>Erro no edit: ' + error + '</p>')
                        res.end()
                    });
                }
                // GET /tarefas/:id/feito --------------------------------------------------------------------
                else if (/\/tarefas\/[0-9]+\/feito$/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    axios.get('http://localhost:3000/tarefas?id=' + idTarefa)
                    .then(resp => {
                        tarefa = (resp.data)[0]
                        tarefa.done = "true"
                        axios.put('http://localhost:3000/tarefas/' + idTarefa, tarefa)
                            .then(resp => {
                                console.log('GET para marcar a tarefa com id ' + idTarefa + ' como realizada, sucesso!')
                                res.writeHead(303, {'Location': '/'})
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                                res.write('<p>Erro ao marcar a tarefa como realizada: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            });
                    })
                    .catch(error => {
                        console.log('Erro: ' + error);
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                        res.write('<p>Erro ao marcar a tarefa como realizada: ' + error + '</p>')
                        res.end()
                    });
                }
                // GET /tarefas/:id/eliminar --------------------------------------------------------------------
                else if (/\/tarefas\/[0-9]+\/eliminar$/.test(req.url)){
                    var idTarefa = req.url.split("/")[2]
                    axios.delete('http://localhost:3000/tarefas/' + idTarefa)
                    .then(resp => {
                        console.log('GET: Tarefa ' + idTarefa + ' eliminada!')
                        console.log(resp.data);
                        res.writeHead(303, {'Location':'/'})
                        res.end()
                    })
                    .catch(error => {
                        console.log('Erro: ' + error);
                        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                        res.write('<p>Erro ao eliminar tarefa: ' + erro + '</p>')
                        res.end()
                    });
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                if(req.url == '/tarefas'){
                    recuperaInfo(req, resultado => {
                        dataCriacao = formatDate(d)
                        console.log('POST de uma tarefa: ' + JSON.stringify(resultado))
                        resultado["done"] = false
                        axios.post('http://localhost:3000/tarefas', resultado)
                        .then(resp => {
                            res.writeHead(303, {'Location': '/'})
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                    })
                }
                else if (/\/tarefas\/[0-9+]/.test(req.url)){
                    recuperaInfo(req, resultado => {
                        var idTarefa = req.url.split("/")[2]
                        console.log('POST de uma tarefa editada: ' + idTarefa + ' - ' +  JSON.stringify(resultado))
                        axios.get('http://localhost:3000/tarefas?id=' + idTarefa)
                        .then(resp => {
                            var tarefa = (resp.data)[0]
                            if (resultado.deadline != ""){
                                tarefa.deadline = resultado.deadline
                            }
                            if (resultado.author != ""){
                                tarefa.author = resultado.author
                            }
                            if (resultado.desc != ""){
                                tarefa.desc = resultado.desc
                            }
                            axios.put('http://localhost:3000/tarefas/' + idTarefa, tarefa)
                            .then(resp => {
                                res.writeHead(303, {'Location': '/'})
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST da edição: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            });
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                            res.write('<p>Erro no POST da edição: ' + erro + '</p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        });
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'})
                    res.write('<p>POST não suportado.</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado.</p>")
                res.end()
        }
    }
})

tarefasServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')
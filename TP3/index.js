var http = require('http')
var url = require('url')
var axios = require('axios')
var mypages = require('./mypages.js')
const { pessoasPage } = require('./mypages.js')

var perfil = require('./perfil.js')
const { generatePerfil } = require('./perfil.js')

var fs = require('fs')

http.createServer(function(req, res){

    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    var dicURL = url.parse(req.url, true)

    if(dicURL.pathname == "/"){
        axios.get("http://localhost:3000/pessoas?id=p1")
            .then(function(resp){
                var pessoas = resp.data
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                //res.end(pessoasPage(pessoas))
                res.end(generatePerfil(pessoas))
            })
            // Sintaxe de usada para a função no Catch é mais "moderno"
            .catch(erro => {
                console.log("Erro no Axios: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end("ERRO: " + erro)
            })
    }else if(dicURL.pathname == "/ordenada"){
        axios.get("http://localhost:3000/pessoas?_sort=nome&_order=asc")
            .then(function(resp){
                var pessoas = resp.data
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(pessoasPage(pessoas))
            })
            // Sintaxe de usada para a função no Catch é mais "moderno"
            .catch(erro => {
                console.log("Erro no Axios: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end("ERRO: " + erro)
            })
    }else if(dicURL.pathname == "/ordenadav2"){
        axios.get("http://localhost:3000/pessoas")
            .then(function(resp){
                var pessoas = resp.data
                let pessoasOrd = pessoas.sort(
                    (p1, p2) => (p1.nome < p2.nome) ? -1 : 1
                    // function(p1, p2){return (p1.nome < p2.nome) ? -1 : 1}
                )
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(pessoasPage(pessoasOrd))
            })
            // Sintaxe de usada para a função no Catch é mais "moderno"
            .catch(erro => {
                console.log("Erro no Axios: " + erro)
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end("ERRO: " + erro)
            })
    }else if(dicURL.pathname == "/w3.css"){
        fs.readFile('w3.css', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/css'});
            if(err) {
                console.log("Erro na leitura da Stylesheet.")
                res.write("Erro: " + err)
            } else {
                res.write(data)
            }
            res.end()
        })
    }else{
        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
        res.end("Erro: Operação não suportada.")        
    }
}).listen(7777)

console.log("Servidor a ouvir funk no BA...")
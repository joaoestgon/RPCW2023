var http = require('http');
var fs = require('fs');
const { isInt32Array } = require('util/types');

var myserver = http.createServer(function(req, res) {
    
    var numarq = req.url.substring(1,2)

    fs.readFile('files/arq' + numarq + '.xml', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/xml; charset=utf-8'});
        if(err) {
            res.write("Erro: " + err)
        } else {
            res.write(data)
        }
        res.end()
    })
})

myserver.listen(7777)
console.log("Servidor a ouvir funk no BA...")
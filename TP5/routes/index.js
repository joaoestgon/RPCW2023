var express = require('express');
var router = express.Router();

var Tarefa = require('../controllers/tarefa')

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Tarefa.list()
    .then(tarefas => {
      res.render('index', { tarefas_list: tarefas, d: data, tarefa: {}})
    })
    .catch(erro => {
      // Usa a template pug 'error' que recebe uma variavel error, que é um dicionário com um parâmetro, neste caso 'erro'
      res.render('error', {error: erro})
    })
});


module.exports = router;

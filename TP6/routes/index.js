var express = require('express');
var router = express.Router();

// Importar os Controllers
var Pessoa = require('../controllers/pessoa')

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Pessoa.list()
    .then(pessoas => {
      res.render('index', { pessoas_list: pessoas, d: data });
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de pessoas"})
    })
});

/* GET Pessoa Form. */
router.get('/pessoas/registo', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  res.render('addPessoaForm', {d: data})
});

/* GET Pessoa page. */
router.get('/pessoas/:idPessoa', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Pessoa.getPessoa(req.params.idPessoa)
    .then(pessoa => {
      res.render('pessoa', { p: pessoa, d: data });
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo da pessoa."})
    })
});

/* GET Pessoa Update Form. */
router.get('/pessoas/edit/:idPessoa', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Pessoa.getPessoa(req.params.idPessoa)
    .then(pessoa => {
      res.render('updatePessoaForm', {p: pessoa, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo da pessoa."})
    })
});

/* GET Pessoa Delete Form. */
router.get('/pessoas/delete/:idPessoa', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Pessoa.getPessoa(req.params.idPessoa)
    .then(pessoa => {
      res.render('deletePessoaForm', {p: pessoa, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
});

/* GET Delete Confirmation */
router.get('/pessoas/delete/:idPessoa/confirm', (req,res)=>{
  Pessoa.deletePessoa(req.params.idPessoa)
    .then(resposta => {
      res.redirect('/')
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo da pessoa."})
    })
})

// POST Pessoa Form Data
router.post('/pessoas/registo', (req,res) => {
  var data = new Date().toISOString().substring(0, 16)
  Pessoa.addPessoa(req.body)
    .then(pessoa => {
      res.render('addPessoaConfirm', {p: pessoa})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro no armazenamento do registo da pessoa."})
    })
})

// POST Pessoa Update Form
router.post('/pessoas/edit', (req,res) => {
  var data = new Date().toISOString().substring(0, 16)
  Pessoa.updatePessoa(req.body)
    .then(pessoa => {
      res.render('updatePessoaConfirm', {p: pessoa})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do registo da pessoa."})
    })
})

module.exports = router;

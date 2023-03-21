var Pessoa = require('../models/pessoa')

module.exports.list = () => {
    return Pessoa
            .find()
            .sort({nome:1})
    .then(Pessoa => {
        return Pessoa
    })
    .catch(erro => {
        return erro
    })
}

module.exports.getPessoa = id => {
    return Pessoa.findOne({id: id})
        .then(Pessoa => {
            return Pessoa
        })
        .catch(erro => {
            return erro
        })
}

module.exports.addPessoa = p => {
    return Pessoa.create(p)
        .then(Pessoa => {
            return Pessoa
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updatePessoa = p => {
        return Pessoa.updateOne({id: p.id}, p)
        .then(Pessoa => {
            return Pessoa
        })
        .catch(erro => {
            return erro
        })
}

module.exports.deletePessoa = id => {
    return Pessoa.deleteOne({id: id})
        .then(Pessoa => {
            return Pessoa
        })
        .catch(erro => {
            return erro
        })
}
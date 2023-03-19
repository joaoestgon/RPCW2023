const axios = require('axios')

module.exports.list = () => {
    return axios.get('http://localhost:3000/tarefas')
        .then(resposta => {
            return resposta.data
        })
        .catch(erro => {
            return erro
        })
}

module.exports.getTarefas = id => {
    return axios.get('http://localhost:3000/tarefas?id=' + id)
    .then(resposta => {
        return resposta.data
    })
    .catch(erro => {
        return erro
    })
}

module.exports.addTarefa = tarefa => {
    return axios.post('http://localhost:3000/tarefas', tarefa)
    .then(resposta => {
        return resposta.data
    })
    .catch(erro => {
        return erro
    })
}

module.exports.editTarefa = tarefa => {
    return axios.post('http://localhost:3000/tarefas' + tarefa.id, tarefa)
    .then(resposta => {
        return resposta.data
    })
    .catch(erro => {
        return erro
    })
}

module.exports.deleteTarefa = id => {
    return axios.delete('http://localhost:3000/tarefas/delete/' + id)
    .then(resposta => {
        return resposta.data
    })
    .catch(erro => {
        return erro
    })
}
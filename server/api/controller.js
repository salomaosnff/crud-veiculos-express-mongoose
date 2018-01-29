const db = require('../lib/db')
const Veiculo = require('../models/Veiculo')

exports = module.exports

// Lista Todos os veículos
exports.readAll = (req, res, next) => {
  const limit = req.query.limite || 50
  const offset = req.query.inicio || 0

  Veiculo.find({})
    .skip(+offset)
    .limit(+limit)
    .sort('-created')
    .exec()
    .then((result) => {
      if (result) return res.sendResult(result)
      res.sendError('Not Found', {}, 404)
    })
    .catch((error) => res.sendError(error))
}

// Lista um veículo
exports.read = (req, res, next) => {
  if (!Veiculo.idIsValid(req.params.id)) {
    return res.sendError('Id inválido!', 403)
  }

  Veiculo.findById(req.params.id)
    .then((result) => {
      if (result) return res.sendResult(result)
      res.sendError('Not Found', {}, 404)
    })
    .catch((error) => res.sendError(error))
}

// Cria um veículo
exports.create = (req, res, next) => {
  Veiculo.create({
    veiculo: req.body.veiculo,
    marca: req.body.marca,
    ano: req.body.ano,
    descricao: req.body.descricao,
    vendido: req.body.vendido,
  }, (error, result) => {
    if (error) return res.sendError(error)
    res.sendResult(result, 201)
  })
}

// Exclui um veículo
exports.delete = (req, res, next) => {
  if (!Veiculo.idIsValid(req.params.id)) {
    return res.sendError('Id inválido!', 403)
  }
  Veiculo.removeById(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => res.senError(error))
}

// Atualiza os campos do veículo
exports.update = (req, res, next) => {
  if (!Veiculo.idIsValid(req.params.id)) {
    return res.sendError('Id inválido!', 403)
  }
  Veiculo.findByIdAndUpdate(req.params.id, req.body, { upsert: true, new: true })
  .then((result) => res.sendResult(result))
  .catch((error) => res.sendError(error))
}

// Atualiza alguns campos do veículo
exports.patch = (req, res, next) => {
  if (!Veiculo.idIsValid(req.params.id)) {
    return res.sendError('Id inválido!', 403)
  }

  Veiculo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((result) => res.sendResult(result))
    .catch((error) => res.sendError(error))
}

// Busca um veículo
exports.search = (req, res, next) => {
  const limit = req.query.limite || 50
  const offset = req.query.inicio || 0
  const searchExp = (req.query.q || '').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') // Remove caracteres de expresão regular
  
  // Buscar no índice "busca"
  Veiculo.find({ $text: { $search: searchExp } })
  .skip(+offset)
  .limit(+limit)
  .exec()
  .then((result) => {
    if (result) return res.sendResult(result)
    res.sendError('Not Found', {}, 404)
  })
  .catch((error) => res.sendError(error))
}

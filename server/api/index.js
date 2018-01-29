const express = require('express')
const cors = require('cors')

const api = express.Router()
const controller = require('./controller')

// CORS
api.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  })
)

api.route('/veiculos')
  .get(controller.readAll)   // Lista todos os veículos
  .post(controller.create)   // Cria um novo veículo
  
api.get('/veiculos/find', controller.search) // Busca um veículo

api.route('/veiculos/:id')
  .get(controller.read)      // Lista um veículo
  .put(controller.update)    // Atualiza campos de um veículo
  .patch(controller.patch)   // Atualiza alguns campos do veículo
  .delete(controller.delete) // Exclui um veículo


module.exports = api

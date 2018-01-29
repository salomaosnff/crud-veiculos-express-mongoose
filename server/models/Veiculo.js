const mongoose = require('../lib/db')

const VeiculoSchema = new mongoose.Schema({
  veiculo: {
    type: String,
    required: true,
  },
  marca: {
    type: String,
    required: true,
  },
  ano: {
    type: Number,
    min : 1900,
    max : (new Date).getFullYear() + 1,
  },
  descricao: {
    type: String,
  },
  vendido: {
    type: Boolean,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  }
})

// Campos do índice de busca
VeiculoSchema.index({
  veiculo  : 'text',
  marca    : 'text',
  ano      : 'text',
  descricao: 'text',
})

// Antes de salvar...
VeiculoSchema.pre('save', function (done) {

  // Verica se o item é novo, se não for atualizar a data de atualização
  if (!this.isNew) {
    this.updated = Date.now()
  }
  
  done()
})

// Métodos estáticos
VeiculoSchema.statics.idIsValid = (id) => mongoose.Types.ObjectId.isValid(id)

module.exports = mongoose.model('Veiculo', VeiculoSchema)
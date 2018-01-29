const mongoose  = require('mongoose')
const debug = require('./debug')('mongodb')

mongoose.Promise = global.Promise

mongoose.connection.once('open', () => {
  debug('Conexão aberta');

  mongoose.connection.on('connected', () => debug('Conectado'))
  mongoose.connection.on('disconnected', () => debug('Desconectado'))
  mongoose.connection.on('reconnected', () => debug('Reconectado'))
  mongoose.connection.on('error', (err) => debug('[Erro %s] %s', err.code, err.message))
});

mongoose.connect('mongodb://localhost/teste-fullstack')

module.exports = mongoose
const path        = require('path')
const express     = require('express')
const bodyParser  = require('body-parser')

const appFunctions = require('./lib/appFunctions')
const api = require('./api')

const app = express()

// Body Parser
app.use(
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
)

// Servir aquivos do cliente
app.use(express.static(path.resolve(__dirname, '../client/dist')))

// Funções adicionais
app.use(appFunctions)

// Rotas da Api
app.use('/api', api)

// Error Handler
app.use((err, req, res, next) => {
  console.log('[ ERRO %s ] %s', err.code, err.message)
  res.send('<h1>Not Found</h1>')
})

module.exports = app

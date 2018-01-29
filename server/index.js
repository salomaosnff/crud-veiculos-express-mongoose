const app = require('./app')
const serve = require('./lib/server')

// Subir o servidor
serve(app, 8888, 'localhost')

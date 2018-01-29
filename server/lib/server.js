const http = require('http')
const debug = require('./debug')('http')

module.exports = (app, ...listenArgs) => {
  const server = new http.Server(app)

  // Quando o servidor estiver ouvindo requisições...
  server.on('listening', () => {
    const { address, port } = server.address()
    
    debug(`Servidor em execução em http://${address}:${port}/`)
  })

  // Quando o servidor encontrar um erro
  server.on('error', (error) => {
    switch (error.code) {
      case 'EACCES':
        debug('A porta configurada requer permissões elevadas.')
        break
      case 'EADDRINUSE':
        debug('A porta configurada já está em uso.')
        break
      default:
        debug('Erro %s: %s', error.code, error.message)
    }
  })

  return server.listen(...listenArgs)
}

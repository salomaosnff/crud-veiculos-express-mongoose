const { isError } = require('util')

module.exports = (req, res, next) => {

  /**
   * Envia o resultado de uma consulta em formato JSON
   * @param {Object} result 
   * @param {Number} status 
   */
  res.sendResult = function(result, status = 200) {    
    return this.json({
      result,
      timestamp: Date.now(),
    })
  }

  /**
   * Envia um erro para o cliente no formato JSON
   * @param {string,Error} error 
   * @param {Object} info 
   * @param {Number} status
   */
  res.sendError = function(error, info = {}, status = 500) {
    status = error.status || status
    status = Math.max(400, Math.min(599, status)) // Normaliza o status code

    if (isError(error)) {
      info.stack = error.stack
      error = error.message
    }

    return this.status(status).json({
      error,
      info,
      timestamp: Date.now(),
    })

  }

  next()
}
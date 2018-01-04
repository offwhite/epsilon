const http = require('http')

module.exports = function(app){

  const service = this
  service.port = 3000

  service.init = () => {
    service.server = http.createServer(service.requestHandler)

    service.server.listen(service.port, (err) => {
      if (err) {
        return app.log('Http server threw error', err)
      }

      console.log(`server is listening on ${service.port}`)
    })
  }

  service.requestHandler = (request, response) => {
    // whitelist origin
    // parse the route to
    const command = request.url.replace(/\//g,"").replace(/-/g," ")
    console.log(command)
    const commandResponse = app.requests.new(command, 'http')
    response.end(commandResponse)
  }

  service.init()
}

const exec = require('child_process').exec
// interaction channels
const Telegram = require('./lib/Telegram')
const HttpServer = require('./lib/HttpServer')
const Voice = require('./lib/Voice')
const NetworkMonitor = require('./lib/NetworkMonitor')
const Requests = require('./lib/Request')

const app = () => {
  app.contexts = {}
  app.bootSonus = true
  app.voiceCommands = true
  app.logToAdmin = true
  app.telegram = new Telegram(app)

  app.init = function(){
    app.voice = new Voice(app)
    app.networkMonitor = new NetworkMonitor(app)
    app.requests = new Requests(app)
    app.httpServer = new HttpServer(app)
    app.log('I am online now')
  }

  app.postMessage = (message, channel) => {
    if(channel == 'http'){
      return
    }else if(channel == 'voice'){
      app.voice.say(message)
    }else{
      app.telegram.postMessage(message, channel)
    }
  }

  app.toggleVoiceCommands = (state) => {
    if(state == 'on'){
      app.voiceCommands = true
      return 'Voice commands turned on'
    }
    if(state == 'off'){
      app.voiceCommands = false
      return 'Voice commands turned off'
    }
  }

  app.voiceCommandState = () => {
    return app.voiceCommands ? 'Voice commands on' : 'Voice commands off'
  }

  app.shutdown = () => {
    exec('sudo shutdown now')
  }

  app.reboot = () => {
    exec('sudo reboot now')
  }

  app.log = (message) => {
    if(app.logToAdmin){
      app.telegram.log('log: '+message)
    }
    console.log(message)
  }

  app.init()
}

app();

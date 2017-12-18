const exec = require('child_process').exec
// interaction channels
const Telegram = require('./lib/Telegram')
const Voice = require('./lib/Voice')
const NetworkMonitor = require('./lib/NetworkMonitor')
const Requests = require('./lib/Request')

const app = function(){
  app.contexts = {}
  app.bootSonus = true
  app.voiceCommands = true
  app.logToAdmin = false
  app.telegram = new Telegram(app)

  app.init = function(){
    app.voice = new Voice(app)
    app.networkMonitor = new NetworkMonitor(app)
    app.requests = new Requests(app)
    app.log('I am online now')
  }

  app.postMessage = function(message, channel){
    if(channel == 'voice'){
      app.voice.say(message)
    }else{
      app.telegram.postMessage(message, channel)
    }
  }

  app.toggleVoiceCommands = function(state){
    if(state == 'on'){
      app.voiceCommands = true
      return 'Voice commands turned on'
    }
    if(state == 'off'){
      app.voiceCommands = false
      return 'Voice commands turned off'
    }
  }

  app.voiceCommandState = function(){
    return app.voiceCommands ? 'Voice commands on' : 'Voice commands off'
  }

  app.shutdown = function(){
    exec('sudo shutdown now')
  }

  app.reboot = function(){
    exec('sudo reboot now')
  }

  app.log = function(message){
    if(app.logToAdmin){
      app.telegram.log('log: '+message)
    }
    console.log(message)
  }

  app.init()
}

app();

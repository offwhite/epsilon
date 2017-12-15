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
  app.voice = new Voice(app)
  app.telegram = new Telegram(app)
  app.local = true

  app.init = function(){
    app.networkMonitor = new NetworkMonitor(app)
    app.requests = new Requests(app)
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

  app.shutdown = function(){
    exec('sudo shutdown now')
  }

  app.reboot = function(){
    exec('sudo reboot now')
  }

  app.log = function(message){
    if(app.local){
      console.log(message)
    }else{
      app.telegram.log('log: '+message)
    }
  }

  app.init()
}

app();

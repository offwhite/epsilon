
const Requests = require('./lib/Request');

// interaction channels
const Telegram = require('./lib/Telegram');
const Speak = require('./lib/Speak');
const NetworkMonitor = require('./lib/NetworkMonitor');

const app = function(){
  app.contexts = {}
  app.bootSonus = false
  app.voiceCommands = true
  app.speak = new Speak(app)
  app.telegram = new Telegram(app)

  app.init = function(){
    app.networkMonitor = new NetworkMonitor(app)
    app.requests = new Requests(app)
  }

  app.postMessage = function(message, channel){
    if(channel == 'speak'){
      app.speak.say(message)
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

  app.terminate = function(){
    process.exit()
  }

  app.log = function(message){
    app.telegram.log(message)
  }

  app.init()
}

app();

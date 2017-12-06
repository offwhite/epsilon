
const Requests = require('./lib/request');

// interaction channels
const Telegram = require('./lib/telegram');
const Speak = require('./lib/speak');

const app = function(){
  app.contexts = {};
  app.requests = new Requests(app);
  app.telegram = new Telegram(app);
  app.speak = new Speak(app);

  app.postMessage = function(message, channel){
    if(channel == 'speak'){
      app.speak.say(message)
    }else{
      app.telegram.postMessage(message, channel)
    }
  }
}

app();


const Requests = require('./lib/request');

// interaction channels
const Telegram = require('./lib/telegram');
const Speak = require('./lib/speak');

const app = function(){
  app.contexts = {};
  app.requests = new Requests(app);
  app.telegram = new Telegram(app);
  //app.speak = new Speak(app);
}

app();

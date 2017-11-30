const tokens = require('../auth/tokens');
const TelegramBot = require('node-telegram-bot-api');

module.exports = function(app){

  const telegram = this;

  telegram.init = function(){
    telegram.bot = new TelegramBot(tokens.telegram, {polling: true});

    telegram.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const request = msg.text.toLowerCase();

      // check auth on this request

      // process new request
      app.requests.new(telegram.postMessage, request, chatId);
    });
  };

  telegram.postMessage = function(message, channel){
    telegram.bot.sendMessage(channel, message);
  }

  telegram.init();
}

const tokens = require('../auth/tokens');
const TelegramBot = require('node-telegram-bot-api');



module.exports = function(app){

  const telegram = this;
  telegram.james = 495851059;
  telegram.caitlin = 460222415;

  telegram.init = () => {
    telegram.bot = new TelegramBot(tokens.telegram, {polling: true});

    telegram.bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      const request = msg.text.toLowerCase();

      // check auth on this request
      if(chatId != telegram.james && chatId != telegram.caitlin){
        telegram.log('An unknown user messaged: '+chatId)
        telegram.postMessage('Go away', chatId)
        return false
      }

      // process new request
      app.requests.new(request, chatId);
    });
  };

  telegram.log = (message) => {
    telegram.bot.sendMessage(telegram.james, message);
  }

  telegram.postMessage = (message, channel) => {
    if(message.length < 1){
      app.log('telegram message empty')
      return
    }
    if(channel == null){
      app.log('telegram chat empty for: ', message)
      return
    }
    telegram.bot.sendMessage(channel, message, {parse_mode : "markdown"});
  }

  telegram.sendImage = (image, channel) => {
    telegram.bot.sendPhoto(channel, image);
  }

  telegram.init();
}

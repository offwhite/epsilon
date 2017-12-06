const moment = require('moment');

module.exports = function(app){

  const _this = this;
  _this.app = app;

  // does the channel have a valid context?
  _this.channelContexts = function(request, channel){

    const context = _this.validContext(request, channel)
    // does the channel have a valid context?
    if(context === false){
      return false;
    }

    return context.method(request, channel, context.parameters)
  }

  _this.validContext = function(request, channel){
    const context = _this.app.contexts[channel]
    if(context == undefined){
      return false;
    }

    // delete context if older than 20s
    if( ((new Date) - context.time) > 20000 ){
      delete _this.app.contexts[channel]
      return false;
    }

    if(request == 'cancel'){
      delete _this.app.contexts[channel]
      return false
    }

    // run method if matches request
    if(context.matches == '*'){
      return context
    }

    return false;
  }


  // Helpers

}

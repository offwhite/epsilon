const exec = require('child_process').exec
const Commands = require('./Commands');
const Contexts = require('./Contexts');

module.exports = function(app){

  const commands = new Commands(app);
  const contexts = new Contexts(app);

  const requests = this;
  requests.app = app;
  requests.commandsList = [];

  this.init = function(){
    for (let phrase in commands) {
      callback = commands[phrase];
      requests.commandsList.push({"command": requests.commandToRegExp(phrase), "callback": callback, "phrase": phrase });
    }
    //console.log(requests.commandsList);
  }

  this.new = function(request, channel){
    if(request.length < 1){
      return false;
    }

    if(request.includes('shut up') || request.includes('fuck off') || request.includes('ignore')){
      console.log('ignoring')
      return
    }

    var requestedCommand = requests.cleanRequest(request);

    //console.log(requests.app.contexts);

    // check if there is a context for this request
    const contextResponse = contexts.channelContexts(request, channel);
    if(contextResponse !== false){
      app.postMessage(contextResponse, channel)
      return
    }

    // try and match recognized text to one of the commands on the list
    for (let j = 0, l = requests.commandsList.length; j < l; j++) {
      var currentCommand = requests.commandsList[j];
      var result = currentCommand["command"].exec(requestedCommand);
      if (result) {
        var params = result.slice(1);
        params[params.length] = channel

        // execute the matched command
        if(typeof(currentCommand.callback) != 'function'){
          app.log('ERROR! Commands did not return a method: ', currentCommand.callback)
          return
        }
        var response = currentCommand.callback.apply(this, params, channel)
        if(response != null){
          app.postMessage(response, channel)
        }
        return
      }
    }

    // comand not found
    if(channel == 'voice'){
      exec('aplay /bot/resources/sounds/blop.wav')
    }else{
      app.postMessage(request +' is an unknown command', channel)
    }
  }


  const optionalParam = /\s*\((.*?)\)\s*/g;
  const optionalRegex = /(\(\?:[^)]+\))\?/g;
  const namedParam    = /(\(\?)?:\w+/g;
  const splatParam    = /\*\w+/g;
  const escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#]/g;

  this.commandToRegExp = function(command) {
    command = command.replace(escapeRegExp, '\\$&')
                  .replace(optionalParam, '(?:$1)?')
                  .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^\\s]+)';
                  })
                  .replace(splatParam, '(.*?)')
                  .replace(optionalRegex, '\\s*$1?\\s*');
    return new RegExp('^' + command + '$', 'i');
  };

  this.cleanRequest = function(request){
    return request
      .toLowerCase()
      .replace("'","")
      .replace('"',"")
      .trim();
  }

  this.init();
}

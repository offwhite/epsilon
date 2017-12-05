const commands = require('./commands');

module.exports = function(){

  const requests = this;
  requests.commandsList = [];

  this.init = function(){
    for (let phrase in commands) {
      callback = commands[phrase];
      requests.commandsList.push({"command": requests.commandToRegExp(phrase), "callback": callback, "phrase": phrase });
    }

    //console.log(requests.commandsList);
  }

  this.new = function(method, request, channel){
    if(request.length < 1){
      return false;
    }

    var commandText = requests.cleanRequest(request);

    // try and match recognized text to one of the commands on the list
    for (let j = 0, l = requests.commandsList.length; j < l; j++) {
      var currentCommand = requests.commandsList[j];
      var result = currentCommand["command"].exec(commandText);
      if (result) {
        var parameters = result.slice(1);
        // execute the matched command
        var response = currentCommand.callback.apply(this, parameters);
        method(response, channel);
        return;
      }
    }

    // comand not found

    method(request +' is an unknown command', channel);
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

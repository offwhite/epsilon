var matches = require('./matches.json');

module.exports = function(){

  const matcher = this;

  this.match = function(request){
    for( skill in matches){
      let method = matcher.method(request, matches[skill])
      if ( method !== false ){
        return [skill, method];
      }
    }
    return false;
  }

  this.method = function(request, methods){
    for ( method in methods ){
      let triggers = methods[method];
      for ( trigger in triggers ){
        if(this.matchString(this.cleanRequest(request), triggers[trigger])){
          return method;
        }
      }
    }
    return false;
  }

  this.matchString = function(request, trigger){
    if(trigger.indexOf("*") === 0){
      return request === trigger.replace('*', '')
    }else{
      return request.indexOf(trigger) > -1
    }
  }

  this.cleanRequest = function(request){
    return request
      .toLowerCase()
      .replace("'","")
      .replace('"',"");
  }
}

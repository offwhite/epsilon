var Matcher = require('./matcher');
const matcher = new Matcher();

module.exports = function(){

  const requests = this;

  this.new = function(method, request, channel){
    const skill = matcher.match(request);

    if(skill === false){
      method(request +' is an unknown command', channel);
    }else{
      method('execute skill '+skill[0]+':'+skill[1], channel);
      // execute the skill with callback method ^^
    }
  }
}

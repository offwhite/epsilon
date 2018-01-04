const exec = require('child_process').exec

module.exports = function(app){

  const skill = this

  skill.init = function(){
    // we're not using this currently
  }


  skill.mute = function(){
    return 'not installed'
  }


  skill.init()
}

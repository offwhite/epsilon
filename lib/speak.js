const tokens = require('../auth/tokens')
const exec = require('child_process').exec
const say = require('say')
const Sonus = require('sonus')
const speech = require('@google-cloud/speech')({
  projectId: tokens.google_api_project_id,
  keyFilename: './resources/aurora-google-key.json'
})

const hotwords = [{ file: './resources/Epsilon.pmdl', hotword: 'Epsilon', sensitivity: 0.47 }]
const language = "en-UK"
const sonus = Sonus.init({ hotwords,  language, recordProgram: "rec" }, speech)

module.exports = function(app){

  const speak = this;

  // set the volume to max
  exec('amixer set PCM -- -00')

  // speaking

  speak.say = function(message){
    exec('amixer set PCM -- -00')
    console.log('said: ', message)
    say.speak(message)
    return 'said'
  }

  // listening

  if(!app.bootSonus){
    console.log('not booting sonus')
    return
  }

  speak.toggleState = function(state){
    if(state == 'on'){
      speak.start(sonus)
      return 'Voice commands are now active'
    }
    if(state == 'off'){
      speak.stop(sonus)
      return 'Voice commands are no longer active'
    }
    return 'I am not sure what you mean'
  }

  speak.start = function(){
    Sonus.start(sonus)
    console.log('sonus listening')
  }

  speak.stop = function(){
    Sonus.stop()
  }

  sonus.on('hotword', function(index, keyword){
    console.log("! listening", index)
  })

  //sonus.on('partial-result', result => console.log("...", result))

  sonus.on('final-result', function(result){
    if(app.voiceCommands){
      console.log('heard: ', result)
      app.requests.new(result, 'speak')
    }else{
      console.log('ignoring: ', result)
    }
  })

  speak.start()
}

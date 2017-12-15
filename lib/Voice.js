const tokens = require('../auth/tokens')
const exec = require('child_process').exec
const say = require('say')
const Sonus = require('sonus')
const speech = require('@google-cloud/speech')({
  projectId: tokens.google_api_project_id,
  keyFilename: './resources/aurora-google-key.json'
})

//const hotwords = [{ file: './resources/Computer_Mainframe.pmdl', hotword: 'Computer Mainframe'}]
const hotwords = [{ file: './resources/Epsilon.pmdl', hotword: 'Epsilon'}]
const language = "en-UK"
const sonus = Sonus.init({ hotwords, language, recordProgram: "rec" }, speech)

module.exports = function(app){

  const voice = this;


  // speaking

  voice.say = function(message){
    // set the volume to max
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

  voice.toggleState = function(state){
    if(state == 'on'){
      voice.start()
      return 'Voice commands are now active'
    }
    if(state == 'off'){
      voice.stop(sonus)
      return 'Voice commands are no longer active'
    }
    return 'I am not sure what you mean'
  }

  voice.start = function(){
    Sonus.start(sonus)
    app.log('sonus listening for '+hotwords[0].hotword)
  }

  voice.stop = function(){
    Sonus.stop()
    app.log('sonus stopped')
  }

  sonus.on('hotword', function(index, keyword){
    console.log("!")
    say.speak('yes')
  })

  //sonus.on('partial-result', result => console.log("...", result))

  sonus.on('final-result', function(result){
    if(app.voiceCommands){
      console.log('heard: ', result)
      app.requests.new(result, 'voice')
    }else{
      console.log('ignoring: ', result)
    }
  })

  voice.start()
}

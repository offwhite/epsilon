const tokens = require('../auth/tokens')
const exec = require('child_process').exec
const say = require('say')
const Sonus = require('sonus')
const speech = require('@google-cloud/speech')({
  projectId: tokens.google_api_project_id,
  keyFilename: '/bot/resources/aurora-google-key.json'
})

//const hotwords = [{ file: '/bot/resources/pmdl/Computer_Mainframe.pmdl', hotword: 'Computer Mainframe'}]
const hotwords = [{ file: '/bot/resources/pmdl/Hey_Computer.pmdl', hotword: 'Hey Computer', sensitivity: 0.46}]
//const hotwords = [{ file: '/bot/resources/pmdl/alexa.umdl', hotword: 'Alexa'}]
const language = "en-UK"
const sonus = Sonus.init({ hotwords, language, recordProgram: "rec" }, speech)

module.exports = function(app){

  const voice = this;


  // speaking

  voice.say = function(message){
    // set the volume to max
    const cleanMessage = message.replace(/_/g,"").replace(/\*/g,"")
    exec('amixer set PCM -- -00')
    console.log('said: ', cleanMessage)
    say.speak(cleanMessage)
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
    if(app.voiceCommands){
      exec('aplay /bot/resources/sounds/dong.wav')
    }
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

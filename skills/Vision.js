const tokens = require('../auth/tokens')
const NodeWebcam = require( "node-webcam" )
const exec = require('child_process').exec
var fs = require('fs')

module.exports = function(app){

  const skill = this
  skill.app = app
  skill.photoPath = '/bot/images/temp.jpg'
  skill.motionRunning = false
  skill.pollInterval = 2000
  skill.motionDir = '/var/lib/motion/'
  skill.motionImage = {
    lastInDir: false,
    lastKnown: false
  }

  skill.photoOptions = {
      width: 1280,
      height: 720,
      quality: 100,
      delay: 0,
      saveShots: true,
      output: "jpeg",
      device: false,
      callbackReturn: "location",
      verbose: false
  }

  skill.init = function(){
    exec('sudo service motion stop')
    skill.webcam = NodeWebcam.create( skill.options )
    skill.motion = {}
  }

  skill.takePhoto = function(channel){
    if(channel == 'voice'){
      channel = app.telegram.james
    }
    NodeWebcam.capture( "/bot/images/temp", {}, function( err, data ) {
      if ( !err ){
        console.log( "Image created!" )
        app.telegram.sendImage(skill.photoPath, channel)
      }else{
        app.log(err)
      }
    })
    app.log('photo taken')
    return 'Taking Photo'
  }

  skill.setMotionTo = function(state, channel){
    if(state == 'on' || state == 'start'){
      return skill.startMotion()
    }
    if(state == 'off' || state == 'stop'){
      return skill.stopMotion()
    }
    return 'unknown state'
  }

  skill.startMotion = function(){
    exec(
      'sudo service motion start',
      function(err, stdout, stderr){
        if(err){ app.log(err) }
      }
    )
    skill.motionDetected = false
    skill.motionRunning = true
    skill.setLastImage(true)
    skill.scanMotionOutput()
    return skill.isMotionOn()
  }

  skill.stopMotion = function(){
    exec(
      'sudo service motion stop',
      function(err, stdout, stderr){
        if(err){ app.log(err) }
      }
    )
    skill.motionRunning = false
    return skill.isMotionOn()
  }

  skill.isMotionOn = function(){
    if(skill.motionRunning){
      return 'Motion detection is on'
    }
    return 'Motion detection is off'
  }

  skill.scanMotionOutput = function(){
    console.log('scanning images')
    if(skill.motionImage.lastInDir != skill.motionImage.lastKnown){
      skill.motionImage.lastKnown = skill.motionImage.lastInDir

      if(skill.motionDetected = false){
        skill.motionDetected = true
        skill.app.log('Motion detected')
        //skill.app.voice.say('I can see you.')
      }

      console.log('image changed')
      const arr = skill.motionImage.lastInDir.split(' ')
      const path = skill.motionDir + arr[arr.length - 1].replace('\n','')
      skill.app.telegram.sendImage(path, skill.app.telegram.james)
    }
    skill.setLastImage(false)

    // if we're still monitoring, queue another dir scan
    if(skill.motionRunning){
      setTimeout(function(){skill.scanMotionOutput()}, 2000)
    }
  }

  skill.setLastImage = function(starting = false){
    exec('ls -al '+skill.motionDir+' |grep "\.jpg$" | tail -n1', function(err, stdout, stderr){
      skill.motionImage.lastInDir = stdout
      if(starting){
        skill.motionImage.lastKnown = stdout
      }
      //console.log(skill.motionImage)
    })
  }


  skill.init();
}

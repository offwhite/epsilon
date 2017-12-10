const tokens = require('../auth/tokens')
const NodeWebcam = require( "node-webcam" )
// const PiMotion = require('node-pi-motion')

module.exports = function(app){

  const skill = this

  skill.photoPath = '/bot/images/temp.jpg'
  skill.motionRunning = false

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

  skill.motionOptions = {
    verbose: true,
    throttle: 200
  }


  skill.init = function(){
    skill.webcam = NodeWebcam.create( skill.options )
    skill.motion = {} //new PiMotion(skill.motionOptions)
  }

  skill.takePhoto = function(channel){
    if(channel == 'speak'){
      return 'I cannot send a photo over voice. Look around you.'
    }
    NodeWebcam.capture( "/bot/images/temp", {}, function( err, data ) {
      if ( !err ){
        console.log( "Image created!" )
        app.telegram.sendImage(skill.photoPath, channel)
      }
    })
    return 'Taking Photo'
  }

  skill.setMotionTo = function(state){
    if(state == 'on' || state == 'start'){
      return skill.startMotion
    }
    if(state == 'off' || state == 'stop'){
      return skill.stopMotion
    }
    return 'unknown state'
  }

  skill.startMotion = function(){
    skill.motion.on('DetectedMotion', function() {
      console.log('Motion detected! Now do something.')
      skill.motionRunning = true
    })
    return 'Motion detection on'
  }

  skill.stopMotion = function(){
    skill.motionRunning = false
    skill.motion.close()
    return 'Motion detection is off'
  }

  skill.isMotionOn = function(){
    if(skill.motionRunning){
      return 'Motion detection is on'
    }
    return 'Motion detection is off'
  }


  skill.init();
}

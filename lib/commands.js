const Time = require('./Time')
const Reminders = require('./Reminders')
const Jokes = require('./Jokes')
const Vision = require('./Vision')
const MusicBox = require('./MusicBox')

module.exports = function(app){
  const time = new Time()
  const jokes = new Jokes()
  const reminders = new Reminders(app)
  const vision = new Vision(app)
  const musicBox = new MusicBox(app)

  return {
    'hello': function() { return 'Hello there'; },
    'thank you': function() { return 'You are welcome.'; },
    'turn (the)(lights) :state (the)(lights)': function (state) {
      return 'I cannot turn the lights'+ ((state == 'on') ? 'om' : 'off')
    },

    // controllers
    'turn :state voice command(s)': app.toggleVoiceCommands,
    'disable voice command(s)': function(){ return app.toggleVoiceCommands('off')},
    'enable voice command(s)': function(){ return app.toggleVoiceCommands('on')},
    '(are) voice commands enabled': app.voiceCommandState,
    'voice command state': app.voiceCommandState,
    'shutdown': app.terminate,
    'reboot': app.reboot,
    'say *message': app.voice.say,

    // jokes
    'tell (me)(us) (a)(some) joke(s)': jokes.joke,

    // Vision
    '(take)(show me) (a) photo(graph) (of) (the) (house) (home) (lounge)': vision.takePhoto,
    '(take)(show me) (a) picture (of) (the) (house) (home) (lounge)': vision.takePhoto,
    'send me a photo(graph)': vision.takePhoto,
    '(turn) motion :state': vision.setMotionTo,
    '(turn) alarm :state': vision.setMotionTo,
    'is motion (detection) (on)(active)': vision.isMotionOn,
    'is alarm (on)(active)': vision.isMotionOn,

    // music
    'pause (the)(this) (track)(music)': musicBox.pause,
    'stop (the)(this) (track)(music)':  musicBox.stop,
    'play (the) (music)(track)': musicBox.play,
    '(play the) last (track)(song) (again)': musicBox.previous,
    'skip (this) (track)(song)': musicBox.next,
    'next (this) (track)(song)': musicBox.next,
    '(turn) (the) music up': musicBox.volumeUp,
    '(turn) (the) volume up': musicBox.volumeUp,
    '(turn) (the) music down': musicBox.volumeDown,
    '(turn) (the) volume down': musicBox.volumeDown,
    '(make) (the) music quiet': musicBox.volumeQuiet,
    '(make) (the) music loud': musicBox.volumeLoud,
    // predefined playlists
    '(play) happy music': musicBox.playHappy,
    '(play) melancholy music': musicBox.playMelancholy,
    '(play) quiet music': musicBox.playQuiet,
    '(play)(put on) the radio': musicBox.playRadioSixMusic,
    //
    'what (music)(track)(song) is playing(?)': musicBox.getCurrentTrack,
    'what (track)(song) is this(?)': musicBox.getCurrentTrack,
    'play (some)(anything) (by) *music': function(music) { return musicBox.searchAndPlay(music) },

    // time
    '(what)(s) (is) (the) date(?)': time.currentDate,
    '(what)(s)(and) (the) day (is it)(?)': time.currentDate,
    '(what)(s) (is) (the) time(?)': function() {return time.currentTime(false)},
    '(what) time is it(?)': function() {return time.currentTime(false)},
    '(what) is the exact time(?)': function() {return time.currentTime(true)},

    // reminders
    'remind me (to) *request': reminders.setReminder,
    'wake me (up) *request': reminders.setWakeUp,
    'set (a) timer (for) *request': reminders.setTimer,
    'set (a) tea timer': reminders.setTeaTimer,

    'help': function(){
      return `
        enable or disable voice commands
        voice command state
        shutdown
        say *message*
        turn motion or alarm on or off
        is motion or alarm on or active
        send me a photo
        pause, play the music
        put on the radio
        skip or next track or song
        turn the music or volume up or down
        play *artis, album or song*
        remind me to *do something at a time*
      `
    }
  }
}

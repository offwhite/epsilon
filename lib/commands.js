const Time = require('../skills/time');
time = new Time();

module.exports = {
  'hello': function() { return 'Hello there'; },
  'thank you': function() { return 'You are welcome.'; },
  'i like *something': function(something) {  return 'I hate '+something; },
  'turn (the)(lights) :state (the)(lights)': function (state) {
    return 'Turning the lights'+ ((state == 'on') ? 'om' : 'off')
  },

  // jokes
  'tell (me)(us) (a)(some) joke(s)': function() { return 'yo mamma' },

  // photos
  '(take)(show me) (a) photo(graph) (of) (the) (house) (home) (lounge)': function() { return 'Here is your photo' },
  '(take)(show me) (a) picture (of) (the) (house) (home) (lounge)': function() { return 'Here is your photo' },
  'show me (whats happening at) (a) (picture) (of) (the) (house) (home) (lounge)': function() { return 'Here is your photo...' },

  // music
  'pause (the)(this) (track)(music)': function(music) { return 'pause/stop music' },
  'stop (the)(this) (track)(music)': function(music) { return 'pause/stop music' },
  'play (music)(track)': function(music) { return 'play/resume music' },
  '(play the) last (track)(song) (again)': function(music) { return 'previous track' },
  'skip (this) (track)(song)': function(music) { return 'next track' },
  '(play) (the) next (track)(song)': function(music) { return 'next track' },
  'play *music': function(music) { return 'looking for '+music },

  // time
  '(what)(s) (is) (the) date(?)': time.currentDate,
  '(what)(s)(and) (the) day (is it)(?)': time.currentDate,
  '(what)(s) (is) (the) time(?)': time.currentTime,
  '(what) time is it(?)': time.currentTime,
  '(what) is the exact time(?)': function() {return time.currentTime(true)}
};

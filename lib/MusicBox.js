const exec = require('child_process').exec

module.exports = function(app){

  const skill = this

  skill.init = function(){
  };

  skill.getCurrentTrack = function(channel){
    skill.execute(
      'playback.get_current_track', null,
      function(result){
        const artist = result.artists[0].name
        const album = result.album.name
        const albumDate = result.album.date
        const track = result.name
        const str = '_This song is_ *' + track + '* _by_ *' + artist + '* _from the_ *'+albumDate+'* _album_ *' + album + '*'
        app.postMessage(str, channel)
      }
    )
  }

  // set a playlist

  skill.playPlaylist = function(uri){
    skill.execute('tracklist.clear', null, function(result){
      skill.execute('tracklist.add', '{"uri": "'+uri+'"}',
      function(result){
        skill.play()
      })
    })
  }

  skill.playRadioSixMusic = function(){
    skill.playPlaylist('tunein:station:s44491')
    return 'tuning to six music'
  }

  skill.playHappy = function(){
    skill.playPlaylist('spotify:user:james.offwhite:playlist:6wmRJtytwxyqgRiFcJIpbG')
  }

  skill.playMelancholy = function(){
    skill.playPlaylist('spotify:user:james.offwhite:playlist:5RybNnipuMTwyp2ioPyivB')
  }

  skill.playQuiet = function(){
    skill.playPlaylist('spotify:user:james.offwhite:playlist:3thQ7lLVsfJOP90oQOFAUa')
  }

  // search and play

  skill.searchAndPlay = function(query){
    const params = '{"any": "'+query+'", "uris": ["spotify:"]}'
    skill.execute('library.search', params, function(response){
      const tracks = response[0].tracks
      if(typeof(tracks) == 'undefined'){
        app.voice.say('tracks not found')
        app.log('tracks not found')
        return
      }

      var tracksArr = []
      const limit = tracks.length < 15 ? tracks.length : 15

      for( let i=0; i<limit; i++){
        tracksArr.push(tracks[i].uri)
      }

      skill.playTracks(tracksArr)
    })
    return 'looking'
  }

  skill.playTracks = function(tracks){
    const tracksStr = JSON.stringify(tracks)
    const params = '{"uris": '+tracksStr+'}'
    skill.execute('tracklist.clear', null, function(result){
      skill.execute('tracklist.add', params,
      function(result){
        skill.play()
      })
    })
  }

  // playback control

  skill.pause = function(){
    skill.execute('playback.pause')
  }

  skill.play = function(){
    skill.execute('playback.play')
  }

  skill.previous = function(){
    skill.execute('playback.previous')
  }

  skill.next = function(){
    skill.execute('playback.next')
  }

  // volume control

  skill.volumeUp = function(){
    skill.execute('mixer.get_volume', null, function(response){
      skill.setVolume(response + 20)
    })
  }

  skill.volumeDown = function(){
    skill.execute('mixer.get_volume', null, function(response){
      skill.setVolume(response - 20)
    })
  }

  skill.volumeQuiet = function(){
    skill.setVolume(10)
  }

  skill.volumeLoud = function(){
    skill.setVolume(90)
  }

  skill.getVolume = function(){
    skill.execute('mixer.get_volume')
  }

  skill.setVolume = function(volume){
    skill.execute('mixer.set_volume', '{"volume": '+volume+'}')
  }

  skill.execute = function(command, params, callback){
    const params_str = params != undefined ? ', "params": '+params : ''
    exec('curl -d  \'{"jsonrpc": "2.0", "id": 1, "method": "core.'+command+'"'+params_str+'}\' http://musicbox:6680/mopidy/rpc',
    function(err, stdout, stderr){
      if(err != null){
        app.log(err)
        return
      }
      if(typeof callback == 'function'){
        callback(JSON.parse(stdout).result)
      }
    })
  }


  skill.init();
}

const tokens = require('../auth/tokens')
const exec = require('child_process').exec;
var fs = require('fs');

module.exports = function(app){

  const skill = this
  skill.app = app
  skill.ready = false
  skill.pollInterval = 10000;
  skill.networkRange = /(192.168.1.*)/
  skill.file_path = "/bot/resources/known_network_addresses";
  skill.known = {
    addresses: [],
    lastLogin: '',
    lastLoginAttempt: ''
  }

  skill.init = function(){
    fs.readFile(skill.file_path, 'utf8', function(err,data){
      if(!err)
        {
          skill.known.addresses = data.split('\n')
          skill.ready = true
        }
    });

    setInterval(function(){
      skill.scanNetwork()
      //skill.scanLoginAttempts()
    }, skill.pollInterval)
  };

  this.scanNetwork = function(){
    if(!skill.ready){
      return;
    }
    exec('sudo arp-scan -l', skill.processScanResults)
  };

  skill.processScanResults = function(err, stdout, stderr){
    if (err !== null) {
      console.log('exec error: ' + err)
      return
    }
    var data = stdout.split( "\n" )
    var dataChanged = false

    for(i in data){
      if(data[ i ].match( skill.networkRange )){
        var row = data[i]
        var ipAddress = row.split('\t')[0]
        var macAddress = row.split('\t')[1]

        if(!skill.includes(skill.known.addresses, macAddress)){
          console.log('NEW ADDRESS! :: ' + macAddress);
          skill.app.log('Someone has joined the network: '+ row)
          skill.known.addresses[skill.known.addresses.length] = macAddress
          var dataChanged = true
        }
      }
    }
    if(dataChanged){
      skill.saveAddresses()
    }
  }

  skill.scanLoginAttempts = function(){
    if(!skill.ready){
      console.log('monitor not ready')
      return;
    }
    console.log('scanning logins')
    exec("cat /var/log/auth.log | tr -d '\000' | grep 'Failed password' | tail -n1", skill.processLoginAttempts)
  }

  skill.processLoginAttempts = function(err, stdout, stderr){
    if (err !== null) {
      console.log('exec error: ' + err)
      return
    }

    if(skill.known.lastLoginAttempt != stdout){
      skill.known.lastLoginAttempt = stdout;
      skill.app.log('Someone has attempted to log into my systems: '+ stdout)
    }
  }


  // === HELPERS ===

  skill.saveAddresses = function(){
    var string = skill.known.addresses.join('\n');
    fs.writeFile(skill.file_path, string, function(err) {
      if(err) {
          return console.log(err);
      }else{
        console.log('addresses saved');
      }
    });
  };

  skill.includes = function(array, needle){
    for( var i = 0; i < array.length; ++i ) {
      if(array[i] == needle){ return true }
    }
    return false
  };


  skill.init();
}

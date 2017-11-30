const tokens = require('../auth/tokens');
const say = require('say');
const Sonus = require('sonus')
const speech = require('@google-cloud/speech')({
  projectId: tokens.google_api_project_id,
  keyFilename: './resources/aurora-google-key.json'
});
const hotwords = [{ file: './resources/Aurora.pmdl', hotword: 'Aurora' }]
const sonus = Sonus.init({ hotwords }, speech);

module.exports = function(app){

  const speak = this;

  // speaking

  speak.say = function(message){
    say.speak(message, 'Samantha', 1, (err) => {
      if (err) {
        return console.error(err)
      }
      console.log('spoken: ', message);
    });
  }

  // listening

  Sonus.start(sonus);
  sonus.on('hotword', function(index, keyword){
    console.log("!", index, keyword);
  });

  sonus.on('final-result', function(result){
    console.log(result)
    app.requests.new(speak.say, result, null);
  });
}

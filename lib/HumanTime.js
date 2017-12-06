const moment = require('moment');
const humanInterval = require('human-interval');

const words = [
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  'twenty one', 'twenty two', 'twenty three', 'twenty four', 'twenty five', 'twenty six', 'twenty seven', 'twenty eight', 'twenty nine', 'thirty',
  'thirty one','thirty two','thirty three','thirty four','thirty five','thirty six','thirty seven','thirty eight','thirty nine','fourty',
  'fourty one','fourty two','fourty three','fourty four','fourty five','fourty six','fourty seven','fourty eight','fourty nine','fifty',
  'fifty one','fifty two','fifty three','fifty four','fifty five','fifty six','fifty seven','fifty eight','fifty nine','sixty'
]

for( let i=0; i<words.length; i++){
  console.log('adding '+words[i] + ' = '+(i+11))
  humanInterval.languageMap[words[i]] = (i+11);
}

module.exports = function timeFromString(string){
  const interval = humanInterval(string);
  if(interval !== NaN){
    return moment().add(interval, 'milliseconds')
  }
}

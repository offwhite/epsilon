const moment = require('moment');

module.exports = function(app){

  const skill = this;

  skill.currentDate = function(){
    return moment().format("dddd MMM Do YYYY");
  }

  skill.currentTime = function(exact){
    const date = moment();
    return "It's " + skill.timeToString(exact, date);
  }

  skill.timeToString = function(exact, time){

    if(exact){
      return time.format('hh:mm:ss')
    }

    const hour = parseInt(time.format('hh'));
    const minute = parseInt(time.format('m'));

    // return cardinals

    switch(minute) {
      case 0:
          return skill.hourTo12(hour) + " o'clock";
          break;
      case 15:
          return 'quarter passed ' + skill.hourTo12(hour);
          break;
      case 30:
          return 'half passed ' + skill.hourTo12(hour);
          break;
      case 45:
          return ' quarter to ' + skill.hourTo12(hour + 1);
          break;
    }

    // 10/15/20 minutes to... or 8 minutes to...
    if((minute > 30 && minute%5 == 0) || minute > 50){
      return (60 - minute) + skill.minuteWord(minute) + ' to ' + skill.hourTo12(hour+1);

    // a few minutes passed
    }else if(minute < 15){
      return minute + skill.minuteWord(minute) + ' passed ' + skill.hourTo12(hour);
    }

    // standard time
    return skill.hourTo12(hour) + ':' + minute;
  };

  // Helpers

  skill.minuteWord = function(minute){
    return minute == 1 ? ' minute' : ' minutes'
  }

  skill.hourTo12 = function(hour){
    return (hour < 13) ? hour : (hour - 12);
  }
}

const moment = require('moment');

module.exports = function(app){

  const skill = this;

  skill.currentDate = function(){
    return moment().format("dddd MMM Do YYYY");
  }

  skill.currentTime = function(exact = false){
    const date = new Date();
    const timeString = date.toTimeString().split(' ')[0];

    if(exact){
      return timeString;
    }

    const time = timeString.split(':');
    const hour = parseInt(time[0]);
    const minute = parseInt(time[1]);

    const prefix = 'The time is ';
    const short_prefix = "It's ";

    // return cardinals

    switch(minute) {
      case 0:
          return short_prefix + skill.hourTo12(hour) + " o'clock";
          break;
      case 15:
          return short_prefix + 'quarter passed ' + skill.hourTo12(hour);
          break;
      case 30:
          return short_prefix + 'half passed ' + skill.hourTo12(hour);
          break;
      case 45:
          return short_prefix + ' quarter to ' + skill.hourTo12(hour + 1);
          break;
    }

    // 10/15/20 minutes to... or 8 minutes to...
    if((minute > 30 && minute%5 == 0) || minute > 50){
      return prefix + (60 - minute) + skill.minuteWord(minute) + ' to ' + skill.hourTo12(hour+1);

    // a few minutes passed
    }else if(minute < 15){
      return prefix + minute + skill.minuteWord(minute) + ' passed ' + skill.hourTo12(hour);
    }

    // standard time
    return prefix + skill.hourTo12(hour) + ':' + minute;
  };

  // Helpers

  skill.minuteWord = function(minute){
    return minute == 1 ? ' minute' : ' minutes'
  }

  skill.hourTo12 = function(hour){
    return (hour < 13) ? hour : (hour - 12);
  }
}

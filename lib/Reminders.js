const Chrono = require('chrono-node')
const Time = require('./Time')
const moment = require('moment');

module.exports = function(app){
  const timeConverter = new Time();

  const skill = this;
  skill.app = app;

  skill.setReminder = function(request, channel){
    console.log('channel: ', channel)
    if(request == ''){
      skill.setContext(channel, '*', skill.setReminderTime, {action: ''})
      return 'Okay, when would you like reminding?'
    }

    let action = request
    let time = false

    var timeResults = Chrono.parse(request)

    // time is present
    if(timeResults.length > 0){
      action = request.replace(timeResults[0].text, '')
      time = timeResults[0].start.date()
    }

    // we have both
    if(time && action != ''){
      return skill.saveReminder(channel, action, timeResults[0].start.date())
    }

    // we have only time
    if(time){
      skill.setContext(channel, '*', skill.setReminderAction, {time: time})
      const timeString = timeConverter.timeToString(false, moment(time))
      return "Okay, "+timeString+". What would you like reminding?"
    }

    // we have only action
    if(action != ''){
      skill.setContext(channel, '*', skill.setReminderTime, {action: action})
      return "Okay, "+action+". When would you like reminding?"
    }

    return 'i dont recognise that command';
  }


  skill.setReminderTime = function(request, channel, params){
    var time = Chrono.parseDate(request)
    if(time == null){
      return "I don't recognise that as a time. Try 'Tonight at ten', or 'in fifteen minutes'"
    }

    // action is in params - save
    if(params.action != ''){
      skill.clearContext(channel)
      return skill.saveReminder(channel, params.action, time)
    }

    // no action present - set context
    skill.setContext(channel, '*', skill.setReminderAction, {time: time})
    // post a response
    const timeString = timeConverter.timeToString(false, moment(time))
    return "Okay, "+timeString+". What would you like reminding?"
  }

  skill.setReminderAction = function(request, channel, params){
    return skill.saveReminder(channel, request, params.time)
  }

  skill.setWakeUp = function(request, channel){
    return skill.setReminder('wake up '+request, channel)
  }

  skill.setTimer = function(request, channel){
    return skill.setReminder('The timer is up in '+request, channel)
  }

  skill.setTeaTimer = function(channel){
    return skill.setReminder('The tea is brewed in 4 minutes', channel)
  }

  // Helpers

  skill.saveReminder = function(channel, action, time){

    skill.clearContext(channel)

    const momentTime = moment(time)
    // get number of seconds till event
    const timeTill = momentTime.diff(moment(), 'milliseconds')
    const isToday = momentTime.format('DMM') == moment().format('DMM')

    // set the reminder
    setTimeout(function(){
      skill.runReminder(action, channel)
    }, timeTill);

    // post a reply
    let timeString
    if(isToday){
      timeString = timeConverter.timeToString(false, momentTime)
    }else{
      timeString = timeConverter.timeToString(false, momentTime) + " On " + momentTime.format('Do MMM')
    }

    return "Okay, '"+action+"' at " +timeString
  }

  skill.runReminder = function(message, channel){
    skill.app.postMessage('Bingly Bingly Beep: '+message, channel)
    console.log('posting reminder', message, channel)
  }


  skill.clearContext = function(channel){
    delete skill.app.contexts[channel]
  }

  skill.setContext = function(channel, matches, method, parameters){
    skill.app.contexts[channel] = {
      channel: channel,
      matches: '*',
      time: new Date(),
      method: method,
      parameters: parameters
    }
  }
}

const Chrono = require('chrono-node')
const Time = require('../skills/Time')
const moment = require('moment');

module.exports = function(app){
  const timeConverter = new Time();

  const skill = this;
  skill.app = app;

  skill.setReminder = function(request, channel){
    if(request == ''){
      skill.setContext(channel, '*', skill.setReminderTime, {action: ''})
      return 'Okay, when would you like reminding?'
    }

    // reminder is empty - get time
    // there is action but not time - get time, pass action
    // there is time but not action - get action, pass time
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
      return skill.saveReminder(action, timeResults[0].start.date())
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
      return "I don't recognise that as a time. Try 'Tonigh at ten', or 'in fifteen minutes'"
    }

    // action is in params - save
    if(params.action != ''){
      skill.clearContext(channel)
      return skill.saveReminder(params.action, time)
    }

    // no action present - set context
    skill.setContext(channel, '*', skill.setReminderAction, {time: time})
    const timeString = timeConverter.timeToString(false, moment(time))
    return "Okay, "+timeString+". What would you like reminding?"
  }

  skill.setReminderAction = function(request, channel, params){
    skill.clearContext(channel)
    return skill.saveReminder(request, params.time)
  }

  // Helpers

  skill.saveReminder = function(action, time){
    console.log('SET THE REMINDER HERE: ')
    console.log('action: ', action)
    console.log('time: ', time)
    // check if it's today,
    const momentTime = moment(time)
    const timeString = timeConverter.timeToString(false, momentTime)

    if(momentTime.format('DMM') == moment().format('DMM')){
      const timeString = timeConverter.timeToString(false, momentTime)
    }else{
      const timeString = timeConverter.timeToString(false, momentTime) + " On " + momentTime.format('Do MMM')
    }

    // check if it's this week
    return "Okay, I'll remind you, '"+action+"' at " +timeString
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

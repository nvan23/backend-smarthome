var moment = require('moment')
moment().format()

const DATE_FORMAT = 'YYYY-MM-DD'

exports.lt10Minutes = time => {
  return !time ? false : new Date(new Date().getTime() - new Date(time).getTime()).getMinutes() < 10
}

exports.isValidDate = date => {
  return moment(date, DATE_FORMAT, true).isValid()
}

exports.getValidDate = date => {
  return new Date(date).toISOString().slice(0,10) 
}

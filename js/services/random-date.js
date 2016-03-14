var moment = require('moment')
var rand = require('lodash.random')

var randomDate = function (args) {
  var date = new Date(rand(args.start.getTime(), args.end.getTime()))
  return args.format ? moment(date).format(args.format) : date
}

module.exports = randomDate

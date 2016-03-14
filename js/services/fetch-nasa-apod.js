var randomDate = require('./random-date')
var $ = require('jquery')
var queryString = require('query-string')

var fetchNasaApod = function (apiKey) {
  return function (callback) {
    var date = randomDate({ start: new Date(2012, 0, 1), end: new Date(), format: 'YYYY-MM-DD' })
    var queryParams = queryString.stringify({ date: date, api_key: apiKey })
    var url = 'https://api.nasa.gov/planetary/apod?' + queryParams
    $.get(url, callback)
  }
}

module.exports = fetchNasaApod

var sketchpad = require('./sketchpad')
var $ = require('jquery')
var randomDate = require('./../services/random-date')
var apod = require('nasa-apod').Client({
  apiKey: process.env.NASA_API_KEY
})

var hud = {
  sketchpad: sketchpad,

  init: function(env) {
    this.sketchpad.init(env)
    this.setBackgroundImage()
  },

  setBackgroundImage: function () {
    var date = randomDate(new Date(2012, 0, 1),new Date())
    apod(date).then(function(data) {
      $('body').css({
        'background-image': 'url(' + data.hdurl + ')',
        'background-position': 'center',
        'background-size': 'cover',
        'background-repeat': 'no-repeat'
      })
    })
  }
}


module.exports = hud

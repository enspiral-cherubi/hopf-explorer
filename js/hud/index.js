var buttons = require('./buttons')
var sketchpad = require('./sketchpad')
var $ = require('jquery')
var fetchNasaApod = require('./../services/fetch-nasa-apod')(process.env.NASA_API_KEY)

var hud = {
  buttons: buttons,
  sketchpad: sketchpad,
  init: function(env) {
    this.buttons.init(env)
    this.sketchpad.init()
    setBackgroundImage()
  }
}

var setBackgroundImage = function () {
  fetchNasaApod(function (res) {
    $('body').css('background-image', 'url(' + res.hdurl + ')')
  })
}

module.exports = hud

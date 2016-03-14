var buttons = require('./buttons')
var sketchpad = require('./sketchpad')
var $ = require('jquery')
var randomDate = require('./../services/random-date')
var apod = require('nasa-apod')

var hud = {
  buttons: buttons,
  sketchpad: sketchpad,
  init: function(env) {
    this.buttons.init(env)
    this.sketchpad.init()
    var date = randomDate(new Date(2012, 0, 1),new Date())
    console.log(date)
    apod(date).then(function(data) {
        $('#body').css("background-image","url("+data.hdurl+")")
        $('#body').css("background-position","center")
        $('#body').css("background-size","cover")
        $('#body').css("background-repeat","no-repeat")
    })
  }
}
module.exports = hud

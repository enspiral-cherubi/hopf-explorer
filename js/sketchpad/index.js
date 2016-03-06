var $ = require('jquery')
var range = require('lodash.range')

var sketchpad = {
  $sketchpad: $('#sketchpad'),
  context: $('#sketchpad')[0].getContext('2d'),
  paint: false,
  clickX: [],
  clickY: [],

  init: function () {
    this.context.fillStyle = '#FFFFFF'
    this.bindEventListeners()
  },

  bindEventListeners: function () {
    var self = this

    this.$sketchpad.mousedown(function (e) {
      self.paint = true
      self.drawPoint(e.offsetX, e.offsetY)
    })

    this.$sketchpad.mouseup(function (e) { self.paint = false })

    this.$sketchpad.mouseleave(function(e){ self.paint = false })

    this.$sketchpad.mousemove(function (e) {
      if (self.paint) { self.drawPoint(e.offsetX, e.offsetY) }
    })
  },

  drawPoint: function (x,y) {
    this.context.fillRect(x,y,5,5)
  }

}

module.exports = sketchpad

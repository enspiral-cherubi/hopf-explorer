var $ = require('jquery')
var mag = require('vectors/mag')(2)

var sketchpad = {
  $sketchpad: $('#sketchpad'),
  context: $('#sketchpad')[0].getContext('2d'),
  paint: false,
  sphericalCoordsArray: [],

  init: function () {
    this.context.fillStyle = '#FFFFFF'
    this.bindEventListeners()
  },

  addSphericalCoords: function (x,y) {
    x = x - this.$sketchpad.width() / 2
    y = y - this.$sketchpad.height() / 2
    this.sphericalCoordsArray.push({
      eta: Math.atan(1/mag([x,y])),
      phi: Math.atan(y/x)
    })
  },

  bindEventListeners: function () {
    var self = this

    this.$sketchpad.mousedown(function (e) {
      self.paint = true
      self.addSphericalCoords(e.offsetX, e.offsetY)
      self.drawPoint(e.offsetX, e.offsetY)
    })

    this.$sketchpad.mousemove(function (e) {
      if (self.paint) {
        self.addSphericalCoords(e.offsetX, e.offsetY)
        self.drawPoint(e.offsetX, e.offsetY)
      }
    })

    this.$sketchpad.mouseup(function (e) { self.paint = false })
    this.$sketchpad.mouseleave(function(e){ self.paint = false })
  },

  drawPoint: function (x,y) {
    this.context.fillRect(x,y,5,5)
  }

}

module.exports = sketchpad

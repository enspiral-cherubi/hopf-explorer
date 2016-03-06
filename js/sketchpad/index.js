var $ = require('jquery')
var range = require('lodash.range')

module.exports = {
  $sketchpad: $('#sketchpad'),
  context: $('#sketchpad')[0].getContext('2d'),
  paint: false,
  clickX: [],
  clickY: [],
  clickDrag: [],

  addClick: function (x, y, dragging) {
    this.clickX.push(x)
    this.clickY.push(y)
    this.clickDrag.push(dragging)
  },

  bindEventListeners: function () {
    var self = this

    this.$sketchpad.mousedown(function (e) {
      self.paint = true
      self.addClick(e.offsetX, e.offsetY);
      self.redraw()
    })

    this.$sketchpad.mouseup(function (e) {
      self.paint = false
    })

    this.$sketchpad.mouseleave(function(e){
      self.paint = false
    })

    this.$sketchpad.mousemove(function (e) {
      if (self.paint) {
        self.addClick(e.offsetX, e.offsetY, true)
        self.redraw()
      }
    })
  },

  redraw: function () {
    var self = this

    this.clear()

    this.context.strokeStyle = "#000000"
    this.context.lineJoin = "round"
    this.context.lineWidth = 1

    range(this.clickX.length).forEach(function (i) {
      self.context.beginPath()
      if (self.clickDrag[i] && i) {
        self.context.moveTo(self.clickX[i-1], self.clickY[i-1])
      } else {
        self.context.moveTo(self.clickX[i]-1, self.clickY[i])
      }
      self.context.lineTo(self.clickX[i], self.clickY[i])
      self.context.closePath()
      self.context.stroke()
    })
  },

  clear: function () {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
  }
}

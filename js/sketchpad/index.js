var $ = require('jquery')
var range = require('lodash.range')

var $sketchpad = $('#sketchpad')
var context = $sketchpad[0].getContext('2d')
var paint = false
var clickX = [], clickY = [], clickDrag = []

function addClick(x, y, dragging) {
  clickX.push(x)
  clickY.push(y)
  clickDrag.push(dragging)
}

$sketchpad.mousedown(function (e) {
  paint = true
  addClick(e.offsetX, e.offsetY);
  redraw()
})

$sketchpad.mouseup(function (e) { paint = false })
$sketchpad.mouseleave(function(e){ paint = false })

$sketchpad.mousemove(function (e) {
  if (paint) {
    addClick(e.offsetX, e.offsetY, true)
    redraw()
  }
})

function redraw () {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.strokeStyle = "#000000"
  context.lineJoin = "round"
  context.lineWidth = 1

  range(clickX.length).forEach(function (i) {
    context.beginPath()
    if (clickDrag[i] && i) {
      context.moveTo(clickX[i-1], clickY[i-1])
    } else {
      context.moveTo(clickX[i]-1, clickY[i])
    }
    context.lineTo(clickX[i], clickY[i])
    context.closePath()
    context.stroke()
  })
}

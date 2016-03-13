var THREE = require('three')
var mag = require('vectors/mag')(3)

var getFlow = function (x,y,z,dt) {
  //the variable names correspond to those in generate-fiber.js
  var r = Math.sqrt(x*x+y*y+z*z)
  var x4 = (1-r)/(1+r)
  var m = Math.sqrt(1-x4*x4)
  var drdt = -Math.pow(1+x4,-2)/r
  var dminvdt = 1/(r*(1-x4*x4))*(-x+y+r*x4)
  return new THREE.Vector3(
    dt*((x/r)*drdt + (x*m)*dminvdt + y),
    dt*((y/r)*drdt + (y*m)*dminvdt - x),
    dt*((z/r)*drdt + (z*m)*dminvdt + r*x4/m)
  )
}

module.exports = getFlow

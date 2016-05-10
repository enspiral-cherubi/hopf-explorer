var Color = require("color")

var hexStringFromSphericalCoords = function (sphericalCoords) {
  var hue = parseInt(2*sphericalCoords.phi * 360 / (2 * Math.PI) + 180)
  var saturation = parseInt(Math.tanh(sphericalCoords.eta / Math.PI) * 100)
  var hsv = Color().hsv(hue, saturation, 100)
  return hsv.hexString()
}

module.exports = hexStringFromSphericalCoords

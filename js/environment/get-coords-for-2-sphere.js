var rand = require('lodash.random')
var range = require('lodash.range')

var getCoordsFor2Sphere = function (num) {
  return range(num).map(function (i) {
    return {
      eta: rand(0, Math.PI, true),
      phi: rand(0, Math.PI * 2, true)
    }
  })
}

module.exports = getCoordsFor2Sphere

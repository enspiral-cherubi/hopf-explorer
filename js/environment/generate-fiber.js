var THREE = require('three')

var generateFiber = function (coords) {
  var fiber = new THREE.Curve()

  fiber.getPoint = function (t) {
    var eta = coords.eta
    var phi = coords.phi
    var theta = 2*Math.PI*t
    //get point on unit 3-sphere in 4D space with Cartesian coordinates
    var x1 = Math.cos(phi+theta)*Math.sin(eta/2)
    var x2 = Math.sin(phi+theta)*Math.sin(eta/2)
    var x3 = Math.cos(phi-theta)*Math.cos(eta/2)
    var x4 = Math.sin(phi-theta)*Math.cos(eta/2)
    //stereographically project point on 3-sphere to point in 3D space in spherical coordinates
    var r = Math.sqrt((1-x4)/(1+x4))
    var latt = Math.acos(x3/Math.sqrt(Math.pow(x1,2)+Math.pow(x2,2)+Math.pow(x3,2)))
    var long = Math.acos(x2/Math.sqrt(Math.pow(x1,2)+Math.pow(x2,2)))
    //return point in 3D space in Cartesian coordinates
    return new THREE.Vector3(r*Math.sin(latt)*Math.cos(long),r*Math.sin(latt)*Math.sin(long),r*Math.cos(latt))
  }

  // returns 'fiber' geometry corresponding to the point on the 2-sphere with spherical coordinates phi, eta
  var tubeGeometry = new THREE.TubeGeometry(
    fiber,  //path
    64,    //segments
    0.1,     //radius
    8,     //radiusSegments
    false  //closed
  )
  // TODO: make color xyz to rgb
  var material = new THREE.LineBasicMaterial({color: 0x000000})
  return new THREE.Mesh(tubeGeometry, material)
}

module.exports = generateFiber

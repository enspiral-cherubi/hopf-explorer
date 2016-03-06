var THREE = require('three')

var norm2 = function(x,y) {
  return Math.sqrt(Math.pow(x,2)+Math.pow(y,2))
}

var norm3 = function(x,y,z){
  return norm2(norm2(x,y),z)
}

var generateFiber = function (coords) {
  var fiber = new THREE.Curve()

  fiber.getPoint = function (t) {
    var eta = coords.eta
    var phi = coords.phi
    var theta = 2 * Math.PI * t

    //get point on unit 3-sphere in 4D space with Cartesian coordinates
    var x1 = Math.cos(phi+theta) * Math.sin(eta/2)
    var x2 = Math.sin(phi+theta) * Math.sin(eta/2)
    var x3 = Math.cos(phi-theta) * Math.cos(eta/2)
    var x4 = Math.sin(phi-theta) * Math.cos(eta/2)

    //stereographically project point on 3-sphere to point in 3D space in Cartesian coordinates
    var n2 = norm2(x1,x2)
    var n3 = norm3(x1,x2,x3)

    var r = Math.sqrt((1-x4)/(1+x4))

    //return point in 3D space in Cartesian coordinates
    // return new THREE.Vector3(x,y,z)
    return new THREE.Vector3(
      r * n2 / n3 * x2/n2,
      r * n2 / n3 * x1/n2,
      r * x3/n3
    )
  }

  // returns 'fiber' geometry corresponding to the point on the 2-sphere with spherical coordinates phi, eta
  var tubeGeometry = new THREE.TubeGeometry(
    fiber,  //path
    64,    //segments
    0.01,     //radius
    8,     //radiusSegments
    false  //closed
  )
  // TODO: make color xyz to rgb
  var material = new THREE.LineBasicMaterial({color: 0x000000})
  return new THREE.Mesh(tubeGeometry, material)
}

module.exports = generateFiber

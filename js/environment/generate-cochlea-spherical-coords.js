var generateCochleaSphericalCoords = function (fourierData,numIntervals,t,numCirclesPerInterval){
  //t should be slowly varying, fourierData computed with numIntevals,
  //numCirclesPerInterval is a independent parameter
  var bigAngleInterval = Math.PI/numIntervals
  var smallAngleInterval = bigAngleInterval/numCirclesPerInterval
  var sphericalCoords = []
  for (j=0; j<numIntervals; j++){
    for (k=0; k<numCirclesPerInterval; k++){
      var eta = bigAngleInterval*j + smallAngleInterval*k
      var phi = Math.asin(Math.tanh(eta+t)*Math.tan(fourierData[j]*2*Math.PI/255))
      sphericalCoords.push({eta:eta, phi:phi})
    }
  }
  return sphericalCoords
}

module.exports = generateCochleaSphericalCoords

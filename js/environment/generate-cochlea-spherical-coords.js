var generateCochleaSphericalCoords = function (fourierData,numIntervals,eta0,numCirclesPerInterval){
  //eta0 should be slowly varying, fourierData computed with numIntevals,
  //numCirclesPerInterval is a independent parameter
  //the following line is a nice button
  var smallBass = true //nice button
  if (smallBass){
    fourierData.reverse()
  }
  var bigAngleInterval = Math.PI/numIntervals
  var smallAngleInterval = bigAngleInterval/numCirclesPerInterval
  var sphericalCoords = []
  for (j=0; j<numIntervals; j++){
    for (k=0; k<numCirclesPerInterval; k++){
      //eta is evenly distributed amongst the circles in the cochlea
      var eta = bigAngleInterval*j + smallAngleInterval*k
      //phi(eta) = asin(tanh((eta+eta0)*cot(beta)))
      //where beta is the angle the loxodrome makes with the meridian at eta+eta0
      //beta is some function of the fourier amplitudes ranging from -PI to PI
      var beta = fourierData[j]*2*Math.PI/255-Math.PI
      var depth = 2 //wraps of cochlea
      var phi = depth*Math.asin(Math.tanh((eta+eta0)/Math.tan(beta-2)))
      sphericalCoords.push({eta:eta, phi:phi})
    }
  }
  return sphericalCoords
}

module.exports = generateCochleaSphericalCoords

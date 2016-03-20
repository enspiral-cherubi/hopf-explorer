var environment = require('./environment')
var _ = require('./underscore')

var $ = require('jquery')
var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

var webAudioAnalyser2 = require('web-audio-analyser-2')
var analyser = webAudioAnalyser2({
      context: audioCtx,
        fftSize: 2048,
          equalTemperedFreqBinCount: 10
})
 
analyser.connect(audioCtx.destination)
 
var micSelector = require('mic-selector')(audioCtx)
 
var $micSelector = $(micSelector)
 
$micSelector.on('bang', function (e, node) {
      node.connect(analyser)
})

$('body').append($micSelector)
var interval = setInterval(function () {
var barkScaleFrequencyData = analyser.barkScaleFrequencyData()
barkScaleFrequencyData = _.map(barkScaleFrequencyData, function (e) -

console.log('barkScaleFrequencyData.frequencies: ', barkScaleFrequencyData.frequencies)
//console.log('barkScaleFrequencyData.overallAmplitude: ', barkScaleFrequencyData.overallAmplitude)
}, 50)

environment.init()
environment.startAnimation()

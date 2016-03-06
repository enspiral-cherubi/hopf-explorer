var environment = require('./environment')
var sketchpad = require('./sketchpad')

sketchpad.init()

environment.init()
environment.startAnimation()
environment.generateImage()

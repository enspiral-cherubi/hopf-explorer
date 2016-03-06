var environment = require('./environment')
var sketchpad = require('./sketchpad')

sketchpad.bindEventListeners()

environment.init()
environment.startAnimation()
environment.generateImage()

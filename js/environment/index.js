var THREE = require('three')
var flyControls = require('./three-fly-controls-custom')(THREE)
var OrbitControls = require('three-orbit-controls')(THREE)
var generateFiberGeometry = require('./generate-fiber')
var generateParticle = require('./generate-particle')
var hud = require('./../hud')
var getFlow = require('./flow')
var WindowResize = require('three-window-resize')
var $ = require('jquery')
var webAudioAnalyser2 = require('web-audio-analyser-2')
var generateCochleaSphericalCoords = require('./generate-cochlea-spherical-coords')

module.exports = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000),
  renderer: new THREE.WebGLRenderer({alpha: true, canvas: document.getElementById('environment')}),
  fibers: [],
  particles: [],
  sketchMode: "fiber",
  controlsMode: "orbit",
  hud: hud,
  init: function () {
    this.initRenderer()
    this.addAxes()
    this.initControls()
    WindowResize(this.renderer, this.camera)
    this.hud.init(this)
    this.setupAudio()
  },

  startAnimation: function () {
    var self = this
    var lastTimeMsec = null

    var barkScaleFrequencyData = self.analyser.barkScaleFrequencyData()
    var cochleaSphericalCoords = generateCochleaSphericalCoords(barkScaleFrequencyData.frequencies, 24, 0, 5)
    self.fibers = cochleaSphericalCoords.map(generateFiber)
    self.fibers.map(function (fiber) {
      self.scene.add(fiber)
    })
 
     requestAnimationFrame( function render (nowMsec) {
      requestAnimationFrame(render)
      self.renderer.render(self.scene, self.camera)
      var coordsArray = self.hud.sketchpad.extractNewSphericalCoords()
      if (self.sketchMode === "fiber"){
        var newFibers = coordsArray.map(generateFiberGeometry)
        self.fibers.push(newFibers)
        newFibers.forEach(function (fiberGeometry) { self.scene.add(fiberGeometry.mesh) })
      }
      if (self.sketchMode === "particle"){
        var newparticles = coordsArray.map(generateParticle)
        newparticles.forEach(function (particle) {self.scene.add(particle)})
        self.particles = self.particles.concat(newparticles)
      }
      lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
      lastTimeMsec  = nowMsec
      //particles traverse the circle every 2pi seconds
      self.updateParticlePositions(deltaMsec/2000)

      if (self.controlsMode === 'fly' && self.controls) { self.controls.update(deltaMsec/1000) }

      var barkScaleFrequencyData = self.analyser.barkScaleFrequencyData()
      var cochleaSphericalCoords = generateCochleaSphericalCoords(barkScaleFrequencyData.frequencies, 24, 0, 5)
      console.log("coch0: ", cochleaSphericalCoords[0])
      console.log("coch1: ", cochleaSphericalCoords[1])
      console.log("coch2: ", cochleaSphericalCoords[2])

      self.updateFiberGeometry(cochleaSphericalCoords)
    })
  },

  setupAudio: function () {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    this.analyser = webAudioAnalyser2({
      context: audioCtx,
      fftSize: 2048,
      equalTemperedFreqBinCount: 10
    })

    this.analyser.connect(audioCtx.destination)

    var $micSelector = require('mic-selector')(audioCtx)
    $micSelector.attr('id', 'mic-selector')
    var self = this

    $micSelector.on('bang', function (e, node) {
      node.connect(self.analyser)
    })

    $('body').append($micSelector)
  },

  updateFiberGeometry: function(csc) {
      for (i = 0; i< this.fibers.length; i++) {
          var fiber = this.fibers[i]
          var sphericalCoords = csc[i]
          fiber.geometry.vertices = generateFiber(sphericalCoords).vertices
          fiber.geometry.dynamic = true
          fiber.geometry.verticesNeedUpdate = true
      }
  },

  updateParticlePositions: function(dt) {
    this.particles.forEach(function (particle){
      var pos = particle.position
      particle.position.add(getFlow(pos,dt))
    })
  },

  removeFibers: function () {
    var self = this
    this.fibers.forEach(function (fiber) { 
        self.scene.remove(fiber) 
        fiber.material.dispose()
        fiber.texture.dispose()
        fiber.geometry.dispose() })
  },

  setControlsMode: function (mode) {
    this.controlsMode = mode
    switch (mode) {
      case 'fly':
        if (this.controls) { this.controls.dispose() }
        this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement, { movementSpeed: 0.01 })
        this.controls.enable()
        break
      case 'orbit':
        if (this.controls) { this.controls.disable() }
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        break
    }
  },

  // private

  addAxes: function () {
    var axes = new THREE.AxisHelper(5)
    this.scene.add(axes)
  },

  initRenderer: function () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff, 0)
    document.body.appendChild(this.renderer.domElement)
  },

  initControls: function () {
    this.camera.position.z = 10
    this.setControlsMode(this.controlsMode)
  }
}

const THREE = require('three')
const flyControls = require('./three-fly-controls-custom')(THREE)
const OrbitControls = require('three-orbit-controls')(THREE)
const generateFiberGeometry = require('./generate-fiber')
const generateParticle = require('./generate-particle')
const hud = require('./../hud')
const getFlow = require('./flow')
const WindowResize = require('three-window-resize')
const $ = require('jquery')
const webAudioAnalyser2 = require('web-audio-analyser-2')
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const getMic = require('./getMic.js')(audioCtx)
const generateCochleaSphericalCoords = require('./generate-cochlea-spherical-coords')
const hexStringFromSphericalCoords = require('./../services/hex-string-from-spherical-coords')
const hopfMap = require('./../services/hopf-map')
const dat = require('dat.gui')


module.exports = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(1000, window.innerWidth/window.innerHeight, 0.1, 5000),
  renderer: new THREE.WebGLRenderer({alpha: false, canvas: document.getElementById('environment'),clearColor:0x000000}),
  fibers: [],
  particles: [],
  sketchMode: "fiber",
  controlsMode: "orbit",
  hud: hud,
  init: function () {
    this.initRenderer()
    // this.addAxes()
    this.initControls()
    WindowResize(this.renderer, this.camera)
    this.hud.init(this)
    this.setupAudio()
    this.explode = "no"
  },

  startAnimation: function () {
    var self = this
    var lastTimeMsec = null

    this.gui = new dat.GUI()
    var options = this.gui.addFolder('options')
    this.cochlea = false
    this.toggled = true
    this.audio = false
    this.insideOut = false
    this.dontExplode = true
    this.plasticity = 1
    this.explodeyness = 0.1
    options.add(this, 'cochlea').listen()
    options.add(this, 'audio').listen()
    options.add(this, 'insideOut').listen()
    options.add(this, 'dontExplode').listen()
    options.add(this, 'plasticity').min(-1).max(5).step(0.1).listen()
    options.add(this, 'explodeyness').min(-1).max(2).step(0.1).listen()
    options.add(this,'removeFibers');
    options.open()
    this.gui.close()

    var barkScaleFrequencyData = self.analyser.barkScaleFrequencyData()
    var cochleaSphericalCoords = generateCochleaSphericalCoords(barkScaleFrequencyData.frequencies, 24, 0, 5)
    this.originalCSC = cochleaSphericalCoords
    self.fibers = cochleaSphericalCoords.map(function (sc) {
      var hex = parseInt(hexStringFromSphericalCoords({eta:sc.eta,phi:-2*sc.phi+Math.PI}).replace('#', '0x'))
      return generateFiberGeometry({sphericalCoords:sc,color:hex})})
    self.fibers.map(function (fiber) {
      self.scene.add(fiber.mesh)
    })

     requestAnimationFrame( function render (nowMsec) {
      requestAnimationFrame(render)
      self.renderer.render(self.scene, self.camera)
      var coordsArray = self.hud.sketchpad.extractNewSphericalCoords()
      if (self.sketchMode === "fiber"){
        var newFibers = coordsArray.map(generateFiberGeometry)
        newFibers.forEach(function (fiberGeometry) {
          self.fibers.push(fiberGeometry)
          self.scene.add(fiberGeometry.mesh)
        })
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

      if(self.cochlea && !self.toggled){
        self.toggleCochlea()
        self.toggled = true
      }

      if(!self.cochlea && self.toggled){
        self.toggleCochlea()
        self.toggled = false
      }

      if(self.cochlea){
        var barkScaleFrequencyData = self.analyser.barkScaleFrequencyData()
        if(self.audio){
          var cochleaSphericalCoords = generateCochleaSphericalCoords(barkScaleFrequencyData.frequencies, 24, 0, 5)
        } else {
          var cochleaSphericalCoords = self.originalCSC
        }
        self.updateFiberGeometry(cochleaSphericalCoords)
      }
    })
  },

  setupAudio: function () {

    this.analyser = webAudioAnalyser2({
      context: audioCtx,
      fftSize: 2048,
      equalTemperedFreqBinCount: 10
    })

    // this.analyser.connect(audioCtx.destination)

    //var $micSelector = require('mic-selector')(audioCtx)
    //$micSelector.attr('id', 'mic-selector')
    var self = this

    //$micSelector.on('bang', function (e, node) {
    //  node.connect(self.analyser)
    //})

    //$('body').append($micSelector)
    getMic(audioCtx)
  .then(function (microphone) {
    microphone.connect(self.analyser)
  })
  .fail(function (err) {
    console.log('err: ', err)
  })

  },

  toggleCochlea: function() {
    for(var i = 0; i< this.originalCSC.length; i++){
      this.fibers[i].mesh.visible = this.cochlea
    }
  },

  updateFiberGeometry: function(csc) {
      for (var i = 0; i< csc.length; i++) {
          var fiber = this.fibers[i]
          var oldSphericalCoords = fiber.sphericalCoords
          var originalSphericalCoords = fiber.originalSphericalCoords
          var newSphericalCoords = csc[i]
          var sane = this.dontExplode //try turning this off
          var diff = function (t) {
            var plasticity = this.plasticity //knob
            var insideOut = this.insideOut //minor oh fuck button
            var newHopf = hopfMap(newSphericalCoords,insideOut && 1-t || t)
            var oldHopf = hopfMap(oldSphericalCoords,t)
            var difference = newHopf.sub(oldHopf).multiplyScalar(0.8)
            if (!sane){
              var flow = 0.1
              difference.addScaledVector(newHopf,-flow)
              difference.addScaledVector(hopfMap(originalSphericalCoords,t),flow)
            }
            return difference
            }
          for(j = 0; j<520; j++){
            //two more knobs, the multiplier for j and the scale of the transformation
            var twist = 1 //knob
            fiber.vertices[j].addScaledVector(diff(twist*j/520),this.explodeyness)
          }
          if (sane) {
            fiber.sphericalCoords = csc[i]
          }
          fiber.verticesNeedUpdate = true
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
    while(self.fibers.length > self.originalCSC.length){
      var fiber = self.fibers.pop()
      self.scene.remove(fiber.mesh)
    }
    // for(i = self.originalCSC.length-1; i< self.fibers.length; i++){
    //   var fiber = self.fibers[i]
    //   self.scene.remove(fiber.mesh)
    //   // fiber.material.dispose()
    //   // fiber.texture.dispose()
    //   // fiber.geometry.dispose()
    // }
  },

  setControlsMode: function (mode) {
    this.controlsMode = mode
    switch (mode) {
      case 'fly':
        if (this.controls) { this.controls.dispose() }
        // this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement, { movementSpeed: 0.01 })
        // this.controls.enable()
        this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement)
        this.controls.movementSpeed = 0.01
        this.controls.rollSpeed = 0.01
        this.keyMap = {}
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

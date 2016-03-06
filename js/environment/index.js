var THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)
var getCoordsFor2Sphere = require('./get-coords-for-2-sphere')
var generateFiber = require('./generate-fiber')

module.exports = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000),
  renderer: new THREE.WebGLRenderer({alpha: true, canvas: document.getElementById('environment')}),
  fibers: [],
  init: function () {
    this.initRenderer()
    this.addAxes()
    this.initControls()

    this.camera.position.z = 10
  },

  startAnimation: function () {
    var self = this
    var lastTimeMsec = null

    requestAnimationFrame(function render (nowMsec) {
      requestAnimationFrame(render)
      self.renderer.render(self.scene, self.camera)
    })
  },

  generateImage: function () {
    var self = this
    var coordsArray = getCoordsFor2Sphere(3)
    this.fibers = coordsArray.map(generateFiber)
    this.fibers.forEach(function (fiber) {
      self.scene.add(fiber)
    })
  },

  removeImage: function () {
    var self = this
    this.fibers.forEach(function (fiber) {
      self.scene.remove(fiber)
    })
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
    this.controls = new OrbitControls(this.camera)
  }

}

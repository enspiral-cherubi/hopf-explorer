var THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)
var getCoordsFor2Sphere = require('./get-coords-for-2-sphere')

module.exports = {
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000),
  renderer: new THREE.WebGLRenderer({alpha: true}),
  init: function () {
    this.initRenderer()
    this.addAxes()
    this.initControls()

    this.camera.position.z = 5
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
    // get all coords on 2-sphere
    var coords = getCoordsFor2Sphere(3)
    console.log('coords: ', coords)
    // for each coord
      // create a fiber geometry
      // material: map x,y,z -> r,g,b
      // add to scene
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

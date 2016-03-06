var THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)

var renderer = new THREE.WebGLRenderer({alpha: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff, 0)
document.body.appendChild(renderer.domElement)

var geometry = new THREE.BoxGeometry(1, 1, 1)
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
var cube = new THREE.Mesh(geometry, material)
scene.add(cube)

var controls = new OrbitControls(camera)

var axisHelper = new THREE.AxisHelper(5)
scene.add(axisHelper)

camera.position.z = 5

var render = function () {
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}

render()

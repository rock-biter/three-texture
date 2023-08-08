import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import mapSrc from './src/textures/stone-wall-001/Stone_Wall_001_COLOR.jpg'
import normalMapSrc from './src/textures/stone-wall-001/Stone_Wall_001_NRM.jpg'
import dispMapSrc from './src/textures/stone-wall-001/Stone_Wall_001_DISP.jpg'
import aoMapSrc from './src/textures/stone-wall-001/Stone_Wall_001_OCC.jpg'

const manager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(manager)

/**
 * Scene
 */
const scene = new THREE.Scene()

const map = textureLoader.load(mapSrc)
const normalMap = textureLoader.load(normalMapSrc)
const displacementMap = textureLoader.load(dispMapSrc)
const aoMap = textureLoader.load(aoMapSrc)

/**
 * Manhattan
 */
const material = new THREE.MeshStandardMaterial({
	map,
	displacementMap,
	displacementScale: 0.05,
	normalMap,
	aoMap,
	aoMapIntensity: 1,
})

material.onBeforeCompile = (shader) => {
	console.log(shader.vertexShader)
	console.log(shader.fragmentShader)
}

const geometry = new THREE.SphereGeometry(0.75, 90, 90)
geometry.attributes.uv2 = geometry.attributes.uv
geometry.needsUpdate = true

console.log(geometry)
const mesh = new THREE.Mesh(geometry, material)
mesh.position.x = -1
scene.add(mesh)

const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5, 10, 10)
const planeMaterial = new THREE.MeshStandardMaterial({ map })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.x = 1
scene.add(plane)

const light = new THREE.DirectionalLight(0xffffff, 0.75)
light.position.set(5, 5, 10)
scene.add(light)
const aLinght = new THREE.AmbientLight(0xffffff, 0.25)
scene.add(aLinght)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(0, 0, 4)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Three js Clock
 */
// const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

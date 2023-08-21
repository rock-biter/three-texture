import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import mapSrc from './src/textures/giangi/giangi-02.png'
// import mapSrc from './src/textures/stone-wall-001/Stone_Wall_001_COLOR.jpg'
// import dispSrc from './src/textures/stone-wall-001/Stone_Wall_001_DISP.jpg'
// import normSrc from './src/textures/stone-wall-001/Stone_Wall_001_NRM.jpg'
// import aoSrc from './src/textures/stone-wall-001/Stone_Wall_001_OCC.jpg'

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
	console.log('caricamento iniziato')
}
loadingManager.onLoad = () => {
	console.log('caricamento completato')
}
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
	console.log(
		'caricamento in corso:' + Math.ceil((100 * itemsLoaded) / itemsTotal) + '% '
	)
}
loadingManager.onError = (url) => {
	console.log('carcamento fallito')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const map = textureLoader.load(mapSrc)
// const disp = textureLoader.load(dispSrc)
// const normal = textureLoader.load(normSrc)
// const ao = textureLoader.load(aoSrc)

// const img = new Image()
// const map = new THREE.Texture(img)
// img.onload = () => {
// 	map.needsUpdate = true
// 	console.log(map)
// }

// img.src = mapSrc

/**
 * Objects
 */
const material = new THREE.MeshStandardMaterial({
	map: map,
	// transparent: true,
	// normalMap: normal,
	// normalScale: new THREE.Vector2(0.85, -0.85),
	// displacementMap: disp,
	// displacementScale: 0.05,
	// aoMap: ao,
	// aoMapIntensity: 1,
})

// map.repeat.x = 2
// map.repeat.y = 2
// map.center.x = 0.5
// map.center.y = 0.5

// const geometry = new THREE.SphereGeometry(0.75, 500, 500)
// const geometry = new THREE.PlaneGeometry(1.5, 1.5, 300, 300)
const geometry = new THREE.BoxGeometry(1.25, 1.25, 1.25, 300, 300, 300)
geometry.attributes.uv2 = geometry.attributes.uv
geometry.needsUpdate = true

const mesh = new THREE.Mesh(geometry, material)
// mesh.position.x = -1
const mesh2 = mesh.clone()
const mesh3 = mesh.clone()

mesh2.position.set(2, 1, -2)
// mesh2.rotation.x = 0.5
mesh2.rotation.z = Math.PI * 0.25
mesh3.rotation.y = Math.PI * 0.25
mesh3.position.set(-2, 0.5, -1)

scene.add(mesh, mesh2, mesh3)

const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5, 10, 10)
const planeMaterial = new THREE.MeshStandardMaterial({ map: map })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.x = 1
// scene.add(plane)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(5, 5, 10)
scene.add(light)
const aLinght = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(aLinght)
// const emLight = new THREE.HemisphereLight(0xffffff, 0x55ff55, 0.2)
// scene.add(emLight)

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

scene.background = new THREE.Color(0x000652)

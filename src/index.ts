///<reference path="../node_modules/@types/three/three-core.d.ts"/>
import * as THREE from 'three'
import * as lerp from 'lerp'
import dat from 'dat.gui'

import { TYPES, CLASSES } from './FGO/Constants'
import FGOCard from './FGO/Card'
import StarSphere from './FGO/Stars'
//////////////

let vars = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspectRatio: window.innerWidth / window.innerHeight
}

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(vars.width, vars.height)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const cam = new THREE.PerspectiveCamera(35, vars.aspectRatio, 200, 13000)
cam.position.set(0, 420, -2300)
let lookVector = new THREE.Vector3(0, 400, 0)
cam.lookAt(lookVector)
let camFinal = {
  zFinal: cam.position.z,
  yFinal: cam.position.y,
  xFinal: cam.position.x
}


const light = new THREE.AmbientLight(0xFFFFFF, .4)
const shine = new THREE.PointLight(0xFFFFFF, .7)
shine.position.set(0, 420, -700)

const floorGeometry = new THREE.CylinderGeometry(400, 400, 5, 500)
const floorMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, opacity: .5, transparent: true})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y -= 10

const stars = new StarSphere(800, 3000, 6000, 128, 'hsl(180, 90%, 60%)')
const farStars = new StarSphere(3000, 3000, 6000, 64, 'hsl(200, 80%, 90%)')

const card = new FGOCard({ id: 153, rarity: 5, servantClass: CLASSES.SABER })
let cardFinal = {
  xFinal: 0,
  yFinal: 0
}

scene.add(light)
scene.add(shine)
// scene.add(floor)
scene.add(stars)
scene.add(farStars)

let fn = {
  update () {
    for (let o of scene.children) {
      if (o.userData.isCardObject) scene.remove(o)
    }
    card.compose()
    console.log(card)
    cardFinal.yFinal = card.rotation.y
    cardFinal.xFinal = card.rotation.x
    scene.add(card)
  }
}
fn.update()


// GUI
const gui = new dat.GUI()
gui.add(card.userData, 'type').options({
  'Servant': TYPES.SERVANT,
  'Craft Essence': TYPES.CE
}).onFinishChange(e => {
  const type = parseInt(e)
  if (type == TYPES.SERVANT) {
    sc.open()
  } else {
    sc.close()
  }
  card.userData.type = type
}).name('Card type')
gui.add(card.userData, 'rarity', 1, 5, 1).name('Rarity (stars)')
gui.add(card.userData, 'id').name('Card ID')
const sc = gui.addFolder('Servant attributes')
sc.add(card.userData, 'servantClass').options({
  'Shielder': CLASSES.SHIELDER,
  'Saber': CLASSES.SABER,
  'Lancer': CLASSES.LANCER,
  'Archer': CLASSES.ARCHER,
  'Rider': CLASSES.RIDER,
  'Caster': CLASSES.CASTER,
  'Assassin': CLASSES.ASSASSIN,
  'Berserker': CLASSES.BERSERKER,
  'Ruler': CLASSES.RULER,
  'All': CLASSES.ALL,
  'Avenger': CLASSES.AVENGER,
  'Alter Ego': CLASSES.ALTER_EGO,
  'Moon Cancer': CLASSES.MOON_CANCER,
  'Foreigner': CLASSES.FOREIGNER
}).onFinishChange(e => {
  card.userData.servantClass = parseInt(e)
}).name('Servant class')
sc.add(card.userData, 'stage', 1, 4, 1).name('Ascension stage')
sc.add(card.userData, 'riyo').name('Riyo mode')
gui.add(fn, 'update').name('Render!')
sc.open()


// EVENT HANDLERS
let xStart = [0, 0]
let xDiff = [0, 0]
let yStart = [0, 0]
let yDiff = [0, 0]
let grabbing = false

const centerX = x => x - vars.width / 2
const centerY = y => y - vars.height / 2

addEventListener('mousedown', handleGrab)
addEventListener('touchstart', handleGrab)
function handleGrab (e) {
  if (e.type === 'touchstart') {
    for (let i = 0; i < e.touches.length; i++) {
      xStart[i] = e.touches[i].clientX
      yStart[i] = e.touches[i].clientY
    }
  } else {
    xStart[0] = e.clientX
    yStart[0] = e.clientY
  }
  grabbing = true
}

addEventListener('mousemove', handleMove)
addEventListener('touchmove', handleMove)
function handleMove (e) {
  if (e.type === 'touchmove') {
    e.preventDefault()
    if (e.touches.length > 1) return handleMultitouch(e)
  }
  e = e.type === 'touchmove' ? e.touches[0] : e
  if (grabbing) {
    xDiff[0] = e.clientX - xStart[0]
    yDiff[0] = e.clientY - yStart[0]
    cardFinal.yFinal = card.rotation.y + xDiff[0] / (vars.width / 2)
    cardFinal.xFinal = card.rotation.x - yDiff[0] / (vars.height / .5)
  }
  const x = centerX(e.clientX)
  const y = centerY(e.clientY)
  shine.position.x = x
  shine.position.y = y + 420
}

function handleMultitouch (e) {
  // UUUUUUGLY
  if (e.touches.length == 2) {
    const distStart = Math.sqrt(Math.pow(xStart[0] - xStart[1], 2) + Math.pow(yStart[0] - yStart[1], 2))
    const distNow = Math.sqrt(Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2))
    const distDiff = distStart - distNow
    camFinal.zFinal = cam.position.z - distDiff
  }
}

addEventListener('mouseup', handleDrop)
addEventListener('touchend', handleDrop)
function handleDrop () {
  xDiff = [0, 0]
  yDiff = [0, 0]
  grabbing = false
}

addEventListener('wheel', e => {
  // console.log(e)
  e.preventDefault()
  if (e.ctrlKey) {
    camFinal.yFinal = cam.position.y - e.deltaY * 4
    camFinal.xFinal = cam.position.x - e.deltaX * 4
  } else if (e.shiftKey) {
    camFinal.xFinal = cam.position.x - e.deltaY * 4
  } else {
    camFinal.zFinal = cam.position.z - e.deltaY * 2
  }
})

// RENDERING
function updateRenderer() {
  card.rotation.y = lerp(card.rotation.y, cardFinal.yFinal, .2)
  card.rotation.x = lerp(card.rotation.x, cardFinal.xFinal, .2)
  cam.position.z = lerp(cam.position.z, camFinal.zFinal, .2)
  cam.position.y = lerp(cam.position.y, camFinal.yFinal, .2)
  cam.position.x = lerp(cam.position.x, camFinal.xFinal, .2)
  cam.lookAt(lookVector)
  stars.rotation.y -= 1 / 3000
  farStars.rotation.y -= 1 / 10000
  renderer.render(scene, cam)
  requestAnimationFrame(updateRenderer)
}
updateRenderer()
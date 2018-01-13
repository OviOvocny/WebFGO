///<reference path="../../node_modules/@types/three/three-core.d.ts"/>
import * as THREE from 'three'
import { TYPES, CLASSES } from './Constants'

let texturesDirectory = './resources/textures'

function fgoTypeString (type: number) : string {
  if (type === TYPES.SERVANT) {
    return 'servant'
  } else if (type === TYPES.CE) {
    return 'essence'
  } else {
    throw new Error('Card type not recognized')
  }
}

interface CardOptions {
  id: number,
  type: number,
  riyo: boolean,
  rarity: number,
  stage: number,
  servantClass: number,
  hp: number,
  atk: number,
  name: string
}

const defaults: CardOptions = {
  id: 1,
  type: TYPES.SERVANT,
  riyo: false,
  rarity: 3,
  stage: 1,
  servantClass: CLASSES.SHIELDER,
  hp: 1854,
  atk: 1261,
  name: 'Mash Kyrielight'
}

export default class Card extends THREE.Object3D {
  children: CardLayer[]
  constructor (options) {
    super()
    this.userData = { ...defaults, ...options }
  }

  compose () {
    for (let i = this.children.length - 1; i > 0; i--) {
      this.remove(this.children[i])
    }
    console.log(this.children)
    this.add(new ReverseLayer(this.userData.type, this.userData.rarity))
    if (this.userData.type === TYPES.SERVANT) {
      this.add(new ServantLayer(this.userData.id, this.userData.stage, this.userData.riyo))
      this.add(new ClassLayer(this.userData.servantClass, this.userData.rarity))
    } else if (this.userData.type === TYPES.CE) {
      this.add(new EssenceLayer(this.userData.id))
    } else {
      throw new Error('Card type not recognized')
    }
    this.add(new FrameLayer(this.userData.type, this.userData.rarity))
    this.rotation.y = Math.PI
    this.position.y = this.children[0].geometry.parameters.height / 2
    this.userData.isCardObject = true
  }
}

class CardLayer extends THREE.Mesh {
  private w: number
  private h: number
  material: THREE.MeshPhongMaterial
  geometry: THREE.PlaneGeometry

  constructor (w = 512, h = 874) {
    super()
    this.w = w
    this.h = h
    this.geometry = new THREE.PlaneGeometry(this.w, this.h)
    this.material = new THREE.MeshPhongMaterial()
  }
}

class ClassLayer extends CardLayer {
  private rarity: number
  private class: number
  private linkId: string
  private uri: string
  private texture: THREE.Texture
  private normalUri: string
  private normalTexture: THREE.Texture

  constructor (servantClass = CLASSES.ALL, rarity = 1, w = 100) {
    super(w, w)
    this.rarity = rarity
    this.class = servantClass
    this.linkId = `${this.class}`.padStart(2, '0')
    this.uri = `${texturesDirectory}/maps/cards/servant/obverse/class/${this.linkId}0${this.rarity}.png`
    this.texture = new THREE.TextureLoader().load(this.uri)
    this.texture.minFilter = THREE.LinearFilter
    this.material.map = this.texture
    this.normalUri = `${texturesDirectory}/normal_maps/cards/servant/obverse/class/${this.class}.png`
    this.normalTexture = new THREE.TextureLoader().load(this.normalUri)
    this.normalTexture.minFilter = THREE.LinearFilter
    this.material.normalMap = this.normalTexture
    this.material.transparent = true
    this.material.alphaTest = .5
    this.position.y = -374
    this.position.x = 1
  }
}

class FrameLayer extends CardLayer {
  private fgoType: string
  private rarity: number
  private uri: string
  private texture: THREE.Texture
  private normalUri: string
  private normalTexture: THREE.Texture

  constructor (type = TYPES.SERVANT, rarity = 1, w = 512, h = 874) {
    super(w, h)
    this.rarity = rarity
    this.fgoType = fgoTypeString(type)
    this.uri = `${texturesDirectory}/maps/cards/${this.fgoType}/obverse/frame/${this.rarity}.png`
    this.texture = new THREE.TextureLoader().load(this.uri)
    this.texture.minFilter = THREE.LinearFilter
    this.normalUri = `${texturesDirectory}/normal_maps/cards/${this.fgoType}/obverse/frame/${this.rarity}.png`
    this.normalTexture = new THREE.TextureLoader().load(this.normalUri)
    this.normalTexture.minFilter = THREE.LinearFilter
    this.material.normalMap = this.normalTexture
    this.material.map = this.texture
    this.material.transparent = true
    this.material.polygonOffset = true
    this.material.polygonOffsetFactor = 1
    this.material.polygonOffsetUnits = 0.1
  }
}

class ServantLayer extends CardLayer {
  private fgoId: number
  private riyo: boolean
  private stage: number
  private linkId: string
  private uri: string
  private texture: THREE.Texture

  constructor (id = 1, stage = 1, riyo = false, w = 512, h = 724) {
    super(w, h)
    this.fgoId = id
    this.riyo = riyo
    this.stage = stage
    if (this.riyo) {
      this.linkId = `${this.fgoId}`.padStart(3, '0')
      this.uri = `https://cors-anywhere.herokuapp.com/http://fate-go.cirnopedia.org/icons/chibi_servant_card/servant_${this.linkId}.png`
    } else {
      this.linkId = `${this.fgoId}${this.stage}`.padStart(4, '0')
      this.uri = `https://cors-anywhere.herokuapp.com/http://fate-go.cirnopedia.org/icons/servant_card/${this.linkId}.jpg`
    }
    this.texture = new THREE.TextureLoader().load(this.uri)
    this.texture.minFilter = THREE.LinearFilter
    this.material.map = this.texture
    this.material.polygonOffset = true
    this.material.polygonOffsetFactor = 2
    this.material.polygonOffsetUnits = 0.1
    this.position.y = 50
  }
}

class EssenceLayer extends CardLayer {
  private fgoId: number
  private linkId: string
  private uri: string
  private texture: THREE.Texture

  constructor (id = 1, w = 512, h = 874) {
    super(w, h)
    this.fgoId = id
    this.linkId = `${this.fgoId}`.padStart(3, '0')
    this.uri = `https://cors-anywhere.herokuapp.com/http://fate-go.cirnopedia.org/icons/essence/craft_essence_${this.linkId}.jpg`
    this.texture = new THREE.TextureLoader().load(this.uri)
    this.texture.minFilter = THREE.LinearFilter
    this.material.map = this.texture
    this.material.polygonOffset = true
    this.material.polygonOffsetFactor = 2
    this.material.polygonOffsetUnits = 0.1
  }
}

class ReverseLayer extends CardLayer {
  private fgoType: string
  private rarity: number
  private color: string
  private uri: string
  private texture: THREE.Texture
  private normalUri: string
  private normalTexture: THREE.Texture

  constructor (type = TYPES.SERVANT, rarity = 1, w = 512, h = 874) {
    super(w, h)
    this.fgoType = fgoTypeString(type)
    this.rarity = rarity
    switch (this.rarity) {
      case 1:
      case 2:
      default:
        this.color = 'bronze'
        break
      case 3:
        this.color = 'silver'
        break
      case 4:
      case 5:
        this.color = 'gold'
        break
    }
    this.uri =  `${texturesDirectory}/maps/cards/${this.fgoType}/reverse/${this.color}.png`
    this.texture = new THREE.TextureLoader().load(this.uri)
    this.normalUri = `${texturesDirectory}/normal_maps/cards/${this.fgoType}/reverse/normal.png`
    this.normalTexture = new THREE.TextureLoader().load(this.normalUri)
    this.texture.minFilter = THREE.LinearFilter
    this.material.map = this.texture
    this.material.normalMap = this.normalTexture

    // this.material.side = THREE.BackSide
    this.rotateY(Math.PI)
  }
}
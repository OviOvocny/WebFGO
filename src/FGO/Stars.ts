///<reference path="../../node_modules/@types/three/three-core.d.ts"/>
import * as THREE from 'three'

export default class StarSphere extends THREE.Points {
  private count: number
  private color: string
  private radius: { min: number; max: number }
  private size: number
  private canvas: HTMLCanvasElement
  material: THREE.PointsMaterial

  constructor (count, rMin, rMax, size = 128, color = 'hsl(170, 80%, 70%)') {
    super()
    this.count = count
    this.color = color
    this.radius = {
      min: rMin,
      max: rMax
    }
    this.size = size
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.size
    this.canvas.height = this.size
    const ctx = this.canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(this.size / 2, this.size / 2, this.size / 2, this.size / 2, this.size / 2, 0)
    gradient.addColorStop(0, 'transparent')
    gradient.addColorStop(1, this.color)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, this.size, this.size)
    this.geometry = new THREE.Geometry()
    this.material = new THREE.PointsMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      size: this.size,
      map: new THREE.CanvasTexture(this.canvas)
    })
    this.material.map.needsUpdate = true
    for (let i = 0; i < this.count; i++) {
      this.geometry.vertices.push(StarSphere.randomSpherePoint(0, 0, 0, this.radius.min, this.radius.max))
    }
  }

  static randomSpherePoint (x0, y0, z0, rMin, rMax) {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    const radius = Math.random() * (rMax - rMin) + rMin
    const x = x0 + (radius * Math.sin(phi) * Math.cos(theta))
    const y = y0 + (radius * Math.sin(phi) * Math.sin(theta))
    const z = z0 + (radius * Math.cos(phi))
    return new THREE.Vector3(x, y, z)
  }
}
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../../node_modules/@types/three/three-core.d.ts"/>
var THREE = require("three");
var StarSphere = /** @class */ (function (_super) {
    __extends(StarSphere, _super);
    function StarSphere(count, rMin, rMax, size, color) {
        if (size === void 0) { size = 128; }
        if (color === void 0) { color = 'hsl(170, 80%, 70%)'; }
        var _this = _super.call(this) || this;
        _this.count = count;
        _this.color = color;
        _this.radius = {
            min: rMin,
            max: rMax
        };
        _this.size = size;
        _this.canvas = document.createElement('canvas');
        _this.canvas.width = _this.size;
        _this.canvas.height = _this.size;
        var ctx = _this.canvas.getContext('2d');
        var gradient = ctx.createRadialGradient(_this.size / 2, _this.size / 2, _this.size / 2, _this.size / 2, _this.size / 2, 0);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, _this.color);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, _this.size, _this.size);
        _this.geometry = new THREE.Geometry();
        _this.material = new THREE.PointsMaterial({
            blending: THREE.AdditiveBlending,
            transparent: true,
            size: _this.size,
            map: new THREE.CanvasTexture(_this.canvas)
        });
        _this.material.map.needsUpdate = true;
        for (var i = 0; i < _this.count; i++) {
            _this.geometry.vertices.push(StarSphere.randomSpherePoint(0, 0, 0, _this.radius.min, _this.radius.max));
        }
        return _this;
    }
    StarSphere.randomSpherePoint = function (x0, y0, z0, rMin, rMax) {
        var u = Math.random();
        var v = Math.random();
        var theta = 2 * Math.PI * u;
        var phi = Math.acos(2 * v - 1);
        var radius = Math.random() * (rMax - rMin) + rMin;
        var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
        var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
        var z = z0 + (radius * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
    };
    return StarSphere;
}(THREE.Points));
exports.default = StarSphere;

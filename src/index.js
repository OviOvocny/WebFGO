"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../node_modules/@types/three/three-core.d.ts"/>
var THREE = require("three");
var lerp = require("lerp");
var dat_gui_1 = require("dat.gui");
var Constants_1 = require("./FGO/Constants");
var Card_1 = require("./FGO/Card");
var Stars_1 = require("./FGO/Stars");
//////////////
var vars = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
};
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(vars.width, vars.height);
document.body.appendChild(renderer.domElement);
var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(35, vars.aspectRatio, 200, 13000);
cam.position.set(0, 420, -2300);
var lookVector = new THREE.Vector3(0, 400, 0);
cam.lookAt(lookVector);
var camFinal = {
    zFinal: cam.position.z,
    yFinal: cam.position.y,
    xFinal: cam.position.x
};
var light = new THREE.AmbientLight(0xFFFFFF, .4);
var shine = new THREE.PointLight(0xFFFFFF, .7);
shine.position.set(0, 420, -700);
var floorGeometry = new THREE.CylinderGeometry(400, 400, 5, 500);
var floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, opacity: .5, transparent: true });
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y -= 10;
var stars = new Stars_1.default(800, 3000, 6000, 128, 'hsl(180, 90%, 60%)');
var farStars = new Stars_1.default(3000, 3000, 6000, 64, 'hsl(200, 80%, 90%)');
var card = new Card_1.default({ id: 153, rarity: 5, servantClass: Constants_1.CLASSES.SABER });
var cardFinal = {
    xFinal: 0,
    yFinal: 0
};
scene.add(light);
scene.add(shine);
// scene.add(floor)
scene.add(stars);
scene.add(farStars);
var fn = {
    update: function () {
        for (var _i = 0, _a = scene.children; _i < _a.length; _i++) {
            var o = _a[_i];
            if (o.userData.isCardObject)
                scene.remove(o);
        }
        card.compose();
        console.log(card);
        cardFinal.yFinal = card.rotation.y;
        cardFinal.xFinal = card.rotation.x;
        scene.add(card);
    }
};
fn.update();
// GUI
var gui = new dat_gui_1.default.GUI();
gui.add(card.userData, 'type').options({
    'Servant': Constants_1.TYPES.SERVANT,
    'Craft Essence': Constants_1.TYPES.CE
}).onFinishChange(function (e) {
    var type = parseInt(e);
    if (type == Constants_1.TYPES.SERVANT) {
        sc.open();
    }
    else {
        sc.close();
    }
    card.userData.type = type;
}).name('Card type');
gui.add(card.userData, 'rarity', 0, 5, 1).name('Rarity (stars)');
gui.add(card.userData, 'id').name('Card ID');
var sc = gui.addFolder('Servant attributes');
sc.add(card.userData, 'servantClass').options({
    'Shielder': Constants_1.CLASSES.SHIELDER,
    'Saber': Constants_1.CLASSES.SABER,
    'Lancer': Constants_1.CLASSES.LANCER,
    'Archer': Constants_1.CLASSES.ARCHER,
    'Rider': Constants_1.CLASSES.RIDER,
    'Caster': Constants_1.CLASSES.CASTER,
    'Assassin': Constants_1.CLASSES.ASSASSIN,
    'Berserker': Constants_1.CLASSES.BERSERKER,
    'Ruler': Constants_1.CLASSES.RULER,
    'All': Constants_1.CLASSES.ALL,
    'Avenger': Constants_1.CLASSES.AVENGER,
    'Alter Ego': Constants_1.CLASSES.ALTER_EGO,
    'Moon Cancer': Constants_1.CLASSES.MOON_CANCER,
    'Foreigner': Constants_1.CLASSES.FOREIGNER
}).onFinishChange(function (e) {
    card.userData.servantClass = parseInt(e);
}).name('Servant class');
sc.add(card.userData, 'stage', 1, 4, 1).name('Ascension stage');
sc.add(card.userData, 'riyo').name('Riyo mode');
gui.add(fn, 'update').name('Render!');
sc.open();
// EVENT HANDLERS
var xStart = [0, 0];
var xDiff = [0, 0];
var yStart = [0, 0];
var yDiff = [0, 0];
var grabbing = false;
var centerX = function (x) { return x - vars.width / 2; };
var centerY = function (y) { return y - vars.height / 2; };
addEventListener('mousedown', handleGrab);
addEventListener('touchstart', handleGrab);
function handleGrab(e) {
    if (e.type === 'touchstart') {
        for (var i = 0; i < e.touches.length; i++) {
            xStart[i] = e.touches[i].clientX;
            yStart[i] = e.touches[i].clientY;
        }
    }
    else {
        xStart[0] = e.clientX;
        yStart[0] = e.clientY;
    }
    grabbing = true;
}
addEventListener('mousemove', handleMove);
addEventListener('touchmove', handleMove);
function handleMove(e) {
    if (e.type === 'touchmove') {
        e.preventDefault();
        if (e.touches.length > 1)
            return handleMultitouch(e);
    }
    e = e.type === 'touchmove' ? e.touches[0] : e;
    if (grabbing) {
        xDiff[0] = e.clientX - xStart[0];
        yDiff[0] = e.clientY - yStart[0];
        cardFinal.yFinal = card.rotation.y + xDiff[0] / (vars.width / 2);
        cardFinal.xFinal = card.rotation.x - yDiff[0] / (vars.height / .5);
    }
    var x = centerX(e.clientX);
    var y = centerY(e.clientY);
    shine.position.x = x;
    shine.position.y = y + 420;
}
function handleMultitouch(e) {
    // UUUUUUGLY
    if (e.touches.length == 2) {
        var distStart = Math.sqrt(Math.pow(xStart[0] - xStart[1], 2) + Math.pow(yStart[0] - yStart[1], 2));
        var distNow = Math.sqrt(Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2));
        var distDiff = distStart - distNow;
        camFinal.zFinal = cam.position.z - distDiff;
    }
}
addEventListener('mouseup', handleDrop);
addEventListener('touchend', handleDrop);
function handleDrop() {
    xDiff = [0, 0];
    yDiff = [0, 0];
    grabbing = false;
}
addEventListener('wheel', function (e) {
    // console.log(e)
    e.preventDefault();
    if (e.ctrlKey) {
        camFinal.yFinal = cam.position.y - e.deltaY * 4;
        camFinal.xFinal = cam.position.x - e.deltaX * 4;
    }
    else if (e.shiftKey) {
        camFinal.xFinal = cam.position.x - e.deltaY * 4;
    }
    else {
        camFinal.zFinal = cam.position.z - e.deltaY * 2;
    }
});
// RENDERING
function updateRenderer() {
    card.rotation.y = lerp(card.rotation.y, cardFinal.yFinal, .2);
    card.rotation.x = lerp(card.rotation.x, cardFinal.xFinal, .2);
    cam.position.z = lerp(cam.position.z, camFinal.zFinal, .2);
    cam.position.y = lerp(cam.position.y, camFinal.yFinal, .2);
    cam.position.x = lerp(cam.position.x, camFinal.xFinal, .2);
    cam.lookAt(lookVector);
    stars.rotation.y -= 1 / 3000;
    farStars.rotation.y -= 1 / 10000;
    renderer.render(scene, cam);
    requestAnimationFrame(updateRenderer);
}
updateRenderer();

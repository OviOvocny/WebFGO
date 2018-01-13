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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../../node_modules/@types/three/three-core.d.ts"/>
var THREE = require("three");
var Constants_1 = require("./Constants");
var texturesDirectory = './resources/textures';
function fgoTypeString(type) {
    if (type === Constants_1.TYPES.SERVANT) {
        return 'servant';
    }
    else if (type === Constants_1.TYPES.CE) {
        return 'essence';
    }
    else {
        throw new Error('Card type not recognized');
    }
}
var defaults = {
    id: 1,
    type: Constants_1.TYPES.SERVANT,
    riyo: false,
    rarity: 3,
    stage: 1,
    servantClass: Constants_1.CLASSES.SHIELDER,
    hp: 1854,
    atk: 1261,
    name: 'Mash Kyrielight'
};
var Card = /** @class */ (function (_super) {
    __extends(Card, _super);
    function Card(options) {
        var _this = _super.call(this) || this;
        _this.userData = __assign({}, defaults, options);
        return _this;
    }
    Card.prototype.compose = function () {
        for (var i = this.children.length - 1; i > 0; i--) {
            this.remove(this.children[i]);
        }
        console.log(this.children);
        this.add(new ReverseLayer(this.userData.type, this.userData.rarity));
        if (this.userData.type === Constants_1.TYPES.SERVANT) {
            this.add(new ServantLayer(this.userData.id, this.userData.stage, this.userData.riyo));
            this.add(new ClassLayer(this.userData.servantClass, this.userData.rarity));
        }
        else if (this.userData.type === Constants_1.TYPES.CE) {
            this.add(new EssenceLayer(this.userData.id));
        }
        else {
            throw new Error('Card type not recognized');
        }
        this.add(new FrameLayer(this.userData.type, this.userData.rarity));
        this.rotation.y = Math.PI;
        this.position.y = this.children[0].geometry.parameters.height / 2;
        this.userData.isCardObject = true;
    };
    return Card;
}(THREE.Object3D));
exports.default = Card;
var CardLayer = /** @class */ (function (_super) {
    __extends(CardLayer, _super);
    function CardLayer(w, h) {
        if (w === void 0) { w = 512; }
        if (h === void 0) { h = 874; }
        var _this = _super.call(this) || this;
        _this.w = w;
        _this.h = h;
        _this.geometry = new THREE.PlaneGeometry(_this.w, _this.h);
        _this.material = new THREE.MeshPhongMaterial();
        return _this;
    }
    return CardLayer;
}(THREE.Mesh));
var ClassLayer = /** @class */ (function (_super) {
    __extends(ClassLayer, _super);
    function ClassLayer(servantClass, rarity, w) {
        if (servantClass === void 0) { servantClass = Constants_1.CLASSES.ALL; }
        if (rarity === void 0) { rarity = 1; }
        if (w === void 0) { w = 100; }
        var _this = _super.call(this, w, w) || this;
        _this.rarity = rarity;
        _this.class = servantClass;
        _this.linkId = ("" + _this.class).padStart(2, '0');
        _this.uri = texturesDirectory + "/maps/cards/servant/obverse/class/" + _this.linkId + "0" + _this.rarity + ".png";
        _this.texture = new THREE.TextureLoader().load(_this.uri);
        _this.texture.minFilter = THREE.LinearFilter;
        _this.material.map = _this.texture;
        _this.normalUri = texturesDirectory + "/normal_maps/cards/servant/obverse/class/" + _this.class + ".png";
        _this.normalTexture = new THREE.TextureLoader().load(_this.normalUri);
        _this.normalTexture.minFilter = THREE.LinearFilter;
        _this.material.normalMap = _this.normalTexture;
        _this.material.transparent = true;
        _this.material.alphaTest = .5;
        _this.position.y = -374;
        _this.position.x = 1;
        return _this;
    }
    return ClassLayer;
}(CardLayer));
var FrameLayer = /** @class */ (function (_super) {
    __extends(FrameLayer, _super);
    function FrameLayer(type, rarity, w, h) {
        if (type === void 0) { type = Constants_1.TYPES.SERVANT; }
        if (rarity === void 0) { rarity = 1; }
        if (w === void 0) { w = 512; }
        if (h === void 0) { h = 874; }
        var _this = _super.call(this, w, h) || this;
        _this.rarity = rarity;
        _this.fgoType = fgoTypeString(type);
        _this.uri = texturesDirectory + "/maps/cards/" + _this.fgoType + "/obverse/frame/" + _this.rarity + ".png";
        _this.texture = new THREE.TextureLoader().load(_this.uri);
        _this.texture.minFilter = THREE.LinearFilter;
        _this.normalUri = texturesDirectory + "/normal_maps/cards/" + _this.fgoType + "/obverse/frame/" + _this.rarity + ".png";
        _this.normalTexture = new THREE.TextureLoader().load(_this.normalUri);
        _this.normalTexture.minFilter = THREE.LinearFilter;
        _this.material.normalMap = _this.normalTexture;
        _this.material.map = _this.texture;
        _this.material.transparent = true;
        _this.material.polygonOffset = true;
        _this.material.polygonOffsetFactor = 1;
        _this.material.polygonOffsetUnits = 0.1;
        return _this;
    }
    return FrameLayer;
}(CardLayer));
var ServantLayer = /** @class */ (function (_super) {
    __extends(ServantLayer, _super);
    function ServantLayer(id, stage, riyo, w, h) {
        if (id === void 0) { id = 1; }
        if (stage === void 0) { stage = 1; }
        if (riyo === void 0) { riyo = false; }
        if (w === void 0) { w = 512; }
        if (h === void 0) { h = 724; }
        var _this = _super.call(this, w, h) || this;
        _this.fgoId = id;
        _this.riyo = riyo;
        _this.stage = stage;
        if (_this.riyo) {
            _this.linkId = ("" + _this.fgoId).padStart(3, '0');
            _this.uri = "https://cors-anywhere.herokuapp.com/http://fate-go.cirnopedia.org/icons/chibi_servant_card/servant_" + _this.linkId + ".png";
        }
        else {
            _this.linkId = ("" + _this.fgoId + _this.stage).padStart(4, '0');
            _this.uri = "https://cors-anywhere.herokuapp.com/http://fate-go.cirnopedia.org/icons/servant_card/" + _this.linkId + ".jpg";
        }
        _this.texture = new THREE.TextureLoader().load(_this.uri);
        _this.texture.minFilter = THREE.LinearFilter;
        _this.material.map = _this.texture;
        _this.material.polygonOffset = true;
        _this.material.polygonOffsetFactor = 2;
        _this.material.polygonOffsetUnits = 0.1;
        _this.position.y = 50;
        return _this;
    }
    return ServantLayer;
}(CardLayer));
var EssenceLayer = /** @class */ (function (_super) {
    __extends(EssenceLayer, _super);
    function EssenceLayer(id, w, h) {
        if (id === void 0) { id = 1; }
        if (w === void 0) { w = 512; }
        if (h === void 0) { h = 874; }
        var _this = _super.call(this, w, h) || this;
        _this.fgoId = id;
        _this.linkId = ("" + _this.fgoId).padStart(3, '0');
        _this.uri = "https://cors-anywhere.herokuapp.com/http://fate-go.cirnopedia.org/icons/essence/craft_essence_" + _this.linkId + ".jpg";
        _this.texture = new THREE.TextureLoader().load(_this.uri);
        _this.texture.minFilter = THREE.LinearFilter;
        _this.material.map = _this.texture;
        _this.material.polygonOffset = true;
        _this.material.polygonOffsetFactor = 2;
        _this.material.polygonOffsetUnits = 0.1;
        return _this;
    }
    return EssenceLayer;
}(CardLayer));
var ReverseLayer = /** @class */ (function (_super) {
    __extends(ReverseLayer, _super);
    function ReverseLayer(type, rarity, w, h) {
        if (type === void 0) { type = Constants_1.TYPES.SERVANT; }
        if (rarity === void 0) { rarity = 1; }
        if (w === void 0) { w = 512; }
        if (h === void 0) { h = 874; }
        var _this = _super.call(this, w, h) || this;
        _this.fgoType = fgoTypeString(type);
        _this.rarity = rarity;
        switch (_this.rarity) {
            case 1:
            case 2:
            default:
                _this.color = 'bronze';
                break;
            case 3:
                _this.color = 'silver';
                break;
            case 4:
            case 5:
                _this.color = 'gold';
                break;
        }
        _this.uri = texturesDirectory + "/maps/cards/" + _this.fgoType + "/reverse/" + _this.color + ".png";
        _this.texture = new THREE.TextureLoader().load(_this.uri);
        _this.normalUri = texturesDirectory + "/normal_maps/cards/" + _this.fgoType + "/reverse/normal.png";
        _this.normalTexture = new THREE.TextureLoader().load(_this.normalUri);
        _this.texture.minFilter = THREE.LinearFilter;
        _this.material.map = _this.texture;
        _this.material.normalMap = _this.normalTexture;
        // this.material.side = THREE.BackSide
        _this.rotateY(Math.PI);
        return _this;
    }
    return ReverseLayer;
}(CardLayer));

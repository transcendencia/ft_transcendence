import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import {scene} from "./main.js";

let spaceShip;
let spaceShipLoaded = false;

const spaceShipLoader = new GLTFLoader();
spaceShipLoader.load(
    'spaceShip/scene.gltf',
    function(gltf) {
        spaceShip = gltf.scene;
        spaceShip.scale.set(1,1,1);
        spaceShip.position.set(0,0,-500);
        // spaceShip.add(wireframe1);
        
        scene.add(spaceShip);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        spaceShipLoaded = true;
    },
    function (error) {
        console.error(error);
    }
);

export {spaceShip, spaceShipLoaded};
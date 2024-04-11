
import * as THREE from 'three';
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { scene } from "./main.js";
import { setupPlanets } from "./planets.js";


let spaceShip;
let spaceShipLoaded = false;

const spaceShipLoader = new GLTFLoader();
spaceShipLoader.load(
    'spaceShip/scene.gltf',
    function(gltf) {
        spaceShip = gltf.scene;
        spaceShip.scale.set(0.1,0.1,0.1);
        spaceShip.position.set(0,0,-500);
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
    
let modelsData = [
    {name: 'arena', filePath: 'blender/arena.glb', loaded: false},
    {name: 'arenaRing', filePath: 'blender/arenaRing.glb', loaded: false},
    {name: 'settings', filePath: 'blender/settingsPlanet.glb', loaded: false},
    {name: 'settingsRing', filePath: 'blender/settingsPlanetRing.glb', loaded: false},
    {name: 'tournament', filePath: 'blender/tournamentPlanet.glb', loaded: false},
];
    
let models = [];
    
for (let i = 0; i < modelsData.length; i++) {
    const data = modelsData[i];
    const loader = new GLTFLoader();
    loader.load(
        data.filePath,
        function (gltf) {
            models[data.name] = gltf.scene;
            models[data.name].scale.set(10, 10, 10);
            models[data.name].position.set(0, 0, 0);
            scene.add(models[data.name]);
            data.loaded = true;
            if (modelsData.every(model => model.loaded) && spaceShipLoaded) {
                setupPlanets(models);
            }
        },
        function (xhr) {
            console.log(`${data.filePath}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
        },
        function (error) {
            console.error(`Error loading ${data.filePath}:`, error);
        }
    );
}


function allModelsLoaded() {
    // console.log(models);
    return modelsData.every(model => model.loaded) && spaceShipLoaded;
}

export { spaceShip, allModelsLoaded };

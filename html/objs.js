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
        spaceShip.scale.set(1,1,1);
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
    { filePath: 'arena.glb', loaded: false},
    { filePath: 'arenaRing.glb', loaded: false},
    { filePath: 'settingsPlanet.glb', loaded: false},
    { filePath: 'settingsPlanetRing.glb', loaded: false},
    { filePath: 'tournamentPlanet.glb', loaded: false},
];
    
let models = [];
    
for (let i = 0; i < modelsData.length; i++) {
    const data = modelsData[i];
    const loader = new GLTFLoader();
    loader.load(
        data.filePath,
        function (gltf) {
            models[i] = gltf.scene;
            models[i].scale.set(10, 10, 10);
            models[i].position.set(0, 0, 0);
            scene.add(models[i]);
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
    console.log(models);
    return modelsData.every(model => model.loaded) && spaceShipLoaded;
}

export { spaceShip, allModelsLoaded };

import * as THREE from "three"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from "./main.js";
import { setupPlanets } from "./planets.js";


export let spaceShip;
export let spaceShipInt;
let spaceShipLoaded = false;
let spaceShipIntLoaded = false;
let markerLoaded = false;

const objectLoader = new GLTFLoader();
objectLoader.load(
    '../static/html/assets/spaceShip/scene.gltf',
    function(gltf) {
        spaceShip = gltf.scene;
        spaceShip.scale.set(0.1,0.1,0.1);
        spaceShip.position.set(0,0,-1293.5);
        scene.add(spaceShip);
    },
    function(xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        spaceShipLoaded = true;
    },
    function (error) {
        console.error(error);
    }
);

export let marker;

objectLoader.load(
    '../static/html/assets/spaceShip/scene.gltf',
    function(gltf) {
        marker = gltf.scene;
        marker.scale.set(10,10,10);
        marker.position.set(0,400,0);
        scene.add(marker);
    },
    function(xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        markerLoaded = true;
    },
);
    

objectLoader.load(
    '../static/html/assets/blender/spaceshipInterior.glb',
    function(gltf) {
        spaceShipInt = gltf.scene;
        spaceShipInt.scale.set(1,1,1);
        spaceShipInt.position.set(0, 0.5, -1300);
        spaceShipInt.rotation.set(0,THREE.MathUtils.degToRad(180),THREE.MathUtils.degToRad(180));
        
        scene.add(spaceShipInt);
    },
    function(xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        spaceShipIntLoaded = true;
    },
    function (error) {
        console.error(error);
    }
    );

    export let alien1;
    let alienLoaded = false;
    export let mixer1;
    export let mixer2;
    export let mixer3;

objectLoader.load(
'../static/html/assets/blender/alienAnimationhat.glb',
function(gltf) {
    alien1 = gltf.scene;
    alien1.scale.set(0.3,0.3,0.3);
    alien1.position.set(2.7, 3.05, -1300.5);
    alien1.rotation.set(0,THREE.MathUtils.degToRad(210),0);
    scene.add(alien1);
    if (gltf.animations && gltf.animations.length > 1) {
        mixer1 = new THREE.AnimationMixer(alien1);
        let action1 = mixer1.clipAction(gltf.animations[1]);
        let action3 = mixer1.clipAction(gltf.animations[3]);
        let action4 = mixer1.clipAction(gltf.animations[0]);
        action1.play();
        setTimeout(() => {
            action1.crossFadeTo(action3, 1, true);
            action3.play();
            setTimeout(() => {
                action4.play();
                action3.crossFadeTo(action4, 3, true);
            }, 7700);
        }, 1500);
        
    }
},
function(xhr) {
    // console.log((xhr.loaded / xhr.total * 100) + '%loaded');
    alienLoaded = true;
},
function (error) {
    console.error(error);
}
);

export let alien2;

objectLoader.load(
'../static/html/assets/blender/alienAnimationberet.glb',
function(gltf) {
    alien2 = gltf.scene;
    alien2.scale.set(0.3,0.3,0.3);
    alien2.position.set(2.7, 3.05, -1300.5);
    alien2.rotation.set(0,THREE.MathUtils.degToRad(210),0);
    alien2.visible = false;
    scene.add(alien2);
    if (gltf.animations && gltf.animations.length > 1) {
    mixer2 = new THREE.AnimationMixer(alien2);
        let action1 = mixer2.clipAction(gltf.animations[1]);
        let action3 = mixer2.clipAction(gltf.animations[3]);
        let action4 = mixer2.clipAction(gltf.animations[0]);
        action1.play();
        setTimeout(() => {
            action3.play();
            action1.crossFadeTo(action3, 1, true);
            setTimeout(() => {
                action4.play();
                action3.crossFadeTo(action4, 3, true);
            }, 7700);
        }, 1100);
        
    }
},
function(xhr) {
    // console.log((xhr.loaded / xhr.total * 100) + '%loaded');
    alienLoaded = true;
},
function (error) {
    console.error(error);
}
);

export let alien3;

objectLoader.load(
    '../static/html/assets/blender/alienAnimationSombrero.glb',
    function(gltf) {
        alien3 = gltf.scene;
        alien3.scale.set(0.3,0.3,0.3);
        alien3.position.set(2.7, 3.05, -1300.5);
        alien3.rotation.set(0,THREE.MathUtils.degToRad(210),0);
        alien3.visible = false;
        scene.add(alien3);
        if (gltf.animations && gltf.animations.length > 1) {
        mixer3 = new THREE.AnimationMixer(alien3);
            let action1 = mixer3.clipAction(gltf.animations[1]);
            let action3 = mixer3.clipAction(gltf.animations[3]);
            let action4 = mixer3.clipAction(gltf.animations[0]);
            action1.play();
            setTimeout(() => {
                action3.play(); // Start the second animation
                action1.crossFadeTo(action3, 1, true);
                setTimeout(() => {
                    action4.play(); // Start the second animation
                    action3.crossFadeTo(action4, 3, true);
                }, 7700);
            }, 1100);
            
        }
    },
    function(xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        alienLoaded = true;
    },
    function (error) {
        console.error(error);
    }
    );

let modelsData = [
    {name: 'arena', filePath: '../static/html/assets/blender/arena.glb', loaded: false},
    {name: 'arenaRing', filePath: '../static/html/assets/blender/arenaRing.glb', loaded: false},
    {name: 'settings', filePath: '../static/html/assets/blender/settingsPlanet.glb', loaded: false},
    {name: 'settingsRing', filePath: '../static/html/assets/blender/settingsPlanetRing.glb', loaded: false},
    {name: 'tournament', filePath: '../static/html/assets/blender/tournamentPlanet.glb', loaded: false},
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
            // console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        },
        function (error) {
            console.error(`Error loading ${data.filePath}:`, error);
        }
    );
}


export function allModelsLoaded() {
    return modelsData.every(model => model.loaded) && spaceShipLoaded && spaceShipIntLoaded && markerLoaded;
}

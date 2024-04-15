import * as THREE from 'three';
import {spaceShip, allModelsLoaded} from "./objs.js";
import { addStar } from "./stars.js";
import { sun, planets, setupPlanets} from "./planets.js";
import { spaceShipMovement, camMovement} from './movement.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let gameStart = false;
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#c1')
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000020);
const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 2000 );
camera.position.set(0, 1, -495);

// Define the size of the minimap
const minimapWidth = 200; // Adjust as needed
const minimapHeight = 200;


// Create an orthographic camera for the minimap
const minimapCamera = new THREE.OrthographicCamera(
    -minimapWidth * 7,  // left
    minimapWidth * 7,   // right
    minimapHeight * 7,  // top
    -minimapHeight * 7, // bottom
    1,                // near
    2000              // far
    );
     
    minimapCamera.position.set(sun.position.x, sun.position.y + 1000, sun.position.z); // Position de la caméra (vue aérienne)
    
    // Créer une nouvelle instance de rendu pour la minimap
    const minimapRenderer = new THREE.WebGLRenderer();
    minimapRenderer.setSize(300, 300); // Taille de la minimap (à ajuster selon vos besoins)
    minimapRenderer.setClearColor(0x000000, 0); // Fond transparent
    
    // Ajouter la vue de la minimap à votre document HTML
    document.body.appendChild(minimapRenderer.domElement);
    
    const planeGeometry = new THREE.PlaneGeometry(2800, 2800);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000045 }); 
    const minimapBG = new THREE.Mesh(planeGeometry, planeMaterial);
    minimapBG.position.set(0, -500, 0); 
    minimapBG.rotation.x = -Math.PI / 2;
    scene.add(minimapBG);

    minimapBG.layers.set(1);
    minimapCamera.layers.enable(1);
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const playerMarker = new THREE.Mesh(sphereGeometry, sphereMaterial);
    playerMarker.scale.set(20,20,20);
    scene.add(playerMarker);
    // const camera1Helper = new THREE.CameraHelper(minimapCamera);

function renderMinimap() {
    if (!spaceShip)
        return;
    playerMarker.position.x = spaceShip.position.x;
    playerMarker.position.z = spaceShip.position.z;
    playerMarker.position.y = 500;
    minimapCamera.lookAt(sun.position);
    minimapRenderer.render(scene, minimapCamera);
}

// Add outline pass
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
const renderPass = new RenderPass( scene, camera );

const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    scene, 
    camera
    );
    outlinePass.visibleEdgeColor.set("#ffee00");
outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 1;
outlinePass.edgeThickness = 2;
composer.addPass(renderPass);
composer.addPass(outlinePass);

minimapRenderer.domElement.style.borderRadius = '100px'; // Adjust the radius as needed
// Position the minimap renderer
minimapRenderer.domElement.style.position = 'absolute';
minimapRenderer.domElement.style.top = '10px'; // Adjust vertical position as needed
minimapRenderer.domElement.style.right = '10px'; // Adjust horizontal position as needed

// Add the minimap renderer to the document body
document.body.appendChild(minimapRenderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const planetInfoText = document.getElementById('planetInfoText');
planetInfoText.textContent = '';
const enterPlanetText = document.getElementById('enterPlanetText');
enterPlanetText.textContent = 'Press [E] to start';

// LIGHTING
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.castShadow = true;
pointLight.position.copy(sun.position);
pointLight.scale.set(10, 10, 10);

const pointLight2 = new THREE.PointLight(0xffffff, 1.5)
pointLight2.castShadow = true;
pointLight2.position.set(0,5,-1300);
const lightHelperss = new THREE.PointLightHelper(pointLight2);

const spaceShipPointLight = new THREE.PointLight(0xffffff, 0.5)
spaceShipPointLight.castShadow = true;
const ambientLight = new THREE.AmbientLight(0Xffffff, 1);
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLight, ambientLight, lightHelper, spaceShipPointLight, lightHelperss, pointLight2);

Array(800).fill().forEach(addStar);

const raycaster = new THREE.Raycaster();

let cameraDirection = new THREE.Vector3();
camera.getWorldDirection(cameraDirection);
const rayLength = 3000; // Adjust as needed
let rayEndPoint = new THREE.Vector3();


function updateRay() {
    camera.getWorldDirection(cameraDirection);
    rayEndPoint.copy(cameraDirection).multiplyScalar(rayLength).add(camera.position);
    raycaster.set(camera.position, cameraDirection); // Update raycaster with new direction
}

// const rayGeometry = new THREE.BufferGeometry().setFromPoints([camera.position, rayEndPoint]);
// const rayMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red color
// const rayLine = new THREE.Line(rayGeometry, rayMaterial);

// // Add the ray line to the scene
// scene.add(rayLine);

function displayRay() {
    rayLine.geometry.attributes.position.setXYZ(0, camera.position.x, camera.position.y, camera.position.z); // Update starting point
    rayLine.geometry.attributes.position.setXYZ(1, rayEndPoint.x, rayEndPoint.y, rayEndPoint.z); // Update endpoint
    rayLine.geometry.attributes.position.needsUpdate = true;
}


let inRange = false;
let cursorOnPlanet = false;

function resetOutlineAndText() {
    planetInfoText.textContent = '';
    enterPlanetText.textContent = '';
    outlinePass.selectedObjects = [];
    cursorOnPlanet = false;
}

function getPlanetIntersection() {
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const aimedObj = intersects[0].object;
        if (!aimedObj.planet)
            return;
        if (!cursorOnPlanet) {
            outlinePass.selectedObjects = [];
            if (aimedObj.planet) {
                outlinePass.selectedObjects = [aimedObj];
                planetInfoText.textContent = aimedObj.planet.desc;
            }
            cursorOnPlanet = true;
        }
        else if (cursorOnPlanet) {
            if (aimedObj.planet.name != outlinePass.selectedObjects[0].planet.name)
                resetOutlineAndText();
            spaceShipInRange(aimedObj);
        }
    }
    else if (intersects.length === 0 && cursorOnPlanet)
        resetOutlineAndText();
}

function spaceShipInRange(obj) {
    if (obj.planet) { 
        if (spaceShip.position.distanceTo(obj.position) < 4 * obj.planet.scale && !inRange) {       
            outlinePass.visibleEdgeColor.set("#00ff00");
            enterPlanetText.textContent = 'Press [E] to land on ' + obj.planet.name;
            inRange = true;
        }
        else if (spaceShip.position.distanceTo(obj.position) >= 4 * obj.planet.scale && inRange) {
            outlinePass.visibleEdgeColor.set("#ffee00");
            enterPlanetText.textContent = '';
            inRange = false;
        }
    }
}

function planetMovement() {
    planets.forEach(planet => {
        planet.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
        planet.hitbox.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
        if (planet.name === 'Settings changer') {
            planet.mesh.rotation.y += planet.orbitSpeed + 0.005;
            planet.orbitMesh.rotation.x += planet.orbitSpeed;
        }
        if (planet.name === 'The tournament™') {
            planet.mesh.rotation.x += planet.orbitSpeed  * 4;
            planet.mesh.rotation.y += planet.orbitSpeed * 4;
        }
        if (planet.name === 'Pong arena') {
            planet.mesh.rotation.x += planet.orbitSpeed  * 4;
            planet.mesh.rotation.y += planet.orbitSpeed * 4;
            planet.orbitMesh.rotation.x += planet.orbitSpeed  * 4;
            planet.orbitMesh.rotation.y += planet.orbitSpeed * 4;
        }
        if (planet.orbitMesh != null) {
            planet.orbitMesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
            planet.orbitMesh.rotation.y += planet.orbitSpeed + 0.01;
        }
    });
}


document.addEventListener('keydown', (event) => { 
    if (event.key === 'e' && !gameStart)
        gameStart = true;
});
function update() {
    // displayRay();
    planetMovement();
    camMovement();
    if (!gameStart)
        return;
    updateRay(); 
    getPlanetIntersection();
    spaceShipMovement();
}

// Bloom Pass
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0.1;
bloomPass.strength = 1;
bloomPass.radius = 0.5;
// composer.addPass(bloomPass);

function animate()
{
    requestAnimationFrame( animate )
    // controls.update();
    // UPDATE CAMERA POSITION TO BEHIND THE spaceShip
    renderMinimap(); // Rendu de la minimap
    update();
    composer.render();
    // renderer.render(scene, camera);
}

const checkModelsLoaded = setInterval(() => {
    if (allModelsLoaded()) {
        clearInterval(checkModelsLoaded);
        animate();
        camMovement();
    }
}, 100);

export {scene, THREE, camera, spaceShip, spaceShipPointLight}
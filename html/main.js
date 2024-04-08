import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import {spaceShip, allModelsLoaded} from "./objs.js";
import { addStar } from "./stars.js";
import { sun, planets, setupPlanets} from "./planets.js";

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#c1')
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 2000 );
camera.position.set(0, 1, -495);

// Define the size of the minimap
const minimapWidth = 200; // Adjust as needed
const minimapHeight = 200;

// Create an orthographic camera for the minimap
const minimapCamera = new THREE.OrthographicCamera(
    -minimapWidth * 6,  // left
    minimapWidth * 6,   // right
    minimapHeight * 6,  // top
    -minimapHeight * 6, // bottom
    1,                // near
    1000              // far
);

minimapCamera.position.set(sun.position.x, sun.position.y + 1000, sun.position.z); // Position de la caméra (vue aérienne)

// Créer une nouvelle instance de rendu pour la minimap
const minimapRenderer = new THREE.WebGLRenderer();
minimapRenderer.setSize(200, 200); // Taille de la minimap (à ajuster selon vos besoins)
minimapRenderer.setClearColor(0x000000, 0); // Fond transparent

// Ajouter la vue de la minimap à votre document HTML
document.body.appendChild(minimapRenderer.domElement);

// const camera1Helper = new THREE.CameraHelper(minimapCamera);
// scene.add(camera1Helper);

function renderMinimap() {
    minimapCamera.lookAt(sun.position);
    minimapRenderer.render(scene, minimapCamera);
}

// Set the CSS style for the minimap renderer DOM element
minimapRenderer.domElement.style.border = '2px solid white'; // Add a white border

// Position the minimap renderer
minimapRenderer.domElement.style.position = 'absolute';
minimapRenderer.domElement.style.top = '10px'; // Adjust vertical position as needed
minimapRenderer.domElement.style.right = '10px'; // Adjust horizontal position as needed

// Add the minimap renderer to the document body
document.body.appendChild(minimapRenderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// LIGHTING
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.castShadow = true;
pointLight.position.copy(sun.position);
pointLight.scale.set(10,10,10);

const spaceShipPointLight = new THREE.PointLight(0xffffff, 0.5)
spaceShipPointLight.castShadow = true;
const lightHelperss = new THREE.PointLightHelper(spaceShipPointLight);
lightHelperss.scale.set(10,10,10);

const ambientLight = new THREE.AmbientLight(0Xffffff, 1);
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLight, ambientLight, lightHelper, spaceShipPointLight);


// //HELPERS
// const gridHelper = new THREE.GridHelper(10000, 100); // size: 100, divisions: 10
// gridHelper.material.color.set(0xffffff); // Set grid color to white
// scene.add(gridHelper);
// CONTROLS
// const controls = new OrbitControls(camera, renderer.domElement);


// const geometry1 = new THREE.BoxGeometry(2, 1, 4);
// const edges1 = new THREE.EdgesGeometry(geometry1); // Get edges of the geometry
// const lineMaterial1 = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Line material for wireframe
// const wireframe1 = new THREE.LineSegments(edges1, lineMaterial1); // Create line segments
// wireframe1.position.y = 0.8;
// scene.add(wireframe1); // Add wireframe to scene

// const geometry2 = new THREE.BoxGeometry(2, 1, 4);
// const edges2 = new THREE.EdgesGeometry(geometry2); // Get edges of the geometry
// const lineMaterial2 = new THREE.LineBasicMaterial({ color: 0x00ff00}); // Line material for wireframe
// const wireframe2 = new THREE.LineSegments(edges2, lineMaterial2); // Create line segments
// wireframe2.position.y = 0.8;
// scene.add(wireframe2);


Array(800).fill().forEach(addStar);

let leftArrowPressed = false;
let rightArrowPressed = false;
let upArrowPressed = false;
let downArrowPressed = false;
let spaceKeyPressed = false;
let wKeyPressed = false;
let aKeyPressed = false;
let sKeyPressed = false;
let dKeyPressed = false;

let aKeyIsPressed =false;

// Event listeners for arrow key presses
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft')
    leftArrowPressed = true;
if (event.key === 'ArrowRight')
rightArrowPressed = true;
if (event.key === 'ArrowUp')
upArrowPressed = true;
if (event.key === 'ArrowDown')
downArrowPressed = true;
if (event.key === 'w')
wKeyPressed = true;
if (event.key === 'a')
aKeyPressed = true;
if (event.key === 's')
sKeyPressed = true;    
if (event.key === 'd')
dKeyPressed = true;
if (event.key === '1')
spaceKeyPressed = true;
aKeyIsPressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        leftArrowPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightArrowPressed = false;
    }
    if (event.key === 'ArrowUp') {
        upArrowPressed = false;
    }
    if (event.key === 'ArrowDown') {
        downArrowPressed = false;
    }
    if (event.key === 'w')
    wKeyPressed = false;
if (event.key === 'a')
aKeyPressed = false;
if (event.key === 's')
sKeyPressed = false;    
if (event.key === 'd')
dKeyPressed = false;
if (event.key === '1')
spaceKeyPressed = false;
});



document.addEventListener('keypress', (event) => {
    if (event.key === '1' && distance >= camMaxDist) {
        goToFirstPerson = true;
    }
    if (event.key === '1' && distance <= camMinDist) {
        goToThirdPerson = true;
    }
    if (event.key === ' ' && !boost) {
        startBoost(); 
    }
})

let camMinDist = -5;
let camMaxDist = 100;
let distance = camMinDist;
let height = 1;
let moveSpeed = 10;
let rotSpeed = 0.10;
const tolerance = 0.01; 


function rotateSpaceShipAnim(targetRot) {
    const tolerance = 0.01;
    if (Math.abs(spaceShip.rotation.z - targetRot) > tolerance) {
        if (spaceShip.rotation.z > targetRot)
        spaceShip.rotation.z -= rotSpeed;
    else if (spaceShip.rotation.z < targetRot)
        spaceShip.rotation.z += rotSpeed;
}}

let boost = false;
const boostDuration = 500; 
let originalMoveSpeed; 

function startBoost() {
    originalMoveSpeed = moveSpeed;
    moveSpeed *= 2;
    boost = true;
    setTimeout(endBoost, boostDuration);
}

function endBoost() {
    moveSpeed = originalMoveSpeed;
    boost = false;
}

function spaceShipMovement() {
    if (upArrowPressed || wKeyPressed) {
        spaceShip.position.x += Math.sin(spaceShip.rotation.y) * moveSpeed;
        spaceShip.position.z += Math.cos(spaceShip.rotation.y) * moveSpeed;
        if (!leftArrowPressed && !rightArrowPressed && !aKeyPressed && !dKeyPressed)
            rotateSpaceShipAnim(0);
    }
    if (downArrowPressed || sKeyPressed) {
        spaceShip.position.x -= Math.sin(spaceShip.rotation.y) * moveSpeed;
        spaceShip.position.z -= Math.cos(spaceShip.rotation.y) * moveSpeed;
        if (!leftArrowPressed && !rightArrowPressed && !aKeyPressed && !dKeyPressed)
            rotateSpaceShipAnim(0);
    }
    if (leftArrowPressed || aKeyPressed) {
        if (downArrowPressed || sKeyPressed) {
            spaceShip.rotation.y -= 0.05;
        }
        else 
            spaceShip.rotation.y += 0.05;
        rotateSpaceShipAnim(-0.80);
    }
    if (rightArrowPressed || dKeyPressed) {
        if (downArrowPressed || sKeyPressed)
            spaceShip.rotation.y += 0.05;
        else 
            spaceShip.rotation.y -= 0.05;
        rotateSpaceShipAnim(0.80);

    }
    camera.position.copy(new THREE.Vector3(spaceShip.position.x - distance * Math.sin(spaceShip.rotation.y), height, spaceShip.position.z - distance * Math.cos(spaceShip.rotation.y)));
    spaceShipPointLight.position.copy(spaceShip.position);
}


let goToFirstPerson = false;
let goToThirdPerson = false;

function update() {
    planets.forEach(planet => {
        planet.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
        if (planet.scale === 50) { 
            planet.mesh.rotation.y += planet.orbitSpeed * 2;
            planet.orbitMesh.rotation.x += planet.orbitSpeed / 3;
        }
        if (planet.orbitMesh != null) {
            planet.orbitMesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
            planet.orbitMesh.rotation.y += planet.orbitSpeed;
        }
    });
    if (aKeyIsPressed)
        spaceShipMovement();
    if (goToFirstPerson && distance > camMinDist){
        distance -= 10;
        height -= 4;
        camera.position.copy(new THREE.Vector3(spaceShip.position.x - distance * Math.sin(spaceShip.rotation.y), height, spaceShip.position.z - distance * Math.cos(spaceShip.rotation.y)));
    }
    if (goToThirdPerson && distance < camMaxDist){
        distance += 10;
        height += 4;
        camera.position.copy(new THREE.Vector3(spaceShip.position.x - distance * Math.sin(spaceShip.rotation.y), height, spaceShip.position.z - distance * Math.cos(spaceShip.rotation.y)));
    }
    if (distance <= camMinDist && goToFirstPerson)
        goToFirstPerson = false;
    if (distance >= camMaxDist && goToThirdPerson)
        goToThirdPerson = false;
    camera.rotation.y = spaceShip.rotation.y - Math.PI;
}

function animate()
{
    requestAnimationFrame( animate )
    // controls.update();
    // UPDATE CAMERA POSITION TO BEHIND THE spaceShip
    renderMinimap(); // Rendu de la minimap
    update();
    renderer.render( scene, camera );
}

const checkModelsLoaded = setInterval(() => {
    if (allModelsLoaded()) {
        clearInterval(checkModelsLoaded);
        animate();
    }
}, 100);

export {scene, THREE};

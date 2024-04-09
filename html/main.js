import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import {spaceShip, allModelsLoaded} from "./objs.js";
import { addStar } from "./stars.js";
import { sun, planets, setupPlanets} from "./planets.js";
import { spaceShipMovement, changePov } from './movement.js';

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#c1')
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000020);
const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 2000 );
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
    playerMarker.position.x = spaceShip.position.x;
    playerMarker.position.z = spaceShip.position.z;
    playerMarker.position.y = 500;
    minimapCamera.lookAt(sun.position);
    minimapRenderer.render(scene, minimapCamera);
}

// Create a div element for the dot
const dotElement = document.createElement('div');

// Apply CSS styles to the dot
dotElement.style.width = '5px';
dotElement.style.height = '5px';
dotElement.style.backgroundColor = 'white';
dotElement.style.opacity = '40%';
dotElement.style.borderRadius = '50%'; // Make it round
dotElement.style.position = 'fixed'; // Position fixed so it stays in the middle of the screen
dotElement.style.top = '50%'; // Position in the middle vertically
dotElement.style.left = '50%'; // Position in the middle horizontally
dotElement.style.transform = 'translate(-50%, -50%)'; // Center the dot precisely

const textElement = document.createElement('div');
document.body.appendChild(dotElement);

// Set the text content and style
textElement.textContent = '';
textElement.style.color = '#aaaaaa';
textElement.style.position = 'absolute';
textElement.style.top = '35%';
textElement.style.right = '6%'; // Align to the right

document.body.appendChild(textElement);

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

function update() {
    // displayRay();
    updateRay(); 
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const firstIntersectedObject = intersects[0].object;
        if (firstIntersectedObject.planet)
            textElement.textContent = firstIntersectedObject.planet.name + ' planet';
        else textElement.textContent = 'The sun';
    }
    else if (textElement.textContent != '') 
        textElement.textContent = '';

    planets.forEach(planet => {
        planet.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
        planet.hitbox.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);

        if (planet.name === 'settings') {
            planet.mesh.rotation.y += planet.orbitSpeed + 0.005;
            planet.orbitMesh.rotation.x += planet.orbitSpeed;
        }
        if (planet.name === 'tournament') {
            planet.mesh.rotation.x += planet.orbitSpeed  * 4;
            planet.mesh.rotation.y += planet.orbitSpeed * 4;
        }
        if (planet.name === 'arena') {
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
    spaceShipMovement();
    changePov();
}

function animate()
{
    requestAnimationFrame( animate )
    // controls.update();
    // UPDATE CAMERA POSITION TO BEHIND THE spaceShip
    renderMinimap(); // Rendu de la minimap
    update();
    renderer.render(scene, camera);
}

const checkModelsLoaded = setInterval(() => {
    if (allModelsLoaded()) {
        clearInterval(checkModelsLoaded);
        animate();
    }
}, 100);

export {scene, THREE, camera, spaceShip, spaceShipPointLight}
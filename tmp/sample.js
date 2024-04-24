// import * as THREE from 'three';
// script.js

// Define variables
let scene, camera, renderer, cube;

// Initialize Three.js scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    // Load texture image
    const sceneTextureLoader = new THREE.TextureLoader();
    const sceneTexture = sceneTextureLoader.load('sunset.jpg');
    scene.background = sceneTexture;

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create cube
    const geometry = new THREE.SphereGeometry(15, 32, 16);
   
    // Load texture image
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('Hungry-Dog-meme-5.jpg');

    // Create material with texture
    const material = new THREE.MeshBasicMaterial({ map: texture }); 
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // Make the screen full screen
    document.documentElement.requestFullscreen();
}

// Define variables
let leftArrowPressed = false;
let rightArrowPressed = false;
let upArrowPressed = false;
let downArrowPressed = false;
let pKeyPressed = false;
let oKeyPressed = false;
let wKeyPressed = false;
let sKeyPressed = false;

// Event listeners for arrow key presses
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        leftArrowPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightArrowPressed = true;
    }
    if (event.key === 'ArrowUp') {
        upArrowPressed = true;
    }
    if (event.key === 'ArrowDown') {
        downArrowPressed = true;
    }
    if (event.key === 'p') {
        pKeyPressed = true;
    }
    if (event.key === 'o') {
        oKeyPressed = true;
    }
    if (event.key === 'w') {
        wKeyPressed = true;
    }
    if (event.key === 's') {
        sKeyPressed = true;
    }
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
    if (event.key === 'p') {
        pKeyPressed = false;
    }
    if (event.key === 'o') {
        oKeyPressed = false;
    }
    if (event.key === 'w') {
        wKeyPressed = false;
    }
    if (event.key === 's') {
        sKeyPressed = false;
    }
});

// Update function to rotate the cube
function update() {
    if (leftArrowPressed) {
        cube.rotation.y += 0.04;
        cube.position.x -= 0.04;
    }
    if (rightArrowPressed) {
        cube.rotation.y -= 0.04;
        cube.position.x += 0.04;
    }
    if (upArrowPressed) {
        cube.rotation.x += 0.04;
        cube.position.y += 0.04;
    }
    if (downArrowPressed) {
        cube.rotation.x -= 0.04;
        cube.position.y -= 0.04;
    }
    if (pKeyPressed) {
        cube.position.z += 0.4;
    }
    if (oKeyPressed) {
        cube.position.z -= 0.4;
    }
    if (wKeyPressed) {
        camera.position.z -= 0.04;
    }
    if (sKeyPressed) {
        camera.position.z += 0.04;
    }
}

// Render loop
function animate() {
    requestAnimationFrame(animate);

    // Update cube rotation
    update();

    renderer.render(scene, camera);
}


// Initialize and start rendering
init();
animate();

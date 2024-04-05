//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// For animation thingys
// import { TWEEN } from "https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151515);
const aspectRatio = 0.5 * window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000 );
camera.position.set(0, 3, 0);
const camera1 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000 );
camera1.position.set(0, 3, 0);
const cameraHelper = new THREE.CameraHelper(camera);
const camera1Helper = new THREE.CameraHelper(camera1);
// scene.add(cameraHelper, camera1Helper);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#c1')
});

const renderer1 = new THREE.WebGLRenderer({
    canvas: document.querySelector('#c2')
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth / 2, window.innerHeight);
renderer.render(scene, camera);

renderer1.setPixelRatio(window.devicePixelRatio);
renderer1.setSize(window.innerWidth / 2, window.innerHeight); // Set width to half of window width
renderer1.render(scene, camera1);

// TORUS
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({color:0xFF6347, wireframe:true});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// LIGHTING
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.castShadow = true;
const topLight = new THREE.DirectionalLight(0xff00ff, 3)
topLight.position.set(500, 500, 500) //top-left-ish
pointLight.position.set(5,5,5)
const ambientLight = new THREE.AmbientLight(0Xffffff, 1);
scene.add(pointLight, ambientLight, topLight);

//HELPERS
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(1000, 500, 0, 0xAA00ff);
scene.add(lightHelper, gridHelper);

// CONTROLS
// const controls = new OrbitControls(camera, renderer.domElement);

let redCar;
let purpleCar;
let moon;

// BLENDER MODELS

let redCarLoaded = false;
let purpleCarLoaded = false;
let moonLoaded = false;
let sunLoaded = true;

const redCarLoader = new GLTFLoader();
redCarLoader.load(
    'voitureViolette/scene.gltf',
    function(gltf) {
        redCar = gltf.scene;
        redCar.scale.set(3,3,3);
        scene.add(redCar);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        redCarLoaded = true;
    },
    function (error) {
        console.error(error);
    }
);

const purpleCarLoader = new GLTFLoader();
purpleCarLoader.load(
    'voitureRouge/scene.gltf',
    function(gltf) {
        purpleCar = gltf.scene;
        purpleCar.scale.set(3,3,3);
        scene.add(purpleCar);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        purpleCarLoaded = true;
    },
    function (error) {
        console.error(error);
    }
);

const moonLoader = new GLTFLoader();
moonLoader.load(
    'moon/scene.gltf',
    function(gltf) {
        moon = gltf.scene;
        moon.scale.set(400,400,400);
        scene.add(moon);
        moon.position.set(250, 250, 250);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        moonLoaded = true;
    },
    function (error) {
        console.error(error);
    }
)

const sunLoader = new GLTFLoader();
sunLoader.load(
    'sun/scene.gltf',
    function(gltf) {
        const sun = gltf.scene;
        sun.scale.set(400,400,400);
        scene.add(sun);
        sun.position.set(10, 10, 10);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
        sunLoaded = true;
    },
    function (error) {
        console.error(error);
    }
)

function allModelsLoaded() {
    console.log(redCarLoaded, purpleCarLoaded, moonLoaded, sunLoaded);
    return redCarLoaded && purpleCarLoaded && moonLoaded && sunLoaded;
}

// STARS
function addStar(){
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color:0xffffff})
    const star = new THREE.Mesh( geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 1000 ));

    star.position.set(x, y, z);
    scene.add(star)
}


Array(800).fill().forEach(addStar)

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
    if (event.key === ' ')
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
    if (event.key === ' ')
        spaceKeyPressed = false;
    // aKeyIsPressed = false;
});

document.addEventListener('keypress', (event) => {
    if (event.key === ' ' && distance1 === 40) {
        console.log("a");
        goToFirstPerson = true;
    }
    if (event.key === ' ' && distance1 === 0) {
       console.log("b");
        goToThirdPerson = true;
    }
    aKeyIsPressed = true;
})

// Update camera position and orientation to follow the car
let distance1 = 0; // Distance1 of the camera from the car (adjust as needed)
let height1 = 3;
let distance2 = 0;
let height2 = 3;

function redCarMovement() {
    if (upArrowPressed) {
        redCar.position.x += Math.sin(redCar.rotation.y);
        redCar.position.z += Math.cos(redCar.rotation.y);
    }
    if (downArrowPressed) {
        redCar.position.x -= Math.sin(redCar.rotation.y);
        redCar.position.z -= Math.cos(redCar.rotation.y);

    }
    if (leftArrowPressed) {
        if (downArrowPressed)
            redCar.rotation.y -= 0.05;
        else 
            redCar.rotation.y += 0.05;
    }
    if (rightArrowPressed) {
        if (downArrowPressed)
            redCar.rotation.y += 0.05;
        else 
            redCar.rotation.y -= 0.05;
    }
    camera.position.copy(new THREE.Vector3(redCar.position.x - distance1 * Math.sin(redCar.rotation.y), height1, redCar.position.z - distance1 * Math.cos(redCar.rotation.y)));
}

function purpleCarMovement() {
    if (wKeyPressed) {
        purpleCar.position.x += Math.sin(purpleCar.rotation.y);
        purpleCar.position.z += Math.cos(purpleCar.rotation.y);
    }
    if (sKeyPressed) {
        purpleCar.position.x -= Math.sin(purpleCar.rotation.y);
        purpleCar.position.z -= Math.cos(purpleCar.rotation.y);

    }
    if (aKeyPressed) {
        if (sKeyPressed)
            purpleCar.rotation.y -= 0.05;
        else 
            purpleCar.rotation.y += 0.05;
    }
    if (dKeyPressed) {
        if (sKeyPressed)
            purpleCar.rotation.y += 0.05;
        else 
            purpleCar.rotation.y -= 0.05;
    }
    camera1.position.copy(new THREE.Vector3(purpleCar.position.x - distance2 * Math.sin(purpleCar.rotation.y), height2, purpleCar.position.z - distance2 * Math.cos(purpleCar.rotation.y)));
}

let goToFirstPerson = false;
let goToThirdPerson = false;

function update() {
    // Update car position and rotation
    // if (height1 == 3)
    //     camera.position.copy(new THREE.Vector3(redCar.position.x - distance1 * Math.sin(redCar.rotation.y), height1, redCar.position.z - distance1 * Math.cos(redCar.rotation.y)));
    // if (height2 == 3)
    //     camera1.position.copy(new THREE.Vector3(purpleCar.position.x - distance2 * Math.sin(purpleCar.rotation.y), height1, purpleCar.position.z - distance2 * Math.cos(purpleCar.rotation.y)));
        
    if (aKeyIsPressed)
    {
        purpleCarMovement();
        redCarMovement();
    }
    if (goToFirstPerson && distance1 != 0){
        distance1 -= 1;
        distance2 -= 1;
        height1 -= 0.2;
        height2 -= 0.2;
        camera.position.copy(new THREE.Vector3(redCar.position.x - distance1 * Math.sin(redCar.rotation.y), height1, redCar.position.z - distance1 * Math.cos(redCar.rotation.y)));
        camera1.position.copy(new THREE.Vector3(purpleCar.position.x - distance2 * Math.sin(purpleCar.rotation.y), height2, purpleCar.position.z - distance2 * Math.cos(purpleCar.rotation.y)));
    }
    if (goToThirdPerson && distance1 != 40){
        distance1 += 1;
        distance2 += 1;
        height1 += 0.2;
        height2 += 0.2;
        camera.position.copy(new THREE.Vector3(redCar.position.x - distance1 * Math.sin(redCar.rotation.y), height1, redCar.position.z - distance1 * Math.cos(redCar.rotation.y)));
        camera1.position.copy(new THREE.Vector3(purpleCar.position.x - distance2 * Math.sin(purpleCar.rotation.y), height2, purpleCar.position.z - distance2 * Math.cos(purpleCar.rotation.y)));
    }
    if (distance1 === 0 && goToFirstPerson)
        goToFirstPerson = false;
    if (distance1 === 40 && goToThirdPerson)
        goToThirdPerson = false;
    // Set the camera's position and orientation
    // camera.position.copy(new THREE.Vector3(redCar.position.x, 3, redCar.position.z));
    // camera.applyQuaternion(redCar.quaternion);
    camera.rotation.y = redCar.rotation.y - Math.PI; // Rotate the camera to look behind the car
    camera1.rotation.y = purpleCar.rotation.y - Math.PI;
    moon.rotation.x += 0.01;
    moon.rotation.z += 0.01;
}

function animate()
{
    requestAnimationFrame( animate )
    // controls.update();
    torus.rotation.x += 0.05;
    // UPDATE CAMERA POSITION TO BEHIND THE redCar
    update();
    renderer1.render( scene, camera1 );
    renderer.render( scene, camera );
}
if (allModelsLoaded()) {
    animate();
} else {
    const checkModelsLoaded = setInterval(() => {
        if (allModelsLoaded()) {
            clearInterval(checkModelsLoaded);
            animate();
        }
    }, 100);
}

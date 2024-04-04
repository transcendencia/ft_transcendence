//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// For animation thingys
// import { TWEEN } from "https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

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

// BLENDER MODEL
const redCarLoader = new GLTFLoader();
redCarLoader.load(
    'voitureRouge/scene.gltf',
    function(gltf) {
        redCar = gltf.scene;
        redCar.scale.set(3,3,3);
        scene.add(redCar);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
    },
    function (error) {
        console.error(error);
    }
);

const purpleCarLoader = new GLTFLoader();
purpleCarLoader.load(
    'voitureViolette/scene.gltf',
    function(gltf) {
        purpleCar = gltf.scene;
        purpleCar.scale.set(3,3,3);
        scene.add(purpleCar);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
    },
    function (error) {
        console.error(error);
    }
);

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
    if (event.key === ' ' && distance === 40) {
        console.log("a");
        goToFirstPerson = true;
    }
    if (event.key === ' ' && distance === 0) {
       console.log("b");
        goToThirdPerson = true;
    }
    aKeyIsPressed = true;
})

// Update camera position and orientation to follow the car
let distance = 0; // Distance of the camera from the car (adjust as needed)
let height = 3;


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
    camera.position.copy(new THREE.Vector3(redCar.position.x - distance * Math.sin(redCar.rotation.y), height, redCar.position.z - distance * Math.cos(redCar.rotation.y)));
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
}

let goToFirstPerson = false;
let goToThirdPerson = false;

function update() {
    // Update car position and rotation
    console.log(goToThirdPerson);
    if (height == 3)
        camera.position.copy(new THREE.Vector3(redCar.position.x - distance * Math.sin(redCar.rotation.y), height, redCar.position.z - distance * Math.cos(redCar.rotation.y)));
    if (aKeyIsPressed)
    {
        purpleCarMovement();
        redCarMovement();
    }
    if (goToFirstPerson && distance != 0){
        distance -= 1;
        height -= 0.2;
        camera.position.copy(new THREE.Vector3(redCar.position.x - distance * Math.sin(redCar.rotation.y), height, redCar.position.z - distance * Math.cos(redCar.rotation.y)));
    }
    if (goToThirdPerson && distance != 40){
        distance += 1;
        height += 0.2;
        camera.position.copy(new THREE.Vector3(redCar.position.x - distance * Math.sin(redCar.rotation.y), height, redCar.position.z - distance * Math.cos(redCar.rotation.y)));
    }
    if (distance === 0 && goToFirstPerson)
        goToFirstPerson = false;
    if (distance === 40 && goToThirdPerson)
        goToThirdPerson = false;
    // Set the camera's position and orientation
    // camera.position.copy(new THREE.Vector3(redCar.position.x, 3, redCar.position.z));
    // camera.applyQuaternion(redCar.quaternion);
    camera.rotation.y = redCar.rotation.y - Math.PI; // Rotate the camera to look behind the car
}

function animate()
{
    requestAnimationFrame( animate )
    // controls.update();
    torus.rotation.x += 0.05;
    // UPDATE CAMERA POSITION TO BEHIND THE redCar
    update();
    renderer.render( scene, camera );
}
animate();

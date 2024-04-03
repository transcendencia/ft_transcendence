//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
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
const geometry = new THREE.TorusKnotGeometry(10, 3, 16, 100)
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
const controls = new OrbitControls(camera, renderer.domElement);

let object;

// BLENDER MODEL
const loader = new GLTFLoader();
loader.load(
    'voiture/scene.gltf',
    function(gltf) {
        object = gltf.scene;
        object.scale.set(3,3,3);
        scene.add(object);
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
    if (event.key === 's') {
        sKeyPressed = false;
    }
});

function update() {
    // Update car position and rotation
    if (upArrowPressed) {
        object.position.x += Math.sin(object.rotation.y);
        object.position.z += Math.cos(object.rotation.y);
    }
    if (downArrowPressed) {
        object.position.x -= Math.sin(object.rotation.y);
        object.position.z -= Math.cos(object.rotation.y);

    }
    if (leftArrowPressed) {
        if (downArrowPressed)
            object.rotation.y -= 0.05;
        else 
            object.rotation.y += 0.05;
    }
    if (rightArrowPressed) {
        if (downArrowPressed)
            object.rotation.y += 0.05;
        else 
            object.rotation.y -= 0.05;
    }
    // Update camera position and orientation to follow the car
    const distance = 40; // Distance of the camera from the car (adjust as needed)

    // Set the camera's position and orientation
    camera.position.copy(new THREE.Vector3(object.position.x - distance * Math.sin(object.rotation.y), 10, object.position.z - distance * Math.cos(object.rotation.y)));
    // camera.applyQuaternion(object.quaternion);
    camera.rotation.y = object.rotation.y - Math.PI; // Rotate the camera to look behind the car
}

function animate()
{
    requestAnimationFrame( animate )
    // controls.update();
    // UPDATE CAMERA POSITION TO BEHIND THE OBJECT
    update();
    renderer.render( scene, camera );
}
animate();

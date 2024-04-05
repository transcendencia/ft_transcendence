//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// For animation thingys
// import { TWEEN } from "https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


// CAMERA RENDERER AND SCENE //
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151515);
const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(75, aspectRatio);
const cameraRight = new THREE.PerspectiveCamera(95, aspectRatio / 2, 0.1, 1000 );
const cameraLeft = new THREE.PerspectiveCamera(95, aspectRatio / 2, 0.1, 1000 );
camera.position.set(20, 20, 0);


//RENDERERS
const renderer = new THREE.WebGLRenderer({ // Renderer for full screen
    canvas: document.querySelector('#c1')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const renderer1 = new THREE.WebGLRenderer({ // Renderer for split screen
    canvas: document.querySelector('#c1')
});
renderer1.setPixelRatio(window.devicePixelRatio);
renderer1.setSize(window.innerWidth / 2, window.innerHeight);
renderer1.render(scene, cameraRight);

const renderer2 = new THREE.WebGLRenderer({ // Renderer for split screen
    canvas: document.querySelector('#c2')
})
renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.setSize(window.innerWidth / 2, window.innerHeight); // Set width to half of window width
renderer2.render(scene, cameraLeft);

// TORUS THINGY (VERY IOMPORTNATNT)
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({color:0xFFFFFF, wireframe:true});
const torus = new THREE.Mesh(geometry, material);
// scene.add(torus);

//STARS
function addStar(){
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color:0xffffff})
    const star = new THREE.Mesh( geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 1000 ));
    
    star.position.set(x, y, z);
    scene.add(star)
}


Array(800).fill().forEach(addStar)



// HELPERS
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const gridHelper = new THREE.GridHelper(1000, 500, 0,  0xAA00ff);
const axesHelper = new THREE.AxesHelper(50); // Length of axes
const rightHelper = new THREE.CameraHelper(cameraRight);
const leftHelper = new THREE.CameraHelper(cameraLeft);
scene.add(axesHelper);
scene.add(gridHelper, ambientLight);


// VIEW UTILS
const controls = new OrbitControls(camera, renderer.domElement);
let leftArrowPressed = false;
let rightArrowPressed = false;
let upArrowPressed = false;
let downArrowPressed = false;
let spaceKeyPressed = false;
let wKeyPressed = false;
let aKeyPressed = false;
let sKeyPressed = false;
let dKeyPressed = false;
let cKeyPressed = false;

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
    if (event.key === 'c')
        cKeyPressed = true;
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
    if (event.key === 'c')
        cKeyPressed = false;
});

function cameraDebug()
{
    console.log("\n\ncamera.position.x =  " + camera.position.x);
    console.log("camera.position.y =  " + camera.position.y);
    console.log("camera.position.z =  " + camera.position.z);
    console.log("camera.rotation.x =  " + camera.rotation.x);
    console.log("camera.rotation.y =  " + camera.rotation.y);
    console.log("camera.rotation.z =  " + camera.rotation.z);
}

//ARENA CLASS
class Arena extends THREE.Mesh {
    constructor(centerPosition, width, height, depth)
    {
        // Create geometry for the arena
        const geometry = new THREE.BoxGeometry(width, height, depth);
        
        // Create material
        const material = new THREE.MeshBasicMaterial({ color: 0x8800dd, wireframe: false});
        
        // Call super constructor to set up mesh
        super(geometry, material);
        
        // Set position of the arena
        this.position.copy(centerPosition);
        
        // Calculate left corner position based on the center and dimensions
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const halfDepth = depth / 2;
        
        const leftCornerX = this.position.x - halfWidth;
        const bottomCornerY = this.position.y - halfHeight;
        const nearCornerZ = this.position.z - halfDepth;

        // Calculate and store coordinates of every corner
        this.leftCorner = new THREE.Vector3(leftCornerX, bottomCornerY, nearCornerZ);
        this.rightCorner = new THREE.Vector3(leftCornerX + width, bottomCornerY, nearCornerZ);
        this.topCorner = new THREE.Vector3(leftCornerX, bottomCornerY + height, nearCornerZ);
        this.farCorner = new THREE.Vector3(leftCornerX, bottomCornerY, nearCornerZ + depth);
        this.length = width;
        this.height = height;
        this.width = depth;
        this.paddleRight = new Paddle(this, false);
        this.paddleLeft = new Paddle(this, true);
        this.isActive = true;
    }
    monitorArena()
    {
        if (this.isActive)
        {
            animatePaddle(this.paddleLeft, leftArrowPressed, rightArrowPressed, this);
            animatePaddle(this.paddleRight, dKeyPressed, aKeyPressed, this);
        }
    }
}

// PADDLE CLASS

class Paddle extends THREE.Mesh {
    constructor(arena, left) {
        // Calculate paddle dimensions based on arena size
        const paddleWidth = arena.width * 0.1; // 20% of arena width
        const paddleHeight = arena.length * 0.05; // 5% of arena height
        const paddleDepth = arena.height * 0.15; // 2% of arena depth
        console.log("arena = " + arena.width, arena.height, arena.length);
        console.log(paddleWidth, paddleHeight, paddleDepth);
        // Create geometry for the paddle
        const geometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
        // Load texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('mathy.jpeg');
        // Create material
        const material = new THREE.MeshBasicMaterial({ map: texture });

        // Call super constructor to set up mesh
        super(geometry, material);

        // Set position of the paddle on top of the arena
        const arenaTopY = arena.position.y + arena.height / 2;
        // this.position.set(arena.position.x, arenaTopY, arena.position.z);
        this.position.z = arena.position.z + arena.width / 2;
        if (left)
            this.position.z -= arena.width;
        this.position.y = arena.position.y + (arena.height / 2) + (paddleHeight / 2);
        this.position.x = arena.position.x;
        // this.position.set(arena.topCorner);

        // Store arena reference
        this.arena = arena;
    }
}

function animatePaddle(paddle, keyRight, keyLeft, arena)
{
    if (keyRight && paddle.position.x + 0.01 <= arena.rightCorner.x)
        paddle.position.x += 0.01 * arena.length;
    if (keyLeft && paddle.position.x - 0.01 >= arena.leftCorner.x)
        paddle.position.x -= 0.01 * arena.length;
}

function setCameraPositions(cameraRight, cameraLeft, arena)
{
    cameraRight.position.y = arena.position.y + arena.height * 3;
    cameraRight.position.z = arena.position.z + arena.width * 0.85;
    cameraRight.position.x = arena.position.x;
    cameraLeft.position.y = arena.position.y + arena.height * 3;
    cameraLeft.position.z = arena.position.z - arena.width * 0.85;
    cameraLeft.position.x = arena.position.x;
    cameraRight.lookAt(arena.position);
    cameraLeft.lookAt(arena.position);
}


const centerPosition = new THREE.Vector3(0, 0, 0);
const arena = new Arena(centerPosition, 200, 30, 300);
scene.add(arena, arena.paddleRight, arena.paddleLeft);

setCameraPositions(cameraRight, cameraLeft, arena);

function animate()
{
    requestAnimationFrame( animate );
    torus.rotation.z += 5;
    if (spaceKeyPressed)
        setCameraPositions(cameraRight, cameraLeft, arena);
    arena.monitorArena();
    // animatePaddle(arena.paddleRight, dKeyPressed, aKeyPressed, arena);
    // animatePaddle(arena.paddleLeft, leftArrowPressed, rightArrowPressed, arena);
    renderer1.render(scene, cameraRight);
    renderer2.render(scene, cameraLeft);
}
animate();
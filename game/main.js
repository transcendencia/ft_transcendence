
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// CAMERA RENDERER AND SCENE //
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 2000);
const cameraRight = new THREE.PerspectiveCamera(95, aspectRatio / 2, 0.1, 1000 );
const cameraLeft = new THREE.PerspectiveCamera(95, aspectRatio / 2, 0.1, 1000 );
camera.position.set(20, 20, 0);
cameraLeft.lookAt(0, 0, 0);
//RENDERERS
const renderer = new THREE.WebGLRenderer({ // Renderer for full screen
    canvas: document.querySelector('#c1')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const renderer2 = new THREE.WebGLRenderer({ // Renderer for split screen
    canvas: document.querySelector('#c2')
})
renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.setSize(window.innerWidth / 2, window.innerHeight); // Set width to half of window width
renderer2.render(scene, cameraLeft);

// TORUS THINGY (VERY IOMPORTNATNT)
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// const material = new THREE.MeshStandardMaterial({color:0xFFFFFF, wireframe:true});
// const torus = new THREE.Mesh(geometry, material);
// scene.add(torus);

//MOON AND STARS
function addStar(){
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color:0xffffff})
    const star = new THREE.Mesh( geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 1000 ));
    
    star.position.set(x, y, z);
    scene.add(star)
}
Array(800).fill().forEach(addStar)

let moon;
const moonLoader = new GLTFLoader();
moonLoader.load(
    'moon/scene.gltf',
    function(gltf) {
        moon = gltf.scene;
        moon.scale.set(250,250,250);
        scene.add(moon);
        moon.position.set(250, 250, 250);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
    },
    function (error) {
        console.error(error);
    }
)

// HELPERS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const gridHelper = new THREE.GridHelper(1000, 500, 100,  0xAA00ff);
const axesHelper = new THREE.AxesHelper(50); // Length of axes
const rightHelper = new THREE.CameraHelper(cameraRight);
const leftHelper = new THREE.CameraHelper(cameraLeft);
// scene.add(axesHelper);
// scene.add(gridHelper, ambientLight);

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
let oKeyPressed = false;
let pKeyPressed = false;
let iKeyPressed = false;
let gKeyPressed = false;

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
    if (event.key === 'o')
        oKeyPressed = true;
    if (event.key === 'p')
        pKeyPressed = true;
    if (event.key === 'i')
        iKeyPressed = true;
    if (event.key === 'g')
        gKeyPressed = true;
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
    if (event.key === 'o')
        oKeyPressed = false;
    if (event.key === 'p')
        pKeyPressed = false;
    if (event.key === 'i')
        iKeyPressed = false;
    if (event.key === 'g')
        gKeyPressed = false;
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
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('purplebox.jpeg');
        // Create material
        // const material = new THREE.MeshStandardMaterial({ color: 0x8800dd, wireframe: false});
        const material = new THREE.MeshStandardMaterial({map: texture});
        
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
        this.pointsRight = 0;
        this.pointsLeft = 0;
        this.paddleRight = new Paddle(this, false);
        this.paddleLeft = new Paddle(this, true);
        this.ball = new Ball(this);
        this.isActive = true;
    }
    monitorArena()
    {
        this.paddleLeft.light.position.copy(this.paddleLeft.position);
        this.paddleRight.light.position.copy(this.paddleRight.position);
        if (this.ball.isRolling)
            this.ball.monitorMovement();
        this.ball.light.position.copy(this.ball.position);
        this.ball.light.position.y += this.height;
        if (this.ball.isRolling)
            this.ball.rotation.y += 0.1;
        if (this.isActive)
        {
            this.paddleRight.animatePaddle(rightArrowPressed, leftArrowPressed, this);
            this.paddleLeft.animatePaddle(aKeyPressed, dKeyPressed, this);
        }
        if (spaceKeyPressed)
        {
            this.ball.speedZ = this.width / 200;
            this.ball.isRolling = true;
        }
        if (cKeyPressed)
        {
            this.paddleLeft.light.power += 0.1;
            this.paddleRight.light.power += 0.1;
            console.log('light = ' + this.paddleLeft.light.power);
        }
        if (iKeyPressed)
        {
            cameraLeft.position.copy(this.position);
            cameraLeft.position.y += this.length * 3;
            cameraLeft.position.z -= this.length * 3;
            cameraLeft.position.x += this.length * 3;
            cameraLeft.lookAt(this.position);
            swapToSplitScreen();
            this.setSplitCameraPositions(camera, cameraLeft);
        }
        if (pKeyPressed)
        {
            swapToFullScreen();
            this.setTopView(camera);
        }
        if (this.ball.rightScore(this.paddleLeft))
        {
            glitch(glitchLeft);
            this.resetPositions(this.paddleLeft, this.paddleRight);
        }
        if (this.ball.leftScore(this.paddleRight))
        {
            glitch(glitchRight);
            this.resetPositions(this.paddleRight, this.paddleLeft);
        }
        if (this.ball.collisionWithLeftPaddle(this.paddleLeft))
            this.ball.goToRight(this.paddleLeft);
        if (this.ball.collisionWithRightPaddle(this.paddleRight))
            this.ball.goToLeft(this.paddleRight);
    }
    setSplitCameraPositions(_cameraRight, _cameraLeft)
    {
        let targetY = this.position.y + this.height * 3;
        let targetZ = this.position.z + this.width * 0.85;
        let targetX = this.position.x;
        const duration = 3500;
        // Create tweens for each property
        new TWEEN.Tween(_cameraLeft.position)
            .to({ y: targetY, z: targetZ, x:targetX }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        // LookAt tween
        new TWEEN.Tween(_cameraLeft)
            .to({}, duration) // Dummy tween, to ensure that onUpdate is called
            .onUpdate(() => {
                _cameraLeft.lookAt(this.position);
            })
            .start();

        targetY = this.position.y + this.height * 3;
        targetZ = this.position.z - this.width * 0.85;
        targetX = this.position.x;
        // Create tweens for each property
        new TWEEN.Tween(_cameraRight.position)
        .to({ y: targetY, z: targetZ, x: targetX }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        // LookAt tween
        new TWEEN.Tween(_cameraRight)
            .to({}, duration) // Dummy tween, to ensure that onUpdate is called
            .onUpdate(() => {
                _cameraRight.lookAt(this.position);
            })
            .start();
    }
    setTopView(camera)
    {
        let targetY = this.position.y + this.height + this.width;
        let targetX = this.position.x;
        let targetZ = this.position.z;
        const duration = 3500;
        new TWEEN.Tween(camera.position)
        .to({x: targetX, y: targetY, z: targetZ}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

        targetX = Math.PI / -2;
        targetY = 0;
        targetZ = Math.PI / -2;
        new TWEEN.Tween(camera.rotation)
        .to({z: targetZ, x: targetX, y: targetY}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    }
    resetPositions(loserPaddle, winnerPaddle)
    {
        let duration = 1150;

        loserPaddle.light.power = loserPaddle.defaultLight;
        loserPaddle.light.color = new THREE.Color(1, 0, 0);
        winnerPaddle.light.power = winnerPaddle.defaultLight * 4;
        winnerPaddle.light.color = new THREE.Color(0, 1, 0);
        this.ball.light.power = 0;
        // PADDLE RESETS
        new TWEEN.Tween(this.paddleLeft.position)
        .to({x: this.position.x}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        new TWEEN.Tween(this.paddleRight.position)
        .to({x: this.position.x}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()

        // BALL RESETS
        let targetY = this.ball.startingPoint.y + this.length / 2;
        const firstTween = new TWEEN.Tween(this.ball.position)
        .to({x: this.ball.startingPoint.x, y: targetY, z: this.ball.startingPoint.z}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)

        const secondTween = new TWEEN.Tween(this.ball.position)
        .to({y: this.ball.startingPoint.y}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
           loserPaddle.light.power = loserPaddle.defaultLight;
           winnerPaddle.light.power = winnerPaddle.defaultLight;
           loserPaddle.light.color = new THREE.Color(1, 1, 1);
           winnerPaddle.light.color = new THREE.Color(1, 1, 1);
           this.ball.light.power = this.ball.startingPower;
        });

        firstTween.chain(secondTween);
        firstTween.start();
        this.ball.isRolling = false;
        this.ball.speedZ = 0;
        this.ball.speedX = 0;
    }
}

// PADDLE CLASS

class Paddle extends THREE.Mesh {
    constructor(arena, left) {
        // Calculate paddle dimensions based on arena size
        const paddleWidth = arena.width * 0.1; // 20% of arena width
        const paddleHeight = arena.length * 0.05; // 5% of arena height
        const paddleDepth = paddleHeight * 0.25; // 2% of arena depth
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
        // Store arena reference
        this.width = paddleWidth;
        this.height = paddleHeight;
        this.depth = paddleDepth;
        this.arena = arena;
        this.light = new THREE.PointLight(0xffffff);
        scene.add(this.light);
        this.defaultLight = this.arena.width * this.arena.length / 7.5;
        this.light.power = this.defaultLight;
        this.light.castShadow = true;
    }
    animatePaddle(keyRight, keyLeft, arena)
    {
        if (keyRight && this.position.x + 0.008 <= arena.rightCorner.x)
            this.position.x += 0.016 * arena.length;
        if (keyLeft && this.position.x - 0.008 >= arena.leftCorner.x)
            this.position.x -= 0.016 * arena.length;
    }
}

class Ball extends THREE.Mesh {
    constructor(arena)
    {
        // BALL CREATION
        const size = arena.width * 0.025;
        const geometry = new THREE.SphereGeometry(size, 32, 16);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('ball.jpg');
        const material = new THREE.MeshBasicMaterial({map: texture});
        super(geometry, material);
        this.light = new THREE.PointLight(0xffffff);
        scene.add(this.light);
        this.startingPower = 20;
        this.light.power = this.startingPower;
        this.light.castShadow = true;
        // ATRIBUTES
        this.radius = arena.width * 0.025;
        this.startingPoint = new THREE.Vector3(arena.position.x, arena.position.y + arena.height / 2 + this.radius, arena.position.z);
        this.position.copy(this.startingPoint);
        this.isRolling = false;
        this.speedX = 0;
        this.speedY = 0;
        this.zLimit1 = arena.position.z + arena.width / 2;
        this.zLimit2 = arena.position.z - arena.width / 2;
        this.arena = arena;
    }
    leftScore(paddle)
    {
        return (this.position.z >= paddle.position.z);
    }
    rightScore(paddle)
    {
        return (this.position.z <= paddle.position.z);
    }
    collisionWithBorder(paddle1, paddle2)
    {
        return (this.position.z >= paddle1.position.z || this.position.z <= paddle2.position.z);
    }
    collisionWithLeftPaddle(paddle)
    {
        if ((this.position.z < paddle.position.z + this.radius) && this.position.z > paddle.position.z)
        {
            if ((this.position.x < paddle.position.x + paddle.width / 2) && (this.position.x > paddle.position.x - paddle.width / 2))
            {
                if (Math.abs(this.speedZ) <= this.arena.width / 40)
                    this.speedZ *= 1.05;
                return true;
            }
        }
        return false;
    }
    collisionWithRightPaddle(paddle)
    {
        if ((this.position.z > paddle.position.z - this.radius) && this.position.z < paddle.position.z)
        {
            if ((this.position.x < paddle.position.x + paddle.width / 2) && (this.position.x > paddle.position.x - paddle.width / 2))
            {
                if (Math.abs(this.speedZ) <= this.arena.width / 40)
                    this.speedZ *= 1.05;
                return true;
            }
        }
        return false;
    }
    goToLeft(paddle)
    {
        let distanceFromCenter = (this.position.x - paddle.position.x) / paddle.width;
        if (distanceFromCenter * (this.position.x - paddle.position.x) > 0)
            this.speedX = distanceFromCenter * 0.015 * this.arena.width;
        else
            this.speedX += distanceFromCenter * 0.015 * this.arena.width;
        this.speedZ *= -1;
    }
    goToRight(paddle)
    {
        let distanceFromCenter = (this.position.x - paddle.position.x) / paddle.width;
        if (distanceFromCenter * (this.position.x - paddle.position.x) > 0)
            this.speedX = distanceFromCenter * 0.015 * this.arena.width;
        this.speedX += distanceFromCenter * 0.015 * this.arena.width;
        this.speedZ *= -1;
    }
    monitorMovement()
    {
        if (this.position.x + this.speedX <= this.arena.position.x - this.arena.length / 2)
            this.speedX *= -1;
        if (this.position.x + this.speedX >= this.arena.position.x + this.arena.length / 2)
            this.speedX *= -1;
        this.position.z += this.speedZ;
        this.position.x += this.speedX;
    }
}

function swapToSplitScreen() {
        const targetWidth = window.innerWidth / 2;
        const duration = 500; // Animation duration in milliseconds
        new TWEEN.Tween(renderer.domElement)
            .to({ width: targetWidth }, duration) // Set width directly on renderer's canvas element
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                renderer.setSize(renderer.domElement.width, window.innerHeight);
            })
            .start();

        const aspectRatio = (window.innerWidth / window.innerHeight) / 2;
        new TWEEN.Tween(camera)
            .to({ aspect: aspectRatio, fov: 95 }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                camera.updateProjectionMatrix();
            })
            .start();
}

function swapToFullScreen()
{
    const targetWidth = window.innerWidth;
    const duration = 500; // Animation duration in milliseconds
    new TWEEN.Tween(renderer.domElement)
        .to({ width: targetWidth }, duration) // Set width directly on renderer's canvas element
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            renderer.setSize(renderer.domElement.width, window.innerHeight);
        })
        .start();

        const aspectRatio = (window.innerWidth / window.innerHeight);
        new TWEEN.Tween(camera)
        .to({ aspect: aspectRatio, fov: 75 }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            camera.updateProjectionMatrix();
        })
        .start();
}

function monitorScreen()
{
    if (oKeyPressed)
        swapToSplitScreen();
}

// effectGlitch.enabled = false; // Enable glitch effect
// effectGlitch.goWild = false; // Make the glitch wild

const centerPosition = new THREE.Vector3(0, 0, 0);
const arena1 = new Arena(centerPosition, 20, 2, 34);
scene.add(arena1, arena1.paddleRight, arena1.paddleLeft, arena1.ball);

let renderPass1 = new RenderPass(scene, camera);
const composer1 = new EffectComposer( renderer );
let glitchLeft = new GlitchPass(64);
glitchLeft.renderToScreen = true;
composer1.addPass(renderPass1);
composer1.addPass(glitchLeft);

let renderPass2 = new RenderPass(scene, cameraLeft);
const composer2 = new EffectComposer( renderer2 );
let glitchRight = new GlitchPass(64);
glitchRight.renderToScreen = true;
composer2.addPass(renderPass2);
composer2.addPass(glitchRight);

glitchRight.enabled = false;
glitchLeft.enabled = false;

function glitch(glitchEffect)
{
    glitchEffect.enabled = true;
    setTimeout(function() {
        glitchEffect.enabled = false;
    }, 250);
}

function animate()
{
    requestAnimationFrame( animate );
    // controls.update();
    TWEEN.update();
    arena1.monitorArena();
    monitorScreen();
    // cameraDebug();
    // renderer.render(scene, camera);
    composer1.render();
    composer2.render();
    // renderer1.render(scene, cameraRight);
    // renderer2.render(scene, cameraLeft);
}
animate();
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { Water } from 'three/addons/objects/Water.js';
import { vertexMain, vertexPars } from './../texturePlayground/shaders/vertex.js';
import { fragmentMain, fragmentPars } from './../texturePlayground/shaders/fragment.js';
import { lavaFragmentShader, lavaVertexShader } from './../texturePlayground/shaders/lavaShader.js';
import { lobbyVisuals } from '../../html/js/main.js';
import { gameStarted } from '../../html/js/arenaPage.js';
// import { gameStarted } from '../../html/js/arenaPage.js';
import { endGame, rematchGame } from '../../html/js/arenaPage.js';
import { updateUserGraphicMode } from '../../html/js/userManagement.js'
// FPS COUNTER
const fpsCounter = document.getElementById('fps-counter');

let frameCount = 0;
let lastTime = performance.now(); // Initialize lastTime here

function updateFpsCounter() {
    var currentTime = performance.now();

    frameCount++;

    if (currentTime > lastTime + 1000) {
        var fps = Math.round(frameCount);
        fpsCounter.innerHTML = 'FPS: ' + fps;
        frameCount = 0;
        lastTime = currentTime;
    }
}

// CAMERA RENDERER AND SCENE //
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000010);
const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 2000);
const cameraRight = new THREE.PerspectiveCamera(95, aspectRatio / 2, 0.1, 1000 );
const cameraLeft = new THREE.PerspectiveCamera(95, aspectRatio / 2, 0.1, 1000 );
camera.position.set(20, 20, 0);
cameraLeft.lookAt(0, 0, 0);


//RENDERERS
const renderer = new THREE.WebGLRenderer({ // Renderer for full screen
    canvas: document.querySelector('#c1'),
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
renderer.autoClear = false;

const renderer2 = new THREE.WebGLRenderer({ // Renderer for split screen
    canvas: document.querySelector('#c2'),
    antialias: true
})
renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.setSize(window.innerWidth / 2, window.innerHeight); // Set width to half of window width
renderer2.render(scene, cameraLeft);

let cubeLoader = new THREE.CubeTextureLoader();

const shaderBallMaterial = new THREE.MeshStandardMaterial({
    onBeforeCompile: (shader) => {
      // storing a reference to the shader object
      shaderBallMaterial.userData.shader = shader

      // uniforms
      shader.uniforms.uTime = { value: 0 }

      const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>`
      shader.vertexShader = shader.vertexShader.replace(
        parsVertexString,
        parsVertexString + vertexPars
      )

      const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`
      shader.vertexShader = shader.vertexShader.replace(
        mainVertexString,
        mainVertexString + vertexMain
      )

      const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`
      const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`
      shader.fragmentShader = shader.fragmentShader.replace(
        parsFragmentString,
        parsFragmentString + fragmentPars
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        mainFragmentString,
        mainFragmentString + fragmentMain
      )
    },
  });

shaderBallMaterial.userData.shader = { uniforms: { uTime: { value: 0 } } };

document.addEventListener("DOMContentLoaded", function() {
    // Set default cursor for body
    document.body.style.cursor = "url('../static/game/assets/cursor/default.cur'), auto";

    // Set cursor for all links
    let links = document.querySelectorAll('backButton');
    links.forEach(function(link) {
        link.style.cursor = "url('../static/game/assets/cursor/pointer.cur'), pointer";
    });

    // Set cursor for all buttons
    let buttons = document.querySelectorAll('button');
    buttons.forEach(function(button) {
        button.style.cursor = "url('../static/game/assets/cursor/pointer.cur'), pointer";
    });
});
// LOADING SCREEN
class LoadingScreen {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ // Renderer for full screen
            canvas: document.querySelector('#c3'),
            antialias: false
        });
        this.scene.background = new THREE.Color(0x000010);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.afterimagePass = new AfterimagePass();
        this.afterimagePass.uniforms['damp'].value = 0.90;
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 1.0, 0.5 );
        this.bloomPass.threshold = 0.5;
        this.bloomPass.strength = 1.0;
        this.bloomPass.radius = 0.5;
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.bloomPass);
        this.cameraInitialZ = 4;
        this.cameraCloseZ = 4;
        this.cameraFarZ = 45;
        this.camera.position.z = this.cameraInitialZ;
        this.currentGraphics = 'medium';

        const loader = new GLTFLoader();
        loader.load('../../static/game/models/spaceShip/scene.gltf', (gltf) => {
            this.spaceShip = gltf.scene; // Assign the loaded model to this.spaceShip
            this.spaceShip.scale.set(0.03, 0.03, 0.03); // Scale the spaceship
            this.spaceShip.position.set(0, -1, 2); // Set the position of the spaceship
            this.spaceShip.rotation.y = Math.PI; // Rotate the spaceship
            this.scene.add(this.spaceShip); // Add the spaceship to the scene
        }, undefined, (error) => {
            console.error('An error occurred while loading the spaceship model:', error);
        });
        this.arena;
        this.spaceShipGoingUp = true;
        this.spaceShipGoingDown = false;
        this.isAnimatingSpaceship = false;
        this.ico2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 20), shaderBallMaterial);
        this.lowGraphicsGeometry = new THREE.IcosahedronGeometry(0.6, 1);
        this.highGraphicsGeometry = new THREE.IcosahedronGeometry(0.6, 20);
        this.mediumGraphicsGeometry = new THREE.IcosahedronGeometry(0.6, 20);
        this.ico2.position.set(0, 0, 0);
        this.xSpeedInitial = 0.005;
        this.ySpeedInitial = 0.015;
        this.xSpeedFinal = 0.061;
        this.ySpeedFinal = 0.185;
        this.isAnimatingCamera = true;
        this.loading = true;
        this.iterations = 0;
        this.scene.add(this.ico2);
        this.light = new THREE.PointLight(0x3155ef, 0.5);
        this.light2 = new THREE.PointLight(0x3155ef, 0.5);
        this.light3 = new THREE.PointLight(0x3155ef, 0.35);
        this.light4 = new THREE.PointLight(0xffffff, 0.35);
        this.icoLight = new THREE.PointLight(0xffffff, 0.5);
        this.lightInitialPower = this.light.power;
        this.light2InitialPower = this.light2.power;
        this.light3InitialPower = this.light3.power;
        this.icoLightInitialPower = this.icoLight.power;
        this.light.position.set(0, 5, 0);
        this.light2.position.set(0, -5, 0);
        this.light3.position.set(0, 0, 5);
        this.light4.position.set(0, 0, -5);
        this.icoLight.position.set(0, 4, 0);
        this.starSpeed = 2;
        this.loadingCompleted = false;
        this.scene.add(this.light, this.light2, this.light3, this.icoLight, this.light4);
        this.stars = []; // Store all stars added to the scene
        this.addStars(2000);

    }
    addStar() {
        const geometry = new THREE.SphereGeometry(0.125, 12, 12);
        const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        const star = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

        star.position.set(x, y, z);
        this.scene.add(star);
        this.stars.push(star); // Add the star to the stars array
    }
    addStars(numStars) {
        Array(numStars).fill().forEach(this.addStar.bind(this));
    }
    loadingComplete() {
        if (this.isAnimatingCamera) {
            this.isAnimatingCamera = false;
            this.iterations = 0;
            this.loadingCompleted = true;
            const duration = 500;
    
            // Ship recall before going in the ball
            const targetZ = this.spaceShip.position.z + 1;
            const targetY = this.spaceShip.position.y + 0.5;
            const targetRotationX = Math.PI / 4;
            const tweenRecall = new TWEEN.Tween(this.spaceShip.position)
                .to({y: targetY, z: targetZ }, duration / 4)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    this.spaceShip.rotation.x -= 0.01;
                });
            const tweenResetOrientation = new TWEEN.Tween(this.spaceShip.rotation)
                .to({x: 0}, duration / 2)
                .easing(TWEEN.Easing.Quadratic.Out);

            // make the ship go in the ball
            const tween1 = new TWEEN.Tween(this.spaceShip.position)
                .to({ x: 0, y: 0, z: -1 }, duration)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.spaceShip.scale.x -= 0.0004;
                    this.spaceShip.scale.y -= 0.0004;
                    this.spaceShip.scale.z -= 0.0004;
                });

            // ROTATION ACCELERATION AND BRIGHTNESS
            const tween2 = new TWEEN.Tween(this)
               .to({ xSpeedInitial: this.xSpeedFinal, ySpeedInitial: this.ySpeedFinal, cameraInitialZ: this.cameraCloseZ }, duration)
               .easing(TWEEN.Easing.Quadratic.Out)
               .onUpdate(() => {
                    this.camera.position.z = this.cameraInitialZ;
                    this.light.power *= 1.02;
                    this.light2.power *= 1.02;
                    this.light3.power *= 1.02;
                    this.icoLight.power *= 1.02;
                    this.iterations++;
                });

            // GET FAR FROM BALL
            const tween3 = new TWEEN.Tween(this.camera.position)
                .to({ z: this.cameraFarZ }, duration / 2)
                .easing(TWEEN.Easing.Linear.None)
                .onStart(() => {
                    if (this.currentGraphics === 'high')
                        this.composer.addPass(this.afterimagePass);
                    this.starSpeed = 1;
                })
                .onComplete(() => {
                    this.arena.gameState.switchLoadingToGame();
                });
                
            // FADE OUT LOADING SCREEN FADE IN GAME
            const tween4 = new TWEEN.Tween({ opacity: 0 })
                .to({ opacity: 1 }, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onStart(() => {
                    document.getElementById('c3').style.display = 'none';
                    document.getElementById('c1').style.display = 'inline';
                    document.getElementById('c1').style.display = 'inline';
                    this.arena.gameState.loading = false;
                    this.arena.gameState.inGame = true;
                })
                .onUpdate((obj) => {
                    document.getElementById('c1').style.opacity = obj.opacity;
                });

            // Chain the tweens together
            tweenRecall.chain(tween1, tweenResetOrientation);
            tween1.chain(tween2);
            tween2.chain(tween3);
            tween3.chain(tween4);
            tweenRecall.start();
        }
    }
    animate()
    {
        this.ico2.rotation.y -= this.ySpeedInitial;
        this.ico2.rotation.x += this.xSpeedInitial;
        shaderBallMaterial.userData.shader.uniforms.uTime.value = performance.now() / 10000;
        this.stars.forEach(star => {
            star.position.z += this.starSpeed; // Increase Z position by 0.01
            if (star.position.z > 100) {
                star.position.z = -100; // Reset position to -100
            }
        });

        if (!this.isAnimatingSpaceship && this.spaceShip)
        {
            const duration = 1000;
            this.isAnimatingSpaceship = true;
            const tweenGoingUp = new TWEEN.Tween(this.spaceShip.position)
                .to({y: -0.95}, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onStart(() => {
                    this.spaceShipGoingUp = true;
                })
                .onComplete(() => {
                    tweenGoingDown.start();
                });
            const tweenGoingDown = new TWEEN.Tween(this.spaceShip.position)
                .to({y: -1}, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onStart(() => {
                    this.spaceShipGoingDown = true;
                })
                .onUpdate(() => {
                    if (!this.isAnimatingCamera)
                        tweenGoingDown.stop();
                })
                .onComplete(() => {
                    tweenGoingUp.start();
                });
            tweenGoingUp.start();
        }
        this.composer.render();
    }
    activateLoadingScreen()
    {
        this.isAnimatingCamera = true;
        if (this.currentGraphics === 'high')
            this.composer.removePass(this.afterimagePass);
        document.getElementById('c3').style.display = 'inline';
        this.cameraInitialZ = 4;
        this.camera.position.z = this.cameraInitialZ;
        this.xSpeedInitial = 0.005;
        this.ySpeedInitial = 0.015;
        this.light.power = this.lightInitialPower;
        this.light2.power = this.light2InitialPower;
        this.light3.power = this.light3InitialPower;
        this.icoLight.power = this.icoLightInitialPower;
        this.spaceShip.scale.set(0.03, 0.03, 0.03); // Scale the spaceship
        this.spaceShip.position.set(0, -1, 2); // Set the position of the spaceship
        this.isAnimatingSpaceship = false;
        this.loadingCompleted = false;
    }
    changeGraphics(graphics)
    {
        if (graphics === 'low' && this.currentGraphics != 'low')
        {
            this.bloomPass.strength = 0.0;
            this.ico2.geometry = this.lowGraphicsGeometry;
            this.currentGraphics = 'low';
        }
        if (graphics === 'medium' && this.currentGraphics != 'medium')
        {
            this.bloomPass.strength = 1.0;
            this.ico2.geometry = this.mediumGraphicsGeometry;
            this.currentGraphics = 'medium';
        }
        if (graphics === 'high' && this.currentGraphics != 'high')
            {
                this.bloomPass.strength = 1.0;
                this.ico2.geometry = this.highGraphicsGeometry;
                this.currentGraphics = 'high';
            }
    }
}

const loadingScreen = new LoadingScreen();

// HELPERS
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const gridHelper = new THREE.GridHelper(1000, 500, 100,  0xAA00ff);
const axesHelper = new THREE.AxesHelper(50); // Length of axes
const rightHelper = new THREE.CameraHelper(cameraRight);
const leftHelper = new THREE.CameraHelper(cameraLeft);
// scene.add(axesHelper);
// scene.add(gridHelper);

// VIEW UTILS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let lastKeyPressTime = {};
let lastKeyUpTime = {};

let keyDown = {
    'ArrowLeft': false,
    'ArrowRight': false,
    'ArrowUp': false,
    'ArrowDown': false,
    'w': false,
    'a': false,
    's': false,
    'd': false,
    ' ': false,
    'c': false,
    'v': false,
    'n': false,
    'o': false,
    'p': false,
    'l': false,
    'i': false,
    'u': false,
    'e': false,
    'g': false,
    'b': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
};

let doubleKeyPress = {
    'ArrowLeft': false,
    'ArrowRight': false,
    'a': false,
    'd': false
};

// Event listener for key presses and releases

document.addEventListener('keydown', (event) => {
    if (keyDown.hasOwnProperty(event.key)) {
        if (gameState != undefined && gameState.arena != undefined && gameState.arena.bot != undefined && gameState.arena.bot.isPlaying)
        {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown')
                return;
        }
        keyDown[event.key] = true;

        if (doubleKeyPress.hasOwnProperty(event.key)) {
            if (lastKeyPressTime[event.key] && Date.now() - lastKeyPressTime[event.key] < 200 && Date.now() - lastKeyUpTime[event.key] < 200) 
                doubleKeyPress[event.key] = true;
            else
                doubleKeyPress[event.key] = false;
            lastKeyPressTime[event.key] = Date.now();
        }
    }
});


document.addEventListener('keyup', (event) => {
    if (keyDown.hasOwnProperty(event.key)) {
        keyDown[event.key] = false;
        lastKeyUpTime[event.key] = Date.now();
        doubleKeyPress[event.key] = false;
    }
});

const scorePoints = document.getElementsByClassName("parallelogram");
const blueBar = document.getElementsByClassName("bluebar");
const scoreUI = document.getElementsByClassName("gameUI");
const thirdPlayerUI = document.getElementsByClassName("profileCont3");

document.addEventListener('DOMContentLoaded', (event) => {
    const backToLobbyButton = document.getElementById('backToLobbyButton');

    backToLobbyButton.addEventListener('click', () => {
        gameState.arena.displayBackPanel();
    });
    const rematchButton = document.getElementById('rematchButton');

    rematchButton.addEventListener('click', () => {
        rematchGame();
        keyDown['e'] = true;
        gameState.arena.resetUIForRematch();
        setTimeout(() => {
            keyDown['e'] = false;
        }, 10);
        // stylish and (optional) functional code here 
    });
});

function showWinningScreen()
{
    const winningScreen = document.querySelector('.winningScreen');
    winningScreen.classList.add('visible');
}

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
    constructor(centerPosition, width, height, depth, loadingScreen, gameState)
    {
        // Create geometry for the arena
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const textureLoader = new THREE.TextureLoader();
        const arenaColor = 0x000000;
        // Create material
        const material = new THREE.MeshPhongMaterial({color: 0x101030, wireframe:false});
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
        this.camera = camera;
        this.gameState = gameState;
        this.graphics = this.gameState.graphics
        this.thirdPlayer = new ThirdPlayer(this);
        this.paddleRight = new Paddle(this, false);
        this.paddleLeft = new Paddle(this, true);
        this.ball = new Ball(this);
        this.bot = new Bot(this, this.paddleRight, this.paddleLeft);
        this.isActive = true;
        this.isBlurred = false;
        this.isBeingBlurred = false;
        this.isBeingReset = false;
        this.scene = scene;
        this.game = new Game(this);
        this.maxSpeed = this.width / 40;
        this.addedToScene = false;
        this.isSplitScreen = false;
        this.isAnimatingCamera = false;
        this.loadingScreen = loadingScreen;
        this.loadingScreen.arena = this;
        this.viewPoint1 = new THREE.Vector3(this.position.x + this.width, this.position.y + this.height + this.width / 1.5, this.position.z + this.width * 1);
        this.viewPoint2 = new THREE.Vector3(this.position.x - this.width, this.position.y + this.height + this.width / 1.5, this.position.z + this.width * 1);
        this.viewPoint3 = new THREE.Vector3(this.position.x - this.width, this.position.y + this.height + this.width / 1.5, this.position.z - this.width * 1);
        this.viewPoint4 = new THREE.Vector3(this.position.x + this.width, this.position.y + this.height + this.width / 1.5, this.position.z - this.width * 1);
        this.defaultMaterial = material;
        this.stars = []; // Store all stars added to the scene

        // POST PROCESSING
        this.renderPass1 = new RenderPass(this.scene, this.camera);
        this.renderPass2 = new RenderPass(this.scene, cameraLeft);
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        this.horizontalBlur = new ShaderPass(HorizontalBlurShader);
        this.verticalBlur = new ShaderPass(VerticalBlurShader);
        this.horizontalBlur.uniforms['tDiffuse'].value = null; // Set the input texture to null
        this.verticalBlur.uniforms['tDiffuse'].value = null; // Set the input texture to null
        this.horizontalBlur.renderToScreen = true; // Render to a texture
        this.verticalBlur.renderToScreen = true; // Render to the screen
        this.horizontalBlur.uniforms.h.value = 0;
        this.verticalBlur.uniforms.v.value = 0;
        this.glitchLeft = new GlitchPass(64);
        this.glitchRight = new GlitchPass(64);
        this.glitchLeft.renderToScreen = true;
        this.glitchRight.renderToScreen = true;
        this.bloomPass.threshold = 0.5;
        this.bloomPass.strength = 1.0;
        this.bloomPass.radius = 0.5;
        this.oceanMap = new OceanMap(this);
        this.spaceMap = new SpaceMap(this);
        this.skyMap = new SkyMap(this);
        this.dragonMap = new DragonMap(this);
        this.singlePlayer = false;
        this.spaceMap.initMap();
        this.composer1 = new EffectComposer(renderer);
        this.composer2 = new EffectComposer(renderer2);

        // INIT ARENA
        this.initPostProcessing();
        this.idleCameraAnimation();
    }
    addArenaToScene()
    {
        this.scene.add(this, this.paddleRight, this.paddleLeft, this.ball, this.thirdPlayer);
    }
    initPostProcessing()
    {
        this.composer1.addPass(this.renderPass1);
        this.composer1.addPass(this.bloomPass);
        this.composer1.addPass(this.horizontalBlur);
        this.composer1.addPass(this.verticalBlur);
        this.composer1.addPass(this.glitchLeft);
        this.glitchLeft.enabled = false;

        this.composer2.addPass(this.renderPass2);
        this.composer2.addPass(this.bloomPass);
        this.composer2.addPass(this.horizontalBlur);
        this.composer2.addPass(this.verticalBlur);
        this.composer2.addPass(this.glitchRight);
        this.glitchRight.enabled = false;
    }
    addStar() {
        const geometry = new THREE.SphereGeometry(1.125, 12, 12);
        const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        const star = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1500));

        star.position.set(x, y, z);
        this.scene.add(star);
        this.stars.push(star); // Add the star to the stars array
    }
    addStars(numStars) {
        Array(numStars).fill().forEach(this.addStar.bind(this));
    }
    removeStars() {
        this.stars.forEach(star => {
            this.scene.remove(star);
        });
    }
    initializeGameSettings()
    {
        this.game.hasToBeInitialized = false;
        if (this.game.map === 'oceanMap')
            this.switchMap(this.oceanMap);
        else if (this.game.map === 'spaceMap')
            this.switchMap(this.spaceMap);
        else if (this.game.map === 'skyMap')
            this.switchMap(this.skyMap);
        else if (this.game.map === 'dragonMap')
            this.switchMap(this.dragonMap);
        this.addArenaToScene();
    }
    idleCameraAnimation()
    {
        if (!this.isAnimatingCamera)
        {
            this.isAnimatingCamera = true;
            const duration = 5000;
            // Create tweens for each property
            const firstTween = new TWEEN.Tween(camera.position)
                .to({x: this.viewPoint1.x / 1, y: this.viewPoint1.y / 1, z: this.viewPoint1.z / 1}, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    if (!this.isAnimatingCamera)
                        firstTween.stop();
                    camera.lookAt(this.ball.position);
                })
                .onComplete(() => {
                    secondTween.start();
                })
            const secondTween = new TWEEN.Tween(camera.position)
                .to({x: this.viewPoint2.x / 1, y: this.viewPoint2.y / 1, z: this.viewPoint2.z / 1}, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    if (!this.isAnimatingCamera)
                        secondTween.stop();
                    camera.lookAt(this.ball.position);
                })
                .onComplete(() => {
                    thirdTween.start();
                })
            const thirdTween = new TWEEN.Tween(camera.position)
                .to({x: this.viewPoint3.x / 1, y: this.viewPoint3.y / 1, z: this.viewPoint3.z / 1}, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    if (!this.isAnimatingCamera)
                        thirdTween.stop();
                    camera.lookAt(this.ball.position);
                })
                .onComplete(() => {
                    fourthTween.start();
                })
            const fourthTween = new TWEEN.Tween(camera.position)
                .to({x: this.viewPoint4.x / 1, y: this.viewPoint4.y / 1, z: this.viewPoint4.z / 1}, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    if (!this.isAnimatingCamera)
                        fourthTween.stop();
                    camera.lookAt(this.ball.position);
                })
                .onComplete(() => {
                    fifthTween.start();
                })
            const fifthTween = new TWEEN.Tween(camera.position)
                .to({x: this.viewPoint1.x / 1, y: this.viewPoint1.y / 1, z: this.viewPoint1.z / 1}, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    if (!this.isAnimatingCamera)
                        fifthTween.stop();
                    camera.lookAt(this.ball.position);
                })
                .onComplete(() => {
                    secondTween.start();
                })
            firstTween.start();
        }
    }
    addPoint(side) {
        if (side === 'left') {
            scorePoints.item(this.game.leftScore).style.borderColor = "rgb(171, 31, 0)";
            scorePoints.item(this.game.leftScore).style.backgroundColor = "#ab1f0051";
            this.game.leftScore++;
            this.game.user1.pointsScored++;
            this.game.user2.pointsTaken++;
            this.game.winnerPaddle = this.paddleRight;
            this.game.loserPaddle = this.paddleLeft;
        }
        else {
            scorePoints.item(this.game.rightScore + 3).style.borderColor = "rgb(171, 31, 0)";
            scorePoints.item(this.game.rightScore + 3).style.backgroundColor = "#ab1f0051";
            this.game.rightScore++;
            this.game.user2.pointsScored++;
            this.game.user1.pointsTaken++;
            this.game.winnerPaddle = this.paddleLeft;
            this.game.loserPaddle = this.paddleRight;
        }
    }
    resetUI() {
        for (let i = 0; i < scorePoints.length; i++) {
            scorePoints.item(i).style.borderColor = "#3777ff";
            scorePoints.item(i).style.backgroundColor = "#0008ff51";
            if (i > 1)
                continue;
            speedBar.item(i).animate([{
                top: "100%",
                left: "100%",
                backgroundColor: "rgb(9, 0, 187)",
            }], {duration: 500, fill: "forwards"})
        }
    }
    monitorArena()
    {
        this.paddleLeft.light.position.copy(this.paddleLeft.position);
        this.paddleRight.light.position.copy(this.paddleRight.position);
        this.paddleLeft.particles.updateParticles();
        this.paddleRight.particles.updateParticles();
        if (this.game.hasToBeInitialized)
            this.initializeGameSettings();
        if (this.game.isPlaying)
        {
            this.paddleLeft.monitorIdleAnimation();
            this.paddleRight.monitorIdleAnimation();
        }
        this.updateMaps();
        this.ball.particles.updateParticles();
        if (this.ball.isRolling)
            this.ball.monitorMovement();
        this.ball.light.position.copy(this.ball.position);
        this.ball.light.position.y += this.height;
        
        if (this.ball.isRolling)
            this.ball.rotation.y += 0.1;
        if (this.isActive)
            this.paddleLeft.animatePaddle(this);
        this.paddleRight.animatePaddle(this);
        if (keyDown[' '] && this.game.isPlaying && !this.ball.isRolling)
        {
            this.ball.speedX = 0;
            this.ball.acceleration = 0;
            this.ball.updateSpeedBar();
            this.ball.isRolling = true;

            if (this.game.loserPaddle === this.paddleLeft)
            {
                this.ball.speedZ = this.ball.initialSpeed;
                this.ball.isgoingRight = true;
                this.ball.isgoingLeft = false;
            }
            else
            {
                this.ball.speedZ = -this.ball.initialSpeed;
                this.ball.isgoingRight = false;
                this.ball.isgoingLeft = true;
            }
        }
        if (keyDown['1'])  
            this.switchMap(this.oceanMap);
        if (keyDown['2'])
            this.switchMap(this.spaceMap);
        if (keyDown['3'])
            this.switchMap(this.skyMap);
        if (keyDown['4'])
            this.switchMap(this.dragonMap);
        if (keyDown['b'])
        {
            if (!this.isBeingBlurred)
            {
                this.isBeingBlurred = true;
                this.blurScreen();
            }
        }
        if (keyDown['c'])
        {
            this.paddleLeft.light.power += 0.1;
            this.paddleRight.light.power += 0.1;
            this.bot.isPlaying = !this.bot.isPlaying;
        }
        if (keyDown['e'])
        {
            // cameraLeft.position.copy(this.position);
            this.isAnimatingCamera = false;
            this.game.loserPaddle = this.paddleRight;
            this.game.winnerPaddle = this.paddleLeft;
            cameraLeft.position.y += this.length * 3;
            cameraLeft.position.z -= this.length * 3;
            cameraLeft.position.x += this.length * 3;
            this.paddleLeft.particles.isActive = true;
            this.paddleRight.particles.isActive = true;
            this.game.startingTime = Date.now();
            scoreUI[0].style.opacity = 1;
            if (this.game.user2.isBot)
                this.bot.activateBot();
            this.game.isPlaying = true;
            if (!this.game.thirdPlayer)
            {
                this.isSplitScreen = true;
                this.paddleLeft.changePaddleControls(false);
                this.paddleRight.changePaddleControls(false);
                cameraLeft.lookAt(this.position);
                if (!this.game.user2.isBot)
                    swapToSplitScreen();
                else
                    this.setSinglePlayerFov();
                this.setSplitCameraPositions(camera, cameraLeft);
            }
            else
            {
                thirdPlayerUI[0].style.opacity = 1;
                swapToFullScreen();
                this.setTopView(camera, false);
                this.paddleLeft.changePaddleControls(true);
                this.paddleRight.changePaddleControls(true);
            }
        }
        if (keyDown['p'])
        {
            swapToFullScreen();
            this.setTopView(camera, false);
            this.paddleLeft.changePaddleControls(true);
            this.paddleRight.changePaddleControls(true);
        }
        if (this.game.leftScore >= this.game.maxScore || this.game.rightScore >= this.game.maxScore)
        {
            this.game.isPlaying = false;
            this.game.isOver = true;
        }
        if (this.bot.isPlaying)
            this.bot.play();
        if (this.ball.collisionWithLeftPaddle(this.paddleLeft))
            this.ball.goToRight(this.paddleLeft);
        if (this.ball.collisionWithRightPaddle(this.paddleRight))
            this.ball.goToLeft(this.paddleRight);
        if (this.ball.rightScore(this.paddleLeft) && !this.isBeingReset)
        {
            this.ball.particles.isActive = true;
            this.ball.trailParticles.regroupTrail();
            this.addPoint('right');
            if (this.game.leftScore < this.game.maxScore && this.game.rightScore < this.game.maxScore)
                this.resetPoint();
        }
        if (this.ball.leftScore(this.paddleRight) && !this.isBeingReset)
        {
            this.ball.particles.isActive = true;
            this.ball.trailParticles.regroupTrail();
            this.addPoint('left');
            if (this.game.leftScore < this.game.maxScore && this.game.rightScore < this.game.maxScore)
                this.resetPoint();
        }
        if (this.game.rightScore >= this.game.maxScore && !this.isBeingReset)
        {
            this.isBeingReset = true;
            this.game.user2.isWinner = true;
            this.resetPositions(this.paddleLeft, this.paddleRight, false, this.glitchLeft);
        }
        else if (this.game.leftScore >= this.game.maxScore && !this.isBeingReset)
        {
            this.isBeingReset = true;
            this.game.user1.isWinner = true;
            this.resetPositions(this.paddleRight, this.paddleLeft, true, this.glitchRight);
        }
    }
    setSplitCameraPositions(_cameraRight, _cameraLeft)
    {
        const duration = 1500;

        this.thirdPlayer.deactivateThirdPlayer();
        let targetY = this.position.y + this.height + this.width / 3;
        let targetZ = this.position.z + this.width * 0.85;
        let targetX = this.position.x;
        // Create tweens for each property
        const leftTween = new TWEEN.Tween(_cameraLeft.position)
            .to({ y: targetY, z: targetZ, x:targetX }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                _cameraLeft.lookAt(this.position);
            })
        targetY = this.position.y + this.height  + this.width / 3;
        targetZ = this.position.z - this.width * 0.85;
        targetX = this.position.x;
        if (this.game.user2.isBot)
        {
            targetY *= 1.3;
            targetZ *= 1.1;
        }
        // Create tweens for each property
        const rightTween = new TWEEN.Tween(_cameraRight.position)
        .to({ y: targetY, z: targetZ, x: targetX }, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            _cameraRight.lookAt(this.position);
        })
        leftTween.start();
        rightTween.start();
    }
    setSinglePlayerFov()
    {
        const duration = 1500;

        new TWEEN.Tween(this.camera.fov)
        .to({value: 81}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            this.camera.updateProjectionMatrix();
        })
        .start();
        
    }
    updateMaps()
    {
        if (this.oceanMap.mapActive)
            this.oceanMap.updateMap();
        if (this.spaceMap.mapActive)
            this.spaceMap.updateMap();
        if (this.dragonMap.mapActive)
            this.dragonMap.updateMap();
        if (this.skyMap.mapActive)
            this.skyMap.updateMap();
    }
    switchMap(map)
    {
        if (this.spaceMap.mapActive && this.spaceMap != map)
        {
            this.spaceMap.closeMap();
            map.initMap();
        }
        else if (this.oceanMap.mapActive && this.oceanMap != map)
        {
            this.oceanMap.closeMap();
            map.initMap();
        }
        else if (this.skyMap.mapActive && this.skyMap != map)
        {
            this.skyMap.closeMap();
            map.initMap();
        }
        else if (this.dragonMap.mapActive && this.dragonMap != map)
        {
            this.dragonMap.closeMap();
            map.initMap();
        }
    }
    getCurrentMap()
    {
        if (this.oceanMap.mapActive)
            return this.oceanMap;
        else if (this.spaceMap.mapActive)
            return this.spaceMap;
        else if (this.skyMap.mapActive)
            return this.skyMap;
        else if (this.dragonMap.mapActive)
            return this.dragonMap;
    }
    blurScreen()
    {
        const duration = 1500;
        let target;
        if (!this.isBlurred)
            target = 0.002;
        else
            target = 0;
        new TWEEN.Tween(this.horizontalBlur.uniforms.h)
        .to({value: target}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            this.isBlurred = !this.isBlurred;
            this.isBeingBlurred = false;
        })
        .start();

        new TWEEN.Tween(this.verticalBlur.uniforms.v)
        .to({value: target}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)

        .start();
    }
    setTopView(camera, gameEnded)
    {
        let targetY = this.position.y + this.height + this.width;
        let targetX = this.position.x;
        let targetZ = this.position.z;
        const duration = 1500;
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
        .onComplete(() => {
            this.isSplitScreen = false;
            if (!gameEnded)
                    this.thirdPlayer.activateThirdPlayer();
        })
        .start();
    }
    resetPoint()
    {
        this.ball.isgoingRight = true;
        this.ball.isgoingLeft = false;
        this.ball.speedZ = 0;
        this.ball.speedX = 0;
        this.ball.isRolling = false;
        this.ball.bounceCount = 0;
        this.ball.particles.explodeParticles(this.ball.position, this.ball.initialColor);
        this.ball.position.copy(this.ball.startingPoint);
        this.ball.updateSpeedBar();
    }
    resetPositions(loserPaddle, winnerPaddle, leftScored, whichGlitch)
    {
        if (this.game.isOver)
            return;
        let duration = 1150;

        this.thirdPlayer.deactivateThirdPlayer();
        loserPaddle.light.power = 0;
        winnerPaddle.light.power = 0;
        this.ball.light.power = 0;
        let tmpCamera;
        if (leftScored)
            tmpCamera = cameraLeft;
        else
            tmpCamera = camera;
        // BALL UP
        let ballUp = new TWEEN.Tween(this.ball.position)
        .to({y: (this.ball.position.y + this.paddleLeft.height * 5), z: winnerPaddle.position.z}, 1500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            this.ball.rotation.y += 0.1;
            this.ball.rotation.z += 0.1;
        });

        // BALL TO CAMERA
        let ballToCamera = new TWEEN.Tween(this.ball.position)
        .to({x: tmpCamera.position.x, y: tmpCamera.position.y, z: tmpCamera.position.z}, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            glitch(whichGlitch);
        });

        // PADDLE RESETS
        let leftReset = new TWEEN.Tween(this.paddleLeft.position)
        .to({x: this.position.x}, duration)
        .easing(TWEEN.Easing.Quadratic.Out);
        let rightReset = new TWEEN.Tween(this.paddleRight.position)
        .to({x: this.position.x}, duration)
        .easing(TWEEN.Easing.Quadratic.Out);

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
            this.ball.isgoingRight = true;
            this.ball.isgoingLeft = false;
            this.ball.light.power = this.ball.startingPower;
            this.ball.bounceCount = 0;
            this.isBeingReset = false;
            this.game.isPlaying = false;
            this.game.gameTime = Date.now() - this.game.startingTime;
            this.game.isOver = false;
            swapToFullScreen();
            if (this.game.thirdPlayer)
                thirdPlayerUI[0].style.opacity = 1;
            this.paddleLeft.particles.explodeParticles(this.paddleLeft.position, this.paddleLeft.defaultColor);
            this.paddleRight.particles.explodeParticles(this.paddleRight.position, this.paddleRight.defaultColor);
            this.ball.particles.explodeParticles(this.ball.position, this.ball.initialColor);
            this.paddleLeft.particles.isActive = false;
            this.paddleRight.particles.isActive = false;
            this.ball.particles.isActive = false;
            this.idleCameraAnimation();
            const winningScreen = document.querySelector('.winning-screen');
            const winningText = document.getElementById('winningText');
            const scoreText = document.getElementById('scoreText');
            scoreText.textContent = this.game.leftScore + ' - ' + this.game.rightScore;
            if (this.game.leftScore === 3)
                winningText.textContent = this.game.user1.username + ' wins!';
            else
                winningText.textContent = this.game.user2.username + ' wins!';
            winningScreen.classList.add('visible');
            if (this.game.user2.isBot === 'Bot')
                this.bot.deactivateBot();
        });
        let targetLight = loserPaddle.defaultLight;
        if (this.getCurrentMap() === this.dragonMap)
           targetLight = loserPaddle.defaultLight / 10; 
        const powerPaddleLight = new TWEEN.Tween(loserPaddle.light)
        .to({power: targetLight}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            winnerPaddle.light.power = loserPaddle.light.power;
        });
        const powerBallLight = new TWEEN.Tween(this.ball.light)
        .to({power: this.ball.startingPower}, duration)
        .easing(TWEEN.Easing.Quadratic.Out);

        ballUp.chain(ballToCamera);
        ballToCamera.chain(leftReset, rightReset, firstTween);
        firstTween.chain(secondTween, powerPaddleLight, powerBallLight);
        ballUp.start();
        this.ball.isRolling = false;
        this.ball.speedZ = 0;
        this.ball.speedX = 0;
    }
    resetUIForRematch()
    {
        this.game.isOver = false;
        this.isBeingReset = false;
        this.resetUI();
        const winningScreen = document.querySelector('.winning-screen');
        winningScreen.classList.remove('visible');
    }
    displayBackPanel()
    {
        this.resetUI();
        if (this.game.user2.isBot)
            this.bot.deactivateBot();
        this.gameState.inGame = false;
        this.gameState.inLobby = true;
        endGame(this.game.tournamentGame);
        const winningScreen = document.querySelector('.winning-screen');
        winningScreen.classList.remove('visible');
        scoreUI[0].style.opacity = 0;
        this.game.isOver = false;
        this.isBeingReset = false;
    }
}

// PADDLE CLASS

class Paddle extends THREE.Group {
    constructor(arena, left) {
        super();

        // Calculate paddle dimensions based on arena size
        const paddleWidth = arena.width * 0.1; // 20% of arena width
        const paddleHeight = arena.length * 0.05; // 5% of arena height
        const paddleDepth = paddleHeight * 0.25; // 2% of arena depth

       // Create geometry for the paddle
       const geometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);

       // Create material
       this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });

       // Create paddle mesh
       this.paddleMesh = new THREE.Mesh(geometry, this.material);

       // Add paddle mesh to the group
       this.add(this.paddleMesh);

        // Store the model name
        if (left)
            this.modelName = '../../static/game/models/spaceShip/scene.gltf';
        else
            this.modelName = '../../static/game/models/spaceShip/scene.gltf';
        this.model;
        // Load Blender model
        const loader = new GLTFLoader();
        loader.load(
            this.modelName,
            (gltf) => {
                this.model = gltf.scene;
                // Position the this.model relative to the paddle
                if (!left) {
                    this.model.position.set(0, 0, 2); // Adjust position as needed
                    this.model.rotation.y = Math.PI;
                }
                else
                    this.model.position.set(0, 0, -2); // Adjust position as needed
                if (left)
                    this.model.scale.set(0.2, 0.2, 0.2); // Adjust scale as needed
                else
                    this.model.scale.set(0.2, 0.2, 0.2); // Adjust scale as needed
                // Add the this.model to the group
                this.add(this.model);
                
                // Now you can access the position of paddle.paddleMesh
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
            }
        );

        // Set position of the paddle mesh
        this.paddleMesh.position.set(0, 0, 0);

        // Set position of the group (including both paddle mesh and model)
        const arenaTopY = arena.position.y + arena.height / 2;
        this.position.set(
            arena.position.x,
            arenaTopY + paddleHeight / 2, // Adjust for paddle height
            arena.position.z + arena.width / 2
        );
        if (left)
        {
            this.position.z -= arena.width;
            this.camera = cameraLeft;
            this.rightKey = 'a';
            this.leftKey = 'd';
            this.chargeKey = 'w';
        }
        else
        {
            this.camera = camera;
            this.rightKey = 'ArrowRight';
            this.leftKey = 'ArrowLeft';
            this.chargeKey = 'ArrowUp';
        }
        this.width = paddleWidth;
        this.height = paddleHeight;
        this.depth = paddleDepth;
        // Store arena reference
        this.arena = arena;
        this.scene = scene;
        this.left = left;
        this.canDash = true;
        // Add other properties and methods as needed
        if (arena.graphics === 'low')
            this.particleNumber = 0;
        else if (arena.graphics === 'medium')
            this.particleNumber = 250;
        else if (arena.graphics === 'high')
            this.particleNumber = 500;
        this.particles = new Particle(this.scene, this.particleNumber, left, this, false);
        this.light = new THREE.PointLight(0x4B4FC5);
        scene.add(this.light);
        this.defaultMaterial = this.material.clone();
        this.defaultLightColor = this.light.color.clone();
        this.defaultLight = this.arena.width * this.arena.length / 7.5;
        this.light.power = this.defaultLight;
        this.defaultColor = this.material.color.clone();
        this.untouchedDefaultColor = this.material.color.clone();
        this.superChargingColor = new THREE.Color(0xff6e6e);
        this.invertedColor = this.arena.thirdPlayer.ballColor.clone();
        this.slowedColor = this.arena.thirdPlayer.bulletColor.clone();
        this.dashingColor = new THREE.Color(0xf4ff69);
        this.particlesColor = new THREE.Color(0xffffff);
        this.defaultSpeed = 0.016;
        this.moveSpeed = 0.016;
        this.isDashingRight = false;
        this.isDashingLeft = false;
        this.light.castShadow = true;
        this.isPowered = false;
        this.flippingSpeed = 0.5;
        this.isGoingUp = true;
        this.modelName;
        this.mixer;
        this.isGoingDown = false;

    }
    async changeBlenderModel(modelName, scale, position, rotationFactor)
    {
        this.remove(this.model);
        this.scene.remove(this.model);
        scene.needsUpdate = true;
        const loader = new GLTFLoader();
        loader.load(
            modelName,
            (gltf) => {
                this.model = gltf.scene;
                this.modelName = modelName;
                // Position the this.model relative to the paddle
                if (!this.left)
                {
                    this.model.position.set(0, 0, position); // Adjust position as needed
                    if (rotationFactor == -1)
                        this.model.rotation.y = -Math.PI;
                    else if (rotationFactor == 1)
                        this.model.rotation.y = 0;
                    else if (rotationFactor == 0)
                    {
                        this.model.position.y -= 2;
                        this.model.rotation.z = Math.PI;
                        // this.model.rotation.y = Math.PI / 2;
                    }
                    else if (rotationFactor == 2)
                        this.model.rotation.y = 0;       
                    else if (rotationFactor == 3)
                        this.model.rotation.y = Math.PI / 2;                 

                }
                else
                {
                    this.model.position.set(0, 0, -position); // Adjust position as needed
                    if (rotationFactor == -1)
                        this.model.rotation.y = 0;
                    else if (rotationFactor == 1)
                        this.model.rotation.y = -Math.PI;
                    else if (rotationFactor == 0)
                    {
                        this.model.position.y -= 2;
                        this.model.rotation.y = -Math.PI;
                        this.model.rotation.z = Math.PI;
                        // this.model.rotation.y = - Math.PI / 2;
                    }
                    else if (rotationFactor == 2)
                        this.model.rotation.y = Math.PI;
                    else if (rotationFactor == 3)
                        this.model.rotation.y = -Math.PI / 2;
                }

                this.model.scale.set(scale, scale, scale); // Adjust scale as needed
                this.add(this.model);

                if (this.arena.dragonMap.mapActive || this.arena.skyMap.mapActive)
                {
                    if (gltf.animations)
                    {
                        this.mixer = new THREE.AnimationMixer(this.model);
                        let animation1;
                        if (this.arena.skyMap.mapActive)
                            animation1 = this.mixer.clipAction(gltf.animations[0]);
                        else
                            animation1 = this.mixer.clipAction(gltf.animations[0]);
                        if (this.left)
                            animation1.play();
                        else
                        {
                            setTimeout (() => {
                                animation1.play();
                            }, 500);
                        }
                    }
                }
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    }
    monitorIdleAnimation()
    {
        const animationRange = 0.5;
        const duration = 1000;
        if (this.isGoingUp)
        {
            this.isGoingUp = false;
            const targetY = this.model.position.y + animationRange;
            const upTween = new TWEEN.Tween(this.model.position)
            .to({y: targetY}, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                this.isGoingDown = true;
            })
            upTween.start();
        }
        if (this.isGoingDown)
        {
            this.isGoingDown = false;
            const targetY = this.model.position.y - animationRange;
            const downTween = new TWEEN.Tween(this.model.position)
            .to({y: targetY}, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                this.isGoingUp = true;
            })
            downTween.start();
        }
    }
    animatePaddle(arena)
    {
        if (doubleKeyPress[this.rightKey] && this.canDash && arena.game.powerUpsActivated) {
            this.canDash = false;
            this.isDashingRight = true;
            this.dash(arena.width * 20, false);
            doubleKeyPress[this.rightKey] = false;
        }
        if (doubleKeyPress[this.leftKey] && this.canDash && arena.game.powerUpsActivated) {
            this.canDash = false;
            this.isDashingLeft = true;
            this.dash(arena.width * -20, true);
            doubleKeyPress[this.leftKey] = false;
        }
        // Detect normal paddle movement
        if (keyDown[this.rightKey] && this.position.x + (this.moveSpeed / 2) <= arena.rightCorner.x) {
            this.position.x += this.moveSpeed * arena.length;
            if (arena.ball.isSupercharging && (this.position.z * arena.ball.position.z > 0))
                arena.ball.position.x += this.moveSpeed * arena.length;
        }
        if (keyDown[this.leftKey] && this.position.x - (this.moveSpeed / 2) >= arena.leftCorner.x) {
            this.position.x -= this.moveSpeed * arena.length;
            if (arena.ball.isSupercharging && (this.position.z * arena.ball.position.z > 0))
                arena.ball.position.x -= this.moveSpeed * arena.length;
        }
        if (keyDown[this.chargeKey] && arena.game.powerUpsActivated)
        {
            this.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleSuperchargingColor);
            this.isPowered = true;
        }
        if (this.arena.ball.isSupercharging && this.position.z * this.arena.ball.position.z > 0)
            this.model.rotation.z += this.flippingSpeed;
    }
    dash(range, isLeft)
    {
        let targetX;
        if (!this.arena.game.powerUpsActivated)
            return ;
        if (this.left)
            this.arena.game.user1.nbDashes++;
        else
            this.arena.game.user2.nbDashes++;
        this.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleDashingColor);
        targetX = this.position.x + range * this.moveSpeed;
        if (!isLeft) {
            if (targetX > this.arena.rightCorner.x)
                targetX = this.arena.rightCorner.x;
        }
        else {
            if (targetX < this.arena.leftCorner.x)
                targetX = this.arena.leftCorner.x;
        }
        if (this.arena.ball.isSupercharging && (this.position.z * this.arena.ball.position.z > 0))
        {
            new TWEEN.Tween(this.arena.ball.position)
            .to({x: targetX}, 250)
            .easing(TWEEN.Easing.Linear.None)
            .start();
        }
        new TWEEN.Tween(this.position)
        .to({x: targetX}, 250)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            setTimeout(() => {
                if (this.isPowered)
                    this.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleSuperchargingColor);
                else
                    this.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleDefaultColor);
            }, 50);
                
        })
        .start();
        // make the spaceship flip while dashing
        let targetRotation;
        if ((isLeft && !this.left) || (!isLeft && this.left))
            targetRotation = this.model.rotation.z - Math.PI * 2;
        else
            targetRotation = this.model.rotation.z + Math.PI * 2;
        new TWEEN.Tween(this.model.rotation)
        .to({z: targetRotation}, 400)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
            this.canDash = true;
            this.isDashingLeft = false;
            this.isDashingRight = false;
            if (this.model.rotation.z  % (Math.PI * 2) != 0)
            {
                if (this.arena.dragonMap.mapActive)
                    this.model.rotation.z = Math.PI;
                else
                    this.model.rotation.z = 0;
            }
        })
        .start();
    }
    changePaddleControls(toTopView)
    {
        if (toTopView)
        {
            if (this.left)
            {
                this.rightKey = 'w';
                this.leftKey = 's';
                this.chargeKey = 'd';
            }
            else
            {
                this.rightKey = 'ArrowUp';
                this.leftKey = 'ArrowDown';
                this.chargeKey = 'ArrowLeft';
            }
        }
        else
        {
            if (this.left)
            {
                this.rightKey = 'a';
                this.leftKey = 'd';
                this.chargeKey = 'w';
            }
            else
            {
                this.rightKey = 'ArrowRight';
                this.leftKey = 'ArrowLeft';
                this.chargeKey = 'ArrowUp';
            }
        }
    }
    swapPaddleControls()
    {
        const tmp = this.leftKey;
        this.leftKey = this.rightKey;
        this.rightKey = tmp;
        this.paddleMesh.material.color.set(this.arena.getCurrentMap().invertedColor);
        this.defaultColor.set(this.invertedColor);

        setTimeout(() => {
            const tmp = this.leftKey;
            this.leftKey = this.rightKey;
            this.rightKey = tmp;
            this.defaultColor.set(this.untouchedDefaultColor);
            if (!this.isPowered)
                this.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleDefaultColor);
            else
                this.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleSuperchargingColor);
        }, 1000);
    }
    slowDown()
    {
        if (this.moveSpeed === this.defaultSpeed)
        {
            this.moveSpeed *= 0.6;
        if (!this.isPowered)
            this.paddleMesh.material.color.set(this.arena.getCurrentMap().slowedColor);
        this.defaultColor.set(this.slowedColor);
        setTimeout(() => {
            if (!this.isPowered)
                this.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleDefaultColor);
            this.defaultColor.set(this.untouchedDefaultColor);
            this.moveSpeed = this.defaultSpeed;
        }, 1000);
        }
    }
}

const speedBar = document.getElementsByClassName("speedbar");
const centerRect = document.getElementsByClassName("centerRectangle");

class Ball extends THREE.Mesh {
    constructor(arena)
    {
        // BALL CREATION
        const size = arena.width * 0.025;
        const geometry = new THREE.SphereGeometry(size, 16, 8);
        const textureLoader = new THREE.TextureLoader();
        // const texture = textureLoader.load('ball.jpg');
        const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false});
        super(geometry, material);
        this.light = new THREE.PointLight(0xffffff);
        scene.add(this.light);
        this.startingPower = 20;
        this.size = size;
        this.light.power = this.startingPower;
        this.light.castShadow = true;
        // ATRIBUTES
        this.scene = scene;
        this.arena = arena;
        this.radius = arena.width * 0.025;
        this.startingPoint = new THREE.Vector3(arena.position.x, arena.position.y + arena.height / 2 + this.radius, arena.position.z);
        this.position.copy(this.startingPoint);
        this.previousPosition = new THREE.Vector3();
        this.isRolling = false;
        this.speedX = 0;
        this.speedZ = 0;
        this.acceleration = 0;
        this.accelerationStrength = 0.01;
        this.isgoingLeft = false;
        this.isgoingRight = false;
        this.defaultMaterial = this.material.clone();
        this.initialColor = this.material.color.clone();
        this.invertedColor = this.arena.thirdPlayer.ballColor.clone();
        this.speedColor = this.arena.thirdPlayer.bulletColor.clone();
        this.finalColor = new THREE.Color(0xFFFFFF);
        this.zLimit1 = arena.position.z + arena.width / 2;
        this.zLimit2 = arena.position.z - arena.width / 2;
        this.initialSpeed = this.arena.width / 200;
        this.isSupercharging;
        this.bounceCount = 0;
        this.justCollisioned = false;
        if (arena.graphics === 'low')
            this.particleNumber = 0;
        else if (arena.graphics === 'medium')
            this.particleNumber = 1000;
        else if (arena.graphics === 'high')
            this.particleNumber = 15000;
        this.particles = new Particle(this.scene, this.particleNumber, false, this, true);
        this.trailParticles = new TrailParticles(this.scene, this, 75);

    }
    updateSpeedBar() {
        const percent = -95 * (Math.abs(this.speedZ)) / this.arena.maxSpeed + 100;
        if (Math.abs(this.speedZ) === this.arena.maxSpeed * this.arena.thirdPlayer.speedBoost || Math.abs(this.speedZ) === this.arena.maxSpeed * Math.pow(this.arena.thirdPlayer.speedBoost, 2))
            return;
        const hue = 10 + (percent / 100) * 60;
        let color = `hsl(${hue}, 100%, 50%)`;
        for (let i = 0; i < speedBar.length; i++) {
            if (i === 1)
                color = `hsl(${hue - 6}, 100%, 50%)`;
            speedBar.item(i).animate([{
                top: percent + '%',
                left: percent + '%',
                backgroundColor: color,
            }], {duration: 500, fill: "forwards"})
        }
    }
    leftScore(paddle)
    {
        return (this.position.z > paddle.position.z + paddle.width);
    }
    rightScore(paddle)
    {
        return (this.position.z < paddle.position.z - paddle.width);
    }
    collisionWithBorder(paddle1, paddle2)
    {
        return (this.position.z >= paddle1.position.z || this.position.z <= paddle2.position.z);
    }
    checkCollisionBoxSphere(box, sphere) {
        // Get the bounding box of the box object
        let boxBox = new THREE.Box3().setFromObject(box.paddleMesh);
    
        // Get the bounding sphere of the sphere object
        let sphereSphere = new THREE.Sphere();
        sphere.geometry.computeBoundingSphere();
        sphereSphere.copy(sphere.geometry.boundingSphere);
        sphereSphere.applyMatrix4(sphere.matrixWorld);
    
        // Check for intersection between the box and sphere bounding volumes
        return boxBox.intersectsSphere(sphereSphere);
    }
    collisionWithLeftPaddle(paddle)
    {
        if (this.checkCollisionBoxSphere(paddle, this) && this.isgoingLeft && Math.abs(this.speedZ) > 0)
        {
            paddle.particles.explodeParticles(paddle.position, paddle.particlesColor);
            this.arena.game.user1.nbBounces++;
            this.justCollisioned = true;
            this.isgoingLeft = !this.isgoingLeft;
            this.isgoingRight = !this.isgoingRight;
            this.bounceCount++;
            if (!paddle.isPowered)
            {
                let targetPosition;
                let initialPosition = paddle.model.position.z;
                targetPosition = paddle.model.position.z - 2 * -this.speedZ;
                const gobackTween = new TWEEN.Tween(paddle.model.position)
                .to({z: targetPosition}, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                const goForthTween = new TWEEN.Tween(paddle.model.position)
                .to({z: initialPosition}, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                gobackTween.chain(goForthTween);
                gobackTween.start();
            }
            return true;
        }
        return false;
    }
    collisionWithRightPaddle(paddle)
    {
        if (this.checkCollisionBoxSphere(paddle, this) && this.isgoingRight && this.speedZ > 0)
        {
            this.arena.game.user2.nbBounces++;
            paddle.particles.explodeParticles(paddle.position, paddle.particlesColor);
            this.justCollisioned = true;
            this.isgoingRight = !this.isgoingRight;
            this.isgoingLeft = !this.isgoingLeft;
            this.bounceCount++;
            if (!paddle.isPowered)
            {
                let targetPosition;
                let initialPosition = paddle.model.position.z;
                targetPosition = paddle.model.position.z + 2 * this.speedZ;
                const gobackTween = new TWEEN.Tween(paddle.model.position)
                .to({z: targetPosition}, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                const goForthTween = new TWEEN.Tween(paddle.model.position)
                .to({z: initialPosition}, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                gobackTween.chain(goForthTween);
                gobackTween.start();
            }
            return true;
        }
        return false;
    }
    goToLeft(paddle)
    {
        if (!paddle.isPowered)
        {
            let distanceFromCenter = (this.position.x - paddle.position.x) / paddle.width;
            if (distanceFromCenter * (this.position.x - paddle.paddleMesh.position.x) > 0)
                this.speedX = distanceFromCenter * 0.015 * this.arena.width;
            else
                this.speedX += distanceFromCenter * 0.015 * this.arena.width;
            if (Math.abs(this.speedZ) * 1.08 <= this.arena.width / 40)
                this.speedZ *= -1.08;
            else
                this.speedZ *= -1;
            if (paddle.isDashingRight)
                this.acceleration = this.accelerationStrength * this.speedZ;
            else if (paddle.isDashingLeft)
                this.acceleration = -this.accelerationStrength * this.speedZ;
            else if (this.arena.game.effectsOnly)
            {
                if (Math.random() > 0.5)
                    this.acceleration = this.accelerationStrength * this.speedZ;
                else
                    this.acceleration = -this.accelerationStrength * this.speedZ;
            }
            else
                this.acceleration = 0;
            this.updateSpeedBar();
        }
        else
        {
            this.isSupercharging = true;
            const tmpSpeed = this.speedZ;
            this.speedZ = 0;
            this.acceleration = 0;
            this.speedX = 0;
            setTimeout(() => {
                if (Math.abs(this.tmpSpeed) * 1.5 >= this.arena.maxSpeed)
                    this.speedZ = tmpSpeed * -1;
                else
                    this.speedZ = tmpSpeed * -1.5;
                if (Math.abs(this.speedZ) > this.arena.maxSpeed)
                {
                    if (this.speedZ * this.arena.maxSpeed < 0)
                        this.speedZ = this.arena.maxSpeed * -1;
                    else
                        this.speedZ = this.arena.maxSpeed;
                }
                this.updateSpeedBar();
                this.speedX = (this.position.x - paddle.position.x) / paddle.width * 0.015 * this.arena.width;
                this.isSupercharging = false;
                const rotationReset = paddle.model.rotation.z + (Math.PI * 2 - paddle.model.rotation.z % Math.PI);
                new TWEEN.Tween(paddle.model.rotation)
                .to({z: rotationReset}, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    if (!paddle.isDashingLeft && !paddle.isDashingRight)
                    {
                        if (paddle.arena.dragonMap.mapActive)
                            paddle.model.rotation.z = Math.PI;
                        else
                            paddle.model.rotation.z = 0;
                    }
                    this.arena.game.user2.nbPowerUsed++;
                })
                .start();
                paddle.isPowered = false;
                paddle.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleDefaultColor);
            }, 1500);
        }
    }
    goToRight(paddle)
    {
        if (!paddle.isPowered)
        {
            let distanceFromCenter = (this.position.x - paddle.position.x) / paddle.width;
            if (distanceFromCenter * (this.position.x - paddle.position.x) > 0)
                this.speedX = distanceFromCenter * 0.015 * this.arena.width;
            else
                this.speedX += distanceFromCenter * 0.015 * this.arena.width;
            if (Math.abs(this.speedZ) * 1.08 <= this.arena.maxSpeed)
                this.speedZ *= -1.08;
            else
                this.speedZ *= -1;
            if (paddle.isDashingRight)
                this.acceleration = -this.accelerationStrength * this.speedZ;
            else if (paddle.isDashingLeft)
                this.acceleration = this.accelerationStrength * this.speedZ;
            else if (this.arena.game.effectsOnly)
            {
                if (Math.random() > 0.5)
                    this.acceleration = this.accelerationStrength * this.speedZ;
                else
                    this.acceleration = -this.accelerationStrength * this.speedZ;
            }
            else
                this.acceleration = 0;
            this.updateSpeedBar();
        }
        else
        {
            this.isSupercharging = true;
            const tmpSpeed = this.speedZ;
            this.speedZ = 0;
            this.speedX = 0;
            this.acceleration = 0;
            setTimeout(() => {
                if (Math.abs(this.tmpSpeed) * 1.5 >= this.arena.maxSpeed)
                    this.speedZ = tmpSpeed * -1;
                else
                    this.speedZ = tmpSpeed * -1.5;
                if (Math.abs(this.speedZ) > this.arena.maxSpeed)
                {
                    if (this.speedZ * this.arena.maxSpeed < 0)
                        this.speedZ = this.arena.maxSpeed * -1;
                    else
                        this.speedZ = this.arena.maxSpeed;
                }
                this.updateSpeedBar();
                this.speedX = (this.position.x - paddle.position.x) / paddle.width * 0.015 * this.arena.width;
                this.isSupercharging = false;
                const rotationReset = paddle.model.rotation.z + (Math.PI * 2 - paddle.model.rotation.z % Math.PI);
                new TWEEN.Tween(paddle.model.rotation)
                .to({z: rotationReset}, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    if (!paddle.isDashingLeft && !paddle.isDashingRight)
                    {
                        if (paddle.arena.dragonMap.mapActive)
                            paddle.model.rotation.z = Math.PI;
                        else
                            paddle.model.rotation.z = 0;
                    }
                    this.arena.game.user1.nbPowerUsed++;
                })
                .start();
                paddle.isPowered = false;
                paddle.paddleMesh.material.color.set(this.arena.getCurrentMap().paddleDefaultColor);
            }, 1500);
        }
    }
    monitorMovement()
    {
        this.previousPosition.copy(this.position);
        if (this.position.x + this.speedX <= this.arena.position.x - this.arena.length / 2)
            this.speedX *= -1;
        if (this.position.x + this.speedX >= this.arena.position.x + this.arena.length / 2)
            this.speedX *= -1;
        this.position.z += this.speedZ;
        this.position.x += this.speedX;
        this.speedX += this.acceleration;
        this.trailParticles.updateTrail();
    }
    invertMovement()
    {
        this.speedZ *= -1;
        this.isgoingLeft = !this.isgoingLeft;
        this.isgoingRight = !this.isgoingRight;
        this.material.color.set(this.arena.getCurrentMap().invertedColor);
        setTimeout(() => {
            this.material.color.set(this.arena.getCurrentMap().ballColor);
        }, 500);
    }
    increaseSpeed()
    {
        const hasToDivide = Math.abs(this.speedZ) > 0;
        this.speedZ *= this.arena.thirdPlayer.speedBoost;
        this.speedX *= this.arena.thirdPlayer.speedBoost;
        this.material.color.set(this.arena.getCurrentMap().slowedColor);
        setTimeout(() => {
            this.material.color.set(this.arena.getCurrentMap().ballColor);
            if (hasToDivide)
            {
                this.speedZ /= this.arena.thirdPlayer.speedBoost;
                this.speedX /= this.arena.thirdPlayer.speedBoost;
            }
        }, 500);
    }
}

class TrailParticles {
    constructor(scene, ball, maxParticles = 15) {
        this.scene = scene;
        this.ball = ball; // Store the ball object
        this.maxParticles = maxParticles;
        this.trailSpheres = [];

        // Create trail spheres
        for (let i = 0; i < this.maxParticles; i++) {
            const invertedIndex = this.maxParticles - i;
            const sphereSize = invertedIndex * (ball.geometry.parameters.radius / this.maxParticles); // Calculate inverted sphere size
            const trailSphere = new THREE.Mesh(
                new THREE.SphereGeometry(sphereSize, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
            );
            this.scene.add(trailSphere);
            this.trailSpheres.push(trailSphere);
        }
    }

    updateTrail() {
        // Update positions and sizes of trail spheres
        for (let i = this.trailSpheres.length - 1; i > 0; i--) {
            const previousSphere = this.trailSpheres[i - 1];
            const currentSphere = this.trailSpheres[i];
            currentSphere.position.copy(previousSphere.position);
            const invertedIndex = this.trailSpheres.length - i;
            const sphereSize = invertedIndex * (this.ball.geometry.parameters.radius * 0.8 / this.maxParticles);
            currentSphere.scale.set(sphereSize, sphereSize, sphereSize);
        }

        // Set position and size of the first sphere to the ball's position
        this.trailSpheres[0].position.copy(this.ball.position);
        const sphereSize = this.ball.geometry.parameters.radius;
        this.trailSpheres[0].scale.set(sphereSize, sphereSize, sphereSize);
    }

    regroupTrail() {
        // Regroup trail spheres
        for (let i = 0; i < this.trailSpheres.length; i++) {
            this.trailSpheres[i].position.copy(this.ball.arena.position);
            const invertedIndex = this.trailSpheres.length - i;
            const sphereSize = invertedIndex * (this.ball.geometry.parameters.radius / this.maxParticles);
            this.trailSpheres[i].scale.set(sphereSize, sphereSize, sphereSize);
        }
    }

    changeMaterial(material)
    {
        for (let i = 0; i < this.trailSpheres.length; i++) {
            this.trailSpheres[i].material = material;
        }
    }

}

class OceanMap {
    constructor(arena) {
        this.arena = arena;
        this.scene = arena.scene;
        this.currentGraphics = arena.graphics;
        this.waterGeometry = new THREE.PlaneGeometry(3000, 3000);

        this.water = new Water(
            this.waterGeometry,
            {
              textureWidth: 512,
              textureHeight: 512,
              waterNormals: new THREE.TextureLoader().load( '../../static/game/texturePlayground/water/water.jpg', function ( texture ) {
          
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          
              } ),
              sunDirection: new THREE.Vector3(),
              sunColor: 0xffffff,
              waterColor: 0x001e0f,
              distortionScale: 3.7,
              opacity: 1.0,
              fog: scene.fog !== undefined
            }
          );
          this.water.rotation.x = - Math.PI / 2;
          this.water.position.y = -10;
        this.fakeWater = new THREE.Mesh(this.waterGeometry, new THREE.MeshBasicMaterial({color: 0x50AAB3}));
        this.fakeWater.rotation.x = - Math.PI / 2;
        this.fakeWater.position.y = -10;
        this.oceanCubeMapTexture = cubeLoader.load([
            '../../static/game/texturePlayground/skyMap/nx.jpg',
            '../../static/game/texturePlayground/skyMap/px.jpg',
              '../../static/game/texturePlayground/skyMap/py.jpg',
              '../../static/game/texturePlayground/skyMap/ny.jpg',
              '../../static/game/texturePlayground/skyMap/nz.jpg',
              '../../static/game/texturePlayground/skyMap/pz.jpg'
          ]);
        this.reflectiveMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ba99,
            roughness: 0.0,
            metalness: 0.9,
            envMap: this.oceanCubeMapTexture,
            envMapIntensity: 1,
            side: THREE.DoubleSide
          });
        this.lowGraphicArenaMaterial = new THREE.MeshStandardMaterial({color: 0x00ba99});
        this.paddleGlassMaterial = new THREE.MeshStandardMaterial({
            color: 0xfd739d,
            roughness: 0.0,
            metalness: 1,
            envMap: this.oceanCubeMapTexture,
            envMapIntensity: 2,
            side: THREE.DoubleSide
        });
        this.lowGraphicPaddleMaterial = new THREE.MeshStandardMaterial({color: 0xfd739d});
        this.paddleDefaultColor = new THREE.Color(0xfd739d);
        this.paddleDashingColor = new THREE.Color(0xf4ff69);
        this.paddleSuperchargingColor = new THREE.Color(0xff6e6e);
        this.invertedColor = new THREE.Color(0x31FBF3);
        this.slowedColor = new THREE.Color(0xffbb12);
        this.ballColor = new THREE.Color(0x07386d);

        this.ballGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x07386d,
            envMap: this.oceanCubeMapTexture,
            metalness: 0,
            roughness: 0,
            transparent: true,
            opacity: 0.6,
            reflectivity: 0.9,
            refractionRatio: 0.98,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
          });
        this.lowGraphicBallMaterial = new THREE.MeshStandardMaterial({color: 0x07386d});
        this.trailMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x07386d,
            envMap: this.oceanCubeMapTexture,
            metalness: 0,
            roughness: 0,
            transparent: true,
            opacity: 0.2,
            reflectivity: 0.9,
            refractionRatio: 0.98,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
          });
        this.lowGraphicTrailMaterial = new THREE.MeshStandardMaterial({
            color: 0x07386d,
            opacity: 0.2,
            transparent: true
        });

        this.mapActive = false;
        this.particleColor = new THREE.Color(0x89CFF0);
        this.modelName = '../../static/game/models/ship/scene.gltf';
        this.lightRight = new THREE.PointLight(0xffffff, 10, 100);
        this.lightLeft = new THREE.PointLight(0xffffff, 10, 100);
        this.lightRight.position.set(0, this.arena.height * 2, this.arena.width * 1.5);
        this.lightLeft.position.set(0, this.arena.height * 2, -this.arena.width * 1.5);
        this.ambientLight = new THREE.AmbientLight(0x89CFF0, 0.5);
        this.lightRight.castShadow = true;
        this.lightLeft.castShadow = true;
    }
    initMap()
    {
        if (this.mapActive)
            return;
        this.currentGraphics = this.arena.graphics;
        this.mapActive = true;
        if (this.currentGraphics === 'medium' || this.currentGraphics === 'high')
        {
            if (this.currentGraphics === 'medium')
            {
                this.arena.paddleRight.particleNumber = 250;
                this.arena.paddleLeft.particleNumber = 250;
                this.arena.paddleLeft.particles.changeParticleNumber(250);
                this.arena.paddleRight.particles.changeParticleNumber(250);
                this.arena.ball.particles.changeParticleNumber(1000);
                this.arena.ball.particles.changeParticleSize(0.1);
                this.arena.paddleLeft.particles.changeParticleSize(0.1);
                this.arena.paddleRight.particles.changeParticleSize(0.1);
            }
            else if (this.currentGraphics === 'high')
            {
                this.arena.paddleRight.particleNumber = 500;
                this.arena.paddleLeft.particleNumber = 500;
                this.arena.paddleLeft.particles.changeParticleNumber(500);
                this.arena.paddleRight.particles.changeParticleNumber(500);
                this.arena.ball.particles.changeParticleNumber(15000);
                this.arena.ball.particles.changeParticleSize(0.2);
                this.arena.paddleLeft.particles.changeParticleSize(0.2);
                this.arena.paddleRight.particles.changeParticleSize(0.2);
            }
            this.arena.bloomPass.strength = 0.2;
            this.scene.background = this.oceanCubeMapTexture;
            this.arena.material = this.reflectiveMaterial;
            this.arena.ball.material = this.ballGlassMaterial;
            this.arena.ball.trailParticles.changeMaterial(this.trailMaterial);
            this.arena.paddleLeft.paddleMesh.material = this.paddleGlassMaterial;
            this.arena.paddleRight.paddleMesh.material = this.paddleGlassMaterial.clone();
            this.scene.add(this.water);            
        }
        else if (this.currentGraphics === 'low')
        {
            this.arena.bloomPass.strength = 0.0;
            this.scene.background = new THREE.Color(0xF6F1C0);
            this.arena.ball.light.power /= 6;
            this.arena.material = this.lowGraphicArenaMaterial;
            this.arena.ball.material = this.lowGraphicBallMaterial;
            this.arena.paddleRight.particleNumber = 0;
            this.arena.paddleLeft.particles.changeParticleNumber(0);
            this.arena.ball.particles.changeParticleNumber(0);
            this.arena.ball.trailParticles.changeMaterial(this.lowGraphicTrailMaterial);
            this.arena.paddleLeft.paddleMesh.material = this.lowGraphicPaddleMaterial;
            this.arena.paddleRight.paddleMesh.material = this.lowGraphicPaddleMaterial.clone();
            this.scene.add(this.fakeWater);
        }

        this.arena.paddleLeft.changeBlenderModel(this.modelName, 0.2, 6, 1);
        this.arena.paddleRight.changeBlenderModel(this.modelName, 0.2, 6, 1);


        this.arena.paddleLeft.particlesColor = this.particleColor;
        this.arena.paddleRight.particlesColor = this.particleColor;

        this.arena.paddleLeft.light.power = 0;
        this.arena.paddleRight.light.power = 0;

        this.scene.add(this.ambientLight, this.lightRight, this.lightLeft);
    }
    updateMap()
    {
        if (this.currentGraphics != 'low')
            this.water.material.uniforms['time'].value += 1.0 / 60.0;
    }
    closeMap()
    {
        if (this.mapActive)
        {
            this.mapActive = false;
            this.arena.material = this.arena.defaultMaterial;
            this.scene.remove(this.lightRight, this.lightLeft, this.ambientLight, this.mountains);
            if (this.currentGraphics === 'low')
                this.scene.remove(this.fakeWater);
            else
                this.scene.remove(this.water);
            this.arena.paddleLeft.paddleMesh.material = this.arena.paddleLeft.defaultMaterial;
            this.arena.paddleRight.paddleMesh.material = this.arena.paddleRight.defaultMaterial;
            this.arena.ball.material = this.arena.ball.defaultMaterial;
            this.arena.paddleLeft.light.power = this.arena.paddleLeft.defaultLight;
            this.arena.paddleRight.light.power = this.arena.paddleRight.defaultLight;
        }
    }
    changeGraphics(graphics)
    {
        if (graphics === 'low' && this.arena.graphics != 'low')
        {
            this.arena.material = this.lowGraphicArenaMaterial;
            this.arena.paddleLeft.paddleMesh.material = this.lowGraphicPaddleMaterial;
            this.arena.paddleRight.paddleMesh.material = this.lowGraphicPaddleMaterial;
            this.arena.ball.material = this.lowGraphicBallMaterial;
            this.arena.ball.trailParticles.changeMaterial(this.lowGraphicTrailMaterial);
            this.arena.ball.particles.changeParticleNumber(0);
            this.arena.paddleLeft.particleNumber = 0;
            this.arena.paddleRight.particleNumber = 0;
            this.arena.paddleLeft.particles.changeParticleNumber(0);
            this.arena.paddleRight.particles.changeParticleNumber(0);
            this.scene.remove(this.water);
            this.scene.add(this.fakeWater);
            this.arena.bloomPass.strength = 0.0;
            this.scene.background = new THREE.Color(0xF6F1C0);
            this.arena.ball.light.power /= 6;
            this.currentGraphics = 'low';
        }
        else if (graphics === 'medium' && this.currentGraphics != 'medium')
        {
            if (this.currentGraphics === 'low')
            {
                this.scene.remove(this.fakeWater);
                this.scene.add(this.water);
                this.arena.ball.light.power *= 6;
            }
            this.arena.material = this.reflectiveMaterial;
            this.arena.ball.material = this.ballGlassMaterial;
            this.arena.ball.particles.changeParticleNumber(1000);
            this.arena.ball.trailParticles.changeMaterial(this.trailMaterial);
            this.arena.paddleLeft.paddleMesh.material = this.paddleGlassMaterial;
            this.arena.paddleRight.paddleMesh.material = this.paddleGlassMaterial;
            this.arena.paddleLeft.particleNumber = 250;
            this.arena.paddleRight.particleNumber = 250;
            this.arena.paddleLeft.particles.changeParticleNumber(250);
            this.arena.paddleRight.particles.changeParticleNumber(250);
            this.arena.ball.particles.changeParticleSize(0.1);
            this.arena.paddleLeft.particles.changeParticleSize(0.1);
            this.arena.paddleRight.particles.changeParticleSize(0.1);
            this.arena.bloomPass.strength = 0.2;
            this.scene.background = this.oceanCubeMapTexture;
            this.currentGraphics = 'medium';
        }
        else if (graphics === 'high' && this.currentGraphics != 'high')
        {
            if (this.currentGraphics === 'low')
            {
                this.scene.remove(this.fakeWater);
                this.scene.add(this.water);
                this.arena.ball.light.power *= 6;
            }
            this.arena.material = this.reflectiveMaterial;
            this.arena.paddleLeft.paddleMesh.material = this.paddleGlassMaterial;
            this.arena.paddleRight.paddleMesh.material = this.paddleGlassMaterial;
            this.arena.ball.material = this.ballGlassMaterial;
            this.arena.ball.particles.changeParticleNumber(15000);
            this.arena.ball.trailParticles.changeMaterial(this.trailMaterial);
            this.arena.paddleLeft.particleNumber = 500;
            this.arena.paddleRight.particleNumber = 500;
            this.arena.paddleLeft.particles.changeParticleNumber(500);
            this.arena.paddleRight.particles.changeParticleNumber(500);
            this.arena.ball.particles.changeParticleSize(0.2);
            this.arena.paddleLeft.particles.changeParticleSize(0.2);
            this.arena.paddleRight.particles.changeParticleSize(0.2);
            this.arena.bloomPass.strength = 0.2;
            this.scene.background = this.oceanCubeMapTexture;
            this.currentGraphics = 'high';
        }
    }
}

class SpaceMap {
    constructor(arena) {
        this.arena = arena;
        this.scene = arena.scene;
        this.currentGraphics = arena.graphics;
        this.spaceCubeMapTexture = cubeLoader.load([
            '../../static/game/texturePlayground/spaceMap/nx.png',
            '../../static/game/texturePlayground/spaceMap/px.png',
              '../../static/game/texturePlayground/spaceMap/py.png',
              '../../static/game/texturePlayground/spaceMap/ny.png',
              '../../static/game/texturePlayground/spaceMap/nz.png',
              '../../static/game/texturePlayground/spaceMap/pz.png'
          ]);
        this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.renderTarget.texture.format = THREE.RGBFormat;
        this.renderTarget.texture.minFilter = THREE.LinearMipMapLinearFilter;
        this.renderTarget.texture.magFilter = THREE.LinearMipMapLinearFilter;

        this.arenaMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x101030,
            wireframe:false,
            transparent:true,
            metalness: 0.9,
            opacity: 0.9
        });
        this.arenaLowGraphicMaterial = new THREE.MeshBasicMaterial({color: 0x101030});
        this.paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.trailMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.2,
            transparent: true,
        });
        this.particleColor = new THREE.Color(0xffffff);
        this.mapActive = false;
        this.modelName = '../../static/game/models/spaceShip/scene.gltf';
        // PADDLE COLORS
        this.paddleDefaultColor = new THREE.Color(0xffffff);
        this.paddleDashingColor = new THREE.Color(0xf4ff69);
        this.paddleSuperchargingColor = new THREE.Color(0xff6e6e);
        this.invertedColor = new THREE.Color(0x31FBF3);
        this.slowedColor = new THREE.Color(0xffbb12);
        this.ballColor = new THREE.Color(0xffffff);
    }
    initMap()
    {
        if (this.mapActive)
            return;
        this.currentGraphics = this.arena.graphics;
        this.mapActive = true;
        if (this.arena.graphics === 'low')
        {
            this.arena.material = this.arenaLowGraphicMaterial;
            this.arena.bloomPass.strength = 0.0;
            this.scene.background = new THREE.Color(0x000010);
            this.arena.ball.particles.changeParticleNumber(0);
        }
        else
        {
            if (this.currentGraphics === 'medium')
            {
                this.arena.ball.particles.changeParticleSize(0.1);
                this.arena.paddleLeft.particles.changeParticleSize(0.1);
                this.arena.paddleRight.particles.changeParticleSize(0.1);
                this.arena.ball.particles.changeParticleNumber(1000);
            }
            else if (this.currentGraphics === 'high')
            {
                this.arena.ball.particles.changeParticleSize(0.2);
                this.arena.paddleLeft.particles.changeParticleSize(0.2);
                this.arena.paddleRight.particles.changeParticleSize(0.2);
                this.arena.ball.particles.changeParticleNumber(15000);
            }
            this.arena.addStars(2000);
            this.arena.material = this.arenaMaterial;
            this.arena.bloomPass.strength = 1.0;
            this.scene.background = this.spaceCubeMapTexture;
        }
        this.arena.paddleLeft.light.power = this.arena.paddleLeft.defaultLight;
        this.arena.paddleRight.light.power = this.arena.paddleRight.defaultLight;

        this.arena.paddleLeft.material = this.paddleMaterial;
        this.arena.paddleRight.material = this.paddleMaterial;

        this.arena.paddleLeft.particlesColor = this.particleColor;
        this.arena.paddleRight.particlesColor = this.particleColor;

        if (this.arena.paddleLeft.modelName != this.modelName)
        {
            this.arena.paddleLeft.changeBlenderModel(this.modelName, 0.2, 2, -1);
            this.arena.paddleRight.changeBlenderModel(this.modelName, 0.2, 2, -1);
        }
        this.arena.ball.material = this.arena.ball.defaultMaterial;
        this.arena.ball.trailParticles.changeMaterial(this.trailMaterial);
    }
    closeMap()
    {
        if (this.mapActive)
        {
            this.mapActive = false;
            if (this.arena.graphics === 'medium' || this.arena.graphics === 'high')
                this.arena.removeStars();
            this.arena.material = this.arena.defaultMaterial;
        }
    }
    updateMap()
    {
        if (this.arena.graphics === 'low')
            return;
        this.arena.stars.forEach(star => {
            star.position.z += 0.01; // Increase Z position by 0.01
            if (star.position.z > 4000) {
                star.position.z = -4000; // Reset position to -100
            }
        });
    }
    changeGraphics(graphics)
    {
        if (graphics === 'low' && this.arena.graphics != 'low')
            {
                this.arena.removeStars();
                this.arena.paddleLeft.particleNumber = 0;
                this.arena.paddleRight.particleNumber = 0;
                this.arena.paddleLeft.particles.changeParticleNumber(0);
                this.arena.paddleRight.particles.changeParticleNumber(0);
                this.arena.material = this.arenaLowGraphicMaterial;
                this.arena.bloomPass.strength = 0.0;
                this.scene.background = new THREE.Color(0x000010);
                this.currentGraphics = 'low';
            }
        else if (graphics === 'medium' && this.currentGraphics != 'medium')
        {
            if (this.currentGraphics === 'low')
                this.arena.addStars(2000);
            this.arena.paddleLeft.particleNumber = 250;
            this.arena.paddleRight.particleNumber = 250;
            this.arena.paddleLeft.particles.changeParticleNumber(250);
            this.arena.paddleRight.particles.changeParticleNumber(250);
            this.arena.ball.particles.changeParticleNumber(1000);
            this.arena.ball.particles.changeParticleSize(0.1);
            this.arena.paddleLeft.particles.changeParticleSize(0.1);
            this.arena.paddleRight.particles.changeParticleSize(0.1);
            this.arena.material = this.arenaMaterial;
            this.arena.bloomPass.strength = 1.0;
            this.scene.background = this.spaceCubeMapTexture;
            this.currentGraphics = 'medium';
        }
        else if (graphics === 'high' && this.currentGraphics != 'high')
        {
            if (this.currentGraphics === 'low')
                this.arena.addStars(2000);
            this.arena.paddleLeft.particleNumber = 500;
            this.arena.paddleRight.particleNumber = 500;
            this.arena.paddleLeft.particles.changeParticleNumber(500);
            this.arena.paddleRight.particles.changeParticleNumber(500);
            this.arena.ball.particles.changeParticleNumber(15000);
            this.arena.ball.particles.changeParticleSize(0.2);
            this.arena.paddleLeft.particles.changeParticleSize(0.2);
            this.arena.paddleRight.particles.changeParticleSize(0.2);
            this.arena.material = this.arenaMaterial;
            this.arena.bloomPass.strength = 1.0;
            this.scene.background = this.spaceCubeMapTexture;
            this.currentGraphics = 'high';
        }
    }
}

class SkyMap {
    constructor (arena) {
        this.arena = arena;
        this.scene = arena.scene;
        this.currentGraphics = arena.graphics;
        this.skyCubeMapTexture = cubeLoader.load([
            '../../static/game/texturePlayground/sunsetMap/nx.png',
            '../../static/game/texturePlayground/sunsetMap/px.png',
            '../../static/game/texturePlayground/sunsetMap/py.png',
            '../../static/game/texturePlayground/sunsetMap/ny.png',
              '../../static/game/texturePlayground/sunsetMap/nz.png',
              '../../static/game/texturePlayground/sunsetMap/pz.png'
          ]);
        this.reflectiveMaterial = new THREE.MeshStandardMaterial({
            color: 0x6666bb,
            roughness: 0.0,
            metalness: 1,
            envMap: this.skyCubeMapTexture,
            envMapIntensity: 2,
            side: THREE.DoubleSide
        });
        this.lowGraphicArenaMaterial = new THREE.MeshStandardMaterial({color: 0x6666bb});
        this.reflectivePaddleMaterial = new THREE.MeshStandardMaterial({
            color: 0xff957b,
            roughness: 0.0,
            metalness: 1,
            envMap: this.skyCubeMapTexture,
            envMapIntensity: 2,
            side: THREE.DoubleSide
        });
        this.lowGraphicPaddleMaterial = new THREE.MeshStandardMaterial({color: 0xff957b});
        this.paddleDefaultColor = new THREE.Color(0xff957b);
        this.paddleDashingColor = new THREE.Color(0xf4ff69);
        this.paddleSuperchargingColor = new THREE.Color(0xff6e6e);
        this.invertedColor = new THREE.Color(0x31FBF3);
        this.slowedColor = new THREE.Color(0xffbb12);
        this.ballColor = new THREE.Color(0xfd739d);
        this.reflectiveBallMaterial = new THREE.MeshStandardMaterial({
            color: 0xfd739d,
            roughness: 0.0,
            metalness: 1,
            envMap: this.skyCubeMapTexture,
            envMapIntensity: 2,
            side: THREE.DoubleSide
        });
        this.lowGraphicBallMaterial = new THREE.MeshStandardMaterial({color: 0xfd739d});
        this.trailMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfd739d,
            metalness: 0,
            roughness: 0,
            transparent: true,
            opacity: 0.8,
            reflectivity: 0.9,
            refractionRatio: 0.98,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
        });
        this.lowGraphicTrailMaterial = new THREE.MeshStandardMaterial({
            color: 0xfd739d,
            opacity: 0.4,
            transparent: true
        });

        this.mapActive = false;
        this.mixer;
        this.modelName = '../../static/game/models/pixel_plane/scene.gltf';
        this.lightRight = new THREE.PointLight(0xffffff, 10, 100);
        this.lightLeft = new THREE.PointLight(0xffffff, 10, 100);
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        this.lightRight.position.set(0, this.arena.height * 8, this.arena.width * 1.5);
        this.lightLeft.position.set(0, this.arena.height * 8, -this.arena.width * 1.5);
        this.particleColor = new THREE.Color(0x755EA2);
        this.lightRight.castShadow = true;
        this.lightLeft.castShadow = true;
    }
    initMap()
    {
        if (this.mapActive)
            return;
        this.currentGraphics = this.arena.graphics;
        this.mapActive = true;

        if (this.currentGraphics === 'medium' || this.currentGraphics === 'high')
            {
                if (this.currentGraphics === 'medium')
                {
                    this.arena.paddleRight.particleNumber = 250;
                    this.arena.paddleLeft.particleNumber = 250;
                    this.arena.paddleLeft.particles.changeParticleNumber(250);
                    this.arena.paddleRight.particles.changeParticleNumber(250);
                    this.arena.ball.particles.changeParticleNumber(1000);
                    this.arena.ball.particles.changeParticleSize(0.1);
                    this.arena.paddleLeft.particles.changeParticleSize(0.1);
                    this.arena.paddleRight.particles.changeParticleSize(0.1);
                }
                else if (this.currentGraphics === 'high')
                {
                    this.arena.paddleRight.particleNumber = 500;
                    this.arena.paddleLeft.particleNumber = 500;
                    this.arena.paddleLeft.particles.changeParticleNumber(500);
                    this.arena.paddleRight.particles.changeParticleNumber(500);
                    this.arena.ball.particles.changeParticleNumber(15000);
                    this.arena.ball.particles.changeParticleSize(0.2);
                    this.arena.paddleLeft.particles.changeParticleSize(0.2);
                    this.arena.paddleRight.particles.changeParticleSize(0.2);
                }
                this.arena.bloomPass.strength = 0.05;
                this.scene.background = this.skyCubeMapTexture;
                this.arena.material = this.reflectiveMaterial;
                this.arena.ball.material = this.reflectiveBallMaterial;
                this.arena.ball.trailParticles.changeMaterial(this.trailMaterial);
                this.arena.paddleLeft.paddleMesh.material = this.reflectivePaddleMaterial;
                this.arena.paddleRight.paddleMesh.material = this.reflectivePaddleMaterial.clone();
            }
            else if (this.currentGraphics === 'low')
            {
                this.arena.bloomPass.strength = 0.0;
                this.scene.background = new THREE.Color(0x92d5f5);
                this.arena.material = this.lowGraphicArenaMaterial;
                this.arena.ball.material = this.lowGraphicBallMaterial;
                this.arena.paddleRight.particleNumber = 0;
                this.arena.paddleLeft.particles.changeParticleNumber(0);
                this.arena.ball.particles.changeParticleNumber(0);
                this.arena.ball.trailParticles.changeMaterial(this.lowGraphicTrailMaterial);
                this.arena.paddleLeft.paddleMesh.material = this.lowGraphicPaddleMaterial;
                this.arena.paddleRight.paddleMesh.material = this.lowGraphicPaddleMaterial.clone();
                this.arena.paddleRight.light.power /= 10;
                this.arena.paddleLeft.light.power /= 10;
                this.lightRight.power /= 10;
                this.lightLeft.power /= 10;
                this.scene.add(this.ambientLight);
            }

        if (this.arena.paddleLeft.modelName != this.modelName)
        {
            this.arena.paddleLeft.changeBlenderModel(this.modelName, 0.003, 1, 2);
            this.arena.paddleRight.changeBlenderModel(this.modelName, 0.003, 1, 2);
        }
        this.arena.paddleLeft.particlesColor = this.particleColor;
        this.arena.paddleRight.particlesColor = this.particleColor;
        this.scene.add(this.lightRight, this.lightLeft);
    }
    updateMap()
    {
        if (this.arena.paddleLeft.mixer)
            this.arena.paddleLeft.mixer.update(0.04);
        if (this.arena.paddleRight.mixer)
            this.arena.paddleRight.mixer.update(0.04);
    }
    closeMap()
    {
        if (this.mapActive)
        {
            this.mapActive = false;
            this.arena.material = this.arena.defaultMaterial;
            this.arena.ball.material = this.arena.ball.defaultMaterial;
            this.arena.paddleLeft.paddleMesh.material = this.arena.paddleLeft.defaultMaterial;
            this.arena.paddleRight.paddleMesh.material = this.arena.paddleRight.defaultMaterial;
            this.scene.remove(this.lightRight, this.lightLeft);
            this.arena.paddleLeft.particles.changeParticleNumber(this.arena.paddleLeft.particleNumber);
            this.arena.paddleRight.particles.changeParticleNumber(this.arena.paddleRight.particleNumber);
            if (this.currentGraphics === 'low')
            {
                this.arena.paddleRight.light.power *= 10;
                this.arena.paddleLeft.light.power *= 10;
                this.lightRight.power *= 10;
                this.lightLeft.power *= 10;
                this.scene.remove(this.ambientLight);
            }
        }
    }
    changeGraphics(graphic)
    {
        if (graphic === 'low' && this.currentGraphics != 'low')
        {
            this.arena.material = this.lowGraphicArenaMaterial;
            this.arena.paddleLeft.paddleMesh.material = this.lowGraphicPaddleMaterial;
            this.arena.paddleRight.paddleMesh.material = this.lowGraphicPaddleMaterial;
            this.arena.ball.material = this.lowGraphicBallMaterial;
            this.arena.ball.trailParticles.changeMaterial(this.lowGraphicTrailMaterial);
            this.arena.ball.particles.changeParticleNumber(0);
            this.arena.paddleLeft.particleNumber = 0;
            this.arena.paddleRight.particleNumber = 0;
            this.arena.paddleLeft.particles.changeParticleNumber(0);
            this.arena.paddleRight.particles.changeParticleNumber(0);
            this.arena.bloomPass.strength = 0.0;
            this.scene.background = new THREE.Color(0x92d5f5);
            this.arena.paddleRight.light.power /= 10;
            this.arena.paddleLeft.light.power /= 10;
            this.lightRight.power /= 10;
            this.lightLeft.power /= 10;
            this.scene.add(this.ambientLight);
            this.currentGraphics = 'low';   
        }
        else if (graphic === 'medium' && this.currentGraphics != 'medium')
        {
            if (this.currentGraphics === 'low')
            {
                this.scene.remove(this.ambientLight);
                this.arena.paddleRight.light.power *= 10;
                this.arena.paddleLeft.light.power *= 10;
                this.lightRight.power *= 10;
                this.lightLeft.power *= 10; 
            }
            this.arena.paddleLeft.particleNumber = 250;
            this.arena.paddleRight.particleNumber = 250;
            this.arena.paddleLeft.particles.changeParticleNumber(250);
            this.arena.paddleRight.particles.changeParticleNumber(250);
            this.arena.ball.particles.changeParticleSize(0.1);
            this.arena.paddleLeft.particles.changeParticleSize(0.1);
            this.arena.paddleRight.particles.changeParticleSize(0.1);
            this.arena.ball.particles.changeParticleNumber(1000);
            this.arena.material = this.reflectiveMaterial;
            this.arena.paddleLeft.paddleMesh.material = this.reflectivePaddleMaterial;
            this.arena.paddleRight.paddleMesh.material = this.reflectivePaddleMaterial;
            this.arena.ball.material = this.reflectiveBallMaterial;
            this.arena.bloomPass.strength = 0.05;
            this.scene.background = this.skyCubeMapTexture;
            this.currentGraphics = 'medium';
        }
        else if (graphic === 'high' && this.currentGraphics != 'high')
        {
            if (this.currentGraphics === 'low')
            {
                this.scene.remove(this.ambientLight);
                this.arena.paddleRight.light.power *= 10;
                this.arena.paddleLeft.light.power *= 10;
                this.lightRight.power *= 10;
                this.lightLeft.power *= 10; 
            }
            this.arena.paddleLeft.particleNumber = 500;
            this.arena.paddleRight.particleNumber = 500;
            this.arena.paddleLeft.particles.changeParticleNumber(500);
            this.arena.paddleRight.particles.changeParticleNumber(500);
            this.arena.ball.particles.changeParticleNumber(15000);
            this.arena.ball.particles.changeParticleSize(0.2);
            this.arena.paddleLeft.particles.changeParticleSize(0.2);
            this.arena.paddleRight.particles.changeParticleSize(0.2);
            this.arena.material = this.reflectiveMaterial;
            this.arena.paddleLeft.paddleMesh.material = this.reflectivePaddleMaterial;
            this.arena.paddleRight.paddleMesh.material = this.reflectivePaddleMaterial;
            this.arena.ball.material = this.reflectiveBallMaterial;
            this.arena.bloomPass.strength = 0.05;
            this.scene.background = this.skyCubeMapTexture;
            this.currentGraphics = 'high';
        }
    }
}

class DragonMap {
    constructor(arena)
    {
        this.arena = arena;
        this.scene = this.arena.scene;
        this.currentGraphics = arena.graphics;

        this.redCubeMapTexture = cubeLoader.load([
            '../../static/game/texturePlayground/redMap/nx.png',
            '../../static/game/texturePlayground/redMap/px.png',
            '../../static/game/texturePlayground/redMap/py.png',
            '../../static/game/texturePlayground/redMap/ny.png',
              '../../static/game/texturePlayground/redMap/nz.png',
              '../../static/game/texturePlayground/redMap/pz.png'
          ]);
        this.mapActive = false;
        this.mixer;
        this.particleColor = new THREE.Color(0xffff00)
        this.modelName = '../../static/game/models/dragonglb.glb';
          // LOAD THE GLB MODEL OF MOUNTAINS
        const loader = new GLTFLoader();
        loader.load( '../../static/game/models/cuvetteDarkMode.glb', ( gltf ) => {
            this.mountains = gltf.scene;
            this.mountains.scale.set( 13, 13, 13);
            this.mountains.position.set( 0, -this.arena.height * 120, 0 );
            this.mountains.rotation.y = Math.PI;
        });        
        // LAVA MATERIAL
        const textureLoader = new THREE.TextureLoader();

        const cloudTexture = textureLoader.load( '../../static/game/assets/cloud.png' );
        const lavaTexture = textureLoader.load( '../../static/game/assets/lava.jpg' );

        lavaTexture.colorSpace = THREE.SRGBColorSpace;

        cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
        lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;
        this.uvScaleX = 45;
        this.uvScaleY = 90;
        this.uniforms = {

            'fogDensity': { value: 0.00150000000 },
            'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
            'time': { value: 1.0 },
            'uvScale': { value: new THREE.Vector2( 90, 45 ) },
            'texture1': { value: cloudTexture },
            'texture2': { value: lavaTexture }
        };
        this.floorMaterial = new THREE.ShaderMaterial( {
                uniforms: this.uniforms,
                vertexShader: lavaVertexShader,
                fragmentShader: lavaFragmentShader
            } );

        this.arenaMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.0,
            metalness: 1.4,
            envMap: this.redCubeMapTexture,
            envMapIntensity: 1,
            side: THREE.DoubleSide
        });
        this.lowGraphicArenaMaterial = new THREE.MeshStandardMaterial({color: 0x9E3515});
        this.paddleMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            roughness: 0.0,
            metalness: 1.4,
            envMap: this.redCubeMapTexture,
            envMapIntensity: 1,
            side: THREE.DoubleSide
        });
        this.lowGraphicPaddleMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
        this.paddleDefaultColor = new THREE.Color(0xaaaaaa);
        this.paddleDashingColor = new THREE.Color(0xf4ff69);
        this.paddleSuperchargingColor = new THREE.Color(0xff6e6e);
        this.invertedColor = new THREE.Color(0x31FBF3);
        this.slowedColor = new THREE.Color(0xffbb12);
        this.ballColor = new THREE.Color(0xF3BB0B);

        this.ballMaterial = new THREE.MeshStandardMaterial({
            color: 0xF3BB0B,
            roughness: 0.0,
            metalness: 0.8,
            envMap: this.redCubeMapTexture,
            envMapIntensity: 5,
            side: THREE.DoubleSide
        });
        this.lowGraphicBallMaterial = new THREE.MeshStandardMaterial({ color: 0xf3bb0b });
        this.trailMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xF3BB0B,
            metalness: 0,
            roughness: 0,
            transparent: true,
            opacity: 0.2,
            reflectivity: 0.9,
            refractionRatio: 0.98,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
        });
        this.lowGraphicTrailMaterial = new THREE.MeshStandardMaterial({
            color: 0xf3bb0b,
            opacity: 0.2,
            transparent: true
        });
        const groundGeometry = new THREE.PlaneGeometry( 10000, 10000 );
        this.lavaGround = new THREE.Mesh( groundGeometry, this.floorMaterial );
        this.lavaGround.rotation.x =  -Math.PI / 2;
        this.lavaGround.position.y -= 30;
        this.fakeLavaGround = new THREE.Mesh( groundGeometry, new THREE.MeshStandardMaterial({color: 0xff0000}));
        this.fakeLavaGround.rotation.x = -Math.PI / 2;
        this.fakeLavaGround.position.y -= 30;
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    }
    initMap()
    {
        if (this.mapActive)
            return;
        this.currentGraphics = this.arena.graphics;
        this.mapActive = true;
        if (this.currentGraphics === 'medium' || this.currentGraphics === 'high')
        {
            this.scene.background = this.redCubeMapTexture;
            this.scene.add(this.lavaGround, this.mountains);
            this.arena.bloomPass.strength = 0.7;
            this.arena.material = this.arenaMaterial;
            this.mountains.children.material = this.floorMaterial;
            this.arena.ball.material = this.ballMaterial;
            this.arena.ball.trailParticles.changeMaterial(this.trailMaterial);
            this.arena.paddleLeft.paddleMesh.material = this.paddleMaterial;
            this.arena.paddleRight.paddleMesh.material = this.paddleMaterial.clone();
            if (this.currentGraphics === 'high')
            {
                this.arena.paddleLeft.particleNumber = 500;
                this.arena.paddleRight.particleNumber = 500;
                this.arena.paddleLeft.particles.changeParticleNumber(500);
                this.arena.paddleRight.particles.changeParticleNumber(500);
                this.arena.ball.particles.changeParticleNumber(15000);
                this.arena.ball.particles.changeParticleSize(0.2);
                this.arena.paddleLeft.particles.changeParticleSize(0.2);
                this.arena.paddleRight.particles.changeParticleSize(0.2);
            }
            else if (this.currentGraphics === 'medium')
            {
                this.arena.paddleLeft.particleNumber = 250;
                this.arena.paddleRight.particleNumber = 250;
                this.arena.paddleLeft.particles.changeParticleNumber(250);
                this.arena.paddleRight.particles.changeParticleNumber(250);
                this.arena.ball.particles.changeParticleNumber(1000);
                this.arena.ball.particles.changeParticleSize(0.1);
                this.arena.paddleLeft.particles.changeParticleSize(0.1);
                this.arena.paddleRight.particles.changeParticleSize(0.1);
            }
        }
        else if (this.currentGraphics === 'low')
        {
            this.scene.background = new THREE.Color(0x9E3515);
            this.scene.add(this.fakeLavaGround);
            this.arena.bloomPass.strength = 0;
            this.arena.material = this.lowGraphicArenaMaterial;
            this.arena.ball.material = this.lowGraphicBallMaterial;
            this.arena.ball.trailParticles.changeMaterial(this.lowGraphicTrailMaterial);
            this.arena.paddleLeft.paddleMesh.material = this.lowGraphicPaddleMaterial;
            this.arena.paddleRight.paddleMesh.material = this.lowGraphicPaddleMaterial.clone();
            this.scene.add(this.ambientLight);
            this.arena.paddleLeft.particleNumber = 0;
            this.arena.paddleRight.particleNumber = 0;
            this.arena.paddleLeft.particles.changeParticleNumber(0);
            this.arena.paddleRight.particles.changeParticleNumber(0);
            this.arena.ball.particles.changeParticleNumber(0);
        }
        this.arena.paddleLeft.particlesColor = this.particleColor;
        this.arena.paddleRight.particlesColor = this.particleColor;
        this.arena.paddleRight.light.color.set(0xF3BB0B);
        this.arena.paddleLeft.light.color.set(0xF3BB0B);
        this.arena.paddleRight.light.intensity /= 10;
        this.arena.paddleLeft.light.intensity /= 10;

        if (this.arena.paddleLeft.modelName != this.modelName)
        {
            this.arena.paddleLeft.changeBlenderModel(this.modelName, 0.01, 5, 0);
            this.arena.paddleRight.changeBlenderModel(this.modelName, 0.01, 5, 0);
        }
    }
    updateMap()
    {
        if (this.arena.paddleLeft.mixer != undefined)
            this.arena.paddleLeft.mixer.update(0.01);
        if (this.arena.paddleRight.mixer != undefined)
            this.arena.paddleRight.mixer.update(0.01)
        if (this.currentGraphics != 'low')
        {
            this.uniforms[ 'time' ].value += 0.01;
            this.mountains.rotation.y += 0.0003;
        }
    }
    closeMap()
    {
        this.mapActive = false;
        if (this.currentGraphics === 'low')
            this.scene.remove(this.fakeLavaGround, this.ambientLight);
        else
            this.scene.remove(this.lavaGround, this.mountains);
        this.arena.material = this.arena.defaultMaterial;
        this.arena.ball.material = this.arena.ball.defaultMaterial;
        this.arena.paddleLeft.paddleMesh.material = this.arena.paddleLeft.defaultMaterial;
        this.arena.paddleRight.paddleMesh.material = this.arena.paddleRight.defaultMaterial;
        this.arena.paddleLeft.light.intensity *= 10;
        this.arena.paddleRight.light.intensity *= 10;
        this.arena.paddleLeft.light.color.set(this.arena.paddleLeft.defaultLightColor);
        this.arena.paddleRight.light.color.set(this.arena.paddleRight.defaultLightColor);
    }
    changeGraphics(graphic)
    {
        if (graphic === 'low' && this.currentGraphics != 'low')
        {
            this.scene.remove(this.lavaGround, this.mountains);
            this.scene.add(this.fakeLavaGround, this.ambientLight);
            this.arena.material = this.lowGraphicArenaMaterial;
            this.arena.ball.material = this.lowGraphicBallMaterial;
            this.arena.paddleLeft.paddleMesh.material = this.lowGraphicPaddleMaterial;
            this.arena.paddleRight.paddleMesh.material = this.lowGraphicPaddleMaterial;
            this.arena.ball.trailParticles.changeMaterial(this.lowGraphicTrailMaterial);
            this.scene.background = new THREE.Color(0x9E3515);
            this.arena.bloomPass.strength = 0;
            this.arena.paddleLeft.particleNumber = 0;
            this.arena.paddleRight.particleNumber = 0;
            this.arena.paddleLeft.particles.changeParticleNumber(0);
            this.arena.paddleRight.particles.changeParticleNumber(0);
            this.arena.ball.particles.changeParticleNumber(0);
            this.currentGraphics = 'low';
        }
        else if (graphic === 'medium' && this.currentGraphics != 'medium')
        {
            if (this.currentGraphics === 'low')
            {
                this.scene.remove(this.fakeLavaGround, this.ambientLight);
                this.scene.add(this.lavaGround, this.mountains);
                this.arena.material = this.arenaMaterial;
                this.arena.ball.material = this.ballMaterial;
                this.arena.paddleLeft.paddleMesh.material = this.paddleMaterial;
                this.arena.paddleRight.paddleMesh.material = this.paddleMaterial;
                this.arena.ball.trailParticles.changeMaterial(this.trailMaterial);
                this.scene.background = this.redCubeMapTexture;
                this.arena.bloomPass.strength = 0.7;
            }
            this.arena.paddleLeft.particleNumber = 250;
            this.arena.paddleRight.particleNumber = 250;
            this.arena.paddleLeft.particles.changeParticleNumber(250);
            this.arena.paddleRight.particles.changeParticleNumber(250);
            this.arena.ball.particles.changeParticleNumber(1000);
            this.arena.ball.particles.changeParticleSize(0.1);
            this.arena.paddleLeft.particles.changeParticleSize(0.1);
            this.arena.paddleRight.particles.changeParticleSize(0.1);
            this.currentGraphics = 'medium';
        }
        else if (graphic === 'high' && this.currentGraphics != 'high')
        {
            if (this.currentGraphics === 'low')
                {
                    this.scene.remove(this.fakeLavaGround, this.ambientLight);
                    this.scene.add(this.lavaGround, this.mountains);
                    this.arena.material = this.arenaMaterial;
                    this.arena.ball.material = this.ballMaterial;
                    this.arena.paddleLeft.paddleMesh.material = this.paddleMaterial;
                    this.arena.paddleRight.paddleMesh.material = this.paddleMaterial;
                    this.arena.ball.trailParticles.changeMaterial(this.trailMaterial);
                    this.scene.background = this.redCubeMapTexture;
                    this.arena.bloomPass.strength = 0.7;
                }
                this.arena.paddleLeft.particleNumber = 500;
                this.arena.paddleRight.particleNumber = 500;
                this.arena.paddleLeft.particles.changeParticleNumber(500);
                this.arena.paddleRight.particles.changeParticleNumber(500);
                this.arena.ball.particles.changeParticleNumber(15000);
                this.arena.ball.particles.changeParticleSize(0.2);
                this.arena.paddleLeft.particles.changeParticleSize(0.2);
                this.arena.paddleRight.particles.changeParticleSize(0.2);
                this.currentGraphics = 'high';
        }
    }
}

class ThirdPlayer extends THREE.Group {
    constructor(arena) {
        super(); // Call the parent constructor
        this.arena = arena;
        this.ball = undefined; // Initialize the ball as undefined initially
        this.ballInitialPosition = new THREE.Vector3(1.5, 0, 0); // Set the initial position of the ball
        this.shootDirection = new THREE.Vector2(0, 0);
        this.leftShootDirection = new THREE.Vector2(0, 0);
        this.rightShootDirection = new THREE.Vector2(0, 0);
        this.ballColor = new THREE.Color(0x31FBF3); // Set the color of the ball
        this.bulletColor = new THREE.Color(0xffbb12); // Set the color of the bullets
        this.deactivatedPosition = new THREE.Vector3(0, -this.arena.height, 0);
        this.activatedPosition = new THREE.Vector3(-this.arena.width / 2 - 3, this.arena.height , 0);
        // Define spaceship in the outer scope
        let spaceship;

        // Load the spaceship model asynchronously
        const loader = new GLTFLoader();
        loader.load(
            '../../static/game/models/spaceShip/scene.gltf',
            (gltf) => {
                spaceship = gltf.scene; // Assign the loaded model to spaceship
                // Position the spaceship relative to the arena
                spaceship.rotation.y = Math.PI / 2;
                // spaceship.position.set(-this.arena.width / 2 - 2, this.arena.height, 0);
                // Scale the spaceship as needed
                spaceship.scale.set(0.4, 0.4, 0.4);
                // Add the spaceship to the group
                this.add(spaceship);
                this.position.copy(this.deactivatedPosition);
                const bufferGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.1, 0, 0)]);
                const bufferMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }); // Make it invisible
                this.buffer = new THREE.Mesh(bufferGeometry, bufferMaterial);
                this.bulletGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 32, 1, false); // Adjust size and segments as needed
                this.ballGeometry = new THREE.SphereGeometry(0.8, 32, 32); // Adjust size and segments as needed
                const bulletLeftMaterial = new THREE.MeshBasicMaterial({ color: this.bulletColor , opacity: 1, transparent: true}); // Red color for the ball
                const bulletRightMaterial = new THREE.MeshBasicMaterial({ color: this.bulletColor , opacity: 1, transparent: true}); // Red color for the ball
                const ballMaterial = new THREE.MeshStandardMaterial({ color: this.ballColor, opacity: 1, transparent: true }); // Red color for the ball
                this.bulletLeft = new THREE.Mesh(this.bulletGeometry, bulletLeftMaterial);
                this.bulletRight = new THREE.Mesh(this.bulletGeometry, bulletRightMaterial);
                this.ballMesh = new THREE.Mesh(this.ballGeometry, ballMaterial);
                this.bulletLeft.rotation.z = Math.PI / 2;
                this.bulletRight.rotation.z = Math.PI / 2;

                // Position the ball and bullets in front of the spaceship
                this.ballMesh.position.set(4.5, 0, 0); // Adjust position as needed
                this.bulletLeft.position.set(4, -0.5, -2); // Adjust position as needed
                this.bulletRight.position.set(4, -0.5, 2); // Adjust position as needed
                this.buffer.position.set(1, 0, 0);
                // Add the ball and bullets to the group
                this.add(this.ballMesh, this.bulletLeft, this.bulletRight, this.buffer);
                // this.add(this.ballMesh);
                this.direction = new THREE.Vector2(0, 0);
                this.camera = arena.camera;
                this.scene = arena.scene;
                this.isPlaying = false;
                this.ballAttached = true;
                this.speedBoost = 1.5;
                this.bulletLeftAttached = true;
                this.bulletRightAttached = true;
                this.isAnimating = false;

                // Add event listener to track mouse movement
                window.addEventListener('mousemove', (event) => {
                    if (this.isPlaying)
                        this.monitorShipRotation(event);
                });
                window.addEventListener('mousedown', (event) => {
                    if (event.button === 0 && this.isPlaying && this.bulletLeftAttached) // Check if left mouse button (button 0) is clicked
                        this.shootBullet(this.bulletLeft);
                    if (event.button === 1 && this.isPlaying) // Wheel click (button 1)
                        this.shootBall();
                    if (event.button === 2 &&  this.isPlaying && this.bulletRightAttached) // Right mouse button (button 2)
                        this.shootBullet(this.bulletRight);
                });
                window.addEventListener('contextmenu', (event) => {
                    event.preventDefault(); // Prevent default context menu
                });
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
                // Handle the error appropriately
            }
        );
    }
    monitorThirdPlayerMovement() {
        if (keyDown['v'])
            this.rotation.y += 0.1;
        if (keyDown['n'])
            this.rotation.y -= 0.1;
    }
    monitorShipRotation(event) {
        // Calculate the position of the ship's center relative to the screen
        const shipPosition = new THREE.Vector3();
        this.getWorldPosition(shipPosition);

        // Calculate the position of the mouse relative to the screen
        const mousePosition = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        // Unproject the mouse position to the world space using the parent's camera
        if (this.camera)
            mousePosition.unproject(this.camera);
        // Calculate the direction vector from the ship's position to the mouse position
        const direction = new THREE.Vector3();
        direction.subVectors(mousePosition, shipPosition).normalize();

        // Calculate the angle between the ship's forward direction and the direction vector to the mouse
        const angle = Math.atan2(direction.x, direction.z);
        // Rotate the ship towards the mouse
        this.direction.set(direction.x, direction.z * 30);
        this.rotation.y = (angle * 52);
    }
    shootBall() {
        if (this.ballAttached) {
            this.ballAttached = false;
            this.temporarilyDetachBall();
            // calculate vector from ship to ball
            this.shootDirection = new THREE.Vector2(this.ballMesh.position.x - this.position.x, this.ballMesh.position.z - this.position.z).normalize();
            setTimeout(() => {
                this.resetBall();
            }, 2250);
        }
    }
    shootBullet(bullet) {
        const bufferPosition = new THREE.Vector3();
        this.buffer.getWorldPosition(bufferPosition);
        bullet.rotation.y = this.rotation.y;
        this.temporarilyDetachBullet(bullet);
        if (bullet === this.bulletLeft)
        {
            this.bulletLeftAttached = false;
            this.leftShootDirection = new THREE.Vector2(bufferPosition.x - this.position.x, bufferPosition.z - this.position.z).normalize();
        }
        else if (bullet === this.bulletRight)
        {
            this.bulletRightAttached = false;
            this.rightShootDirection = new THREE.Vector2(bufferPosition.x - this.position.x, bufferPosition.z - this.position.z).normalize();
        }
        setTimeout(() => {
            this.resetBullet(bullet);
        }, 1500);
    }
    monitorProjectilesMovement() {
        if (!this.ballAttached) {
            this.ballMesh.position.x += this.shootDirection.x * 0.7;
            this.ballMesh.position.z += this.shootDirection.y * 0.7;

        }
        if (!this.bulletLeftAttached) {
            this.bulletLeft.position.x += this.leftShootDirection.x * 2;
            this.bulletLeft.position.z += this.leftShootDirection.y * 2;

        }
        if (!this.bulletRightAttached) {
            this.bulletRight.position.x += this.rightShootDirection.x * 2;
            this.bulletRight.position.z += this.rightShootDirection.y * 2;
        }
        this.monitorCollisions();
    }
    monitorCollisions() {

        // BALL COLLISIONS
        if (!this.ballAttached) {
            if (this.checkCollisionBallPaddle(this.arena.paddleLeft))
            {
                this.arena.paddleLeft.swapPaddleControls();
                this.ballMesh.position.set(4.5, 0, 0); // Adjust position as needed
                this.ballMesh.material.opacity = 0;
            }
            if (this.checkCollisionBallPaddle(this.arena.paddleRight))
            {
                this.arena.paddleRight.swapPaddleControls();
                this.ballMesh.position.set(4.5, 0, 0); // Adjust position as needed
                this.ballMesh.material.opacity = 0;
            }
            if (this.checkCollisionBallBall(this.arena.ball))
            {
                this.arena.ball.invertMovement();
                this.ballMesh.position.set(4.5, 0, 0); // Adjust position as needed
                this.ballMesh.material.opacity = 0;
            }
        }
        // BULLET LEFT COLLISIONS
        if (!this.bulletLeftAttached) {
            if (this.checkCollisionBulletPaddle(this.bulletLeft, this.arena.paddleLeft))
            {
                this.arena.paddleLeft.slowDown();
                this.bulletLeft.position.set(4, -0.5, -2); // Adjust position as needed
                this.bulletLeft.material.opacity = 0;
            }
            if (this.checkCollisionBulletPaddle(this.bulletLeft, this.arena.paddleRight))
            {
                this.arena.paddleRight.slowDown();
                this.bulletLeft.position.set(4, -0.5, -2); // Adjust position as needed
                this.bulletLeft.material.opacity = 0;
            }
            if (this.checkCollisionBulletBall(this.bulletLeft))
            {
                this.arena.ball.increaseSpeed();
                this.bulletLeft.position.set(4, -0.5, -2); // Adjust position as needed
                this.bulletLeft.material.opacity = 0;
            }
        }
        // BULLET RIGHT COLLISIONS
        if (!this.bulletRightAttached) {
            if (this.checkCollisionBulletPaddle(this.bulletRight, this.arena.paddleLeft))
            {
                this.arena.paddleLeft.slowDown();
                this.bulletRight.position.set(4, -0.5, 2); // Adjust position as needed
                this.bulletRight.material.opacity = 0;
            }
            if (this.checkCollisionBulletPaddle(this.bulletRight, this.arena.paddleRight))
            {
                this.arena.paddleRight.slowDown();
                this.bulletRight.position.set(4, -0.5, 2); // Adjust position as needed
                this.bulletRight.material.opacity = 0;
            }
            if (this.checkCollisionBulletBall(this.bulletRight))
            {
                this.arena.ball.increaseSpeed();
                this.bulletRight.position.set(4, -0.5, 2); // Adjust position as needed
                this.bulletRight.material.opacity = 0;
            }
        }

    }
    temporarilyDetachBall() {
        const ballPosition = new THREE.Vector3();
        this.ballMesh.getWorldPosition(ballPosition);
        this.remove(this.ballMesh);
        this.ballMesh.position.copy(ballPosition);
        scene.add(this.ballMesh);
    }
    temporarilyDetachBullet(bullet) {
        const bulletPosition = new THREE.Vector3();
        bullet.getWorldPosition(bulletPosition);
        this.remove(bullet);
        bullet.position.copy(bulletPosition);
        scene.add(bullet);
    }
    resetBall() {
        this.ballAttached = true;
        this.ballMesh.material.opacity = 0;
        this.ballMesh.position.set(4.5, 0, 0); // Adjust position as needed
        this.add(this.ballMesh);
        new TWEEN.Tween(this.ballMesh.material)
        .to({opacity: 1}, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    }
    resetBullet(bullet) {
        bullet.material.opacity = 0;
        if (bullet === this.bulletLeft)
        {
            this.bulletLeftAttached = true;
            bullet.position.set(4, -0.5, -2); // Adjust position as needed
        }
        else
        {
            this.bulletRightAttached = true;
            bullet.position.set(4, -0.5, 2); // Adjust position as needed
        }
        this.add(bullet);
        new TWEEN.Tween(bullet.material)
        .to({opacity: 1}, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
        bullet.rotation.y = 0;
    }
    checkCollisionBallPaddle(paddle) {
        let paddle1Box = new THREE.Box3().setFromObject(paddle.paddleMesh);

        let sphereSphere = new THREE.Sphere();
        this.ballMesh.geometry.computeBoundingSphere();
        sphereSphere.copy(this.ballMesh.geometry.boundingSphere);
        sphereSphere.applyMatrix4(this.ballMesh.matrixWorld);
    
        return paddle1Box.intersectsSphere(sphereSphere);
    }
    checkCollisionBulletPaddle(bullet, paddle) {
        const boxBox = new THREE.Box3().setFromObject(paddle.paddleMesh);
    
        const cylinderSphere = new THREE.Sphere();
        const cylinderGeometry = bullet.geometry;
        const cylinderMatrixWorld = bullet.matrixWorld;
        cylinderGeometry.computeBoundingSphere();
        cylinderSphere.copy(cylinderGeometry.boundingSphere).applyMatrix4(cylinderMatrixWorld);
    
        return boxBox.intersectsSphere(cylinderSphere);
    }
    checkCollisionBallBall(ball) {
        const sphere1Sphere = new THREE.Sphere();
        const sphere2Sphere = new THREE.Sphere();
        this.ballMesh.geometry.computeBoundingSphere();
        ball.geometry.computeBoundingSphere();
        sphere1Sphere.copy(this.ballMesh.geometry.boundingSphere).applyMatrix4(this.ballMesh.matrixWorld);
        sphere2Sphere.copy(ball.geometry.boundingSphere).applyMatrix4(ball.matrixWorld);
    
        return sphere1Sphere.intersectsSphere(sphere2Sphere);
    }
    checkCollisionBulletBall(cylinder) {
        const cylinderSphere = new THREE.Sphere();
        const cylinderGeometry = cylinder.geometry;
        const cylinderMatrixWorld = cylinder.matrixWorld;
        cylinderGeometry.computeBoundingSphere();
        cylinderSphere.copy(cylinderGeometry.boundingSphere).applyMatrix4(cylinderMatrixWorld);
    
        const sphereSphere = new THREE.Sphere();
        this.arena.ball.geometry.computeBoundingSphere();
        sphereSphere.copy(this.arena.ball.geometry.boundingSphere).applyMatrix4(this.arena.ball.matrixWorld);
    
        return cylinderSphere.intersectsSphere(sphereSphere);
    }
    activateThirdPlayer() {
        this.isPlaying = true;
        const goToYPositionTween = new TWEEN.Tween(this.position)
        .to({y: this.activatedPosition.y }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out);
        const  goToXPositionTween = new TWEEN.Tween(this.position)
        .to({x: this.activatedPosition.x }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out);
        goToXPositionTween.chain(goToYPositionTween);
        goToXPositionTween.start();
    }
    deactivateThirdPlayer() {
        this.isPlaying = false;
        const goToYPositionTween = new TWEEN.Tween(this.position)
        .to({y: this.deactivatedPosition.y }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out);

        const gotoXPositionTween = new TWEEN.Tween(this.position)
        .to({x: this.deactivatedPosition.x }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out);

        goToYPositionTween.chain(gotoXPositionTween);
        goToYPositionTween.start();
    }
}

class Bot {
    constructor(arena, ownPaddle, enemyPaddle)
    {
        this.arena = arena;
        this.ownPaddle = ownPaddle;
        this.enemyPaddle = enemyPaddle;
        this.isPlaying = false;
        this.targetX = 0;
        this.difficulty = "medium";
        this.lastTargetUpdate;
        this.zValue = this.ownPaddle.position.z; // rightpaddle : x positive to the right, z positive
        this.enemyZValue = this.enemyPaddle.position.z;
        this.intervalSet = false;
        this.dashRange = this.arena.width * 20 * this.ownPaddle.moveSpeed;
        this.timeToUpdate = 1000;
        this.dashLikeness = 3;
        this.ballTimeToLand = -1;
        this.paddleTimeToReach = -1;
        this.isHoldingBall = false;
        this.powerUpLikeness = 1;
        this.powerUp = false;
        this.powerUpEnabled = true;
        this.updatesToPowerUp = 0;
        this.dashEnabled = true;
        this.intervalId = null; // Store interval ID
        this.gui;
    }
    activateBot() {
        if (this.difficulty === "easy")
        {
            this.powerUpEnabled = false;
            this.dashEnabled = false;
            this.timeToUpdate = 1500;
        }
        else if (this.difficulty === "medium")
        {
            this.powerUpEnabled = false;
            this.dashEnabled = true;
            this.dashLikeness = 1;
            this.timeToUpdate = 1000;
        }
        else if (this.difficulty === "hard")
        {
            this.powerUpEnabled = true;
            this.dashEnabled = true;
            this.dashLikeness = 5;
            this.timeToUpdate = 1000;
        }
        if (!this.isPlaying)
            this.initGUI();
        this.isPlaying = true;
        if (this.powerUpLikeness)
            this.updatesToPowerUp = (Math.floor(Math.random() * 30) + 1) / this.powerUpLikeness;
    }
    deactivateBot() {
        this.isPlaying = false;
        this.deactivateGui();
    }
    initGUI() {
        this.gui = new dat.GUI();
        this.gui.add(this, 'timeToUpdate', 100, 5000).name('Time To Update').onChange((value) => {
            this.updateInterval(value);
        });
        this.gui.add(this, 'dashLikeness', 1, 5).name('Dash Likeness').onChange((value) => {
            this.dashLikeness = value;
        });
        this.gui.add(this, 'powerUpLikeness', 0, 5).name('Power Up Likeness').onChange((value) => {
            this.powerUpLikeness = value;
            this.updatesToPowerUp = (Math.floor(Math.random() * 30) + 1) / this.powerUpLikeness;
        });
        this.gui.add(this, 'dashEnabled', true, false).name('Dash Enabled').onChange((value) => {
            this.dashEnabled = value
        });
        this.gui.add(this, 'powerUpEnabled', true, false).name('Power Up Enabled').onChange((value) => {
            this.powerUpEnabled = value;
        });
        //close gui
        this.gui.close();
    }
    deactivateGui() {
        this.gui.destroy();
    }
    updateInterval(newInterval) {
        this.timeToUpdate = newInterval;
        if (this.intervalSet) {
            clearInterval(this.intervalId);
            this.intervalId = setInterval(() => this.scanGameInfo(), this.timeToUpdate);
        }
    }
    play() {
        if (!this.intervalSet) {
            this.intervalSet = true;
            this.intervalId = setInterval(() => this.scanGameInfo(), this.timeToUpdate);
        }
        if (this.positionReached(this.ownPaddle.position.x, this.targetX) && this.isHoldingBall)
            this.targetX = this.generateRandomTarget();
        if (this.updatesToPowerUp <= 0)
        {
            this.powerUp = true;
            this.updatesToPowerUp = (Math.floor(Math.random() * 30) + 1) / this.powerUpLikeness;
        }
        else
            this.powerUp = false;
        this.moveToTarget(this.targetX);
        this.ballTimeToLand--;
    }
    moveToTarget(targetX)
    {
        if (this.positionReached(this.ownPaddle.position.x, targetX))
        {
            keyDown[this.ownPaddle.leftKey] = false;
            keyDown[this.ownPaddle.rightKey] = false;
            doubleKeyPress[this.ownPaddle.leftKey] = false;
            doubleKeyPress[this.ownPaddle.rightKey] = false;
        }
        else if (this.ownPaddle.position.x < targetX)
        {
            if (this.dashEnabled && this.ownPaddle.position.x + this.dashRange < targetX && this.ballTimeToLand < this.paddleTimeToReach * this.dashLikeness)
                doubleKeyPress[this.ownPaddle.rightKey] = true;
            keyDown[this.ownPaddle.rightKey] = true;
            keyDown[this.ownPaddle.leftKey] = false;
            doubleKeyPress[this.ownPaddle.leftKey] = false;
        }
        else if (this.ownPaddle.position.x > targetX)
        {
            if (this.dashEnabled && this.ownPaddle.position.x - this.dashRange > targetX && this.ballTimeToLand < this.paddleTimeToReach * this.dashLikeness)
                doubleKeyPress[this.ownPaddle.leftKey] = true;
            keyDown[this.ownPaddle.leftKey] = true;
            keyDown[this.ownPaddle.rightKey] = false;
            doubleKeyPress[this.ownPaddle.rightKey] = false;
        }
        if (this.powerUp)
        {
            keyDown[this.ownPaddle.chargeKey] = true;
            this.powerUp = false;
        }
        else
            keyDown[this.ownPaddle.chargeKey] = false;
        if (this.dashEnabled && this.isHoldingBall)
        {
            // dash left if paddle is on the right side of the board
            if (this.ownPaddle.position.x > 0)
            {
                doubleKeyPress[this.ownPaddle.leftKey] = true;
                doubleKeyPress[this.ownPaddle.rightKey] = false;
            }
            // dash right if paddle is on the left side of the board
            else
            {
                doubleKeyPress[this.ownPaddle.rightKey] = true;
                doubleKeyPress[this.ownPaddle.leftKey] = false;
            }
        }
    }
    positionReached(paddleX, targetX)
    {
        return paddleX + this.ownPaddle.width / 2 >= targetX && paddleX - this.ownPaddle.width / 2 <= targetX;
    }
    calculateBallLandingPosition() {
        const ballAcceleration = this.arena.ball.acceleration;
        let ballPositionX = this.arena.ball.position.x;
        let ballPositionZ = this.arena.ball.position.z;
        let ballSpeedX = this.arena.ball.speedX;
        const ballSpeedZ = this.arena.ball.speedZ;

        // if ball is going towards the enemy
        if (this.arena.ball.speedZ * this.ownPaddle.position.z <= 0)
        {
            if (ballSpeedZ < 0) {
                while (ballPositionZ > this.enemyZValue) {
                    ballSpeedX += ballAcceleration;
                    ballPositionX += ballSpeedX;
                    ballPositionZ += ballSpeedZ;
                    if ((ballPositionX + ballSpeedX <= (this.arena.position.x - this.arena.length / 2)) || (ballPositionX + ballSpeedX >= this.arena.position.x +this.arena.length / 2)) // detect collision with border
                        ballSpeedX *= -1;
                }
            }    
        }
        // if ball is going towards the bot
        else
        {
            if (ballSpeedZ > 0) {
                while (ballPositionZ < this.zValue) {
                    ballSpeedX += ballAcceleration;
                    ballPositionX += ballSpeedX;
                    ballPositionZ += ballSpeedZ;
                    if ((ballPositionX + ballSpeedX <= (this.arena.position.x - this.arena.length / 2)) || (ballPositionX + ballSpeedX >= this.arena.position.x +this.arena.length / 2)) // detect collision with border
                        ballSpeedX *= -1;
                }
            }
        }
        return ballPositionX;
    }
    calculateBallTimeToLand()
    {
        if (this.arena.ball.speedZ * this.ownPaddle.position.z <= 0)
        {
            this.ballTimeToLand = -1;
            return;
        }
        let ballPositionZ = this.arena.ball.position.z;
        let ballSpeedZ = this.arena.ball.speedZ;
        let framesToLand = 0;
        while (ballPositionZ < this.zValue) {
            ballPositionZ += ballSpeedZ;
            framesToLand++;
        }
        return framesToLand;
    }
    calculateTimeToReachTarget(paddleX, targetX)
    {
        if (targetX === paddleX)
            return 0;
        const distance = Math.abs(this.ownPaddle.position.x - targetX);
        return distance / (this.ownPaddle.moveSpeed * this.arena.length);
    }
    scanGameInfo()
    {
        this.targetX = this.calculateBallLandingPosition();
        this.ballTimeToLand = this.calculateBallTimeToLand();
        this.paddleTimeToReach = this.calculateTimeToReachTarget(this.ownPaddle.position.x, this.targetX);
        this.isHoldingBall = this.detectSupercharge();
        if (this.powerUpEnabled)
            this.updatesToPowerUp--;
    }
    detectSupercharge()
    {
        return (this.arena.ball.isSupercharging && this.arena.ball.position.z * this.ownPaddle.position.z > 0)
    }
    generateRandomTarget()
    {
        return Math.random() * (this.arena.width - 2) - this.arena.width / 2 + 1;
    }
}

class UserStats {
    constructor(isThirdPlayer, usernameElement, ppElement) {
        this.isThirdPlayer = isThirdPlayer;
        this.isWinner = false;
        this.usernameElement = usernameElement;
        this.ppElement = ppElement;
        this.pointsScored = 0;
        this.pointsTaken = 0;
        this.nbDashes = 0;
        this.nbPowerUsed = 0;
        this.nbBounces = 0;
    
        this.username;
        this.id;
        this.profilePicture;
        this.isBot = false;
    }
    reset()
    {
        if (this.username != 'bot')
            this.isBot = false;
        this.isWinner = false;
        this.pointsScored = 0;
        this.pointsTaken = 0;
        this.nbDashes = 0;
        this.nbPowerUsed = 0;
        this.nbBounces = 0;
    }
    setUser(username, id, profilePicture)
    {
        this.username = username;
        if (username === 'bot')
            this.isBot = true;
        else
            this.isBot = false;
        this.id = id;
        this.profilePicture = profilePicture;
        this.usernameElement.textContent = username;
        this.ppElement.src = profilePicture;
    }
    toJson() {
        return {
            isThirdPlayer: this.isThirdPlayer,
            isWinner: this.isWinner,
            pointsScored: this.pointsScored,
            pointsTaken: this.pointsTaken,
            nbDashes: this.nbDashes,
            nbPowerUsed: this.nbPowerUsed,
            nbBounces: this.nbBounces,
            isBot: this.isBot,
        };
    }
}

class Game {
    constructor() {

        // STUFF FOR ME, DONT TOUCH
        this.maxScore = 3;
        this.isOver = false;
        this.isPlaying = false;

        // INPUT (arenaPage.js)
        this.effectsOnly = false;
        this.powerUpsActivated = true;
        this.thirdPlayer = false;
        this.hasToBeInitialized = false;
        this.tournamentGame = false;
        this.startingTime = 0;
        this.gameTime = 0;
        // next variables are all to be inputed in string format
        this.user1Username = document.getElementById('username1Text');
        this.user2Username = document.getElementById('username2Text');
        this.user3Username = document.getElementById('username3Text');
        this.user1ProfilePicture = document.getElementById('pp1');
        this.user2ProfilePicture = document.getElementById('pp2');
        this.user3ProfilePicture = document.getElementById('pp3');

        this.user1 = new UserStats(false, this.user1Username, this.user1ProfilePicture); // User1 is the left paddle
        this.user2 = new UserStats(false, this.user2Username, this.user2ProfilePicture); // User2 is the right paddle
        this.user3 = new UserStats(true, this.user3Username, this.user3ProfilePicture); // User3 is the third player
        this.map; // (options =  'spaceMap', 'dragonMap', 'skyMap', 'oceanMap')

        // OUTPUT
        this.loserPaddle;
        this.winnerPaddle;
        this.gameMode = 'classic';
        // for each paddle
        this.paddleBounces;
        this.nbPowerUsed;
        this.nbDash;
        this.leftScore = 0;
        this.rightScore = 0;
    }

    resetUsers()
    {
        this.user1.reset();
        this.user2.reset();
        this.user3.reset();
        this.leftScore = 0;
        this.rightScore = 0;
    }

}

class GameState {
    constructor() {
        this.arena;
        this.loading = false;
        this.arenaCreated = false;
        this.inGame = false;
        this.paused = false;
        this.inLobby = true;
        this.graphicsNeedToChange = false; 
        this.graphics = 'medium'; // (options = 'low', 'medium', 'high') (loginPage.js)

    }
    switchLoadingToGame() {
        // Switches loading to false and inGame to true to account for the animation time
        this.arena.loadingScreen.loadingComplete();
    }
    switchGameToLoading() {
        this.inGame = false;
        this.loading = true;
        this.arena.loadingScreen.activateLoadingScreen();
    }
    monitorGameState() {
        if (this.loading && !this.arenaCreated)
        {
            this.arenaCreated = true;
            const centerPosition = new THREE.Vector3(0, 0, 0);
            this.arena = new Arena(centerPosition, 28, 1.7, 34, loadingScreen, this);
        }
        if (this.graphicsNeedToChange)
            this.changeGraphics(this.graphics);
    }
    changeGraphics() {
        this.graphicsNeedToChange = false;
        loadingScreen.changeGraphics(this.graphics);
        lobbyVisuals.changeGraphics(this.graphics);
        if (this.arenaCreated)
        {
            this.arena.getCurrentMap().changeGraphics(this.graphics);
            this.arena.graphics = this.graphics;   
        }
        updateUserGraphicMode(this.graphics);
    }
    togglePause() {
        this.paused = !this.paused;
    }
}

class Particle {
    constructor(scene, particleCount, left, paddle, isBall) {
        this.scene = scene;
        this.particleCount = particleCount;
        this.paddle = paddle;
        this.isBall = isBall;
        this.particlesColor = new THREE.Color(0xffffff);
        this.offsetZ = left ? -2 : 2;
        this.isActive = false;
        
        this.initializeParticles();
    }
    
    initializeParticles() {
        // Create particle geometry
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particleCount * 3);
        this.colors = new Float32Array(this.particleCount * 3);
        
        // Add initial position and color for each particle
        for (let i = 0; i < this.particleCount; i++) {
            this.positions[i * 3] = 1;
            this.positions[i * 3 + 1] = 1;
            this.positions[i * 3 + 2] = 1;
            
            this.colors[i * 3] = 1;
            this.colors[i * 3 + 1] = 1;
            this.colors[i * 3 + 2] = 1;
        }
        
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        
        // Create particle material
        this.material = new THREE.PointsMaterial({
            size: 0.1, // Adjust size as needed
            vertexColors: THREE.VertexColors // Enable vertex colors
        });
        
        // Create particle system
        this.particleSystem = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.particleSystem);
        
        // Initialize particle velocities
        this.initializeVelocities();
    }
    changeParticleSize(size)
    {
        this.material.size = size;
        // update particle size
        this.scene.remove(this.particleSystem);
        const particleMaterial = new THREE.PointsMaterial({
            size: size, // Adjust size as needed
            vertexColors: THREE.VertexColors // Enable vertex colors
        });
        this.particleSystem = new THREE.Points(this.geometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }
    initializeVelocities() {
        this.velocities = [];
        for (let i = 0; i < this.particleCount; i++) {
            let velocity;
            if (!this.isBall) {
                velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.2,
                    (Math.random() - 0.5) * 0.2,
                    (Math.random()) * (this.offsetZ > 0 ? 1 : -1)
                );
            } else {
                velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 0
                );
            }
            this.velocities.push(velocity);
        }
    }
    
    changeParticleNumber(newNb) {
        this.particleCount = newNb;
        this.scene.remove(this.particleSystem);
        this.initializeParticles();
    }
    
    explodeParticles(position, color) {
        if (this.isActive) {
            for (let i = 0; i < this.particleCount; i++) {
                let index = i * 3;
                this.positions[index] = position.x;
                this.positions[index + 1] = position.y;
                this.positions[index + 2] = position.z + this.offsetZ;
                this.colors[index] = color.r;
                this.colors[index + 1] = color.g;
                this.colors[index + 2] = color.b;
            }
            this.geometry.attributes.position.needsUpdate = true;
            this.geometry.attributes.color.needsUpdate = true;
        }
    }
    
    updateParticles() {
        if (this.isActive) {
            for (let i = 0; i < this.particleCount; i++) {
                let index = i * 3;
                this.positions[index] += this.velocities[i].x;
                this.positions[index + 1] += this.velocities[i].y;
                this.positions[index + 2] += this.velocities[i].z;
                if (!this.isBall) {
                    if (Math.abs(this.positions[index + 2]) - Math.abs(this.paddle.position.z) >= this.paddle.arena.length) {
                        this.positions[index + 2] = this.paddle.position.z + this.offsetZ;
                        this.positions[index + 1] = this.paddle.position.y;
                        this.positions[index] = this.paddle.position.x;
                        if (this.paddle.arena.skyMap.mapActive) {
                            const result = Math.random();
                            if (result < 0.5)
                                this.positions[index] = this.paddle.position.x + 2.5;
                            else
                                this.positions[index] = this.paddle.position.x - 2.5;
                        }
                        if (this.paddle.arena.dragonMap.mapActive) {
                            this.positions[index + 1] -= 1.5;
                            this.positions[index + 2] *= 1.17;
                        }
                    }
                }
            }
            this.geometry.attributes.position.needsUpdate = true;
        }
    }
}

function swapToSplitScreen() {
    thirdPlayerUI[0].style.opacity = 0;
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
        .onComplete(() => {
            blueBar[0].style.transition = "opacity 2s ease";
            blueBar[0].style.opacity = 0.2;
        })
        .start();
}

function swapToFullScreen()
{
    blueBar[0].style.transition = "opacity 0.5s ease";
    blueBar[0].style.opacity = 0;
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

const gameState = new GameState();

function glitch(glitchEffect)
{
    glitchEffect.enabled = true;
    glitchEffect.goWild = true;
    setTimeout(function() {
        glitchEffect.enabled = false;
        glitchEffect.goWild = false;
    }, 500);
}

// let fpsInterval = 1000 / 75; // 75 FPS
// let stats = new Stats();
// let lastUpdateTime = performance.now();

function animate()
{
    requestAnimationFrame( animate );
    updateFpsCounter();
    let now = performance.now();
    // let elapsed = now - lastUpdateTime;
    // if (elapsed < fpsInterval) return; // Skip if too big FPS
    // else
    {
        gameState.monitorGameState();
        if (gameState.inLobby)
            return ;
        TWEEN.update();
        if (gameState.inGame && !gameState.paused)
        {
            gameState.arena.monitorArena();
            gameState.arena.thirdPlayer.monitorThirdPlayerMovement();
            gameState.arena.thirdPlayer.monitorProjectilesMovement();
            gameState.arena.composer1.render();
            if (gameState.arena.isSplitScreen)
                gameState.arena.composer2.render();
        }
        else if (gameState.loading)
        {
            if (keyDown['g'])
                gameState.switchLoadingToGame();
            loadingScreen.animate();
            if (loadingScreen.loadingCompleted)
                gameState.arena.monitorArena();
        }
    }

    // stats.update();
    // lastUpdateTime = now - (elapsed % fpsInterval);
    // stats.time = performance.now();
}
animate();

export {gameState};
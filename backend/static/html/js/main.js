import * as THREE from 'three';
import { showPage } from './showPages.js';
import {marker, spaceShip, spaceShipInt, allModelsLoaded, mixer1, mixer2, mixer3} from "./objs.js";
import { sun, planets } from "./planets.js";
import { getPlanetIntersection, updateRay, inRange, resetOutlineAndText } from "./planetIntersection.js"
import {cancelLanding, landedOnPlanet, togglePanelDisplay, togglePlanet, triggerInfiniteAnim} from "./enterPlanet.js"
import { spaceShipMovement, camMovement, initializeCamera} from './movement.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { gameStarted, displayRemovePlayerVisual} from './arenaPage.js';
import { inCockpit, moveCameraToBackOfCockpit } from './signUpPage.js';
import { returnToHost } from './userPage.js'
import { gameState } from '../../game/js/main.js';


let cubeLoader = new THREE.CubeTextureLoader();
export let lobbyStart = false;
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#c4'),
    antialias: true,
    toneMapping: THREE.ReinhardToneMapping
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = true;

const scene = new THREE.Scene();

scene.traverse(obj => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 2000 );
const planetCam = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 2000);

export function toggleLobbyStart() {
    lobbyStart = !lobbyStart;
}

    // LIGHTING
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.castShadow = true;
    pointLight.position.copy(sun.position);
    pointLight.scale.set(10, 10, 10);
    
    const pointLight2 = new THREE.PointLight(0xffffff, 1.5)
    pointLight2.castShadow = true;
    pointLight2.position.set(0,5,-1300);
    
    const spaceShipPointLight = new THREE.PointLight(0xffffff, 0.5)
    spaceShipPointLight.castShadow = true;
    const ambientLight = new THREE.AmbientLight(0Xffffff, 1);
    const lightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLight, ambientLight, lightHelper, spaceShipPointLight, pointLight2);


class LobbyVisuals
{
    constructor(scene, camera, renderer)
    {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.currentGraphics = 'medium';
        this.composer;
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        this.spaceCubeMapTexture = cubeLoader.load([
            '../../static/game/texturePlayground/blueSpaceMap/nx.png',
            '../../static/game/texturePlayground/blueSpaceMap/px.png',
            '../../static/game/texturePlayground/blueSpaceMap/py.png',
            '../../static/game/texturePlayground/blueSpaceMap/ny.png',
            '../../static/game/texturePlayground/blueSpaceMap/nz.png',
            '../../static/game/texturePlayground/blueSpaceMap/pz.png'
        ]);
        this.scene.background = this.spaceCubeMapTexture;

        this.bloomPass.threshold = 0.2;
        this.bloomPass.strength = 0.3;
        this.bloomPass.radius = 0.8;
        this.stars = [];
        this.addStars(1000);
    }
    addStar() {
        const geometry = new THREE.SphereGeometry(1.125, 12, 12);
        const material = new THREE.MeshStandardMaterial({color: 0xffffff});
        const star = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(4000));

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
    changeGraphics(graphics)
    {
        if (graphics === 'low' && this.currentGraphics != 'low')
        {
            if (this.currentGraphics === 'high')
                this.composer.removePass(this.bloomPass);
            this.removeStars();
            this.addStars(500);
            this.camera.far = 1500;
            this.renderer.shadowMap.enabled = false;
            this.renderer.setPixelRatio(0.5);
            this.scene.background = new THREE.Color(0x000020);
            this.currentGraphics = 'low';
        }
        else if (graphics === 'medium' && this.currentGraphics != 'medium')
        {
            if (this.currentGraphics === 'high')
                this.composer.removePass(this.bloomPass);
            this.removeStars();
            this.addStars(1000);
            this.camera.far = 2000;
            this.renderer.setPixelRatio(1);
            this.renderer.shadowMap.enabled = true;
            this.scene.background = this.spaceCubeMapTexture;
            this.currentGraphics = 'medium';
        }
        else if (graphics === 'high' && this.currentGraphics != 'high')
        {
            this.composer.addPass(this.bloomPass);
            this.camera.far = 3000;
            this.removeStars();
            this.addStars(1200);
            this.renderer.setPixelRatio(1);
            this.renderer.shadowMap.enabled = true;
            this.scene.background = this.spaceCubeMapTexture;
            this.currentGraphics = 'high';
        }
        this.camera.updateProjectionMatrix();
    }
    activateSpeedEffect()
    {
        //tween animation to augment camera fov
        new TWEEN.Tween(this.camera)
        .to({fov: 75}, 100)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            this.camera.updateProjectionMatrix();
        })
        .start();
    }
    deactivateSpeedEffect()
    {
        new TWEEN.Tween(this.camera)
        .to({fov: 60}, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            this.camera.updateProjectionMatrix();
        })
        .start();
    }
    render()
    {
        if (this.currentGraphics === 'high')
            this.composer.render();
        else
            this.renderer.render(this.scene, this.camera);
    }
}

export const lobbyVisuals = new LobbyVisuals(scene, camera, renderer);



// Define the size of the minimap
const minimapWidth = 200; // Adjust as needed
const minimapHeight = 200;

// Create an orthographic camera for the minimap
const minimapCamera = new THREE.OrthographicCamera(
    minimapWidth * 8,  // left
    -minimapWidth * 8,   // right
    -minimapHeight * 8,  // top
    minimapHeight * 8, // bottom
    1,                // near
    4000              // far
    );
     
    minimapCamera.position.set(sun.position.x, sun.position.y + 500, sun.position.z);
    
    const minimapRenderer = new THREE.WebGLRenderer();
    minimapRenderer.setSize(window.innerHeight * 0.35, window.innerHeight * 0.35);
    minimapRenderer.setClearColor(0x000000, 0); 
    minimapRenderer.domElement.style.borderRadius = '100%';
    minimapRenderer.domElement.style.position = 'absolute';
    minimapRenderer.domElement.style.transform = 'translate(-50%, -50%)';
    const minimapContainer = document.getElementById('minimapContainer');
    minimapContainer.appendChild(minimapRenderer.domElement);

    const planeGeometry = new THREE.PlaneGeometry(5000, 5000);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000045 }); 
    const minimapBG = new THREE.Mesh(planeGeometry, planeMaterial);
    minimapBG.position.set(0, -600, 0);
    minimapBG.lookAt(minimapCamera.position); // Make the plane face the camera
    scene.add(minimapBG);

    minimapBG.layers.set(1);
    minimapCamera.layers.enable(1);
    camera.layers.enable(2);
    minimapCamera.lookAt(sun.position);
    
function renderMinimap() {
    if (!spaceShip)
        return;
    marker.position.x = spaceShip.position.x;
    marker.position.z = spaceShip.position.z;
    marker.quaternion.copy(spaceShip.quaternion);
    minimapRenderer.render(scene, minimapCamera);
}

function resetUserInfoLoggedVisual(userInfoCont, clonedImg, profilePic, user) {
    clonedImg.src = user.profile_picture;
    profilePic.style.borderColor = '#3777ff';
    userInfoCont.style.borderColor = '#3777ff';
    userInfoCont.style.fontFamily = 'space';
    userInfoCont.style.fontSize = '15px';
    userInfoCont.childNodes[1].textContent = user.username;
}

import { updateUserStatus } from "./userManagement.js";
import { guestLoggedIn } from "./arenaPage.js";

function disconnectLoggedGuest(userInfoCont, user, token) {
    lsCont.removeChild(userInfoCont);
    updateUserStatus('offline', token);
    // console.log("before logout:", guestLoggedIn);

    for (let i = 0; i < guestLoggedIn.length; i++) {
        if (guestLoggedIn[i][0].id === user.id) {
            guestLoggedIn.splice(i, 1);
        }
    }

    // console.log("after logout:", guestLoggedIn);
}

export function displayUsersLogged(user, token) {
    
    // guestLoggedIn.forEach(user => {
        const lsCont = document.getElementById('lsCont');

        const userInfoCont = document.createElement('div');
        userInfoCont.classList.add('userInfoCont', 'log');

        const profilePic = document.createElement('div');
        profilePic.classList.add('profilePic');

        const img = document.createElement('img');
        img.src = user.profile_picture;

        profilePic.appendChild(img);
        userInfoCont.appendChild(profilePic);
        const usernameText = document.createTextNode(user.username);
        userInfoCont.appendChild(usernameText);
        lsCont.appendChild(userInfoCont);
        // if (user.isHost)
        //     return;
        userInfoCont.addEventListener('mouseenter', function () {
            displayRemovePlayerVisual(userInfoCont, img, profilePic);
        });
        userInfoCont.addEventListener('mouseleave', function () {
            resetUserInfoLoggedVisual(userInfoCont, img, profilePic, user);
        });
        userInfoCont.addEventListener('click', function () {
            disconnectLoggedGuest(userInfoCont, user, token);
        });
    // });
}

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const rightSideContainer = document.getElementById("rsCont");
const leftSideContainer = document.getElementById("lsCont");
let rsContVisible = false;
const structure = document.querySelector(".structure");
const escapeBG = document.querySelector(".escapeBG");

export function toggleRSContainerVisibility() {
    if (rsContVisible) {
        rightSideContainer.style.transition = 'right 0.5s ease-in-out';
        rightSideContainer.style.right = '-50%';

        rsContVisible = false;
    } else {
        rightSideContainer.style.transition = 'right 0.5s ease-in-out';
        rightSideContainer.style.right = '0%';
        leftSideContainer.style.transition = 'left 0.5s ease-in-out';
        leftSideContainer.style.left = '0%';
        rsContVisible = true;
    }
}


// Initialize EffectComposer with custom render target
const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    depthBuffer: true
  });

const composer = new EffectComposer(renderer, renderTarget);
composer.setSize(window.innerWidth, window.innerHeight);
composer.setPixelRatio(window.devicePixelRatio);
const renderPass = new RenderPass( scene, camera );

export const outlinePass = new OutlinePass(
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
    
    export let cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    

    

function planetMovement() {
    planets.forEach((planet) => {
        planet.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
        planet.hitbox.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
        if (planet.name === 'settings') {
            planet.mesh.rotation.y += planet.orbitSpeed + 0.005;
            planet.orbitMesh.rotation.x += planet.orbitSpeed;
        }
        if (planet.name === 'tournament') {
            planet.mesh.rotation.x += planet.rotationSpeed;
            planet.mesh.rotation.y += planet.rotationSpeed;
        }
        if (planet.name === 'arena') {
            planet.mesh.rotation.x += planet.rotationSpeed;
            planet.mesh.rotation.y += planet.rotationSpeed;
            planet.orbitMesh.rotation.x += planet.rotationSpeed;
            planet.orbitMesh.rotation.y += planet.rotationSpeed;
        }
        if (planet.orbitMesh != null) {
            planet.orbitMesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), planet.orbitSpeed);
            planet.orbitMesh.rotation.y += planet.orbitSpeed + 0.01;
        }
    });
}

export function startAnimation() {
    let target = -1298;
    let duration = 500;
    spaceShip.rotation.set(0, 0, 0);
    let anim1 = new TWEEN.Tween(spaceShip.position)
    .to({z: target}, duration)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
        camera.position.copy(new THREE.Vector3(spaceShip.position.x - 10.5 * Math.sin(spaceShip.rotation.y), 4.5, spaceShip.position.z - 10.5 * Math.cos(spaceShip.rotation.y)));
    })
    
    target = -1200;
    duration = 500;
    let anim2 = new TWEEN.Tween(spaceShip.position)
    .to({z: target}, duration)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
        camera.position.copy(new THREE.Vector3(spaceShip.position.x - 10.5 * Math.sin(spaceShip.rotation.y), 4.5, spaceShip.position.z - 10.5 * Math.cos(spaceShip.rotation.y)));
        })
        
        target = -1150;
        duration = 500;
        let anim3 = new TWEEN.Tween(spaceShip.position)
        .to({z: target}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            camera.position.copy(new THREE.Vector3(spaceShip.position.x - 10.5 * Math.sin(spaceShip.rotation.y), 4.5, spaceShip.position.z - 10.5 * Math.cos(spaceShip.rotation.y)));
        })
        .onComplete(() => {
            spaceShipInt.visible = false;
            lobbyStart = true;
            cancelLanding();
            toggleRSContainerVisibility();
        });
        anim1.chain(anim2, anim3);
        anim1.start();
    }

export function toggleEscapeContainerVisibility() {
    togglePause();
    if (targetBlur !== 0) {
        structure.style.animation = 'headerDown 0.5s ease forwards'
        escapeBG.style.animation = 'unrollBG 0.2s ease 0.5s forwards'
    }
    else {
        escapeBG.style.animation = 'rollBG 0.2s ease backwards'
        structure.style.animation = 'headerUp 0.5s ease 0.2s backwards'
    }
}

/*On va chercher la référence entre le html et le fichier js*/
const rgpdStructure = document.getElementById("rgpdstructure");
const rgpdBG = document.getElementById("rgpdBG");
//recuperer ton bouton et apres tu add eventlistener
//button.addEventListener("click", (event) => {})

let rgpdDisplayed = false;

function toggleRGPDContainerVisibility() {
    if (!rgpdDisplayed) {
        rgpdStructure.style.animation = 'headerDown 0.5s ease forwards'
        rgpdBG.style.animation = 'unrollBG 0.2s ease 0.5s forwards'
        rgpdDisplayed = true;
    }
    else {
        rgpdBG.style.animation = 'rollBG 0.2s ease backwards'
        rgpdStructure.style.animation = 'headerUp 0.5s ease 0.2s backwards'
        rgpdDisplayed = false;
    }
}


let pauseGame = false;

export function togglePause() {
    gameState.togglePause();
    pauseGame ? pauseGame = false : pauseGame = true;
}

let firstPauseTriggered = false;

document.addEventListener('keydown', (event) => {
    if (event.key === 'p')
        console.log(camera.position);
    if (event.key === 'Enter') {
        if (window.location.hash === "#signUpPage")
            document.getElementById("submitSignUp").click();
    }
    if (event.target.tagName === 'INPUT')
        return;
    if (event.key === 'e' && !lobbyStart) {
        // const token = localStorage.getItem('host_auth_token');
        // console.log(token);
        // if (token) {
            showPage('none');
            startAnimation();
            // displayUsersLogged();
        // }
        // localStorage.clear();
    }
    if (event.key === 'e' && inRange && !gameStarted)
        togglePlanet();
    if (event.key === 'Escape') {
        if (gameState.inGame)
        {
            toggleEscapeContainerVisibility();
            toggleBlurDisplay(false);
            pauseGame ? pauseGame = false : pauseGame = true;
            return;
        }
        if (landedOnPlanet) {
            togglePlanet();
            toggleEscapeContainerVisibility();
            blockingPanel.style.visibility = 'hidden';
            showPage('none');
            togglePause();
            returnToHost();
            return;
        }
        else if (inCockpit) {
            moveCameraToBackOfCockpit();
            return;
        }
        if (lobbyStart) {
            console.log("coucou");
            toggleRSContainerVisibility();
            toggleBlurDisplay(true);
            toggleEscapeContainerVisibility();
            resetOutlineAndText();
            pauseGame ? pauseGame = false : pauseGame = true;
        }
    }
});

let targetBlur = 0;

const horizontalBlur = new ShaderPass(HorizontalBlurShader);
const verticalBlur = new ShaderPass(VerticalBlurShader);
horizontalBlur.uniforms['tDiffuse'].value = null; // Set the input texture to null
verticalBlur.uniforms['tDiffuse'].value = null; // Set the input texture to null
horizontalBlur.renderToScreen = true; // Render to a texture
verticalBlur.renderToScreen = true; // Render to the screen
horizontalBlur.uniforms.h.value = targetBlur;
verticalBlur.uniforms.v.value = targetBlur;
composer.addPass(horizontalBlur);
composer.addPass(verticalBlur);
lobbyVisuals.composer = composer;
const coloredPanel = document.querySelector(".coloredPanel");

export function toggleBlurDisplay(displayColoredPanel = false) {
    const duration = 1500;
    targetBlur === 0 ? targetBlur = 0.002 : targetBlur = 0;

    new TWEEN.Tween(horizontalBlur.uniforms.h)
    .to({value: targetBlur}, duration)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

    new TWEEN.Tween(verticalBlur.uniforms.v)
    .to({value: targetBlur}, duration)
    .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    if (displayColoredPanel) {
        targetBlur === 0 ? coloredPanel.style.opacity = "0" : coloredPanel.style.opacity = "1";
    }
}

// composer.addPass(bloomPass);

function update() {
    // displayRay();
    if (pauseGame)
        return;
    if (lobbyStart && !landedOnPlanet) 
        spaceShipMovement();
    camMovement();
    planetMovement();
    if (lobbyStart) {
        updateRay();
    if (!landedOnPlanet)
        getPlanetIntersection();
}
return;
}

let fpsInterval = 1000 / 75; // 75 FPS
let stats = new Stats();
let lastUpdateTime = performance.now();


function animate()
{
    requestAnimationFrame( animate )
    let now = performance.now();
    let elapsed = now - lastUpdateTime;
    if (elapsed < fpsInterval) return; // Skip if too big FPS
    if (gameStarted)
        return;
    TWEEN.update();
    if (!landedOnPlanet)
        renderMinimap();
    update();
    // renderer.render(scene, camera);
    composer.render();
    mixer1.update(0.025);
    mixer2.update(0.025);
    mixer3.update(0.025);
    // renderer.render(scene, camera);

    stats.update();
    lastUpdateTime = now - (elapsed % fpsInterval);
    stats.time = performance.now();
}

const checkModelsLoaded = setInterval(() => {
    if (allModelsLoaded() && spaceShip) {
        clearInterval(checkModelsLoaded);
        animate();
        camMovement();
        initializeCamera();
    }
}, 100);

export {scene, camera, spaceShip, spaceShipPointLight, landedOnPlanet, planetCam}
import * as THREE from 'three';
import { showPage } from './showPages.js';
import {spaceShip, spaceShipInt, allModelsLoaded} from "./objs.js";
import { sun, planets } from "./planets.js";
import { getPlanetIntersection, updateRay, inRange, resetOutlineAndText } from "./planetIntersection.js"
import {landedOnPlanet, togglePanelDisplay, togglePlanet, triggerInfiniteAnim} from "./enterPlanet.js"
import { spaceShipMovement, camMovement, initializeCamera} from './movement.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { gameStarted, switchToGame, displayRemovePlayerVisual} from './arenaPage.js';
import { inCockpit, moveCameraToBackOfCockpit } from './signUpPage.js';
import { mixer1, mixer2, mixer3} from './objs.js';
import { userList } from './loginPage.js';

let cubeLoader = new THREE.CubeTextureLoader();
export let lobbyStart = false;
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#c4')
});
const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 2000 );
camera.position.set(0, 1, -495);
const planetCam = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 2000);

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
        this.afterImagePass = new AfterimagePass();
        this.afterImagePass.uniforms.damp.value = 0;
        
        this.spaceCubeMapTexture = cubeLoader.load([
            '../../static/game/texturePlayground/spaceMap/nx.png',
            '../../static/game/texturePlayground/spaceMap/px.png',
            '../../static/game/texturePlayground/spaceMap/py.png',
            '../../static/game/texturePlayground/spaceMap/ny.png',
            '../../static/game/texturePlayground/spaceMap/nz.png',
            '../../static/game/texturePlayground/spaceMap/pz.png'
        ]);
        this.scene.background = this.spaceCubeMapTexture;

        this.boostCubeMapTexture = cubeLoader.load([
            '../../static/game/texturePlayground/boostSpaceMap/nx.png',
            '../../static/game/texturePlayground/boostSpaceMap/px.png',
              '../../static/game/texturePlayground/boostSpaceMap/py.png',
              '../../static/game/texturePlayground/boostSpaceMap/ny.png',
              '../../static/game/texturePlayground/boostSpaceMap/nz.png',
              '../../static/game/texturePlayground/boostSpaceMap/pz.png'
          ]);

        this.bloomPass.threshold = 0.1;
        this.bloomPass.strength = 0.2;
        this.bloomPass.radius = 0.5;
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
            {
                this.composer.removePass(this.bloomPass);
                this.composer.removePass(this.afterImagePass);
            }
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
            {
                this.composer.removePass(this.bloomPass);
                this.composer.removePass(this.afterImagePass);
            }
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
            this.composer.addPass(this.afterImagePass);
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
        .onComplete(() => {
            if (this.currentGraphics === 'high')
            {
                this.afterImagePass.uniforms.damp.value = 0.95;
                this.scene.background = this.boostCubeMapTexture;
            }
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
        if (this.currentGraphics != 'high')
            return;
        this.afterImagePass.uniforms.damp.value = 0;
        this.scene.background = this.spaceCubeMapTexture;
    
    }
}

export const lobbyVisuals = new LobbyVisuals(scene, camera, renderer);



// Define the size of the minimap
const minimapWidth = 200; // Adjust as needed
const minimapHeight = 200;

// Create an orthographic camera for the minimap
const minimapCamera = new THREE.OrthographicCamera(
    minimapWidth * 12,  // left
    -minimapWidth * 12,   // right
    -minimapHeight * 12,  // top
    minimapHeight * 12, // bottom
    1,                // near
    4000              // far
    );
     
    minimapCamera.position.set(sun.position.x + 200, sun.position.y + 500, sun.position.z);
    
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
    minimapBG.position.set(-200, -600, 0); 
    minimapBG.lookAt(minimapCamera.position); // Make the plane face the camera
    // scene.add(minimapBG);

    minimapBG.layers.set(1);
    minimapCamera.layers.enable(1);
    camera.layers.enable(2);
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const playerMarker = new THREE.Mesh(sphereGeometry, sphereMaterial);
    playerMarker.scale.set(20,20,20);
    scene.add(playerMarker);
    // const camera1Helper = new THREE.CameraHelper(minimapCamera);

function renderMinimap() {
    if (!spaceShip)
        return;
    playerMarker.position.x = spaceShip.position.x;
    playerMarker.position.z = spaceShip.position.z;
    playerMarker.position.y = 500;
    minimapCamera.lookAt(sun.position);
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

function disconnectLoggedGuest(userInfoCont) {
    lsCont.removeChild(userInfoCont);
}

function displayUsersLogged() {
    if (!userList)
        return;
    userList.forEach(user => {
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
            disconnectLoggedGuest(userInfoCont);
        });
    });
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


const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
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
            toggleRSContainerVisibility();
        });
        anim1.chain(anim2, anim3);
        anim1.start();
    }

function toggleEscapeContainerVisibility() {
    if (targetBlur !== 0) {
        structure.style.animation = 'headerDown 0.5s ease forwards'
        escapeBG.style.animation = 'unrollBG 0.2s ease 0.5s forwards'
    }
    else {
        escapeBG.style.animation = 'rollBG 0.2s ease backwards'
        structure.style.animation = 'headerUp 0.5s ease 0.2s backwards'
    }
}


let pauseGame = false;

document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT')
        return;
    if (event.key === 'e' && !lobbyStart) {
        // const token = localStorage.getItem('host_auth_token');
        // console.log(token);
        // if (token) {
            showPage('none');
            startAnimation();
            displayUsersLogged();
        // }
        // localStorage.clear();
    }
    if (event.key === 'e' && inRange && !gameStarted)
        togglePlanet();
    if (event.key == 'Escape') {
        if (landedOnPlanet) {
            togglePlanet();
            return;
        }
        else if (inCockpit) {
            moveCameraToBackOfCockpit();
            return;
        }
        if (lobbyStart) {
            toggleRSContainerVisibility();
            toggleBlurDisplay(true);
            toggleEscapeContainerVisibility();
            resetOutlineAndText();
            pauseGame ? pauseGame = false : pauseGame = true;
        }
    }
    if (event.key === 'l') {
        switchToGame();
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

function animate()
{
    requestAnimationFrame( animate )
    if (gameStarted)
        return;
    TWEEN.update();
    if (!landedOnPlanet)
        renderMinimap();
    update();
    composer.render();
    mixer1.update(0.025);
    mixer2.update(0.025);
    mixer3.update(0.025);
    // renderer.render(scene, camera);
}

const checkModelsLoaded = setInterval(() => {
    if (allModelsLoaded() && spaceShip) {
        clearInterval(checkModelsLoaded);
        animate();
        camMovement();
        initializeCamera();
    }
}, 100);

export {scene, THREE, camera, spaceShip, spaceShipPointLight, landedOnPlanet, planetCam}
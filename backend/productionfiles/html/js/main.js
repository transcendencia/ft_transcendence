import * as THREE from 'three';
import {spaceShip, spaceShipInt, allModelsLoaded} from "./objs.js";
import { addStar } from "./stars.js";
import { sun, planets } from "./planets.js";
import { getPlanetIntersection, updateRay, inRange, resetOutlineAndText } from "./planetIntersection.js"
import {landedOnPlanet, togglePanelDisplay, togglePlanet, triggerInfiniteAnim} from "./enterPlanet.js"
import { spaceShipMovement, camMovement} from './movement.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';

let gameStart = false;
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#c1')
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000020);
const aspectRatio = window.innerWidth / window.innerHeight; // Adjust aspect ratio
const camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 2000 );
camera.position.set(0, 1, -495);
const planetCam = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 2000);

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
    2000              // far
    );
     
    minimapCamera.position.set(sun.position.x + 200, sun.position.y + 500, sun.position.z);
    
    const minimapRenderer = new THREE.WebGLRenderer();
    minimapRenderer.setSize(window.innerWidth * 0.15, window.innerWidth * 0.15);
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
    scene.add(minimapBG);

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

let languageData

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const rightSideContainer = document.getElementById("rsCont");
let rsContVisible = false;
const loginPageContainer = document.querySelector(".loginPageUI");

export function toggleRSContainerVisibility() {
    if (rsContVisible) {
        rightSideContainer.style.transition = 'right 0.5s ease-in-out';
        rightSideContainer.style.right = '-50%';
        rsContVisible = false;
    } else {
        rightSideContainer.style.transition = 'right 0.5s ease-in-out';
        rightSideContainer.style.right = '0%';
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
    const lightHelperss = new THREE.PointLightHelper(pointLight2);
    
    const spaceShipPointLight = new THREE.PointLight(0xffffff, 0.5)
    spaceShipPointLight.castShadow = true;
    const ambientLight = new THREE.AmbientLight(0Xffffff, 1);
    const lightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLight, ambientLight, lightHelper, spaceShipPointLight, pointLight2);
    
    Array(800).fill().forEach(addStar);
    
    
    
    // function vectorsEqual(v1, v2, threshold = 0.1) {
        //     return Math.abs(v1.x - v2.x) < threshold &&
        //            Math.abs(v1.y - v2.y) < threshold &&
        //            Math.abs(v1.z - v2.z) < threshold;
        // }
        // let createOrbitsLines = true;
        // let startToCheckPlanetPos = false;
        
        // function allPlanetsFinishedOrbit() {
            //     planets.forEach((planet) => {
//         if (vectorsEqual(initialPos[planet], planet.mesh.position))
//             return false;
//     });
//     return true;
// }

// function drawTrajectory() {
    //     let initialPos = [];
    //     planets.forEach((planet) => {
        //         initialPos[planet] = planet.mesh.position;
        //         planet.mesh.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.2);
        //         planet.trajectoryPoints.push(planet.mesh.position.clone());
        //     });
        //     if (allPlanetsFinishedOrbit && createOrbitsLines && startToCheckPlanetPos) {
            //         planets.forEach((planet) => {
                //             let trajectoryGeometry = new THREE.BufferGeometry().setFromPoints(planet.trajectoryPoints);
                //             let trajectoryMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: 0, opacity: 0.2 });
                //             let trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);
                //             scene.add(trajectoryLine);
                //         });
                //         createOrbitsLines = false;
                //     }
                // }
                
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

function startAnimation() {
    let target = -1298;
    let duration = 1000;
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
        duration = 3000;
        let anim3 = new TWEEN.Tween(spaceShip.position)
        .to({z: target}, duration)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
            camera.position.copy(new THREE.Vector3(spaceShip.position.x - 10.5 * Math.sin(spaceShip.rotation.y), 4.5, spaceShip.position.z - 10.5 * Math.cos(spaceShip.rotation.y)));
        })
        .onComplete(() => {
            spaceShipInt.visible = false;
            gameStart = true;
            toggleRSContainerVisibility();
        });
        anim1.chain(anim2, anim3);
        anim1.start();
    }

let pauseGame = false;

document.addEventListener('keydown', (event) => { 
    if (event.key === 'e' && !gameStart) {
        fetch('check_auth/')
            .then(response => {
                console.log(response.ok);
                if (!response.ok) {
                    event.preventDefault();
                }
                else {
                    loginPageContainer.style.opacity = 0;
                    console.log("e pressed");
                    startAnimation();
                }
            })
        .catch(error => {
            console.error('Erreur lors de la vérification de l\'état de connexion :', error);
        });
    }
    if (event.key === 'e' && inRange) {
        togglePlanet();
    }
    if (event.key === 'u')
        triggerInfiniteAnim();
    if (event.key == 'Escape') {
        if (landedOnPlanet) {
            togglePlanet();
            return;
        }
        toggleRSContainerVisibility();
        toggleBlurDisplay(true);
        resetOutlineAndText();
        pauseGame ? pauseGame = false : pauseGame = true;
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



// Bloom Pass
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0.1;
bloomPass.strength = 0.2;
bloomPass.radius = 0.5;
// composer.addPass(bloomPass);

function update() {
    // displayRay();
    if (pauseGame)
        return;
    if (gameStart && !landedOnPlanet) 
        spaceShipMovement();
    planetMovement();
    camMovement();
    if (gameStart) {
        updateRay();
    if (!landedOnPlanet)
        getPlanetIntersection();
}
return;
}

function animate()
{
    TWEEN.update();
    requestAnimationFrame( animate )
    if (!landedOnPlanet)
        renderMinimap();
    update();
    composer.render();
    // renderer.render(scene, camera);
}

const checkModelsLoaded = setInterval(() => {
    if (allModelsLoaded()) {
        clearInterval(checkModelsLoaded);
        animate();
        camMovement();
    }
}, 100);

export {scene, THREE, camera, spaceShip, spaceShipPointLight, landedOnPlanet, planetCam}
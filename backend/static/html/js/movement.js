import { THREE, spaceShip, camera, spaceShipPointLight, landedOnPlanet, lobbyStart } from "./main.js";
import {planetInRange} from "./planetIntersection.js";
import { lobbyVisuals } from "./main.js";

let leftArrowPressed = false;
let rightArrowPressed = false;
let upArrowPressed = false;
let downArrowPressed = false;
let wKeyPressed = false;
let aKeyPressed = false;
let sKeyPressed = false;
let dKeyPressed = false;
let aKeyIsPressed = false;

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
        {
            // lobbyVisuals.removeAfterPass();
            aKeyPressed = true;
        }
    if (event.key === 's')
        sKeyPressed = true;    
    if (event.key === 'd')
        {
            // lobbyVisuals.removeAfterPass();
            dKeyPressed = true;
        }
    aKeyIsPressed = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft')
        leftArrowPressed = false;
    if (event.key === 'ArrowRight')
        rightArrowPressed = false;
    if (event.key === 'ArrowUp')
        upArrowPressed = false;
    if (event.key === 'ArrowDown')
        downArrowPressed = false;
    if (event.key === 'w')
        wKeyPressed = false;
    if (event.key === 'a')
        aKeyPressed = false;
    if (event.key === 's')
        sKeyPressed = false;    
    if (event.key === 'd')
        dKeyPressed = false;
});

document.addEventListener('keypress', (event) => {
    if (event.key === ' ' && !boost)
        startBoost(); 
})

let distance = 10.5;
let height = 4.5;
let moveSpeed = 5;
let rotSpeed = 0.10;
const tolerance = 0.01; 


function rotateSpaceShipAnim(targetRot) {
    const tolerance = 0.01;
    if (Math.abs(spaceShip.rotation.z - targetRot) > tolerance) {
        if (spaceShip.rotation.z > targetRot)
        spaceShip.rotation.z -= rotSpeed;
    else if (spaceShip.rotation.z < targetRot)
        spaceShip.rotation.z += rotSpeed;
}}

let boost = false;
const boostDuration = 1000;
let originalMoveSpeed;
let boostedMoveSpeed;
let boostStartTime;

function startBoost() {
    if (!boost) {
        originalMoveSpeed = moveSpeed;
        boostedMoveSpeed = moveSpeed * 5;
        boostStartTime = Date.now();
        boost = true;
        lobbyVisuals.afterImagePass.uniforms.damp.value = 0.95;
        smoothBoost();
    }
}

function smoothBoost() {
    const now = Date.now();
    const elapsedTime = now - boostStartTime;
    const progress = Math.min(1, elapsedTime / boostDuration);
    
    if (progress < 1) {
        // Increase moveSpeed instantly
        moveSpeed = boostedMoveSpeed;
    } else {
        endBoost();
        return;
    }

    // Decrease moveSpeed gradually towards the end
    const remainingTime = boostDuration - elapsedTime;
    const decreaseFactor = remainingTime / boostDuration;
    moveSpeed = originalMoveSpeed + (moveSpeed - originalMoveSpeed) * decreaseFactor;

    requestAnimationFrame(smoothBoost);
}

function endBoost() {
    moveSpeed = originalMoveSpeed;
    boost = false;
    lobbyVisuals.afterImagePass.uniforms.damp.value = 0;
}

function spaceShipMovement() {
    if (!aKeyIsPressed)
        return;
    if (upArrowPressed || wKeyPressed) {
        spaceShip.position.x += Math.sin(spaceShip.rotation.y) * moveSpeed;
        spaceShip.position.z += Math.cos(spaceShip.rotation.y) * moveSpeed;
        if (!leftArrowPressed && !rightArrowPressed && !aKeyPressed && !dKeyPressed)
            rotateSpaceShipAnim(0);
    }
    if (downArrowPressed || sKeyPressed) {
        spaceShip.position.x -= Math.sin(spaceShip.rotation.y) * moveSpeed;
        spaceShip.position.z -= Math.cos(spaceShip.rotation.y) * moveSpeed;
        if (!leftArrowPressed && !rightArrowPressed && !aKeyPressed && !dKeyPressed)
            rotateSpaceShipAnim(0);
    }
    if (leftArrowPressed || aKeyPressed) {
        // lobbyVisuals.afterImagePass.uniforms.damp.value = 0.5;
        if (downArrowPressed || sKeyPressed) {
            spaceShip.rotation.y -= 0.05;
        }
        else 
            spaceShip.rotation.y += 0.05;
        rotateSpaceShipAnim(-0.80);
    }
    else if (rightArrowPressed || dKeyPressed) {
        // lobbyVisuals.afterImagePass.uniforms.damp.value = 0.5;
        if (downArrowPressed || sKeyPressed)
            spaceShip.rotation.y += 0.05;
        else 
            spaceShip.rotation.y -= 0.05;
        rotateSpaceShipAnim(0.80);

    }
    // else
    //     lobbyVisuals.afterImagePass.uniforms.damp.value = 0.92;
    spaceShipPointLight.position.copy(spaceShip.position);
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

export function initializeCamera() {
    camera.position.copy(new THREE.Vector3(spaceShip.position.x - distance * Math.sin(spaceShip.rotation.y), height, (spaceShip.position.z - distance * Math.cos(spaceShip.rotation.y))));
    camera.rotation.y = spaceShip.rotation.y - Math.PI;
}

function camMovement() {
    if (!spaceShip)
        return;
    
    if (!landedOnPlanet && lobbyStart) {
        camera.position.copy(new THREE.Vector3(spaceShip.position.x - distance * Math.sin(spaceShip.rotation.y), height, spaceShip.position.z - distance * Math.cos(spaceShip.rotation.y)));
        camera.rotation.y = spaceShip.rotation.y - Math.PI;
    }
    else {
        if (!planetInRange)
            return;
        const offset = 500 * (planetInRange.scale / 100);
        const SSoffset = offset - distance;   
        spaceShip.position.copy(new THREE.Vector3(planetInRange.mesh.position.x + SSoffset * Math.sin(planetInRange.mesh.rotation.y), spaceShip.position.y, planetInRange.mesh.position.z + SSoffset * Math.cos(planetInRange.mesh.rotation.y)));
        spaceShip.rotation.y += planetInRange.rotationSpeed;
        camera.position.copy(new THREE.Vector3(planetInRange.mesh.position.x + offset * Math.sin(planetInRange.mesh.rotation.y), height, planetInRange.mesh.position.z + offset * Math.cos(planetInRange.mesh.rotation.y)));
        camera.lookAt(planetInRange.mesh.position);
        spaceShip.rotation.set(camera.rotation.x, camera.rotation.y + 3, camera.rotation.z);
}
    
}

export { spaceShipMovement, camMovement };
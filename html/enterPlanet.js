import * as THREE from 'three';
import { spaceShip, camera, toggleBlurDisplay, toggleMinimapVisibility } from "./main.js";
import { resetOutline, resetOutlineAndText } from "./planetIntersection.js";

export let landedOnPlanet = false;

function resetRotations() {
    spaceShip.rotation.set(0, 0, 0);
        console.log(spaceShip.position);
        if (spaceShip.position.z > 0 && spaceShip.position.x < 0)
            spaceShip.rotation.set(0, THREE.MathUtils.degToRad(135), 0);
        else if (spaceShip.position.z > 0 && spaceShip.position.x > 0)
            spaceShip.rotation.set(0, THREE.MathUtils.degToRad(225), 0);
        else if (spaceShip.position.z < 0 && spaceShip.position.x < 0)
        spaceShip.rotation.set(0, THREE.MathUtils.degToRad(45), 0);
        else spaceShip.rotation.set(0, THREE.MathUtils.degToRad(315), 0);
        camera.rotation.set(0, 0, 0);
}

export function togglePlanet() {
    if (!landedOnPlanet)
        landedOnPlanet = true;
    else {
        resetOutline();
        resetRotations();
        landedOnPlanet = false;
    }
    toggleMinimapVisibility();
    resetOutlineAndText();
    toggleBlurDisplay();
}

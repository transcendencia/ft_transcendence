import * as THREE from 'three';
import { currentLanguage, getTranslatedText } from './loginPage.js';
import { spaceShip, camera, toggleBlurDisplay, toggleRSContainerVisibility } from "./main.js";
import { resetOutline, resetOutlineAndText, planetInRange } from "./planetIntersection.js";

export let landedOnPlanet = false;

var planetPanel = document.querySelector(".planetPanel");
var square = document.querySelector(".square");
var images = document.querySelectorAll(".planetPanel img");
let anim;

export function togglePanelDisplay() {
    if (anim)
        clearTimeout(anim);
    if (landedOnPlanet) {
        anim = setTimeout(function () {triggerInfiniteAnim()}, 2000);
        planetPanel.style.animation = "roll 2s forwards";
        images[0].style.animation = "moveImageRight 2s forwards";
        images[1].style.animation = "moveImageLeft 2s forwards";
        square.style.animation = "expandBG 2s forwards";
    } else {
        images[0].style.animation = "moveImageRightreverse 1s forwards";
        images[1].style.animation = "moveImageLeftreverse 1s forwards";
        square.style.animation = "expandBGreverse 1s forwards"
        anim = setTimeout(function() {planetPanel.style.animation = "";
    }, 2000)
    }
}

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

export function triggerInfiniteAnim() {
    images[0].style.animation = "upDownImgL 2s infinite alternate ease-in-out";
    images[1].style.animation = "upDownImgR 2s infinite alternate ease-in-out";
}

export function togglePlanet() {
    if (!landedOnPlanet)
        landedOnPlanet = true;
    else {
        resetOutline();
        resetRotations();
        landedOnPlanet = false;
    }
    toggleRSContainerVisibility();
    resetOutlineAndText();
    toggleBlurDisplay();
    togglePanelDisplay();
}

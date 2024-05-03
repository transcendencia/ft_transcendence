import * as THREE from 'three';
import { addTranslatedText ,setTranslatedText, currentLanguage } from './loginPage.js';
import { spaceShip, camera, cameraDirection, scene, outlinePass } from "./main.js";

const planetInfoText = document.getElementById('planetInfoText');
planetInfoText.textContent = '';
const enterPlanetText = document.getElementById('enterPlanetText');
enterPlanetText.textContent = '';

const raycaster = new THREE.Raycaster();

const rayLength = 3000; // Adjust as needed
let rayEndPoint = new THREE.Vector3();

export function updateRay() {
    camera.getWorldDirection(cameraDirection);
    rayEndPoint.copy(cameraDirection).multiplyScalar(rayLength).add(camera.position);
    raycaster.set(camera.position, cameraDirection); // Update raycaster with new direction
}

export let inRange = false;
let cursorOnPlanet = false;

export function resetOutlineAndText() {
    planetInfoText.textContent = '';
    enterPlanetText.textContent = '';
    outlinePass.selectedObjects = [];
    cursorOnPlanet = false;
}

function triggerAnimation() {
    var element = document.getElementById('planetInfoText');
    element.classList.remove('show'); // Remove 'hide' class
    void element.offsetWidth;
    element.classList.add('show'); // Add 'show' class
}

function displayPlanetDesc(planet) {
    if (planet.name === "settings")
        setTranslatedText(currentLanguage, 'settingsPlanetInfo', planetInfoText);
    else if (planet.name === "tournament")
        setTranslatedText(currentLanguage, 'tournamentPlanetInfo', planetInfoText);
    else if (planet.name === "arena")
        setTranslatedText(currentLanguage, 'arenaPlanetInfo', planetInfoText);
    triggerAnimation();
}

export function getPlanetIntersection() {
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const aimedObj = intersects[0].object;
        if (!aimedObj.planet)
            return;
        if (!cursorOnPlanet) {
            cursorOnPlanet = true; 
            outlinePass.selectedObjects = [];
            if (aimedObj.planet) {
                outlinePass.selectedObjects = [aimedObj];
                displayPlanetDesc(aimedObj.planet);
            }
        }
        else {
            if (aimedObj.planet.name != outlinePass.selectedObjects[0].planet.name)
                resetOutlineAndText();
            spaceShipInRange(aimedObj);
        }
    }
    else if (intersects.length === 0 && cursorOnPlanet)
        resetOutlineAndText();
}

export let planetInRange = null;

export function resetOutline() {
    outlinePass.visibleEdgeColor.set("#ffee00");
    enterPlanetText.textContent = '';
    inRange = false;
    planetInRange = null;
}

function spaceShipInRange(obj) {
    if (obj.planet) { 
        if (spaceShip.position.distanceTo(obj.position) < 4 * obj.planet.scale && !inRange) {       
            outlinePass.visibleEdgeColor.set("#00ff00");
            setTranslatedText(currentLanguage, 'enterPlanetText', enterPlanetText, '', '', function () {
                addTranslatedText(currentLanguage, obj.planet.name + 'PlanetName', enterPlanetText, ' - ', ' -')});
            inRange = true;
            planetInRange = obj.planet;
        }
        else if (spaceShip.position.distanceTo(obj.position) >= 4 * obj.planet.scale && inRange)
            resetOutline();
    }
}
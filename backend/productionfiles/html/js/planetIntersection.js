import * as THREE from 'three';
import {currentLanguage, getTranslatedText } from './loginPage.js';
import { spaceShip, camera, cameraDirection, scene, outlinePass } from "./main.js";

const planetInfoLines = document.getElementsByClassName('planetInfoText');
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

var elements = document.getElementsByClassName('planetInfoText');

export function resetOutlineAndText() {
    for (var i = 1; i < 4; i++)
        elements[i].textContent = '';
    enterPlanetText.textContent = '';
    outlinePass.selectedObjects = [];
    cursorOnPlanet = false;
    stopAnimation();
}

let timeouts = []; // To store setTimeout identifiers

function displayPlanetDesc(planet) {
    stopAnimation();

    for (let i = 1; i < 4; i++) {
        const timeout = setTimeout(function(index) {
            if (planet.name === "settings")
                planetInfoLines[index].textContent = getTranslatedText("settingsPlanetInfo" + index);
            else if (planet.name === "tournament")
                planetInfoLines[index].textContent = getTranslatedText("tournamentPlanetInfo" + index);
            else if (planet.name === "arena")
                planetInfoLines[index].textContent = getTranslatedText("arenaPlanetInfo" + index);
            const element = elements[index];
            element.classList.remove('typeWriting'); 
            void element.offsetWidth;
            element.classList.add('typeWriting');
            if (index != 3)
                element.style.borderRight = 'none';
        }, (i - 1) * 500, i);
        
        timeouts.push(timeout);
    }
}

function stopAnimation() {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
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
            enterPlanetText.textContent = getTranslatedText("enterPlanetText") + ' - ' + obj.planet.name + ' -';
            inRange = true;
            planetInRange = obj.planet;
        }
        else if (spaceShip.position.distanceTo(obj.position) >= 4 * obj.planet.scale && inRange)
            resetOutline();
    }
}

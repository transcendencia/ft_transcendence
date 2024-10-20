import * as THREE from 'three';
import { spaceShip, camera, toggleBlurDisplay, toggleRSContainerVisibility, blockingPanel, passwordWindow, aliasWindow} from "./main.js";
import { resetTournament } from '../../tournament/js/newTournament.js';
import { initArenaPlanet, initTournamentPlanet, resetArenaPage } from './arenaPage.js';
import { resetOutline, resetOutlineAndText, planetInRange } from "./planetIntersection.js";
import { initUserPlanet } from './userPage.js';
import {  } from './main.js';

export let landedOnPlanet = false;
let planetPanel = document.querySelectorAll(".planetPanel");
let background = document.querySelectorAll(".background");
let imagesArena = planetPanel[0].querySelectorAll("img");
let imagesUser = planetPanel[1].querySelectorAll("img");
let imagesTournament = planetPanel[2].querySelectorAll("img");
let anim;

export let checkEach5Sec;

export function setCheckerToInterval(intervalObj) {
  checkEach5Sec = intervalObj;
}

export function togglePanelDisplay() {
    if (anim)
        clearTimeout(anim);
    if (landedOnPlanet && planetInRange.name == "arena") {
        anim = setTimeout(function () {triggerInfiniteAnim(imagesArena[0], imagesArena[1])}, 2000);
        planetPanel[0].style.animation = "roll 2s forwards";
        planetPanel[0].style.visibility = "visible";
        imagesArena[0].style.animation = "moveImageRight 2s forwards";
        imagesArena[1].style.animation = "moveImageLeft 2s forwards";
        background[0].style.animation = "expandBG 2s forwards";
        initArenaPlanet();
    } else {
        imagesArena[0].style.animation = "moveImageRightreverse 1s forwards";
        imagesArena[1].style.animation = "moveImageLeftreverse 1s forwards";
        background[0].style.animation = "expandBGreverse 1s forwards";
        anim = setTimeout(function() {
            planetPanel[0].style.animation = "";
            planetPanel[0].style.visibility = "hidden";
        }, 1500);
    }

    if (landedOnPlanet && planetInRange.name == "settings") {
        anim = setTimeout(function () {triggerInfiniteAnim(imagesUser[0], imagesUser[1])}, 2000);
        planetPanel[1].style.animation = "roll 2s forwards";
        planetPanel[1].style.visibility = "visible";
        imagesUser[0].style.animation = "moveImageRight 2s forwards";
        imagesUser[1].style.animation = "moveImageLeft 2s forwards";
        background[1].style.animation = "expandBG 2s forwards";
        initUserPlanet();
    } else {
        imagesUser[0].style.animation = "moveImageRightreverse 1s forwards";
        imagesUser[1].style.animation = "moveImageLeftreverse 1s forwards";
        background[1].style.animation = "expandBGreverse 1s forwards"
        anim = setTimeout(function() {
            planetPanel[1].style.animation = "";
            planetPanel[1].style.visibility = "hidden";
        }, 1500)
    }

    if (landedOnPlanet && planetInRange.name == "tournament") {
        anim = setTimeout(function () {triggerInfiniteAnim(imagesTournament[0], imagesTournament[1])}, 2000);
        planetPanel[2].style.animation = "roll 2s forwards";
        planetPanel[2].style.visibility = "visible";
        imagesTournament[0].style.animation = "moveImageRight 2s forwards";
        imagesTournament[1].style.animation = "moveImageLeft 2s forwards";
        background[2].style.animation = "expandBG 2s forwards";
        initTournamentPlanet();
    } else {
        imagesTournament[0].style.animation = "moveImageRightreverse 1s forwards";
        imagesTournament[1].style.animation = "moveImageLeftreverse 1s forwards";
        background[2].style.animation = "expandBGreverse 1s forwards"
        anim = setTimeout(function() {
            planetPanel[2].style.animation = "";
            planetPanel[2].style.visibility = "hidden";
        }, 1500)
    }
}

function resetRotations() {
    spaceShip.rotation.set(0, 0, 0);
    if (spaceShip.position.z > 0 && spaceShip.position.x < 0)
        spaceShip.rotation.set(0, THREE.MathUtils.degToRad(135), 0);
    else if (spaceShip.position.z > 0 && spaceShip.position.x > 0)
        spaceShip.rotation.set(0, THREE.MathUtils.degToRad(225), 0);
    else if (spaceShip.position.z < 0 && spaceShip.position.x < 0)
    spaceShip.rotation.set(0, THREE.MathUtils.degToRad(45), 0);
    else spaceShip.rotation.set(0, THREE.MathUtils.degToRad(315), 0);
    camera.rotation.set(0, 0, 0);
}

export function triggerInfiniteAnim(img1, img2) {
    img1.style.animation = "upDownImgL 2s infinite alternate ease-in-out";
    img2.style.animation = "upDownImgR 2s infinite alternate ease-in-out";
}

export function cancelLanding()
{
    landedOnPlanet = false;
}

export function togglePlanet(toggleRsContainer = false) {
    if (!landedOnPlanet)
        landedOnPlanet = true;
    else {
        if (planetInRange.name === 'arena')
        	resetArenaPage();
        else if (planetInRange.name === 'tournament')
            resetTournament();
        clearInterval(checkEach5Sec);
        resetOutline();
        resetRotations();
        landedOnPlanet = false;
        passwordWindow.classList.remove("showRectangle");
        aliasWindow.classList.remove("showRectangle");
        blockingPanel.classList.remove('show');
    }
    if (toggleRsContainer === true)
        toggleRSContainerVisibility();
    resetOutlineAndText();
    toggleBlurDisplay();
    togglePanelDisplay();
}

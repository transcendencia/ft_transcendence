import * as THREE from 'three';
import { camera, landedOnPlanet } from './main.js';
import { showPage } from './showPages.js';
import { currentLanguage, getTranslatedText } from './translatePages.js';


export let inCockpit = false;

const backPosition = new THREE.Vector3(0, 4.5, -1295); // Define the target position for the camera
const frontPosition = new THREE.Vector3(0, 4.5, -1304); // Define the target position for the camera
export function moveCameraToFrontOfCockpit() {1
    const duration = 1000; // Define the duration of the animation in milliseconds
    console.log(backPosition);
    const cameraAnimation = new TWEEN.Tween(camera.position) // Create a new tween animation for the camera position
        .to(backPosition, duration) // Set the target position and duration
        .easing(TWEEN.Easing.Quadratic.Out) // Set the easing function for the animation
        .start(); // Start the animation
    showPage('signUpPage');
    inCockpit = true;
}


export function moveCameraToBackOfCockpit() {
    const duration = 1000; // Define the duration of the animation in milliseconds
    console.log(frontPosition);
    const cameraAnimation = new TWEEN.Tween(camera.position) // Create a new tween animation for the camera position
    .to(frontPosition, duration) // Set the target position and duration
    .easing(TWEEN.Easing.Quadratic.Out) // Set the easing function for the animation
    .start(); // Start the animation
    showPage('loginPage');
    inCockpit = false;
}

const backToLoginButton = document.querySelector('.backButton');

backToLoginButton.addEventListener('click', function() {
    moveCameraToBackOfCockpit();
});


var submitChangeButton = document.getElementById("submitSignUp");
submitChangeButton.addEventListener("click", handleSignup);
// Add event listener to the sign-up form
// const signupForm = document.getElementById('signupForm');
// signupForm.addEventListener('submit', handleSignup);

//Add event listner to display RGPG page
const RGPDPolicy = document.getElementById('RGPDPolicy');
RGPDPolicy.addEventListener('click', function() {
    console.log("on capte dans signup");
    showPage('rgpdPage');
});

//Add event listner to display sign-up page
const RGPDBack = document.getElementById('RGPDBack');
RGPDBack.addEventListener('click', function() {
    if (landedOnPlanet) {
        blockingPanel.style.visibility = 'hidden';
        showPage('none');
    }
        
    else
        showPage('signUpPage');
});

// Handle form submission
function handleSignup(event) {
    event.preventDefault();
    
    var form = document.getElementById("signupForm");
    var formData = new FormData(form);
    formData.append('language', currentLanguage);
    // console.log(formData);
    // const formData = new FormData(event.target);
    fetch('signup/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        var signupMessageCont = document.querySelector('.signupMessageCont');
        if (data.status == "success") {
            signupMessageCont.classList.remove("failure");
            signupMessageCont.classList.add("success");
        } else {
            signupMessageCont.classList.remove("success");
            signupMessageCont.classList.add("failure");
        }
        document.getElementById('messageContainerSignup').innerText = getTranslatedText(data.msg_code);
    })
    .catch(error => {
        console.error('There was a problem with the sign-up:', error);
    });
}
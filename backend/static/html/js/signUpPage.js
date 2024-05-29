import * as THREE from 'three';
import { camera } from './main.js';
import { showPage } from './showPages.js';
import { oldLocation, setOldLocation, getOldLocation } from "./loginPage.js";
export let inCockpit = false;

export function moveCameraToFrontOfCockpit() {
    const targetPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z + 9); // Define the target position for the camera
    const duration = 1000; // Define the duration of the animation in milliseconds

    const cameraAnimation = new TWEEN.Tween(camera.position) // Create a new tween animation for the camera position
        .to(targetPosition, duration) // Set the target position and duration
        .easing(TWEEN.Easing.Quadratic.Out) // Set the easing function for the animation
        .start(); // Start the animation
    showPage('signUpPage');
    inCockpit = true;
}

export function moveCameraToBackOfCockpit() {
    const targetPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z - 9); // Define the target position for the camera
    const duration = 1000; // Define the duration of the animation in milliseconds
    
    const cameraAnimation = new TWEEN.Tween(camera.position) // Create a new tween animation for the camera position
    .to(targetPosition, duration) // Set the target position and duration
    .easing(TWEEN.Easing.Quadratic.Out) // Set the easing function for the animation
    .start(); // Start the animation
    showPage('loginPage');
    inCockpit = false;
}

const backToLoginButton = document.querySelector('.backButton');

if (backToLoginButton.addEventListener('click', function() {
    moveCameraToBackOfCockpit();
    window.location.hash = '#loginPage';  
}));

else if (addEventListener("hashchange", (event) => {
    if (window.location.hash == '#signUpPage' && oldLocation == '#loginPage')
        moveCameraToFrontOfCockpit();
    if (window.location.hash == '#galaxy')
    {
        console.log('SIGN UP catch #galaxy');
        console.log(window.location.hash);
        console.log('SIGN UP oldLocation');
        console.log(oldLocation);
    }
    //When you are in galaxy 
    if (window.location.hash == '#signUpPage' && oldLocation == '#galaxy')
    {
        console.log('SIGN UP catch #signUp');
        console.log(window.location.hash);
        console.log('SIGN UP oldLocation for signUp');
        console.log(oldLocation);
        showPage('signUpPage');
        moveCameraToFrontOfCockpit();
    }
}));

// // Add event listener to the sign-up form
// const signupForm = document.getElementById('signupForm');
// signupForm.addEventListener('submit', handleSignup);

// // Handle form submission
// function handleSignup(event) {
//     event.preventDefault();

//     console.log(signupForm);
//     const formData = new FormData(event.target);
//     fetch('signup/', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if (!response.ok) {
//             console.log(response)
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .catch(error => {
//         console.error('There was a problem with the sign-up:', error);
//     });
// }
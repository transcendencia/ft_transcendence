import * as THREE from 'three';
import { camera } from './main.js';

export function moveCameraToCockpit() {
    const targetPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z + 9); // Define the target position for the camera
    const duration = 1000; // Define the duration of the animation in milliseconds

    const cameraAnimation = new TWEEN.Tween(camera.position) // Create a new tween animation for the camera position
        .to(targetPosition, duration) // Set the target position and duration
        .easing(TWEEN.Easing.Quadratic.Out) // Set the easing function for the animation
        .start(); // Start the animation
}

import {THREE, scene} from "./main.js";

// STARS
function addStar(){
    const geometry = new THREE.SphereGeometry(1, 100, 100);
    const material = new THREE.MeshStandardMaterial({color:0xffffff})
    const star = new THREE.Mesh( geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 5000 ));

    star.position.set(x, y, z);
    scene.add(star)
}

export {addStar};
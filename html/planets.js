import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { scene } from "./main.js";

class Planet {
	constructor(distance, scale, mesh, orbitMesh) {
		this.scene = scene;
        this.sun = sun;
        this.distance = distance;
        this.scale = scale;
		this.orbitMesh = orbitMesh;
        this.mesh = mesh; // Référence au modèle 3D de la planète
        this.orbitSpeed = null; // Vitesse de l'orbite de la planète
		this.initialAngle = null;
		this.modelLoaded = false; // Angle initial pour la position de la planète
		this.initialize();
    }

	initialize() {
		this.orbitSpeed = Math.random() * 0.005 + 0.005;
        this.initialAngle = Math.random() * Math.PI * 2;
        this.mesh.position.x = this.sun.position.x + this.distance * Math.cos(this.initialAngle);
        this.mesh.position.y = this.sun.position.y;
		this.mesh.position.z = this.sun.position.z + this.distance * Math.sin(this.initialAngle);
		this.mesh.scale.set(this.scale, this.scale, this.scale);
		if (this.visuel === 'settingsPlanet.glb') { 
			this.mesh.rotation.x = 1;
			this.orbitMesh.rotation.x = 0.3;
		}
		else if (this.orbitMesh != null){
			this.mesh.rotation.x = 0.3;
			this.orbitMesh.rotation.x = 0.3;
		}
		if (this.orbitMesh === null)
			return;
		this.orbitMesh.scale.set(this.scale, this.scale, this.scale);
		this.orbitMesh.position.x = this.sun.position.x + this.distance * Math.cos(this.initialAngle);
        this.orbitMesh.position.y = this.sun.position.y;
		this.orbitMesh.position.z = this.sun.position.z + this.distance * Math.sin(this.initialAngle);

    }
}

const planets = [];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const sun = new THREE.Mesh(sphereGeometry, sphereMaterial);

function setupPlanets(models) {
	sun.scale.set(300, 300, 300);
	sun.position.set(0, 5, 0);
	scene.add(sun);
	const planetData = [
		{ distance: 1200, scale: 100, mesh: models[0], orbitMesh: models[1] },
		{ distance: 600, scale: 35, mesh: models[2], orbitMesh: models[3] },
		{ distance: 900, scale: 80, mesh: models[4], orbitMesh: null},
	]
	let i = 0;
	planetData.forEach(data => {
		console.log(models[i].position);
		const planet = new Planet(data.distance, data.scale, data.mesh, data.orbitMesh);
		planets.push(planet);
		i++;
	});
}

export {sun, planets, setupPlanets}

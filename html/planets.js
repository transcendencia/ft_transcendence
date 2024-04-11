import * as THREE from 'three';
import { scene } from "./main.js";


class Planet {
	constructor(name, distance, scale, mesh, orbitMesh, hitboxSize, desc) {
		this.scene = scene;
        this.sun = sun;
        this.distance = distance;
		this.hitboxSize = hitboxSize;
		this.scale = scale;
        this.desc = desc;
		this.orbitMesh = orbitMesh;
        this.mesh = mesh; // Référence au modèle 3D de la planète
        this.orbitSpeed = null; // Vitesse de l'orbite de la planète
		this.initialAngle = null;
		this.modelLoaded = false; // Angle initial pour la position de la planète
		this.name = name;
		this.initialize();
    }
	setPlanetInfo() {
		this.mesh.scale.set(this.scale, this.scale, this.scale);
		this.orbitSpeed = Math.random() * 0.001 + 0.001;
        this.initialAngle = Math.random() * Math.PI * 2;
		this.mesh.position.x = this.sun.position.x + this.distance * Math.cos(this.initialAngle);
        this.mesh.position.y = this.sun.position.y;
		this.mesh.position.z = this.sun.position.z + this.distance * Math.sin(this.initialAngle);
	}
	setOrbitRingInfo() {
		this.orbitMesh.scale.set(this.scale, this.scale, this.scale);
		this.orbitMesh.position.x = this.sun.position.x + this.distance * Math.cos(this.initialAngle);
		this.orbitMesh.position.y = this.sun.position.y;
		this.orbitMesh.position.z = this.sun.position.z + this.distance * Math.sin(this.initialAngle);
	}
	setupArena() {
		this.mesh.position.y = -50;
		this.orbitMesh.position.y = -50;
	}
	setupSettings() {
	}
	setupTournament() {
	}
	createHitbox() {
		const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
		const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true});
		this.hitbox = new THREE.Mesh(sphereGeometry, sphereMaterial);
		this.hitbox.scale.set(this.scale + this.hitboxSize, this.scale + this.hitboxSize, this.scale + this.hitboxSize);
		this.hitbox.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
		this.hitbox.planet = this;
		scene.add(this.hitbox);
	}
	initialize() {
		this.setPlanetInfo();
		if (this.orbitMesh != null)
			this.setOrbitRingInfo();
		if (this.name === 'settings')
			this.setupSettings();
		if (this.name === 'arena')
			this.setupArena();
		if (this.name === 'tournament')
			this.setupTournament();
		this.createHitbox();
    }
	
}

const planets = [];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const sun = new THREE.Mesh(sphereGeometry, sphereMaterial);

sun.scale.set(300, 300, 300);
sun.position.set(0, -10, 0);

function setupPlanets(models) {
	scene.add(sun);
	const planetData = [
		{name: 'arena', distance: 1200, scale: 100, mesh: models['arena'], orbitMesh: models['arenaRing'], hitboxSize: 80,
			desc: "[Name]: Pong arena\n[ID]: PA-0667 \n[Atmosphere]: none \n[Temperature]: -270.45°C"},
		{name: 'settings', distance: 600, scale: 35, mesh: models['settings'], orbitMesh: models['settingsRing'], hitboxSize: 40,
			desc: "[Name]: Settings changer \n[ID]: SO-0911 \n[Atmosphere]: CO₂-SO₂-H₂S \n[Temperature]: +127°C"},
		{name: 'tournament', distance: 900, scale: 80, mesh: models['tournament'], orbitMesh: null, hitboxSize: 90,
			desc: "[Name]: The tournament™ \n[ID]: XR-0720 \n[Atmosphere]: N₂-0₂-Ar-Ne \n[Temperature]: 14°C"},
	]
	planetData.forEach(data => {
		const planet = new Planet(data.name, data.distance, data.scale, data.mesh, data.orbitMesh, data.hitboxSize, data.desc);
		planets.push(planet);
	});
}

export {sun, planets, setupPlanets}

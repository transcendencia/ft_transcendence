import * as THREE from "three";
import { scene } from "./main.js";


class Planet {
	constructor(name, distance, scale, mesh, orbitMesh, hitboxSize, hitboxColor) {
		this.scene = scene;
        this.sun = sun;
        this.distance = distance;
		this.hitboxSize = hitboxSize;
		this.scale = scale;
		this.orbitMesh = orbitMesh;
		this.mesh = mesh; // Référence au modèle 3D de la planète
        this.orbitSpeed = null; // Vitesse de l'orbite de la planète
		this.initialAngle = null;
		this.modelLoaded = false; // Angle initial pour la position de la planète
		this.name = name;
		this.trajectoryPoints = [];
		this.hitboxColor = hitboxColor;
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
		this.rotationSpeed = this.orbitSpeed * 4;
	}
	setupSettings() {
	}
	setupTournament() {
		this.rotationSpeed = this.orbitSpeed * 4;
	}
	createHitbox() {
		const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
		const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0});
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
// New atmosphere shader
const atmosphereVertexShader = `
	varying vec3 vNormal;
	varying vec3 vPosition;
	uniform float time;

	void main() {
		vNormal = normalize(normalMatrix * normal);
		vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`
;

const atmosphereFragmentShader = `
    uniform vec3 glowColor;
    uniform float glowIntensity;
    uniform float time;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        float intensity = pow(0.75 - dot(vNormal, vec3(0, 0, 1.0)), 2.0) * glowIntensity;
        gl_FragColor = vec4(glowColor, 1.0) * intensity;
    }
`;

	// Atmosphere material
const atmosphereMaterial = new THREE.ShaderMaterial({
	uniforms: {
		glowColor: { value: new THREE.Color(0xffaa33) },
		glowIntensity: { value: 0.4 },
		time: { value: 0}
	},
	vertexShader: atmosphereVertexShader,
	fragmentShader: atmosphereFragmentShader,
	side: THREE.BackSide,
	blending: THREE.AdditiveBlending,
	transparent: true
});
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('static/game/assets/sunTexture.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({
	color:0xff9900,
	side: THREE.DoubleSide,
	map: texture
})

const sunGeometry = new THREE.SphereGeometry(1, 128, 128);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

const atmosphereGeometry = new THREE.SphereGeometry(1.3, 64, 64);
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);


const boxGeometry = new THREE.BoxGeometry(40, 40, 40);
const boxMaterial = new THREE.MeshBasicMaterial({
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);

sun.scale.set(300, 300, 300);
atmosphere.scale.set(300, 300, 300);
sun.position.set(0, -10, 0);

function setupPlanets(models) {
	scene.add(sun);
	scene.add(atmosphere);
	scene.add(box);
	const planetData = [
		{name: 'arena', distance: 1200, scale: 100, mesh: models['arena'], orbitMesh: models['arenaRing'], hitboxSize: 80},
		{name: 'settings', distance: 600, scale: 50, mesh: models['settings'], orbitMesh: models['settingsRing'], hitboxSize: 40},
		{name: 'tournament', distance: 900, scale: 80, mesh: models['tournament'], orbitMesh: null, hitboxSize: 90},
	]
	planetData.forEach(data => {
		const planet = new Planet(data.name, data.distance, data.scale, data.mesh, data.orbitMesh, data.hitboxSize);
		planets.push(planet);
	});
}

export {sun, atmosphere, planets, setupPlanets, box}

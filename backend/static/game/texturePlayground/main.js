import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { vertexShader, vertexMain, vertexPars } from './shaders/vertex.js';
import { fragmentShader, fragmentMain, fragmentPars } from './shaders/fragment.js';
import { fragmentPass, vertexPass, loadingFragmentPass } from './shaders/fragmentPass.js';
import { Water } from 'three/addons/objects/Water.js';
import { lavaFragmentShader, lavaVertexShader } from './shaders/lavaShader.js';
import { rayMarchingFragmentShader, rayMarchingVertexShader } from './shaders/raymarching.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.z = 0;
camera.position.y = 12;
camera.lookAt(0, 0, 0);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var cubeLoader = new THREE.CubeTextureLoader();
var cubeMapTexture = cubeLoader.load([
  'skyMap/nx.jpg',
  'skyMap/px.jpg',
    'skyMap/py.jpg',
    'skyMap/ny.jpg',
    'skyMap/nz.jpg',
    'skyMap/pz.jpg'
]);

// scene.background = cubeMapTexture;

let water;

const waterGeometry = new THREE.PlaneGeometry( 100000, 100000 );

water = new Water(
  waterGeometry,
  {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load( 'water/water.jpg', function ( texture ) {

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    } ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    opacity: 1.0,
    fog: scene.fog !== undefined
  }
);

water.rotation.x = - Math.PI / 2;

// scene.add( water );


// Create a ball geometry
// Create a standard material
const material = new THREE.MeshStandardMaterial({
    onBeforeCompile: (shader) => {
      // storing a reference to the shader object
      material.userData.shader = shader

      // uniforms
      shader.uniforms.uTime = { value: 0 }

      const parsVertexString = /* glsl */ `#include <displacementmap_pars_vertex>`
      shader.vertexShader = shader.vertexShader.replace(
        parsVertexString,
        parsVertexString + vertexPars
      )

      const mainVertexString = /* glsl */ `#include <displacementmap_vertex>`
      shader.vertexShader = shader.vertexShader.replace(
        mainVertexString,
        mainVertexString + vertexMain
      )

      const mainFragmentString = /* glsl */ `#include <normal_fragment_maps>`
      const parsFragmentString = /* glsl */ `#include <bumpmap_pars_fragment>`
      shader.fragmentShader = shader.fragmentShader.replace(
        parsFragmentString,
        parsFragmentString + fragmentPars
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        mainFragmentString,
        mainFragmentString + fragmentMain
      )
    },
  });

material.userData.shader = { uniforms: { uTime: { value: 0 } } };



const geometry = new THREE.BoxGeometry(28, 40, 34);
let width = 40; // Width of the boxGeometry
let height = 5; // Height of the boxGeometry
let r = 10; // Desired radius of the circles

let scaleFactor = Math.min(width / (2 * r), height / (2 * r));
//reflective material without shaders
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        scaleFactor: { value: scaleFactor }
    },
    vertexShader: vertexPass,
    fragmentShader: fragmentPass
});


// Create a ball mesh
const object = new THREE.Mesh(geometry, shaderMaterial);
object.position.y = 10;

// scene.add(object);
// Create light
  // lighting
  const dirLight = new THREE.DirectionalLight('#526cff', 0.6)
  dirLight.position.set(2, 2, 2)

  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
  scene.add(dirLight, ambientLight)

// Create orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set background color to off/white
renderer.setClearColor(0x101114);


const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));




let planeGeometry = new THREE.BoxGeometry(10, 10, 10);
let planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        cameraPos: { value: new THREE.Vector3(0.5,-1.2,-15) },
        cameraDir: { value: new THREE.Vector3(0.4,0.4,0) }
    },
    vertexShader: rayMarchingVertexShader,
    fragmentShader: rayMarchingFragmentShader
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);



let keyDown = {
  'ArrowLeft': false,
  'ArrowRight': false,
  'ArrowUp': false,
  'ArrowDown': false,
  'w': false,
  'a': false,
  's': false,
  'd': false,
  ' ': false,
  'c': false,
  'v': false,
  'n': false,
  'o': false,
  'p': false,
  'l': false,
  'i': false,
  'u': false,
  'e': false,
  'g': false,
  'b': false,
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
  '6': false,
};


document.addEventListener('keydown', (event) => {
  if (keyDown.hasOwnProperty(event.key))
      keyDown[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  if (keyDown.hasOwnProperty(event.key))
      keyDown[event.key] = false;
});


function monitorUniforms() {
  if (keyDown['ArrowLeft'])
      planeMaterial.uniforms.cameraDir.value.x -= 0.1;
  if (keyDown['ArrowRight'])
      planeMaterial.uniforms.cameraDir.value.x += 0.1;
  if (keyDown['ArrowUp'])
      planeMaterial.uniforms.cameraDir.value.y += 0.1;
  if (keyDown['ArrowDown'])
      planeMaterial.uniforms.cameraDir.value.y -= 0.1;
  if (keyDown['w'])
      planeMaterial.uniforms.cameraPos.value.z += 0.1;
  if (keyDown['s'])
      planeMaterial.uniforms.cameraPos.value.z -= 0.1;
  if (keyDown['a'])
      planeMaterial.uniforms.cameraPos.value.x -= 0.1;
  if (keyDown['d'])
      planeMaterial.uniforms.cameraPos.value.x += 0.1;
}

const fpsCounter = document.getElementById('fps-counter');

let frameCount = 0;
let lastTime = performance.now(); // Initialize lastTime here

function updateFpsCounter() {
    var currentTime = performance.now();

    frameCount++;

    if (currentTime > lastTime + 1000) {
        var fps = Math.round(frameCount);
        fpsCounter.innerHTML = 'FPS: ' + fps;
        frameCount = 0;
        lastTime = currentTime;
    }
}
// Render function
function render() {
    requestAnimationFrame(render);
    updateFpsCounter();
    monitorUniforms();
    plane.material.uniforms.uTime.value += 0.01;
    object.material.uniforms.uTime.value += 0.05;
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    // water.material.uniforms['size'].value = 1.11;
    composer.render();
}

// Call the render function
render();
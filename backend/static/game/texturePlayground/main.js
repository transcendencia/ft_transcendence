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
import { Water } from 'three/addons/objects/Water.js';
// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 18;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var cubeLoader = new THREE.CubeTextureLoader();
var cubeMapTexture = cubeLoader.load([
  'parkingMap/nx.jpg',
  'parkingMap/px.jpg',
    'parkingMap/py.jpg',
    'parkingMap/ny.jpg',
    'parkingMap/nz.jpg',
    'parkingMap/pz.jpg'
]);

scene.background = cubeMapTexture;

let water;

const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

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

scene.add( water );


// Create a ball geometry
const geometry = new THREE.BoxGeometry(40, 5, 40);
console.log(geometry.attributes)
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

//reflective material without shaders
const reflectiveMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.0,
  metalness: 1,
  envMap: cubeMapTexture,
  envMapIntensity: 1.2,
  side: THREE.DoubleSide
});

// Create a ball mesh
const ball = new THREE.Mesh(geometry, reflectiveMaterial);
scene.add(ball);

// Create light
  // lighting
  const dirLight = new THREE.DirectionalLight('#526cff', 0.6)
  dirLight.position.set(2, 2, 2)

  const ambientLight = new THREE.AmbientLight('#4255ff', 0.5)
  scene.add(dirLight, ambientLight)

// Create orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set background color to off/white
renderer.setClearColor(0x101114);
console.log(water.material.uniforms);
// Render function
function render() {
    requestAnimationFrame(render);
    water.material.uniforms[ 'time' ].value += 1.0 / 2.0;
    water.material.uniforms['size'].value = 1.11;
    water.material.uniforms[ 'waterColor' ].value.r = 1;
    water.material.uniforms[ 'waterColor' ].value.g = 0;
    water.material.uniforms[ 'waterColor' ].value.b = 0;
    renderer.render(scene, camera);
}

// Call the render function
render();
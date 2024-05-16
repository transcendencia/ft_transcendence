import * as THREE from 'three';

export class OceanMap {
    constructor(arena) {
        this.arena = arena;
        this.scene = arena.scene;
        this.oceanCubeMapTexture = cubeLoader.load([
            '../../static/game/texturePlayground/parkingMap/nx.jpg',
            '../../static/game/texturePlayground/parkingMap/px.jpg',
              '../../static/game/texturePlayground/parkingMap/py.jpg',
              '../../static/game/texturePlayground/parkingMap/ny.jpg',
              '../../static/game/texturePlayground/parkingMap/nz.jpg',
              '../../static/game/texturePlayground/parkingMap/pz.jpg'
          ]);
        this.reflectiveMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            roughness: 0.0,
            metalness: 0.9,
            envMap: cubeMapTexture,
            envMapIntensity: 1,
            side: THREE.DoubleSide
          });
        this.water = water;
        this.mapActive = false;
    }
    initMap()
    {
        if (!this.mapActive)
        {
            this.mapActive = true;
            this.arena.material = this.reflectiveMaterial;
            this.scene.add(this.water);
            this.scene.background = this.oceanCubeMapTexture;
            this.arena.bloomPass.strength = 0.0;
        }
    }
    updateMap()
    {
        this.water.material.uniforms['time'].value += 1.0 / 60.0;
    }
    closeMap()
    {
        if (this.mapActive)
        {
            this.mapActive = false;
            this.scene.remove(this.water);
            this.arena.material = this.arena.defaultMaterial;
            this.arena.bloomPass.strength = 1.0;
        }
    }

}    
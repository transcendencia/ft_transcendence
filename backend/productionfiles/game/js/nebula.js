import * as THREE from "three";

const loader = new THREE.TextureLoader();

function getSprite({ color, opacity, pos, size }) {
  const spriteMat = new THREE.SpriteMaterial({
    color,
    map: loader.load("static/game/assets/rad-grad.png"),
    transparent: true,
    opacity,
  });
  spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(pos.x, -pos.y, pos.z);
  size += Math.random() - 0.5;
  sprite.scale.set(size, size, size);
  sprite.material.rotation = 0;
  return sprite;
}

function getNebula({
  hue = 0.0,
  numSprites = 10,
  opacity = 1,
  radius = 1,
  sat = 0.5,
  size = 1,
  z = 0,
  x = 0,
}) {
  const layerGroup = new THREE.Group();
  for (let i = 0; i < numSprites; i += 1) {
    let angle = (i / numSprites) * Math.PI * 2;
    const pos = new THREE.Vector3(
      x + Math.cos(angle) * Math.random() * radius,
      Math.sin(angle) * Math.random() * radius,
      z + Math.random()
    );
    const length = new THREE.Vector3(pos.x, pos.y, 0).length();
    // const hue = 0.6; // (0.9 - (radius - length) / radius) * 1;

    let color = new THREE.Color().setHSL(hue, 1, sat);
    const sprite = getSprite({ color, opacity, pos, size });
    layerGroup.add(sprite);
  }
  return layerGroup;
}
export default getNebula;
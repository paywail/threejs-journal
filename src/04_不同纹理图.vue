<script setup lang="ts">
import { onMounted,ref ,reactive} from 'vue';
import * as THREE from 'THREE';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@three-ts/orbit-controls';

import { gsap } from 'gsap';
import { Loader, Texture } from 'THREE';

const container = ref(null);


// 场景
const scene = new THREE.Scene();

// 相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);
scene.add(camera);


// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);



/* 纹理加载方式一： */
/* const image = new Image();
const texture = new THREE.Texture(image);
image.addEventListener('load', () => { 
  texture.needsUpdate = true;
})
image.src = './src/assets/11/color.jpg'; */
/* 纹理加载方式二： */
const textureLoader = new THREE.TextureLoader(); 
const doorColorTexture = textureLoader.load('./src/assets/11/color.jpg');
const doorAlphaTexture = textureLoader.load('./src/assets/11/alpha.jpg');
const doorAOTexture = textureLoader.load('./src/assets/11/ambientOcclusion.jpg');
const doorMetalTexture = textureLoader.load('./src/assets/11/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('./src/assets/11/roughness.jpg');
const doorNormalTexture = textureLoader.load('./src/assets/11/normal.jpg');
const dooorHeightTexture = textureLoader.load('./src/assets/11/height.png');
/* 多个纹理的加载 */
/* const loaderManager = new THREE.LoadingManager();
const TextureLoader = new THREE.TextureLoader(loaderManager);
loaderManager.onProgress = (url,loaded,total) => {
  console.log(url);
  console.log(loaded);
  console.log(total);
}
const materials = [
  new THREE.MeshBasicMaterial({map:TextureLoader.load('./src/assets/11/color.jpg')}),
  new THREE.MeshBasicMaterial({map:TextureLoader.load('./src/assets/11/ambientOcclusion.jpg')}),
  new THREE.MeshBasicMaterial({map:TextureLoader.load('./src/assets/11/height.png')}),
  new THREE.MeshBasicMaterial({map:TextureLoader.load('./src/assets/11/metalness.jpg')}),
  new THREE.MeshBasicMaterial({map:TextureLoader.load('./src/assets/11/normal.jpg')}),
  new THREE.MeshBasicMaterial({map:TextureLoader.load('./src/assets/11/roughness.jpg')}),
] */

// 物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1,20,20,20);
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array,2));
const materials = new THREE.MeshStandardMaterial({
  map: doorColorTexture,
  displacementScale:0.1,
  displacementMap:dooorHeightTexture,
  normalMap: doorNormalTexture,
  roughness:1,
  roughnessMap: doorRoughnessTexture,
  metalness:1,
  metalnessMap: doorMetalTexture,
  // 环境光
  aoMap: doorAOTexture,     
  // 透明alpha 纹理
  /* alphaMap: doorAlphaTexture,
  transparent: true */
})
const cube = new THREE.Mesh(cubeGeometry, materials);
scene.add(cube);
cube.position.set(0, 0, 0);

/* const colorMaterial = new THREE.MeshStandardMaterial({
  map: doorColorTexture,
})
const constractCube = new THREE.Mesh(cubeGeometry, colorMaterial);
scene.add(constractCube);
constractCube.position.set(2, 0, 0); */


// 光
const leftDirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
leftDirLight.position.set(-5, 6, 5);
scene.add(leftDirLight);
const rightDirLight = new THREE.DirectionalLight();
rightDirLight.position.set(5, 6, 5);
scene.add(rightDirLight);
/* const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(200, 1000, 1000);
scene.add(spotLight); */
/* const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(0, 0, 10);
scene.add(light); */
// const timer = new THREE.Clock();

function render() {
  requestAnimationFrame(render);
/*   const elepase = timer.getElapsedTime();
  cube.rotation.y = elepase * Math.PI * 0.1;*/
  renderer.render(scene, camera); 
};
render();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 双击全屏
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else { 
    document.exitFullscreen();
  }
})


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;


onMounted(() => {
  container.value.appendChild(renderer.domElement);
  render();
})


</script>

<template>
  <div id="canvasContainer" ref="container">
  </div>
</template>

<style>
*{
  margin: 0;
  padding: 0;
}
#app{
  margin: 0;
  padding: 0;
}
</style>

<script setup lang="ts">
import { onMounted,ref ,reactive} from 'vue';
import * as THREE from 'THREE';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from '@three-ts/orbit-controls';
import { gsap } from 'gsap';
import { Mesh } from 'THREE';


const container = ref(null);

// 场景
const scene = new THREE.Scene();

// 相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 5);
scene.add(camera);


// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const textureLoader = new THREE.TextureLoader();
const matcapMap = textureLoader.load('./src/assets/11/1.jpg');
const material = new THREE.MeshMatcapMaterial({ matcap: matcapMap });


const fontLoader = new FontLoader();
fontLoader.load('/static/font/helvetiker_regular.typeface.json', function (font) {

  const textGeometry = new TextGeometry('zzlw!', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset:0,
    bevelSegments: 5,
  });
  textGeometry.center();
  const torusGeometru = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  for (let i = 0; i < 300; i++) {
    const donuts = new Mesh(torusGeometru, material);
    donuts.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)

    donuts.rotation.x = Math.random() * Math.PI;
    donuts.rotation.y = Math.random() * Math.PI;
    const scaleValue = Math.random();
    donuts.scale.set(scaleValue, scaleValue, scaleValue);
    scene.add(donuts);
  }
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
})


// 光
const leftDirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
leftDirLight.position.set(-5, 6, 5);
scene.add(leftDirLight);
const rightDirLight = new THREE.DirectionalLight();
rightDirLight.position.set(5, 6, 5);
scene.add(rightDirLight);

const controls = new OrbitControls(camera, renderer.domElement);

function render() {
  requestAnimationFrame(render);
/*   const elepase = timer.getElapsedTime();
  cube.rotation.y = elepase * Math.PI * 0.1;*/
  controls.update();
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

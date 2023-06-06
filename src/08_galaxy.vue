<script setup lang="ts">
import { onMounted,ref ,reactive} from 'vue';
import * as THREE from 'THREE';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from '@three-ts/orbit-controls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { gsap } from 'gsap';
import * as dat from 'dat.gui';


const container = ref(null);



// 场景
const scene = new THREE.Scene();

// 相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);
scene.add(camera);



// galaxy
const parameters = {
  count: 50000,
  size: 0.05,
  radius: 100,
  branches:3,
  spin: 1,
  randomness: 0.2,
  randomnessPow: 3,
  inSideColor: "#ff6030",
  outSideColor:"#1b3984",
}
let geometry: THREE.BufferGeometry | null = null;
let material: THREE.PointsMaterial | null= null;
let points: THREE.Points | null = null;

const generateGalaxy = () => {

  /* geometry */

  if (points) { 
    geometry?.dispose();
    material?.dispose();
    scene.remove(points);
  }
  geometry = new THREE.BufferGeometry()
  const positionsArray = new Float32Array(parameters.count * 3);
  const colorArray = new Float32Array(parameters.count * 3);
  const inSideColor = new THREE.Color(parameters.inSideColor);
  const outSideColor = new THREE.Color(parameters.outSideColor);

  for (let i = 0; i < parameters.count; i++){
    const i3 = i * 3;
    // particle 相对于中心的距离，
    const radius = parameters.radius * Math.random();
    // i % parameters.branches 表示落到第几个分支，然后 / parameter.branches 将落到0-1的范围内，在 * (Math.PI *2) 就是具体的偏移角度
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
    // 该particle的位置 * 乘一个偏移的角度
    const spinAngle = radius * parameters.spin;

    const randomX = (Math.random() ** parameters.randomnessPow) * (Math.random() > 0.5 ? 1:-1) * parameters.randomness;  
    // const randomX = (Math.random() * 0.5) * parameters.randomness;  

    const randomY = (Math.random() ** parameters.randomnessPow) * (Math.random()  > 0.5 ? 1 : -1) * parameters.randomness;  
    const randomZ = (Math.random() ** parameters.randomnessPow) * (Math.random()  > 0.5 ? 1 : -1) * parameters.randomness;  

    positionsArray[i3 + 0] = (Math.cos(branchAngle + spinAngle) + randomX) * radius;
    positionsArray[i3 + 1] = randomY;
    positionsArray[i3 + 2] = (Math.sin(branchAngle + spinAngle) + randomZ) * radius;

    const mixColor = inSideColor.clone();
    // 第二个参数
    mixColor.lerp(outSideColor, radius / parameters.radius);
    colorArray[i3 + 0] = mixColor.r;
    colorArray[i3 + 1] = mixColor.g;
    colorArray[i3 + 2] = mixColor.b;

  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positionsArray, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

  // material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })
  points = new THREE.Points(geometry, material);
  scene.add(points);
}

generateGalaxy();


// gui来调节
const gui = new dat.GUI();
gui.add(parameters, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy);
gui.add(parameters, "size").min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.2).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPow').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'inSideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outSideColor').onFinishChange(generateGalaxy);


// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();

function tick() {
  requestAnimationFrame(tick);
  const elapse = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera); 
};
tick();

// 屏幕调整
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
  tick();
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

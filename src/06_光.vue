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
camera.position.set(0, 2, 10);
scene.add(camera);


// 材料
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(1,  32, 16);
const torusGeometry = new THREE.TorusGeometry(0.8,0.6,16,100);
const circleGeometry = new THREE.CircleGeometry(5, 32);

const material = new THREE.MeshStandardMaterial({color:"white"});
material.roughness = 0.4;

const cube = new THREE.Mesh(cubeGeometry, material);
cube.position.set(-3, 2, 0);

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.set(0, 2, 0);

const torus = new THREE.Mesh(torusGeometry, material);
torus.position.set(4, 2, 0);

const circlePlane = new THREE.Mesh(circleGeometry, material);
circlePlane.rotateX(-Math.PI / 2);

scene.add(cube);
scene.add(sphere);
scene.add(torus);
scene.add(circlePlane);

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 平行光
const directionLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionLight);
directionLight.target.position.set(0, 3, 0);
scene.add(directionLight.target);
directionLight.position.set(7, 3, 0);

// 半球光
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

// 点光源
const pointLight = new THREE.PointLight(0xff9000, 0.5, 4, 0.5);
pointLight.position.set(3, 4, 0);
scene.add(pointLight); 

// 矩形光
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 4, 4);
rectAreaLight.position.set(4, 7, 0)
rectAreaLight.rotation.set(-Math.PI / 2, -Math.PI / 6, 0);
scene.add(rectAreaLight);

// 聚光灯
const spotLight = new THREE.SpotLight(0x78ff00, 1, 10, Math.PI * 2 / 6, 0.25, 1);
spotLight.position.set(0, 5, 3);
scene.add(spotLight)

spotLight.target = torus;
scene.add(spotLight.target);


const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);   //聚光灯是没有size属性的
scene.add(spotLightHelper);
// 由于聚光灯是跟随物体的，所以当物体变动的时候，我们现在出的聚光灯也是要变化的
window.requestAnimationFrame(() => {
  spotLightHelper.update();
})

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// gui来调节
/* const gui = new dat.GUI();
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionLight, "intensity").min(0).max(1).step(0.001);
 */
// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const controls = new OrbitControls(camera, renderer.domElement);


function render() {
  requestAnimationFrame(render);
/*   const elepase = timer.getElapsedTime();
  cube.rotation.y = elepase * Math.PI * 0.1;*/
  controls.update();
  renderer.render(scene, camera); 
};
render();

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

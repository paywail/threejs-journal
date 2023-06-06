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


// baking shadow alternative
const textureLoader = new THREE.TextureLoader();
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
// 材料
const sphereGeometry = new THREE.SphereGeometry(1,  32, 16);
const circleGeometry = new THREE.CircleGeometry(10, 32);

const material = new THREE.MeshStandardMaterial({color:"white"});
material.roughness = 0.4;


const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.set(0, 5, 0);
sphere.castShadow = true;

const circlePlane = new THREE.Mesh(circleGeometry, material);
circlePlane.rotateX(-Math.PI / 2);
circlePlane.receiveShadow = true;

const sphereShadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow
  })
)
sphereShadowPlane.rotation.x = - Math.PI * 0.5
sphereShadowPlane.position.y = circlePlane.position.y + 0.01

scene.add(sphere, sphereShadowPlane, circlePlane)
// baking shadow load
/* const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");


// 材料
const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
const circleGeometry = new THREE.CircleGeometry(10, 32);
const material = new THREE.MeshStandardMaterial({ color: "white" });
material.roughness = 0.4;
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.set(7, 2, 0);
sphere.castShadow = false;


const circlePlane = new THREE.Mesh(
  circleGeometry,
  new THREE.MeshBasicMaterial({
    map: bakedShadow,
  })
)
circlePlane.rotateX(-Math.PI / 2);
circlePlane.receiveShadow = false;
scene.add(sphere);
scene.add(circlePlane); */

// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// 平行光
const directionLight = new THREE.DirectionalLight(0xffffff, 0.3);
scene.add(directionLight);
directionLight.target.position.copy(sphere.position);
scene.add(directionLight.target);
directionLight.position.set(7, 7, 0);
directionLight.castShadow = false;
directionLight.shadow.mapSize.width = 2048;
directionLight.shadow.mapSize.height = 2048;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionLight);
scene.add(directionalLightHelper);
directionalLightHelper.visible = false;

// lightCameraHelper中
const directionLightCamera = directionLight.shadow.camera;
directionLightCamera.near = 5; 
directionLightCamera.far = 15;
directionLightCamera.top = 5;
directionLightCamera.right = 5;
directionLightCamera.bottom = -5;
directionLightCamera.left = -5;
directionLight.shadow.radius = 30;

const directionalLightCameraHelper = new THREE.CameraHelper(directionLightCamera);
scene.add(directionalLightCameraHelper);
directionalLightCameraHelper.visible = false;


// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 100, Math.PI * 0.3);
spotLight.castShadow = false;
spotLight.position.set(-7, 7, 0);
scene.add(spotLight);
spotLight.target.position.copy(sphere.position);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight.target);

const spotLightShadowCamera = spotLight.shadow.camera;
const spotLightCameraHelper = new THREE.CameraHelper(spotLightShadowCamera);
scene.add(spotLightCameraHelper);
spotLightCameraHelper.visible = false;

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3)

pointLight.castShadow = false;
pointLight.position.set(0, 7, -4);
scene.add(pointLight)
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

const pointLightShadowCamera = pointLight.shadow.camera;
pointLightShadowCamera.near = 1;
pointLightShadowCamera.far = 15;
pointLightShadowCamera.fov = 90;
const pointLightCameraHelper = new THREE.CameraHelper(pointLightShadowCamera);
scene.add(pointLightCameraHelper);
pointLightCameraHelper.visible = false;

window.requestAnimationFrame(() => {
})

// gui来调节
const gui = new dat.GUI();

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();

function tick() {
  requestAnimationFrame(tick);
  const elapse = clock.getElapsedTime();

  sphere.position.x = Math.cos(elapse) * 6;
  sphere.position.z = Math.sin(elapse) * 6;
  sphere.position.y = Math.abs(Math.sin(elapse * 3)) + 1;
  
  sphereShadowPlane.position.x = sphere.position.x;
  sphereShadowPlane.position.z = sphere.position.z;
  sphereShadowPlane.material.opacity = (2 - sphere.position.y);

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

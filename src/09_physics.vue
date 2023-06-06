<script setup lang="ts">
import { onMounted,ref ,reactive} from 'vue';
import * as THREE from 'THREE';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from '@three-ts/orbit-controls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

import { gsap } from 'gsap';
import * as dat from "dat.gui";
import * as CANNON from 'cannon-es';


const container = ref(null);


// physics 
const world = new CANNON.World();
world.gravity.set(0, - 9.82, 0);

// 在物理世界中添加物体和平面
const sphereShape = new CANNON.Sphere(1);
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape:sphereShape,
});
// sphereBody.applyForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));


const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({
  mass: 0,  //质量为0 表示是一个static的物理
  shape: planeShape,
});
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(sphereBody);
world.addBody(planeBody);



// sphereBody.applyForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0));
// sphereBody.applyForce(new CANNON.Vec3(0, 150, 0), new CANNON.Vec3(0, 0, 0));
// sphereBody.applyImpulse(new CANNON.Vec3(1, 0, 0), new CANNON.Vec3(0, 0, 0));

// // contact material
// // 这里创建两种材质，其实它们是一样的，只是我们给它们设置了不同的名字
// const plasticMaterial = new CANNON.Material("plastic");
// const concreteMaterial = new CANNON.Material("concrete");
// // 两种材质接触时，表现的行为，通过contact material 表现出来
// const plasticConcreteContactMaterial = new CANNON.ContactMaterial(
//   plasticMaterial,
//   concreteMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   }
// );
// world.addContactMaterial(plasticConcreteContactMaterial);
// sphereBody.material = plasticMaterial;
// planeBody.material = concreteMaterial;

// 给全局设置默认的接触材质
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution:0.7,
  }
);
world.defaultContactMaterial = defaultContactMaterial;
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;




// 场景
const scene = new THREE.Scene();

// 相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 4, 10);
scene.add(camera);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
const planeGeometry = new THREE.PlaneGeometry(10, 10);

const material = new THREE.MeshStandardMaterial({ color: "white",roughness:0.7,metalness:0.1});
const sphere = new THREE.Mesh(sphereGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);
sphere.position.add(new THREE.Vector3(0,3,0));
plane.rotateX(-Math.PI / 2);

scene.add(sphere, plane);


//光
const dirLight = new THREE.DirectionalLight("#eecdaa", 0.5);
dirLight.target = plane;
scene.add(dirLight);   
const ambientLight = new THREE.AmbientLight ("#eecdaa", 0.5);
scene.add(dirLight, ambientLight);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth , window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
let preElapsedTime = clock.getElapsedTime();


// physics 第二部分
const sphereBodies:typeof sphereBody[] = [];
const spheres:typeof sphere[] = []
sphereBodies.push(sphereBody);
spheres.push(sphere);
const generateSphere = (radius: number, position: { x: number, y: number, z: number }) => {

  const sphereShape = new CANNON.Sphere(radius);
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(position.x, position.y, position.z),
    shape: sphereShape,
    material: defaultMaterial,
  });
  const sphere = new THREE.Mesh(sphereGeometry, material);
  sphere.scale.set(radius, radius, radius);
  sphere.position.set(position.x, position.y, position.z);
  world.addBody(sphereBody);
  scene.add(sphere);

  sphereBodies.push(sphereBody);
  spheres.push(sphere);
}



function tick() {
  requestAnimationFrame(tick);
  const elapseTime = clock.getElapsedTime();
  const elapse = elapseTime - preElapsedTime;
  preElapsedTime = elapseTime;
  world.step(1 / 60, elapse, 3);
  for (let i = 0; i < sphereBodies.length; i++) { 
    spheres[i].position.copy(sphereBodies[i].position as any);
    spheres[i].quaternion.copy(sphereBodies[i].quaternion as any);

  }
  controls.update();
  renderer.render(scene, camera); 
};
tick();

// dat.gui
const debugObject = {
  generateSphere: () => {
    const radius = Math.random() *0.7;
    const position = {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    }
    generateSphere(radius, position);
  },
  reset: () => {
    for (let i = 0; i < sphereBodies.length; i++){
      world.removeBody(sphereBodies[i]);
      scene.remove(spheres[i]);
    }
  }
};

const gui = new dat.GUI();
gui.add(debugObject, "generateSphere");
gui.add(debugObject, "reset");


// 屏幕调整
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 双击全屏
/* window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else { 
    document.exitFullscreen();
  }
}) */

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

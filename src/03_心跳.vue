<script setup lang="ts">
import { onMounted,ref } from 'vue';
import * as THREE from 'THREE';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@three-ts/orbit-controls';

import { gsap } from 'gsap';

const container = ref(null);

const scene = new THREE.Scene()
// scene.background = new THREE.Color(1,);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 100);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);





const loader = new GLTFLoader();
loader.load('src/assets/model/heart_in_love.glb',
  (gltf) => {
    console.log('load model success')

    const heart = gltf.scene;
    heart.scale.set(0.3, 0.3, 0.3);

    gsap.to(heart.scale, {
      x:0.5,
      y:0.5,
      z: 0.5,
      yoyo:true,
      duration: 1,
      ease: 'none',
      repeat: -1,
    });
    gsap.to(heart.rotation, {
      y: Math.PI * 2,
      duration: 6,
      ease: 'none',
      repeat: -1,
    });
    gsap.to(heart.position, {
      y: 0.8,
      duration: 1,
      yoyo: true,
      repeat: -1,
  });
    scene.add(heart);

});

// 光源
const light = new THREE.AmbientLight( 0xa0a0a0 ); // soft white light
scene.add( light );
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(100, 100, 300);
scene.add( directionalLight );




const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// window.addEventListener('mouse')


onMounted(() => {
  const controls = new OrbitControls(camera, renderer.domElement);
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

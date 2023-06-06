<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as THREE from 'THREE';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@three-ts/orbit-controls';
import * as dat from 'dat.gui';


import testVertexShader from "./glsl/10_vertex.glsl";
import testFragmentShader from "./glsl/10_fragment.glsl";


import { gsap } from 'gsap';


const gui = new dat.GUI();

const container = ref(null);

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const debugObj = {
  uDeepColor: "#0000ff",
  uSurfaceColor: "#8888ff"
}

const geometry = new THREE.PlaneGeometry(2, 2, 1024, 1024);
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uTime: { value: 0 },
    uBigWavesSpeed: { value: new THREE.Vector2(1, 1) },
    uDeepColor: { value: new THREE.Color(debugObj.uDeepColor) },
    uSurfaceColor: { value: new THREE.Color(debugObj.uSurfaceColor) },
    uColorOffset: { value: 0.5 },
    uColorMultiplier: { value: 2 },
    uSmallWaveSpeed: { value: 1.0 },
    uSmallWaveElevation:{value: 0.15 },
    uSmallWaveFrequency:{value:1.0},
  },
  side:THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotateX(-Math.PI * 0.5);
scene.add(mesh);


gui.add(material.uniforms.uBigWavesElevation,"value").min(0).max(1).step(0.001).name("uBigWavesElevation");
gui.add(material.uniforms.uBigWavesFrequency.value,"x").min(0).max(10).step(0.001).name("uBigWavesFrequencyX");
gui.add(material.uniforms.uBigWavesFrequency.value,"y").min(0).max(10).step(0.001).name("uBigWavesFrequencyY");
gui.add(material.uniforms.uBigWavesSpeed.value,"x").min(0).max(4).step(0.001).name("uBigWavesSpeedX");
gui.add(material.uniforms.uBigWavesSpeed.value, "y").min(0).max(4).step(0.001).name("uBigWavesSpeedY");
gui.add(material.uniforms.uColorOffset,"value").min(0).max(4).step(0.001).name("uColorOffset");
gui.add(material.uniforms.uColorMultiplier,"value").min(0).max(4).step(0.001).name("uColorMultiplier");
gui.add(material.uniforms.uSmallWaveSpeed,"value").min(0).max(20).step(0.001).name("uSmallWaveSpeed");
gui.add(material.uniforms.uSmallWaveElevation,"value").min(0).max(4).step(0.001).name("uSmallWaveElevation");
gui.add(material.uniforms.uSmallWaveFrequency,"value").min(0).max(10).step(0.001).name("uSmallWaveFrequency");


gui
  .addColor(debugObj, "uDeepColor")
  .onChange(() => {
    material.uniforms.uDeepColor.value.set(debugObj.uDeepColor); 
  });
gui
  .addColor(debugObj, "uSurfaceColor")
  .onChange(() => {
    material.uniforms.uSurfaceColor.value.set(debugObj.uSurfaceColor);
  })

const clock = new THREE.Clock();

const render = () => {
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;
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
* {
  margin: 0;
  padding: 0;
}

#app {
  margin: 0;
  padding: 0;
}
</style>

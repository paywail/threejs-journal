import * as THREE from 'THREE';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'THREE';
import { OrbitControls } from '@three-ts/orbit-controls';

import { Water } from "three/examples/jsm/objects/Water2";// 导入水面纹理
// 导入加载器和解压器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
const scene = new Scene();

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(-50, 50, 150);
scene.add(camera);



const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// 天空纹理
let skyTexture = new THREE.TextureLoader().load('src/assets/textures/sky.jpg');
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
skyGeometry.scale(1, 1, -1);

const skyMaterial = new THREE.MeshBasicMaterial({
  map: skyTexture,
})
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

// 视频天空纹理
const video = document.createElement('video');
video.src = 'src/assets/textures/sky.mp4';
video.loop = true;
window.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    const skyVideoTexture = new THREE.VideoTexture(video);
    skyMaterial.map = skyVideoTexture;

  }
})
// 水面的平面
const waterGeometry = new THREE.CircleGeometry(500, 20);

const waterMaterial = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 1,
})
waterGeometry.translate(0, 3, 0);
waterGeometry.rotateX(-Math.PI / 2);
scene.add(waterMaterial);


// 导入海岛模型
const loader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('src/assets/draco/');
loader.setDRACOLoader(dracoLoader);

loader.load(
  'src/assets/model/island.glb',
  function (gltf) {
    scene.add(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.log('loader model error');
  }
);

// 搞一个平行光来照小岛
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 100, 30);
scene.add(directionalLight);




window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio || 0, heigh = canvas.clientHeight * pixelRatio || 0;
  console.log(width, "canvas绘画的尺寸");
  console.log(canvas.width, 'canvas在页面的尺寸');
  const needChange = canvas.width !== width || canvas.heigh !== heigh;
  if (needChange) {
    renderer.setSize(width, heigh, false); //第三个参数是updateStyle  表示是否更新canvas的样式
  }
  return needChange;
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};
render();



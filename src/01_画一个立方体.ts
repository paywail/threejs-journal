import * as THREE from 'THREE';
import { Scene, PerspectiveCamera, WebGLRenderer, Vector3 } from 'THREE';
import { OrbitControls } from '@three-ts/orbit-controls';

// 1. new 一个场景，等会在这个场景中将会承载我们要展示的东西和相机等东西。
const scene = new Scene();

// 2.new 一个透视camera 其实就是类似于perspective矩阵。
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(5, 5, 5);
scene.add(camera);

// 3. new 一个渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// 之后就是往场景中放东西了

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);

  cube.rotateOnAxis(new Vector3(1, 0, 0), 0.01);

  renderer.render(scene, camera);
};
animate();



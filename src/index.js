/* eslint-disable comma-dangle */
/* eslint-disable indent */
import './style.scss';
import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EquirectangularReflectionMapping } from 'three';
import { sRGBEncoding } from 'three';
import { MeshStandardMaterial } from 'three';
import { ACESFilmicToneMapping } from 'three';
import { SphereGeometry } from 'three';

window.onload = () => {
  const loader = new RGBELoader();
  const envTexture = loader.load(require('./asset/envmap.hdr'), (texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });
  //   equitriangle.hdr
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const sphere = new Mesh(
    new SphereGeometry(1, 32, 32),
    new MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.1,
    //   envMap: envTexture,
    //   envMapIntensity: 1,
    })
  );
  scene.add(sphere);
  const renderer = new WebGLRenderer({
    antialias: true,
  });
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = ACESFilmicToneMapping;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  console.log(scene);
};

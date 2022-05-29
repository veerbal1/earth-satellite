/* eslint-disable comma-dangle */
/* eslint-disable indent */
import './style.scss';
import { Scene, PerspectiveCamera, WebGLRenderer, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EquirectangularReflectionMapping } from 'three';
import { sRGBEncoding } from 'three';
import { ACESFilmicToneMapping } from 'three';
import { SphereGeometry } from 'three';
import { DirectionalLight } from 'three';
import { Color } from 'three';
import { TextureLoader } from 'three';
import { MeshPhysicalMaterial } from 'three';
import { Group } from 'three';
import { Vector3 } from 'three';
import { Clock } from 'three';
import { BoxGeometry } from 'three';
import { PCFSoftShadowMap } from 'three';

window.onload = () => {
  const loader = new RGBELoader();
  const envTexture = loader.load(require('./asset/envmap.hdr'), (texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    // scene.background = texture;
    // scene.environment = texture;
  });
  //   equitriangle.hdr
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  // Sunlight
  const sunLight = new DirectionalLight(new Color(0xffffff), 1);
  sunLight.position.set(40, 0, -10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 512;
  sunLight.shadow.mapSize.height = 512;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 100;
  sunLight.shadow.camera.left = -10;
  sunLight.shadow.camera.right = 10;
  sunLight.shadow.camera.top = 10;
  sunLight.shadow.camera.bottom = 10;
  scene.add(sunLight);

  const renderer = new WebGLRenderer({
    antialias: true,
  });
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const map = new TextureLoader().load(require('./asset/earthmap.jpg'));
  const roughness = new TextureLoader().load(require('./asset/earthspec.jpg'));
  const bumpMap = new TextureLoader().load(require('./asset/earthbump.jpg'));

  const gltfLoader = new GLTFLoader();
  let plane;
  let planesData = [];
  gltfLoader.load(require('./asset/plane/scene.glb'), (gltf) => {
    console.log(gltf);
    plane = gltf.scene;
    // scene.add(plane.scene);
    planesData = [
      makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
        makePlane(plane, map, envTexture, scene),
    ];
  });
  //   console.log(plane);

  const sphere = new Mesh(
    new SphereGeometry(5, 32, 32),
    new MeshPhysicalMaterial({
      map,
      //   envMap: envTexture,
      envMapIntensity: 1.0,
      roughnessMap: roughness,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      sheen: 1,
      sheenRoughness: 0.75,
      sheenColor: new Color(0x008aff).convertSRGBToLinear(),
      clearcoat: 0.5,
    })
  );
  sphere.receiveShadow = true;
  scene.add(sphere);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  let clock = new Clock();
  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    planesData.forEach((planeData) => {
      let plane = planeData.group;

      plane.position.set(0, 0, 0);
      plane.rotation.set(0, 0, 0);
      plane.updateMatrixWorld();

        planeData.rot += delta * 0.15;
      plane.rotateOnAxis(planeData.randomAxis, planeData.randomAxisRot);
      plane.rotateOnAxis(new Vector3(0, 1, 0), planeData.rot);
      plane.rotateOnAxis(new Vector3(0, 0, 1), planeData.rad);
      plane.translateY(planeData.yOff);
      plane.rotateOnAxis(new Vector3(1, 0, 0), +Math.PI);
    });

    controls.update();
    renderer.render(scene, camera);
  });

  console.log(scene);
};

const makePlane = (planeMesh, trailTexture, envMap, scene) => {
  const plane = planeMesh.clone();
    plane.scale.set(0.1, 0.1, 0.1);
  plane.position.set(0, 0, 0);
  plane.rotation.set(0, 0, 0);
  plane.updateMatrixWorld();

  plane.traverse((object) => {
    if (object instanceof Mesh) {
      //   object.material.envMap = envMap;
      object.castShadow = true;
      //   object.receiveShadow = true;
    }
  });
  //   const plane = new Mesh(
  //     new BoxGeometry(1, 1, 1),
  //     new MeshPhysicalMaterial({
  //       metalness: 0.5,
  //       roughness: 0.5,
  //       clearcoat: 0.5,
  //     })
  //   );
  plane.castShadow = true;

  const group = new Group();
  group.add(plane);
  scene.add(group);

  return {
    group,
    rot: Math.random() * Math.PI * 2,
    rad: Math.random() * Math.PI * 0.45 + 0.2,
    // rad: 0,
    yOff: 5.5 + Math.random() * 1.0,
    randomAxis: new Vector3(nr(), nr(), nr()).normalize(),
    randomAxisRot: Math.random() * Math.PI * 2,
    // randomAxisRot: 0,
  };
};

const nr = () => {
  return Math.random() * 2 - 1;
};

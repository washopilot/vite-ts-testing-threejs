import * as THREE from 'three';
import Stats from 'stats.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, stats: Stats;
let scene: THREE.Scene;
let model = new THREE.Object3D();

init();
render();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);

    camera.position.set(-1.8, 0.6, 2.7);

    scene = new THREE.Scene();

    new RGBELoader()
        .setPath('/src/assets/textures/equirectangular/')
        .load('royal_esplanade_1k.hdr', function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = texture;
            scene.environment = texture;

            render();

            // model

            const loader = new GLTFLoader().setPath('/src/assets/models/gltf/DamagedHelmet/glTF/');
            loader.load('DamagedHelmet.gltf', function (gltf) {
                model = gltf.scene;
                model.name = 'model';

                scene.add(model);

                render();
            });
        });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, -0.2);
    controls.update();

    // console.log(scene.getObjectByName(model.name));

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}

function render() {
    stats.update();
    renderer.render(scene, camera);
    scene.getObjectByName(model.name)!.rotation.y += 0.005;

    requestAnimationFrame(render);
}

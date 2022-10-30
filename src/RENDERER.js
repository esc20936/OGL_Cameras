import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import venom from './assets/Venom6.glb?url';
import * as dat from 'lil-gui'



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}




/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);





const toRadians = (angle) => {
    return angle * (Math.PI / 180);
}

// Load GLTF
const loader = new GLTFLoader();
loader.load(
    // resource URL
    venom,
    // called when the resource is loaded
    function (gltf) {
        gltf.scene.position.set(0, -0.7, 0.5);
        gltf.scene.rotation.set(-toRadians(15), 0, 0);
        scene.add(gltf.scene);
    },
    // called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened');
    }
);




// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.listenToKeyEvents( window );
controls.keys = {
	LEFT: 'ArrowLeft', //left arrow
	UP: 'ArrowUp', // up arrow
	RIGHT: 'ArrowRight', // right arrow
	BOTTOM: 'ArrowDown', // down arrow
}






/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add light to model
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 2);
scene.add(pointLight);

const redPointLight = new THREE.PointLight(0xff0000, 2, 3);
redPointLight.position.set(-1, 0, 1);
scene.add(redPointLight);



window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

});



let ELAP = 0;
const clock = new THREE.Clock();
const tick = () => {

    const elapsedTime = clock.getElapsedTime();
    ELAP = elapsedTime;
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);

    // camera.lookAt(new THREE.Vector3(0, 0, 0));\
    

    controls.update();

};

let rotation = 0;
// add zoom and unzoom with keyboard
window.addEventListener('keydown', (event) => {
    if (event.key === 'z') {
        camera.position.z += 0.1;
    }

    if (event.key === 'x') {
        camera.position.z -= 0.1;
    }

    // if a key is pressed, give a 360° rotation around the center of the scene (0,0,0) while seeing the model
    if (event.key === 'a') {
        rotation += 0.1;
        camera.position.x = 1.5 * Math.sin(rotation);
        camera.position.z = 1.5 * Math.cos(rotation);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if(event.key ==='r'){
        rotation = 0;
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 2;
    }

})

tick();
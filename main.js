import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { setupScene } from './scene.js';
import { setupLights } from './lights.js';
import { createObjects, updateObjects } from './objects.js';
import { initParticles, updateParticles } from './particles.js';
import { initInteractions, updateHoverSpring } from './interactions.js';


const { scene, camera, renderer, backgroundPlane } = setupScene();
setupLights(scene);
const objects = createObjects(scene);
initParticles(scene);
initInteractions(scene, camera, renderer, objects);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.enableZoom = true;
controls.enablePan = true;
controls.target.set(0, 0, 0);


const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.2, 0.85);
bloomPass.threshold = 0.1;
bloomPass.strength = 0.6;
bloomPass.radius = 0.5;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);


let lastTime = 0;
let time = 0;

function animate(now = 0) {
    requestAnimationFrame(animate);
    const delta = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    time += delta;

    
    updateObjects(time, objects);
    
    updateParticles(time);
   
    updateHoverSpring(delta);

    controls.update(); 
    composer.render();
}

animate();


window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}
import { backgroundPlane } from './scene.js';

backgroundPlane.material.uniforms.uTime.value = time;

import * as THREE from 'three';

export function setupScene() {
    const scene = new THREE.Scene();
    scene.background = null; 
    scene.fog = new THREE.FogExp2(0x0f0c29, 0.008);


    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);


    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath('https://threejs.org/examples/textures/cube/SwedishRoyal/');
    const envMap = cubeTextureLoader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    scene.environment = envMap;


    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_PointSize = 1.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    const fragmentShader = `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
            vec3 color1 = vec3(0.06, 0.04, 0.16); // #0f0c29
            vec3 color2 = vec3(0.19, 0.13, 0.40); // #302b63
            vec3 color3 = vec3(0.14, 0.13, 0.24); // #24243e
            float t = fract(uTime * 0.05);
            vec3 color = mix(color1, color2, sin(vUv.y * 3.14159 + uTime) * 0.5 + 0.5);
            color = mix(color, color3, sin(vUv.x * 3.14159 + uTime * 0.7) * 0.5 + 0.5);
            gl_FragColor = vec4(color, 1.0);
        }
    `;
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide
    });
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const backgroundPlane = new THREE.Mesh(planeGeometry, shaderMaterial);
    backgroundPlane.position.z = -10;
    scene.add(backgroundPlane);

    return { scene, camera, renderer, backgroundPlane };
}

export function updateBackgroundTime(time) {
    const plane = document.querySelector('canvas').parentElement; 

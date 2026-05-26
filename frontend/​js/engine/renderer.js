const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f1d);
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(30, 100, 30);
scene.add(sunLight);

let isGameStarted = false;
let inputManager = null;
try { if (typeof InputManager !== 'undefined') inputManager = new InputManager(); } catch(e){}

const loader = new THREE.GLTFLoader();
let ronaldoMesh, neymarMesh, topMesh, cameraSystem;

loader.load('assets/camp_nou_stadium.glb', (gltf) => {
    const stadyum = gltf.scene;
    stadyum.traverse((child) => {
        if (child.isMesh) {
            child.material.depthWrite = true;
            if (child.material.map) child.material.map.encoding = THREE.sRGBEncoding;
        }
    });
    scene.add(stadyum);
});
loader.load('assets/football_net.glb', (gltf) => {
    const k1 = gltf.scene; k1.position.set(0, 0, -45); scene.add(k1);
    const k2 = k1.clone(); k2.position.set(0, 0, 45); k2.rotation.y = Math.PI; scene.add(k2);
});

loader.load('assets/cristiano_ronaldo_3d_model.glb', (gltf) => { ronaldoMesh = gltf.scene; ronaldoMesh.position.set(0, 0, 8); scene.add(ronaldoMesh); });
loader.load('assets/neymar_3d_free_football_model_free__animation.glb', (gltf) => { neymarMesh = gltf.scene; neymarMesh.position.set(0, 0, -8); scene.add(neymarMesh); });
loader.load('assets/football.glb', (gltf) => {
    topMesh = gltf.scene; topMesh.position.set(0, 0.2, 0); scene.add(topMesh);
    try { if (typeof DynamicCamera !== 'undefined') cameraSystem = new DynamicCamera(camera, topMesh, ronaldoMesh || topMesh); } catch(e){}
});

camera.position.set(0, 35, 65);
camera.lookAt(0, 0, 0);

const kickoffBtn = document.getElementById('btn-kickoff');
if (kickoffBtn) {
    kickoffBtn.addEventListener('click', () => {
        isGameStarted = true;
        document.getElementById('main-menu').style.setProperty('display', 'none', 'important');
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (!isGameStarted) {
        let zaman = Date.now() * 0.0002;
        camera.position.x = Math.sin(zaman) * 65;
        camera.position.z = Math.cos(zaman) * 65;
        camera.position.y = 35; camera.lookAt(0, 0, 0);
    } else {
        if (cameraSystem) cameraSystem.update();
        if (ronaldoMesh && inputManager) {
            let move = inputManager.getMovement();
            ronaldoMesh.position.x += move.x * 0.16; ronaldoMesh.position.z += move.z * 0.16;
            if (move.x !== 0 || move.z !== 0) ronaldoMesh.rotation.y = Math.atan2(move.x, move.z);
        }
    }
    renderer.render(scene, camera);
}
animate();

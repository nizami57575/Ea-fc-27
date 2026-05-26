// ==========================================
// EA SPORTS FC 27 - ENTEGRE ANA MOTOR
// ==========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05050a);
scene.fog = new THREE.FogExp2(0x05050a, 0.015);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Projektör Işıkları (Gece Maçı Atmosferi)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

function addFloodlight(x, y, z) {
    const light = new THREE.SpotLight(0xffffff, 2.0);
    light.position.set(x, y, z);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
}
addFloodlight(60, 40, 60);
addFloodlight(-60, 40, -60);

// Altyapı Sistemlerini Tanımla
const inputManager = new InputManager();
let cameraSystem;
let ronaldoAnimation, neymarAnimation;

// 3D GLTF/GLB Yükleyici
const loader = new THREE.GLTFLoader();

// ASSETS KLASÖRÜNDEKİ 5 DOSYAYI SAHNEYE YÜKLEME
// 1. Camp Nou Stadyumu
loader.load('assets/camp_nou_stadium.glb', (gltf) => {
    const stadyum = gltf.scene;
    stadyum.position.set(0, 0, 0);
    scene.add(stadyum);
});

// 2. Futbol Kalesi (Net)
loader.load('assets/football_net.glb', (gltf) => {
    const kale1 = gltf.scene;
    kale1.position.set(0, 0, -50); // Kuzey Kalesi
    kale1.rotation.y = Math.PI;
    scene.add(kale1);

    // İkinci kale için kopyasını oluşturup karşı tarafa koyuyoruz
    const kale2 = kale1.clone();
    kale2.position.set(0, 0, 50); // Güney Kalesi
    kale2.rotation.y = 0;
    scene.add(kale2);
});

// 3. Cristiano Ronaldo Model
let ronaldoMesh;
loader.load('assets/cristiano_ronaldo_3d_model.glb', (gltf) => {
    ronaldoMesh = gltf.scene;
    ronaldoMesh.position.set(0, 0, 10); // Maç başlangıç pozisyonu
    ronaldoMesh.castShadow = true;
    scene.add(ronaldoMesh);
    ronaldoAnimation = new AnimationManager(gltf);
});

// 4. Neymar Model
let neymarMesh;
loader.load('assets/neymar_3d_free_football_model_free__animation.glb', (gltf) => {
    neymarMesh = gltf.scene;
    neymarMesh.position.set(0, 0, -10); // Rakip pozisyonu
    neymarMesh.castShadow = true;
    scene.add(neymarMesh);
    neymarAnimation = new AnimationManager(gltf);
});

// 5. Futbol Topu
let topMesh;
loader.load('assets/football.glb', (gltf) => {
    topMesh = gltf.scene;
    topMesh.position.set(0, 0.2, 0); // Tam orta yuvarlak
    topMesh.castShadow = true;
    scene.add(topMesh);

    // Dinamik TV kamerasını topa ve Ronaldo'ya odıkla
    cameraSystem = new DynamicCamera(camera, topMesh, ronaldoMesh);
});

// Loading Ekranı Buton Kontrolü
const startBtn = document.getElementById('start-match-btn');
setTimeout(() => {
    startBtn.removeAttribute('disabled');
    startBtn.classList.add('active');
    startBtn.innerText = "MAÇI BAŞLAT";
}, 3000);

startBtn.addEventListener('click', () => {
    document.getElementById('loading-screen').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('game-hud').classList.remove('hidden');
    }, 1000);
});

// Oyun Döngüsü (60 FPS Simülasyon)
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();

    // Ronaldo'yu hareket ettirme mekanizması
    if (ronaldoMesh && ronaldoAnimation) {
        let move = inputManager.getMovement();
        ronaldoMesh.position.x += move.x * 0.16;
        ronaldoMesh.position.z += move.z * 0.16;

        if (move.x !== 0 || move.z !== 0) {
            ronaldoMesh.rotation.y = Math.atan2(move.x, move.z);
            ronaldoAnimation.playAnimation('run'); 
        } else {
            ronaldoAnimation.playAnimation('idle');
        }
    }

    // Kamera ve Sistem Güncellemeleri
    if (cameraSystem) cameraSystem.update();
    if (ronaldoAnimation) ronaldoAnimation.update(deltaTime);
    if (neymarAnimation) neymarAnimation.update(deltaTime);

    renderer.render(scene, camera);
}

animate();

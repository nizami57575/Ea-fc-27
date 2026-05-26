// ==========================================
// EA SPORTS FC 27 - ANA MOTOR (RENDERER)
// ==========================================

// 1. Sahneyi ve Tarayıcıyı Hazırla
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05050a);
scene.fog = new THREE.FogExp2(0x05050a, 0.015);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// 2. Projektör Işıkları (Stadyum Işıklandırması)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

function addLight(x, y, z) {
    const light = new THREE.SpotLight(0xffffff, 1.8);
    light.position.set(x, y, z);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
}
addLight(50, 40, 50);
addLight(-50, 40, -50);

// 3. Alt Sistemleri ve Modülleri Başlat (Yazdığımız diğer dosyaları bağlıyoruz)
const inputManager = new InputManager();
let cameraSystem;
let ronaldoAnimation, neymarAnimation;

// 4. .GLB MODELLERİNİ SAHAYA YÜKLEME (Senin yüklediğin dosyalar)
const loader = new THREE.GLTFLoader();

let stadyumMesh, ronaldoMesh, neymarMesh, topMesh;

// Camp Nou Yükleniyor
loader.load('assets/camp_nou_stadium.glb', (gltf) => {
    stadyumMesh = gltf.scene;
    stadyumMesh.position.set(0, 0, 0);
    scene.add(stadyumMesh);
});

// Cristiano Ronaldo Yükleniyor
loader.load('assets/cristiano_ronaldo_3d_model.glb', (gltf) => {
    ronaldoMesh = gltf.scene;
    ronaldoMesh.position.set(0, 0, 5); // Sahadaki yeri
    ronaldoMesh.castShadow = true;
    scene.add(ronaldoMesh);
    
    // Animasyon yöneticisini bağla
    ronaldoAnimation = new AnimationManager(gltf);
});

// Neymar Yükleniyor
loader.load('assets/neymar_3d_free_football_model_free__animation.glb', (gltf) => {
    neymarMesh = gltf.scene;
    neymarMesh.position.set(0, 0, -5); // Rakip yarı saha
    neymarMesh.castShadow = true;
    scene.add(neymarMesh);
    
    neymarAnimation = new AnimationManager(gltf);
});

// Futbol Topu Yükleniyor
loader.load('assets/football.glb', (gltf) => {
    topMesh = gltf.scene;
    topMesh.position.set(0, 0.2, 0); // Orta yuvarlak
    topMesh.castShadow = true;
    scene.add(topMesh);

    // Kamera sistemini topa sabitle
    cameraSystem = new DynamicCamera(camera, topMesh, ronaldoMesh);
});

// 5. Loading Ekranını Kapatma Mekanizması
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

// 6. ANA OYUN DÖNGÜSÜ (Saniyede 60 kez çalışır)
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();

    // Eğer Ronaldo yüklendiyse ve input geldiyse onu hareket ettir
    if (ronaldoMesh && ronaldoAnimation) {
        let move = inputManager.getMovement();
        
        ronaldoMesh.position.x += move.x * 0.15;
        ronaldoMesh.position.z += move.z * 0.15;

        // Karakterin gittiği yöne doğru yüzünü dönmesi
        if (move.x !== 0 || move.z !== 0) {
            ronaldoMesh.rotation.y = Math.atan2(move.x, move.z);
            ronaldoAnimation.playAnimation('run'); // Koşu animasyonu
        } else {
            ronaldoAnimation.playAnimation('idle'); // Durma animasyonu
        }
    }

    // Kamera ve animasyon mikserlerini güncelle
    if (cameraSystem) cameraSystem.update();
    if (ronaldoAnimation) ronaldoAnimation.update(deltaTime);
    if (neymarAnimation) neymarAnimation.update(deltaTime);

    renderer.render(scene, camera);
}

// Motoru Ateşle!
animate();

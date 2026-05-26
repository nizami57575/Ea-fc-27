// =================================================================
// EA SPORTS FC 27 - SIFIRDAN BİRLEŞTİRİLMİŞ ENTEGRE MOTOR DOSYASI
// =================================================================

// 1. Üst Seviye Sahne ve Çizim Kurulumu
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f1d); // Gece atmosferi arka planı
scene.fog = new THREE.FogExp2(0x0a0f1d, 0.008);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// CRITICAL: Beyazlığı Engelleyen ve Renkli Kaplamaları Aktif Eden Renk Ayarları
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4; // Renklerin canlı ve parlak çıkması için çarpan

document.body.appendChild(renderer.domElement);

// 2. Gelişmiş Işık Sistemi (Stadyumu Canlandıran Güneş ve Projektörler)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Çevre yumuşak aydınlatması
scene.add(ambientLight);

const mainStadiumLight = new THREE.DirectionalLight(0xffffff, 1.8);
mainStadiumLight.position.set(40, 120, 40);
mainStadiumLight.castShadow = true;
mainStadiumLight.shadow.mapSize.width = 2048;
mainStadiumLight.shadow.mapSize.height = 2048;
scene.add(mainStadiumLight);

// Renklerin patlamasını sağlayan köşe projektörleri
function IsikKulesiKur(x, y, z) {
    const spot = new THREE.SpotLight(0xffffff, 2.5);
    spot.position.set(x, y, z);
    spot.angle = Math.PI / 3;
    spot.penumbra = 0.5;
    spot.castShadow = true;
    scene.add(spot);
}
IsikKulesiKur(80, 60, 80);
IsikKulesiKur(-80, 60, -80);

// 3. Sistem Yöneticileri Değişkenleri
let inputManager = (typeof InputManager !== 'undefined') ? new InputManager() : null;
let cameraSystem;
let ronaldoAnimation, neymarAnimation;

// 4. İNDİRDİĞİN 5 ADET ASSETİN SIFIRDAN SAHNEYE ÇAĞRILMASI
const loader = new THREE.GLTFLoader();
let ronaldoMesh, neymarMesh, topMesh;

// [Asset 1] Camp Nou Stadyumu Yükleniyor (Renk Sabitleme Döngüsüyle Birlikte)
loader.load('assets/camp_nou_stadium.glb', (gltf) => {
    const stadyum = gltf.scene;
    
    // Beyaz görünümü engellemek için tüm alt parçaların kaplamalarını sRGB kodlamasına çekiyoruz
    stadyum.traverse((child) => {
        if (child.isMesh) {
            child.material.depthWrite = true;
            if (child.material.map) child.material.map.encoding = THREE.sRGBEncoding;
        }
    });
    
    stadyum.position.set(0, 0, 0);
    stadyum.scale.set(1, 1, 1);
    scene.add(stadyum);
    console.log("⚽ Camp Nou Renkli Olarak Yüklendi!");
}, undefined, (err) => console.error("Stadyum yüklenirken dosya yolu hatası:", err));

// [Asset 2] Futbol Kalesi Ağları Yükleniyor
loader.load('assets/football_net.glb', (gltf) => {
    const kaleKuzey = gltf.scene;
    kaleKuzey.position.set(0, 0, -45); // Sahanın ilerisine yerleştir
    kaleKuzey.scale.set(1, 1, 1);
    scene.add(kaleKuzey);

    // Aynı modeli klonlayarak sahanın diğer ucuna yerleştiriyoruz
    const kaleGuney = kaleKuzey.clone();
    kaleGuney.position.set(0, 0, 45);
    kaleGuney.rotation.y = Math.PI;
    scene.add(kaleGuney);
    console.log("🥅 Kaleler Sahaya Çizildi!");
});

// [Asset 3] Cristiano Ronaldo Modeli Yükleniyor
loader.load('assets/cristiano_ronaldo_3d_model.glb', (gltf) => {
    ronaldoMesh = gltf.scene;
    ronaldoMesh.position.set(0, 0, 8); // Kendi yarı sahamızda
    ronaldoMesh.castShadow = true;
    scene.add(ronaldoMesh);
    
    if (typeof AnimationManager !== 'undefined') {
        ronaldoAnimation = new AnimationManager(gltf);
    }
    console.log("🏃‍♂️ Cristiano Ronaldo Sahaya Çıktı!");
});

// [Asset 4] Neymar Modeli Yükleniyor
loader.load('assets/neymar_3d_free_football_model_free__animation.glb', (gltf) => {
    neymarMesh = gltf.scene;
    neymarMesh.position.set(0, 0, -8); // Rakip yarı sahada karşı karşıya
    neymarMesh.castShadow = true;
    scene.add(neymarMesh);
    
    if (typeof AnimationManager !== 'undefined') {
        neymarAnimation = new AnimationManager(gltf);
    }
    console.log("🏃‍♂️ Neymar Jr. Sahaya Çıktı!");
});

// [Asset 5] Futbol Topu Yükleniyor
loader.load('assets/football.glb', (gltf) => {
    topMesh = gltf.scene;
    topMesh.position.set(0, 0.2, 0); // Tam santra noktası
    topMesh.castShadow = true;
    scene.add(topMesh);

    // Kütüphane mevcutsa dinamik TV yayın kamerasını topa odakla
    if (typeof DynamicCamera !== 'undefined') {
        cameraSystem = new DynamicCamera(camera, topMesh, ronaldoMesh || topMesh);
    }
    console.log("🔮 Futbol Topu Santraya Yerleştirildi!");
});

// Kamera ilk başta menünün arkasında stadyumu geniş açıdan izlesin
camera.position.set(0, 25, 45);
camera.lookAt(0, 0, 0);

// 5. ANA MENÜ BUTON TETİKLEME KODLARI
document.getElementById('btn-kickoff').addEventListener('click', () => {
    // Menüyü kapat ve oyun HUD ekranını göster
    const menu = document.getElementById('main-menu');
    menu.style.opacity = 0;
    setTimeout(() => {
        menu.classList.add('hidden');
        document.getElementById('game-hud').classList.remove('hidden');
    }, 500);
    
    console.log("Maç Başladı! İyi şanslar.");
});

document.getElementById('btn-career').addEventListener('click', () => {
    alert("Kariyer Modu Aktif Ediliyor! Menajer: Nizami Cəfərli. Takım: Qarabağ FK!");
});

// 6. SÜREKLİ OYUN DÖNGÜSÜ (60 FPS RENDERING)
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();

    // Kamera menü açıkken stadyumun etrafında sinematik olarak dönsün
    const menuAcikMi = !document.getElementById('main-menu').classList.contains('hidden');
    if (menuAcikMi) {
        let zaman = Date.now() * 0.0003;
        camera.position.x = Math.sin(zaman) * 45;
        camera.position.z = Math.cos(zaman) * 45;
        camera.position.y = 25;
        camera.lookAt(0, 0, 0);
    } else {
        // Maç başlayınca TV Kamerası topu takip moduna geçsin
        if (cameraSystem) cameraSystem.update();
    }

    // Kullanıcı Ronaldo'yu kontrol ediyorsa hareket ettir
    if (!menuAcikMi && ronaldoMesh && inputManager) {
        let move = inputManager.getMovement();
        ronaldoMesh.position.x += move.x * 0.16;
        ronaldoMesh.position.z += move.z * 0.16;

        if (move.x !== 0 || move.z !== 0) {
            ronaldoMesh.rotation.y = Math.atan2(move.x, move.z);
            if (ronaldoAnimation) ronaldoAnimation.playAnimation('run');
        } else {
            if (ronaldoAnimation) ronaldoAnimation.playAnimation('idle');
        }
    }

    // Animasyon bileşenlerini güncelle
    if (ronaldoAnimation) ronaldoAnimation.update(deltaTime);
    if (neymarAnimation) neymarAnimation.update(deltaTime);

    renderer.render(scene, camera);
}

// Döngüyü Başlat
animate();

// Ekran Boyutu Değişirse Uyarla
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

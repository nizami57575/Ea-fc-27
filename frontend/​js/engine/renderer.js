// Renderer.js içindeki animate() fonksiyonunun güncellenmiş hali:
function animate() {
    requestAnimationFrame(animate);
    
    let deltaTime = 0.016; // 60 FPS varsayımı
    
    // 1. Kontrolleri Oku ve Oyuncuyu Hareket Ettir
    let move = inputManager.getMovement();
    playerMesh.position.x += move.x * 0.15;
    playerMesh.position.z += move.z * 0.15;
    
    // 2. Animasyonları güncelle
    if(move.x !== 0 || move.z !== 0) {
        animationManager.playAnimation('run');
    } else {
        animationManager.playAnimation('idle');
    }
    
    // 3. Yapay Zekayı ve Dinamik Kamerayı Çalıştır
    cameraSystem.update();
    animationManager.update(deltaTime);

    renderer.render(scene, camera);
}

// 3D Model Yükleyici (GLTFLoader)
const loader = new THREE.GLTFLoader();

// 1. Camp Nou Stadyumunu Sahaya Yüklüyoruz
loader.load('assets/camp_nou_stadium.glb', function (gltf) {
    const stadium = gltf.scene;
    stadium.position.set(0, 0, 0);
    stadium.scale.set(1, 1, 1); // Boyutunu stadyuma göre ayarlayabilirsin
    scene.add(stadium);
    print("Camp Nou Başarıyla Yüklendi!");
}, undefined, function (error) {
    console.error("Stadyum yüklenirken hata oluştu:", error);
});

// 2. Cristiano Ronaldo Modelini Yüklüyoruz (Oyuncu 1)
let playerMesh;
loader.load('assets/cristiano_ronaldo_3d_model.glb', function (gltf) {
    playerMesh = gltf.scene;
    playerMesh.position.set(0, 0, 5); // Sahadaki başlangıç pozisyonu
    playerMesh.scale.set(1, 1, 1);
    playerMesh.castShadow = true;
    scene.add(playerMesh);
    
    // Eğer modelin içinde animasyon varsa burada başlatıyoruz
    animationManager = new AnimationManager(gltf);
}, undefined, function (error) {
    console.error("Ronaldo yüklenirken hata oluştu:", error);
});

// 3. Gerçekçi Futbol Topunu Yüklüyoruz
let footballMesh;
loader.load('assets/football.glb', function (gltf) {
    footballMesh = gltf.scene;
    footballMesh.position.set(0, 0.5, 0); // Orta yuvarlak
    footballMesh.scale.set(0.5, 0.5, 0.5);
    footballMesh.castShadow = true;
    scene.add(footballMesh);
}, undefined, function (error) {
    console.error("Top yüklenirken hata oluştu:", error);
});


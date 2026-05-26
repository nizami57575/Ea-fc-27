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


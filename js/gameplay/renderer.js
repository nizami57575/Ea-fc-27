// OYUN MOTORU AYARLARI
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0f1d);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// IŞIQLAR
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
sunLight.position.set(30, 100, 30);
scene.add(sunLight);

// 404 MÜDAFİƏSİ: Əgər .glb yüklənməsə, ekran qara qalmasın deyə müvəqqəti yaşıl ot örtüyü yaradırıq
const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x1b4d22, roughness: 0.8 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

let isGameStarted = false;
const loader = new THREE.GLTFLoader();
let ronaldoMesh, neymarMesh, topMesh;

// ASSET YÜKLƏMƏLƏRİ (404 VERSƏ BELƏ OYUNU DAVAM ETDİRİR)
loader.load('assets/camp_nou_stadium.glb', (gltf) => { scene.add(gltf.scene); ground.visible = false; }, undefined, (e) => console.log("Stadyum tapılmadı, yaşıl zəmin aktivdir."));
loader.load('assets/cristiano_ronaldo_3d_model.glb', (gltf) => { ronaldoMesh = gltf.scene; ronaldoMesh.position.set(0, 0, 5); scene.add(ronaldoMesh); });
loader.load('assets/neymar_3d_free_football_model_free__animation.glb', (gltf) => { neymarMesh = gltf.scene; neymarMesh.position.set(0, 0, -5); scene.add(neymarMesh); });
loader.load('assets/football.glb', (gltf) => { topMesh = gltf.scene; topMesh.position.set(0, 0.2, 0); scene.add(topMesh); });

camera.position.set(0, 30, 55);
camera.lookAt(0, 0, 0);

// MENYU BUTON KONTROLLARI
document.getElementById('btn-kickoff').addEventListener('click', () => {
    isGameStarted = true;
    document.getElementById('main-menu').style.setProperty('display', 'none', 'important');
    document.getElementById('game-hud').classList.remove('hidden');
});

document.getElementById('btn-career').addEventListener('click', () => {
    alert("Kariyer Modu Aktiv! Baş Məşqçi: Nizami Cəfərli | Komanda: Qarabağ FK");
});

// ANA OYUN DÖNGÜSÜ (ANIMATION LOOP)
function animate() {
    requestAnimationFrame(animate);
    
    if (!isGameStarted) {
        // Oyun başlamayıbsa: Kamera stadyum ətrafında möhtəşəm sinematik fırlanır
        let zaman = Date.now() * 0.0003;
        camera.position.x = Math.sin(zaman) * 60;
        camera.position.z = Math.cos(zaman) * 60;
        camera.position.y = 25;
        camera.lookAt(0, 0, 0);
    } else {
        // Oyun başlayıbsa: Əgər controls.js aktivdirsə oyunçunu hərəkət etdir
        if (ronaldoMesh && typeof inputManager !== 'undefined' && inputManager) {
            let move = inputManager.getMovement();
            ronaldoMesh.position.x += move.x * 0.15;
            ronaldoMesh.position.z += move.z * 0.15;
        }
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

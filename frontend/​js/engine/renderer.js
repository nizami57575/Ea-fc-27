// ==========================================
// STADYUM RENKLENDİRME VE IŞIK AYARI
// ==========================================

// 1. Renderer Ayarlarına Renk Yönetimini Ekle (Bunu eklemezsek modeller beyaz kalabilir)
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Gerçekçi renkler ve kaplamalar için bu iki satır çok önemli:
renderer.outputEncoding = THREE.sRGBEncoding; 
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2; // Parlaklığı buradan ayarlayabilirsin

document.body.appendChild(renderer.domElement);

// 2. Güçlü Stadyum Projektörleri (Beyazlığı kırıp renkleri ortaya çıkarır)
// Ortam ışığını biraz daha güçlü ve temiz bir beyaz yapıyoruz
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); 
scene.add(ambientLight);

// Ana güneş/projektör ışığı
const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(30, 100, 30);
sunLight.castShadow = true;
scene.add(sunLight);

// Stadyumun dört köşesine renkleri canlandıracak Spot Işıklar ekliyoruz
function stadyumIsigiEkle(x, y, z) {
    const spotLight = new THREE.SpotLight(0xffffff, 3.0);
    spotLight.position.set(x, y, z);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    spotLight.castShadow = true;
    scene.add(spotLight);
}
stadyumIsigiEkle(100, 50, 100);
stadyumIsigiEkle(-100, 50, -100);


// PC Keyboard & Mobile Touch input Manager
class InputManager {
    constructor() {
        this.keys = { w: false, a: false, s: false, d: false, shift: false, space: false, e: false };
        this.joystickDelta = { x: 0, z: 0 };
        this.isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

        this.initKeyboard();
        if (this.isMobile) this.initMobileHUD();
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            let key = e.key.toLowerCase();
            if (key in this.keys) this.keys[key] = true;
        });
        window.addEventListener('keyup', (e) => {
            let key = e.key.toLowerCase();
            if (key in this.keys) this.keys[key] = false;
        });
    }

    initMobileHUD() {
        // Mobil için ekrana dinamik joystick ve buton katmanları ekler
        const hud = document.createElement('div');
        hud.id = 'mobile-hud';
        hud.innerHTML = `
            <div id="virtual-joystick" style="position:absolute; bottom:40px; left:40px; width:100px; height:100px; background:rgba(255,255,255,0.2); border-radius:50%;">
                <div id="joystick-handle" style="width:40px; height:40px; background:#00ff66; border-radius:50%; margin:30px;"></div>
            </div>
            <div style="position:absolute; bottom:40px; right:40px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button id="btn-shoot" style="width:60px; height:60px; border-radius:50%; background:red; color:white; font-weight:bold;">ŞUT</button>
                <button id="btn-pass" style="width:60px; height:60px; border-radius:50%; background:blue; color:white; font-weight:bold;">PAS</button>
            </div>
        `;
        document.body.appendChild(hud);

        // Dokunmatik dinleyiciler
        document.getElementById('btn-shoot').addEventListener('touchstart', () => this.keys['space'] = true);
        document.getElementById('btn-shoot').addEventListener('touchend', () => this.keys['space'] = false);
        document.getElementById('btn-pass').addEventListener('touchstart', () => this.keys['e'] = true);
        document.getElementById('btn-pass').addEventListener('touchend', () => this.keys['e'] = false);
        
        // Basit joystick mantığı
        const joystick = document.getElementById('virtual-joystick');
        joystick.addEventListener('touchmove', (e) => {
            let touch = e.touches[0];
            let rect = joystick.getBoundingClientRect();
            this.joystickDelta.x = (touch.clientX - (rect.left + 50)) / 50;
            this.joystickDelta.z = (touch.clientY - (rect.top + 50)) / 50;
        });
        joystick.addEventListener('touchend', () => {
            this.joystickDelta = { x: 0, z: 0 };
        });
    }

    getMovement() {
        if (this.isMobile) {
            return { x: this.joystickDelta.x, z: this.joystickDelta.z };
        }
        let x = 0; let z = 0;
        if (this.keys.w) z = -1;
        if (this.keys.s) z = 1;
        if (this.keys.a) x = -1;
        if (this.keys.d) x = 1;
        return { x: x, z: z };
    }
}

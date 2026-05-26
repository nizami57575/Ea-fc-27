// Dynamic TV & Replay Camera System for FC 27
class DynamicCamera {
    constructor(camera, ball, player) {
        this.camera = camera;
        this.ball = ball;
        this.player = player;
        this.mode = 'TV_BROADCAST'; // TV_BROADCAST, CINEMATIC, PENALTY, REPLAY
        this.targetPosition = new THREE.Vector3();
    }

    update() {
        if (this.mode === 'TV_BROADCAST') {
            // Gerçekçi TV kamerası: Topun X ve Z konumuna göre odaklanır, hafif geriden takip eder
            this.targetPosition.x = this.ball.position.x * 0.6;
            this.targetPosition.y = 20 + Math.abs(this.ball.position.z) * 0.1; 
            this.targetPosition.z = 32 + (this.ball.position.z * 0.3);

            // Kamerayı yumuşak bir şekilde hedefe kaydır (Interpolation)
            this.camera.position.lerp(this.targetPosition, 0.05);
            this.camera.lookAt(this.ball.position.x, 0, this.ball.position.z);

        } else if (this.mode === 'CINEMATIC') {
            // Gol sevinci veya giriş sinematiği kamerası
            let angle = Date.now() * 0.001;
            this.camera.position.set(
                this.player.position.x + Math.sin(angle) * 5,
                this.player.position.y + 2,
                this.player.position.z + Math.cos(angle) * 5
            );
            this.camera.lookAt(this.player.position);
        }
    }

    setMode(newMode) {
        this.mode = newMode;
    }
}


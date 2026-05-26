// Tactical AI for Non-Controlled Players
class PlayerAI {
    constructor(player, teamState) {
        this.player = player;
        this.teamState = teamState; // 'ATTACK' veya 'DEFENSE'
    }

    decideAction(ballPosition, opponents) {
        let distanceToBall = this.player.position.distanceTo(ballPosition);

        if (this.teamState === 'DEFENSE') {
            // Gegenpress: En yakın defans oyuncusu topa agresif baskı yapar, diğerleri alan kapatır
            if (distanceToBall < 15) {
                this.player.lookAt(ballPosition);
                this.moveTo(ballPosition, 0.08); // Topa koş
            } else {
                this.maintainTacticalPosition(); // Savunma hattını koru (Ofsayt Taktiği)
            }
        } else if (this.teamState === 'ATTACK') {
            // Tiki Taka: Boş alanlara kaç ve akıllı pas opsiyonu oluştur
            if (distanceToBall > 10 && distanceToBall < 25) {
                this.runIntoSpace();
            }
        }
    }

    moveTo(target, speed) {
        this.player.position.x += (target.x - this.player.position.x) * speed;
        this.player.position.z += (target.z - this.player.position.z) * speed;
    }

    maintainTacticalPosition() {
        // Defans çizgisini bozma derinliği
        let defaultZ = this.player.initialPosition.z;
        this.player.position.z += (defaultZ - this.player.position.z) * 0.02;
    }

    runIntoSpace() {
        // İleriye akıllı koşu fırlaması
        this.player.position.z -= 0.04; 
    }
}


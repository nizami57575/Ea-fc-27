// Star Skill Moves Engine
class SkillMoves {
    static perform(player, skillName) {
        if (player.starSkills < 4 && (skillName === 'rainbow' || skillName === 'elastico')) {
            console.log("Bu oyuncunun teknik seviyesi (Yıldız Çalım) yetersiz!");
            return false;
        }

        switch (skillName) {
            case 'roulette': // 360 Derece Dönüş Çalımı
                player.rotation.y += Math.PI * 2;
                player.velocity.z *= 1.4; // Hafif hız patlaması
                break;
            case 'rainbow': // Topu arkadan havaya kaldırma
                player.ball.position.y += 3;
                player.ball.position.z -= 2;
                break;
            case 'elastico': // Ronaldinho çalımı (Yönü hızlıca saptırma)
                player.position.x += 1.5;
                break;
        }
        return true;
    }
}

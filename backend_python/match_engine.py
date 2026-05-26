# FC 27 - Hakem ve Maç Kuralları Motoru
import time

class MatchEngine:
    def __init__(self):
        self.score_team_a = 0  # CR7 TEAM
        self.score_team_b = 0  # NEYMAR XI
        self.match_start_time = time.time()
        self.game_duration_minutes = 90
        
        # Camp Nou kalesinin sanal koordinatları (Gol çizgisi teknolojisi için)
        self.goal_line_z = -55.0  # Kalenin arka çizgisi
        self.goal_post_left_x = -3.5
        self.goal_post_right_x = 3.5
        self.goal_bar_height_y = 2.4

    def check_shot_trajectory(self, shot_data):
        """
        Şut çekildiğinde topun izlediği yolu analiz eder.
        Eğer şut gücü ve açısı kalenin sınırları içindeyse TRUE döner (GOL).
        """
        power = shot_data.get("power", 0)
        angle = shot_data.get("angle", 0) # Derece cinsinden vuruş açısı
        
        # Basit bir gol olasılığı ve isabet matematiği
        if power > 40 and -15 <= angle <= 15:
            # Şut hem güçlü hem de kaleyi bulacak açıda
            return True
        return False

    def add_goal(self, shooter_team):
        if shooter_team == "CR7_TEAM":
            self.score_team_a += 1
        else:
            self.score_team_b += 1
        return self.get_scoreboard()

    def get_scoreboard(self):
        # Geçen süreyi oyun içi dakikaya çevir (Gerçekteki 1 saniye = Oyundaki 1 dakika olsun)
        elapsed_seconds = int(time.time() - self.match_start_time)
        current_game_minute = min(elapsed_seconds, self.game_duration_minutes)
        
        return {
            "score_display": f"{self.score_team_a} - {self.score_team_b}",
            "team_a_score": self.score_team_a,
            "team_b_score": self.score_team_b,
            "minute": f"{current_game_minute:02d}:00",
            "is_match_over": current_game_minute >= 90
        }

    def reset_match(self):
        self.score_team_a = 0
        self.score_team_b = 0
        self.match_start_time = time.time()


# Deep Career Mode Database & Simulation System
import random

class CareerManager:
    def __init__(self):
        self.current_year = 2026
        self.user_team = "Qarabağ FK"
        self.budget = 15000000 # 15 Milyon Euro Transfer Bütçesi
        self.squad = [
            {"name": "Juninho", "ovr": 79, "value": 6500000, "age": 29, "form": 100},
            {"name": "Benzia", "ovr": 77, "value": 4000000, "age": 31, "form": 95},
            {"name": "Zoubir", "ovr": 76, "value": 2500000, "age": 34, "form": 98},
        ]
        self.transfer_market = [
            {"name": "Lada Striker", "ovr": 72, "value": 1200000, "age": 21},
            {"name": "Wonderkid Ganja", "ovr": 75, "value": 3500000, "age": 18}
        ]

    def simulate_match_day(self):
        # Arka planda ligdeki diğer maçları ve oyuncu gelişimlerini simüle eder
        for player in self.squad:
            # Genç oyuncular gelişir, yaşlılar geriler
            if player["age"] < 23:
                player["ovr"] += random.choice([0, 1])
            elif player["age"] > 32:
                player["ovr"] -= random.choice([0, 1])
                
            # Rastgele sakatlık ihtimali simülasyonu
            if random.random() < 0.02:
                player["form"] = 50 # Sakatlandı veya formu düştü
        return "Lig maç günü simüle edildi. Oyuncu formları güncellendi."

    def receive_transfer_offer(self):
        # Kullanıcının yıldız oyuncusuna yapay zekadan teklif gelmesi
        target_player = random.choice(self.squad)
        offered_value = int(target_player["value"] * random.uniform(1.1, 1.4))
        return {
            "message": f"Real Madrid, {target_player['name']} için {offered_value} € teklif etti!",
            "player_name": target_player["name"],
            "offer": offered_value
        }

    def change_tactics(self, tactic_name):
        # Tiki-taka, Gegenpress, Park the bus taktik entegrasyonu
        tactics = ["Tiki-Taka", "Gegenpress", "Park the Bus", "Counter Attack"]
        if tactic_name in tactics:
            return f"Takım taktiği başarıyla değiştirildi: {tactic_name}"
        return "Geçersiz taktik!"


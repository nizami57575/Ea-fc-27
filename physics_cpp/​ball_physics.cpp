#include <iostream>
#include <cmath>

extern "C" {
    // Top fiziği yapısı
    struct BallState {
        float x, y, z;
        float vx, vy, vz;
        float spinX, spinY, spinZ; // Falso (Magnus Etkisi)
    };

    // Zaman adımı başına fizik simülasyonu hesaplama
    void update_ball_physics(BallState* ball, float gravity, float airResistance, float pitchWetness, float deltaTime) {
        // 1. Yerçekimi Etkisi
        ball->vy -= gravity * deltaTime;

        // 2. Çim/Zemin Islaklığı Sürtünme Hesaplaması
        float currentResistance = airResistance;
        if (ball->y <= 0.25f) { // Top zemine temas ediyorsa
            ball->y = 0.25f;
            ball->vy = -ball->vy * 0.65f; // Sekme katsayısı
            
            // Islak çimde top hızlanır ama kayar, kuru çim topu yavaşlatır
            float friction = pitchWetness > 0.5f ? 0.98f : 0.92f;
            ball->vx *= friction;
            ball->vz *= friction;
        }

        // 3. Falso (Magnus Etkisi) Aerodinamik Kuvvet Hesaplama
        // Falso yönüne göre top havada yön değiştirir (Trivela ve Plase vuruşlar için)
        ball->vx += (ball->spinY * ball->vz - ball->spinZ * ball->vy) * 0.01f * deltaTime;
        ball->vz += (ball->spinX * ball->vx - ball->spinY * ball->vx) * 0.01f * deltaTime;

        // 4. Hava Direnci Uygula ve Pozisyonları Güncelle
        ball->vx *= (1.0f - currentResistance * deltaTime);
        ball->vy *= (1.0f - currentResistance * deltaTime);
        ball->vz *= (1.0f - currentResistance * deltaTime);

        ball->x += ball->vx * deltaTime;
        ball->y += ball->vy * deltaTime;
        ball->z += ball->vz * deltaTime;
    }
}


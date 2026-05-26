// Motion Capture Animation Manager
class AnimationManager {
    constructor(gltfModel) {
        this.mixer = new THREE.AnimationMixer(gltfModel);
        this.clips = gltfModel.animations;
        this.actions = {};

        // Model içindeki tüm animasyon kliplerini haritalandır
        this.clips.forEach((clip) => {
            this.actions[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
        });

        this.currentAction = this.actions['idle'] || null;
        if (this.currentAction) this.currentAction.play();
    }

    playAnimation(name, duration = 0.2) {
        const nextAction = this.actions[name.toLowerCase()];
        if (!nextAction || nextAction === this.currentAction) return;

        // Geçerli animasyondan diğerine pürüzsüz geçiş yap (CrossFade)
        nextAction.reset();
        nextAction.setEffectiveTimeScale(1);
        nextAction.setEffectiveWeight(1);
        nextAction.fadeIn(duration);
        
        if (this.currentAction) {
            this.currentAction.fadeOut(duration);
        }
        
        this.currentAction = nextAction;
        this.currentAction.play();
    }

    update(deltaTime) {
        if (this.mixer) this.mixer.update(deltaTime);
    }
}


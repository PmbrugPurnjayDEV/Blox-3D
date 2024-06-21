// cl_player.js - Define client-side player behavior
class cl_Player {
    constructor(name) {
        this.name = name;
        this.position = { x: 0, y: 0, z: 0 };
        this.listener = new THREE.AudioListener();
        this.sound = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.initSound();
        this.isMoving = false;
        this.moveSoundInterval = null;
    }

    initSound() {
        this.audioLoader.load('sounds/move.mp3', (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setLoop(false);
            this.sound.setVolume(0.5);
        });
    }

    startMoveSound() {
        if (this.moveSoundInterval === null) {
            this.moveSoundInterval = setInterval(() => {
                if (!this.sound.isPlaying) {
                    this.sound.play();
                }
            }, 500);
        }
    }

    stopMoveSound() {
        if (this.moveSoundInterval !== null) {
            clearInterval(this.moveSoundInterval);
            this.moveSoundInterval = null;
        }
    }

    move(x, y, z) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
        console.log(`${this.name} moved to (${this.position.x}, ${this.position.y}, ${this.position.z})`);
        
        if (!this.isMoving) {
            this.isMoving = true;
            this.startMoveSound();
        }
    }

    stop() {
        if (this.isMoving) {
            this.isMoving = false;
            this.stopMoveSound();
        }
    }

    render() {
        // Render the player in the client
        console.log(`${this.name} is being rendered at (${this.position.x}, ${this.position.y}, ${this.position.z})`);
    }
}

// Expose the class to the global scope
window.cl_Player = cl_Player;

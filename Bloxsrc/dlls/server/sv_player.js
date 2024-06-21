// sv_player.js - Define server-side player behavior
class sv_Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.position = { x: 0, y: 0, z: 0 };
    }

    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        console.log(`Player ${this.id} (${this.name}) positioned at (${this.position.x}, ${this.position.y}, ${this.position.z})`);
    }

    updatePosition(x, y, z) {
        this.setPosition(x, y, z);
        // Additional server-side logic for updating position
        console.log(`Player ${this.id} (${this.name}) updated to (${this.position.x}, ${this.position.y}, ${this.position.z})`);
    }
}

// Expose the class to the global scope
window.sv_Player = sv_Player;

// sv_entities.js - Define server-side entities
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
}

// Example usage
const serverPlayer = new sv_Player(1, 'ServerHero');
serverPlayer.setPosition(10, 0, 20);

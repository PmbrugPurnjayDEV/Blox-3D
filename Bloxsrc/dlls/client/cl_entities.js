// cl_player.js - Define client-side player behavior
class cl_Player {
    constructor(name) {
        this.name = name;
        this.position = { x: 0, y: 0, z: 0 };
    }

    move(x, y, z) {
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
        console.log(`${this.name} moved to (${this.position.x}, ${this.position.y}, ${this.position.z})`);
    }

    render() {
        // Render the player in the client
        console.log(`${this.name} is being rendered at (${this.position.x}, ${this.position.y}, ${this.position.z})`);
    }
}

// Example usage
const player = new cl_Player('Hero');
player.move(1, 0, 0);
player.render();

// Expose the class to the global scope
window.cl_Player = cl_Player;

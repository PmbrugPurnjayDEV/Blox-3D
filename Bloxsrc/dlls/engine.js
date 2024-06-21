// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Blue skybox setup
const skyboxGeometry = new THREE.BoxGeometry(500, 500, 500);
const skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// Add a light to illuminate the plane
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10).normalize();
scene.add(light);

// Camera controls setup with adjusted sensitivity
const controls = new THREE.PointerLockControls(camera, renderer.domElement);

document.addEventListener('click', () => {
    if (!isMenuVisible) controls.lock();
});

controls.addEventListener('lock', () => {
    console.log('Pointer lock acquired');
});

controls.addEventListener('unlock', () => {
    console.log('Pointer lock lost');
    if (!isMenuVisible) showMainMenu();
});

scene.add(controls.getObject());

// Initial camera position
camera.position.y = 5; // Spawn the player higher

// Movement variables
const moveSpeed = 0.1;
const move = { forward: false, backward: false, left: false, right: false, up: false, down: false, run: false };
const jumpHeight = 0.3;
let isJumping = false;
let isCrouching = false;
let verticalVelocity = 0;
const gravity = -0.02;
let obstacles = []; // Array to hold all obstacles
let isMenuVisible = true;
let noclip = false; // Noclip mode

// Create an instance of cl_Player
const clientPlayer = new cl_Player('ClientHero');
clientPlayer.render();

// Sound setup after user gesture
let listener;
let sound;
let audioLoader;

function initializeAudio() {
    listener = new THREE.AudioListener();
    camera.add(listener);

    sound = new THREE.Audio(listener);
    audioLoader = new THREE.AudioLoader();

    loadSound('sounds/move.mp3');
}

function loadSound(url) {
    audioLoader.load(url, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(0.5);
    });
}

document.addEventListener('click', () => {
    if (!listener) {
        initializeAudio();
    }
});

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            move.forward = true;
            clientPlayer.move(0, 0, -moveSpeed);
            break;
        case 'ArrowDown':
        case 'KeyS':
            move.backward = true;
            clientPlayer.move(0, 0, moveSpeed);
            break;
        case 'ArrowLeft':
        case 'KeyA':
            move.left = true;
            clientPlayer.move(-moveSpeed, 0, 0);
            break;
        case 'ArrowRight':
        case 'KeyD':
            move.right = true;
            clientPlayer.move(moveSpeed, 0, 0);
            break;
        case 'Space':
            if (noclip) {
                move.up = true;
            } else if (!isJumping) {
                verticalVelocity = jumpHeight;
                isJumping = true;
                clientPlayer.move(0, jumpHeight, 0);
            }
            break;
        case 'ShiftLeft':
            move.run = true;
            if (noclip) {
                move.down = true;
            }
            break;
        case 'ControlLeft':
            if (!noclip) {
                isCrouching = true;
                camera.position.y = 1;
            }
            break;
        case 'KeyV':
            noclip = !noclip;
            if (noclip) {
                console.log('Noclip mode enabled');
            } else {
                console.log('Noclip mode disabled');
            }
            break;
        case 'Escape':  // Open the main menu when the Escape key is pressed
            toggleMainMenu();
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            move.forward = false;
            clientPlayer.stop();
            break;
        case 'ArrowDown':
        case 'KeyS':
            move.backward = false;
            clientPlayer.stop();
            break;
        case 'ArrowLeft':
        case 'KeyA':
            move.left = false;
            clientPlayer.stop();
            break;
        case 'ArrowRight':
        case 'KeyD':
            move.right = false;
            clientPlayer.stop();
            break;
        case 'Space':
            move.up = false;
            break;
        case 'ShiftLeft':
            move.run = false;
            move.down = false;
            break;
        case 'ControlLeft':
            isCrouching = false;
            camera.position.y = 2;
            break;
    }
});

// Function to create walls
function createWall(x, z, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(x, height / 2, z);
    wall.geometry.computeBoundingBox();
    wall.boundingBox = new THREE.Box3().setFromObject(wall); // Compute and store bounding box
    scene.add(wall);
    obstacles.push(wall);
}

// Function to create columns
function createColumn(x, z) {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x696969 });
    const column = new THREE.Mesh(geometry, material);
    column.position.set(x, 1.5, z);
    column.geometry.computeBoundingBox();
    column.boundingBox = new THREE.Box3().setFromObject(column); // Compute and store bounding box
    scene.add(column);
    obstacles.push(column);
}

// Function to create scattered blocks
function createBlock(x, z) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, 0.5, z);
    block.geometry.computeBoundingBox();
    block.boundingBox = new THREE.Box3().setFromObject(block); // Compute and store bounding box
    scene.add(block);
    obstacles.push(block);
}

// Global loadMap function
function loadMap(mapIndex) {
    // Remove existing obstacles
    obstacles.forEach(obstacle => scene.remove(obstacle));
    obstacles = [];

    // Load the map
    switch (mapIndex) {
        case 1:
            loadMap1();
            break;
        case 2:
            loadMap2();
            break;
        case 3:
            loadMap3();
            break;
        case 4:
            loadMap4();
            break;
        default:
            console.error("Invalid map index");
    }
}

// Collision detection function
function detectCollision() {
    const cameraBox = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(camera.position.x, camera.position.y - 1, camera.position.z), 
        new THREE.Vector3(1, 2, 1)
    );

    for (const obstacle of obstacles) {
        if (cameraBox.intersectsBox(obstacle.boundingBox)) {
            return true;
        }
    }
    return false;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const initialPosition = camera.position.clone(); // Save the initial position

    let speed = moveSpeed;
    if (move.run) speed *= 2; // Double speed for running
    if (isCrouching) speed /= 2; // Half speed for crouching

    if (move.forward) controls.moveForward(speed);
    if (move.backward) controls.moveForward(-speed);
    if (move.left) controls.moveRight(-speed);
    if (move.right) controls.moveRight(speed);
    if (noclip) {
        if (move.up) camera.position.y += speed;
        if (move.down) camera.position.y -= speed;
        if (move.run) {
            if (move.forward) controls.moveForward(speed);
            if (move.backward) controls.moveForward(-speed);
            if (move.left) controls.moveRight(-speed);
            if (move.right) controls.moveRight(speed);
        }
    }

    // Handle jumping and gravity if not in noclip mode
    if (!noclip) {
        if (isJumping) {
            camera.position.y += verticalVelocity;
            verticalVelocity += gravity;
            if (camera.position.y <= (isCrouching ? 1 : 2)) {
                camera.position.y = isCrouching ? 1 : 2;
                isJumping = false;
                verticalVelocity = 0;
            }
        }

        // Check for collisions
        if (detectCollision()) {
            camera.position.copy(initialPosition); // Revert to the initial position if collision detected
        }
    }

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to show the main menu
function showMainMenu() {
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('crosshair').style.display = 'none';
    isMenuVisible = true;
    controls.unlock();  // Ensure pointer lock is released
}

// Function to hide the main menu and start the game
function startGame() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('crosshair').style.display = 'block';
    isMenuVisible = false;
    controls.lock();
}

// Function to select a map and start the game
function selectMap(mapIndex) {
    loadMap(mapIndex);
    startGame();
}

// Function to toggle the main menu
function toggleMainMenu() {
    if (isMenuVisible) {
        startGame();
    } else {
        showMainMenu();
    }
}

// Show the main menu on page load
window.onload = showMainMenu;

// Use the player classes from the loaded scripts
const serverPlayer = new sv_Player(1, 'ServerHero');
serverPlayer.setPosition(10, 0, 20);
serverPlayer.updatePosition(15, 0, 25);

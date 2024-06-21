function loadMap1() {
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    createWall(0, -50, 100, 3, 1); // North wall
    createWall(0, 50, 100, 3, 1); // South wall
    createWall(-50, 0, 1, 3, 100); // West wall
    createWall(50, 0, 1, 3, 100); // East wall
    createColumn(-10, -10);
    createColumn(10, -10);
    createColumn(-10, 10);
    createColumn(10, 10);
}

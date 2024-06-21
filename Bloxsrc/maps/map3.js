function loadMap3() {
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    for (let i = -40; i <= 40; i += 10) {
        createWall(i, 0, 1, 3, 100);
    }
    for (let i = -40; i <= 40; i += 10) {
        createWall(0, i, 100, 3, 1);
    }
}

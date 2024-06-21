function loadMap4() {
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    for (let i = 0; i < 20; i++) {
        if (Math.random() > 0.5) {
            createWall(Math.random() * 80 - 40, Math.random() * 80 - 40, 5, 3, 1);
        } else {
            createBlock(Math.random() * 80 - 40, Math.random() * 80 - 40);
        }
    }
}

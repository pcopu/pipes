import * as THREE from 'three';

let scene, camera, renderer;
let pipes = [];
let activePipeIndex = 0;
let frameCount = 0;
let stepsSinceLastPause = 0;
const maxSteps = 50; // Maximum steps before a pipe can be paused

const gridSize = 20;
const grid = new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(false)));

class Pipe {
    constructor() {
        this.pipeSegments = [];
        this.joints = [];
        this.reset();
        this.paused = false;
    }

    reset() {
        this.pipeSegments.forEach(segment => scene.remove(segment));
        this.joints.forEach(joint => scene.remove(joint));
        this.pipeSegments = [];
        this.joints = [];

        if (this.path) {
            this.path.forEach(p => {
                const gx = Math.floor(p.x + gridSize / 2);
                const gy = Math.floor(p.y + gridSize / 2);
                const gz = Math.floor(p.z + gridSize / 2);
                if (gx >= 0 && gx < gridSize && gy >= 0 && gy < gridSize && gz >= 0 && gz < gridSize) {
                    grid[gx][gy][gz] = false;
                }
            });
        }

        this.position = new THREE.Vector3(
            Math.floor(Math.random() * gridSize) - gridSize / 2,
            Math.floor(Math.random() * gridSize) - gridSize / 2,
            Math.floor(Math.random() * gridSize) - gridSize / 2
        );
        this.path = [this.position.clone()];

        this.direction = new THREE.Vector3(0, 0, 0);
        this.randomizeDirection();

        this.color = new THREE.Color(Math.random(), Math.random(), Math.random());
        this.material = new THREE.MeshLambertMaterial({ color: this.color });

        const jointGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const jointMesh = new THREE.Mesh(jointGeometry, this.material);
        jointMesh.position.copy(this.position);
        scene.add(jointMesh);
        this.joints.push(jointMesh);
    }

    randomizeDirection() {
        const axes = ['x', 'y', 'z'];
        const currentAxis = Object.keys(this.direction).find(key => this.direction[key] !== 0);
        const newAxes = axes.filter(ax => ax !== currentAxis);
        const axis = newAxes[Math.floor(Math.random() * newAxes.length)];

        const newDirection = new THREE.Vector3(0, 0, 0);
        const value = Math.random() > 0.5 ? 1 : -1;
        newDirection[axis] = value;
        this.direction.copy(newDirection);
    }

    grow() {
        if (this.paused) return;

        const oldPosition = this.position.clone();
        this.position.add(this.direction);
        this.path.push(this.position.clone());

        if (this.isColliding()) {
            this.reset();
            return;
        }

        const points = [oldPosition, this.position];
        const tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 2, 0.4, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeometry, this.material);
        this.pipeSegments.push(tubeMesh);
        scene.add(tubeMesh);

        if (Math.random() > 0.7) {
            const jointGeometry = new THREE.SphereGeometry(0.5, 8, 8);
            const jointMesh = new THREE.Mesh(jointGeometry, this.material);
            jointMesh.position.copy(this.position);
            this.joints.push(jointMesh);
            scene.add(jointMesh);
            this.randomizeDirection();
        }
        stepsSinceLastPause++;
    }

    isColliding() {
        const { x, y, z } = this.position;
        const gx = Math.floor(x + gridSize / 2);
        const gy = Math.floor(y + gridSize / 2);
        const gz = Math.floor(z + gridSize / 2);

        if (gx < 0 || gx >= gridSize || gy < 0 || gy >= gridSize || gz < 0 || gz >= gridSize) {
            return true;
        }

        if (grid[gx][gy][gz]) {
            return true;
        }

        grid[gx][gy][gz] = true;
        return false;
    }
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    for (let i = 0; i < 6; i++) {
        pipes.push(new Pipe());
    }

    camera.position.set(0, 0, 25);
    camera.lookAt(scene.position);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if (frameCount % 5 === 0) {
        if (stepsSinceLastPause > maxSteps * Math.random()) {
            pipes[activePipeIndex].paused = true;
            if (Math.random() > 0.5) {
                activePipeIndex = (activePipeIndex + 1) % pipes.length;
            } else {
                activePipeIndex = Math.floor(Math.random() * pipes.length);
            }
            pipes[activePipeIndex].paused = false;
            stepsSinceLastPause = 0;
        }

        pipes[activePipeIndex].grow();
    }

    renderer.render(scene, camera);
    frameCount++;
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
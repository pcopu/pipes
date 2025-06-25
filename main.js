import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

let scene, camera, renderer;
let pipes = [];
let activePipeIndex = 0;
let frameCount = 0;
let stepsSinceLastPause = 0;
const maxSteps = 100; // Increased steps for longer runs
const numPipes = 2; // Reduced number of pipes

const gridSize = 100;

const classicColors = [
    0xff0000, // Red
    0x00ff00, // Green
    0x0000ff, // Blue
    0xffff00, // Yellow
    0xff00ff, // Magenta
    0x00ffff, // Cyan
];

let teapotModel;

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

        this.position = new THREE.Vector3(
            Math.floor(Math.random() * gridSize) - gridSize / 2,
            Math.floor(Math.random() * gridSize) - gridSize / 2,
            Math.floor(Math.random() * gridSize) - gridSize / 2
        );
        this.path = [this.position.clone()];

        this.direction = new THREE.Vector3(0, 0, 0);
        this.randomizeDirection();

        this.color = classicColors[Math.floor(Math.random() * classicColors.length)];
        this.material = new THREE.MeshLambertMaterial({ color: this.color });

        this.addJoint();
    }

    addJoint() {
        if (!teapotModel) return;
        const jointMesh = teapotModel.clone();
        jointMesh.material = this.material;
        jointMesh.position.copy(this.position);
        jointMesh.scale.set(0.5, 0.5, 0.5);
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

        if (Math.random() > 0.95) { // Even lower turning probability
            this.addJoint();
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

    const loader = new OBJLoader();
    loader.load('teapot.obj', (obj) => {
        teapotModel = obj.children[0];
        for (let i = 0; i < numPipes; i++) {
            pipes.push(new Pipe());
        }
        animate();
    });

    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);
}

function animate() {
    requestAnimationFrame(animate);

    if (frameCount % 10 === 0) { // Slower growth
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

        if (pipes[activePipeIndex]) {
            pipes[activePipeIndex].grow();
        }
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
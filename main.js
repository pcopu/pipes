import * as THREE from 'three';

let scene, camera, renderer;
let pipes = [];
let activePipeIndex = 0;
let stepsSinceLastPause = 0;
const maxSteps = 500;
let numPipes;

const gridSize = 100;
const occupiedCoordinates = new Set();

const classicColors = [
    0xff0000, // Red
    0x00ff00, // Green
    0x0000ff, // Blue
    0xffff00, // Yellow
    0xff00ff, // Magenta
    0x00ffff, // Cyan
];

let sceneDuration;
let sceneStartTime;
let isFading = false;

const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    uniform vec3 uColor;
    uniform float uDissolve;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Basic pseudo-random number generator
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
        // Divide by a factor to make the dots bigger
        if (rand(floor(gl_FragCoord.xy / 5.0)) < uDissolve) {
            discard;
        }

        // Basic Lambertian lighting
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);
        vec3 diffuse = uColor * diff;

        // Add some ambient light
        vec3 ambient = vec3(0.2) * uColor;

        gl_FragColor = vec4(diffuse + ambient, 1.0);
    }
`;

function newScene() {
    isFading = false;
    pipes.forEach(pipe => {
        pipe.dispose();
    });
    pipes = [];
    occupiedCoordinates.clear();

    numPipes = Math.floor(Math.random() * 4) + 2; // 2 to 5 colors
    sceneDuration = (Math.random() * 30 + 15) * 1000; // 15 to 45 seconds
    sceneStartTime = Date.now();

    const shuffledColors = classicColors.sort(() => 0.5 - Math.random());

    for (let i = 0; i < numPipes; i++) {
        const startImmediately = i === 0;
        const pipe = new Pipe(shuffledColors[i % shuffledColors.length], startImmediately);
        if (!startImmediately) {
            pipe.paused = true;
        }
        pipes.push(pipe);
    }
    activePipeIndex = 0;
    stepsSinceLastPause = 0;
}

class Pipe {
    constructor(color, startImmediately) {
        this.pipeSegments = [];
        this.joints = [];
        this.color = new THREE.Color(color);
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor: { value: this.color },
                uDissolve: { value: 0.0 }
            },
        });
        this.reset(startImmediately);
        this.paused = false;
    }

    dispose() {
        this.pipeSegments.forEach(segment => scene.remove(segment));
        this.joints.forEach(joint => scene.remove(joint));
        this.pipeSegments = [];
        this.joints = [];
    }

    reset(startImmediately) {
        this.dispose();

        this.position = new THREE.Vector3(
            Math.floor(Math.random() * gridSize) - gridSize / 2,
            Math.floor(Math.random() * gridSize) - gridSize / 2,
            Math.floor(Math.random() * gridSize) - gridSize / 2
        );
        this.path = [this.position.clone()];
        occupiedCoordinates.add(this.position.toArray().map(Math.round).join(','));

        this.direction = new THREE.Vector3(0, 0, 0);
        this.randomizeDirection();

        if (startImmediately) {
            this.addJoint();
        }
    }

    addJoint() {
        const jointGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const jointMesh = new THREE.Mesh(jointGeometry, this.material);
        jointMesh.position.copy(this.position);
        scene.add(jointMesh);
        this.joints.push(jointMesh);
    }

    randomizeDirection(lastAxis) {
        const axes = ['x', 'y', 'z'];
        const newAxes = axes.filter(ax => ax !== lastAxis);
        const axis = newAxes[Math.floor(Math.random() * newAxes.length)];

        const newDirection = new THREE.Vector3(0, 0, 0);
        const value = Math.random() > 0.5 ? 1 : -1;
        newDirection[axis] = value;
        this.direction.copy(newDirection);
    }

    grow() {
        if (this.paused) return;

        const nextPosition = this.position.clone().add(this.direction);

        if (this.isColliding(nextPosition)) {
            this.addJoint();
            const lastAxis = Object.keys(this.direction).find(key => this.direction[key] !== 0);
            this.randomizeDirection(lastAxis);
            return;
        }

        const oldPosition = this.position.clone();
        this.position.copy(nextPosition);
        this.path.push(this.position.clone());
        occupiedCoordinates.add(this.position.toArray().map(Math.round).join(','));

        const points = [oldPosition, this.position];
        const tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 2, 1.2, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeometry, this.material);
        this.pipeSegments.push(tubeMesh);
        scene.add(tubeMesh);

        if (Math.random() > 0.95) {
            this.addJoint();
            const lastAxis = Object.keys(this.direction).find(key => this.direction[key] !== 0);
            this.randomizeDirection(lastAxis);
        }
        stepsSinceLastPause++;
    }

    isColliding(position) {
        const { x, y, z } = position;
        const gx = Math.floor(x + gridSize / 2);
        const gy = Math.floor(y + gridSize / 2);
        const gz = Math.floor(z + gridSize / 2);

        if (gx < 0 || gx >= gridSize || gy < 0 || gy >= gridSize || gz < 0 || gz >= gridSize) {
            return true;
        }

        const posKey = position.toArray().map(Math.round).join(',');
        if (occupiedCoordinates.has(posKey)) {
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

    // Medium-harsh lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Less ambient
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight1.position.set(1, 1, 1).normalize();
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, -1, 0).normalize();
    scene.add(directionalLight2);

    newScene();

    animate();

    camera.position.set(0, 0, 120);
    camera.lookAt(scene.position);
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now();
    const elapsedTime = time - sceneStartTime;

    if (elapsedTime > sceneDuration) {
        isFading = true;
    }

    if (isFading) {
        const fadeDuration = 3000; // 3 seconds to fade
        const fadeElapsedTime = time - (sceneStartTime + sceneDuration);
        const dissolve = Math.min(fadeElapsedTime / fadeDuration, 1.0);

        pipes.forEach(pipe => {
            pipe.material.uniforms.uDissolve.value = dissolve;
        });

        if (dissolve >= 1.0) {
            newScene();
        }
    }

    const rotationTime = Date.now() * 0.0002;
    const radius = gridSize;
    camera.position.x = Math.sin(rotationTime) * radius;
    camera.position.z = Math.cos(rotationTime) * radius;
    camera.position.y = Math.sin(rotationTime * 0.5) * (gridSize * 0.3);
    camera.lookAt(scene.position);

    if (!isFading) {
        if (stepsSinceLastPause > maxSteps) {
            if (pipes[activePipeIndex]) {
                pipes[activePipeIndex].paused = true;
            }
            activePipeIndex = (activePipeIndex + 1) % pipes.length;
            if (pipes[activePipeIndex]) {
                pipes[activePipeIndex].paused = false;
                if (pipes[activePipeIndex].joints.length === 0) {
                    pipes[activePipeIndex].addJoint();
                }
            }
            stepsSinceLastPause = 0;
        }

        if (pipes[activePipeIndex]) {
            // Increased from 2 to 3 for a speed boost
            for (let i = 0; i < 3; i++) {
                pipes[activePipeIndex].grow();
            }
        }
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();

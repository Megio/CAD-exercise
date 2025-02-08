import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let shape;
let drawingEnabled = false;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 20);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x999999);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);

document.addEventListener("mousedown", onMouseDown, false);

var light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, -10);
scene.add(light);

var objects = [];

const longitude = -73.9654;
const latitude = 40.7829;
const width = 1280;
const height = 720;

const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${longitude - 0.001},${latitude - 0.001},${longitude + 0.001},${latitude + 0.001}&bboxSR=4326&layers=&layerDefs=&size=${width}%2C${height}&imageSR=&format=jpg&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&f=image`;
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(url);
var planeGeom = new THREE.PlaneGeometry(32, 18);
planeGeom.rotateX(-Math.PI / 2);
var plane = new THREE.Mesh(planeGeom, new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
}));
scene.add(plane);
objects.push(plane);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersects;
var controlPoints = [];
var pos = new THREE.Vector3();
var clickCount = 0;

function onMouseDown(event) {
  if (drawingEnabled) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      if (clickCount <= 3) {
        controlPoints[clickCount] = intersects[0].point.clone();
        var cp = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 12), new THREE.MeshBasicMaterial({ color: "red" }));
        cp.position.copy(intersects[0].point);
        scene.add(cp);
        clickCount++;
      } else {
        //make new wall and stop function
        shape = new THREE.Shape();
        shape.moveTo(controlPoints[0].x, -controlPoints[0].z);
        shape.lineTo(controlPoints[1].x, -controlPoints[1].z);
        shape.lineTo(controlPoints[2].x, -controlPoints[2].z);
        shape.lineTo(controlPoints[3].x, -controlPoints[3].z);
        shape.lineTo(controlPoints[0].x, -controlPoints[0].z);
        var extrudeSettings = {
          steps: 1,
          amount: 2,
          bevelEnabled: false
        };
        var extrudeGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        extrudeGeom.rotateX(-Math.PI / 2);
        var wall = new THREE.Mesh(extrudeGeom, new THREE.MeshStandardMaterial({
          color: "gray"
        }));
        scene.add(wall);
        controlPoints = [];
        clickCount = 0;
        drawingEnabled = false;
      };
    };
  }
};

render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

document.getElementById('start-drawing-btn').addEventListener('click', () => {
  console.log('Start drawing!');
  drawingEnabled = true;
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    drawingEnabled = false;
  }
});

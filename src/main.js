import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let drawingEnabled = false;
let shape;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 20);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('lightgray');
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

document.addEventListener("mousedown", onMouseDown, false);

var light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, -10);
scene.add(light);

var objects = [];

const longitude = 12.642305;
const latitude = 41.575473;
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
var clickCount = 0;

function onMouseDown(event) {
  if (drawingEnabled) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      controlPoints[clickCount] = intersects[0].point.clone();
      var cp = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), new THREE.MeshBasicMaterial({ color: "tomato" }));
      cp.position.copy(intersects[0].point);
      cp.name = `cp_${clickCount}`;
      scene.add(cp);
      if (clickCount >= 1) {
        var material = new THREE.LineBasicMaterial({ color: 'tomato', linewidth: 100 });
        var geometry = new THREE.BufferGeometry();
        geometry.setFromPoints([controlPoints[clickCount - 1], controlPoints[clickCount]]);
        var line = new THREE.Line(geometry, material);
        line.name = `line_${clickCount}`;
        scene.add(line);
      }
      clickCount++;
    };
  }
};

render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

document.getElementById('start-drawing-btn').addEventListener('click', () => {
  drawingEnabled = !drawingEnabled;
  if (!drawingEnabled && controlPoints.length > 2) {
    var material = new THREE.LineBasicMaterial({ color: 'red', linewidth: 100 });
    var geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([controlPoints[clickCount - 1], controlPoints[0]]);
    var line = new THREE.Line(geometry, material);
    line.name = `extra_line`;
    scene.add(line);
  }
  document.getElementById('start-drawing-btn').innerHTML = drawingEnabled ? 'Stop Drawing' : 'Start Drawing';
});


document.getElementById('submit-wall-height').addEventListener('click', () => {
  drawingEnabled = false;
  document.getElementById('start-drawing-btn').innerHTML = drawingEnabled ? 'Stop Drawing' : 'Start Drawing';
  let wallHeight = document.getElementById('wall-height').value;
  shape = new THREE.Shape();
  controlPoints.forEach((point, index) => {
    if (index === 0) {
      shape.moveTo(point.x, -point.z);
    } else {
      shape.lineTo(point.x, -point.z);
    }
  });
  shape.lineTo(controlPoints[0].x, -controlPoints[0].z);
  var extrudeSettings = {
    depth: wallHeight / 100,
    bevelSize: 0,
    bevelThickness: 0,
    bevelOffset: 0
  };
  var extrudeGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  extrudeGeom.rotateX(-Math.PI / 2);
  var wall = new THREE.Mesh(extrudeGeom, new THREE.MeshStandardMaterial({
    color: "blue"
  }));
  wall.name = 'wall';
  scene.add(wall);
  controlPoints.forEach((_, i) => {
    scene.remove(scene.getObjectByName(`line_${i}`));
    scene.remove(scene.getObjectByName(`cp_${i}`));
    scene.remove(scene.getObjectByName(`extra_line`));
  });
  controlPoints = [];
  clickCount = 0;
});

document.getElementById('reset').addEventListener('click', () => {
  if (controlPoints.length > 0) {
    controlPoints.forEach((_, i) => {
      scene.remove(scene.getObjectByName(`line_${i}`));
      scene.remove(scene.getObjectByName(`cp_${i}`));
      scene.remove(scene.getObjectByName(`extra_line`));
    });
  }
  scene.remove(scene.getObjectByName('wall'));
  document.getElementById('wall-height').value = 0;
  // Clear control points and reset click count
  controlPoints = [];
  clickCount = 0;
});

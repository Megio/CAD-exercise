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

// Allow user to move camera with mouse
new OrbitControls(camera, renderer.domElement);

document.addEventListener("mousedown", onMouseDown, false);

var light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, -10);
scene.add(light);

var objects = [];

//Sets the lat and long of the maps I retrieve in arcgisonline server free API
const longitude = 12.642305;
const latitude = 41.575473;
const width = 1280;
const height = 720;

/*
I could use also a fetch and make an API call to retrieve the map image in this way:

fetch(mapUrl)
  .then(response => response.blob())
  .then(blob => {
    const imageUrl = URL.createObjectURL(blob);
    // Use the imageUrl in an img tag or however you need
  })
  .catch(error => console.error('Error fetching map:', error));
*/

//Here I used a PROMPT and asked for how to use arcgisonline server free API for retrieving a map image
const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${longitude - 0.001},${latitude - 0.001},${longitude + 0.001},${latitude + 0.001}&bboxSR=4326&layers=&layerDefs=&size=${width}%2C${height}&imageSR=&format=jpg&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&f=image`;
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(url);

//Here I used a PROMT and asked for setting me up a "standard" Three.js scene with a plane geometru on it
var planeGeom = new THREE.PlaneGeometry(32, 18);
planeGeom.rotateX(-Math.PI / 2);
//Put the map image as background on the plane geometry
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

function addPoint() {
  var cp = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), new THREE.MeshBasicMaterial({ color: "tomato" }));
  cp.position.copy(intersects[0].point);
  cp.name = `cp_${clickCount}`;
  scene.add(cp);
}

function drawLine(autoClose) {
  var material = new THREE.LineBasicMaterial({ color: 'tomato', linewidth: 100 });
  var geometry = new THREE.BufferGeometry();
  geometry.setFromPoints([controlPoints[clickCount - 1], controlPoints[autoClose ? 0 : clickCount]]);
  var line = new THREE.Line(geometry, material);
  line.name = autoClose ? `auto_closed_line` : `line_${clickCount}`;
  scene.add(line);
}

function onMouseDown(event) {
  if (drawingEnabled) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //Raycaster allow me to see if the point I clicked with my mouse intersects the plane with the map. If yes, I wanna draw my point, otherwise I don't want to draw anything.
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
      controlPoints[clickCount] = intersects[0].point.clone();
      if (clickCount === 0) {
        addPoint();
      }
      //From the second point created on, I need also to draw a line between two consecutive points
      if (clickCount === 1) {
        addPoint();
        drawLine();
      }
      if (clickCount >= 2) {
        //If the new point is really close to the first one it means that probably the user is trying to close the polygon. So I don't want an extra point, but
        //I wanna close the polygon with a line from the last point to the first one. We can decide how close the points could be 2 different points.
        if (Math.abs(controlPoints[clickCount].x - controlPoints[0].x) < 0.5 && Math.abs(controlPoints[clickCount].z - controlPoints[0].z) < 0.5) {
          drawLine(true);
          controlPoints = controlPoints.splice(0, controlPoints.length - 1)
          drawingEnabled = false;
          changeButtonLabel();
        } else {
          addPoint();
          drawLine();
        }
      }
      clickCount++;
    };
  }
};

function changeButtonLabel() {
  document.getElementById('start-drawing-btn').innerHTML = drawingEnabled ? 'Stop Drawing' : 'Start Drawing';
}

render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

//Handle the start drawing button click
document.getElementById('start-drawing-btn').addEventListener('click', () => {
  drawingEnabled = !drawingEnabled;
  //Create the latest line that close the polygon in order to be sure that the polygon cannot be left open
  if (!drawingEnabled && controlPoints.length > 2) {
    var material = new THREE.LineBasicMaterial({ color: 'red', linewidth: 100 });
    var geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([controlPoints[clickCount - 1], controlPoints[0]]);
    var line = new THREE.Line(geometry, material);
    line.name = `extra_line`;
    scene.add(line);
  }
  changeButtonLabel();
});

//Handle the submit wall height button click
document.getElementById('submit-wall-height').addEventListener('click', () => {
  drawingEnabled = false;
  //I need to draw a shape of the polygon I draw with points and line, and with the ExtrudeGeometry object in three.js I can exctract the 
  //3d solid from the shape I have drawn
  changeButtonLabel();
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
  //Not clear what is the measurement unit here, so I divided by 100 the depth in order to have something UX acceptable
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
    scene.remove(scene.getObjectByName(`auto_closed_line`));
  });
  controlPoints = [];
  clickCount = 0;
});

//Handle the remove function. I need to add name to each object in order to be able to select them and delete them without the risk of deleting something I don't want to
document.getElementById('reset').addEventListener('click', () => {
  if (controlPoints.length > 0) {
    controlPoints.forEach((_, i) => {
      scene.remove(scene.getObjectByName(`line_${i}`));
      scene.remove(scene.getObjectByName(`cp_${i}`));
      scene.remove(scene.getObjectByName(`extra_line`));
      scene.remove(scene.getObjectByName(`auto_closed_line`));
    });
  }
  scene.remove(scene.getObjectByName('wall'));
  document.getElementById('wall-height').value = 0;
  controlPoints = [];
  clickCount = 0;
});

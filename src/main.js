// import * as THREE from 'three';

// let camera, scene, renderer, line;

// const frustumSize = 4;

// let index = 0;
// let drawingEnabled = false;
// const coords = new THREE.Vector3();

// init();
// render();

// function init() {

//   const aspect = window.innerWidth / window.innerHeight;

//   camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 20);
//   camera.position.z = 5;

//   scene = new THREE.Scene();

//   const longitude = -73.9654;
//   const latitude = 40.7829;
//   const width = 1280;
//   const height = 720;

//   const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${longitude - 0.001},${latitude - 0.001},${longitude + 0.001},${latitude + 0.001}&bboxSR=4326&layers=&layerDefs=&size=${width}%2C${height}&imageSR=&format=jpg&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&f=image`;

//   const loader = new THREE.TextureLoader();
//   scene.background = loader.load(url);

//   const geometry = new THREE.BufferGeometry();

//   const positionAttribute = new THREE.BufferAttribute(new Float32Array(1000 * 3), 3); // allocate large enough buffer
//   positionAttribute.setUsage(THREE.DynamicDrawUsage);
//   geometry.setAttribute('position', positionAttribute);

//   const material = new THREE.LineBasicMaterial({
//     color: 'red',
//     linewidth: 4,
//   })

//   line = new THREE.Line(geometry, material);
//   scene.add(line);

//   addPoint(1, 0, 0); // current pointer coordinate


//   renderer = new THREE.WebGLRenderer({
//     antialias: true
//   });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setAnimationLoop(animate);
//   document.body.appendChild(renderer.domElement);

//   renderer.domElement.addEventListener('pointerdown', onPointerDown);
//   renderer.domElement.addEventListener('pointermove', onPointerMove);

//   window.addEventListener('resize', onWindowResize);

// }

// function addPoint(x, y, z) {
//   const positionAttribute = line.geometry.getAttribute('position');
//   positionAttribute.setXYZ(index, x, y, z);
//   positionAttribute.needsUpdate = true;

//   index++;

//   line.geometry.setDrawRange(0, index);
// }

// function updatePoint(x, y, z) {
//   const positionAttribute = line.geometry.getAttribute('position');
//   positionAttribute.setXYZ(index - 1, coords.x, coords.y, 0);
//   positionAttribute.needsUpdate = true;
// }

// function onPointerDown(event) {
//   if (drawingEnabled) {
//     coords.x = (event.clientX / window.innerWidth) * 2 - 1;
//     coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     coords.z = (camera.near + camera.far) / (camera.near - camera.far);

//     coords.unproject(camera);

//     addPoint(coords.x, coords.y, 0);

//     render();
//   }
// }

// function onPointerMove(event) {
//   if (drawingEnabled) {
//     coords.x = (event.clientX / window.innerWidth) * 2 - 1;
//     coords.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     coords.z = (camera.near + camera.far) / (camera.near - camera.far);

//     coords.unproject(camera);

//     updatePoint(coords.x, coords.y, 0)

//     render();
//   }
// }

// function onWindowResize() {

//   const aspect = window.innerWidth / window.innerHeight;

//   camera.left = -frustumSize * aspect / 2;
//   camera.right = frustumSize * aspect / 2;
//   camera.top = frustumSize / 2;
//   camera.bottom = -frustumSize / 2;

//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);

//   render();

// }

// function animate() {
//   renderer.render(scene, camera);
// }

// // render fn
// function render() {
//   renderer.render(scene, camera);
// }

// document.getElementById('start-drawing-btn').addEventListener('click', () => {
//   console.log('Start drawing!');
//   drawingEnabled = true;
// });

// document.addEventListener('keydown', (event) => {
//   if (event.key === 'Escape') {
//     drawingEnabled = false;
//   }
// });

// ============================================================================================================== //

// import * as THREE from 'three';


// let index = 0;
// let line;
// let drawingEnabled = false;
// const coords = new THREE.Vector3();


// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Create plane
// const geometry = new THREE.PlaneGeometry(16, 9); // 16:9 aspect ratio

// const longitude = -73.9654;
// const latitude = 40.7829;
// const width = 1280;
// const height = 720;

// const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${longitude - 0.001},${latitude - 0.001},${longitude + 0.001},${latitude + 0.001}&bboxSR=4326&layers=&layerDefs=&size=${width}%2C${height}&imageSR=&format=jpg&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&f=image`;

// const geometry2 = new THREE.BufferGeometry();

// const positionAttribute = new THREE.BufferAttribute(new Float32Array(1000 * 3), 3); // allocate large enough buffer
// positionAttribute.setUsage(THREE.DynamicDrawUsage);
// geometry2.setAttribute('position', positionAttribute);

// const material2 = new THREE.LineBasicMaterial({
//   color: 'red',
//   linewidth: 4,
// })

// line = new THREE.Line(geometry2, material2);
// scene.add(line);

// addPoint(1, 0, 0); // current pointer coordinate

// // Load texture
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(url); // Replace with your image path
// const material = new THREE.MeshBasicMaterial({
//   map: texture,
//   side: THREE.DoubleSide // Make the plane visible from both sides
// });

// const plane = new THREE.Mesh(geometry, material);
// scene.add(plane);

// // Position camera
// camera.position.z = 5;

// // Mouse interaction variables
// let mouseDown = false;
// let mouseX = 0;
// let mouseY = 0;

// // Mouse event listeners
// document.addEventListener('mousedown', (e) => {
//   console.log('cazzo')
//   if (drawingEnabled) {
//     coords.x = (e.clientX / window.innerWidth) * 2 - 1;
//     coords.y = -(e.clientY / window.innerHeight) * 2 + 1;
//     coords.z = (camera.near + camera.far) / (camera.near - camera.far);

//     coords.unproject(camera);

//     addPoint(coords.x, coords.y, 0);

//     render();
//   } else {
//     mouseDown = true;
//     mouseX = e.clientX;
//     mouseY = e.clientY;
//   }
// });

// document.addEventListener('mouseup', () => {
//   mouseDown = false;
// });

// document.addEventListener('mousemove', (e) => {
//   if (drawingEnabled) {
//     coords.x = (e.clientX / window.innerWidth) * 2 - 1;
//     coords.y = -(e.clientY / window.innerHeight) * 2 + 1;
//     coords.z = (camera.near + camera.far) / (camera.near - camera.far);

//     coords.unproject(camera);

//     updatePoint(coords.x, coords.y, 0)

//     render();
//   } else {
//     if (mouseDown) {
//       const deltaX = e.clientX - mouseX;
//       const deltaY = e.clientY - mouseY;

//       plane.rotation.y += deltaX * 0.005;
//       plane.rotation.x += deltaY * 0.005;

//       mouseX = e.clientX;
//       mouseY = e.clientY;
//     }
//   }
// });

// document.getElementById('start-drawing-btn').addEventListener('click', () => {
//   console.log('Start drawing!');
//   drawingEnabled = true;
// });

// document.addEventListener('keydown', (event) => {
//   if (event.key === 'Escape') {
//     drawingEnabled = false;
//   }
// });

// // Handle window resize
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Animation loop
// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }
// animate();

// function render() {
//   renderer.render(scene, camera);
// }

// function addPoint(x, y, z) {
//   const positionAttribute = line.geometry.getAttribute('position');
//   positionAttribute.setXYZ(index, x, y, z);
//   positionAttribute.needsUpdate = true;

//   index++;

//   line.geometry.setDrawRange(0, index);
// }

// function updatePoint(x, y, z) {
//   const positionAttribute = line.geometry.getAttribute('position');
//   positionAttribute.setXYZ(index - 1, coords.x, coords.y, 0);
//   positionAttribute.needsUpdate = true;
// }

// ============================================================================ //


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
      // if (clickCount <= 3) {
      controlPoints[clickCount] = intersects[0].point.clone();
      var cp = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshBasicMaterial({ color: "red" }));
      cp.position.copy(intersects[0].point);
      scene.add(cp);
      if (clickCount >= 1) {
        var material = new THREE.LineBasicMaterial({ color: 'red', linewidth: 100 });
        var geometry = new THREE.BufferGeometry();
        console.log(controlPoints)
        geometry.setFromPoints([controlPoints[clickCount - 1], controlPoints[clickCount]]);
        var line = new THREE.Line(geometry, material);
        scene.add(line);
      }
      clickCount++;
      // } else {
      //   //make new wall and stop function
      //   shape = new THREE.Shape();
      //   shape.moveTo(controlPoints[0].x, -controlPoints[0].z);
      //   shape.lineTo(controlPoints[1].x, -controlPoints[1].z);
      //   shape.lineTo(controlPoints[2].x, -controlPoints[2].z);
      //   shape.lineTo(controlPoints[3].x, -controlPoints[3].z);
      //   shape.lineTo(controlPoints[0].x, -controlPoints[0].z);
      //   var extrudeSettings = {
      //     steps: 1,
      //     amount: 2,
      //     bevelEnabled: false
      //   };
      //   var extrudeGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      //   extrudeGeom.rotateX(-Math.PI / 2);
      //   var wall = new THREE.Mesh(extrudeGeom, new THREE.MeshStandardMaterial({
      //     color: "gray"
      //   }));
      //   scene.add(wall);
      //   controlPoints = [];
      //   clickCount = 0;
      //   drawingEnabled = false;
      // };
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
  let paragraph = document.createElement('p');
  paragraph.innerHTML = 'Please click ESCAPE to stop drawing';
  document.body.appendChild(paragraph);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    drawingEnabled = false;
    let paragraph = document.querySelector('p');
    paragraph.parentNode.removeChild(paragraph);
  }
});


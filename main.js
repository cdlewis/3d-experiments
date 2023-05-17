import * as THREE from 'three';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000);

//   camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10 );
//   camera.position.z = 2;

camera.position.z = 300;

var renderer = new THREE.WebGLRenderer({});
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight);

// renderer.setClearColor(0xffffff, 1);
document.getElementById('render').appendChild( renderer.domElement );

var loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
 createText(font);
});
var text;
function createText(font) {
  var container = document.createElement( 'div' );
  document.body.appendChild( container );

  var geometry = new THREE.TextBufferGeometry( "16", {
    font: font,
    size: 100,
    height: 50,
    curveSegments: 15,
    bevelEnabled: false
  });

  geometry.computeBoundingBox();

  var materials = [
    new THREE.MeshBasicMaterial( { color: '#ECECEE', overdraw: 0.5 } ),
    new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.VertexColors } )
  ];
  text = new THREE.Mesh( geometry, materials );
  
    scene.background = new THREE.Color( 0x101010 );

  // geometry
  // nr of triangles with 3 vertices per triangle
  const vertexCount = 200000;

  const geometry2 = new THREE.BufferGeometry();

  const positions = [];
  const colors = [];

  for ( let i = 0; i < vertexCount; i ++ ) {

    let v = new THREE.Vector3(
      getRandomArbitrary(
        geometry.boundingBox.min.x, 
        geometry.boundingBox.max.x
      ),
      getRandomArbitrary(
        geometry.boundingBox.min.y, 
        geometry.boundingBox.max.y
      ),
      getRandomArbitrary(
        geometry.boundingBox.min.z, 
        geometry.boundingBox.max.z
      ),
    )
    //console.log('hi', geometry)
    const result = isInside(v, geometry)
    if (!result) {
      continue
    }
    let c = 5
    console.log(result)
    positions.push(
      v.x + getRandomArbitrary(-c, c),
      v.y + getRandomArbitrary(-c, c),
      v.z + getRandomArbitrary(-c, c),
      v.x + getRandomArbitrary(-c, c),
      v.y + getRandomArbitrary(-c, c),
      v.z + getRandomArbitrary(-c, c),
      v.x + getRandomArbitrary(-c, c),
      v.y + getRandomArbitrary(-c, c),
      v.z + getRandomArbitrary(-c, c),
    )
//
//
    // adding r,g,b,a
    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );

    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );

    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );
    colors.push( Math.random() * 255 );
  }
//
  const positionAttribute = new THREE.Float32BufferAttribute( positions, 3 );
  const colorAttribute = new THREE.Uint8BufferAttribute( colors, 4 );
//
  colorAttribute.normalized = true; // this will map the buffer values to 0.0f - +1.0f in the shader

  geometry2.setAttribute( 'position', positionAttribute );
  geometry2.setAttribute( 'color', colorAttribute );
  
  // material
  const material = new THREE.RawShaderMaterial( {

    uniforms: {
      time: { value: 1.0 }
    },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    side: THREE.DoubleSide,
    transparent: true

  } );

  const mesh = new THREE.Mesh( geometry2, material );

//   mesh.position.x = -700;
//   mesh.position.y = -50;
  mesh.position.z = -500;
var center = new THREE.Vector3();
mesh.geometry.computeBoundingBox();
mesh.geometry.boundingBox.getCenter(center);
mesh.geometry.center();
mesh.position.copy(center);

camera.lookAt(mesh.position)

  scene.add( mesh );
  
  
  
}

var animate = function () {
  requestAnimationFrame( animate );
  
  const time = performance.now();

  const object = scene.children[ 0 ];

  if (object) {
    object.rotation.y = time * 0.0005;
    object.material.uniforms.time.value = time * 0.005;
  }
  
  renderer.render(scene, camera);
};

animate();

function isInside(v, geometry){
  var ray = new THREE.Ray()
  var dir = new THREE.Vector3(getRandomArbitrary(-1, 1), getRandomArbitrary(-1, 1), getRandomArbitrary(-1, 1)).normalize();
  ray.set(v, dir);
  let counter = 0;

  let pos = geometry.attributes.position;
  let faces = pos.count / 3;
  let vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();

  let candidates = []
  for(let i = 0; i < faces; i++){
    vA.fromBufferAttribute(pos, i * 3 + 0);
    vB.fromBufferAttribute(pos, i * 3 + 1);
    vC.fromBufferAttribute(pos, i * 3 + 2);
    const result = ray.intersectTriangle(vA, vB, vC)
    
    if (result) {
      counter++;
      candidates.push(result)
    }
  }

  if (counter % 2 == 1 && counter > 1) {
    let x = candidates.map(c => c.distanceTo(v))
    return Math.min(...x)
  }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
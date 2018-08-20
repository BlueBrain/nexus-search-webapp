import palettes from "distinct-colors";
import { once } from "underscore";

var morphologyBuilder = morphologyBuilder || {};
var THREE = require("three");
var _ = require("underscore");
const COLOR_SETTINGS = {
  chromaMax: 80,
  lightMin: 70
};
const palette = palettes({
  count: 6,
  ...COLOR_SETTINGS
});

var BLACKMAT = new THREE.MeshLambertMaterial({
  color: 0x000000,
  side: THREE.DoubleSide,
  opacity: 0.5,
  transparent: true
});
var BLUEMAT = new THREE.MeshLambertMaterial({
  color: 0x0000ff,
  side: THREE.DoubleSide
});
var REDMAT = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide
});
var MAGMAT = new THREE.MeshLambertMaterial({
  color: 0xff00ff,
  side: THREE.DoubleSide
});
var YELLOWMAT = new THREE.MeshLambertMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide
});
var GREENMAT = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide
});

var NeuronPartType = {
  UNDEFINED: 0,
  SOMA: 1,
  AXON: 2,
  DENDRITE: 3,
  APICAL_DENDRITE: 4,
  FORK: 5,
  END: 6,
  CUSTOM: 7
};

var MATERIALS = [
  YELLOWMAT, // undefined
  BLACKMAT, // SOMA
  BLUEMAT, // AXON
  REDMAT, // DENDRITE
  MAGMAT, // APICAL DENDRITE
  undefined, //FORK
  undefined, //END
  GREENMAT //CUSTOM
];

morphologyBuilder.displayOnScene = function(
  scene,
  data,
  done,
  updateBoundingBox,
  getPointData
) {
  let doneCallback = once(done);
  loadMorphAsBytes(data, function(result) {
    console.log({result});
    return displayMorphology(
      result,
      scene,
      doneCallback,
      updateBoundingBox,
      getPointData
    );
  });
};

function loadMorphAsBytes(b64, displayCallback) {
  // TODO get rid of encoding.
  console.log({b64})
  var bString = atob(b64);
  var bytes = new Uint8Array(bString.length);
  for (var i = 0; i < bString.length; i++) {
    bytes[i] = bString.charCodeAt(i);
  }
  var reader = new FileReader();
  reader.onloadend = function() {
    displayCallback(reader.result);
  };
  reader.readAsArrayBuffer(new Blob([bytes]));
}

morphologyBuilder.displayPointOnScene = function(scene, pointString) {
  var positionData = pointString.split(" ").map(parseFloat);
  var geometry = new THREE.SphereGeometry(4, 10, 10);
  var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  var sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(positionData[0], positionData[1], positionData[2]);
  scene.add(sphere);
};
function displayMorphology(
  inputData,
  scene,
  doneCallback,
  bbCallback,
  getPointData
) {
  var pointData = new Float32Array(inputData);
  var count = pointData.length;

  var acceptableTypes = [
    NeuronPartType.AXON,
    NeuronPartType.DENDRITE,
    NeuronPartType.APICAL_DENDRITE
  ];

  var ofX = 0;
  var ofY = 1;
  var ofZ = 2;
  var ofR = 3;
  var ofType = 4;
  var ofId = 5;
  var ofPid = 6;
  var rowLength = 7;
  var rowCount = pointData.length / rowLength;
  var allPoints = {};
  for (var i = 0; i < rowCount; i++) {
    var offset = i * rowLength;
    allPoints[String(pointData[offset + ofId])] = {
      x: pointData[offset + ofX],
      y: pointData[offset + ofY],
      z: pointData[offset + ofZ],
      r: pointData[offset + ofR],
      type: pointData[offset + ofType],
      id: String(pointData[offset + ofId]),
      pid: String(pointData[offset + ofPid])
    };
  }

  var morphTypes = [];
  acceptableTypes.forEach(type => {
    // TODO: check with underscore.
    var curData = _.filter(allPoints, { type: type });
    createMesh(curData, scene, allPoints, bbCallback, type);
    if (curData.length > 0) {
      morphTypes.push(type);
    }
  });
  createSomaMesh(scene, allPoints);
  doneCallback();
  if (getPointData) {
    getPointData(pointData);
  }
  return morphTypes;
}

function createSomaMesh(scene, allPoints) {
  var somaData = _.filter(allPoints, { type: NeuronPartType.SOMA });
  var averageSoma = new THREE.Vector3(0, 0, 0);
  somaData.forEach(function(p) {
    averageSoma.set(
      averageSoma.x + p.x,
      averageSoma.y + p.y,
      averageSoma.z + p.z
    );
  });
  averageSoma.divideScalar(somaData.length);

  var geometry = new THREE.Geometry();
  for (var idx = 0; idx < somaData.length; idx++) {
    var p1 = somaData[idx % somaData.length];
    var p2 = somaData[(idx + 1) % somaData.length];
    geometry.vertices.push(
      new THREE.Vector3(p1.x, p1.y, p1.z),
      new THREE.Vector3(p2.x, p2.y, p2.z),
      averageSoma
    );
    geometry.faces.push(new THREE.Face3(3 * idx, 3 * idx + 1, 3 * idx + 2));
  }
  var soma = new THREE.Mesh(geometry, MATERIALS[1]);
  scene.add(soma);
}

function createMesh(data, scene, allPoints, updateBoundingBox, type) {
  var g = new THREE.BufferGeometry();
  var vertices = [];
  var indices = [];
  indices.indexCount = 0;
  indices.vertexCount = 0;
  for (var idx = 0; idx < data.length; idx++) {
    var pt = data[idx];
    var parentPtId = pt.pid;
    var parentPt = allPoints[parentPtId];
    if (!parentPt) {
      continue;
    }
    //do not display connection to soma
    if (parentPt.type == NeuronPartType.SOMA) {
      continue;
    }
    addVertices(parentPt, pt, updateBoundingBox, indices, vertices);
  }
  var vArray = new Float32Array(vertices.length);
  vArray.set(vertices);

  var iArray = new Uint32Array(indices.length);
  iArray.set(indices);

  var indicesB = new THREE.BufferAttribute(iArray, 1);
  var verticesB = new THREE.BufferAttribute(vArray, 3);
  g.setIndex(indicesB);
  g.addAttribute("position", verticesB);
  return displayMesh(g, scene, type);
}

function displayMesh(g, scene, type) {
  g.computeVertexNormals();
  var mesh = new THREE.Mesh(g, MATERIALS[type]);
  scene.add(mesh);
  return mesh;
}

function addVertices(parentPt, pt, updateBoundingBox, indices, vertices) {
  var startPoint = new THREE.Vector3(parentPt.x, parentPt.y, parentPt.z);
  var endPoint = new THREE.Vector3(pt.x, pt.y, pt.z);
  var startRadius = parentPt.r;
  var endRadius = pt.r;
  updateBoundingBox(endPoint);

  var zAxis = new THREE.Vector3(0, 0, 1);
  var localZAxis = new THREE.Vector3(
    endPoint.x - startPoint.x,
    endPoint.y - startPoint.y,
    endPoint.z - startPoint.z
  );
  var q = new THREE.Quaternion();
  var t = new THREE.Vector3().crossVectors(zAxis, localZAxis);
  q.x = t.x;
  q.y = t.y;
  q.z = t.z;
  q.w =
    Math.sqrt(zAxis.lengthSq() * localZAxis.lengthSq()) + zAxis.dot(localZAxis);
  q.normalize();
  var NB_VERTICES_BASE = 20;

  addBase(startPoint, q, startRadius, indices, vertices, NB_VERTICES_BASE);
  addBase(endPoint, q, endRadius, indices, vertices, NB_VERTICES_BASE);
  addTriangles(indices, NB_VERTICES_BASE);
}

function addTriangles(indices, nbVerticesBase) {
  var startIdx = indices.vertexCount - 2 * nbVerticesBase;

  //build 2 triangles that compose the face of the rectangle made by
  //2 vertices of the base of the cylinder (from startIdx) baseA and baseB
  //2 vertices of the top of the cylinder (from end_idx) topA and topB
  for (var n = 0; n < nbVerticesBase; n++) {
    var baseA = startIdx + (n % nbVerticesBase);
    var baseB = startIdx + ((n + 1) % nbVerticesBase);
    var topA = startIdx + nbVerticesBase + (n % nbVerticesBase);
    var topB = startIdx + nbVerticesBase + ((n + 1) % nbVerticesBase);
    //triangle 1
    indices.push(topA, baseB, baseA);
    //triangle 2
    indices.push(baseB, topA, topB);
  }
}

function addBase(center, q, radius, indices, vertices, nbVerticesBase) {
  for (var n = 0; n < nbVerticesBase; n++) {
    var phi = (n * Math.PI * 2) / nbVerticesBase;
    var x = Math.cos(phi) * radius;
    var y = Math.sin(phi) * radius;
    var v = new THREE.Vector3(x, y, 0);
    v.applyQuaternion(q);
    v.add(center);

    vertices.push(v.x, v.y, v.z);
    indices.vertexCount++;
  }
}

export default morphologyBuilder;

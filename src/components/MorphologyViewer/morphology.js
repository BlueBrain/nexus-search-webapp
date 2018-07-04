import * as THREE from "three";
import palettes from "distinct-colors";

const NB_VERTICES_BASE = 20;
const COLOR_SETTINGS = {
  chromaMax: 80,
  lightMin: 70
};

const neuronPartType = {
  UNDEFINED: 0,
  SOMA: 1,
  AXON: 2,
  DENDRITE: 3,
  APICAL_DENDRITE: 4,
  FORK: 5,
  END: 6,
  CUSTOM: 7
};
const acceptableTypes = [
  neuronPartType.AXON,
  neuronPartType.DENDRITE,
  neuronPartType.APICAL_DENDRITE
];

let palette = palettes({
  count: acceptableTypes.length,
  ...COLOR_SETTINGS
});

function convertMorphoIntoPointsDictionary (input) {
  let ofX = 0;
  let ofY = 1;
  let ofZ = 2;
  let ofR = 3;
  let ofType = 4;
  let ofId = 5;
  let ofPid = 6;
  let rowLength = 7;
  const pointData = new Float32Array(input);
  const rowCount = pointData.length / rowLength;
  let allPoints = [];
  for (let i = 0; i < rowCount; i++){
    let offset = i * rowLength;
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
  return allPoints;
}

/**
 * Morphology class
 */
class Morphology extends THREE.Group {
  /**
   * Constructor function
   * @param {Renderer} Renderer - Renderer instance
   * @param {Camera}   Camera   - Camera instance
   * @param {Clock}    Clock    - Clock instance
   */
  constructor() {
    super();
    this.morphTypes = [];
    this.vertices = [];
    this.indices = [];
    this.nbVerticesBase = NB_VERTICES_BASE;
  }

  load (b64) {
    this.loadMorphAsBytes(b64);
  }

  loadMorphAsBytes(b64) {
    // TODO get rid of encoding.
    let bString = atob(b64);
    let bytes = new Uint8Array(bString.length);
    for (let i = 0; i < bString.length; i++) {
      bytes[i] = bString.charCodeAt(i);
    }
    let reader = new FileReader();
    reader.onloadend = () => this.renderOnScene(reader.result)
    reader.readAsArrayBuffer(new Blob([bytes]));
  }

  renderOnScene (results) {
    let points = this.points = convertMorphoIntoPointsDictionary(results);
    acceptableTypes.forEach(type => {
      let pointsByType = points.filter(point => point.type === type);
      this.createDendriteOrAxon(pointsByType, type);
      if (pointsByType.length > 0){
        this.morphTypes.push(type);
      }
    });
  }

  createDendriteOrAxon (points, type) {
    const geo = new THREE.BufferGeometry();
    points.forEach(point => {
      let parentPointID = point.pid;
      let parentPoint = this.points[parentPointID];
      if (!parentPoint) { return; }
      // do not display connection to soma
      if (parentPoint.type == neuronPartType.SOMA) { return; }
      this.addVertices(point, parentPoint)
    });
    const vArray = new Float32Array(this.vertices.length);
    vArray.set(this.vertices);

    const iArray = new Uint32Array(this.indices.length);
    iArray.set(this.indices);

    const indicesB = new THREE.BufferAttribute(iArray, 1);
    const verticesB = new THREE.BufferAttribute(vArray, 3);
    geo.setIndex(indicesB);
    geo.addAttribute("position", verticesB);
    geo.computeVertexNormals();
    console.log("TYPE: ", type);
    let mat = new THREE.MeshLambertMaterial({color: 0x000000, side: THREE.DoubleSide})
    let mesh = new THREE.Mesh(geo, mat);
    mesh.type = type;
    this.add(mesh);
  }

  addVertices (point, parentPoint) {
    const startPoint =
      new THREE.Vector3(
        parentPoint.x, parentPoint.y, parentPoint.z
      )
    const endPoint =
      new THREE.Vector3(
        point.x, point.y, point.z
      )
    const startRadius = parentPoint.r;
    const endRadius = point.r;
    this.updateBoundingBox(endPoint);

    const zAxis = new THREE.Vector3(0, 0, 1);
    const localZAxis = new THREE.Vector3(
      endPoint.x - startPoint.x,
      endPoint.y - startPoint.y,
      endPoint.z - startPoint.z
    );
    let q = new THREE.Quaternion();
    let t = new THREE.Vector3().crossVectors(zAxis, localZAxis);
    q.x = t.x;
    q.y = t.y;
    q.z = t.z;
    q.w = Math.sqrt((zAxis.lengthSq() * localZAxis.lengthSq())) + zAxis.dot(localZAxis);
    q.normalize();
    this.addBase(startPoint, q, startRadius);
    this.addBase(endPoint, q, endRadius);
    this.addTriangles();
  }

  addBase (center, q, radius) {
    for (let n = 0 ; n < this.nbVerticesBase; n++){
      let phi = (n * Math.PI * 2) / this.nbVerticesBase;
      let x = Math.cos(phi) * radius;
      let y = Math.sin(phi) * radius;
      let v = new THREE.Vector3(x, y, 0);
      v.applyQuaternion(q);
      v.add(center);

      this.vertices.push(v);
    }
  }

  addTriangles() {
    let nbVerticesBase = this.nbVerticesBase;
    let startIdx = this.vertices.length - 2 * nbVerticesBase;

    //build 2 triangles that compose the face of the rectangle made by
    //2 vertices of the base of the cylinder (from startIdx) baseA and baseB
    //2 vertices of the top of the cylinder (from end_idx) topA and topB
    for (let n = 0; n < nbVerticesBase; n++){
      let baseA = startIdx + (n) % nbVerticesBase;
      let baseB = startIdx + (n + 1) % nbVerticesBase;
      let topA = startIdx + nbVerticesBase + (n) % nbVerticesBase;
      let topB = startIdx + nbVerticesBase + (n + 1) % nbVerticesBase;
      //triangle 1
      this.indices.push(topA, baseB, baseA);
      //triangle 2
      this.indices.push(baseB, topA, topB);
    }
  }

  // TODO
  updateBoundingBox(point) {

  }

  /**
   * Render function
   * @return {void}
   */
  render() {
    // this.stuff.update(this.clock.time)
  }
}

export default Morphology;

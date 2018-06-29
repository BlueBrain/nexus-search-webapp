var THREE = require('three');
var TrackballControls = require('three-trackballcontrols');
var TWEEN = require('@tweenjs/tween.js');
var _ = require('underscore');

  var FOV = 70;
  var tanFOV = Math.tan(FOV * Math.PI / (2 * 180));
  var NEAR = 0.1;
  var FAR = 50000;

  var PLAN_YZ = 1;
  var PLAN_XZ = 2;
  var PLAN_XY = 3;


  //   this.addControls = function() {
  //     this.controls = new TrackballControls(this.camera, this.renderer.domElement);
  //     this.controls.rotateSpeed = 2.0;
  //     this.controls.zoomSpeed = 1.2;
  //     this.controls.panSpeed = 0.8;
  //     this.controls.addEventListener('change', this.render);
  //   };

  //   this.getPointData = function(data) {
  //     this.pointData = data;
  //   };

    // this.addButtons = function() {
    //   var bdiv = $('<div class=\'morphtoolbar\' style=\'height:0px; display:block; position:absolute; top:0px; left: 0px;\'></div>');

    //   _.forEach({'XY': PLAN_XY, 'XZ': PLAN_XZ, 'YZ': PLAN_YZ}, function(plan, key) {
    //     var button = $('<a href=\'#\' alt=\'Align with ' + key + ' axis\' class=\'myButton ' + key + 'Button\'></a>').click(function() {
    //       this.computeInitialCameraPosition(plan);
    //       return false;
    //     });
    //     bdiv.append(button);
    //   });
    //   var this = this;
    //   // var buttonFS = $('<a href=\'#\' alt=\'Switch to fullscreen\' class=\'myButton fsButton\'></a>').click(function() {
    //   //   BigScreen.toggle(this.container);
    //   //   return false;
    //   // });
    //   // bdiv.append(buttonFS);

    //   $('canvas').mousedown(function() {
    //     $(this).addClass('moving');
    //   }).mouseup(function() {
    //     $(this).removeClass('moving');
    //   });
    //   this.container.appendChild(bdiv[0]);
    // };

    // this.computeAspectRatio = function() {
    //   var width = this.container.clientWidth;
    //   var height = this.container.clientHeight;
    //   if (height) { return width / height;}
    //   return 1;
    // };

    // this.render = function() {
    //   this.renderer.render(this.scene, this.camera);

    // };

    // this.animate = function() {
    //   //TODO: check if we can get an instance of tween instead.
    //   TWEEN.update();
    //   if (this.controls){
    //     this.controls.update();
    //   }
    //   requestAnimationFrame(this.animate);
    // };


  //   function sectionPoint(mousePosition){
  //     if (this.raycaster && this.pointData){
  //       this.raycaster.setFromCamera(mousePosition, this.camera);

  //       var intersects = this.raycaster.intersectObjects(this.scene.children);
  //       if (intersects && intersects.length > 0){
  //         var intersectPoint = intersects[0].point;
  //         var ofX = 0;
  //         var ofY = 1;
  //         var ofZ = 2;
  //         var ofR = 3;
  //         var rowLength = 7;
  //         var curPoint = new THREE.Vector3();
  //         var minPoint = new THREE.Vector3();
  //         var minDist = Infinity;
  //         var minRadius = 0;
  //         for (var i = 0; i < this.pointData.length; i += rowLength){
  //           curPoint.set(this.pointData[i + ofX],
  //                        this.pointData[i + ofY],
  //                        this.pointData[i + ofZ]);
  //           var dist = curPoint.distanceTo(intersectPoint);
  //           if (dist < minDist){
  //             minPoint.copy(curPoint);
  //             minDist = dist;
  //             minRadius = this.pointData[i + ofR];
  //           }
  //         }
  //         if (this.sphere){
  //           this.scene.remove(this.sphere);
  //         }
  //         var geometry = new THREE.SphereGeometry(minRadius * 2.0, 10, 10);
  //         var material = new THREE.MeshBasicMaterial({color: 0x808000});
  //         this.sphere = new THREE.Mesh(geometry, material);
  //         this.scene.add(this.sphere);
  //         this.sphere.position.copy(minPoint);
  //         updateLabel(minPoint);
  //         this.render();
  //       }
  //     }

  //   }
  //   function updateLabel(point){
  //     if (this.label === undefined){
  //       var div = $('<div class="positionlabel"></div>');
  //       this.label = $('<span></span');
  //       div.append(this.label);
  //       this.container.appendChild($(div)[0]);
  //     }
  //     var text = '';
  //     ['x', 'y', 'z'].forEach(function(s) {
  //       text = text + ' ' + s + ':' + point[s].toFixed(4).toString();
  //     });
  //     this.label.text(text);
  //   };
  //   this.addListener = function() {
  //     document.addEventListener('mousemove',this.onMouseMove.bind(this),false);
  //     //window.addEventListener('mousewheel',onMouseMove,false);
  //     window.addEventListener('resize',this.onResize,false);
  //   };
  //   this.redraw = function() {
  //     var width = this.container.clientWidth;
  //     var height = this.container.clientHeight;

  //     this.renderer.setSize(width, height);
  //     this.renderer.domElement.style.width = '100%';
  //     this.renderer.domElement.style.height = '100%';
  //     this.camera.aspect = width / height;
  //     this.camera.updateProjectionMatrix();
  //     this.controls.handleResize();
  //     this.render();
  //   };
  //   this.onfsChange = function(event) {
  //     this.redraw();
  //     // TODO: fix selector below.
  //     var button = $('.fsButton');
  //     button.toggleClass('wmButton');
  //     if (button.hasClass('wmButton')) {
  //       button.attr('alt','Exit fullscreen');
  //     } else {
  //       button.attr('alt','Switch to fullscreen');
  //     }
  //   };

  //   this.onResize = function(event) {
  //     this.redraw();
  //   };
  // };


  // };

class MorphologyViewer {
  constructor (inputContainer) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff )
    this.container = inputContainer ;
    this.bbox = {'x': 0, 'y': 0, 'z': 0};
    this.addLights();
  }

  computeAspectRatio () {
    var width = this.container.clientWidth;
    var height = this.container.clientHeight;
    if (height) { return width / height;}
    return 1;
  }

  computeInitialCameraPosition (plan, tweenStartHandler) {
    var initialPosition = this.camera.position;
    var initialUp = this.camera.up;
    var targetPosition, targetUp;
    switch (plan){
    case PLAN_XY:
      targetPosition =  new THREE.Vector3(0, 0, this.bbox.z);
      targetUp = new THREE.Vector3(0, 1, 0);
      break;
    case PLAN_XZ:
      targetPosition =  new THREE.Vector3(0, this.bbox.y, 0);
      targetUp = new THREE.Vector3(1, 0, 0);
      break;
    case PLAN_YZ:
      targetPosition =  new THREE.Vector3(this.bbox.x, 0, 0);
      targetUp = new THREE.Vector3(0, 0, 1);
      break;
    }

    var tweenP = new TWEEN.Tween({t: 0}).to({t: 1},800);
    if (tweenStartHandler) {
        tweenP.onStart(tweenStartHandler);
    }
    tweenP.easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => this.onTweenUpdateP(initialPosition,
          targetPosition,
          initialUp,
          targetUp))
      .start();
  };

  onTweenUpdateP (initialPosition, targetPosition, initialUp, targetUp, shift) {
    function lerp(a, b, t){
      return a + t * (b - a);
    };

    _.forEach(['x', 'y', 'z'], (key, index) => {
      var newPosition = lerp(initialPosition[key], targetPosition[key], shift);
      var newUp = lerp(initialUp[key], targetUp[key], shift);
      this.camera.position.setComponent(index, newPosition);
      this.camera.up.setComponent(index, newUp);
    });
    this.directionalLight.position.copy(this.camera.position);
  }

  onMouseMove (event) {
    this.directionalLight.position.copy(this.camera.position);
    event.preventDefault();
    var mousePosition = new THREE.Vector2();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    sectionPoint(mousePosition);
  }

  render () {
    this.renderer.render(this.scene, this.camera);
  }

  animate () {
    //TODO: check if we can get an instance of tween instead.
    this.cube.rotation.x += 0.1;
		this.cube.rotation.y += 0.1;
    TWEEN.update();
    this.render.bind(this);
    if (this.controls){
      this.controls.update();
    }
    requestAnimationFrame(this.animate.bind(this));
  };

  addLights () {
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
    this.scene.add(this.directionalLight);
  }

  addControls () {
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 2.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.addEventListener('change', this.render.bind(this));
  }

  onRemove () {
    function removeElemChildren(elem){
      while (elem.lastChild) {
        elem.removeChild(elem.lastChild);
      }
    };
    delete this.renderer;
    delete this.camera;
    delete this.controls;
    removeElemChildren(this.container);
    delete this.directionalLight;
    delete this.container;
    delete this.scene;
  }

  onShow () {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0xFFFFFF);
    var height = this.container.clientHeight;
    var width = this.container.clientWidth;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.container.appendChild(this.renderer.domElement);

    var geometry = new THREE.BoxGeometry( 2, 2, 2 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );


    this.camera = new THREE.PerspectiveCamera(FOV,
                                              width / height,
                                              NEAR, FAR);
    this.camera.position.z = 5;
    this.addControls();
    // this.addButtons();
    this.animate();
    // this.addListener();
    this.raycaster = new THREE.Raycaster();
  }

  initialSetup (tweenStartHandler) {
    this.computeInitialCameraPosition(PLAN_XY, tweenStartHandler);
  }

  updateBoundingBox (v) {
    var AR = this.computeAspectRatio();
    var tanAR = tanFOV * AR;

    var axes = [['x', 'y', 'z'], ['z', 'x', 'y'], ['y', 'z', 'x']];
    _.forEach(axes, axe => {
      var cAR = Math.abs(v[axe[1]]) / tanAR;
      var cFOV = Math.abs(v[axe[2]]) / tanFOV;
      this.bbox[axe[0]] = Math.max(this.bbox[axe[0]], v[axe[0]] + Math.max(cFOV, cAR));
    });
  }
}

export default MorphologyViewer
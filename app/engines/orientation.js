$(function () {

  var app = window.app = window.app || {};
  var engines = app.engines = app.engines || {};

  var dummyEvent = true;
  var cameraMatrix;

  var pointTransformGenerator = function(difference) {
    if (difference === 0) {
      return function (deltas) {
        return deltas;
      };
    }
    else if (difference === 90) {
      return function (deltas) {
        return {deltaX: deltas.deltaY, deltaY: -deltas.deltaX};
      };
    }
    else if (difference === -90) {
      return function (deltas) {
        return {deltaX: -deltas.deltaY, deltaY: deltas.deltaX};
      };
    }
    else if (difference === 180) {
      return function (deltas) {
        return {deltaX: -deltas.deltaX, deltaY: -deltas.deltaY};
      };
    }
  }

  Orientation = app.engines.Orientation = function () {
      // only get this one at startup for autocorrecting orientation
      this.startOrientation = window.orientation || 0;

      this.reporter = window;
      this.$reporter = $(window);

      this.initBase();

      this.currentListener = this.initHandler.bind(this);

      if (this.reporter.DeviceOrientationEvent) {
        this.reporter.addEventListener('deviceorientation', this.currentListener);
      } else {
        // let user know they don't have orientation support
      }

      this.reporter.addEventListener("orientationchange", this.rotateHandler.bind(this));
  };
  Orientation.prototype.initBase = function() {
    this.baseOrientation = window.orientation || 0;
    this.transform = pointTransformGenerator(this.baseOrientation);
    this.rotateHandler();
  };
  Orientation.prototype.calibrate = function() {
    this.reporter.removeEventListener('deviceorientation', this.currentListener);
    this.currentListener = this.initHandler.bind(this);
    this.reporter.addEventListener('deviceorientation', this.currentListener);
  };
  Orientation.prototype.initHandler = function(e) {
    if (dummyEvent) {
      // try again, android first fires dummy event
      dummyEvent = false;
      return;
    };
    var cameraEuler = new THREE.Euler(
      THREE.Math.degToRad(e.gamma),
      THREE.Math.degToRad(e.beta),
      THREE.Math.degToRad(e.alpha));
    cameraMatrix = new THREE.Matrix4();
    cameraMatrix.makeRotationFromEuler(cameraEuler);
    cameraMatrix.getInverse(cameraMatrix);

    this.reporter.removeEventListener('deviceorientation', this.currentListener);
    this.currentListener = this.update.bind(this);
    this.reporter.addEventListener('deviceorientation', this.currentListener);
  };
  Orientation.prototype.update = function(e) {
    var calibratedEuler = new THREE.Euler(
      THREE.Math.degToRad(e.gamma),
      THREE.Math.degToRad(e.beta),
      THREE.Math.degToRad(e.alpha));
    calibratedMatrix = new THREE.Matrix4();
    calibratedMatrix.makeRotationFromEuler(calibratedEuler);
    calibratedMatrix.multiplyMatrices(calibratedMatrix, cameraMatrix);

    var finalEuler = new THREE.Euler();
    finalEuler.setFromRotationMatrix(calibratedMatrix);

    // throttle sensitivity
    var deltaX = THREE.Math.radToDeg(finalEuler.x) / 12;
    var deltaY = THREE.Math.radToDeg(finalEuler.y) / 12;

    this.trigger('update', this.transform({deltaX: deltaX, deltaY: deltaY}));
  };
  Orientation.prototype.rotateHandler = function () {
    var $orientationStyle = $('.orientation');
    var orientationChange = this.baseOrientation - window.orientation;
    if (orientationChange === 0) {
      $orientationStyle.html("");
    } else {
      $orientationStyle.html([
        ".rotate-with-screen{",
          "-webkit-transform:rotate(",orientationChange,"deg);",
          "transform:rotate(",orientationChange,"deg);",
        "}",
      ].join(""));
    }
  };

  _.extend(Orientation.prototype, Backbone.Events);

});

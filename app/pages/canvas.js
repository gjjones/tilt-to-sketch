$(function () {

  var app = window.app = window.app || {};
  var pages = window.app.pages = window.app.pages || {};


  app.pages.canvas = Backbone.View.extend({

    tagName: "div",

    className: "page page--canvas Center-Container",

    events: {
      "click": "spawnModalMenu",
    },

    initialize: function () {
      this.pen = {x: 0, y: 0};

      this.canvasWidth = screen.width;
      this.canvasHeight = screen.height;
      this.canvasHtoW = this.canvasHeight / this.canvasWidth;
    },

    attachEvents: function () {
      this.boundResizeHandler = this.resizeHandler.bind(this)
      $(window).on("resize", this.boundResizeHandler);

      this.boundOrientationHandler = this.orientationHandler.bind(this)
      app.orientation.bind('update', this.boundOrientationHandler);

      this.boundRotationHandler = this.rotationHandler.bind(this)
      app.orientation.bind('deltaRotation', this.boundRotationHandler);
    },
    removeEvents: function () {
      $(window).off("resize", this.boundResizeHandler);
      app.orientation.unbind('update', this.boundOrientationHandler);
      app.orientation.unbind('deltaRotation', this.boundRotationHandler);
    },

    resizeHandler: function () {
      var screenHtoW = window.innerHeight / window.innerWidth;

      if (this.canvasHtoW > screenHtoW) {
        this.$canvas.css('height', window.innerHeight + 'px');
        this.$canvas.css('width', (window.innerHeight / this.canvasHtoW) + 'px');
      }
      else {
        this.$canvas.css('height', (window.innerWidth * this.canvasHtoW) + 'px');
        this.$canvas.css('width', window.innerWidth + 'px');
      }
    },

    orientationHandler: function (e) {
      if (!app.paused)
        this.addPoint(-e.deltaX, -e.deltaY);
    },

    rotationHandler: function (e) {
      this.pen = pointRotate(e.deltaRotation, this.pen, this.canvasWidth, this.canvasHeight);

      this.$canvas.rotate(e.deltaRotation)

      this.canvasWidth = this.$canvas.attr('width');
      this.canvasHeight = this.$canvas.attr('height');
      this.canvasHtoW = this.canvasHeight / this.canvasWidth;
    },

    render: function() {
      var source = $("#canvas-template").html();
      var template = Handlebars.compile(source);
      this.$el.html(template);

      this.$canvas = this.$el.find('canvas');
      this.$canvas.attr('width', screen.width);
      this.$canvas.attr('height', screen.height);
      this.resizeHandler();

      var canvasWidth = parseInt(this.$canvas.attr('width'));
      var canvasHeight = parseInt(this.$canvas.attr('height'));
      this.ctx = this.$canvas[0].getContext('2d');
      this.ctx.fillStyle="white";
      this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      this.pen.x = this.$canvas.width() / 2;
      this.pen.y = this.$canvas.height() / 2;

      return this;
    },

    penBoundsLimiter: function () {
      if (this.pen.x > this.$canvas.attr('width')) {
        this.pen.x = this.$canvas.attr('width');
      } else if (this.pen.x < 0) {
        this.pen.x = 0;
      }
      if (this.pen.y > this.$canvas.attr('height')) {
        this.pen.y = this.$canvas.attr('height');
      } else if (this.pen.y < 0) {
        this.pen.y = 0;
      }
    },
    addPoint: function (deltaX, deltaY) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.pen.x, this.pen.y);
      this.pen.x -= deltaX;
      this.pen.y -= deltaY;
      this.penBoundsLimiter();
      this.ctx.lineTo(this.pen.x, this.pen.y);
      this.ctx.stroke();
    },
    saveImage: function () {
      var $link = $('<a></a>');
      $link.attr('download', 'test.png');
      $link.attr('href', this.$canvas[0].toDataURL('image/png'));
      $link[0].click();
    },
    spawnModalMenu: function () {
      var $overlay = $('<div class="overlay"/>');
      var $popup = $('<div class="popup Absolute-Center is-Fixed"/>');
      var $cancel = $('<span class="button cancel">Back to Drawing!</span>');
      var $dropboxSave = $(generateSaveButton());
      var $clear = $('<span class="button clear">Clear</span>');

      $popup.append($cancel);
      $popup.append($dropboxSave);
      $popup.append($clear);
      $overlay.append($popup);

      app.paused = true;

      function returnToDrawing () {
        app.orientation.calibrate();
        app.paused = false;
        $overlay.remove();
      }
      $cancel.on('click', function (e) {
        e.stopPropagation();
        returnToDrawing();
      }.bind(this));
      $clear.on('click', function (e) {
        e.stopPropagation();
        var canvasWidth = parseInt(this.$canvas.attr('width'));
        var canvasHeight = parseInt(this.$canvas.attr('height'));
        this.ctx.fillStyle="white";
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        returnToDrawing();
      }.bind(this));
      $('body').append($overlay);
    },

    enter: function () {
      this.render();
      this.attachEvents();
      app.orientation.calibrate();
    },
    exit: function () {
      this.removeEvents();
      this.remove();
    }
  });

  function pointRotate (difference, point, width, height) {
    if (difference === 0) {
      return point;
    }
    else if (difference === 90) {
      return {x: height - point.y, y: point.x};
    }
    else if (difference === -90) {
      return {x: point.y, y: width - point.x};
    }
    else if (difference === 180) {
      return {x: width - point.x, y: height - point.y};
    }
  }

  function generateSaveButton () {
    var canvasURI = $('.drawing-surface')[0].toDataURL(),
      now = new Date(),
      fileName = [
        'sketch ',
        now.toLocaleTimeString(),
        ' ',
        now.toLocaleDateString(),
        '.png'
      ].join('');
    var button = Dropbox.createSaveButton(canvasURI, fileName);
    return button;
  }

});

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
    },

    attachEvents: function () {
      this.boundResizeHandler = this.resizeHandler.bind(this)
      $(window).on("resize", this.boundResizeHandler);

      this.boundOrientationHandler = this.orientationHandler.bind(this)
      app.orientation.bind('update', this.boundOrientationHandler);
    },
    removeEvents: function () {
      $(window).off("resize", this.boundResizeHandler);
      app.orientation.unbind('update', this.boundOrientationHandler);
    },

    resizeHandler: function (e) {
      this.$el.height($(window).height());
      this.$el.width($(window).width());
    },

    orientationHandler: function (e) {
      if (!app.paused)
        this.addPoint(-e.deltaX, -e.deltaY);
    },

    render: function() {
      var source = $("#canvas-template").html();
      var template = Handlebars.compile(source);
      this.$el.html(template);


      this.$el.height($(window).height());
      this.$el.width($(window).width());

      this.$canvas = this.$el.find('canvas');
      this.$canvas.width(Math.round(this.$el.width() * 0.75));
      this.$canvas.height(Math.round(this.$el.height() * 0.85));
      this.$canvas.attr('width', this.$canvas.css('width'));
      this.$canvas.attr('height', this.$canvas.css('height'));

      var canvasWidth = this.$canvas.css('width').match(/\d+/)[0]|0;
      var canvasHeight = this.$canvas.css('height').match(/\d+/)[0]|0;
      this.ctx = this.$canvas[0].getContext('2d');
      this.ctx.fillStyle="white";
      this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      this.pen.x = this.$canvas.width() / 2;
      this.pen.y = this.$canvas.height() / 2;
      this.ctx.moveTo(this.pen.x, this.pen.y);

      return this;
    },

    penBoundsLimiter: function () {
      if (this.pen.x > this.$canvas.width()) {
        this.pen.x = this.$canvas.width();
      } else if (this.pen.x < 0) {
        this.pen.x = 0;
      }
      if (this.pen.y > this.$canvas.height()) {
        this.pen.y = this.$canvas.height();
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
        var cssWidth = this.$canvas.css('width').match(/\d+/)[0];
        var cssHeight = this.$canvas.css('height').match(/\d+/)[0];
        var canvasWidth = cssWidth|0;
        var canvasHeight = cssHeight|0;
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

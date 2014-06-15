$(function () {

  window.app = window.app || {};
  window.app.pages = window.app.pages || {};

  var app = window.app;

  app.router = Backbone.Router.extend({
    routes: {
      '': 'canvas'
    },

    currentPage: undefined,
    initialize: function (page) {

    },
    menu: function () {
      this.swapTo('menu');
    },
    canvas: function () {
      this.swapTo('canvas');
    },
    swapTo: function (page) {
      if (this.currentPage) {
        this.currentPage.exit();
      }
      app.orientation.initBase();
      this.currentPage = new app.pages[page.toLowerCase()]();
      $('body').append(this.currentPage.$el);
      this.currentPage.enter();
    }
  });

});

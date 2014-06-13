$(function () {

  window.app = window.app || {};
  window.app.pages = window.app.pages || {};

  var app = window.app;

  app.pages.menu = Backbone.View.extend({

    tagName: 'div',

    className: 'page page--menu',

    events: {
      'click .menu__item--canvas': 'switchToCanvas',
    },

    render: function() {
      var source = $('#menu-template').html();
      var template = Handlebars.compile(source);
      this.$el.html(template);
      return this;
    },

    switchToCanvas: function () {
      window.router.navigate('canvas', {trigger: true});
    },

    enter: function () {
      this.render();
    },
    exit: function () {
      this.remove();
    }
  });

});

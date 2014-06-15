$(function () {

  $('body').width(window.innerWidth);
  $('body').height(window.innerHeight);
  window.addEventListener("resize", function() {
    $('body').width(window.innerWidth);
    $('body').height(window.innerHeight);
  });

  window.app.orientation = new app.engines.Orientation();
  window.router = new app.router();
  Backbone.history.start();
  window.router.navigate(Backbone.history.fragment, {trigger: true});
});

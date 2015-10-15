$( document ).ready(function() {
  $('.ui.dropdown').dropdown();

  $('.annotation pre').addClass('ui message');

  $('#menu-button').click(function() {
    $('.ui.sidebar').sidebar('toggle');
  });
});

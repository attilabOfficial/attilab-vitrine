
/**
*
*   User interactions
*
**/

/**
*
*  Triggered each time a user is connected
*  --> displays menu
*
*/

function connected() {

  $('main').css('opacity', 1);

  setTimeout(function() {
    $('main .grid .column').each(function() {
      $(this).transition('scale');
    });
  }, 150);

}

/**
*
*  Triggered each time a user is disconnected
*  --> shows the loading screen
*
*/

function disconnected() {

  // No need to redirect if we are already on the home page
  if(document.location.href.split('/').pop() == 'index.html') {

    $('main').css('opacity', 0);

    $('main .grid .column').each(function() {
      $(this).transition('scale');
    });

  } else document.location.href = 'index.html';

}

/**
*
*  Triggered by the client
*  --> goes back to the last page (actually, the homepage)
*
*/

function back() {
  return goTo('index.html')
}

/**
*
*  Triggered by the client
*  --> goes to the specified page
*
*/

function goTo(dest) {

  if($('[aria-href="' + dest + '"]').length == 1) {

    $('[aria-href="' + dest + '"]').first().trigger('click');
    setTimeout(validate, 300);

  } else document.location.href = dest;

}

/**
*
*   Listens to keyboard events
*
*/

$(window).keydown(function(event) {

  // On récupère le code de la touche
  var e = event || window.event;
  var key = e.which || e.keyCode;

  switch(key) {

    case 38 : case 122 : case 119 : case 90 : case 87 : // Flèche haut, z, w, Z, W
      moveUp();
      break;

    case 40 : case 115 : case 83 : // Flèche bas, s, S
      moveDown();
      break;

    case 37 : case 113 : case 97 : case 81 : case 65 : // Flèche gauche, q, a, Q, A
      moveLeft();
      break;

    case 39 : case 100 : case 68 : // Flèche droite, d, D
      moveRight();
      break;

    case 13:
      validate();
      break;

    case 27:
      document.location.href = 'index.html';
      break;

    default:
      return true;

  }

  return false;

});

/**
*
*   Runtime
*
*/

$(document).ready(function() {

  // Connect to the server
  WebSocketStart();

});

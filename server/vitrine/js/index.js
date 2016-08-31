/**
*
*   Index (menu)
*
**/

/**
*
*   Moves the cursor rightward
*
*/

function moveRight() {

  // only if we are not at the end of a row
  if((parseInt($('.active').attr('aria-id')) % NB_COL) != 0) {

    if($('.active').length == 0) {
      $('main .grid>.column:first-of-type').trigger('click');
    } else {
      $('.active').next().trigger('click');
    }

  }

}

/**
*
*  Moves the cursor leftward
*
*/

function moveLeft() {

  // only if we are not at the beginning of a row
  if((parseInt($('.active').attr('aria-id')) % NB_COL) != 1) {

    if($('.active').length == 0) {
      $('main .grid>.column:first-of-type').trigger('click');
    } else {

      element = $('.active');
      element = element.prev();

      element.trigger('click');

    }

  }

}

/**
*
*  Moves the cursor downward
*
*/

function moveDown() {

  // only if we are not on the last row
  if(parseInt(parseInt($('.active').attr('aria-id')) / NB_COL) != parseInt($('main .grid .column').length / NB_COL)) {

    if($('.active').length == 0) {
      $('main .grid>.column:first-of-type').trigger('click');
    } else {

      var element = $('.active')
      for(var i = 0; i < NB_COL; i++) element = element.next();

      element.trigger('click');

    }

  }

}

/**
*
*  Moves the cursor upward
*
*/

function moveUp() {

  // only if we are not on the first row
  if((parseInt($('.active').attr('aria-id')) / NB_COL) > 1) {

    if($('.active').length == 0) {
      $('main .grid>.column:first-of-type').trigger('click');
    } else {

      var element = $('.active');
      for(var i = NB_COL; i > 0; i--) element = element.prev();

      element.trigger('click');

    }

  }

}

/**
*
*  Validate the choice
*
*/

function validate() {

  if($('main .grid>.column.active').length == 0) return;

  $('main .grid>.column:not(.active)').transition('vertical flip', 300, function() {

    $('main .grid>.column:not(.active)').animate({
      height:0
    }, 300);

  });

  setTimeout(function() {

    $('.active>*:first-child').css({
      'position':'fixed',
      'top' : $('.active').position().top,
      'left' : $('.active').position().left
    });

    $('.active>*:first-child').animate({
      'top' : 0,
      'left' : 0,
      'width' : $(window).width(),
      'height' : $(window).height()
    }, 300);

    $('main header').css({
      'position':'fixed',
      'top' : $('.active').position().top,
      'left' : $('.active').position().left
    });

    $('main header').animate({
      'top' : 16,
      'left' : 16
    }, 300);

    setTimeout(function() {
      document.location.href = $('.active').attr('aria-href');
    }, 300);

  }, 600);

}

/**
*
*   Trigger actions according to movement detection
*
**/

var motion_detected = false, motion_img = null, motion_index = 0, motion_direction = 1;

function motion(detected) {

  if(detected && !motion_detected) {

    if(motion_img == null) return;
    animation = setInterval(function() {

      if(motion_index == 0) motion_direction = 1;
      else if(motion_index == motion_img.length - 1) motion_direction = -1;

      motion_img[motion_index].style = '';
      motion_index = motion_index + motion_direction;
      motion_img[motion_index].style = 'display:inline;';

    }, 42);

    motion_detected = true;

  } else if(!detected && motion_detected) {

    motion_img[motion_index].style = '';
    motion_index = 0;
    clearInterval(animation);

    motion_detected = false;

  }

}

/** Runtime */

$(document).ready(function() {

  // Hide the tiles so they can appear beautifully then
  $('main .grid .column').each(function() {
    $(this).transition('scale', 0);
  });

  // Turns each .square into a .. square !
  $('.tuile.square').each(function() {
    $(this).height($(this).width());
  });

  // Handles click event for each tile
  $('main .grid>.column').click(function() {

    if($(this).hasClass('active')) validate();
    else {

      $('.active').removeClass('active');
      $(this).addClass('active');

    }

  });

  motion_img = $('#motion img');
  $('#motion img').css('display', 'inline');
  $('#motion img').css('display', 'none');

})

/**
*
*   Allows to keep the good proportions for each .square
*
*/

$(window).resize(function() {

  $('.tuile.square').each(function(tuile) {
    $(this).height($(this).width());
  });

});

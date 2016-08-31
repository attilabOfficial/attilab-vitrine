/**
*
*   Domotique
*
**/

/**
*
*   Validate : on/off on selected item
*
**/

function validate() {

  if($('.active').hasClass('on')) {

    $('.active').removeClass('on');
    WebSocketSend(EVENTS.DOMOTIQUE_OFF + ' ' + $('.active').attr('aria-id'));

  } else {

    $('.active').addClass('on');
    WebSocketSend(EVENTS.DOMOTIQUE_ON + ' ' + $('.active').attr('aria-id'));

  }

}

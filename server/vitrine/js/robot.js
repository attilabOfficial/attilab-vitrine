/**
*
*   Robot
*
*/

var animations = [
  EVENTS.ROBOT_LONG_JUMP,
  EVENTS.ROBOT_HIGH_JUMP,
  EVENTS.ROBOT_SPIN,
  EVENTS.ROBOT_TAP,
  EVENTS.ROBOT_SLOW_SHAKE,
  EVENTS.ROBOT_METRONOME,
  EVENTS.ROBOT_ONDULATION,
  EVENTS.ROBOT_SPIN_JUMP,
  EVENTS.ROBOT_SPIN_TO_POSTURE,
  EVENTS.ROBOT_SPIRAL,
  EVENTS.ROBOT_SLALOM,
  EVENTS.ROBOT_STANDING,
  EVENTS.ROBOT_JUMPER,
  EVENTS.ROBOT_KICKER
];

var current_animation = animations[0];

/**
*
*   Displays Video once connected
*
*/

function connected() {

  WebSocketSend(EVENTS.ROBOT_START);
  videoStream = new WebSocket("ws://" + window.location.hostname.split(':')[0] + ":9999/video");

  videoStream.onopen = function() {
    $('#loader').fadeOut();
  }

  videoStream.onerror = function() {
    $('#loader').fadeIn();
    setTimeout(connected, 1000);
  };

  videoStream.onclose = function(){
    $('#loader').fadeIn();
    setTimeout(connected, 1000);
  };

  videoStream.onmessage = function (e) {
    $('#stream>img').attr('src',  'data:image/jpg;base64,' + e.data);
  }

}

/**
*
*   Moves the robot rightward
*
*/

function moveRight() {
  WebSocketSend(EVENTS.ROBOT_RIGHT);
}

/**
*
*  Moves the robot leftward
*
*/

function moveLeft() {
  WebSocketSend(EVENTS.ROBOT_LEFT);
}

/**
*
*  Moves the robot backward
*
*/

function moveDown() {
  WebSocketSend(EVENTS.ROBOT_BACKWARD);
}

/**
*
*  Moves the robot forward
*
*/

function moveUp() {
  WebSocketSend(EVENTS.ROBOT_FORWARD);
}

$(window).on('keyup', function() {
  WebSocketSend(EVENTS.ROBOT_STOP);
})

/**
*
*   Plays current animation
*
*/

function validate() {
  WebSocketSend(current_animation);
}

/**
*
*   Change animation
*
*/

function option() {

  current_animation = animations[(animations.indexOf(current_animation)+1)% animations.length];
  switch(current_animation) {

    case EVENTS.ROBOT_LONG_JUMP:
      $('#animation h2').html('Long jump');
      $('#animation img').attr('src', 'img/robot/anim_long_jump.png');
      break;

    case EVENTS.ROBOT_HIGH_JUMP:
      $('#animation h2').html('High jump');
      $('#animation img').attr('src', 'img/robot/anim_high_jump.png');
      break;

    case EVENTS.ROBOT_SPIN:
      $('#animation h2').html('Spin');
      $('#animation img').attr('src', 'img/robot/anim_spin.png');
      break;

    case EVENTS.ROBOT_TAP:
      $('#animation h2').html('Tap');
      $('#animation img').attr('src', 'img/robot/anim_tap.png');
      break;

    case EVENTS.ROBOT_SLOW_SHAKE:
      $('#animation h2').html('Slow shake');
      $('#animation img').attr('src', 'img/robot/anim_slow_shake.png');
      break;

    case EVENTS.ROBOT_METRONOME:
      $('#animation h2').html('Metronome');
      $('#animation img').attr('src', 'img/robot/anim_metronome.png');
      break;

    case EVENTS.ROBOT_ONDULATION:
      $('#animation h2').html('Ondulation');
      $('#animation img').attr('src', 'img/robot/anim_ondulation.png');
      break;

    case EVENTS.ROBOT_SPIN_JUMP:
      $('#animation h2').html('Spin & Jump');
      $('#animation img').attr('src', 'img/robot/anim_spin_jump.png');
      break;

    case EVENTS.ROBOT_SPIN_TO_POSTURE:
      $('#animation h2').html('Spin to posture');
      $('#animation img').attr('src', 'img/robot/anim_spin_to_posture.png');
      break;

    case EVENTS.ROBOT_SPIRAL:
      $('#animation h2').html('Spiral');
      $('#animation img').attr('src', 'img/robot/anim_spiral.png');
      break;

    case EVENTS.ROBOT_SLALOM:
      $('#animation h2').html('Slalom');
      $('#animation img').attr('src', 'img/robot/anim_slalom.png');
      break;

    case EVENTS.ROBOT_STANDING:
      $('#animation h2').html('Standing');
      $('#animation img').attr('src', 'img/robot/posture_standing.png');
      break;

    case EVENTS.ROBOT_JUMPER:
      $('#animation h2').html('Jumper');
      $('#animation img').attr('src', 'img/robot/posture_jumper.png');
      break;

    case EVENTS.ROBOT_KICKER:
      $('#animation h2').html('Kicker');
      $('#animation img').attr('src', 'img/robot/posture_kicker.png');
      break;

  }

  $('#animation').css('opacity', 1);
  setTimeout(function() {
    $('#animation').css('opacity', 0);
  }, 600);

}

/**
*
*   Handle battery level
*
*/

function handle(evt) {

  if(evt.startsWith(EVENTS.ROBOT_BATTERY)) {

    battery = parseInt(evt.split(' ')[1]);

    if(battery >= 90) battery = '4';
    else if(battery >= 65) battery = '3';
    else if(battery >= 40) battery = '2';
    else if(battery >= 10) battery = '1';
    else battery = '0';

    $('#battery').attr('src', 'img/robot/battery-' + battery + '.png');
    $('#battery').attr('class', 'battery-' + battery);

  } else return;

}

/**
*
*   Runtime
*
*/

$(document).ready(function() {

  /*$('#animation').modal({

    context: '#stream',
    onVisible: function() {

      setTimeout(function() {
        $('#animation').modal('hide');
      }, 300);

    }

  });*/

})

/**
*
*   Robot : control Parrot Jumping Sumo
*
*/

var sumo = require('node-sumo');
var ws = require('ws');

var robot = sumo.createClient();

module.exports.battery = 0;

module.exports.start = function() {

  var videoStreamSocket;
  var videoStream;

  robot.connect(function() {

    console.log('[CONN] Jumping Sumo');
    videoStreamSocket = new ws.Server({ port: 9999 });

    videoStreamSocket.on('connection', function(ws) {

      console.log('[CONN] Video Stream');
      videoStream = ws;

    });

    videoStreamSocket.on('close', function() {

      console.log('[DECO] Video Stream')
      delete webSocket;

    });

  });

  robot.on('battery', function(battery) {

    console.log('[SUMO] battery : ' + battery + '%');
    module.exports.battery = battery;

  });

  robot.getVideoStream().on('data', function(data) {

    if(videoStream != undefined && videoStream.readyState == videoStream.OPEN)
      return videoStream.send(new Buffer(data).toString('base64'));

  });

}

/**
*
*   Movements
*
*/

module.exports.forward = function(speed) {
  robot.forward(speed || 50);
}

module.exports.left = function(speed) {
  robot.left(speed || 50);
}

module.exports.right = function(speed) {
  robot.right(speed || 50);
}

module.exports.backward = function(speed) {
  robot.backward(speed || 50);
}

module.exports.stop = function() {

  robot.forward(0);
  robot.left(0);
  robot.right(0);
  robot.backward(0);

}

/**
*
*   Animations
*
**/

module.exports.animations = {

  longJump: function() {
    robot.animationsLongJump();
  },
  highJump: function() {
    robot.animationsHighJump();
  },
  spin: function() {
    robot.animationsSpin();
  },
  tap: function() {
    robot.animationsTap();
  },
  slowShake: function() {
    robot.animationsSlowShake();
  },
  metronome: function() {
    robot.animationsMetronome();
  },
  ondulation: function() {
    robot.animationsOndulation();
  },
  spinJump: function() {
    robot.animationsSpinJump();
  },
  spinToPosture: function() {
    robot.animationsSpinToPosture();
  },
  spiral: function() {
    robot.animationsSpiral();
  },
  slalom: function() {
    robot.animationsSlalom();
  }

};

/**
*
*   Postures
*
*/

module.exports.postures = {

  standing: function() {
    robot.postureStanding();
  },
  jumper: function() {
    robot.postureJumper();
  },
  kicker: function() {
    robot.postureKicker();
  }

}

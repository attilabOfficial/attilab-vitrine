
require('./vitrine/js/constants');

var ws = require('ws');
var util = require('util');
var robot = require('./robot.js');
var exec = require('child_process').exec;
var fs = require('fs');
var string = require('string');
var Client = require('ssh2').Client;
var domotique = {
  on: function(outlet) {

    // ./outlets/send <wiringPI pin> <controler_code> <outlet_code> <on|off>
    console.log('[EXEC] ./outlets/send 8 42 ' + outlet + ' on');

    exec('./outlets/send 8 42 ' + outlet + ' on', function(error, stdout, stderr) {
      if(stdout) console.log('[INFO] ' + string(stdout).trim());
      if(stderr) console.log('[WARN] ' + string(stderr).trim());
    });

  }, off: function(outlet) {

    // ./outlets/send <wiringPI pin> <controler_code> <outlet_code> <on|off>
    console.log('[EXEC] ./outlets/send 8 42 ' + outlet + ' off');

    exec('./outlets/send 8 42 ' + outlet + ' off', function(error, stdout, stderr) {
      if(stdout) console.log('[INFO] ' + string(stdout).trim());
      if(stderr) console.log('[WARN] ' + string(stderr).trim());
    });

  }
}

var client_connected = false, vitrine_connected = false, robot_started = false, previous_mvmt = false;

/**
*
*   Handle uncaughtException
*
**/

/*process.on('uncaughtException', function(e) {
  console.log('[WARN] ' + e);
});*/

/**
*
*   Forwards received data to the websocket
*
**/

function WebSocketForward(msg, quiet) {

  // Only send the data if the `Vitrine` is connnected
  if(webSocket != undefined && webSocket.readyState == webSocket.OPEN) {

    if(quiet) console.log('[SEND] ' + msg);
    return webSocket.send(msg.toString());

  } else return false;

}

/**
*
*  Websocket (to send data to the static web page)
*
**/

var webSocketServer = new ws.Server({ port: 9998 }),
    webSocket;

webSocketServer.on('connection', function(socket) {

	if(!vitrine_connected) {

    console.log('[CONN] vitrine');
    vitrine_connected = true;

  }

  webSocket = socket;

  // Check if movement has been detected
  var motionInterval = setInterval(function() {

    // deprecated but fs.access doesn't work
    fs.exists('./motion/motion_detected', function(exists) {

      if(exists) {

        if(!previous_mvmt) console.log('[INFO] Movement detected')

        WebSocketForward(EVENTS.MOTION_YES, !previous_mvmt);
        previous_mvmt = true;

      } else {

        if(previous_mvmt) console.log('[INFO] No movement')

        WebSocketForward(EVENTS.MOTION_NO, previous_mvmt);
        previous_mvmt = false;

      }

    });

  }, 500);

  webSocket.on('message', function(msg) {

    console.log('[RECV] ' + msg);

    if(msg == EVENTS.CONNECTED) {

      if(client_connected) WebSocketForward(EVENTS.CONNECTED);
      else WebSocketForward(EVENTS.DISCONNECTED);

    } else if(msg == EVENTS.ROBOT_START) {

      if(!robot_started) {

        robot_started = true;
        robot.start();

        setInterval(function() {
          WebSocketForward(EVENTS.ROBOT_BATTERY + ' ' + robot.battery);
        }, 1000);

      }

    } else if(msg == EVENTS.ROBOT_FORWARD) {
      robot.forward();
    } else if(msg == EVENTS.ROBOT_LEFT) {
      robot.left();
    } else if(msg == EVENTS.ROBOT_RIGHT) {
      robot.right();
    } else if(msg == EVENTS.ROBOT_BACKWARD) {
      robot.backward();
    } else if(msg == EVENTS.ROBOT_STOP) {
      robot.stop();
    } else if(msg == EVENTS.ROBOT_LONG_JUMP) {
      robot.animations.longJump();
    } else if(msg == EVENTS.ROBOT_HIGH_JUMP) {
      robot.animations.highJump();
    } else if(msg == EVENTS.ROBOT_SPIN) {
      robot.animations.spin();
    } else if(msg == EVENTS.ROBOT_TAP) {
      robot.animations.tap();
    } else if(msg == EVENTS.ROBOT_SLOW_SHAKE) {
      robot.animations.slowShake();
    } else if(msg == EVENTS.ROBOT_METRONOME) {
      robot.animations.metronome();
    } else if(msg == EVENTS.ROBOT_ONDULATION) {
      robot.animations.ondulation();
    } else if(msg == EVENTS.ROBOT_SPIN_JUMP) {
      robot.animations.spinJump();
    } else if(msg == EVENTS.ROBOT_SPIN_TO_POSTURE) {
      robot.animations.spinToPosture();
    } else if(msg == EVENTS.ROBOT_SPIRAL) {
      robot.animations.spiral();
    } else if(msg == EVENTS.ROBOT_SLALOM) {
      robot.animations.slalom();
    } else if(msg == EVENTS.ROBOT_STANDING) {
      robot.postures.standing();
    } else if(msg == EVENTS.ROBOT_JUMPER) {
      robot.postures.jumper();
    } else if(msg == EVENTS.ROBOT_KICKER) {
      robot.postures.kicker();
    } else if(string(msg).startsWith(EVENTS.DOMOTIQUE_ON)) {
      domotique.on(msg.split(' ')[1]);
    } else if(string(msg).startsWith(EVENTS.DOMOTIQUE_OFF)) {
      domotique.off(msg.split(' ')[1]);
    } else if(msg == EVENTS.CAMERA_PHOTO) {

      var conn = new Client();
      conn.on('ready', function() {

        console.log('[INFO] SSH ready');
        conn.sftp(function(err, stream) {

          if(err) console.log('[WARN] ' + err);
          else {

            localPath = '/tmp/'
            remotePath = '/home/web/keosu/attilab/'
            filename = new Date().getTime();

            console.log('[EXEC] wget -O ' + localPath + filename + '.jpg http://127.0.0.1:4444/stream/snapshot.jpeg?delay_s=0');
            exec('wget -O ' + localPath + filename + '.jpg http://127.0.0.1:4444/stream/snapshot.jpeg?delay_s=0', function(error, stdout, stderr) {

              if(stdout) console.log('[INFO] ' + string(stdout).trim());
              if(stderr) console.log('[WARN] ' + string(stderr).trim());

              stream.fastPut(localPath + filename + '.jpg', remotePath + filename + '.jpg', {
                step: function(transferred, chunk, total) {
                  console.log('[INFO] ' + Math.round((transferred/total) * 100) + '% uploaded');
                }
              }, function(err) {

                if(err) console.log('[WARN] ' + err);
                else {

                  console.log('[INFO] upload complete');
                  clientSend(msg + filename);

                }

              });

            });

          }

        });

      }).connect({
        host: '',
        port: 22,
        username: '',
        password: ''
      });

    } else clientSend(msg);

  });

  webSocket.on('close', function() {

    delete webSocket;
    clearInterval(motionInterval);

    if(vitrine_connected) {

      console.log('[DECO] vitrine');
      vitrine_connected = false;

    }

  });

});

/**
*
*   Stream raspberrypi camera
*
**/

console.log('[EXEC] pkill uv4l');
exec('pkill uv4l', function(error, stdout, stderr) {

  if(stdout) console.log('[INFO] ' + string(stdout).trim());
  if(stderr) console.log('[WARN] ' + string(stderr).trim());

  console.log('[EXEC] uv4l -nopreview --auto-video_nr --driver raspicam --encoding mjpeg --width 640 --height 360 --framerate 24 --server-option \'--port=4444\' --server-option \'--max-queued-connections=30\' --server-option \'--max-streams=25\' --server-option \'--max-threads=29\'');
  exec('uv4l -nopreview --auto-video_nr --driver raspicam --encoding mjpeg --width 640 --height 360 --framerate 24 --server-option \'--port=4444\' --server-option \'--max-queued-connections=30\' --server-option \'--max-streams=25\' --server-option \'--max-threads=29\'', function(error, stdout, stderr) {

    if(stdout) console.log('[INFO] ' + string(stdout).trim());
    if(stderr) console.log('[WARN] ' + string(stderr).trim());

  });

});

/**
*
*  Websocket to same-computer tests
*
**/

if(MODE == MODES.TEST) {

  var client;
  var bSocket = new ws.Server({ port: 6666 });
  bSocket.on('connection', function(socket) {

    client = socket;

    if(!client_connected) {

      console.log('[CONN] client');
      WebSocketForward(EVENTS.CONNECTED);
      client_connected = true;

    }

    socket.on('message', WebSocketForward);

    socket.on('close', function() {

      if(client_connected) {

        console.log('[DECO] client');

        WebSocketForward(EVENTS.DISCONNECTED);
        client_connected = false;
        delete client;

      }

    });

  });

  function clientSend(data) {

    // Only send the data if the client is connnected
    if(client != undefined && client.readyState == client.OPEN) {
      return client.send(data.toString());
    } else return false;

  }

}

/**
*
*  Bluetooth (to receive data from the client)
*
*/

if(MODE == MODES.BLUETOOTH) {

  var service;

  var bleno = require('./node_modules/bleno/index'),
      BlenoPrimaryService = bleno.PrimaryService,
      BlenoCharacteristic = bleno.Characteristic,
      BlenoDescriptor = bleno.Descriptor;

  var characteristic = function() {

    characteristic.super_.call(this, {
      uuid: 'fffffffffffffffffffffffffffffff4',
      properties: ['write', 'read', 'notify'],
      value: null
    });

    this._value = new Buffer(0);
    this._updateValueCallback = null;
    this._maxValueSize;

  };

  util.inherits(characteristic, BlenoCharacteristic);

  characteristic.prototype.onReadRequest  = function(offset, callback) {

    console.log('[BTLE] readRequest: value = ' + this._value.toString('hex'));
    callback(this.RESULT_SUCCESS, this._value);

  };

  characteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {

    console.log('[BTLE] writeRequest ' + parseInt("0x" + data.toString("hex")) + ' ' + offset + ' ' + withoutResponse);
    WebSocketForward(parseInt("0x" + data.toString("hex")));

    callback(this.RESULT_SUCCESS);

  };

  characteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {

    console.log('[BTLE] subscribe');
    this._updateValueCallback = updateValueCallback;
    this._maxValueSize = maxValueSize;

  };

  characteristic.prototype.onUnsubscribe = function() {

    console.log('[BTLE] unsubscribe');
    this._updateValueCallback = null;

  };

  function clientSend(data) {

    if(!service.characteristics[0]._updateValueCallback) return;

    service.characteristics[0]._value = data;
    service.characteristics[0]._updateValueCallback(data);

  }

  function SampleService() {

    SampleService.super_.call(this, {
      uuid: 'fffffffffffffffffffffffffffffff0',
      characteristics: [
        new characteristic()
      ]
    });

  }

  util.inherits(SampleService, BlenoPrimaryService);

  /** Linux only events */

  bleno.on('accept', function(clientAddress) {

    if(!client_connected) {

      console.log('[CONN] client');
      WebSocketForward(EVENTS.CONNECTED);
      client_connected = true;

    }

    bleno.updateRssi();

  });

  bleno.on('disconnect', function(clientAddress) {

    if(client_connected) {

      console.log('[DECO] client');

      WebSocketForward(EVENTS.DISCONNECTED);
      client_connected = false;

    }

  });

  /* -- */

  bleno.on('stateChange', function(state) {

    console.log('[BTLE] ' + state + ' : ' + bleno.adress)

    if (state === 'poweredOn') {
      bleno.startAdvertising('test', ['fffffffffffffffffffffffffffffff0']);
    } else {
      bleno.stopAdvertising();
    }

  });

  bleno.on('mtuChange', function(mtu) {
    console.log('[BTLE] mtuChange : ' + mtu);
  });

  bleno.on('advertisingStart', function(error) {

    console.log('[BTLE] advertisingStart : ' + (error ? 'error ' + error : 'success'));

    if (!error) {

      service = new SampleService();

      bleno.setServices([
        service
      ]);

    }

  });

  bleno.on('advertisingStop', function() {
    console.log('[BTLE] advertisingStop');
  });

  bleno.on('servicesSet', function(error) {
    console.log('[BTLE] servicesSet : ' + (error ? 'error ' + error : 'success'));
  });

}

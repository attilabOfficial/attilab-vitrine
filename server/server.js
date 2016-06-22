
require('./vitrine/js/constants');

var util = require('util');
var client_connected = false, vitrine_connected = false;

/**
*
*   Forwards received data to the websocket
*
**/

function WebSocketForward(msg) {

  // Only send the data if the `Vitrine` is connnected
  if(webSocket != undefined && webSocket.readyState == webSocket.OPEN) {

    console.log('[SEND] ' + msg);
    return webSocket.send(msg.toString());

  } else return false;

}

/**
*
*  Websocket (to send data to the static web page)
*
**/

var ws = require('ws');

var webSocketServer = new ws.Server({ port: 9998 }),
    webSocket;

webSocketServer.on('connection', function(ws) {

	if(!vitrine_connected) {

    console.log('[CONN] vitrine');
    vitrine_connected = true;

  }

  webSocket = ws;

  webSocket.on('message', function(msg) {

    console.log('[RECV] ' + msg);

    if(msg == EVENTS.CONNECTED) {

      if(client_connected) WebSocketForward(EVENTS.CONNECTED);
      else WebSocketForward(EVENTS.DISCONNECTED);

    }

  });

  webSocket.on('close', function() {

    delete webSocket;

    if(vitrine_connected) {

      console.log('[DECO] vitrine');
      vitrine_connected = false;

    }

  });

});

/**
*
*  Websocket to same-computer tests
*
**/

if(MODE == MODES.TEST) {

  var bSocket = new ws.Server({ port: 6666 });
  bSocket.on('connection', function(ws) {

    if(!client_connected) {

      console.log('[CONN] client');
      WebSocketForward(EVENTS.CONNECTED);
      client_connected = true;

    }

    ws.on('message', WebSocketForward);

    ws.on('close', function() {

      if(client_connected) {

        console.log('[DECO] client');

        WebSocketForward(EVENTS.DISCONNECTED);
        client_connected = false;

      }

    });

  });

}

/**
*
*  Bluetooth (to receive data from the client)
*
*/

if(MODE == MODES.BLUETOOTH) {

  var bleno = require('./node_modules/bleno/index'),
      BlenoPrimaryService = bleno.PrimaryService,
      BlenoCharacteristic = bleno.Characteristic,
      BlenoDescriptor = bleno.Descriptor;

  var WriteOnlyCharacteristic = function() {

    WriteOnlyCharacteristic.super_.call(this, {
      uuid: 'fffffffffffffffffffffffffffffff4',
      properties: ['write', 'writeWithoutResponse']
    });

  };

  util.inherits(WriteOnlyCharacteristic, BlenoCharacteristic);

  WriteOnlyCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {

    console.log('[BTLE] writeRequest ' + parseInt("0x" + data.toString("hex")) + ' ' + offset + ' ' + withoutResponse);
    WebSocketForward(parseInt("0x" + data.toString("hex")));

    callback(this.RESULT_SUCCESS);

  };

  function SampleService() {

    SampleService.super_.call(this, {
      uuid: 'fffffffffffffffffffffffffffffff0',
      characteristics: [
        new WriteOnlyCharacteristic()
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
      bleno.setServices([
        new SampleService()
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

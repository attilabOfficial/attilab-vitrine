/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
*
*   Communication with the server
*
*/

// Test mode --> Websocket
if(MODE == MODES.TEST) {

  var ws;

  function WebSocketStart() {

    if("WebSocket" in window) {

      // Let us open a web socket
      ws = new WebSocket("ws://127.0.0.1:6666/client");

      ws.onopen = function(){

        // Web Socket is connected
        console.log('connected !');
        $("#loader").fadeOut();

      };

      ws.onerror = function() {
        $("#loader").fadeIn();
        setTimeout(WebSocketStart, 1000);
      }

      ws.onclose = function(){

        // websocket is closed.
        console.log('disconnected !');
        $("#loader").fadeIn();
        setTimeout(WebSocketStart, 1000);

      };

    } else {

      // The browser doesn't support WebSocket
      alert("WebSocket NOT supported by your browser !");

    }

  }

  WebSocketStart();

// Bluetooth
} else if(MODE == MODES.BLUETOOTH) {

  var id = "0";

  var serviceId = "fffffffffffffffffffffffffffffff0";
  var serviceName = "fffffffffffffffffffffffffffffff1";

  var app = {

      // Application Constructor
      initialize: function() {

          this.bindEvents();
          console.log("ble -> initialized");

      },

      // Bind Event Listeners
      //
      // Bind any events that are required on startup. Common events are:
      // 'load', 'deviceready', 'offline', and 'online'.

      bindEvents: function() {
          document.addEventListener('deviceready', this.onDeviceReady, false);
      },

      // deviceready Event Handler
      //
      // The scope of 'this' is the event. In order to call the 'receivedEvent'
      // function, we must explicitly call 'app.receivedEvent(...);'

      onDeviceReady: function() {

          ble.startScan([], function(device) {

            console.log("ble -> scanSuccess : " + JSON.stringify(device));

      			if(device.name == "RASPBERRYPI"  || device.name == "raspberrypi" ){

      			    id = device.id;
      			    ble.connect(device.id, app.connectSuccess, app.connectFailure);

      			}

      		}, function(err) {
            console.log("ble -> scanFailure : " + JSON.stringify(err));
          });

      },

      connectSuccess: function(info){

        console.log("ble -> connectSuccess");
        $("#loader").fadeOut();

        for (var i = 0, len = info.characteristics.length; i < len; i++) {

        	if(info.characteristics[i].characteristic.endsWith("4")){
        		serviceId = info.characteristics[i].service;
        		serviceName = info.characteristics[i].characteristic;
        	}

		    }

      },

      connectFailure: function(error){
        console.log("ble -> connectFailure : " + error);
      }

  };

  app.initialize();

}

/**
*
*   Sends data to the server
*
*/

function send(data) {

  if(MODE == MODES.TEST) {
    ws.send(data);
  } else if(MODE == MODES.BLUETOOH) {

    var data = new Uint8Array(1);
    data[0] = data;

    ble.write(id, serviceId, serviceName, data.buffer, function() {
      console.log("ble -> sendSucess");
    }, function(err) {
      console.log("ble -> sendFailure : " + JSON.stringify(err));
    });

  }

}

/**
*
*   User interaction
*
**/

$(document).ready(function() {

  $('.ui.sidebar').sidebar({
    context: $('.bottom.segment')
  }).sidebar('attach events', 'header.menu .item');

  $('[aria-action]').click(function() {
    send(ACTIONS[$(this).attr('aria-action')]);
  });

});

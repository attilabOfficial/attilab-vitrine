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

if(MODE == MODES.TEST) {

  var ws;

  function WebSocketStart() {

    if("WebSocket" in window) {

      // Let us open a web socket
      ws = new WebSocket("ws://127.0.0.1:6666/client");

      ws.onopen = function(){

        // Web Socket is connected
        console.log('connected !');

      };

      ws.onerror = function() {
        setTimeout(WebSocketStart, 1000);
      }

      ws.onclose = function(){

        // websocket is closed.
        console.log('disconnected !');
        setTimeout(WebSocketStart, 1000);

      };

    } else {

      // The browser doesn't support WebSocket
      alert("WebSocket NOT supported by your browser !");

    }

  }

  WebSocketStart();

} else if(MODE == MODES.BLUETOOTH) {

  var id = "0";

  var serviceId = "fffffffffffffffffffffffffffffff0";
  var serviceName = "fffffffffffffffffffffffffffffff1";

  var app = {

      // Application Constructor
      initialize: function() {

          this.bindEvents();
          console.log("ble -> init");

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

          /*bluetoothle.startScan([], function(device) {

            console.log("ble -> success : " + JSON.stringify(device));

      			if(device.name == "RASPBERRYPI"  || device.name == "raspberrypi" ){

      			    id = device.id;
      			    bluetoothle.connect(device.id, app.connectSuccess, app.connectFailure);

      			}

      		}, failure);*/

          bluetoothle.initialize(function(x) {

            console.log(JSON.stringify(x));

            bluetoothle.startScan(function(device) {
              console.log(JSON.stringify(device));
            }, function(err) {
              console.log(JSON.stringify(err));
            }, {
              "services": [],
              "allowDuplicates": false,
              "scanMode": bluetoothle.SCAN_MODE_LOW_LATENCY,
              "matchMode": bluetoothle.MATCH_MODE_AGGRESSIVE,
              "matchNum": bluetoothle.MATCH_NUM_MAX_ADVERTISEMENT,
              "callbackType": bluetoothle.CALLBACK_TYPE_ALL_MATCHES
            });

          }, {
            "request": true,
            "statusReceiver": true,
            "restoreKey" : "bluetoothleplugin"
          });

      },

      connectSuccess: function(info){

        $("#loader").fadeOut();

          for (var i = 0, len = info.characteristics.length; i < len; i++) {

          	if(info.characteristics[i].characteristic.endsWith("4")){
          		serviceId = info.characteristics[i].service;
          		serviceName = info.characteristics[i].characteristic;
          	}

  		    }

      },

      connectFailure: function(error){
        console.log("ble -> " + error);
      }

  };

  function success(){

    console.log("ble -> success");

  }

  function failure(){

    console.log("ble -> failure");

  }

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

    bluetoothle.write(id, serviceId, serviceName, data.buffer, success, failure);

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

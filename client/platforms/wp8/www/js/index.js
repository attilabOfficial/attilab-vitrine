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

var processing, watermark;

 /**
 *
 *   Transforms an image into a DataUrl
 *
 */

 function toDataUrl(url, callback){
     var xhr = new XMLHttpRequest();
     xhr.responseType = 'blob';
     xhr.onload = function() {
       var reader  = new FileReader();
       reader.onloadend = function () {
           callback(reader.result);
       }
       reader.readAsDataURL(xhr.response);
     };
     xhr.onerror = function(e) {
       console.log(e);
     };
     xhr.open('GET', url);
     xhr.send();
 }

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
      ws = new WebSocket("ws://" + window.location.hostname.split(':')[0] + ":6666/client");

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

      ws.onmessage = function(e) {

        console.log(e.data);

        if(e.data == EVENTS.CAMERA_PHOTO) {

          toDataUrl('http://192.168.0.49:4444/stream/snapshot.jpeg?delay_s=0', function(data) {
             //download(data, 'photo.jpg', 'image/jpeg');
             window.open(data.replace('text/xml', 'image/jpeg'), '_system');
          });

        }

      }

    } else {

      // The browser doesn't support WebSocket
      console.log("WebSocket NOT supported by your browser !");

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

                ble.stopScan(function() {
                  console.log("ble -> stopScanSucess")
                }, function() {
                  console.log("ble -> stopScanFail")
                });

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

        ble.startNotification(id, serviceId, serviceName, function(buffer) {

          var ary = new Uint8Array(buffer);
          var d = ""; for(var i = 0; i < ary.length; i++) d += ary[i];

          if(d.startsWith(EVENTS.CAMERA_PHOTO)) {

            $('#loader .header').html('Téléchargement de la photo..');
            $('#loader').fadeIn();

            toDataUrl(d.split(' ')[1], function(data) {

              var img = processing.loadImage(data.replace('text/xml', 'image/jpeg'));

              setTimeout(function() {

                img.blend(watermark, 0, 0, 640, 360, 0, 0, 640, 360, processing.BLEND);
                setTimeout(function() {

                  data = img.toDataURL();

                  $('#photo img').attr('src', data);

                  var params = {data: data, prefix: 'attilab_', format: 'PNG', quality: 100, mediaScanner: true};
                  window.imageSaver.saveBase64Image(params,
                    function (filePath) {

                      $('#photo-container').removeClass('off');
                      $('#loader').fadeOut();

                      setTimeout(function() {
                        $('#loader .header').html('En attente d\'une connexion..');
                      }, 250);

                    },
                    function (msg) {

                      $('#loader').fadeOut();

                      setTimeout(function() {
                        $('#loader .header').html('En attente d\'une connexion..');
                      }, 250);

                      console.error(msg);

                    }
                  );

                }, 500);

              }, 500);

            });

          }

        }, app.connectFailure);

      },

      connectFailure: function(error){

        console.log("ble -> connectFailure : " + error);

        $("#loader").fadeIn();
        app.onDeviceReady();

      }

  };

  app.initialize();

}

/**
*
*   Sends data to the server
*
*/

function send(d) {

  if(MODE == MODES.TEST) {
    ws.send(d);
  } else if(MODE == MODES.BLUETOOTH) {

    var data = new Uint8Array(1);
    data[0] = d;

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

  $('body').get(0).style.setProperty('height', $(window).height() + "px", 'important');

  $('.action').on('touchstart', function() {
    console.log($(this).attr('aria-action'));
    send(ACTIONS[$(this).attr('aria-action')]);
  });

  $('.action').on('touchend', function() {
    console.log('released');
    send(EVENTS.RELEASED);
  });

  $('#photo').css({
    position:'fixed',
    top:'25%',
    left:'50%',
    display:'block'
  });

  $('#photo .button:not(.cancel)').click(function() {

    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    var options = {
      url: $('#photo img').attr('src'),
    }

    var onSuccess = function(result) {
      console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    }

    var onError = function(msg) {
      console.log("Sharing failed with message: " + msg);
    }

    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

  })

  $('#photo .cancel').click(function() {
    $('#photo-container').addClass('off');
  })

  processing = new Processing();
  watermark = processing.loadImage('img/watermark.png');

});

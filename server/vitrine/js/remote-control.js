
/**
*
*   RemoteControl : communication with the server
*
**/

var ws;
var device_connected = false;

function handle(evt) {
  return;
}

function WebSocketStart() {

  if("WebSocket" in window) {

    // Let us open a web socket
    ws = new WebSocket("ws://" + window.location.hostname.split(':')[0] + ":9998/vitrine");

    ws.onopen = function() {

      // Web Socket is connected
      console.log('websocket connected')
      ws.send(EVENTS.CONNECTED);

    };

    ws.onmessage = function (evt) {

      console.log(evt.data);

      // Client connected
      if(evt.data == EVENTS.CONNECTED && !device_connected) {

          console.log('device connected');

          device_connected = true;
          connected();

        // Client disconnected
      } else if(evt.data == EVENTS.DISCONNECTED && device_connected) {

        console.log('device disconnected');

        device_connected = false;
        disconnected();

        // Handle client moves
      } else if(evt.data == EVENTS.MOVE_RIGHT) $(window).trigger(jQuery.Event("keydown", { which:39 , keyCode:39 }));
        else if(evt.data == EVENTS.MOVE_LEFT) $(window).trigger(jQuery.Event("keydown", { which:37 , keyCode:37 }));
        else if(evt.data == EVENTS.MOVE_UP) $(window).trigger(jQuery.Event("keydown", { which:38 , keyCode:38 }));
        else if(evt.data == EVENTS.MOVE_DOWN) $(window).trigger(jQuery.Event("keydown", { which:40 , keyCode:40 }));
        else if(evt.data == EVENTS.VALIDATE) $(window).trigger(jQuery.Event("keydown", { which:13 , keyCode:13 }));
        else if(evt.data == EVENTS.BACK) $(window).trigger(jQuery.Event("keydown", { which:27 , keyCode:27 }));
        else if(evt.data == EVENTS.OPTION) $(window).trigger(jQuery.Event("keydown", { which:32 , keyCode:32 }));
        else if(evt.data == EVENTS.RELEASED) $(window).trigger(jQuery.Event("keyup"));
        else if(evt.data == EVENTS.HOME) goTo('index.html');
        else if(evt.data == EVENTS.CATALOG) goTo('catalog.html');
        else if(evt.data == EVENTS.ABOUT) goTo('about.html');
        else if(evt.data == EVENTS.MOTION_YES) motion(true);
        else if(evt.data == EVENTS.MOTION_NO) motion(false);
        else handle(evt.data);

    };

    ws.onerror = function() {
      setTimeout(WebSocketStart, 1000);
    };

    ws.onclose = function(){

      // websocket is closed.
      console.log('websocket disconnected')
      setTimeout(WebSocketStart, 1000);

    };

  } else {

    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your browser !");

  }

}

function WebSocketSend(data) {
  ws.send(data);
}

/**
*
*   Camera
*
*/

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
    xhr.open('GET', url);
    xhr.send();
}

/**
*
*   Displays Video once connected
*
*/

function connected() {

  $('#loader').fadeOut();
  $('#stream img').attr('src', 'http://' + window.location.hostname.split(':')[0] + ':4444/stream/video.mjpeg');

}

/**
*
*   Takes a photo!
*
*/

function validate() {
  WebSocketSend(EVENTS.CAMERA_PHOTO);
}

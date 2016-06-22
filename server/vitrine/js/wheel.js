/**
*
*   Wheel
*
*/

/**
*
*   Leap : displays hand
*
*/

(window.controller = new Leap.Controller({ enableGestures: true }))
.use('riggedHand')
.connect();

/**
*
*   Runtime
*
*/

$(document).ready(function() {

  // Show "how-to"
  $("#howto").modal('show');

  // insert the footer as it will be misplaced if it is directly inserted in the html
  $("body").append('<footer>\
                      <i class="gift huge icon"></i>\
                      <h3>Roue de la fortune</h3>\
                    </footer>');


  // Handle hand movements
  spinning = false;
  window.controller.on("gesture", function(gesture) {

      if(gesture.type == "circle" && gesture.state == "start" && !spinning) {

        spinning = true;
        console.log("start spinning");

        $('#wheel img').css('animation', 'rotation linear 10s infinite');
        $("#howto").modal('hide');

      } else if(gesture.type == "circle" && gesture.state == "stop" && spinning) {

        console.log("stop spinning");
        spin(gesture.progress);
        $('#wheel img').css('animation', 'none');

      }

  });

});

/**
*
*   Hide the "win" modal and shows the how-to
*
*/

function hide(e) {

  e.preventDefault();
  $('#win').modal('hide');
  $("#howto").modal('show');

}

/**
*
*   Make the wheel spin!
*
*/

function spin(turns) {

  $("#wheel img").animate({  borderSpacing: 360*turns }, {

      easing: "easeOutQuint",
      step: function(now,fx) {

        $(this).css('-webkit-transform','rotate('+now+'deg)');
        $(this).css('-moz-transform','rotate('+now+'deg)');
        $(this).css('transform','rotate('+now+'deg)');

      },
      duration:10000,
      complete: function() {

        spinning = false;

        $(this).css({ borderSpacing: (360*turns)%360 })
        $('#win').modal('show');

        $('#win form').on('submit', hide);
        $('#win .approve').click(hide);

      }
  },'linear');

}

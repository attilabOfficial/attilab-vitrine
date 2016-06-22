/**
*
*   Catalog
*
**/

/**
*
*   MoveRight : to the next page
*
*/

function moveRight() {
  $('#catalog').turn('next');
}

/**
*
*   MoveLeft : to the previous page
*
*/

function moveLeft() {
  $('#catalog').turn('previous');
}

/**
*
*   Runtime
*
*/

$(document).ready(function() {

  // Add gradient to each page
  $('#catalog .page').append('<div class="gradient"></div>');

  // Slider
  $('#slider').slider({

		min: 1,
		max: ($('#catalog .page').length/2)+1,

		stop: function() {
			$('#catalog').turn('page', Math.max(1, $(this).slider('value')*2 - 2));
		}

	});

  // Actual catalog, Width/Height are based on files in img/brochure
  $('#catalog').turn({

    autoCenter: true,
    elevation: 50,
    duration: 1000,
		gradients: true,
    pages: $('#catalog .page').length,
    width: ($(window).height()-256)*(1190/842),
    height: ($(window).height()-256),
    when: {
  		turned: function(event, page, view) {
  			$('#slider').slider('value', Math.floor(page/2)+1);
  		}
    }

  });

  // Change page using the leap motion

  var controller = new Leap.Controller({ enableGestures: true });
  controller.connect();

  controller.on("gesture", function(gesture) {

    if(gesture.type == "swipe" && gesture.state == "start") {

      var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);

      if(isHorizontal){

        if(gesture.direction[0] < 0){
          moveRight();
        } else {
          moveLeft();
        }

      }
    }

  });

});

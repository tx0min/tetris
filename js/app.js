
var app = function(){


	

	var init = function () {
		// var that=this;


		TETRIS.create(this);
	

		
	};
	
	// Reset the game 
	var reset = function () {
		
	};
	

	// Update game objects
	var update = function (modifier) {
		// this.timer++;

		TETRIS.update(modifier);

	
	};

	// Draw everything
	var render = function () {

		TETRIS.render();
		
		
	};




	// The main game loop
	var main = function () {
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);
		render();

		then = now;

		// Request to do this again ASAP
		requestAnimationFrame(main);
	};

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	// Let's play this game!
	var then = Date.now();
	
	init();
	main();

		

}


app();
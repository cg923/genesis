
// Game class
function Game() {

	// Canvas set up
	this.canvas = document.getElementById('arena');
	this.ctx = this.canvas.getContext('2d');

	// Variables.
	this.running = false;
	
	// Execute.
	this.setup();
}

Game.prototype.setup = function() {

	// Event listeners.
	document.addEventListener("keypress", function(element) {
		switch(element.key) {
			case 'w':
				console.log('yo');
				break;
			default:
				break;
		}
	});

	// Game loop.
	this.interval = setInterval(this.run, 50);
}

Game.prototype.run = function() {

	// If the game has finished, halt game loop.
	if(!this.running) {
		clearInterval(this.interval);
		return;
	}

	console.log('hi');

}

Game.prototype.draw = function() {

}

Game.prototype.update = function() {

}

var game = new Game();
game.run();
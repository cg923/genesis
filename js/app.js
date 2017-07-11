
// Game class
function Game() {

	// Canvas set up
	this.canvas = document.getElementById('arena');
	this.ctx = this.canvas.getContext('2d');

	// Variables.
	this.self = this;
	this.running = true;

	// Setup.
	this.setup();
}

Game.prototype.setup = function() {
	let game = this;

	// Event listeners.
	document.addEventListener("keypress", function(element) {
		switch(element.key) {
			case 'w':
				game.running = false;
				break;
			default:
				break;
		}
	});

	// Creates game loop which will fire every 50ms.
	this.interval = setInterval(this.run.bind(this), 50);
}

Game.prototype.run = function() {

	// If the game has finished, halt game loop.
	if(!this.running) {
		clearInterval(this.interval);
		return;
	}

	// Update-draw loop.
	this.update();
	this.draw();
}

Game.prototype.draw = function() {

}

Game.prototype.update = function() {
	console.log('hi');
}

var game = new Game();
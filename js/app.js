
/*  --------------------------------  */
/* 				CELL CLASS 			  */
/*  --------------------------------  */

class Cell {
	constructor(x, y, type = 'empty') {
		this.x = x;
		this.y = y;
		this.type = type;
	}
	changeTypeTo(newType) {
		this.type = newType;
	}
}

/*  --------------------------------  */
/* 				GRID CLASS 			  */
/*  --------------------------------  */

class Grid {
	constructor(game) {
		// Back pointer.
		this.game = game;

		this.widthInCells = 20;
		this.heightInCells = 15;

		// A 2D array containing all game cells.
		this.cells = [];

		this.populate();
	}
	populate() {
		/* Populate this.cells with widthInCells (x)
		 * by heightInCells(y) cells. */
		for(let i = 1; i < this.widthInCells; i++) {
			this.cells[i-1] = [];
			for(let j = 1; j < this.heightInCells; j++) {
				this.cells[i-1][j-1] = new Cell(i-1, j-1);
			}
		}
	}
}

/*  --------------------------------  */
/* 				GAME CLASS 			  */
/*  --------------------------------  */

class Game {
	constructor() {
		// Canvas set up
		this.canvas = document.getElementById('canvas');
		this.canvas.width = 800;
		this.canvas.height = 600;
		this.ctx = this.canvas.getContext('2d');

		// Variables.
		this.self = this;
		this.running = true;

		// Setup.
		this.setup();
	}
	setup() {
		// Keep track of Game object.
		let game = this;

		// Event listeners.
		document.addEventListener('keydown', function(element) {
			switch(element.key) {
				case 'w':
					game.running = false;;
					break;
				default:
					break;
			}
		});

		// Creates game loop which will fire every 50ms.
		this.interval = setInterval(this.run.bind(this), 50);

		this.grid = new Grid(this);
	}
	run() {
		// If the game has finished, halt game loop.
		if(!this.running) {
			clearInterval(this.interval);
			return;
		}

		// Update-draw loop.
		this.update();
		this.draw();	
	}
	update() {

	}
	draw() {
		// Clear before drawing.
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);
	}
}

var game = new Game();
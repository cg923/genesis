
/*  --------------------------------  */
/* 				CELL CLASS 			  */
/*  --------------------------------  */

class Cell {
	constructor(x, y, type = 'empty') {
		this.x = x;
		this.y = y;
		this.type = type;

		// Create HTML element and add it to the DOM.
		this.htmlElement = document.createElement('div');
		this.htmlElement.classList.add('cell');
		this.htmlElement.style.left = 20 * this.x;
		this.htmlElement.style.top = 20 * this.y;
		let grid = document.getElementById('grid');
		grid.appendChild(this.htmlElement);
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
		// TO DO - I don't actually know if I need this.
		this.game = game;

		this.widthInCells = 40;
		this.heightInCells = 30;

		// HTML element
		this.htmlElement = document.getElementById('grid');

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
		this.htmlElement = document.getElementById('game-board');

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

		// Create grid.
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
		/* TO DO - now that we've switched away from Canvas
		 	this might be totally unnecessary */
	}
}

var game = new Game();
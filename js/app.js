
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
		this.htmlElement.style.left = (40 * this.x) + "px";
		this.htmlElement.style.top = (40 * this.y) + "px";
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

		this.widthInCells = 20;
		this.heightInCells = 15;

		// HTML element
		this.htmlElement = document.getElementById('grid');

		// A 2D array containing all game cells.
		this.cells = [];

		// Cells to set to "grass" for initial game state.
		this.grassCells = [[0,1],[0,2]];

		this.populate();
	}
	populate() {
		/* Populate this.cells with widthInCells (x)
		 * by heightInCells(y) cells. */
		for(let x = 1; x < this.widthInCells + 1; x++) {
			this.cells[x-1] = [];
			for(let y = 1; y < this.heightInCells + 1; y++) {
				this.cells[x-1][y-1] = new Cell(x-1, y-1);
			}
		}

		// Create starting "Island"
		//for(let )
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
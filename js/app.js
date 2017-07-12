
const CELLSIZE = 40;
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
		this.htmlElement.style.left = (CELLSIZE * this.x) + "px";
		this.htmlElement.style.top = (CELLSIZE * this.y) + "px";
		let grid = document.getElementById('grid');
		grid.appendChild(this.htmlElement);
	}
	changeTypeTo(newType) {
		this.type = newType;

		if(this.type === 'empty') {
			this.htmlElement.classList.remove('grass');
			this.htmlElement.classList.add('empty');
		} else if(this.type === 'grass') {
			this.htmlElement.classList.remove('empty');
			this.htmlElement.classList.add('grass');
		} else {
			console.log("invalid cell type!");
		}
	}
}

/*  --------------------------------  */
/* 				GRID CLASS 			  */
/*  --------------------------------  */

class Grid {
	constructor(game,) {
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
		this.grassCells = [[8,5],
							[9,5],
							[10,5],
							[7,6],
							[8,6],
							[9,6],
							[10,6],
							[11,6],
							[8,7],
							[9,7],
							[10,7]];

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
		for(let i = 0; i < this.grassCells.length; i++) {
			this.cells[this.grassCells[i][0]][this.grassCells[i][1]].changeTypeTo('grass');
		}
	}
}

/*  --------------------------------  */
/* 				PLAYER CLASS 		  */
/*  --------------------------------  */

class Player {
	constructor(name, x, y, type, game) {
		this.name = name;
		this.type = type;
		this.speed = 4;
		this.game = game;

		// Grid coords.
		this.gridX = x;
		this.gridY = y;

		// Actual coords.
		this.x = x * CELLSIZE;
		this.y = y * CELLSIZE;

		// Directions
		this.up = false;
		this.down = false;
		this.right = false;
		this.left = false;

		this.htmlElement = document.getElementById(name);
		this.htmlElement.style.left = this.x + "px";
		this.htmlElement.style.top = this.y + "px";
	}
	/*
	convertPositionToGridCoords() {
		return [this.x / CELLSIZE, this.y / CELLSIZE];
	}*/
	moveUp() {
		// Prevent moving in two directions at once.
		this.left = false;
		this.right = false;

		// Move up.
		this.up = true;
	}
	moveDown() {
		this.left = false;
		this.right = false;
		this.down = true;
	}
	moveLeft() {
		this.up = false;
		this.down = false;
		this.left = true;
	}
	moveRight() {
		this.up = false;
		this.down = false;
		this.right = true;
	}
	stopUp() {
		this.up = false;
	}
	stopDown() {
		this.down = false;
	}
	stopLeft() {
		this.left = false;
	}
	stopRight() {
		this.right = false;
	}
	update() {
		// Update position based on key states.
		if (this.up) 		this.y -= this.speed;
		if (this.down) 		this.y += this.speed;
		if (this.left) 		this.x -= this.speed;
		if (this.right) 	this.x += this.speed;

		// Update grid coords.
		this.gridX = Math.floor((this.x + this.htmlElement.clientWidth / 2 ) / CELLSIZE);
		this.gridY = Math.floor((this.y + this.htmlElement.clientWidth / 2 ) / CELLSIZE);
		
		// Tell Grid where Player is now.
		//this.game.grid.handlePosition()

		// Update DOM element
		this.htmlElement.style.left = this.x + "px";
		this.htmlElement.style.top = this.y + "px";
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
		const CELLSIZE = 40;

		// Setup.
		this.setup();
	}
	setup() {
		// Keep track of Game object.
		let game = this;

		// Player objects.
		this.player1 = new Player("player1", 8, 7, "hero");

		// Key is pressed.
		document.addEventListener('keydown', function(element) {
			switch(element.key) {
				case 'w':
					game.player1.moveUp();
					break;
				case 'a':
					game.player1.moveLeft();
					break;
				case 's':
					game.player1.moveDown();
					break;
				case 'd':
					game.player1.moveRight();
					break;
				default:
					break;
			}
		});

		// Key is release.
		document.addEventListener('keyup', function(element) {
			switch(element.key) {
				case 'w':
					game.player1.stopUp();
					break;
				case 'a':
					game.player1.stopLeft();
					break;
				case 's':
					game.player1.stopDown();
					break;
				case 'd':
					game.player1.stopRight();
					break;
				default:
					break;
			}
		});


		// Creates game loop which will fire every 50ms.
		this.interval = setInterval(this.run.bind(this), 50);

		// Create grid.
		this.grid = new Grid(this, this.CELLSIZE);
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
		this.player1.update();

	}
	draw() {
		/* TO DO - now that we've switched away from Canvas
		 	this might be totally unnecessary */
	}
}

var game = new Game();

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

		this.fullCells = this.grassCells.length;

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
	handlePosition(x, y, type) {
		if(x < 0 || y < 0 || x > this.widthInCells - 1 || y > this.heightInCells - 1) return;

		// If cell is empty and player type is Hero, make it grass.
		if (type === 'hero') {
			this.cells[x][y].changeTypeTo('grass');
			this.fullCells++;
		} else if (type === 'monster') {
			this.cells[x][y].changeTypeTo('empty');
			this.fullCells--;
		}
	}
}

/*  --------------------------------  */
/* 				SKILL CLASS 		  */
/*  --------------------------------  */

class Skill {
	constructor(name) {
		this.name = name;
	}
	static fire(name, player, opponent) {
		if (player.skillCoolDown) return;
		switch (name) {
			case 'speed':
				player.speed = 8;
				player.startCoolDown();
				setTimeout(function () {
					player.speed = 5;
					setTimeout(function() {
						player.endCoolDown();
					}, 5000);
				}, 5000);
				break;
			case 'slow':
				opponent.speed = 2;
				player.startCoolDown();
				setTimeout(function () {
					opponent.speed = 5;
					setTimeout(function() {
						player.endCoolDown();
					}, 5000);
				}, 5000);
				break;
			case 'scramble':
				opponent.scrambled = true;
				player.startCoolDown();
				setTimeout(function () {
					opponent.scrambled = false;
					setTimeout(function() {
						player.endCoolDown();
					}, 5000);
				}, 5000);
				break;
			default:
				break;
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
		this.game = game;
		this.speed = 5;

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

		// SKEELZZZ
		this.skillCoolDown = false;
		this.scrambled = false;
		if (type === 'hero') {
			this.skill1HtmlElement = document.getElementById('p1s1');
			this.skill2HtmlElement = document.getElementById('p1s2');
			this.skill3HtmlElement = document.getElementById('p1s3');
		} else {
			this.skill1HtmlElement = document.getElementById('p2s1');
			this.skill2HtmlElement = document.getElementById('p2s2');
			this.skill3HtmlElement = document.getElementById('p2s3');
		}

		// DOM
		this.htmlElement = document.getElementById(name);
		this.htmlElement.style.left = this.x + "px";
		this.htmlElement.style.top = this.y + "px";

		if (this.type === 'hero') {
			this.htmlElement.style.background = 'blue';
		} else if (this.type === 'monster') {
			this.htmlElement.style.background = 'red';
		}
	}
	moveUp() {
		// Prevent moving in two directions at once.
		this.left = false;
		this.right = false;

		// Move up.
		this.up = true;

		// SCRAMBLED!
		if (this.scrambled) {
			this.up = false;
			this.left = true;
		}
	}
	moveDown() {
		this.left = false;
		this.right = false;
		this.down = true;

		if (this.scrambled) {
			this.down = false;
			this.up = true;
		}
	}
	moveLeft() {
		this.up = false;
		this.down = false;
		this.left = true;

		if (this.scrambled) {
			this.left = false;
			this.right = true;
		}
	}
	moveRight() {
		this.up = false;
		this.down = false;
		this.right = true;

		if (this.scrambled) {
			this.right = false;
			this.down = true;
		}
	}
	stopUp() {
		this.up = false;
		if (this.scrambled) this.left = false;
	}
	stopDown() {
		this.down = false;
		if (this.scrambled) this.up = false;
	}
	stopLeft() {
		this.left = false;
		if (this.scrambled) this.right = false;
	}
	stopRight() {
		this.right = false;
		if (this.scrambled) this.down = false;
	}
	startCoolDown() {
		this.skillCoolDown = true;
		this.skill1HtmlElement.src = "images/skill1CD.png";
		this.skill2HtmlElement.src = "images/skill2CD.png";
		this.skill3HtmlElement.src = "images/skill3CD.png";
	}
	endCoolDown() {
		this.skillCoolDown = false;
		this.skill1HtmlElement.src = "images/skill1.png";
		this.skill2HtmlElement.src = "images/skill2.png";
		this.skill3HtmlElement.src = "images/skill3.png";
	}
	update() {
		// Keep player on the map.
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		let maxWidth = this.game.grid.widthInCells * CELLSIZE - CELLSIZE;
		if (this.x > maxWidth) this.x = maxWidth;
		let maxHeight = this.game.grid.heightInCells * CELLSIZE - CELLSIZE;
		if (this.y > maxHeight) this.y = maxHeight;

		// Update position based on key states.
		if (this.up) 		this.y -= this.speed;
		if (this.down) 		this.y += this.speed;
		if (this.left) 		this.x -= this.speed;
		if (this.right) 	this.x += this.speed;

		// Update grid coords.
		this.gridX = Math.floor((this.x + this.htmlElement.clientWidth / 2 ) / CELLSIZE);
		this.gridY = Math.floor((this.y + this.htmlElement.clientWidth / 2 ) / CELLSIZE);

		// Tell Grid where Player is now.
		this.game.grid.handlePosition(this.gridX, this.gridY, this.type);

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
		// DOM setup
		this.htmlElement = document.getElementById('game-board');

		// Variables.
		this.self = this;
		this.running = true;
		const CELLSIZE = 40;

		// Setup.
		// TO DO - Is there any particular reason this is a separate function?
		this.setup();
	}
	setup() {
		// Keeps track of Game Object;
		let game = this;

		// Keeps track of all Game entities.
		this.entities = [];

		// Player objects.
		this.player1 = new Player('player1', 7, 6, 'hero', this);
		this.entities.push(this.player1);
		this.player2 = new Player('player2', 12, 6, 'monster', this);
		this.entities.push(this.player2);

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
				case 'i':
					game.player2.moveUp();
					break;
				case 'j':
					game.player2.moveLeft();
					break;
				case 'k':
					game.player2.moveDown();
					break;
				case 'l':
					game.player2.moveRight();
					break;
				case '1':
					Skill.fire('speed', game.player1, game.player2);
					break;
				case '2':
					Skill.fire('slow', game.player1, game.player2);
					break;
				case '3':
					Skill.fire('scramble', game.player1, game.player2);
					break;
				case '8':
					Skill.fire('speed', game.player2, game.player1);
					break;
				case '9':
					Skill.fire('slow', game.player2, game.player1);
					break;
				case '0':
					Skill.fire('scramble', game.player2, game.player1);
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
				case 'i':
					game.player2.stopUp();
					break;
				case 'j':
					game.player2.stopLeft();
					break;
				case 'k':
					game.player2.stopDown();
					break;
				case 'l':
					game.player2.stopRight();
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
		this.entities.forEach(function(element) {
			//console.log(element);
			element.update();
		})
	}
	draw() {
		/* TO DO - now that we've switched away from Canvas
		 	this might be totally unnecessary */
	}
}

var game = new Game();
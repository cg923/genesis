
class Player {
	constructor(name, x, y, type, game) {
		this.name = name;
		this.type = type;
		this.game = game;
		this.gameMode = game.gameMode;
		this.speed = 5;

		// Grid coords.
		this.gridX = x;
		this.gridY = y;
		this.currentCell = [x, y];
		this.previousCell = [x, y];
		this.target = [x-1, y-1];

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
	reset(x, y) {
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

		// Cooldowns
		this.endCoolDown();

		this.update();
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

		if(this.type === 'hero') {
			let cooldownTimers = Array.from(document.getElementsByClassName('p1cooldown'));
			cooldownTimers.forEach(function(e) {
				e.classList.remove('hidden');
			});
			this.coolDownInterval = setInterval(function() {
				cooldownTimers.forEach(function(e) {
					e.textContent = parseInt(e.textContent) - 1;
				});
			}, 1000);
		} else if (this.type === 'monster') {
			let cooldownTimers = Array.from(document.getElementsByClassName('p2cooldown'));
			cooldownTimers.forEach(function(e) {
				e.classList.remove('hidden');
			});
			this.coolDownInterval = setInterval(function() {
				cooldownTimers.forEach(function(e) {
					e.textContent = parseInt(e.textContent) - 1;
				});
			}, 1000);
		}
	}
	endCoolDown() {
		this.skillCoolDown = false;
		this.skill1HtmlElement.src = "images/skill1.png";
		this.skill2HtmlElement.src = "images/skill2.png";
		this.skill3HtmlElement.src = "images/skill3.png";
		clearInterval(this.coolDownInterval);

		if(this.type === 'hero') {
			let cooldownTimers = Array.from(document.getElementsByClassName('p1cooldown'));
			cooldownTimers.forEach(function(e) {
				e.classList.add('hidden');
				e.textContent = 10;
			});
		} else if (this.type === 'monster') {
			let cooldownTimers = Array.from(document.getElementsByClassName('p2cooldown'));
			cooldownTimers.forEach(function(e) {
				e.classList.add('hidden');
				e.textContent = 10;
			});
		}		
	}
	update() {
		// If this is an AI controlled player, handle it.
		/*if ((this.gameMode === 'pvc' && this.name === 'player2') ||
			(this.gameMode === 'cvp' && this.name === 'player1')) {*/
			this.makeAIDecision();
		//}


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
		this.currentCell = [this.gridX, this.gridY];

		// Tell Grid where Player is now.
		this.game.grid.handlePosition(this.gridX, this.gridY, this.type);

		// Update DOM element
		this.htmlElement.style.left = this.x + "px";
		this.htmlElement.style.top = this.y + "px";
	}
	makeAIDecision() {
		// Check to see if we are in a new square.
		if (this.currentCell[0] !== this.previousCell[0] ||
			this.currentCell[1] !== this.previousCell[1]) {

			// Get adjacent cells.
			let adjacent = this.game.grid.adjacent(this.gridX, this.gridY);

			// If this is a monster, check to see if any are grass.
			if(this.type === 'monster') {
				let player = this;
				adjacent.forEach(function(e) {
					if (player.game.grid.cells[e[0]][e[1]].type === 'grass') {
						player.target = [e[0],e[1]];
						console.log('going!');
						
					}
				});
			}

			// If this is a player, check to see if any are empty.

			this.previousCell = this.currentCell;
		}
	}
}
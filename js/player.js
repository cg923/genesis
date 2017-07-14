
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
		this.currentCell = [x, y];
		this.target = [x-1, y-1];

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
	moveUp(interrupt = true) {
		// Prevent moving in two directions at once.
		if (interrupt) {
			this.left = false;
			this.right = false;
		}

		// Move up.
		this.up = true;

		// SCRAMBLED!
		if (this.scrambled) {
			if (interrupt) {
				this.up = false;
			}

			this.left = true;
		}
	}
	moveDown(interrupt = true) {
		if (interrupt) {
			this.left = false;
			this.right = false;
		}

		this.down = true;

		if (this.scrambled) {
			if (interrupt) {
				this.down = false;
			}

			this.up = true;
		}
	}
	moveLeft(interrupt = true) {
		if (interrupt) {
			this.up = false;
			this.down = false;
		}

		this.left = true;

		if (this.scrambled) {
			if (interrupt) {
				this.left = false;
			}

			this.right = true;
		}
	}
	moveRight(interrupt = true) {
		if (interrupt) {
			this.up = false;
			this.down = false;
		}
		this.right = true;

		if (this.scrambled) {
			if (interrupt) {
				this.right = false;
			}

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

		// If this is an AI controlled player, handle it.
		if ((this.gameMode === 'pvc' && this.name === 'player2') ||
			(this.gameMode === 'cvp' && this.name === 'player1')) {
			this.makeAIDecision();
		}

		// Tell Grid where Player is now.
		this.game.grid.handlePosition(this.gridX, this.gridY, this.type);

		// Update DOM element
		this.htmlElement.style.left = this.x + "px";
		this.htmlElement.style.top = this.y + "px";
	}
	makeAIDecision() {

		// Use a skill if available and a few seconds have passed.
		if (this.game.timeRemaining <= GAMETIME - 3 &&
			!this.skillCoolDown) {
			let whichSkill = Math.floor(Math.random() * (100 - 1) + 1);
			switch (whichSkill) {
				case 1:
					Skill.fire('speed', this, game.otherPlayer(this.name));
					break;
				case 2:
					Skill.fire('slow', this, game.otherPlayer(this.name));
					break;
				case 3:
					Skill.fire('scramble', this, game.otherPlayer(this.name));
					break;
				default:
					break;
			}
		}

		// Has reached target and it's time to calculate a new target.
		if (this.currentCell[0] === this.target[0] &&
			this.currentCell[1] === this.target[1]) {

			// Get adjacent cells.
			let adjacent = this.game.grid.adjacent(this.gridX, this.gridY);

			// If this is a monster, check to see if any are grass.
			if(this.type === 'monster') {
				let player = this;
				let foundGrass = false;
				adjacent.forEach(function(e) {
					if (player.game.grid.cells[e[0]][e[1]].type === 'grass') {
						player.target = [e[0],e[1]];
						foundGrass = true;					
					}
				});

				if (!foundGrass) {
					this.target = this.game.player1.currentCell;
				}
			}

			// If this is a player, check to see if any are empty.
			if(this.type === 'hero') {
				let player = this;
				let foundEmpty = false;
				adjacent.forEach(function(e) {
					if (player.game.grid.cells[e[0]][e[1]].type === 'empty') {
						player.target = [e[0],e[1]];
						foundEmpty = true;						
					}
				});

				if (!foundEmpty) {
					this.target = this.game.grid.firstEmpty();
				}
			}
		} else {
			// Move left
			if(this.currentCell[0] > this.target[0]) {
				this.moveLeft(false);
			} else {
				this.stopLeft();
			}

			// Move right
			if(this.currentCell[0] < this.target[0]) {
				this.moveRight(false);
			} else {
				this.stopRight();
			}

			// Move down.
			if(this.currentCell[1] < this.target[1]) {
				this.moveDown(false);
			} else {
				this.stopDown();
			}

			// Move up.
			if(this.currentCell[1] > this.target[1]) {
				this.moveUp(false);
			} else {
				this.stopUp();
			}
		}
	}
}
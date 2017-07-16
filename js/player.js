
class Player {
	constructor(name, x, y, type, game) {
		// General variables.
		this.name = name;
		this.type = type;
		this.game = game;
		this.speed = 5;

		// Grid coords.
		this.gridX = x;
		this.gridY = y;
		this.currentCell = [x, y];
		this.target = [x-1, y-1];
		this.lastFourTargets = [];

		// Actual (pixel) coords.
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
		this.speedUpTimeOut = null;
		this.slowDownTimeOut = null;
		this.scrambleTimeOut = null;

		// Relate this player to its skill DOM elements.
		if (type === 'hero') {
			this.skill1HtmlElement = document.getElementById('p1s1');
			this.skill2HtmlElement = document.getElementById('p1s2');
			this.skill3HtmlElement = document.getElementById('p1s3');
			this.cooldownTimers = Array.from(document.getElementsByClassName('p1cooldown'));
		} else {
			this.skill1HtmlElement = document.getElementById('p2s1');
			this.skill2HtmlElement = document.getElementById('p2s2');
			this.skill3HtmlElement = document.getElementById('p2s3');
			this.cooldownTimers = Array.from(document.getElementsByClassName('p2cooldown'));
		}

		// DOM
		this.htmlElement = document.getElementById(name);
		this.htmlElement.style.left = this.x + "px";
		this.htmlElement.style.top = this.y + "px";

		if (this.type === 'hero') {
			this.htmlElement.style.background = "url('images/player1.png')";
		} else if (this.type === 'monster') {
			this.htmlElement.style.background = "url('images/player2.png')";
		}

		// Current skill effect indicator
		this.skillIconElement = document.createElement('div');
		this.skillIconElement.classList.add('icon');
		this.skillIconElement.classList.add('hidden');
		this.skillIconElement.style.background = "url('images/speed.png')";
		this.skillIconElement.style.top = "-40px";
		this.skillIconElement.style.left = "0px";
		this.htmlElement.appendChild(this.skillIconElement);
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

		// Directions and movement
		this.up = false;
		this.down = false;
		this.right = false;
		this.left = false;

		// Skills
		this.endCoolDown();
		this.speed = 5;
		this.scrambled = false;
		clearTimeout(this.speedUpTimeOut);
		clearTimeout(this.slowDownTimeOut);
		clearTimeout(this.scrambleTimeOut);
		this.skillIconElement.classList.add('hidden');
	}

	moveUp() {
		// SCRAMBLED!
		if (this.scrambled) {
			//this.up = false;
			this.left = true;
		} else {
			// Prevent moving in two directions at once.
			this.left = false;
			this.right = false;

			// Move up.
			this.up = true;
		}
	}

	moveDown() {
		if (this.scrambled) {
			this.up = true;
		} else {
			this.left = false;
			this.right = false;
			this.down = true;
		}
	}

	moveLeft() {
		if (this.scrambled) {
			this.right = true;
		} else {
			this.up = false;
			this.down = false;
			this.left = true;
		}
	}

	moveRight() {
		if (this.scrambled) {
			this.down = true;
		} else {
			this.up = false;
			this.down = false;
			this.right = true;
		}
	}

	moveRandom() {
		let whichDirection = Math.floor(Math.random() * (4 - 1) + 1);
		switch (whichDirection) {
			case 1:
				this.moveLeft();
				break;
			case 2:
				this.moveRight();
				break;
			case 3:
				this.moveUp();
				break;
			case 4:
				this.moveDown();
				break;
			default:
				console.log('Invalid direction calculated');
		}
	}

	stopUp() {
		if (this.scrambled) {
			this.left = false;
		} else {
			this.up = false;
		}
	}

	stopDown() {
		if (this.scrambled) {
			this.up = false;
		} else {
			this.down = false;
		}
	}

	stopLeft() {
		if (this.scrambled) {
			this.right = false;
		} else {
			this.left = false;
		}
	}

	stopRight() {
		if (this.scrambled) {
			this.down = false;
		} else {
			this.right = false;
		}
	}

	speedUp() {
		this.speed = 8;
		this.skillIconElement.classList.remove('hidden');
		this.skillIconElement.style.background = "url('images/speed.png')";
		let player = this;
		this.speedUpTimeOut = setTimeout(function () {
			player.skillIconElement.classList.add('hidden');
			player.speed = 5;
		}, 5000);
	}

	slowDown() {
		this.speed = 2;
		this.skillIconElement.classList.remove('hidden');
		this.skillIconElement.style.background = "url('images/slow.png')";
		let player = this;
		this.slowDownTimeOut = setTimeout(function () {
			player.skillIconElement.classList.add('hidden');
			player.speed = 5;
		}, 5000);
	}

	scramble() {
		this.scrambled = true;
		this.left = false;
		this.right = false;
		this.up = false;
		this.down = false;
		this.skillIconElement.classList.remove('hidden');
		this.skillIconElement.style.background = "url('images/scramble.png')";
		let player = this;
		this.scrambleTimeOut = setTimeout(function () {
			player.skillIconElement.classList.add('hidden');
			player.scrambled = false;
			player.findTarget(1);
			player.left = false;
			player.right = false;
			player.up = false;
			player.down = false;
		}, 2000);
	}

	startCoolDown() {
		this.skillCoolDown = true;
		this.skill1HtmlElement.src = "images/skill1CD.png";
		this.skill2HtmlElement.src = "images/skill2CD.png";
		this.skill3HtmlElement.src = "images/skill3CD.png";

		this.cooldownTimers.forEach(function(e) {
			e.classList.remove('hidden');
		});
		let player = this;
		this.coolDownInterval = setInterval(function() {
			player.cooldownTimers.forEach(function(e) {
				e.textContent = parseInt(e.textContent) - 1;
			});
		}, 1000);
	}

	endCoolDown() {
		this.skillCoolDown = false;
		this.skill1HtmlElement.src = "images/skill1.png";
		this.skill2HtmlElement.src = "images/skill2.png";
		this.skill3HtmlElement.src = "images/skill3.png";

		clearInterval(this.coolDownInterval);
		this.coolDownInterval = null;

		this.cooldownTimers.forEach(function(e) {
			e.classList.add('hidden');
			e.textContent = 10;
		});
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

		// Deal with cooldowns.
		if (parseInt(this.cooldownTimers[0].textContent) === 0) {
			this.endCoolDown();
		}

		// If this is an AI controlled player, defer to AI.
		if ((this.game.gameMode === 'pvc' && this.name === 'player2') ||
			(this.game.gameMode === 'cvp' && this.name === 'player1')) {
			this.makeAIDecision();
		}

		// Tell Grid where Player is now.
		this.game.grid.updateCell(this.gridX, this.gridY, this.type);

		// Update DOM element
		this.htmlElement.style.left = this.x + "px";
		this.htmlElement.style.top = this.y + "px";
	}

	makeAIDecision() {
		// Use a skill if available and a few seconds have passed since the game began.
		if (this.game.timeRemaining <= GAMETIME - 3 &&
			!this.skillCoolDown) {
			let whichSkill = Math.floor(Math.random() * (200 - 1) + 1);
			switch (whichSkill) {
				case 1:
					if (this.scrambled) { whichSkill = 2; }
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

		/* If the player has reached its target or doesn't have one,
		 * calculate one.  If it does have one, move towards it. */
		if (!this.target ||
			(this.currentCell[0] === this.target[0] &&
			this.currentCell[1] === this.target[1])) {
			this.findTarget(1);
		} else {
			// Target is to the left.
			if(this.currentCell[0] > this.target[0]) {
				this.moveLeft();
			} else {
				this.stopLeft();
			}

			// Target is to the right.
			if(this.currentCell[0] < this.target[0]) {
				this.moveRight();
			} else {
				this.stopRight();
			}

			// Target is below.
			if(this.currentCell[1] < this.target[1]) {
				this.moveDown();
			} else {
				this.stopDown();
			}

			// Target is above.
			if(this.currentCell[1] > this.target[1]) {
				this.moveUp();
			} else {
				this.stopUp();
			}
		}
	}

	findTarget(netSize) {
		// Get adjacent cells.
		let adjacent = this.game.grid.adjacent(this.gridX, this.gridY, netSize);
		let valid = [];

		// If this is a monster, check to see if any adjacent are grass.
		if(this.type === 'monster') {
			let player = this;
			//let foundGrass = false;
			adjacent.forEach(function(e) {
				if (player.game.grid.cells[e[0]][e[1]].type === 'grass') {
					valid.push(e);
					/*
					player.target = [e[0],e[1]];
					foundGrass = true;*/			
				}
			});

			// If no grass was found, just go chase the player.
			//if (!foundGrass) {
			if (valid.length === 0) {
				this.findTarget(netSize + 1);
				//this.target[0] = this.game.player1.gridX;
				//this.target[1] = this.game.player1.gridY;
			} else {
				let whichCell = Math.floor(Math.random() * valid.length);
				player.target = [valid[whichCell][0],valid[whichCell][1]];
			}
		}

		// If this is a player, check to see if any adjacent are empty.
		if(this.type === 'hero') {
			let player = this;
			let foundEmpty = false;

			// Check adjacent cells for empties.
			// TODO - too easy to trick AI into losing.
			adjacent.forEach(function(e) {
				if (player.game.grid.cells[e[0]][e[1]].type === 'empty') {
					if (!player.lastFourTargets.includes([e[0],e[1]])) {
						player.target = [e[0],e[1]];
						foundEmpty = true;						
						player.lastFourTargets.push(player.target);
					}

					if (player.lastFourTargets.length > 4) {
						player.lastFourTargets.shift();
					}
				}
			});

			console.log(foundEmpty);

			// If no adjacent cells are empty, move randomly.
			if (!foundEmpty) {
				if (this.currentCell[0] === 0) { 
					this.moveRight(); 
				} else if (this.currentCell[0] === this.game.grid.widthInCells - 1) { 
					this.moveLeft(); 
				} else if (this.currentCell[1] === 0) {
					this.moveDown();
				} else if (this.currentCell[1] === this.game.grid.heightInCells - 1) {
					this.moveUp();
				} else {
					this.moveLeft();
				}
			}
		}
	}
}

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
		this.findTarget(5, true);
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
		}, 3000);
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
		if (!this.scrambled &&
			!this.target ||
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

	findTarget(netSize, scrambled = false) {
		// Get adjacent cells.
		let adjacent = this.game.grid.adjacent(this.gridX, this.gridY, netSize);
		let valid = [];
		let player = this;
		adjacent.forEach(function(e) {
			if (!player.scrambled) {
				if ((player.type === 'monster' && player.game.grid.cells[e[0]][e[1]].type === 'grass') ||
					(player.type === 'hero' && player.game.grid.cells[e[0]][e[1]].type === 'empty')) {
					valid.push(e);			
				}
			} else {
				if ((player.type === 'monster' && player.game.grid.cells[e[0]][e[1]].type === 'empty') ||
					(player.type === 'hero' && player.game.grid.cells[e[0]][e[1]].type === 'grass')) {
					valid.push(e);			
				}
			}
		});

		// If no valid cell was found, cast a wider net.
		if (valid.length === 0) {
			this.findTarget(netSize + 1);
		} else {
			// Pick a valid cell at random to minimize repeat paths.
			let whichCell = Math.floor(Math.random() * valid.length);
			player.target = [valid[whichCell][0],valid[whichCell][1]];
		}
	}
}
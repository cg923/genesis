class Game {
	constructor(gameMode) {
		// DOM setup
		this.htmlElement = document.getElementById('game-board');

		// Variables.
		this.self = this;
		this.running = true;
		this.goalCells = 50;
		this.timeRemaining = GAMETIME;
		this.gameMode = gameMode;

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
		this.player2 = new Player('player2', 11, 6, 'monster', this);
		this.entities.push(this.player2);

		// Create grid.
		this.grid = new Grid(this, this.CELLSIZE);

		// Game timer
		this.timerInterval = setInterval(function() {
				game.timeRemaining--;
			}, 1000);

		// Reset button.
		Array.from(document.getElementsByClassName('reset-button')).forEach(function(e) {
			e.addEventListener('click', game.reset.bind(game));
		});

		// Key is pressed.
		document.addEventListener('keydown', function(element) {
			switch(element.key) {
				case 'w':
					if( game.gameMode === 'pvc' ||
						game.gameMode === 'pvp') {
						game.player1.moveUp();
					}
					break;
				case 'a':
					if( game.gameMode === 'pvc' ||
						game.gameMode === 'pvp') {
						game.player1.moveLeft();
					}					
					break;
				case 's':
					if( game.gameMode === 'pvc' ||
						game.gameMode === 'pvp') {
						game.player1.moveDown();
					}
					break;
				case 'd':
					if( game.gameMode === 'pvc' ||
						game.gameMode === 'pvp') {
						game.player1.moveRight();
					}
					break;
				case 'i':
					if( game.gameMode === 'pvp' ||
						game.gameMode === 'cvp') {
						game.player2.moveUp();
					}
					break;
				case 'j':
					if( game.gameMode === 'pvp' ||
						game.gameMode === 'cvp') {
						game.player2.moveLeft();
					}
					break;
				case 'k':
					if( game.gameMode === 'pvp' ||
						game.gameMode === 'cvp') {
						game.player2.moveDown();
					}
					break;
				case 'l':
					if( game.gameMode === 'pvp' ||
						game.gameMode === 'cvp') {
						game.player2.moveRight();
					}
					break;
				case '1':
					if( game.gameMode === 'pvc' ||
						game.gameMode === 'pvp') {
						Skill.fire('speed', game.player1, game.player2);
					}
					break;
				case '2':
					if( game.gameMode === 'pvc' ||
						game.gameMode === 'pvp') {
						Skill.fire('slow', game.player1, game.player2);
					}
					break;
				case '3':
					if( game.gameMode === 'pvc' ||
						game.gameMode === 'pvp') {
						Skill.fire('scramble', game.player1, game.player2);
					}
					break;
				case '8':
					if( game.gameMode === 'pvp' ||
						game.gameMode === 'cvp') {
						Skill.fire('speed', game.player2, game.player1);
					}
					break;
				case '9':
					if( game.gameMode === 'pvp' ||
						game.gameMode === 'cvp') {
						Skill.fire('slow', game.player2, game.player1);
					}
					break;
				case '0':
					if( game.gameMode === 'pvp' ||
						game.gameMode === 'cvp') {
						Skill.fire('scramble', game.player2, game.player1);
					}
					break;
				default:
					break;
			}
		});

		// Key is released.
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
		this.gameLoop = setInterval(this.run.bind(this), 50);
	}
	reset() {
		this.running = false;

		if (this.gameLoop) {
			clearInterval(this.gameLoop);
		}
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}

		// If the player objects don't exist it means setup() hasn't been called.
		if (!this.player1 || !this.player2 || !this.grid) {
			this.setup();
			return;
		} 

		// Reset players positions.
		this.player1.reset(7,6);
		this.player2.reset(11,6);

		// Reset grid
		this.grid.reset();

		// Reset timer
		this.timeRemaining = GAMETIME;
		this.timerInterval = setInterval(function() {
				game.timeRemaining--;
			}, 1000);

		// Hide win message
		document.getElementById('win-message').classList.add('hidden');

		// Restart the game loop.
		this.running = true;
		this.gameLoop = setInterval(this.run.bind(this), 50);
	}
	run() {
		// If the game has finished, halt game loop.
		if(!this.running) {
			clearInterval(this.gameLoop);
			return;
		}

		// Update.
		this.update();
	}
	update() {
		// Game is finished
		if (this.timeRemaining === 0) {
			clearInterval(this.timerInterval);
			this.player1.endCoolDown();
			this.player2.endCoolDown();
			this.running = false;
			if(this.grid.fullCells >= this.goalCells) {
				document.getElementById('win-text').innerText = "Player 1 Wins!";
			} else {
				document.getElementById('win-text').innerText = "Player 2 Wins!";
			}
			document.getElementById('win-message').classList.remove('hidden');
		}
		this.entities.forEach(function(element) {
			element.update();
		})

		document.getElementById('timer-clock').textContent = "TIME: " + this.timeRemaining;
	}
}
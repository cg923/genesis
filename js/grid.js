
class Grid {
	constructor(game) {
		// Back pointer to Game.
		this.game = game;

		// TODO - these should be const somehow.
		this.widthInCells = 20;
		this.heightInCells = 15;
		this.fullCells = 0;
		this.emptyCells = 0;
		this.totalCells = this.widthInCells * this.heightInCells;

		// HTML element
		this.htmlElement = document.getElementById('grid');

		// A 2D array containing all game cells.
		this.cells = [];

		this.populate();
	}

	populate() {
		/* Populate this.cells with widthInCells (x)
		 * by heightInCells(y) cells. */
		for(let x = 0; x < this.widthInCells; x++) {
			this.cells[x] = [];
			for(let y = 0; y < this.heightInCells; y++) {
				this.cells[x][y] = new Cell(x, y, this);
			}
		}

		// Make half the grid grass
		for(let x = 0; x < Math.floor(this.widthInCells / 2); x++) {
				for(let y = 0; y < this.heightInCells; y++) {
					this.cells[x][y].changeTypeTo('grass');
					this.fullCells++;
			}
		}

		this.emptyCells = this.totalCells - this.fullCells;
	}

	reset() {
		// Clear cells.
		for(let x = 1; x < this.widthInCells + 1; x++) {
			for(let y = 1; y < this.heightInCells + 1; y++) {
				this.cells[x-1][y-1].changeTypeTo('empty');
			}
		}

		this.fullCells = 0;

		// Make half the grid grass
		for(let x = 0; x < Math.floor(this.widthInCells / 2); x++) {
				for(let y = 0; y < this.heightInCells; y++) {
					this.cells[x][y].changeTypeTo('grass');
					this.fullCells++;
			}
		}

		this.emptyCells = this.totalCells - this.fullCells;

		// Reset goal display.
		document.getElementById('goal-counter').innerText = 'Creation: ' + 
															this.fullCells + 
															'/' + 
															this.emptyCells +
															' :Destruction';
	}

	updateCell(x, y, playerType) {
		// Check for invalid cell coordinates.
		if(x < 0 || y < 0 || x > this.widthInCells - 1 || y > this.heightInCells - 1) return;

		/* If cell is empty and player type is Hero, make it grass.
		 * If cell is grass and player is monster, make it empty. */
		if (playerType === 'hero') {
			if(this.cells[x][y].type === 'empty') this.fullCells++;
			this.cells[x][y].changeTypeTo('grass');
		} else if (playerType === 'monster') {
			if(this.cells[x][y].type === 'grass') this.fullCells--;
			this.cells[x][y].changeTypeTo('empty');
		}

		this.emptyCells = this.totalCells - this.fullCells;

		document.getElementById('goal-counter').innerText = 'Creation: ' + 
															this.fullCells + 
															'/' + 
															this.emptyCells +
															' :Destruction';
	}

	/* Returns adjacent cells to Cell[x][y]. netSize can be adjusted to
	 * look at more cells.  In other words:
	 *			___ ___ ___
	 *		   |___|___|___|
	 *		   |___|x,y|___|	This has a netSize of 1, because cell[x][y]
	 *		   |___|___|___|	is surrounded on all sides by 1 cell.
	 *
	 */
	adjacent(x, y, netSize) {
		let adjacent = [];
		for(let i = x - netSize; i <= x + netSize; i++) {
			for(let j = y - netSize; j <= y + netSize; j++) {
				// Ensure that our net does not reach outside the bounds of the game.
				if(i >= 0 && 
					j >= 0 &&
					i <= this.widthInCells - 1 &&
					j <= this.heightInCells - 1) {
					adjacent.push([i,j]);
				}
			}
		}

		return adjacent;
	}
}
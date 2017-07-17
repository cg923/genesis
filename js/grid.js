
class Grid {
	constructor(game) {
		// Back pointer to Game.
		this.game = game;

		// TODO - these should be const somehow.
		this.widthInCells = 20;
		this.heightInCells = 15;

		// HTML element
		this.htmlElement = document.getElementById('grid');

		// A 2D array containing all game cells.
		this.cells = [];

		// Cells to set to "grass" for initial game state.
		// Note: I think this looks goofy but ES6 style guide says do it.
		this.grassCells = [
							[8,5],
							[9,5],
							[10,5],
							[7,6],
							[8,6],
							[9,6],
							[10,6],
							[11,6],
							[8,7],
							[9,7],
							[10,7]
						];

		this.fullCells = this.grassCells.length;

		this.populate();
	}

	populate() {
		/* Populate this.cells with widthInCells (x)
		 * by heightInCells(y) cells. */
		for(let x = 1; x < this.widthInCells + 1; x++) {
			this.cells[x-1] = [];
			for(let y = 1; y < this.heightInCells + 1; y++) {
				this.cells[x-1][y-1] = new Cell(x-1, y-1, this);
			}
		}

		// Create starting "Island"
		for(let i = 0; i < this.grassCells.length; i++) {
			this.cells[this.grassCells[i][0]][this.grassCells[i][1]].changeTypeTo('grass');
		}
	}

	reset() {
		// Clear cells.
		for(let x = 1; x < this.widthInCells + 1; x++) {
			for(let y = 1; y < this.heightInCells + 1; y++) {
				this.cells[x-1][y-1].changeTypeTo('empty');
			}
		}

		// Reset grass cells.
		for(let i = 0; i < this.grassCells.length; i++) {
			this.cells[this.grassCells[i][0]][this.grassCells[i][1]].changeTypeTo('grass');
		}

		// Reset goal display.
		this.fullCells = this.grassCells.length;
		document.getElementById('goal-counter').innerText = 'GOAL: ' + 
															this.fullCells + 
															'/' + 
															this.game.goalCells;
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

		document.getElementById('goal-counter').innerText = 'GOAL: ' + 
															this.fullCells + 
															'/' 
															+ this.game.goalCells;
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
		let cells = [];
		for(let i = x - netSize; i <= x + netSize; i++) {
			for(let j = y - netSize; j <= y + netSize; j++) {
				// Ensure that our net does not reach outside the bounds of the game.
				if(i >= 0 && 
					j >= 0 &&
					i <= this.widthInCells - 1 &&
					j <= this.heightInCells - 1) {
					cells.push([i,j]);
				}
			}
		}

		return cells;
	}

	cell(x, y) {
		return this.cells[x][y];
	}
}
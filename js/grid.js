
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

		this.fullCells = this.grassCells.length;
		document.getElementById('goal-counter').innerText = "GOAL: " + this.fullCells + "/" + this.game.goalCells;
	}
	handlePosition(x, y, type) {
		if(x < 0 || y < 0 || x > this.widthInCells - 1 || y > this.heightInCells - 1) return;

		// If cell is empty and player type is Hero, make it grass.
		if (type === 'hero') {
			if(this.cells[x][y].type === 'empty') this.fullCells++;
			this.cells[x][y].changeTypeTo('grass');
		} else if (type === 'monster') {
			if(this.cells[x][y].type === 'grass') this.fullCells--;
			this.cells[x][y].changeTypeTo('empty');
		}
		document.getElementById('goal-counter').innerText = "GOAL: " + this.fullCells + "/" + this.game.goalCells;
	}
}
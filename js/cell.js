
class Cell {
	constructor(x, y, grid, type = 'empty') {
		this.x = x;
		this.y = y;
		this.grid = grid;
		this.type = type;

		// Create HTML element and add it to the DOM.
		this.htmlElement = document.createElement('div');
		this.htmlElement.classList.add('cell');
		this.htmlElement.style.left = (CELLSIZE * this.x) + 'px';
		this.htmlElement.style.top = (CELLSIZE * this.y) + 'px';
		let gridDOM = document.getElementById('grid');
		gridDOM.appendChild(this.htmlElement);
	}
	
	changeTypeTo(newType) {
		this.type = newType;

		// Handle visual effects.
		if (this.type === 'empty') {
			this.htmlElement.classList.remove('grass');
			this.htmlElement.classList.add('empty');
			console.log('hi');

			// If the cell above this is grass, make this a "below" tile.
			if (this.y > 0 && this.grid.cells[this.x][this.y - 1].type === 'grass') {
				console.log('hi there');
				this.htmlElement.style.background = 'url(\'images/grassbottom.png\')';
			} else {
				this.htmlElement.style.background = 'black';
			}

			// Change cell below to a true-empty tile if not grass.
			if (this.y < this.grid.heightInCells -1 &&
				this.grid.cells[this.x][this.y + 1].type === 'empty') {
				this.grid.cells[this.x][this.y + 1].htmlElement.style.background = 'black';
			}
		} else if (this.type === 'grass') {
			this.htmlElement.classList.remove('empty');
			this.htmlElement.classList.add('grass');
			this.htmlElement.style.background = 'url(\'images/grass.png\')';

			// Change cell below to a "below" tile.
			if (this.y < this.grid.heightInCells -1 &&
				this.grid.cells[this.x][this.y + 1].type === 'empty') {
				this.grid.cells[this.x][this.y + 1].htmlElement.style.background = 'url(\'images/grassbottom.png\')';
			}

		} else {
			console.log('invalid cell type!');
		}
	}
}
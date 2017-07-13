
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
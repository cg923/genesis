
// Detect game mode based on URL
let gameMode = window.location.search.substr(6);

// Setup and play the game!
let game = new Game(gameMode);
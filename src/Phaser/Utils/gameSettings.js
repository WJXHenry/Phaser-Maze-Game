/**
 * Returns custom dimensions for the game instance
 * @param {Phaser.Game} game The Phaser Game object
 * @returns {Object} The custom dimensions object
 */
export function getDimensions(game) {
  const screenLength = game.config.width;
  return {
    screenLength,
    screenSpaceUnit: screenLength / 20,
    screenCenter: screenLength / 2,
    textSize1: screenLength / 10,
    textSize2: screenLength / 15,
    textSize3: screenLength / 18
  };
}

/**
 * The initial settings for the game (game configs)
 * @returns {Object} The initial/default settings for the game configurations
 */
export function initSettings() {
  return {
    maxGridSize: 35,
    minGridSize: 10,
    gridSize: 20,
    maxSideLength: 15,
    minSideLength: 10,
    sideLength: 10,
    gameMode: 0
  };
}

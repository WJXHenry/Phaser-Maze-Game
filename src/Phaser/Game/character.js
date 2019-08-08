/**
 * @typedef {Object} Position - The x and y coordinates
 * @property {Number} x - The x coordinate
 * @property {Number} y - The y coordinate
 */

/**
 * @typedef {Object} Direction
 * @property {Number} UP - Up
 * @property {Number} DOWN - Down
 * @property {Number} LEFT - Left
 * @property {Number} RIGHT - Right
 */

const DIRECTIONS = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
};

export default class Character {
  /**
   * Constructor
   * @param {Phaser.GameObjects.Graphics} graphics - The Phaser graphics object
   * @param {GameMaze} maze - An instance of the GameMaze object
   * @param {Object} position - The initial position of the character
   * @param {Number} position.x - The x coordinate of the character
   * @param {Number} position.y - The y coordinate of the character
   */
  constructor(graphics, maze, position) {
    this.graphics = graphics;
    this.maze = maze;
    this.position = position;
  }

  get Directions() {
    return DIRECTIONS;
  }

  /**
   *
   * @param {Direction} direction
   * @returns {Position}
   */
  moveCharacter(direction) {
    // return the current player position
  }
}

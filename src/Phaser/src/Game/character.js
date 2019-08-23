import { GOLD_0x } from '../Common/colours';

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

/**
 * The default number of intermediate steps (frames) between character movement
 */
const DEFAULT_UPDATE_STEPS = 5;

export default class Character {
  /**
   * Constructor
   * @param {GameMaze} maze - An instance of the GameMaze object
   * @param {Object} position - The initial position of the character
   * @param {Number} position.x - The x coordinate of the character
   * @param {Number} position.y - The y coordinate of the character
   * @param {Object} [options]
   * @param {String} [options.colour] - The hexadecimal colour of the character (defaults to gold)
   * @param {Number} [options.updateSteps] - The number of intermediate steps (frames) between character movement (default: 5)
   * @param {Boolean} [options.smoothMovement] - The flag to allow for smooth movement (default: false)
   */
  constructor(maze, position, options = {}) {
    this.maze = maze;
    this.position = position;
    this.prevPos = position;
    this.colour = options.colour || GOLD_0x;
    this.smoothMovement = options.smoothMovement || false;
    this.UPDATE_STEPS = options.updateSteps || DEFAULT_UPDATE_STEPS;
    this.updating = false;
    this.updateStep = 0;
  }

  static get DIRECTIONS() {
    return DIRECTIONS;
  }

  /**
   * Draw the character at its current position
   */
  drawCharacter() {
    this.maze.fillGrid(this.position, this.colour);
  }

  /**
   * Moves the character in the specified direction if possible
   * @param {Direction} direction - The direction to move
   */
  moveCharacter(direction) {
    // If the chracter is currently updating, ignore the move command
    if (this.updating) {
      return;
    }
    // Return the current character position
    let prevPos = { ...this.position };
    let newPos = { ...this.position };
    if (direction === DIRECTIONS.UP) {
      newPos.y -= 1;
      if (newPos.y < 0) {
        newPos.y = 0;
      }
    } else if (direction === DIRECTIONS.DOWN) {
      newPos.y += 1;
      if (newPos.y > this.maze.size - 1) {
        newPos.y = this.maze.size - 1;
      }
    } else if (direction === DIRECTIONS.LEFT) {
      newPos.x -= 1;
      if (newPos.x < 0) {
        newPos.x = 0;
      }
    } else if (direction === DIRECTIONS.RIGHT) {
      newPos.x += 1;
      if (newPos.x > this.maze.size - 1) {
        newPos.x = this.maze.size - 1;
      }
    }
    if (
      this.maze.isEdge([`${prevPos.x},${prevPos.y}`, `${newPos.x},${newPos.y}`])
    ) {
      // Update the positions
      this.position = newPos;
      this.prevPos = prevPos;
      if (this.smoothMovement) {
        // Set the flag to update the player movement
        this.updating = true;
      } else {
        this.maze.fillGrid(this.prevPos, this.maze.colour);
        this.maze.fillGrid(this.position, this.colour);
      }
    }
  }

  /**
   * This function should always be called in the Scene's update function
   */
  update() {
    if (this.updating) {
      this._smoothMovement(this.prevPos, this.position);
    }
  }

  /**
   * Returns whether or not the character is updating
   * @returns {Boolean}
   */
  isUpdating() {
    return this.updating;
  }

  /**
   * This function is called internally to draw the intermediate steps of the character movement
   */
  _smoothMovement() {
    let diffX = Math.round(this.position.x - this.prevPos.x);
    let diffY = Math.round(this.position.y - this.prevPos.y);
    if (diffX !== 0) {
      // Calculating the intermediate steps...
      let interFrom = {
        ...this.prevPos,
        x:
          Math.round(
            (this.prevPos.x +
              (1 / this.UPDATE_STEPS) * this.updateStep * diffX) *
              10
          ) / 10
      };
      let interTo = {
        ...this.prevPos,
        x:
          Math.round(
            (this.prevPos.x +
              (1 / this.UPDATE_STEPS) * (this.updateStep + 1) * diffX) *
              10
          ) / 10
      };
      this.maze.fillGrid(interFrom, this.maze.colour);
      this.maze.fillGrid(interTo, this.colour);
    } else {
      let interFrom = {
        ...this.prevPos,
        y:
          Math.round(
            (this.prevPos.y +
              (1 / this.UPDATE_STEPS) * this.updateStep * diffY) *
              10
          ) / 10
      };
      let interTo = {
        ...this.prevPos,
        y:
          Math.round(
            (this.prevPos.y +
              (1 / this.UPDATE_STEPS) * (this.updateStep + 1) * diffY) *
              10
          ) / 10
      };
      this.maze.fillGrid(interFrom, this.maze.colour);
      this.maze.fillGrid(interTo, this.colour);
    }

    this.updateStep++;
    if (this.updateStep % this.UPDATE_STEPS === 0) {
      this.updateStep = 0;
      this.updating = false;
    }
  }
}

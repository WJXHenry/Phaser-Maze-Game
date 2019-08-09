import { GOLD_0x } from '../../common/colours';

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
   * @param {GameMaze} maze - An instance of the GameMaze object
   * @param {Object} position - The initial position of the character
   * @param {Number} position.x - The x coordinate of the character
   * @param {Number} position.y - The y coordinate of the character
   */
  constructor(maze, position, colour = GOLD_0x) {
    this.maze = maze;
    this.position = position;
    this.colour = colour;
  }

  static get DIRECTIONS() {
    return DIRECTIONS;
  }

  /**
   * Moves the character in the specified direction if possible
   * @param {Direction} direction - The direction to move
   */
  moveCharacter(direction) {
    // return the current character position
    let prevPos = { ...this.position };
    if (direction === DIRECTIONS.UP) {
      this.position.y -= 1;
      if (this.position.y < 0) {
        this.position.y = 0;
      }
    } else if (direction === DIRECTIONS.DOWN) {
      this.position.y += 1;
      if (this.position.y > this.maze.size - 1) {
        this.position.y = this.maze.size - 1;
      }
    } else if (direction === DIRECTIONS.LEFT) {
      this.position.x -= 1;
      if (this.position.x < 0) {
        this.position.x = 0;
      }
    } else if (direction === DIRECTIONS.RIGHT) {
      this.position.x += 1;
      if (this.position.x > this.maze.size - 1) {
        this.position.x = this.maze.size - 1;
      }
    }
    if (
      this.maze.isEdge([
        `${prevPos.x},${prevPos.y}`,
        `${this.position.x},${this.position.y}`
      ])
    ) {
      // Redraw player position
      this.maze.fillGrid(prevPos, this.maze.colour);
      this.maze.fillGrid(this.position, this.colour);
    } else {
      this.position = prevPos;
    }
  }

  /**
   * This function does not seem to work. The graphics are updated all at once.
   * Maybe it is because the function is called during a clock tick. Not too sure how to implement smooth movement here...
   */
  smoothMovement(fromPos, toPos) {
    let diffX = Math.round(toPos.x - fromPos.x);
    let diffY = Math.round(toPos.y - fromPos.y);
    if (diffX !== 0) {
      for (let i = 0; i < 5; i++) {
        // What is math (idek what I'm doing...)
        let interFrom = {
          ...fromPos,
          x:
            Math.round(
              (fromPos.x + (1 / 5 / this.maze.sideLength) * i * diffX) * 10
            ) / 10
        };
        let interTo = {
          ...toPos,
          x:
            Math.round(
              (toPos.x + (1 / 5 / this.maze.sideLength) * (i + 1) * diffX) * 10
            ) / 10
        };
        this.maze.fillGrid(interFrom, this.maze.colour);
        this.maze.fillGrid(interTo, this.colour);
        // wait(100);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        let interFrom = {
          ...fromPos,
          y:
            Math.round(
              (fromPos.y + (1 / 5 / this.maze.sideLength) * i * diffY) * 10
            ) / 10
        };
        let interTo = {
          ...toPos,
          y:
            Math.round(
              (toPos.Y + (1 / 5 / this.maze.sideLength) * (i + 1) * diffY) * 10
            ) / 10
        };
        this.maze.fillGrid(interFrom, this.maze.colour);
        this.maze.fillGrid(interTo, this.colour);
        this.maze.graphics.update();
        // wait(100);
      }
    }
  }

  /**
   * Draw the character at its current position
   */
  drawCharacter() {
    this.maze.fillGrid(this.position, this.colour);
  }
}

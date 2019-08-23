import Maze from '../Utils/maze';
import { getDimensions } from './gameSettings';
import { WHITE_0x } from '../Common/colours';

export default class GameMaze extends Maze {
  /**
   * Constructor
   * @param {Phaser.Game} game - The Phaser game object
   * @param {Phaser.GameObjects.Graphics} graphics - The Phaser graphics object
   * @param {Number} size - The size of the maze (size x size grid)
   * @param {Number} colour - The hexadecimal colour to fill in the maze (colour of the paths)
   */
  constructor(game, graphics, size, colour = WHITE_0x) {
    super(size);
    this.size = size;
    this.game = game;
    this.graphics = graphics;
    this.graphics.setPosition(1, 1); // The border for the maze is 1
    this.gameDimensions = getDimensions(this.game);
    this.sideLength = (this.gameDimensions.screenLength - 2) / size;
    this.colour = colour;
  }

  /**
   * Draws the maze
   */
  drawMaze() {
    this.graphics.fillStyle(this.colour);
    this.maze.getVertices().forEach(vertex => {
      let pos = vertex.split(',');
      // Vertex
      let vertX = Number(pos[0]);
      let vertY = Number(pos[1]);
      // Grid unit
      let rectX = vertX * this.sideLength + 1;
      let rectY = vertY * this.sideLength + 1;
      let lengthX = this.sideLength - 2;
      let lengthY = this.sideLength - 2;
      // Update the grid unit dimensions
      if (this.maze.isEdge([vertex, `${vertX - 1},${vertY}`])) {
        rectX -= 1;
        lengthX += 1;
      }
      if (this.maze.isEdge([vertex, `${vertX + 1},${vertY}`])) {
        lengthX += 1;
      }
      if (this.maze.isEdge([vertex, `${vertX},${vertY - 1}`])) {
        rectY -= 1;
        lengthY += 1;
      }
      if (this.maze.isEdge([vertex, `${vertX},${vertY + 1}`])) {
        lengthY += 1;
      }
      // Draw the grid unit
      this.graphics.fillRect(rectX, rectY, lengthX, lengthY);
    });
  }

  /**
   * Fill the grid with colour at the specified position
   * @param {Object} position
   * @param {Number} position.x - The x coordinate of the vertex to fill
   * @param {Number} position.y - The y coordinate of the vertex to fill
   * @param {Number} colour - Hexadecimal colour of the grid
   */
  fillGrid(position, colour) {
    this.graphics.fillStyle(colour);
    this.graphics.fillRect(
      position.x * this.sideLength + 1,
      position.y * this.sideLength + 1,
      this.sideLength - 2,
      this.sideLength - 2
    );
  }
}

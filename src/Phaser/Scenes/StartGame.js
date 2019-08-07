import Phaser from 'phaser';
import { getDimensions } from '../Utils/gameSettings';
import { WHITE_0x, BLACK_0x, GOLD_0x } from '../../common/colours';
import Maze from '../Utils/maze';
import { GESTURES, gestureDetection } from '../Utils/gestures';

export default class StartGame extends Phaser.Scene {
  constructor() {
    super('StartGame');
  }

  init(data) {
    this.settings = data;
    this.directions = {
      UP: 'up',
      DOWN: 'down',
      LEFT: 'left',
      RIGHT: 'right'
    };
    this.handleGesture = this.handleGesture.bind(this);
  }

  preload() {
    // Load assets...
  }

  create() {
    this.cameras.main.setBackgroundColor(BLACK_0x);
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      arrowUp: 'up',
      down: 'S',
      arrowDown: 'down',
      left: 'A',
      arrowLeft: 'left',
      right: 'D',
      arrowRight: 'right',
      exit: 'Esc'
    });
    gestureDetection(this.input, this.handleGesture);

    // TODO: Change this scene to 'SOLO' game mode
    // TODO: method to initialise different game modes -> or implement the different game modes as different scenes!
    // TODO: side length is not needed -> just calculate from grid size and window length

    this.gameDimensions = getDimensions(this.game);

    this.maze = new Maze(this.settings.gridSize);

    // The length of the grid unit (including borders)
    this.sideLength =
      (this.gameDimensions.screenLength - 2) / this.settings.gridSize;

    // The border for the maze is 1
    this.graphics = this.add.graphics({
      x: 1,
      y: 1
    });

    this.playerPos = {
      x: 0,
      y: 0
    };

    this.endPoint = {
      x: this.settings.gridSize - 1,
      y: this.settings.gridSize - 1
    };

    this.drawMaze();
    this.drawPlayer(this.playerPos, GOLD_0x);

    this.timer = new Date().getTime();
  }

  drawMaze() {
    this.graphics.fillStyle(WHITE_0x);
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
    // Draw the end block
    this.graphics.fillStyle(BLACK_0x);
    this.graphics.fillRect(
      this.endPoint.x * this.sideLength + 1,
      this.endPoint.y * this.sideLength + 1,
      this.sideLength - 2,
      this.sideLength - 2
    );
  }

  handleGesture(gesture) {
    if (gesture === GESTURES.SWIPE_LEFT) {
      this.updateMovement(this.directions.LEFT);
    } else if (gesture === GESTURES.SWIPE_RIGHT) {
      this.updateMovement(this.directions.RIGHT);
    } else if (gesture === GESTURES.SWIPE_UP) {
      this.updateMovement(this.directions.UP);
    } else if (gesture === GESTURES.SWIPE_DOWN) {
      this.updateMovement(this.directions.DOWN);
    }
  }

  updateMovement(direction) {
    let prevPos = { ...this.playerPos };
    if (direction === this.directions.UP) {
      this.playerPos.y -= 1;
      if (this.playerPos.y < 0) {
        this.playerPos.y = 0;
      }
    } else if (direction === this.directions.DOWN) {
      this.playerPos.y += 1;
      if (this.playerPos.y > this.settings.gridSize - 1) {
        this.playerPos.y = this.settings.gridSize - 1;
      }
    } else if (direction === this.directions.LEFT) {
      this.playerPos.x -= 1;
      if (this.playerPos.x < 0) {
        this.playerPos.x = 0;
      }
    } else if (direction === this.directions.RIGHT) {
      this.playerPos.x += 1;
      if (this.playerPos.x > this.settings.gridSize - 1) {
        this.playerPos.x = this.settings.gridSize - 1;
      }
    }
    if (
      this.maze.isEdge([
        `${prevPos.x},${prevPos.y}`,
        `${this.playerPos.x},${this.playerPos.y}`
      ])
    ) {
      this.drawPlayer(prevPos, WHITE_0x);
      this.drawPlayer(this.playerPos, GOLD_0x);
    } else {
      this.playerPos = prevPos;
    }
    // Check if player is in the finish position, if yes, finish game
    if (
      this.playerPos.x === this.endPoint.x &&
      this.playerPos.y === this.endPoint.y
    ) {
      this.scene.start('EndScreen', {
        settings: this.settings,
        results: {
          gameMode: 0,
          time: Math.floor((new Date().getTime() - this.timer) / 1000)
        }
      });
    }
  }

  /**
   * Draw the player
   * @param {Object} position Object with fields x and y (coordinates)
   * @param {Number} colour Hexadecimal colour
   */
  drawPlayer(position, colour) {
    this.graphics.fillStyle(colour);
    this.graphics.fillRect(
      position.x * this.sideLength + 1,
      position.y * this.sideLength + 1,
      this.sideLength - 2,
      this.sideLength - 2
    );
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
      this.scene.start('MainMenu', this.settings);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)
    ) {
      this.updateMovement(this.directions.UP);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.down) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowDown)
    ) {
      this.updateMovement(this.directions.DOWN);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.left) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowLeft)
    ) {
      this.updateMovement(this.directions.LEFT);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.right) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowRight)
    ) {
      this.updateMovement(this.directions.RIGHT);
    }
  }
}

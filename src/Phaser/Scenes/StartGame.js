import Phaser from 'phaser';
import { BLACK_0x, GRAY_0x } from '../../common/colours';
import GameMaze from '../Game/gameMaze';
import Character from '../Game/character';
import { GESTURES, gestureDetection } from '../Game/gestures';

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

    // The border for the maze is 1
    this.graphics = this.add.graphics({
      x: 1,
      y: 1
    });

    this.maze = new GameMaze(this.game, this.graphics, this.settings.gridSize);

    let initialPosition = {
      x: 0,
      y: 0
    };
    this.character = new Character(this.maze, initialPosition);

    this.endPoint = {
      x: this.settings.gridSize - 1,
      y: this.settings.gridSize - 1
    };

    this.maze.drawMaze();

    // Draw the endpoint
    this.maze.fillGrid(this.endPoint, GRAY_0x);

    // Draw the player
    this.character.drawCharacter();

    this.timer = new Date().getTime();
  }

  handleGesture(gesture) {
    if (gesture === GESTURES.SWIPE_LEFT) {
      this.updateMovement(Character.DIRECTIONS.LEFT);
    } else if (gesture === GESTURES.SWIPE_RIGHT) {
      this.updateMovement(Character.DIRECTIONS.RIGHT);
    } else if (gesture === GESTURES.SWIPE_UP) {
      this.updateMovement(Character.DIRECTIONS.UP);
    } else if (gesture === GESTURES.SWIPE_DOWN) {
      this.updateMovement(Character.DIRECTIONS.DOWN);
    }
  }

  updateMovement(direction) {
    // Move the character
    this.character.moveCharacter(direction);
    // Check if player is in the finish position, if yes, finish game
    if (
      this.character.position.x === this.endPoint.x &&
      this.character.position.y === this.endPoint.y
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

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
      this.scene.start('MainMenu', this.settings);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)
    ) {
      this.updateMovement(Character.DIRECTIONS.UP);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.down) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowDown)
    ) {
      this.updateMovement(Character.DIRECTIONS.DOWN);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.left) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowLeft)
    ) {
      this.updateMovement(Character.DIRECTIONS.LEFT);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.keys.right) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowRight)
    ) {
      this.updateMovement(Character.DIRECTIONS.RIGHT);
    }
  }
}

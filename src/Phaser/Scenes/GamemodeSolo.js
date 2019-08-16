import Phaser from 'phaser';
import { BLACK_0x, GRAY_0x } from '../Common/colours';
import GameMaze from '../Game/gameMaze';
import Character from '../Game/character';
import { GESTURES, gestureDetection } from '../Game/gestures';

export default class GamemodeSolo extends Phaser.Scene {
  constructor() {
    super('GamemodeSolo');
  }

  init(data) {
    this.settings = data;
    this.handleGesture = this.handleGesture.bind(this);
    this.actionClock = 0;
    this.actionCooldown = 100; // Time in milliseconds
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

    this.graphics = this.add.graphics();

    this.maze = new GameMaze(this.game, this.graphics, this.settings.gridSize);

    let initialPosition = {
      x: 0,
      y: 0
    };
    this.character = new Character(this.maze, initialPosition, {
      smoothMovement: true
    });

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

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_LEFT) {
      this.updateMovement(Character.DIRECTIONS.LEFT);
    } else if (detection.gesture === GESTURES.SWIPE_RIGHT) {
      this.updateMovement(Character.DIRECTIONS.RIGHT);
    } else if (detection.gesture === GESTURES.SWIPE_UP) {
      this.updateMovement(Character.DIRECTIONS.UP);
    } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
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

    if (new Date().getTime() - this.actionClock > this.actionCooldown) {
      if (this.keys.up.isDown || this.keys.arrowUp.isDown) {
        this.updateMovement(Character.DIRECTIONS.UP);
        this.actionClock = new Date().getTime();
      } else if (this.keys.down.isDown || this.keys.arrowDown.isDown) {
        this.updateMovement(Character.DIRECTIONS.DOWN);
        this.actionClock = new Date().getTime();
      } else if (this.keys.left.isDown || this.keys.arrowLeft.isDown) {
        this.updateMovement(Character.DIRECTIONS.LEFT);
        this.actionClock = new Date().getTime();
      } else if (this.keys.right.isDown || this.keys.arrowRight.isDown) {
        this.updateMovement(Character.DIRECTIONS.RIGHT);
        this.actionClock = new Date().getTime();
      }
    }

    this.character.update();
  }
}

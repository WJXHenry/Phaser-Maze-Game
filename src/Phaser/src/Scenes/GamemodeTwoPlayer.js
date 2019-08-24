import Phaser from 'phaser';
import { BLACK_0x, BLUE_0x, GREEN_0x, BLUE, GREEN } from '../Common/colours';
import GameMaze from '../Game/gameMaze';
import Character from '../Game/character';
import { GESTURES, gestureDetection } from '../Game/gestures';
import { GAMEMODES } from '../Game/gameSettings';

export default class GamemodeTwoPlayer extends Phaser.Scene {
  constructor() {
    super('GamemodeTwoPlayer');
  }

  init(data) {
    this.settings = data;
    this.handleGesture = this.handleGesture.bind(this);
    this.p1ActionClock = 0;
    this.p2ActionClock = 0;
    this.actionCooldown = 100; // Time in milliseconds
  }

  preload() {
    // Load assets...
  }

  create() {
    this.cameras.main.setBackgroundColor(BLACK_0x);
    this.keys = this.input.keyboard.addKeys({
      p1Up: 'up',
      p2Up: 'W',
      p1Down: 'down',
      p2Down: 'S',
      p1Left: 'left',
      p2Left: 'A',
      p1Right: 'right',
      p2Right: 'D',
      exit: 'Esc'
    });
    this.screenHalfway = this.game.config.width / 2;
    gestureDetection(this.input, this.handleGesture);

    this.graphics = this.add.graphics();

    this.maze = new GameMaze(this.game, this.graphics, this.settings.gridSize);

    let positions = this.generateRandomPositions();

    let p1InitialPosition = positions.p1;
    let p2InitialPosition = positions.p2;
    this.p1EndPoint = positions.p2;
    this.p2EndPoint = positions.p1;

    this.player1 = new Character(this.maze, p1InitialPosition, {
      smoothMovement: true,
      colour: BLUE_0x
    });
    this.player2 = new Character(this.maze, p2InitialPosition, {
      smoothMovement: true,
      colour: GREEN_0x
    });

    this.maze.drawMaze();

    // Draw the players
    this.player1.drawCharacter();
    this.player2.drawCharacter();

    this.timer = new Date().getTime();
  }

  generateRandomPositions() {
    let furthestPoint = this.settings.gridSize - 1;
    let position1 = {
      p1: {
        x: 0,
        y: 0
      },
      p2: {
        x: furthestPoint,
        y: furthestPoint
      }
    };
    let position2 = {
      p1: {
        x: furthestPoint,
        y: 0
      },
      p2: {
        x: 0,
        y: furthestPoint
      }
    };
    let position3 = {
      p1: {
        x: 0,
        y: furthestPoint
      },
      p2: {
        x: furthestPoint,
        y: 0
      }
    };
    let position4 = {
      p1: {
        x: furthestPoint,
        y: furthestPoint
      },
      p2: {
        x: 0,
        y: 0
      }
    };
    let positions = [position1, position2, position3, position4];
    return positions[Math.floor(Math.random() * 4)];
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_LEFT) {
      if (detection.origin.y > this.screenHalfway) {
        this.p1UpdateMovement(Character.DIRECTIONS.LEFT);
      } else {
        this.p2UpdateMovement(Character.DIRECTIONS.LEFT);
      }
    } else if (detection.gesture === GESTURES.SWIPE_RIGHT) {
      if (detection.origin.y > this.screenHalfway) {
        this.p1UpdateMovement(Character.DIRECTIONS.RIGHT);
      } else {
        this.p2UpdateMovement(Character.DIRECTIONS.RIGHT);
      }
    } else if (detection.gesture === GESTURES.SWIPE_UP) {
      if (detection.origin.y > this.screenHalfway) {
        this.p1UpdateMovement(Character.DIRECTIONS.UP);
      } else {
        this.p2UpdateMovement(Character.DIRECTIONS.UP);
      }
    } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
      if (detection.origin.y > this.screenHalfway) {
        this.p1UpdateMovement(Character.DIRECTIONS.DOWN);
      } else {
        this.p2UpdateMovement(Character.DIRECTIONS.DOWN);
      }
    }
  }

  p1UpdateMovement(direction) {
    // Move the character
    this.player1.moveCharacter(direction);
    // Check if player is in the finish position, if yes, finish game
    if (
      this.player1.position.x === this.p1EndPoint.x &&
      this.player1.position.y === this.p1EndPoint.y
    ) {
      this.scene.start('EndScreen', {
        settings: this.settings,
        results: {
          gameMode: GAMEMODES.TWO_PLAYER.id,
          message: 'Player 1 wins!',
          messageColour: BLUE
        }
      });
    }
  }

  p2UpdateMovement(direction) {
    // Move the character
    this.player2.moveCharacter(direction);
    // Check if player is in the finish position, if yes, finish game
    if (
      this.player2.position.x === this.p2EndPoint.x &&
      this.player2.position.y === this.p2EndPoint.y
    ) {
      this.scene.start('EndScreen', {
        settings: this.settings,
        results: {
          gameMode: GAMEMODES.TWO_PLAYER.id,
          message: 'Player 2 wins!',
          messageColour: GREEN
        }
      });
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.exit)) {
      this.scene.start('MainMenu', this.settings);
    }

    let dateNow = new Date().getTime();

    if (dateNow - this.p1ActionClock > this.actionCooldown) {
      if (this.keys.p1Up.isDown) {
        this.p1UpdateMovement(Character.DIRECTIONS.UP);
        this.p1ActionClock = new Date().getTime();
      } else if (this.keys.p1Down.isDown) {
        this.p1UpdateMovement(Character.DIRECTIONS.DOWN);
        this.p1ActionClock = new Date().getTime();
      } else if (this.keys.p1Left.isDown) {
        this.p1UpdateMovement(Character.DIRECTIONS.LEFT);
        this.p1ActionClock = new Date().getTime();
      } else if (this.keys.p1Right.isDown) {
        this.p1UpdateMovement(Character.DIRECTIONS.RIGHT);
        this.p1ActionClock = new Date().getTime();
      }
    }

    if (dateNow - this.p2ActionClock > this.actionCooldown) {
      if (this.keys.p2Up.isDown) {
        this.p2UpdateMovement(Character.DIRECTIONS.UP);
        this.p2ActionClock = new Date().getTime();
      } else if (this.keys.p2Down.isDown) {
        this.p2UpdateMovement(Character.DIRECTIONS.DOWN);
        this.p2ActionClock = new Date().getTime();
      } else if (this.keys.p2Left.isDown) {
        this.p2UpdateMovement(Character.DIRECTIONS.LEFT);
        this.p2ActionClock = new Date().getTime();
      } else if (this.keys.p2Right.isDown) {
        this.p2UpdateMovement(Character.DIRECTIONS.RIGHT);
        this.p2ActionClock = new Date().getTime();
      }
    }

    this.player1.update();
    this.player2.update();
    if (!this.player1.isUpdating()) {
      // Redraw the endpoints in case players moved over them
      this.maze.fillGrid(this.p2EndPoint, GREEN_0x);
      this.player1.drawCharacter();
    }
    if (!this.player2.isUpdating()) {
      this.maze.fillGrid(this.p1EndPoint, BLUE_0x);
      this.player2.drawCharacter();
    }
  }
}

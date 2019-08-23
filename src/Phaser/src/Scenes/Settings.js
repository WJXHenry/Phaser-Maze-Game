import Phaser from 'phaser';
import { getDimensions } from '../Game/gameSettings';
import { BLACK, GOLD, GRAY, WHITE } from '../Common/colours';
import { GAMEMODES, getGamemodeInfo } from '../Game/gameSettings';
import { GESTURES, gestureDetection } from '../Game/gestures';

export default class Settings extends Phaser.Scene {
  constructor() {
    super('Settings');
  }

  init(data) {
    this.settings = data;
    this.handleGesture = this.handleGesture.bind(this);
  }

  preload() {
    this.load.setBaseURL(
      'https://raw.githubusercontent.com/wjxhenry/website/master'
    );
    // Load assets...
  }

  create() {
    this.cameras.main.setBackgroundColor(WHITE);
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      arrowUp: 'up',
      down: 'S',
      arrowDown: 'down',
      left: 'A',
      arrowLeft: 'left',
      right: 'D',
      arrowRight: 'right',
      select: 'Enter'
    });
    gestureDetection(this.input, this.handleGesture);

    this.gameDimensions = getDimensions(this.game);

    this.choice = 0;

    this.doubleTapTimer = 0;
    this.doubleTapCooldown = 200; // 200 milliseconds between each tap

    let title = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 4,
      'Settings',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize1
      }
    );
    title.setOrigin(0.5, 0.5);
    let gridSize = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 8,
      `Grid size: ${this.settings.gridSize}`,
      {
        fontFamily: 'Ubuntu',
        fill: GOLD,
        fontSize: this.gameDimensions.textSize3
      }
    );
    gridSize.setOrigin(0.5, 0.5);
    let sideLength = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 11,
      `Side length: ${this.settings.sideLength}`,
      {
        fontFamily: 'Ubuntu',
        fill: GRAY,
        fontSize: this.gameDimensions.textSize3
      }
    );
    sideLength.setOrigin(0.5, 0.5);
    let gameMode = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 14,
      getGamemodeInfo(this.settings.gameMode).text,
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize3
      }
    );
    gameMode.setOrigin(0.5, 0.5);
    let menuReturn = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 17,
      'Return',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize3
      }
    );
    menuReturn.setOrigin(0.5, 0.5);

    this.options = [gridSize, gameMode, menuReturn];
  }

  handleGesture(detection) {
    if (detection.gesture === GESTURES.SWIPE_UP) {
      this.updateChoice(-1);
    } else if (detection.gesture === GESTURES.SWIPE_DOWN) {
      this.updateChoice(1);
    } else if (detection.gesture === GESTURES.SWIPE_RIGHT) {
      this.updateSelection(1);
    } else if (detection.gesture === GESTURES.SWIPE_LEFT) {
      this.updateSelection(-1);
    } else if (detection.gesture === GESTURES.SINGLE_TAP) {
      if (new Date().getTime() - this.doubleTapTimer < this.doubleTapCooldown) {
        if (this.choice === 2) {
          this.scene.start('MainMenu', this.settings);
        }
      }
      this.doubleTapTimer = new Date().getTime();
    }
  }

  update() {
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)
    ) {
      this.updateChoice(-1);
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.down) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowDown)
    ) {
      this.updateChoice(1);
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.right) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowRight)
    ) {
      this.updateSelection(1);
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.keys.left) ||
      Phaser.Input.Keyboard.JustDown(this.keys.arrowLeft)
    ) {
      this.updateSelection(-1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.select)) {
      if (this.choice === 2) {
        this.scene.start('MainMenu', this.settings);
      }
    }
  }

  updateChoice(direction) {
    let newChoice = this.choice + direction;
    if (newChoice > -1 && newChoice < this.options.length) {
      this.options[this.choice].setFill(BLACK);
      this.options[newChoice].setFill(GOLD);
      this.choice = newChoice;
    }
  }

  updateSelection(direction) {
    if (this.choice === 0) {
      this.updateGridSize(direction);
    } else if (this.choice === 1) {
      this.updateGameMode(direction);
    }
    // else if (this.choice === 1) {
    //   this.updateSideLength(direction);
    // }
  }

  updateGridSize(direction) {
    let newGridSize = this.settings.gridSize + direction;
    if (
      newGridSize > this.settings.minGridSize - 1 &&
      newGridSize < this.settings.maxGridSize + 1
    ) {
      this.options[0].setText(`Grid size: ${newGridSize}`);
      this.settings.gridSize = newGridSize;
    }
  }

  updateSideLength(direction) {
    let newSideLength = this.settings.sideLength + direction;
    if (
      newSideLength > this.settings.minSideLength - 1 &&
      newSideLength < this.settings.maxSideLength + 1
    ) {
      this.options[1].setText(`Side length: ${newSideLength}`);
      this.settings.sideLength = newSideLength;
    }
  }

  updateGameMode(direction) {
    let newGameMode = this.settings.gameMode + direction;
    if (newGameMode > -1 && newGameMode < Object.keys(GAMEMODES).length) {
      this.options[1].setText(getGamemodeInfo(newGameMode).text);
      this.settings.gameMode = newGameMode;
    }
  }
}

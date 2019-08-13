import Phaser from 'phaser';
import { initSettings, getDimensions } from '../Game/gameSettings';
import { BLACK, GOLD, GRAY, WHITE } from '../../common/colours';
import { GESTURES, gestureDetection } from '../Game/gestures';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  init(data) {
    this.settings = { ...initSettings(), ...data };
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
      'Yet Another Maze',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize2
      }
    );
    title.setOrigin(0.5, 0.5);
    let startGame = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 8,
      'Start Game',
      {
        fontFamily: 'Ubuntu',
        fill: GOLD,
        fontSize: this.gameDimensions.textSize3
      }
    );
    startGame.setOrigin(0.5, 0.5);
    let settings = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 12,
      'Settings',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize3
      }
    );
    settings.setOrigin(0.5, 0.5);
    let exit = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 16,
      'Exit',
      {
        fontFamily: 'Ubuntu',
        fill: GRAY,
        fontSize: this.gameDimensions.textSize3
      }
    );
    exit.setOrigin(0.5, 0.5);

    this.options = [
      { text: startGame, scene: 'StartGame' },
      { text: settings, scene: 'Settings' }
      // { text: exit, scene: 'Movement' }
    ];
  }

  handleGesture(gesture) {
    if (gesture === GESTURES.SWIPE_UP) {
      this.updateChoice(-1);
    } else if (gesture === GESTURES.SWIPE_DOWN) {
      this.updateChoice(1);
    } else if (gesture === GESTURES.SINGLE_TAP) {
      if (new Date().getTime() - this.doubleTapTimer < this.doubleTapCooldown) {
        this.scene.start(this.options[this.choice].scene, this.settings);
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
    if (Phaser.Input.Keyboard.JustDown(this.keys.select)) {
      this.scene.start(this.options[this.choice].scene, this.settings);
    }
  }

  updateChoice(direction) {
    let newChoice = this.choice + direction;
    if (newChoice > -1 && newChoice < this.options.length) {
      this.options[this.choice].text.setFill(BLACK);
      this.options[newChoice].text.setFill(GOLD);
      this.choice = newChoice;
    }
  }
}

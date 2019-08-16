import Phaser from 'phaser';
import { getDimensions } from '../Game/gameSettings';
import { BLACK, WHITE } from '../Common/colours';
import { GESTURES, gestureDetection } from '../Game/gestures';

export default class GamemodeEscape extends Phaser.Scene {
  constructor() {
    super('GamemodeEscape');
  }

  init(data) {
    this.settings = data.settings;
    this.handleGesture = this.handleGesture.bind(this);
  }

  create() {
    this.cameras.main.setBackgroundColor(WHITE);
    this.keys = this.input.keyboard.addKeys({
      continue: 'Enter'
    });
    gestureDetection(this.input, this.handleGesture);

    this.gameDimensions = getDimensions(this.game);

    this.drawScreen();
  }

  drawScreen() {
    let toBeImplemented = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 4,
      'Escape (WIP)',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize1
      }
    );
    toBeImplemented.setOrigin(0.5, 0.5);
  }

  handleGesture(gesture) {
    if (gesture === GESTURES.SINGLE_TAP) {
      this.scene.start('MainMenu', this.settings);
    }
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.continue)) {
      this.scene.start('MainMenu', this.settings);
    }
  }
}

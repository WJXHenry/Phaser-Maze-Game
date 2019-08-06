import Phaser from 'phaser';
import { getDimensions } from '../Utils/gameSettings';
import { BLACK, WHITE } from '../../common/colours';

export default class EndScreen extends Phaser.Scene {
  constructor() {
    super('EndScreen');
  }

  init(data) {
    console.log(data);
    this.settings = data.settings;
    this.results = data.results;
    console.log(this.settings);
    console.log(this.results);
    this.gameModes = {
      SOLO: 0,
      TWO_PLAYER: 1,
      RACE: 2,
      CHASE: 3,
      ESCAPE: 4
    };
  }

  create() {
    this.cameras.main.setBackgroundColor(WHITE);
    this.keys = this.input.keyboard.addKeys({
      continue: 'Enter'
    });

    this.gameDimensions = getDimensions(this.game);

    this.drawScreen();
  }

  drawScreen() {
    let gameOver = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 4,
      'Game Over',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize1
      }
    );
    gameOver.setOrigin(0.5, 0.5);

    if (this.results.gameMode === this.gameModes.SOLO) {
      let time = this.add.text(
        this.gameDimensions.screenCenter,
        this.gameDimensions.screenSpaceUnit * 9,
        `Time: ${this.results.time} s`,
        {
          fontFamily: 'Ubuntu',
          fill: BLACK,
          fontSize: this.gameDimensions.textSize2
        }
      );
      time.setOrigin(0.5, 0.5);
    } else if (this.results.gameMode === this.gameModes.TWO_PLAYER) {
      // TODO...
    }

    let returnScreen = this.add.text(
      this.gameDimensions.screenCenter,
      this.gameDimensions.screenSpaceUnit * 15,
      'Press enter to exit to menu.',
      {
        fontFamily: 'Ubuntu',
        fill: BLACK,
        fontSize: this.gameDimensions.textSize4
      }
    );
    returnScreen.setOrigin(0.5, 0.5);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.continue)) {
      this.scene.start('MainMenu', this.settings);
    }
  }
}

import Phaser from 'phaser';
import { getDimensions } from '../Utils/gameSettings';
import { WHITE_0x, BLACK_0x, GOLD_0x } from '../../common/colours';

export default class StartGame extends Phaser.Scene {
  constructor() {
    super('StartGame');
  }

  init(data) {
    this.settings = data;
  }

  preload() {
    // Load assets...
  }

  create() {
    this.cameras.main.setBackgroundColor(WHITE_0x);
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      arrowUp: 'up',
      down: 'S',
      arrowDown: 'down',
      left: 'A',
      arrowLeft: 'left',
      right: 'D',
      arrowRight: 'right',
      select: 'Space'
    });

    this.gameDimensions = getDimensions(this.game);
    // TODO: side length is not needed -> just calculate from grid size and window length

    // TODO: Draw the maze!

    let graphics = this.add.graphics({
      x: 2.5,
      y: 2.5,
      fillStyle: { color: GOLD_0x },
      lineStyle: {
        width: 5,
        color: GOLD_0x
      }
    });
    let rect = new Phaser.Geom.Rectangle(0, 0, 50, 50);
    graphics.strokeRectShape(rect);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keys.select)) {
      console.log(this.gameDimensions);
      console.log(this.settings);
    }
  }
}

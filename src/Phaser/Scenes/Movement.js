import Phaser from 'phaser';

export default class Movement extends Phaser.Scene {
  constructor() {
    super('Movement');
  }

  updateMovement(sprite, direction) {
    if (direction === 'up') {
      sprite.y -= 2;
      if (sprite.y < 0) {
        sprite.y = 0;
      }
    } else if (direction === 'down') {
      sprite.y += 2;
      if (sprite.y > 600) {
        sprite.y = 600;
      }
    } else if (direction === 'left') {
      sprite.x -= 2;
      if (sprite.x < 0) {
        sprite.x = 0;
      }
    } else if (direction === 'right') {
      sprite.x += 2;
      if (sprite.x > 800) {
        sprite.x = 800;
      }
    }
  }

  // redrawRect(prevPos, newPos, drawGraphics, redrawGraphics) {
  //   let prevRect = new Phaser.Geom.Rectangle(prevPos.x, prevPos.y, 20, 20);
  //   let newRect = new Phaser.Geom.Rectangle(newPos.x, newPos.y, 20, 20);
  //   redrawGraphics.fillRectShape(prevRect);
  //   drawGraphics.fillRectShape(newRect);
  // }

  preload() {
    this.load.setBaseURL(
      'https://raw.githubusercontent.com/wjxhenry/website/master'
    );
    // Load assets
    this.load.image('player', 'assets/test/red.png');
  }

  create() {
    // this.cameras.main.setBackgroundColor('rgba(125,0,255,1)'); // Set rgb background colour
    // this.cameras.main.setBackgroundColor('#800080');
    // this.cameras.main.setBackgroundColor('#ffffff');
    this.cameras.main.setBackgroundColor('#000000');
    this.counter = 0;
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D'
    });
    // this.playerPos = { x: 0, y: 0 };
    var keyObj = this.input.keyboard.addKey('ESC');
    keyObj.on('down', () => {
      this.scene.start('MainMenu');
      //   Fix the issue where there are multiple logs??
    });
    this.player = this.add.sprite(0, 0, 'player');
    console.log('Start Movement');
    // keyObj.on('up', event => {
    //   console.log('W key up');
    // });
  }

  update() {
    this.counter++;
    if (this.counter % 1 === 0) {
      // Clock updates every 60 seconds
      // console.log("Tick")
      this.counter = 0; // Reset counter (just in case of overflow?)
      if (this.keys.up.isDown) {
        console.log('Up');
        this.updateMovement(this.player, 'up');
      }
      if (this.keys.down.isDown) {
        console.log('Down');
        this.updateMovement(this.player, 'down');
      }
      if (this.keys.left.isDown) {
        console.log('Left');
        this.updateMovement(this.player, 'left');
      }
      if (this.keys.right.isDown) {
        console.log('Right');
        this.updateMovement(this.player, 'right');
      }
      // console.log(this.playerPos);
    }
    // console.log("TestScene: update")
  }
}

import Phaser from 'phaser';

export default class TestScene extends Phaser.Scene {
  constructor() {
    super('TestScene'); // Set the key name
  }

  preload() {
    this.load.setBaseURL(
      'https://raw.githubusercontent.com/wjxhenry/website/master'
    );
    // this.load.setBaseURL('https://labs.phaser.io');

    this.load.image('sky', 'assets/test/space3.png');
    this.load.image('logo', 'assets/test/phaser3-logo.png');
    this.load.image('red', 'assets/test/red.png');
    // this.load.image('sky', 'assets/skies/space3.png');
    // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    // this.load.image('red', 'assets/particles/red.png');
  }

  create() {
    console.log(this);

    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);

    var keyObj = this.input.keyboard.addKey('Enter');
    keyObj.on('down', () => {
      console.log('Enter key down');
      console.log('Start "Movement" scene');
      this.scene.start('Movement');
    });
    // keyObj.on('up', event => {
    //   console.log('Enter key up');
    // });
  }

  update() {
    // console.log("TestScene: update")
  }
}

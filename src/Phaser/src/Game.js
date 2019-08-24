import React from 'react';
import Phaser from 'phaser';
import MainMenu from './Scenes/MainMenu';
import Settings from './Scenes/Settings';
import GamemodeSolo from './Scenes/GamemodeSolo';
import GamemodeTwoPlayer from './Scenes/GamemodeTwoPlayer';
import GamemodeRace from './Scenes/GamemodeRace';
import GamemodeChase from './Scenes/GamemodeChase';
import GamemodeEscape from './Scenes/GamemodeEscape';
import EndScreen from './Scenes/EndScreen';

export default class Game extends React.Component {
  componentDidMount() {
    const dimension = this._getDimensions();
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-parent',
      pixelArt: true,
      width: dimension * 0.8,
      height: dimension * 0.8,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      input: {
        activePointers: 5 // Set the number of allowed active pointers
      },
      scene: [
        MainMenu,
        Settings,
        GamemodeSolo,
        GamemodeTwoPlayer,
        GamemodeRace,
        GamemodeChase,
        GamemodeEscape,
        EndScreen
      ]
    };

    new Phaser.Game(config);
  }

  /**
   * Returns the smaller of window.innerWidth and window.innerHeight
   */
  _getDimensions() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (width < height) {
      return width;
    } else {
      return height;
    }
  }

  render() {
    return <div id="phaser-parent" />;
  }
}

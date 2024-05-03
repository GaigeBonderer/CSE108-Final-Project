// index.js
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

// Get the dimensions of the browser window
const width = window.innerWidth;
const height = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene]
};

new Phaser.Game(config);
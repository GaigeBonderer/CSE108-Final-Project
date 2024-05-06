// index.js
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

// Read data from the HTML element
const gameContainer = document.getElementById('gameContainer');
const userId = gameContainer.getAttribute('data-userid');
const classId = gameContainer.getAttribute('data-classid');

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [new MainScene(userId, classId)]
};

new Phaser.Game(config);
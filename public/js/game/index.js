import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

function preload() {
    this.load.image('sky', 'path/to/sky.png');
}

function create() {
    this.add.image(400, 300, 'sky');
}

function update() {
}

new Phaser.Game(config);
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.add.image(400, 300, 'logo');
        // Add more game objects here
    }

    update() {
        // Game logic updates
    }
}
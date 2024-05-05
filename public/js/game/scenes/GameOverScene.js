import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.add.text(400, 300, 'Game Over', { fontSize: '32px', color: '#FFFFFF' });
    }
}
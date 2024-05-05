// MainScene.js
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor(userId, classId) {
        super('MainScene');
        this.userId = userId;
        this.classId = classId;
    }

    preload() {
        // Load different sprites based on classId as strings
        const spriteMap = {
            'Knight': '/js/game/resources/Knight.png',
            'Ninja': '/js/game/resources/Ninja.png',  // Assume you have a Ninja.png
            'Viking': '/js/game/resources/Viking.png'  // Assume you have a Viking.png
        };
        this.load.image('player', spriteMap[this.classId]);
    }

    create() {
        // Create player sprite
        this.player = this.physics.add.sprite(250, 320, 'player');
        // Set up keyboard input
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Display text to show mouse coordinates
        this.text = this.add.text(10, 10, 'Mouse X: 0\nMouse Y: 0', { font: '16px Arial', fill: '#ffffff' });

        // Tween for rotating player sprite
        //AngleTween = this.tweens.add({
        //    targets: this.player,
        //    angle: 0,
        //    ease: "Bounce.easeInOut",
        //    duration: 500
        //});
    }

    update() {
        // Store mouse coordinates in variables and displays in text
        var mouseX = this.input.mousePointer.x;
        var mouseY = this.input.mousePointer.y;

        this.text.setText('Mouse X: ' + this.input.mousePointer.x + '\nMouse Y: ' + this.input.mousePointer.y);

        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, mouseX, mouseY);
        this.player.setRotation(angle);

        // Reset player velocity
        this.player.setVelocity(0);

        // Handle keyboard input for movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        }

        // On click rotate player, deal damage
        //this.input.on('pointerdown', () => {
        //    console.log("click");
        //    AngleTween.updateTo("angle", 90, true);
        //});
    }
}
// MainScene.js
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor(userId, classId) {
        super('MainScene');
        this.userId = userId;
        this.classId = classId;
    }

    // making an array that holds all the enemies in the scene
    EnemyArray = [];
    zombies;

    preload() {
        // Load different sprites based on classId as strings
        const spriteMap = {
            'Knight': '/js/game/resources/Knight.png',
            'Ninja': '/js/game/resources/Ninja.png',  // Assume you have a Ninja.png
            'Viking': '/js/game/resources/Viking.png'  // Assume you have a Viking.png
        };
        this.load.image('player', spriteMap[this.classId]);
        this.load.image('zombie', '/js/game/resources/pixil-frame-0 (3).png');
    }

    create() {

        // Create player sprite
        this.player = this.physics.add.sprite(250, 320, 'player');
        this.player.setCollideWorldBounds(true);

        // Spawning zombies and randomizing their locations
        this.zombies = this.physics.add.group({
            key: 'zombie',
            repeat: 5,
            setXY: { x: 100, y: 420, stepX:150 }
        });
        this.zombies.children.iterate(function (child) {
            console.log('Child X: ' + child.x + ', Child Y: ' + child.y);
        });

        // Set up keyboard input
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Display text to show mouse coordinates
        this.mouseText = this.add.text(10, 10, 'Mouse X: 0\nMouse Y: 0', { font: '16px Arial', fill: '#ffffff' });
        this.enemyText = this.add.text(10, 50, 'Number of Enemies: 0', { font: '16px Arial', fill: '#ffffff' });

        // adding enemies to world
        this.EnemyArray[0] = this.physics.add.sprite(250, 420, 'zombie');
        this.EnemyArray[1] = this.physics.add.sprite(350, 420, 'zombie');
    }

    update() {
        // Store mouse coordinates in variables and displays in text
        var mouseX = this.input.mousePointer.x;
        var mouseY = this.input.mousePointer.y;

        //update text information
        this.mouseText.setText('Mouse X: ' + this.input.mousePointer.x + '\nMouse Y: ' + this.input.mousePointer.y);
        this.enemyText.setText('Number of enemies: ' + this.EnemyArray.length);

        // rotate player so that they face cursor
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, mouseX, mouseY);
        this.player.setRotation(angle);

        // Reset player and enemy velocities
        this.player.setVelocity(0);
        this.EnemyArray[0].setVelocity(0);

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
    }
}
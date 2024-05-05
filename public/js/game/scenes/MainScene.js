// MainScene.js
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor(classId) {
        super('MainScene');
        this.classId = classId;
        this.players = {};
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
        // Listen for player movements from the server
        this.socket = io();

        // Create player sprite
        this.player = this.physics.add.sprite(100, 100, 'player');

        this.socket.on('playerConnected', (playerInfo) => {
            this.players[playerInfo.playerId] = this.add.sprite(playerInfo.x, playerInfo.y, 'player');
        });

        // Set up keyboard input
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.socket.on('playerMoved', (movement) => {
            if (this.players[movement.playerId]) {
                this.players[movement.playerId].setPosition(movement.x, movement.y);
            } else {
                this.players[movement.playerId] = this.add.sprite(movement.x, movement.y, 'player');
            }
        });
    }

    update() {
        // Handle keyboard input for movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        } else {
            this.player.setVelocityY(0);
        }

        // Emit player movement to the server
        this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y });

        this.socket.on('playerDisconnected', (disconnectInfo) => {
            if (this.players[disconnectInfo.playerId]) {
                this.players[disconnectInfo.playerId].destroy();
                delete this.players[disconnectInfo.playerId];
            }
        });
    }
}
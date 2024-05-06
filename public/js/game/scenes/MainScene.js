// MainScene.js
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    constructor(userId, classId) {
        super('MainScene');
        this.userId = userId;
        this.classId = classId;
        this.players = {};
        this.playerHP = this.getPlayerHP(classId);
        this.playerDamage = this.getPlayerDamage(classId);    
    }

    getPlayerHP(classId) {
        const hpMap = {
            'Knight': 100,
            'Ninja': 80,
            'Viking': 120
        };
        return hpMap[classId];
    }

    getPlayerDamage(classId) {
        const damageMap = {
            'Knight': 20,
            'Ninja': 25,
            'Viking': 15
        };
        return damageMap[classId];
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

        //background color
        this.cameras.main.setBackgroundColor(0x90EE90); //green

        // Create player sprite
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.hp = this.playerHP;
        this.player.setSize(64, 64);
        this.physics.world.enable(this.player);
        this.socket.emit('spawn');
        this.socket.on('init', (socketId) => {
            this.player.playerId = socketId;
        });

        this.physics.add.overlap(this.player, Object.values(this.players), (player, otherPlayer) => {
            // Move the player back to its previous position to prevent passing through
            player.setPosition(player.x - player.body.deltaX(), player.y - player.body.deltaY());
            player.body.stop(); // Stop player movement
        });

        // Listen for other player connections
        this.socket.on('playerConnected', (playerInfo) => {
            const otherPlayer = this.physics.add.sprite(playerInfo.x, playerInfo.y, 'player');
            otherPlayer.hp = this.playerHP;
            otherPlayer.setSize(64, 64);
            otherPlayer.playerId = playerInfo.playerId;
            this.physics.world.enable(otherPlayer);
            this.players[playerInfo.playerId] = otherPlayer;
            console.log(this.players[playerInfo.playerId]);

            this.physics.add.overlap(this.player, Object.values(this.players), (player, otherPlayer) => {
                // Move the player back to its previous position to prevent passing through
                player.setPosition(player.x - player.body.deltaX(), player.y - player.body.deltaY());
                player.body.stop(); // Stop player movement
            });
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
                const newPlayer = this.physics.add.sprite(movement.x, movement.y, 'player');
                otherPlayer.hp = this.playerHP;
                newPlayer.setSize(64, 64);
                this.physics.world.enable(newPlayer);
                this.players[movement.playerId] = newPlayer;

                this.physics.add.overlap(this.player, Object.values(this.players), (player, otherPlayer) => {
                    // Move the player back to its previous position to prevent passing through
                    player.setPosition(player.x - player.body.deltaX(), player.y - player.body.deltaY());
                    player.body.stop(); // Stop player movement
                });
            }
        });

        // Listen for left click input
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.attack();
            }
        });

        this.socket.on('playerDied', (data) => {
            console.log(data.playerId);
            console.log(this.player.playerId);
            if (data.playerId == this.player.playerId) {
                // Redirect the killed player to '/class/{user.id}'
                window.location.href = `/class/${this.userId}`;
            }
        });
        
        this.socket.on('playerDisconnected', (disconnectInfo) => {
            if (this.players[disconnectInfo.playerId]) {
                this.players[disconnectInfo.playerId].destroy();
                delete this.players[disconnectInfo.playerId];
            }
        });
    }

    attack() {
        // Limit player attack rate to once per second
        if (!this.lastAttack || this.time.now - this.lastAttack >= 1000) {
            console.log(this.player.playerId);
            console.log('attack');

            // Set last attack time
            this.lastAttack = this.time.now;
    
            // Find any entity within attack range
            const entitiesInRange = Object.values(this.players).filter(player => {
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, player.x, player.y);
                return distance <= 128; // Assuming 128 units is your attack range
            });
    
            // Apply damage to entities in range
            entitiesInRange.forEach(entity => {
                entity.hp -= this.playerDamage;
                if (entity.hp <= 0) {
                    this.players[entity.playerId].destroy();
                    delete this.players[entity.playerId];
                    this.socket.emit('playerDied', { playerId: entity.playerId });
                }
            });
        }
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
    }
}
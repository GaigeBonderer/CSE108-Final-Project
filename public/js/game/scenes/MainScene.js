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

    // making an array that holds all the enemies in the scene
    EnemyArray = [];
    zombies;

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
        this.load.image('zombie', '/js/game/resources/Zombie.png');
    }

    create() {

        // Listen for player movements from the server
        this.socket = io();



        // Create player sprite
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
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

        // Display text to show mouse coordinates
        this.mouseText = this.add.text(10, 10, 'Mouse X: 0\nMouse Y: 0', { font: '16px Arial', fill: '#ffffff' });
        this.enemyText = this.add.text(10, 50, 'Number of Enemies: 0', { font: '16px Arial', fill: '#ffffff' });

        // adding enemies to world
        this.EnemyArray[0] = this.physics.add.sprite(250, 420, 'zombie');
        this.EnemyArray[1] = this.physics.add.sprite(350, 420, 'zombie');
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

        // Emit player movement to the server
        this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y });

    }
}
// MainScene.js
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    // globals
    zombies;
    zombArray = [];
    maxZombies = 2;
    zombHealth = 60;
    zombDmg = 5;

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

    // handleZombieCollision(player, zombie) {
    //     // Reduce player health
    //     player.hp -= zombie.damage;
    //     console.log("Zombie ATTACK! Player HP: ", player.hp); // Notify when Zombie attacks
    
    //     // Check if player is dead
    //     if (player.hp <= 0) {
    //         console.log("Player Is Dead! Player: ", this.userId); // Notify when player dies
    //         // Emit death event to server
    //         // this.players[entity.playerId].destroy();
    //         // delete this.players[entity.playerId];
    //         this.socket.emit('playerDied', { playerId: this.player.playerId });
    //     }
    // }

    preload() {
        // Load different sprites based on classId as strings
        const spriteMap = {
            'Knight': '/js/game/resources/Knight.png',
            'Ninja': '/js/game/resources/Ninja.png',  // Assume you have a Ninja.png
            'Viking': '/js/game/resources/Viking.png'  // Assume you have a Viking.png
        };
        this.load.image('player', spriteMap[this.classId]);
        this.load.image('zombie', '/js/game/resources/Zombie.png');
        this.load.image('dungeonBackground', '/js/game/resources/DungeonBackground.png');
    }

    create() {

        //render server background:
        this.add.image(0, 0, 'dungeonBackground').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);


        // Listen for player movements from the server
        this.socket = io();

        // spawn coordinates for players
        var startX = (this.game.config.width / 2) + Phaser.Math.Between(-200, 200);
        var startY = (this.game.config.height / 2) + Phaser.Math.Between(-200, 200);

        // Create player sprite
        this.player = this.physics.add.sprite(startX, startY, 'player');
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
        this.zombies = this.physics.add.group();
        this.spawnZombies(this.maxZombies);
        this.zombArray = this.zombies.getChildren();

        // Set collision between player and zombies
        this.physics.add.collider(this.player, this.zombies);

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
                this.attackZombies();
            }
        });

        this.socket.on('playerDied', (data) => {
            // console.log(data.playerId);
            // console.log(this.player.playerId);

            console.log("Plaer has Died FUNCTION ---------------------");

            if (data.playerId == this.player.playerId) {

                console.log("Plaer has Died REDIRECT ---------------------");

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

        this.enemyText = this.add.text(10, 50, 'Number of Enemies: 0', { font: '16px Arial', fill: '#ffffff' });

        
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
        this.enemyText.setText('Number of enemies: ' + this.zombies.countActive(true));

        // Check if any zombies are colliding with the player
        this.physics.overlap(this.player, this.zombies, this.handleZombieCollision, null, this);

        

        // rotate player so that they face cursor
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, mouseX, mouseY);
        this.player.setRotation(angle);

        // check to see if spawning a zombie is needed
        if (this.zombies.countActive(true) < this.maxZombies) {
            var numZomNeeded = this.maxZombies - this.zombies.countActive(true)
            this.spawnZombies(numZomNeeded);
        }

        this.zombies.getChildren().forEach(zombie => {
            zombie.updateVelocity(this.player);
            zombie.attack(this.player); // Zombie attacks players
        });


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

    attackZombies() {
        // Find any zombies within attack range
        const zombiesInRange = this.zombies.getChildren().filter(zombie => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, zombie.x, zombie.y);
            return distance <= 128; // Assuming 128 units is your attack range
        });

        // Apply damage to zombies in range
        zombiesInRange.forEach(zombie => {
            zombie.health -= this.playerDamage;
            if (zombie.health <= 0) {
                // Destroy the zombie
                zombie.destroy();
                // Optionally, you may want to remove the zombie from any management system you have
                // For example, if you're keeping track of zombies in an array, remove it from there
                const index = this.zombArray.indexOf(zombie);
                if (index !== -1) {
                    this.zombArray.splice(index, 1);
                }
                // Optionally, emit an event to notify other players or the server that the zombie died
            }
        });
    }

    // Helper Function to spawn Zombies
    spawnZombies(count) {
        // Spawn enemies randomly within the display window
        for (var i = 0; i < count; i++) {
            var x = Phaser.Math.Between(150, this.game.config.width - 150);
            var y = Phaser.Math.Between(150, this.game.config.height - 150);

            var zombie = new Zombie(this, x, y);

            this.zombies.add(zombie);
        }
    }

    

}

// Define your custom Zombie class
class Zombie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'zombie'); // Assuming 'zombie' is the key for your zombie sprite
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.health = 60; // Initial health of the zombie
        this.damage = 5; // Amount of damage the zombie inflicts
        this.lastAttack = 0; // Timestamp of the last attack
        this.attackRate = 1000; // One attack per 1000 milliseconds

        // Enable collision with world bounds for the zombie
        this.body.setCollideWorldBounds(true);
    }

    updateVelocity(player) {
        const zombAng = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        var veloX = Math.cos(zombAng) * 100;
        var veloY = Math.sin(zombAng) * 100;
        this.setRotation(zombAng);
        this.setVelocity(veloX, veloY);
    }
    
    attack(player) {
        if (this.scene.time.now - this.lastAttack >= this.attackRate) {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
            if (distance <= 128) { // Check if within attack range
                this.lastAttack = this.scene.time.now; // Update last attack time
                console.log('Zombie attacks player!');
                player.hp -= this.damage;
                if (player.hp <= 0) {
                    console.log(`Player ${player.playerId} is dead!`);
                    //his.scene.players[player.playerId].destroy();
                    delete this.scene.players[player.playerId];
                    this.scene.socket.emit('playerDied', { playerId: player.playerId });
                    window.location.href = `/class/${this.scene.userId}`; // Redirect if needed
                }
            }
        }
    }

}
const logger = require('./logger');

class MovementController {
    constructor(bot, config) {
        this.bot = bot;
        this.config = config;
        this.movementInterval = null;
        this.lookInterval = null;
        this.jumpInterval = null;
        this.isMoving = false;
    }

    start() {
        logger.info('Starting movement controller...');
        
        // Main movement pattern
        this.movementInterval = setInterval(() => {
            this.performMovement();
        }, this.config.MOVEMENT_INTERVAL);

        // Random looking around
        if (this.config.RANDOM_LOOK_AROUND) {
            this.lookInterval = setInterval(() => {
                this.randomLook();
            }, 15000 + Math.random() * 10000); // 15-25 seconds
        }

        // Occasional jumping
        if (this.config.JUMP_OCCASIONALLY) {
            this.jumpInterval = setInterval(() => {
                this.randomJump();
            }, 45000 + Math.random() * 30000); // 45-75 seconds
        }

        logger.info('Movement patterns activated');
    }

    stop() {
        logger.info('Stopping movement controller...');
        
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        
        if (this.lookInterval) {
            clearInterval(this.lookInterval);
            this.lookInterval = null;
        }
        
        if (this.jumpInterval) {
            clearInterval(this.jumpInterval);
            this.jumpInterval = null;
        }

        // Stop any current movement
        this.stopAllMovement();
    }

    performMovement() {
        if (!this.bot || !this.bot.entity || this.isMoving) {
            return;
        }

        this.isMoving = true;

        try {
            if (this.config.RANDOM_MOVEMENT) {
                this.randomMovementPattern();
            } else {
                this.basicMovementPattern();
            }
        } catch (error) {
            logger.error('Movement error:', error.message);
        }

        // Add human-like delay
        const delay = this.config.HUMAN_LIKE_DELAYS 
            ? 500 + Math.random() * 1000 
            : 100;

        setTimeout(() => {
            this.isMoving = false;
        }, delay);
    }

    basicMovementPattern() {
        // Simple forward-back movement
        this.bot.setControlState('forward', true);
        
        setTimeout(() => {
            this.bot.setControlState('forward', false);
            this.bot.setControlState('back', true);
            
            setTimeout(() => {
                this.bot.setControlState('back', false);
            }, 500);
        }, 500);

        logger.debug('Performed basic movement');
    }

    randomMovementPattern() {
        const movements = ['forward', 'back', 'left', 'right'];
        const selectedMovements = [];
        
        // Select 1-3 random movements
        const numMovements = 1 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numMovements; i++) {
            const movement = movements[Math.floor(Math.random() * movements.length)];
            selectedMovements.push(movement);
        }

        // Execute movements with delays
        let delay = 0;
        selectedMovements.forEach((movement, index) => {
            setTimeout(() => {
                this.bot.setControlState(movement, true);
                
                setTimeout(() => {
                    this.bot.setControlState(movement, false);
                }, 200 + Math.random() * 300);
            }, delay);
            
            delay += 300 + Math.random() * 200;
        });

        logger.debug(`Performed random movement: ${selectedMovements.join(', ')}`);
    }

    randomLook() {
        if (!this.bot || !this.bot.entity) return;

        try {
            // Random yaw (horizontal rotation)
            const yaw = (Math.random() - 0.5) * Math.PI * 2;
            
            // Random pitch (vertical rotation) - limited range to seem natural
            const pitch = (Math.random() - 0.5) * Math.PI * 0.5;

            this.bot.look(yaw, pitch);
            logger.debug(`Random look: yaw=${yaw.toFixed(2)}, pitch=${pitch.toFixed(2)}`);
        } catch (error) {
            logger.error('Look error:', error.message);
        }
    }

    randomJump() {
        if (!this.bot || !this.bot.entity) return;

        try {
            // Only jump if on ground
            if (this.bot.entity.onGround) {
                this.bot.setControlState('jump', true);
                
                setTimeout(() => {
                    this.bot.setControlState('jump', false);
                }, 100);
                
                logger.debug('Performed random jump');
            }
        } catch (error) {
            logger.error('Jump error:', error.message);
        }
    }

    walkToPosition(x, z, timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (!this.bot.pathfinder) {
                reject(new Error('Pathfinder plugin not available'));
                return;
            }

            const goal = new this.bot.pathfinder.goals.GoalBlock(x, this.bot.entity.position.y, z);
            
            const timeoutId = setTimeout(() => {
                this.bot.pathfinder.stop();
                reject(new Error('Walk timeout'));
            }, timeout);

            this.bot.pathfinder.setGoal(goal);
            
            this.bot.once('goal_reached', () => {
                clearTimeout(timeoutId);
                resolve();
            });

            this.bot.once('path_stop', () => {
                clearTimeout(timeoutId);
                resolve();
            });
        });
    }

    stopAllMovement() {
        if (!this.bot) return;

        const controls = ['forward', 'back', 'left', 'right', 'jump', 'sneak', 'sprint'];
        controls.forEach(control => {
            try {
                this.bot.setControlState(control, false);
            } catch (error) {
                // Ignore errors when stopping movement
            }
        });
    }

    // Anti-detection behaviors
    mimicPlayerBehavior() {
        // Occasionally open inventory
        if (Math.random() < 0.1) {
            setTimeout(() => {
                try {
                    this.bot.openInventory();
                    setTimeout(() => {
                        this.bot.closeWindow(this.bot.currentWindow);
                    }, 1000 + Math.random() * 2000);
                } catch (error) {
                    // Ignore inventory errors
                }
            }, Math.random() * 5000);
        }

        // Random sneak
        if (Math.random() < 0.05) {
            this.bot.setControlState('sneak', true);
            setTimeout(() => {
                this.bot.setControlState('sneak', false);
            }, 500 + Math.random() * 1500);
        }
    }
}

module.exports = MovementController;

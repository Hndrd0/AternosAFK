const mineflayer = require('mineflayer');
const logger = require('./logger');
const MovementController = require('./movements');
const CommandHandler = require('./commands');

class MinecraftBot {
    constructor(config) {
        this.config = config;
        this.bot = null;
        this.movementController = null;
        this.commandHandler = null;
        this.reconnectAttempts = 0;
        this.isConnected = false;
        this.startTime = null;
    }

    async start() {
        return new Promise((resolve, reject) => {
            this.connect(resolve, reject);
        });
    }

    connect(resolve = null, reject = null) {
        logger.info('Attempting to connect to Minecraft server...');
        
        const botOptions = {
            host: this.config.HOST,
            port: this.config.PORT,
            username: this.config.USERNAME,
            auth: this.config.AUTH,
            version: this.config.VERSION === 'auto' ? false : this.config.VERSION,
            viewDistance: this.config.VIEW_DISTANCE
        };

        // Add password if provided (for premium accounts)
        if (this.config.PASSWORD && this.config.AUTH !== 'offline') {
            botOptions.password = this.config.PASSWORD;
        }

        try {
            this.bot = mineflayer.createBot(botOptions);
            this.setupEventHandlers(resolve, reject);
        } catch (error) {
            logger.error('Failed to create bot:', error.message);
            if (reject) reject(error);
        }
    }

    setupEventHandlers(resolve = null, reject = null) {
        // Connection successful
        this.bot.on('login', () => {
            const username = this.bot.username || this.config.USERNAME || 'unknown';
            logger.info(`Logged in as ${username}`);
            this.startTime = new Date();
        });

        // Spawned in world
        this.bot.on('spawn', () => {
            try {
                logger.info('Bot spawned in world!');
                
                if (this.bot.entity && this.bot.entity.position) {
                    logger.info(`Position: ${this.bot.entity.position.x.toFixed(2)}, ${this.bot.entity.position.y.toFixed(2)}, ${this.bot.entity.position.z.toFixed(2)}`);
                }
                
                this.isConnected = true;
                this.reconnectAttempts = 0;
                
                // Initialize controllers with delay to ensure bot is fully loaded
                setTimeout(() => {
                    try {
                        this.movementController = new MovementController(this.bot, this.config);
                        this.commandHandler = new CommandHandler(this.bot, this.config, this);
                        
                        // Start automated behaviors
                        this.movementController.start();
                        
                        if (resolve) resolve();
                    } catch (error) {
                        logger.error('Error initializing controllers:', error.message);
                    }
                }, 1000);
                
            } catch (error) {
                logger.error('Error during spawn event:', error.message);
                if (reject) reject(error);
            }
        });

        // Handle chat messages with error protection
        this.bot.on('chat', (username, message) => {
            try {
                if (this.config.LOG_CHAT && username !== this.bot.username) {
                    logger.info(`<${username}> ${message}`);
                }
                
                // Handle commands
                if (this.commandHandler) {
                    this.commandHandler.handleChat(username, message);
                }
            } catch (error) {
                logger.warn(`Chat handling error: ${error.message}`);
            }
        });

        // Handle system messages (safer than chat events)
        this.bot.on('systemChat', (message) => {
            try {
                // Log system messages if enabled
                if (this.config.LOG_CHAT) {
                    logger.info(`[SYSTEM] ${message}`);
                }
            } catch (error) {
                logger.warn(`System chat handling error: ${error.message}`);
            }
        });

        // Handle disconnection
        this.bot.on('end', (reason) => {
            logger.warn(`Disconnected from server. Reason: ${reason || 'Unknown'}`);
            this.isConnected = false;
            
            if (this.movementController) {
                this.movementController.stop();
            }
            
            this.handleReconnection();
        });

        // Handle kicks
        this.bot.on('kicked', (reason, loggedIn) => {
            logger.warn(`Kicked from server: ${reason}`);
            this.isConnected = false;
            
            if (this.movementController) {
                this.movementController.stop();
            }
            
            // Check for throttling message
            if (reason && reason.includes && reason.includes('throttled')) {
                logger.warn('🚫 Aternos throttling detected - waiting longer before reconnect');
                this.throttleDetected = true;
            }
            
            this.handleReconnection();
        });

        // Handle errors
        this.bot.on('error', (err) => {
            logger.error(`Bot error: ${err.message}`);
            
            if (err.message.includes('ECONNREFUSED')) {
                logger.error('Connection refused - server may be offline');
            } else if (err.message.includes('ENOTFOUND')) {
                logger.error('Server not found - check hostname');
            } else if (err.message.includes('ECONNRESET')) {
                logger.warn('Connection reset by server - will attempt reconnect');
                return; // Don't reject on connection reset, let reconnection handle it
            } else if (err.message.includes('Invalid username')) {
                logger.error('Invalid username - check authentication settings');
            } else if (err.message.includes('unknown chat format code')) {
                logger.warn('Chat parsing error - continuing bot operation');
                return; // Don't disconnect for chat errors
            } else if (err.message.includes('ChatMessage.fromNetwork')) {
                logger.warn('Chat message parsing error - ignoring malformed message');
                return; // Don't disconnect for chat parsing errors
            }
            
            if (reject && !this.isConnected) {
                reject(err);
            }
        });

        // Health monitoring
        this.bot.on('health', () => {
            if (this.bot.health <= 6) { // Low health warning
                logger.warn(`Low health: ${this.bot.health}/20`);
            }
        });

        // Death handling
        this.bot.on('death', () => {
            logger.warn('Bot died! Attempting to respawn...');
            setTimeout(() => {
                try {
                    this.bot.respawn();
                } catch (error) {
                    logger.error('Failed to respawn:', error.message);
                }
            }, 2000);
        });

        // Game mode changes
        this.bot.on('game', () => {
            try {
                if (this.bot.game && this.bot.game.gameMode !== undefined) {
                    logger.info(`Game mode: ${this.bot.game.gameMode}, Difficulty: ${this.bot.game.difficulty || 'unknown'}`);
                }
            } catch (error) {
                logger.warn('Error accessing game mode information:', error.message);
            }
        });
    }

    handleReconnection() {
        if (!this.config.AUTO_RECONNECT) {
            logger.info('Auto-reconnect disabled, bot will not reconnect');
            return;
        }

        // Check if we should stop reconnecting (only if MAX_RECONNECT_ATTEMPTS > 0)
        if (this.config.MAX_RECONNECT_ATTEMPTS > 0 && this.reconnectAttempts >= this.config.MAX_RECONNECT_ATTEMPTS) {
            if (this.config.IS_ATERNOS_SERVER) {
                logger.error(`Max reconnection attempts (${this.config.MAX_RECONNECT_ATTEMPTS}) reached for Aternos server.`);
                logger.warn('⚠️  Aternos has throttled the connection. Wait 5-10 minutes before restarting the bot.');
                logger.warn('💡 Consider using a different account or server to avoid permanent throttling.');
            } else {
                logger.error(`Max reconnection attempts (${this.config.MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`);
            }
            process.exit(1);
        }

        this.reconnectAttempts++;
        
        // Much longer delays for Aternos, especially when throttling is detected
        let baseDelay = this.config.RECONNECT_DELAY;
        if (this.config.IS_ATERNOS_SERVER) {
            // Use linear backoff instead of exponential for Aternos
            baseDelay = this.config.RECONNECT_DELAY + (this.reconnectAttempts * 15000); // Add 15s per attempt
            
            // Cap the maximum delay at 5 minutes for infinite reconnections
            baseDelay = Math.min(baseDelay, 300000); // Max 5 minutes
            
            // If throttling was detected, add even more delay
            if (this.throttleDetected) {
                baseDelay = Math.max(baseDelay, 60000); // At least 1 minute
                logger.warn('🕐 Throttling detected - using extended delay to avoid further penalties');
            }
            
            // Show helpful message for infinite reconnection
            if (this.config.MAX_RECONNECT_ATTEMPTS === -1 && this.reconnectAttempts > 5) {
                logger.info('♾️  Infinite reconnection mode - bot will keep trying indefinitely');
            }
        } else {
            // Exponential backoff for non-Aternos servers, but cap at 5 minutes
            baseDelay = this.config.RECONNECT_DELAY * Math.pow(1.5, this.reconnectAttempts - 1);
            baseDelay = Math.min(baseDelay, 300000); // Max 5 minutes
        }
        
        const maxAttemptsDisplay = this.config.MAX_RECONNECT_ATTEMPTS === -1 ? '∞' : this.config.MAX_RECONNECT_ATTEMPTS;
        logger.info(`Reconnection attempt ${this.reconnectAttempts}/${maxAttemptsDisplay} in ${Math.round(baseDelay/1000)}s...`);
        
        setTimeout(() => {
            this.throttleDetected = false; // Reset throttle flag
            this.connect();
        }, baseDelay);
    }

    getStatus() {
        if (!this.isConnected) {
            return {
                connected: false,
                uptime: 0,
                position: null,
                health: 0,
                food: 0
            };
        }

        const uptime = this.startTime ? Date.now() - this.startTime.getTime() : 0;
        
        return {
            connected: true,
            uptime: uptime,
            uptimeString: this.formatUptime(uptime),
            position: this.bot.entity ? this.bot.entity.position : null,
            health: this.bot.health || 0,
            food: this.bot.food || 0,
            gameMode: this.bot.game ? this.bot.game.gameMode : 'unknown',
            dimension: this.bot.game ? this.bot.game.dimension : 'unknown',
            weather: this.bot.isRaining ? 'raining' : 'clear'
        };
    }

    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else {
            return `${minutes}m ${seconds % 60}s`;
        }
    }

    sendChat(message) {
        if (this.isConnected && this.bot) {
            this.bot.chat(message);
            logger.info(`Bot said: ${message}`);
        }
    }

    disconnect() {
        logger.info('Disconnecting bot...');
        
        if (this.movementController) {
            this.movementController.stop();
        }
        
        if (this.bot) {
            this.bot.quit('Bot shutting down');
        }
        
        this.isConnected = false;
    }
}

module.exports = MinecraftBot;

const logger = require('./logger');

class CommandHandler {
    constructor(bot, config, botInstance) {
        this.bot = bot;
        this.config = config;
        this.botInstance = botInstance;
        this.commandPrefix = '!';
        this.authorizedUsers = process.env.AUTHORIZED_USERS ? 
            process.env.AUTHORIZED_USERS.split(',') : [];
    }

    handleChat(username, message) {
        if (!this.config.CHAT_RESPONSES || username === this.bot.username) {
            return;
        }

        // Handle commands
        if (message.startsWith(this.commandPrefix)) {
            this.processCommand(username, message);
            return;
        }

        // Handle mentions
        if (message.toLowerCase().includes(this.bot.username.toLowerCase())) {
            this.handleMention(username, message);
        }

        // Auto-responses to common greetings
        this.handleAutoResponses(username, message);
    }

    processCommand(username, message) {
        const args = message.slice(this.commandPrefix.length).trim().split(' ');
        const command = args[0].toLowerCase();

        logger.info(`Command from ${username}: ${message}`);

        switch (command) {
            case 'status':
                this.handleStatus(username);
                break;
            
            case 'pos':
            case 'position':
                this.handlePosition(username);
                break;
            
            case 'health':
                this.handleHealth(username);
                break;
            
            case 'time':
                this.handleTime(username);
                break;
            
            case 'help':
                this.handleHelp(username);
                break;
            
            case 'say':
                if (this.isAuthorized(username)) {
                    this.handleSay(username, args.slice(1).join(' '));
                }
                break;
            
            case 'move':
                if (this.isAuthorized(username)) {
                    this.handleMove(username, args[1]);
                }
                break;
            
            case 'stop':
                if (this.isAuthorized(username)) {
                    this.handleStop(username);
                }
                break;
            
            case 'ping':
                this.handlePing(username);
                break;
            
            case 'uptime':
                this.handleUptime(username);
                break;
            
            default:
                this.bot.chat(`Unknown command: ${command}. Type !help for available commands.`);
        }
    }

    handleStatus(username) {
        const status = this.botInstance.getStatus();
        
        if (status.connected) {
            this.bot.chat(`Status: Online for ${status.uptimeString} | Health: ${status.health}/20 | Food: ${status.food}/20`);
        } else {
            this.bot.chat('Status: Offline');
        }
    }

    handlePosition(username) {
        const pos = this.bot.entity.position;
        const blockPos = `${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}`;
        this.bot.chat(`Position: ${blockPos}`);
    }

    handleHealth(username) {
        const health = this.bot.health || 0;
        const food = this.bot.food || 0;
        this.bot.chat(`Health: ${health}/20 ❤ Food: ${food}/20 🍗`);
    }

    handleTime(username) {
        const timeOfDay = this.bot.time.timeOfDay;
        const day = Math.floor(this.bot.time.age / 24000);
        const hour = Math.floor((timeOfDay / 1000) % 24);
        const minute = Math.floor(((timeOfDay % 1000) / 1000) * 60);
        
        this.bot.chat(`Day ${day}, ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }

    handleHelp(username) {
        const commands = [
            '!status - Bot status and uptime',
            '!pos - Current position',
            '!health - Health and food levels',
            '!time - Game time',
            '!uptime - UptimeRobot monitor stats',
            '!ping - Test bot responsiveness',
            '!help - This help message'
        ];

        if (this.isAuthorized(username)) {
            commands.push('!say <message> - Make bot say something');
            commands.push('!move <direction> - Move bot');
            commands.push('!stop - Stop bot movement');
        }

        this.bot.chat('Available commands:');
        commands.forEach(cmd => this.bot.chat(cmd));
    }

    handleSay(username, message) {
        if (message.trim()) {
            this.bot.chat(message);
            logger.info(`${username} made bot say: ${message}`);
        }
    }

    handleMove(username, direction) {
        if (!direction) {
            this.bot.chat('Usage: !move <forward|back|left|right|stop>');
            return;
        }

        const validDirections = ['forward', 'back', 'left', 'right', 'stop'];
        
        if (!validDirections.includes(direction.toLowerCase())) {
            this.bot.chat(`Invalid direction. Use: ${validDirections.join(', ')}`);
            return;
        }

        if (direction.toLowerCase() === 'stop') {
            this.botInstance.movementController.stopAllMovement();
            this.bot.chat('Movement stopped');
        } else {
            // Stop current movement first
            this.botInstance.movementController.stopAllMovement();
            
            // Start new movement
            this.bot.setControlState(direction.toLowerCase(), true);
            
            // Stop after 2 seconds
            setTimeout(() => {
                this.bot.setControlState(direction.toLowerCase(), false);
            }, 2000);
            
            this.bot.chat(`Moving ${direction} for 2 seconds`);
        }

        logger.info(`${username} moved bot: ${direction}`);
    }

    handleStop(username) {
        this.botInstance.movementController.stopAllMovement();
        this.bot.chat('All movement stopped');
        logger.info(`${username} stopped bot movement`);
    }

    handlePing(username) {
        this.bot.chat(`Pong! Hello ${username} 👋`);
    }

    handleUptime(username) {
        // Get uptime stats from the global uptime monitor if available
        if (global.uptimeMonitor) {
            const stats = global.uptimeMonitor.getStats();
            this.bot.chat(`UptimeRobot: ${stats.uptimeFormatted} | ${stats.pings} pings`);
        } else {
            // Fallback to bot uptime
            const status = this.botInstance.getStatus();
            this.bot.chat(`Bot uptime: ${status.uptimeString || 'Unknown'}`);
        }
    }

    handleMention(username, message) {
        const responses = [
            `Hello ${username}! I'm keeping the server active.`,
            `Hi there ${username}! 👋`,
            `Yes ${username}? I'm here and working!`,
            `Hey ${username}! Server is staying online thanks to me!`
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        // Delay response to seem more natural
        setTimeout(() => {
            this.bot.chat(response);
        }, 1000 + Math.random() * 2000);
    }

    handleAutoResponses(username, message) {
        const msg = message.toLowerCase();
        
        // Greetings
        if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey')) {
            if (Math.random() < 0.3) { // 30% chance to respond
                setTimeout(() => {
                    this.bot.chat(`Hello ${username}! 👋`);
                }, 1000 + Math.random() * 3000);
            }
        }
        
        // Thanks
        if (msg.includes('thank') || msg.includes('thx')) {
            if (Math.random() < 0.2) { // 20% chance to respond
                setTimeout(() => {
                    this.bot.chat(`You're welcome ${username}! 😊`);
                }, 1000 + Math.random() * 2000);
            }
        }
        
        // Questions about the bot
        if (msg.includes('bot') && (msg.includes('what') || msg.includes('who') || msg.includes('?'))) {
            setTimeout(() => {
                this.bot.chat('I\'m an AFK bot keeping this server active! Type !help for commands.');
            }, 1000 + Math.random() * 2000);
        }
    }

    isAuthorized(username) {
        if (this.authorizedUsers.length === 0) {
            return true; // No authorization required if no users specified
        }
        
        return this.authorizedUsers.includes(username);
    }
}

module.exports = CommandHandler;

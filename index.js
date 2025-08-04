const config = require('./config');
const MinecraftBot = require('./bot');
const logger = require('./logger');
const UptimeMonitor = require('./uptime');

// Global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error.message);
    if (error.message.includes('unknown chat format code') || 
        error.message.includes('ChatMessage.fromNetwork')) {
        logger.warn('Chat parsing error caught - continuing bot operation');
        return; // Don't crash for chat errors
    }
    logger.error('Critical error, shutting down...');
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (reason && reason.message && 
        (reason.message.includes('unknown chat format code') || 
         reason.message.includes('ChatMessage.fromNetwork'))) {
        logger.warn('Chat parsing rejection caught - continuing bot operation');
        return; // Don't crash for chat errors
    }
});

async function main() {
    logger.info('Starting Minecraft AFK Bot...');
    logger.info(`Target Server: ${config.HOST}:${config.PORT}`);
    logger.info(`Username: ${config.USERNAME}`);
    logger.info(`Auth Mode: ${config.AUTH}`);
    
    // Start UptimeRobot monitor with random port to avoid conflicts
    const uptimePort = parseInt(process.env.UPTIME_PORT) || (5000 + Math.floor(Math.random() * 1000));
    const uptimeMonitor = new UptimeMonitor(uptimePort);
    try {
        uptimeMonitor.start();
    } catch (error) {
        logger.warn('UptimeRobot failed to start:', error.message);
        logger.info('Bot will continue without uptime monitoring');
    }
    
    // Make uptime monitor globally accessible for commands
    global.uptimeMonitor = uptimeMonitor;
    
    // Display important warnings
    logger.warn('⚠️  IMPORTANT DISCLAIMERS:');
    logger.warn('- Using AFK bots may violate server Terms of Service');
    
    if (config.IS_ATERNOS_SERVER) {
        logger.warn('🚨 ATERNOS SERVER DETECTED - CRITICAL WARNING:');
        logger.warn('- Aternos WILL suspend your account for using AFK bots');
        logger.warn('- Account suspension is automatic and permanent');
        logger.warn('- All server data may be lost');
        logger.warn('- Consider using a throwaway account only');
    } else {
        logger.warn('- Aternos specifically prohibits AFK bots and will suspend accounts');
    }
    
    logger.warn('- Use this bot responsibly and only on servers you own or have permission');
    logger.warn('- Consider legitimate alternatives like scheduled play sessions');
    
    const bot = new MinecraftBot(config);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        logger.info('Received SIGINT, shutting down gracefully...');
        uptimeMonitor.stop();
        bot.disconnect();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        logger.info('Received SIGTERM, shutting down gracefully...');
        uptimeMonitor.stop();
        bot.disconnect();
        process.exit(0);
    });
    
    // Start the bot
    try {
        await bot.start();
    } catch (error) {
        logger.error('Failed to start bot:', error.message);
        // Don't exit, let the bot handle reconnection
        logger.info('Bot will attempt to reconnect automatically...');
    }
}

main().catch(error => {
    logger.error('Unhandled error:', error);
    logger.info('Restarting main function...');
    setTimeout(() => main(), 5000); // Restart after 5 seconds
});

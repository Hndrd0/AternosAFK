const path = require('path');

// Load environment variables if .env file exists
try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (error) {
    // dotenv not available, continue with process.env
}

const config = {
    // Server connection settings
    HOST: process.env.MC_HOST || 'localhost',
    PORT: parseInt(process.env.MC_PORT) || 25565,
    USERNAME: process.env.MC_USERNAME || 'AFKBot',
    PASSWORD: process.env.MC_PASSWORD || '',
    
    // Authentication settings
    AUTH: process.env.MC_AUTH || 'offline', // 'microsoft', 'mojang', or 'offline'
    
    // Bot behavior settings
    MOVEMENT_INTERVAL: parseInt(process.env.MOVEMENT_INTERVAL) || 30000, // 30 seconds
    RANDOM_MOVEMENT: process.env.RANDOM_MOVEMENT === 'true' || true,
    CHAT_RESPONSES: process.env.CHAT_RESPONSES === 'true' || true,
    
    // Reconnection settings
    AUTO_RECONNECT: process.env.AUTO_RECONNECT === 'true' || true,
    RECONNECT_DELAY: parseInt(process.env.RECONNECT_DELAY) || 5000, // 5 seconds
    MAX_RECONNECT_ATTEMPTS: process.env.MAX_RECONNECT_ATTEMPTS === 'infinite' ? -1 : (parseInt(process.env.MAX_RECONNECT_ATTEMPTS) || -1), // -1 = infinite
    
    // Logging settings
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    LOG_CHAT: process.env.LOG_CHAT === 'true' || true,
    
    // Advanced settings
    VIEW_DISTANCE: parseInt(process.env.VIEW_DISTANCE) || 'far',
    VERSION: process.env.MC_VERSION || 'auto', // Auto-detect version
    
    // Anti-detection settings
    HUMAN_LIKE_DELAYS: process.env.HUMAN_LIKE_DELAYS === 'true' || true,
    RANDOM_LOOK_AROUND: process.env.RANDOM_LOOK_AROUND === 'true' || true,
    JUMP_OCCASIONALLY: process.env.JUMP_OCCASIONALLY === 'true' || true
};

// Validation
if (!config.HOST) {
    throw new Error('MC_HOST is required');
}

if (!config.USERNAME) {
    throw new Error('MC_USERNAME is required');
}

// Validate auth mode
const validAuthModes = ['microsoft', 'mojang', 'offline'];
if (!validAuthModes.includes(config.AUTH)) {
    throw new Error(`Invalid auth mode: ${config.AUTH}. Must be one of: ${validAuthModes.join(', ')}`);
}

// Aternos server detection and optimization
const isAternosServer = config.HOST.includes('aternos');
if (isAternosServer) {
    console.warn('🔍 Aternos server detected - applying optimizations...');
    
    if (config.AUTH !== 'offline') {
        console.warn('⚠️  Aternos servers require offline authentication mode');
    }
    
    // Apply Aternos-specific defaults if not explicitly set
    if (!process.env.MOVEMENT_INTERVAL) {
        config.MOVEMENT_INTERVAL = 45000; // Slower for Aternos
        console.log('📦 Applied Aternos movement interval: 45 seconds');
    }
    
    if (!process.env.RECONNECT_DELAY) {
        config.RECONNECT_DELAY = 30000; // Much more conservative for Aternos
        console.log('📦 Applied Aternos reconnect delay: 30 seconds');
    }
    
    if (!process.env.MAX_RECONNECT_ATTEMPTS) {
        config.MAX_RECONNECT_ATTEMPTS = -1; // Infinite attempts for Aternos
        console.log('📦 Applied Aternos max reconnects: infinite attempts');
    }
}

// Add Aternos detection flag to config
config.IS_ATERNOS_SERVER = isAternosServer;

module.exports = config;

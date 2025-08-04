class Logger {
    constructor() {
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
        
        this.currentLevel = this.levels[process.env.LOG_LEVEL] || this.levels.info;
    }

    formatTimestamp() {
        return new Date().toISOString();
    }

    formatMessage(level, message, ...args) {
        const timestamp = this.formatTimestamp();
        const formattedArgs = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        const fullMessage = formattedArgs ? `${message} ${formattedArgs}` : message;
        return `[${timestamp}] [${level.toUpperCase()}] ${fullMessage}`;
    }

    log(level, message, ...args) {
        if (this.levels[level] >= this.currentLevel) {
            const formatted = this.formatMessage(level, message, ...args);
            
            if (level === 'error') {
                console.error(formatted);
            } else if (level === 'warn') {
                console.warn(formatted);
            } else {
                console.log(formatted);
            }
        }
    }

    debug(message, ...args) {
        this.log('debug', message, ...args);
    }

    info(message, ...args) {
        this.log('info', message, ...args);
    }

    warn(message, ...args) {
        this.log('warn', message, ...args);
    }

    error(message, ...args) {
        this.log('error', message, ...args);
    }
}

module.exports = new Logger();

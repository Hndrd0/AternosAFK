const http = require('http');
const logger = require('./logger');

class UptimeMonitor {
    constructor(port = 5000) {
        this.port = port;
        this.server = null;
        this.startTime = Date.now();
        this.pingCount = 0;
    }

    start() {
        this.server = http.createServer((req, res) => {
            this.pingCount++;
            const uptime = Date.now() - this.startTime;
            const uptimeSeconds = Math.floor(uptime / 1000);
            
            // Health check endpoint
            if (req.url === '/health' || req.url === '/') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'alive',
                    uptime: uptimeSeconds,
                    uptimeFormatted: this.formatUptime(uptime),
                    pings: this.pingCount,
                    timestamp: new Date().toISOString(),
                    service: 'minecraft-afk-bot'
                }));
                
                logger.debug(`Health check ping #${this.pingCount} - Uptime: ${this.formatUptime(uptime)}`);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });

        this.server.listen(this.port, '0.0.0.0', () => {
            logger.info(`UptimeRobot endpoint running on port ${this.port}`);
            logger.info(`Health check URL: http://0.0.0.0:${this.port}/health`);
            logger.info('Configure UptimeRobot to monitor this URL to keep the bot alive');
        });

        // Handle server errors
        this.server.on('error', (error) => {
            logger.error('UptimeRobot server error:', error.message);
        });

        return this.server;
    }

    stop() {
        if (this.server) {
            this.server.close(() => {
                logger.info('UptimeRobot server stopped');
            });
        }
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

    getStats() {
        const uptime = Date.now() - this.startTime;
        return {
            uptime: uptime,
            uptimeFormatted: this.formatUptime(uptime),
            pings: this.pingCount,
            startTime: new Date(this.startTime).toISOString()
        };
    }
}

module.exports = UptimeMonitor;
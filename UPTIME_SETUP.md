# UptimeRobot Setup Guide

Your Minecraft AFK bot now includes built-in UptimeRobot integration to keep it running 24/7. This prevents the bot from going to sleep and ensures continuous server activity.

## How It Works

The bot automatically starts an HTTP server on port 5000 that responds to health checks. UptimeRobot pings this endpoint every 5 minutes, which keeps the bot alive and prevents it from sleeping.

## Quick Setup

### 1. Bot is Already Configured
Your bot automatically starts the UptimeRobot endpoint when it runs. You'll see this message:
```
[INFO] UptimeRobot endpoint running on port 5000
[INFO] Health check URL: http://0.0.0.0:5000/health
[INFO] Configure UptimeRobot to monitor this URL to keep the bot alive
```

### 2. Get Your Replit URL
1. Look at your browser's address bar while in this Replit
2. Your Replit URL will be something like: `https://your-repl-name.replit.app`
3. The health check URL will be: `https://your-repl-name.replit.app/health`

### 3. Set Up UptimeRobot Monitoring

1. **Go to UptimeRobot**: Visit [uptimerobot.com](https://uptimerobot.com)
2. **Create Free Account**: Sign up for a free account (allows 50 monitors)
3. **Add New Monitor**:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Minecraft AFK Bot`
   - URL: `https://your-repl-name.replit.app/health`
   - Monitoring Interval: `5 minutes` (free tier)

4. **Save Monitor**: Click "Create Monitor"

### 4. Verify It's Working
- The monitor should show "Up" status within a few minutes
- Your bot will stay alive 24/7 as long as UptimeRobot is pinging it
- Check the bot logs for health check pings: `Health check ping #X`

## Health Check Response

The endpoint returns JSON with bot status:
```json
{
  "status": "alive",
  "uptime": 300,
  "uptimeFormatted": "5m 0s", 
  "pings": 15,
  "timestamp": "2025-08-04T12:31:11.293Z",
  "service": "minecraft-afk-bot"
}
```

## Configuration Options

### Custom Port (Optional)
Add to your `.env` file:
```env
UPTIME_PORT=5000
```

### Chat Commands
Players can check UptimeRobot stats in-game:
- `!uptime` - Shows UptimeRobot monitoring stats
- `!status` - Shows bot connection status

## Troubleshooting

### "Monitor is Down"
- **Check Bot Status**: Make sure your Replit is running
- **Verify URL**: Test the health URL in your browser
- **Port Issues**: Ensure using port 5000 (only accessible port on Replit)

### Bot Still Goes to Sleep
- **Check Monitor**: Ensure UptimeRobot monitor is active and "Up"
- **Interval Too Long**: Free tier monitors every 5 minutes, which should be sufficient
- **URL Incorrect**: Double-check your Replit URL

### Health Check Not Responding
- **Bot Not Started**: The endpoint only works when the bot is running
- **Firewall**: Only port 5000 is accessible on Replit
- **Network Issues**: Try accessing the URL directly in your browser

## Advanced Setup

### Multiple Bots
If running multiple bots, use different ports:
```env
# Bot 1
UPTIME_PORT=5000

# Bot 2  
UPTIME_PORT=5001  # Won't work on Replit, use separate Repls instead
```

### Custom Health Checks
The health endpoint provides detailed bot information:
- Connection status
- Uptime tracking
- Ping count
- Server details

### Monitoring Alerts
Set up UptimeRobot alerts:
1. Go to "Alert Contacts" in UptimeRobot
2. Add your email or phone number
3. Configure when to receive alerts (recommended: when monitor goes down)

## Benefits of UptimeRobot Integration

### 24/7 Operation
- Bot never goes to sleep
- Continuous Minecraft server activity
- No manual restarts needed

### Monitoring
- Know when your bot goes offline
- Track uptime statistics
- Get alerts if issues occur

### Free Tier Limits
- 50 monitors (plenty for multiple bots)
- 5-minute check intervals
- Email alerts included

## Best Practices

### For Aternos Servers
- Use conservative monitoring (5-minute intervals)
- Don't add multiple monitors for the same bot
- Consider the account suspension risk

### General Usage
- Test the health URL before setting up monitoring
- Use descriptive monitor names
- Set up email alerts for downtime

### Security
- The health endpoint only provides status information
- No sensitive data is exposed
- Safe to use with public monitoring services

## Alternative Monitoring Services

If you prefer alternatives to UptimeRobot:

### StatusCake
- Similar functionality
- Free tier available
- Easy setup process

### Pingdom
- Professional monitoring
- More detailed analytics
- Paid service

### Self-Hosted
- Use your own monitoring
- Ping the `/health` endpoint
- Custom alerting logic

## Integration with Aternos

The UptimeRobot integration works perfectly with Aternos servers:

1. **Start your Aternos server**
2. **Configure the bot** with your server address
3. **Set up UptimeRobot** monitoring
4. **Bot stays connected** 24/7 to keep server active

Remember: While this helps maintain server activity, using AFK bots still violates Aternos Terms of Service and will result in account suspension.

## Support

If you encounter issues with UptimeRobot setup:
1. Check the bot logs for error messages
2. Test the health URL manually in your browser
3. Verify UptimeRobot monitor configuration
4. Ensure your Replit is running and accessible

The UptimeRobot integration ensures your Minecraft AFK bot maintains continuous operation for optimal server activity.
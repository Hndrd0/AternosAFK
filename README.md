# Minecraft AFK Bot for Server Activity

A Node.js Minecraft bot using mineflayer that maintains server activity through automated movement and interactions.

## ⚠️ Important Disclaimers

**PLEASE READ CAREFULLY:**

- **Terms of Service**: Using AFK bots may violate server Terms of Service
- **Aternos Specific**: Aternos explicitly prohibits AFK bots and WILL suspend accounts that use them
- **Use Responsibly**: Only use this bot on servers you own or have explicit permission to use bots
- **Legal Alternatives**: Consider scheduled play sessions with friends instead of automated bots

## Features

✅ **Connection Management**
- Connects to Minecraft servers using server IP and port
- Supports both online (premium) and offline (cracked) authentication
- Auto-reconnection when kicked or disconnected
- Compatible with Minecraft versions 1.8-1.21

✅ **Anti-AFK Behaviors**
- Random movement patterns (walking, turning, jumping)
- Human-like delays and variations
- Occasional inventory opening and sneaking
- Looking around randomly

✅ **Chat Integration**
- Responds to mentions and greetings
- Command system for remote control
- Status reporting and monitoring
- Natural conversation patterns
- When error occurs does not respond!!

✅ **Monitoring & Logging**
- Detailed connection logs
- Health and position monitoring
- Uptime tracking

### 2. For Aternos Servers (Special Configuration)

**⚠️ WARNING**: Aternos explicitly prohibits AFK bots and will suspend accounts that use them.

1. **Copy the Aternos configuration template:**
   ```bash
   cp .env.aternos .env
   ```

2. **Edit the .env file with your server details:**
   - Replace `yourserver.aternos.me` with your actual Aternos server address
   - Keep `MC_AUTH=offline` (required for Aternos)
   - The bot is pre-configured with slower movements to reduce detection risk

3. **Find your Aternos server address:**
   - Go to your Aternos control panel
   - Your server address will be shown as `yourservername.aternos.me`
   - Port is always `25565`

### 3. Basic Configuration

For other servers, copy the example configuration:

```bash
cp .env.example .env
```

Then edit the `.env` file with your server details:
- `MC_HOST` - Your server IP or domain
- `MC_PORT` - Server port (usually 25565)
- `MC_USERNAME` - Bot username
- `MC_AUTH` - Authentication type (offline/microsoft/mojang)

### 4. Running the Bot

Start the bot:
```bash
node index.js
```

Or use the "Run" button in Replit to start it automatically.

The bot will automatically start an UptimeRobot endpoint for 24/7 operation.

## Aternos-Specific Setup Guide

### Step 1: Get Your Server Address
1. Log into your Aternos account
2. Go to your server dashboard
3. Your server address will be displayed as: `yourservername.aternos.me`

### Step 2: Configure the Bot
2. Edit `.env` and replace `yourserver.aternos.me` with your actual server address
3. Keep all other settings as they are (optimized for Aternos)

### Step 3: Start Your Aternos Server
1. Make sure your Aternos server is running first
2. Then start the bot

### Important Aternos Notes
- **Account Risk**: Using AFK bots WILL result in account suspension
- **Detection**: Aternos actively monitors for bot activity
- **Alternatives**: Consider coordinating with friends for natural activity instead

## Bot Commands

Once connected, players can use these chat commands:

**Public Commands:**
- `!status` - Bot status and uptime
- `!pos` - Current bot position  
- `!health` - Health and food levels
- `!time` - Game time
- `!uptime` - UptimeRobot monitoring stats
- `!ping` - Test bot responsiveness
- `!help` - Show available commands

**Admin Commands** (for authorized users):
- `!say <message>` - Make bot say something
- `!move <direction>` - Move bot (forward/back/left/right/stop)
- `!stop` - Stop all bot movement

## Configuration Options

### Movement Settings
- `MOVEMENT_INTERVAL` - Time between movements (milliseconds)
- `RANDOM_MOVEMENT` - Use random movement patterns (true/false)
- `HUMAN_LIKE_DELAYS` - Add realistic delays (true/false)

### Chat Settings
- `CHAT_RESPONSES` - Enable chat interactions (true/false)
- `AUTHORIZED_USERS` - Comma-separated list of admin usernames

### Connection Settings
- `AUTO_RECONNECT` - Auto-reconnect when disconnected (true/false)
- `MAX_RECONNECT_ATTEMPTS` - Maximum reconnection attempts (-1 for infinite)
- `RECONNECT_DELAY` - Delay between reconnection attempts

## Troubleshooting

### Common Connection Issues

**"Connection refused"**
- Server is offline or not running
- Wrong IP address or port
- Firewall blocking connection

**"Invalid username"**
- Username already taken on premium servers  
- Invalid characters in username
- Server requires different authentication

**"Authentication failed"**
- Wrong password for premium accounts
- Use `offline` auth for cracked servers
- Microsoft/Mojang authentication issues

### Aternos-Specific Issues

**Bot gets kicked immediately**
- Server has anti-bot plugins enabled
- Try changing the username
- Movement patterns detected as bot behavior

**Can't connect to server**
- Make sure Aternos server is actually running
- Check server address spelling
- Aternos servers may take time to start up

## Legal & Ethical Considerations

### Server Policies
- **Always check server rules** before using bots
- **Get permission** from server owners when possible
- **Respect server resources** - don't overload with too many bots

### Aternos Specific
- Using AFK bots violates Aternos Terms of Service
- Account suspension is automatic and permanent
- Consider legitimate alternatives like scheduled play sessions

### Best Practices
- Use inconspicuous usernames
- Don't use your main Minecraft account
- Monitor for server-side anti-bot measures
- Stop the bot if causing server issues

## Technical Details

### Supported Minecraft Versions
- 1.8.x through 1.21.x
- Auto-detection of server version
- Compatible with most server types (Vanilla, Spigot, Paper, etc.)

### Authentication Methods
- **Offline**: For cracked servers (no authentication)
- **Microsoft**: For premium Minecraft accounts (post-2021)  
- **Mojang**: For legacy Minecraft accounts (pre-2021)

### Anti-Detection Features
- Random movement patterns with human-like timing
- Occasional jumping, sneaking, and inventory interactions
- Natural chat responses to avoid looking automated
- Configurable delays and randomization

## Support & Issues

If you encounter problems:
1. Check the logs for error messages
2. Verify your configuration in `.env`
3. Make sure the target server is running
4. Review the troubleshooting section above

For Aternos-specific issues, remember that bot usage violates their ToS and support may be limited.

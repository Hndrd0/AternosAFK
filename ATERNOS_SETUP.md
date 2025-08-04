# Aternos AFK Bot Setup Guide

## ⚠️ CRITICAL WARNING

**Using AFK bots on Aternos WILL result in account suspension!**

- Aternos explicitly prohibits AFK bots in their Terms of Service
- Detection is automatic and bans are permanent
- Your Aternos account will be suspended without warning
- Consider legitimate alternatives instead

## Why This Bot Exists

Despite the risks, this bot is designed to help keep Aternos servers active when:
- You own the server and accept the account suspension risk
- You're testing server mechanics in a private environment
- You understand the consequences and choose to proceed

## Quick Setup for Aternos

### Step 1: Get Your Server Details
1. Log into your Aternos dashboard
2. Start your server (it must be running first)
3. Find your server address: `yourservername.aternos.me`
4. Port is always `25565`

### Step 2: Configure the Bot
1. Copy the Aternos configuration:
   ```bash
   cp .env.aternos .env
   ```

2. Edit the `.env` file:
   ```bash
   # Replace this line:
   MC_HOST=yourserver.aternos.me
   
   # With your actual server:
   MC_HOST=myserver123.aternos.me
   ```

3. Keep all other settings unchanged (they're optimized for Aternos)

### Step 3: Run the Bot
1. Make sure your Aternos server is online and players can join
2. Click "Run" or use: `node index.js`
3. The bot will connect and start maintaining server activity

## Aternos-Specific Optimizations

This bot includes special features for Aternos servers:

### Slower Movement Patterns
- Movement every 45 seconds (instead of 30)
- More human-like delays and randomization
- Reduced activity to minimize detection

### Conservative Reconnection
- Longer delays between reconnection attempts
- Fewer total reconnection attempts
- Avoids flooding Aternos with connection requests

### Offline Authentication
- Always uses offline mode (required for Aternos)
- No premium account authentication needed
- Works with any username

## Common Aternos Issues

### "Connection refused"
- **Solution**: Make sure your Aternos server is actually running
- Aternos servers auto-stop when no players are online
- Start the server manually before running the bot

### "Server not found"
- **Solution**: Double-check your server address spelling
- Format should be: `yourservername.aternos.me`
- Don't include `http://` or port in the hostname

### Bot gets kicked immediately
- **Solution**: Server may have anti-bot plugins
- Try changing the bot username in `.env`
- Some servers detect repetitive movement patterns

### Account suspended
- **Expected**: This is the inevitable outcome of using AFK bots on Aternos
- No recovery possible - account bans are permanent
- Create a throwaway Aternos account if you must proceed

## Legitimate Alternatives

Instead of risking account suspension, consider:

### Scheduled Play Sessions
- Coordinate with friends to keep server active
- Set up regular play times
- Use Discord bots to remind players

### Server Migration
- Move to a different hosting provider
- Use paid hosts that allow AFK bots
- Self-host on your own computer

### Aternos Alternatives
- **Minehut**: Free hosting with different policies
- **Server.pro**: Free tier with bot tolerance
- **Self-hosting**: Complete control over server rules

## Understanding the Risks

### What Happens When Detected
1. **Immediate suspension**: Account banned without warning
2. **Loss of worlds**: All server data may be lost
3. **IP restrictions**: Possible IP-based bans
4. **No appeals**: Aternos doesn't reverse bot-related bans

### Detection Methods
- **Movement patterns**: Repetitive or robotic behavior
- **Connection timing**: Regular connection intervals
- **Player behavior**: Lack of genuine interactions
- **Resource usage**: Constant server activity without real players

## Responsible Usage

If you choose to proceed despite the risks:

### Use Throwaway Accounts
- Don't use your main Aternos account
- Create a separate account for bot testing
- Don't store important worlds on bot-tested servers

### Monitor Activity
- Check server status regularly
- Stop the bot if it causes issues
- Watch for unusual server behavior

### Respect Server Resources
- Don't run multiple bots simultaneously
- Use the slowest movement settings possible
- Stop the bot when not needed

## Technical Configuration

### Recommended Aternos Settings

```env
# Slower movements (every 45 seconds)
MOVEMENT_INTERVAL=45000

# Conservative reconnection
RECONNECT_DELAY=10000
MAX_RECONNECT_ATTEMPTS=5

# Minimal but human-like behavior
HUMAN_LIKE_DELAYS=true
RANDOM_MOVEMENT=true
JUMP_OCCASIONALLY=true
```

### Server.properties for Aternos
Ensure your Aternos server has:
- `online-mode=false` (default for Aternos)
- No anti-bot plugins installed
- Whitelist disabled (unless bot is whitelisted)

## Final Reminder

**This bot will result in account suspension on Aternos.**

Only proceed if you:
- ✅ Understand the permanent consequences
- ✅ Are using a throwaway account
- ✅ Have no important data to lose
- ✅ Accept full responsibility for the outcome

**Better alternatives exist** - consider legitimate server activity methods instead of risking your account.
# Overview

This project is a Node.js Minecraft AFK bot built with the mineflayer library, specifically optimized for Aternos servers while maintaining compatibility with other Minecraft servers. The bot automatically connects to Minecraft servers and performs human-like activities to maintain server presence, including random movement patterns, chat interactions, and anti-AFK behaviors. The system features Aternos-specific configurations with slower movement patterns, conservative reconnection strategies, and infinite reconnection attempts to ensure 24/7 operation. Usage on Aternos violates their Terms of Service and will result in account suspension.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## 2025-08-04: Critical Bug Fixes and Stability Improvements
- **Fixed undefined username logging**: Bot now properly displays username on login
- **Fixed game mode access error**: Added proper null checks for `this.bot.game` object access  
- **Resolved port conflicts**: UptimeRobot now uses random ports (5000-6000 range) to avoid EADDRINUSE errors
- **Enhanced error handling**: Added resilient error handling for ECONNRESET and other connection issues
- **Fixed infinite reconnection parsing**: Configuration now properly handles "infinite" string value from .env
- **Improved spawn process**: Added delayed initialization with error wrapping for controller setup
- **Enhanced connection resilience**: Bot no longer exits on connection errors, allows automatic reconnection

**Result**: Bot now successfully connects to Aternos servers and maintains stable operation with proper error recovery.

# System Architecture

## Core Bot Architecture
The application follows a modular, class-based architecture with clear separation of concerns:

- **Main Bot Class (`MinecraftBot`)** - Central orchestrator managing connection lifecycle, event handling, and component coordination
- **Movement Controller** - Handles automated movement patterns with randomization to simulate human behavior
- **Command Handler** - Processes chat commands and manages user interactions with authorization controls
- **Logger** - Centralized logging system with configurable levels and timestamp formatting
- **Configuration Manager** - Environment-based configuration with validation and defaults

## Connection Management
The bot implements robust connection handling with:
- Support for multiple authentication modes (Microsoft, Mojang, offline)
- Automatic reconnection with exponential backoff and maximum attempt limits
- Version auto-detection for compatibility across Minecraft versions 1.8-1.21
- Graceful error handling and recovery mechanisms

## Behavioral Systems
Anti-detection features include:
- **Movement Patterns** - Random walking, turning, jumping with human-like delays
- **Look Mechanics** - Periodic random looking around to simulate attention
- **Interaction Simulation** - Occasional inventory opening and sneaking
- **Chat Responses** - Natural conversation patterns and mention handling

## Configuration System
Environment-based configuration supporting:
- Server connection parameters (host, port, credentials)
- Behavioral settings (movement intervals, chat responses)
- Anti-detection parameters (human-like delays, randomization)
- Aternos-specific optimizations (slower intervals, conservative reconnection)
- Logging and monitoring options
- Multiple configuration templates (.env.example, .env.aternos)

# External Dependencies

## Core Dependencies
- **mineflayer** (v4.25.0) - Primary Minecraft bot framework providing server connection, world interaction, and protocol handling
- **dotenv** (v17.2.1) - Environment variable management for configuration

## Authentication Services
- **Microsoft/Azure MSAL** - Microsoft account authentication for premium Minecraft accounts
- **Mojang Authentication** - Legacy Mojang account support
- **Offline Mode** - Cracked server support without authentication

## Runtime Environment
- **Node.js** - JavaScript runtime (v16+ recommended)
- **Process Management** - Signal handling for graceful shutdown (SIGINT/SIGTERM)

## Network Protocols
- **Minecraft Protocol** - TCP-based communication with Minecraft servers
- **WebSocket/HTTP** - For authentication token management and API calls
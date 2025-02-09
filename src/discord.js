'use strict';

const { Client, Collection, GatewayIntentBits } = require('discord.js')

const db = require("./db")
const logger = require("./logger")
const {
  guildCreate,
  interactionCreate,
  messageReactionAdd,
} = require("./handlers")
const { starryCommand } = require('./commands');

// List of intents: https://discord.com/developers/docs/topics/gateway#list-of-intents
// Corresponds with client events: https://discord.js.org/#/docs/discord.js/stable/class/Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Allows us to manage roles
    GatewayIntentBits.GuildMessageReactions // Allows us to detect reactions
  ]
})

/// Install commands
client.commands = new Collection();
/// Install /starry command, which includes the actual commands for this bot
// as subcommands and subcommand groups, as configured in src/commands/index.js
// starryCommand.data.name is "starry"
// starryCommand has the execute function
client.commands.set(starryCommand.data.name, starryCommand);

///
/// Handle inbound events from discord
///

// Handler for discord bot server starting
client.on("ready", async () => { logger.info(`starrybot has star(ry)ted.`) });

// Handler for discord bot joining a server
client.on("guildCreate", guildCreate);

// Handler for discord bot messages being directly interacted with
// (e.g. button press, commands used, replies in the command chain)
client.on('interactionCreate', interactionCreate);

// Handler for emoji reactions on discord messages from our bot
client.on('messageReactionAdd', messageReactionAdd );

//////////////////////////////////////////////////////////////////////////////////////////////////////////

///
/// Register with discord
///

const login = async () => {
  let token = db.myConfig.DISCORD_TOKEN || process.env.DISCORD_TOKEN;
  const loggedInToken = await client.login(token)
  if (loggedInToken !== token) {
    logger.warn('There might be an issue with the Discord login')
    return false
  } else {
    return true
  }
}

login().then((res) => {
  if (res) {
    logger.log('Connected to Discord')
    client.user.setActivity('ya. starrybot ', { type: 'LISTENING' })
  } else {
    logger.log('Issue connecting to Discord')
  }
})

module.exports = { client }

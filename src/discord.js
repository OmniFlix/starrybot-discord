'use strict';

const { Client, Collection, Intents } = require('discord.js')

const db = require("./db")
const logger = require("./logger")
const {
    guildCreate,
    interactionCreate,
    messageCreate,
    messageReactionAdd,
} = require("./handlers")
const { starryCommand } = require('./commands');

const intents = new Intents([ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ]);
const client = new Client({intents: intents })

/// Install commands
client.commands = new Collection();
/// Install /starry command, which includes the actual commands for this bot
// as subcommands and subcommand groups, as configured in src/commands/index.js
client.commands.set(starryCommand.data.name, starryCommand);

///
/// Handle inbound events from discord
///

// Handler for discord bot server starting
client.on("ready", async () => { logger.info(`StarryBot has star(ry)ted.`) });

// Handler for discord bot joining a server
client.on("guildCreate", guild => guildCreate(guild, client) );

// Handler for discord bot messages being directly interacted with
// (e.g. button press, commands used, replies to wizard steps)
client.on('interactionCreate', interaction => interactionCreate(interaction, client) );

// Handler for messages that may be responses to the wizard steps
client.on('messageCreate', messageCreate);

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
		client.user.setActivity('ya. starrybot.xyz', { type: 'LISTENING' });
	} else {
		logger.log('Issue connecting to Discord')
	}
})

module.exports = { client }

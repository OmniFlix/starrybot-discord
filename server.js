'use strict';

const db = require("./db");

////////////////////////////////
// Create a Winston logger that streams to Stackdriver Logging
////////////////////////////////

let logger = {
	info: (...args) => console.info(...args),
	log: (...args) => console.log(...args),
	err: (...args) => console.error(...args),
	error: (...args) => console.error(...args),
}

if (db.myConfig.WINSTON) {
	const winston = require('winston');
	const {LoggingWinston} = require('@google-cloud/logging-winston');
	const loggingWinston = new LoggingWinston();
	const wlog = winston.createLogger({
		level: 'info',
		transports: [new winston.transports.Console(), loggingWinston],
	});
	logger.info = (...args) => wlog.info(...args)
	logger.log = (...args) => wlog.info(...args)
	logger.err = (...args) => wlog.log('error',...args)
	logger.error = (...args) => wlog.log('error',...args)
}

////////////////////////////////
// signing stuff
////////////////////////////////

const { serializeSignDoc } = require('@cosmjs/amino')
const { Secp256k1, Secp256k1Signature, sha256 } = require('@cosmjs/crypto')
const { fromBase64 } = require('@cosmjs/encoding')

function signing_dowork(args) {
	// TODO: the next task to do :)
	return 'I could have access to your database rows because I am a message from the backend. Sincerely, the backend'
}

////////////////////////////////
// express app
////////////////////////////////

const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.static('public'))

// There's probably some settings we can customize for cors here
app.use(cors())

app.enable('trust proxy')
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use((req, res, next) => {
	res.set('Content-Type', 'text/html')
	next()
})

let pool = 0;

app.use(async (req, res, next) => {
	if (pool) {
		return next();
	}
	try {
		pool = await db.createPoolAndEnsureSchema()
		next()
	} catch (err) {
		logger.error(err)
		return next(err)
	}
})

app.post('/starry-backend', async (req, res) => {

	// TODO
	//
	// https://cosmos-webapp.pages.dev/?traveller=session
	//
	// is this a valid uuid?
	// ask db for carl sagan phrase
	// check time stamp
	// if error then say error
	//
	// if ok then
	//		turn on sign button
	//    signature = please sign this msg
	//    blob = {
	//		  session
	//		  signed message
	//	   	signature
	//    }
	//    send to https://queenbot.uc.r.appspot.com/starry-backend
	//

	console.log('req.body', req.body);

	try {
		// If they didn't send the proper parameter
		if (!req.body.traveller) {
			res.sendStatus(400)
		} else {
			let rowInfo = await db.getRowBySessionToken(req.body.traveller)
			console.log('rowInfo', rowInfo)
			if (rowInfo.length === 0) {
				res.sendStatus(400)
			}

			const createdAt = rowInfo[0].created_at;
			console.log('createdAt', createdAt)
			// TODO: see if they've surpassed their allotted time to respond
			const saganism = rowInfo[0].saganism;
			console.log('saganism', saganism)

			res.send({saganism, createdAt});
			// let results = signing_dowork();
		}
	} catch (e) {
		console.warn('Error hitting starry-backend', e)
	}

})

app.post('/keplr-signed', (req, res) => {
	let allIsGood = true
	if (allIsGood) {
		res.sendStatus(200)
	} else {
		// Bad Request, you're grounded
		res.sendStatus(400)
	}
})

const PORT = db.myConfig.PORT || 8080;
const server = app.listen(PORT, () => {
	logger.info(`App listening on port ${PORT}`)
})

module.exports = server


////////////////////////////////
// Instance settings...
//
// TODO/TBD
//
// - the theory is that people will throw this bot in their server
// - and they want to configure the bot for their server
// - so i think this bot thing needs to deal with many servers and all kinds of data
// - presumably there is some way to understand the current context
// - and presumably we can store that in a db
// - and allow config either by a website or maybe in the bot itself
// - anyway, this code pretends to do that
//
////////////////////////////////

let fakedb = {
	default:{
		validatorURL: "https://cosmos-webapp.pages.dev/?traveller=",
		channelName:  "secretspecialchannel",
		channelId: "846500999007043615",
		//role:"futurian"
	}
}

db.settingsAdd = (id,params) => {
	fakedb[id]=params
}

db.settingsGet = (id="default") => {
	return fakedb[id]
}

////////////////////////////////
// The Discord bot
////////////////////////////////

const Sagan = require("./sagan.js")

const { Client, Intents, MessageEmbed, Permissions } = require('discord.js')
const {myConfig} = require("./db");

const intents = new Intents([ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ]);
const client = new Client({intents: intents })

client.on("ready", () => {
	logger.info(`StarryBot has star(ry)ted.`)
});

client.on("messageCreate", async message => {
	if (message.author.bot) return
	if (message.content.indexOf(db.myConfig.PREFIX) !== 0) return

	// since this bot serves many masters, go ahead and find which server is involved here
	let disco = db.settingsGet()

	// peel a few details out of the message
	const {guildId, author } = message;
	const args = message.content.slice(db.myConfig.PREFIX.length).trim().split(/ +/g)
	const command = args.shift().toLowerCase()

	switch(command) {
		case "starry":
			let uuid = author.id
			const memberExists = await db.memberExists(uuid, guildId);

			if (memberExists.length !== 0) {
				// TODO it may be possible to ask discord rather than asking our own database - more stable
				message.channel.send("You're already validated on this server :)")
				break
			}

			// get a funny quote
			let sagan = Sagan.sagan()

			// create a session in db
			let sessionId = await db.memberAdd({
				discord_account_id: uuid,
				discord_guild_id: guildId,
				saganism: sagan
			})

			// tell user to go to validator site
			const exampleEmbed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`Please visit: ${disco.validatorURL+sessionId}`)
				.setURL(url)
				.setAuthor('Starrybot', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
				.setDescription(sagan)
				.setThumbnail('https://i.imgur.com/AfFp7pu.png')
				.setTimestamp()
				.setFooter('Put your helmet on', 'https://i.imgur.com/AfFp7pu.png');

			// send it privately
			await message.author.send({ embeds: [exampleEmbed] });

			// but also tell them to check their dms publically
			await message.channel.send("Check your DM's");
			break

		case "starry-delete":
			// tell them first in case of crash
			await message.channel.send("You've been brought back to earth. (And removed as requested.)")
			// then attempt remove
			await db.memberDelete(author.id, guildId)
			break

		case "starry-magic":

			// As a test, immediately add the person who sent the message to the secret channel
			const guild = await client.guilds.fetch(guildId)
			const everyoneRole = guild.roles.everyone
			const channel = await guild.channels.cache.get(disco.channelId)
			await channel.permissionOverwrites.set([{ id: message.author.id , allow: ['VIEW_CHANNEL'] }])
			logger.log("elevated perms")

			// It makes sense to ALSO send them an invite code?
			try {
				const guild = await client.guilds.fetch(guildId);
				const channel = await guild.channels.cache.get(disco.channelId);
				const invite = await channel.createInvite({maxUses: 1 });
				let url = `https://discord.gg/${invite.code}`
				await message.author.send(url)
			} catch(e) {
				logger.error(e)
			}
			logger.log("invite sent")

			// There is an idea of adding a "ROLE" to a user.
			if(disco.role) {
				let role = message.guild.roles.cache.find(r => r.name === disco.role)
				if(!role) {
					message.channel.send("Hmm, cannot find role " + disco.role)
				} else {
					let member = message.mentions.members.first();
					message.member.roles.add(role).catch(console.error);
				}
			}
			break
	}

});

const login = async () => {
	const loggedInToken = await client.login(db.myConfig.DISCORD_TOKEN)
	if (loggedInToken !== myConfig.DISCORD_TOKEN) {
		console.warn('There might be an issue with the Discord login')
		return false
	} else {
		return true
	}
}

login().then((res) => {
	if (res) {
		console.log('Connected to Discord')
	} else {
		console.log('Issue connecting to Discord')
	}
})

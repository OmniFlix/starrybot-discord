const myConfig = require("./auth.json");
// const myConfig = require("./auth-local.json");
// const myConfig = require("./auth-prod.json");

const knex = require('knex')({
	client: 'pg',
	connection: {
		user: myConfig.DB_USER,
		password: myConfig.DB_PASS,
		database: myConfig.DB_NAME,
		host: myConfig.DB_HOSTIP,
		port: myConfig.DB_HOSTPORT,
	},
	pool: {
		max: 5,
		min: 5,
		acquireTimeoutMillis: 60000,
		createTimeoutMillis: 30000,
		idleTimeoutMillis: 600000,
		createRetryIntervalMillis: 200,
	}
});

let knex_initialized = false

const ensureDatabaseInitialized = async () => {
	if(knex_initialized) return
	knex_initialized = true
	try {
		const hasTable = await knex.schema.hasTable(myConfig.DB_TABLENAME)
		if (!hasTable) {
			return knex.schema.createTable(myConfig.DB_TABLENAME, table => {
				table.increments('id').primary()
				table.string('discord_account_id').notNullable()
				table.string('discord_guild_id').notNullable()
				table.timestamp('created_at').defaultTo(knex.fn.now())
				table.string('session_token').notNullable()
				table.text('saganism', 'mediumtext').notNullable()
				table.boolean('is_member')
			})
		}
	} catch(err) {
		logger.error(err);
		throw err;
	}
}

////////////////////////////////
// SessionID
// Math.random should be unique because of its seeding algorithm.
// Convert it to base 36 (numbers + letters), and grab the first 9 characters
// after the decimal.
////////////////////////////////

const SessionID = function () {
	return Math.random().toString(36).substr(2, 9);
};



////////////////////////////////
// database wrapper for guild
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
	"765639120021749760":{
		validatorURL: "https://cosmos-webapp.pages.dev/?traveller=",
		channelId: "846500999007043615",
		//role:"futurian"
	},
	"default":{
		validatorURL: "https://cosmos-webapp.pages.dev/?traveller=",
		channelId: "12341234",
		//role:"futurian"		
	}
}

const guildSet = async (id,params) => {
	fakedb[id]=params
}

const guildGet = async (id="default") => {
	return fakedb[id] || fakedb.default
}

////////////////////////////////
// database wrapper - for members
////////////////////////////////

const memberExists = async (uuid, guildId) => {
	return knex(myConfig.DB_TABLENAME).where({
		discord_account_id: uuid,
		discord_guild_id: guildId
	}).select('id')
}

const memberAdd = async ({discord_account_id, discord_guild_id, saganism}) => {
	let session_token = SessionID()
	await knex(myConfig.DB_TABLENAME).insert({
		discord_account_id,
		discord_guild_id,
		saganism,
		session_token
	})
	return session_token
}

const memberDelete = async (uuid, discord_guild_id) => {
	try {
		await knex(myConfig.DB_TABLENAME).where('discord_account_id', uuid)
			.andWhere('discord_guild_id', discord_guild_id).del()
	} catch (e) {
		console.warn('Error deleting row', e)
	}
}

const getRowBySessionToken = async (session_token) => {
	return knex(myConfig.DB_TABLENAME)
		.where('session_token', session_token)
		.select('created_at', 'saganism')
}

module.exports = { memberExists, memberAdd, memberDelete, getRowBySessionToken, ensureDatabaseInitialized, myConfig, guildSet, guildGet }

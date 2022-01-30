const { WizardStep } = require("../../wizard")
const { rolesSet } = require("../../../db")
const { createAddTokenEmbed } = require("../script")

function createStep2(userId, parentWizard) {
    let step = new WizardStep(
      parentWizard,
      'text',
      null,
      async({ interaction }, ...extra) => {
        const guild = await parentWizard.client.guilds.fetch(parentWizard.guildId)
        let channel = await guild.channels.fetch(parentWizard.channelId);
        await channel.send({
          embeds: [ createAddTokenEmbed('step2BeginFn') ]
        });
      },
      async({ interaction }, ...extra) => {
        const amountOfTokensNeeded = interaction.content
        if (!Number.isInteger(parseInt(amountOfTokensNeeded)) || amountOfTokensNeeded <= 0 ) {
          // Invalid reply
          return await parentWizard.failure('Need a positive number of tokens.')
        }
  
        // Create role for them, but first check if it exists
        const roleToCreate = `${parentWizard.state.tokenSymbol}-hodler`
  
        const guild = await parentWizard.client.guilds.fetch(parentWizard.guildId)
        const existingObjectRoles = await guild.roles.fetch();
  
        // TODO: use filter or map or other fun JS stuff
        let hasRole = false
        for (let role of existingObjectRoles.values()) {
          if (role.name === roleToCreate) {
            hasRole = true
            break
          }
        }
  
        // Create it if it doesn't exist
        if (!hasRole) {
          const newRole = await guild.roles.create({name: roleToCreate, position: 0})
          console.log('created new role with ID', newRole.id)
        }
  
        // Create database row
        // TODO: remember to make the "testnet" entry here not hardcoded, waiting for DAODAO mainnet
        await rolesSet(parentWizard.guildId, roleToCreate, 'cw20', parentWizard.state.cw20, 'testnet', true, interaction.author.id, amountOfTokensNeeded)
        parentWizard.done(`You may now use the role ${roleToCreate} for token-gated channels.\n\nEnjoy, traveller!`)
      }
    )
    return step
  }
  
  module.exports = {
    createStep2,
  }
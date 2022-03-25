const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { myConfig, rolesGetForCleanUp, rolesDeleteGuildAll} = require("../../db");

module.exports = {
  farewellConfirmation: {
    name: 'farewellConfirmation',
    execute: async (req, ctx, next) => {
      const { guild, guildId, interaction } = ctx;
      const roleManager = guild.roles;
      const rest = new REST().setToken(myConfig.DISCORD_TOKEN);

      // find all roles to clean up
      const rolesToCleanUp = await rolesGetForCleanUp(guildId)
      for (let role of rolesToCleanUp) {
        try {
          let roleObj = roleManager.cache.find(r => r.name === role['give_role'])
          if (roleObj) await rest.delete(Routes.guildRole(guildId, roleObj.id))
        } catch (e) {
          console.log(`Error deleting account ${role['give_role']}`, e)
        }
      }

      // delete all the roles from the database
      await rolesDeleteGuildAll(guildId)

      // confirm
      await interaction.reply('Bye!')

      // leave
      await interaction.guild.leave()
    }
  }
}

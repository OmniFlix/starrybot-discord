const { rolesSet } = require("../../db");

module.exports = {
  promptTokenName: {
    name: 'promptTokenName',
    config: async (req, ctx, next) => {
      const {
        interaction: {
          author,
          content,
          guild,
          guildId,
       }
      } = req;
      let roleToCreate = content;
      const existingObjectRoles = await guild.roles.fetch();
      let roleAlreadyExists = existingObjectRoles.some(role => role.name === roleToCreate);
      if (roleAlreadyExists) {
        // Invalid reply
        return {
          error: 'A token role already exists with this name. Please pick a different name, or rename that one first.'
        };
      } else {
        await guild.roles.create({name: roleToCreate, position: 0});
      }

      // Create database row
      await rolesSet(
        guildId,
        roleToCreate,
        ctx.tokenType,
        ctx.tokenAddress,
        ctx.network,
        true,
        author.id,
        ctx.minimumTokensNeeded,
        ctx.decimals,
        ctx.stakingContract
      );

      return {
        doneMessage: `You may now use the role ${roleToCreate} for token-gated channels.\n\nEnjoy, traveller!`
      }
    }
  }
}

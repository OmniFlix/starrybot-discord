const { buildBasicMessageCommand } = require('../../utils/commands');
const { roleGet } = require("../../db");

module.exports = {
	removeVerify: {
		name: 'removeVerify',
		execute: buildBasicMessageCommand(async (req, res, ctx, next) => {
			const { interaction } = req;
			const { guildId } = interaction;
			const selectedRole = interaction.content;
			// Save the selection in ctx for removeConfirmation
			ctx.selectedRole = selectedRole;

			// Make sure we recognize the selected role
			const role = await roleGet(guildId, selectedRole);
			if (!role) {
				await res.error('Invalid role. Remember: first you copy, then you paste.')
				return;
			}
		
			return {
				content: `Are you sure you want to delete ${selectedRole}?`,
				buttons: [
					{
						customId: 'removeConfirmation',
						label: 'Yes please!',
						style: 'PRIMARY',
					},
					{
						customId: 'removeRejection',
						label: 'Cancel',
						style: 'SECONDARY',
					}
				],
			}
		}),
	}
}

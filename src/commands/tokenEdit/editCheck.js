const { roleGet } = require("../../db");

module.exports = {
  editCheck: {
    name: 'editCheck',
    config: async (args) => {
      const { guildId, userInput: selectedRole } = args;

      // Make sure we recognize the selected role
      const role = await roleGet(guildId, selectedRole);
      if (!role) {
        return {
          error: 'Invalid role. Remember: first you copy, then you paste.'
        };
      } else {
        // Save the selection in args for later steps
        args.selectedRoleName = selectedRole;
        args.selectedRole = role;
        return {
          content: `What would you like to edit for ${selectedRole}?`,
          buttons: [
            {
              customId: 'editRoleName',
              label: 'Role Name',
              style: 'PRIMARY',
            },
            {
              customId: 'editRoleAmount',
              label: 'Role Amount',
              style: 'PRIMARY',
            }
          ]
        }
      }
    }
  }
}

const Keyv = require('keyv');
const disabledcmds = new Keyv(process.env.DB_URI.replace('dbname', 'disabledcmds'));

module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    let err = 0;
    const disabledCommands = await disabledCmds.get(interaction.guild.id);
    if (disabledCommands && disabledCommands.includes(command.data.name)) {
      return interaction.reply({ content: `This command is currently disabled on this server.`, ephemeral: true });
    }

    if (command.requiredPerms) {
      command.requiredPerms.forEach(async (perm) => {
        if (!interaction.member.permissions.has(perm)) {
          err = 1;
          interaction.reply({ content: `You need the following permission to run this: ${'`' + perm + '`'}`, ephemeral: true });
        }
      });
    }

    if (command.botRequiredPerms) {
      command.botRequiredPerms.forEach(async (perm) => {
        if (!interaction.guild.me.permissions.has(perm)) {
          err = 1;
          interaction.reply({ content: `I need the following permission to run this: ${'`' + perm + '`'}`, ephemeral: true });
        }
      });
    }
    if (err) return;

    await command.execute(interaction);
  }

  else if (interaction.isSelectMenu) {
    if (interaction.customId === 'role_picker') {
      let error = 0;
      if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) {
        error = 1;
        interaction.reply({ content: `I need the following permission to run this: ${'`' + 'MANAGE_ROLES' + '`'}`, ephemeral: true });
      }

      interaction.values.forEach((roleId) => {
        const role = interaction.guild.roles.cache.get(roleId);
        if (interaction.guild.me.roles.highest.comparePositionTo(role) <= 0) {
          error = 1;
          return interaction.reply({ content: `Error at role ${'`' + role.name + '`'}. My roles must be higher than the role that you want to give yourself.`, ephemeral: true });
        }

        interaction.member.roles.add(roleId);
      });

      interaction.component.options.map((option) => option.value).forEach((roleId) => {
        if (interaction.member.roles.cache.has(roleId) && !interaction.values.includes(roleId)) {
          const role = interaction.guild.roles.cache.get(roleId);
          if (interaction.guild.me.roles.highest.comparePositionTo(role) <= 0) {
            error = 1;
            return interaction.reply({ content: `Error at role ${'`' + role.name + '`'}. My roles must be higher than the role that you want to remove from yourself.`, ephemeral: true });
          }

          interaction.member.roles.remove(roleId);
        }
      });

      if (!error) {
        interaction.reply({ content: `Successfully updated your roles.`, ephemeral: true });
      }
    }
  }
}
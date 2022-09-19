const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const disabledcmds = new Keyv(process.env.DB_URI.replace('dbname', 'disabledcmds'));
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enablecmd')
    .setDescription(`Enables a command from the server.`)
    .addStringOption((option) => option
      .setName('command')
      .setDescription(`The command that you want to enable`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const command = interaction.options.getString('command');
    let disabledCommands = await disabledcmds.get(interaction.guild.id);
    if (!disabledCommands.includes(command)) {
      return interaction.reply({ content: `${'`' + command + '`'} is not disabled.`, ephemeral: true });
    }

    disabledCommands.splice(disabledCommands.indexOf(command), 1);
    await disabledcmds.set(interaction.guild.id, disabledCommands);
    await sendLog(interaction, `${'`' + command + '`'} has been enabled.`);
  }
}
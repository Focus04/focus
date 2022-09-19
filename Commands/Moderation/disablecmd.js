const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const disabledcmds = new Keyv(process.env.DB_URI.replace('dbname', 'disabledcmds'));
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disablecmd')
    .setDescription(`Disables a command from the server.`)
    .addStringOption((option) => option
      .setName('command')
      .setDescription(`The command that you want to disable`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const commandName = interaction.options.getString('command');
    const command = interaction.client.commands.get(commandName);
    if (!command) {
      return interaction.reply({ content: `${'`' + commandName + '`'} is not a valid command.`, ephemeral: true });
    }

    let disabledCommands = await disabledcmds.get(interaction.guild.id);
    if (!disabledCommands) disabledCommands = [];
    disabledCommands.push(commandName);
    await disabledcmds.set(interaction.guild.id, disabledCommands);
    await sendLog(interaction, `${'`' + commandName + '`'} has been disabled.`);
  }
}
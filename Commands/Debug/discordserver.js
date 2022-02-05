const { SlashCommandBuilder } = require('@discordjs/builders');
const { urls: { discordInviteLink } } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('discordserver')
    .setDescription(`Sends an invite link to the bot's support server.`),
  execute(interaction) {
    interaction.reply({ content: discordInviteLink, ephemeral: true });
  }
}
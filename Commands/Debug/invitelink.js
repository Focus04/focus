const { SlashCommandBuilder } = require('@discordjs/builders');
const { urls: {botInviteLink} } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invitelink')
    .setDescription(`Sends the invite link for the bot.`),
  execute(interaction) {
    interaction.reply({ content: botInviteLink, ephemral: true });
  }
}
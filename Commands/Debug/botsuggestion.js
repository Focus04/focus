const { SlashCommandBuilder } = require('@discordjs/builders');
const { suggestionChId, urls: { discordInviteLink } } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botsuggestion')
    .setDescription(`Submits a suggestion directly to the bot's Discord server.`)
    .addStringOption((option) => option
      .setName('suggestion')
      .setDescription('The suggestion you want to send.')
      .setRequired(true)
    ),
  async execute(interaction) {
    const author = interaction.member.user.tag;
    const suggestion = interaction.options.getString('suggestion');
    await interaction.client.channels.cache
      .get(suggestionChId)
      .send(`__Suggestion by ${author}__\n\n${suggestion}`);
    interaction.reply({ content: `Your suggestion has been successfully submitted to our server and is now awaiting a review from the developer's side. You can join our Discord server anytime using this link: ${discordInviteLink}`, ephemeral: true });
  }
}
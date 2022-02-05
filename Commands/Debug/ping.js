const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(`Displays the bot's current latency in ms.`),
  async execute(interaction) {
    let msg = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Response Latency: ${Math.floor(msg.createdTimestamp - interaction.createdTimestamp)} ms`);
  }
}
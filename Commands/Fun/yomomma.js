const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yomomma')
    .setDescription(`Sends a your mom joke to someone.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user this joke is directed to.`)
      .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const response = await fetch('https://api.yomomma.info/');
    const data = await response.json();
    interaction.reply({ content: `${member}, ${data.joke}` });
  }
}
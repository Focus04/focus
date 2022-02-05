const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dogfact')
    .setDescription(`Sends a lovely dog fact.`),
  async execute(interaction) {
    let response = await fetch('https://dog-api.kinduff.com/api/facts');
    let data = await response.json();
    interaction.reply({ content: data.facts[0] });
  }
}
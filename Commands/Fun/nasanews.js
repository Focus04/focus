const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nasanews')
    .setDescription(`Looks up an astronomy-related term on NASA's Website and returns a fact about it.`)
    .addStringOption((option) => option
      .setName('term')
      .setDescription('The term you want to search.')
      .setRequired(true)
    ),
  async execute(interaction) {
    const term = interaction.options.getString('term');
    const response = await fetch(`https://images-api.nasa.gov/search?q=${term}`);
    const data = await response.json();
    if (!data.collection.items[0].data[0].description) {
      return interaction.reply({ content: `Couldn't find any results for ${'`' + term + '`'}`, ephemeral: true });
    }

    let color = getRoleColor(interaction.guild);
    const nasaSearchEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(data.collection.items[0].data[0].title)
      .setDescription(data.collection.items[0].data[0].description)
      .setImage(data.collection.items[0].links[0].href.split(' ').join('%20'))
      .setTimestamp();
    interaction.reply({ embeds: [nasaSearchEmbed] });
  }
}
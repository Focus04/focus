const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('define')
    .setDescription(`Looks up a term in the dictionary.`)
    .addStringOption((option) => option
      .setName('term')
      .setDescription('The term you want to search.')
      .setRequired(true)
    ),
  async execute(interaction) {
    const term = interaction.options.getString('term');
    const response = await fetch(`http://api.urbandictionary.com/v0/define?term=${term}`);
    const data = await response.json();
    if (!data.list[0] || !data.list[0].definition) {
      return interaction.reply({ content: `Couldn't find any results for ${'`' + term + '`'}`, ephemeral: true });
    }

    const definition = data.list[0].definition
      .split('[')
      .join('')
      .split(']')
      .join('');
    const example = data.list[0].example
      .split('[')
      .join('')
      .split(']')
      .join('');
    let color = getRoleColor(interaction.guild);
    const defineEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`What does ${term} mean?`)
      .addFields(
        { name: 'Definition', value: '```' + definition + '```' },
        { name: 'Example', value: '```' + (example || 'N/A') + '```' }
      )
      .setTimestamp();
    interaction.reply({ embeds: [defineEmbed] });
  }
}
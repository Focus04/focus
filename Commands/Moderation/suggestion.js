const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const suggestionChannels = new Keyv(process.env.DB_URI).replace('dbname', 'suggestionChannels');
const { suggestionAccepted, suggestionDeclined } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription(`Accept or decline a suggestion from your suggestion channel.`)
    .addStringOption((option) => option
      .setName('acceptdecline')
      .setDescription(`Choose what to do with this suggestion.`)
      .addChoices(
        { name: 'Accept', value: 'accept' },
        { name: 'Decline', value: 'decline' }
      )
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('messageid')
      .setDescription(`The id of the message that contains the suggestion.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const status = interaction.options.getString('acceptdecline').toLowerCase();
    const id = interaction.options.getString('messageid');
    if (status !== 'accept' && status !== 'decline') {
      return interaction.reply({ content: `Proper command usage: /suggestion accept/decline [messageid]`, ephemeral: true });
    }

    const suggestionChName = await suggestionChannels.get(interaction.guild.id);
    const suggestionChannel = interaction.guild.channels.cache.find((ch) => ch.name === suggestionChName);
    if(!suggestionChannel) {
      return interaction.reply({ content: `This server doesn't have a suggestion channel yet. Set one by using /suggestionchannel`, ephemeral: true });
    }

    let error = 0;
    let state;
    const suggestionMessage = await suggestionChannel.messages.fetch(id).catch((err) => error = err);
    console.log(error);
    if (error) {
      return interaction.reply({ content: `Couldn't find any suggestions with the id of ${'`' + id + '`'}`, ephemeral: true });
    }

    const oldSuggestionEmbed = suggestionMessage.embeds[0];
    if(status === 'accept') {
      const newSuggestionEmbed = new MessageEmbed()
        .setColor(suggestionAccepted.color)
        .setTitle(oldSuggestionEmbed.title)
        .setDescription(oldSuggestionEmbed.description)
        .addField(suggestionAccepted.statusTitle, suggestionAccepted.status);
      suggestionMessage.edit({ embeds: [newSuggestionEmbed] });
      state = 'approved';
    } else if (status === 'decline') {
      const newSuggestionEmbed = new MessageEmbed()
        .setColor(suggestionDeclined.color)
        .setTitle(oldSuggestionEmbed.title)
        .setDescription(oldSuggestionEmbed.description)
        .addField(suggestionDeclined.statusTitle, suggestionDeclined.status);
      suggestionMessage.edit({ embeds: [newSuggestionEmbed] });
      state = 'declined';
    }

    interaction.reply({ content: `Suggestion successfully ${state}.`, ephemeral: true });
  }
}
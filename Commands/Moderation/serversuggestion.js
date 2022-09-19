const Keyv = require('keyv');
const suggestionChannels= new Keyv(process.env.DB_URI).replace('dbname', 'suggestionChannels');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { suggestionPending, suggestionApprove, suggestionDecline } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serversuggestion')
    .setDescription(`Submit a server suggestion.`)
    .addStringOption((option) => option
      .setName('suggestion')
      .setDescription(`The suggestion that you want to submit.`)
      .setRequired(true)
    ),
  async execute(interaction) {
    const suggestion = interaction.options.getString('suggestion');
    const suggestionChName = await suggestionChannels.get(interaction.guild.id);
    const channel = interaction.guild.channels.cache.find((channel) => channel.name === suggestionChName);
    if (!channel) {
      return interaction.reply({ content: `This server doesn't have a suggestion channel set yet. Use /suggestionchannel to set one.`, ephemeral: true });
    }

    const suggestionEmbed = new MessageEmbed()
      .setColor(suggestionPending.color)
      .setTitle(`Suggestion by ${interaction.member.user.tag}`)
      .setDescription('```' + suggestion + '```')
      .addField(suggestionPending.statusTitle, suggestionPending.status)
      .setTimestamp();
    const msg = await channel.send({ embeds: [suggestionEmbed] });
    await msg.react(suggestionApprove);
    await msg.react(suggestionDecline);
    interaction.reply({ content: `Your suggestion has been successfully submitted and is now awaiting review.`, ephemeral: true });
  }
}
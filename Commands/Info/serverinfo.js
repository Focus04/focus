const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription(`Displays information about the server you're in.`),
  execute(interaction) {
    let color = getRoleColor(interaction.guild);
    const serverInfoEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle('Server Information')
      .addFields(
        { name: 'Server Name', value: `${interaction.guild.name}` },
        { name: 'Server ID', value: `${interaction.guild.id}` },
        { name: 'Total Members', value: `${interaction.guild.memberCount}` },
        { name: 'Owner', value: `${interaction.guild.owner}` },
        { name: 'Created At', value: `${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} (${moment(interaction.guild.createdTimestamp).fromNow()})` },
        { name: 'Role Count', value: `${interaction.guild.roles.cache.size}` },
        { name: 'Channel Count', value: `${interaction.guild.channels.cache.size}` },
        { name: 'Custom Emoji Count', value: `${interaction.guild.emojis.cache.size}` },
        { name: 'Boost Count', value: `${interaction.guild.premiumSubscriptionCount || '0'}` }
      )
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTimestamp();
    interaction.reply({ embeds: [serverInfoEmbed] });
  }
}
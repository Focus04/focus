const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription(`Displays information about a user's account account.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user you want to view info about.')
    ),
  execute(interaction) {
    let color = getRoleColor(interaction.guild);
    const member = interaction.options.getMember('user');
    let userInfoEmbed;
    if (!member) {
      const roles = '```' + interaction.member.roles.cache.map((role) => role.name).join(`, `) + '```';
      const perms = '```' + interaction.member.permissions.toArray().join(`\n`) + '```';
      let badges = '```' + interaction.member.user.flags.toArray().join(', ') + '```';
      if (badges === '``````') badges = '```None```';
      userInfoEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle('User Information')
        .addFields(
          { name: 'Username:', value: `${interaction.member.user.tag}` },
          { name: 'User ID:', value: `${interaction.member.user.id}` },
          { name: 'Account Since:', value: `${moment(interaction.member.user.createdTimestamp).format('LT')} ${moment(interaction.member.user.createdTimestamp).format('LL')} (${moment(interaction.member.user.createdTimestamp).fromNow()})` },
          { name: 'Badges:', value: `${badges}` },
          { name: 'Joined At:', value: `${moment(interaction.member.joinedTimestamp).format('LT')} ${moment(interaction.member.joinedTimestamp).format('LL')} (${moment(interaction.member.joinedTimestamp).fromNow()})` },
          { name: 'Roles', value: `${roles}` },
          { name: 'Permissions', value: `${perms}` }
        )
        .setThumbnail(interaction.member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    } else {
      const roles = '```' + member.roles.cache.map((role) => role.name).join(`, `) + '```';
      const perms = '```' + member.permissions.toArray().join(`\n`) + '```';
      let badges = '```' + member.user.flags.toArray().join(', ') + '```';
      if (badges === '``````') badges = '```None```';
      userInfoEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${member.user.username}'s User Information`)
        .addFields(
          { name: 'Username: ', value: `${member.user.tag}` },
          { name: 'User ID: ', value: `${member.user.id}` },
          { name: 'Account Since:', value: `${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} (${moment(member.user.createdTimestamp).fromNow()})` },
          { name: 'Badges', value: `${badges}` },
          { name: 'Joined At:', value: `${moment(member.joinedTimestamp).format('LT')} ${moment(member.joinedTimestamp).format('LL')} (${moment(member.joinedTimestamp).fromNow()})` },
          { name: 'Roles:', value: `${roles}` },
          { name: 'Permissions', value: `${perms}` }
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
    }
    interaction.reply({ embeds: [userInfoEmbed] });
  }
}
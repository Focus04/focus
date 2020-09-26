const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'userinfo',
  description: `Displays information about a user's account account.`,
  usage: 'userinfo `(@user(s))`',
  guildOnly: true,
  execute(message) {
    if (!message.mentions.users.size) {
      let roles = '```' + message.member.roles.cache.map(role => role.name).join(`, `) + '```';
      let perms = '```' + message.member.permissions.toArray().join(`\n`) + '```';
      let badges = '```' + message.author.flags.toArray().join(', ') + '```';
      if(badges === '``````')
        badges = '```None```';

      const userinfoembed1 = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle('User Information')
        .addFields(
          { name: 'Username:', value: `${message.author.tag}` },
          { name: 'User ID:', value: `${message.author.id}` },
          { name: 'Account Since:', value: `${moment(message.author.createdTimestamp).format('LT')} ${moment(message.author.createdTimestamp).format('LL')} (${moment(message.author.createdTimestamp).fromNow()})` },
          { name: 'Badges:', value: `${badges}` },
          { name: 'Joined At:', value: `${moment(message.member.joinedTimestamp).format('LT')} ${moment(message.member.joinedTimestamp).format('LL')} (${moment(message.member.joinedTimestamp).fromNow()})` },
          { name: 'Roles', value: `${roles}` },
          { name: 'Permissions', value: `${perms}` }
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      message.channel.send(userinfoembed1);
    } else {
      message.mentions.members.forEach(member => {
        let roles = '```' + member.roles.cache.map(role => role.name).join(`, `) + '```';
        let perms = '```' + member.permissions.toArray().join(`\n`) + '```';
        let badges = '```' + member.user.flags.toArray().join(', ') || 'None' + '```';
        if(badges === '``````')
          badges = '```None```';

        const userinfoembed2 = new Discord.MessageEmbed()
          .setColor('#00ffbb')
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
        message.channel.send(userinfoembed2);
      });
    }
  }
}
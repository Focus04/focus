const Discord = require('discord.js');
const Keyv = require('keyv');
const bns = new Keyv(process.env.bns);
const logChannels = new Keyv(process.env.logChannels);
const bannedUsers = new Keyv(process.env.bannedUsers);

module.exports = {
  name: 'ban',
  description: `Restricts a user's access to the server.`,
  usage: 'ban @`user` `(days)` `reason`',
  guildOnly: true,
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    const user = message.mentions.users.first();
    const author = message.author.username;
    const days = args[1];
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
      let msg = await message.channel.send('I require the `Ban Members` permission in order to perform this action.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (member.id == message.author.id) {
      let msg = await message.channel.send(`You can't ban youself, smarty pants!`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    let modHighestRole = -1;
    let memberHighestRole = -1;
    message.member.roles.cache.forEach((r) => {
      if (r.position > modHighestRole) modHighestRole = r.position;
    });
    member.roles.cache.forEach((r) => {
      if (r.position > memberHighestRole) memberHighestRole = r.position;
    });
    if (modHighestRole <= memberHighestRole) {
      let msg = await message.channel.send('Your roles must be higher than the roles of the person you want to ban!');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('BAN_MEMBERS') || !message.guild.member(member).bannable) {
      let msg = await message.channel.send(`It appears that you lack permissions to ban. In case you have them, make sure that my role is higher than the role of the person you want to ban!`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (isNaN(days)) {
      if (!member || !args[1]) {
        let msg = await message.channel.send(`Proper command usage: ${prefix}ban @[user] (days) [reason]`);
        msg.delete({ timeout: 10000 });
        return message.react('❌');
      }

      args.shift();
      const reason = '`' + args.join(' ') + '`';
      await bannedUsers.set(`${message.guild.id}_${member.user.username}`, member.user.id);
      let bans = await bns.get(`bans_${member.id}_${message.guild.id}`);
      if (!bans) bans = 1;
      else bans = bans + 1;

      const banEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle(`${message.client.emojis.cache.find((emoji) => emoji.name === 'pinned')} Ban Information`)
        .addFields(
          { name: `Defendant's name:`, value: `${member.user.tag}` },
          { name: `Issued by:`, value: `${author}` },
          { name: `Reason:`, value: `${reason}` },
          { name: `Duration:`, value: `Permanent` },
        )
        .setFooter(`You can use ${prefix}unban ${member.user.username} to unban ${member.user.username} earlier.`)
        .setTimestamp();
      const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
      const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
      if (!log) await message.channel.send(banembed1);
      else await log.send(banEmbed);
      await member.send(`${author} has permanently banned you from ${message.guild.name} for ${reason}.`);
      await bns.set(`bans_${member.id}_${message.guild.id}`, bans);
      await message.guild.member(member).ban();
      message.react('✔️');
    } else {
      if (!member || !args[2]) {
        let msg = await message.channel.send(`Proper command usage: ${prefix}ban @[user] (days) [reason]`);
        msg.delete({ timeout: 10000 });
        return message.react('❌');
      }

      args.shift();
      args.shift();
      const reason = '`' + args.join(' ') + '`';
      await bannedUsers.set(`${message.guild.id}_${member.user.username}`, member.user.id);
      let bans = await bns.get(`bans_${member.id}_${message.guild.id}`);
      if (!bans) bans = 1;
      else bans = bans + 1;

      const banEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle(`${message.client.emojis.cache.find((emoji) => emoji.name === 'pinned')} Ban Information`)
        .addFields(
          { name: `Defendant's name:`, value: `${member}` },
          { name: `Issued by:`, value: `${author}` },
          { name: `Reason:`, value: `${reason}` },
          { name: `Duration:`, value: `${days} days` },
        )
        .setFooter(`You can use ${prefix}unban ${member.user.username} to unban ${member.user.username} earlier than ${days} days.`)
        .setTimestamp();
      const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
      const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
      if (!log) await message.channel.send(banEmbed);
      else await log.send(banEmbed);
      await member.send(`${author} has banned you from ${message.guild.name} for ${reason}. Duration: ${days} days.`);
      await bns.set(`bans_${member.id}_${message.guild.id}`, bans);
      await message.guild.member(member).ban();
      message.react('✔️');
      setTimeout(async function () {
        const banInfo = message.guild.fetchBan(user);
        if (banInfo) {
          await bannedUsers.delete(`${message.guild.id}_${member.user.username}`);
          message.guild.members.unban(member.id);
          if (!log) message.channel.send(`${member} has been unbanned.`);
          else log.send(`${member} has been unbanned.`);

          user.send(`You have been unbanned from ${message.guild.name}.`);
        }
      }, days * 86400000)
    }
  }
}
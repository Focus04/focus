const Discord = require('discord.js');
const Keyv = require('keyv');
const kks = new Keyv(process.env.kks);
const logChannels = new Keyv(process.env.logChannels);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');

module.exports = {
  name: 'kick',
  description: `Kicks a certain user out of the server.`,
  usage: 'kick @`user` `(reason)`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'It appears that you lack permissions to kick.',
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    if (!message.guild.me.hasPermission('KICK_MEMBERS')) {
      let msg = await message.channel.send('I require the `Kick Members` permission in order to perform this action.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}kick @[user] (reason)`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (member.id == message.author.id) {
      let msg = await message.channel.send(`I mean you could simply leave the server.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      let msg = await message.channel.send('Your roles must be higher than the roles of the person you want to kick!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!message.guild.member(member).kickable) {
      let msg = await message.channel.send('Make sure that my role is higher than the role of the person you want to kick!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    args.shift();
    const author = message.author.username;
    let kicks = await kks.get(`kicks_${member.id}_${message.guild.id}`)
    if (!kicks) kicks = 1;
    else kicks = kicks + 1;

    let color;
    if (message.guild.me.roles.highest.color === 0) color = '#b9bbbe';
    else color = message.guild.me.roles.highest.color;
    const kickEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Kick Information`)
      .addFields(
        { name: `Defendant's name:`, value: `${member.user.tag}` },
        { name: `Issued by:`, value: `${author}` }
      )
      .setTimestamp();
    let msg = `${author} kicked you from ${message.guild.name}.`;
    if (args.length > 0) {
      const reason = '`' + args.join(' ') + '`';
      kickEmbed.addField('Reason', reason);
      msg += ` Reason: ${reason}`;
    }
    await member.send(msg);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (!log) await message.channel.send(kickEmbed);
    else await log.send(kickEmbed);
    await kks.set(`kicks_${member.id}_${message.guild.id}`, kicks);
    await message.guild.member(member).kick();
    message.react(reactionSuccess);
  }
}
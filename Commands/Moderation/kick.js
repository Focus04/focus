const Discord = require('discord.js');
const Keyv = require('keyv');
const kks = new Keyv(process.env.kks);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'kick',
  description: `Kicks a certain user out of the server.`,
  usage: 'kick @`user` `(reason)`',
  requiredPerms: ['KICK_MEMBERS'],
  botRequiredPerms: ['KICK_MEMBERS'],
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    if (!args[0]) {
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

    let color = getRoleColor(message.guild);
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
    if (!member.user.bot) await member.send(msg);
    await sendLog(message.guild, message.channel, kickEmbed);
    await kks.set(`kicks_${member.id}_${message.guild.id}`, kicks);
    await message.guild.member(member).kick();
    message.react(reactionSuccess);
  }
}
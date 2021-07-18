const Discord = require('discord.js');
const Keyv = require('keyv');
const mts = new Keyv(process.env.mts);
const mutedMembers = new Keyv(process.env.mutedMembers);
const punishments = new Keyv(process.env.punishments);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'mute',
  description: `Restricts a user from sending messages.`,
  usage: 'mute @`user` `minutes` `(reason)`',
  requiredPerms: ['KICK_MEMBERS'],
  botRequiredPerms: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    const user = message.mentions.users.first();
    const author = message.author.username;
    const mins = args[1];
    let mutedRole = message.guild.roles.cache.find((r) => r.name === 'Muted Member');
    if (isNaN(mins) || !args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}mute @[user] [minutes] (reason)`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (mins > 720 || mins <= 0) {
      let msg = await message.channel.send('Minutes must be a positive number less than 720.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (member.id == message.author.id) {
      let msg = await message.channel.send(`You can't mute youself, smarty pants!`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      let msg = await message.channel.send('Your roles must be higher than the roles of the person you want to mute!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    args.shift();
    args.shift();
    const reason = '`' + args.join(' ') + '`';
    let mutes = await mts.get(`mutes_${member.id}_${message.guild.id}`);
    if (!mutes) mutes = 1;
    else mutes = mutes + 1;

    if (!mutedRole) {
      await message.guild.roles.create({
        data: {
          name: 'Muted Member',
          permissions: []
        }
      });

      const newMutedRole = await message.guild.roles.cache.find((r) => r.name === 'Muted Member');
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.updateOverwrite(newMutedRole, {
          'SEND_MESSAGES': false,
          'ADD_REACTIONS': false,
          'SPEAK': false
        });
      });
      mutedRole = newMutedRole;
    }

    if (member.roles.cache.has(mutedRole.id)) {
      let msg = await message.channel.send(`${user.username} is already muted!`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await mts.set(`mutes_${member.id}_${message.guild.id}`, mutes);
    member.roles.add(mutedRole);
    let color = getRoleColor(message.guild);
    const muteEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Mute Information`)
      .addFields(
        { name: `Defendant's name:`, value: `${member.user.tag}` },
        { name: `Issued by:`, value: `${author}` },
        { name: `Duration:`, value: `${mins} minutes` },
      )
      .setFooter(`You can use ${prefix}unmute to unmute the user earlier than ${mins} minutes and ${prefix}muteinfo to view information about his mute.`)
      .setTimestamp();
    const millisecondsPerMinute = 60 * 1000;
    let MuteInfo = {};
    MuteInfo.userID = member.user.id;
    MuteInfo.unmuteDate = Date.now() + mins * millisecondsPerMinute;
    MuteInfo.author = author;
    let msg = `${author} has muted you from ${message.guild.name}. Duration: ${mins} minutes.`;
    if (args.length > 0) {
      const reason = '`' + args.join(' ') + '`';
      muteEmbed.addField('Reason', reason);
      msg += ` Reason: ${reason}.`;
      MuteInfo.reason = reason;
    }
    member.send(msg);
    let mutedMembersArr = await mutedMembers.get(message.guild.id);
    let guilds = await punishments.get('guilds');
    if (!mutedMembersArr) mutedMembersArr = [];
    if (!guilds.includes(message.guild.id)) guilds.push(message.guild.id);
    mutedMembersArr.push(MuteInfo);
    await mutedMembers.set(message.guild.id, mutedMembersArr);
    await punishments.set('guilds', guilds);
    await sendLog(message.guild, message.channel, muteEmbed);
    message.react(reactionSuccess);
  }
}
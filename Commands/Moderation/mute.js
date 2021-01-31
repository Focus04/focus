const Discord = require('discord.js');
const Keyv = require('keyv');
const mts = new Keyv(process.env.mts);
const logChannels = new Keyv(process.env.logChannels);
const mutedMembers = new Keyv(process.env.mutedMembers);
const punishments = new Keyv(process.env.punishments);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');

module.exports = {
  name: 'mute',
  description: `Restricts a user from sending messages.`,
  usage: 'mute @`user` `minutes` `(reason)`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    const user = message.mentions.users.first();
    const author = message.author.username;
    const mins = args[1];
    let mutedRole = message.guild.roles.cache.find((r) => r.name === 'Muted Member');
    if (!message.guild.me.hasPermission('MANAGE_ROLES') || !message.guild.me.hasPermission('MANAGE_CHANNELS')) {
      let msg = await message.channel.send('I require the `Manage Roles` and `Manage Channels` permissions in order to perform this action.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

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
          'EMBED_LINKS': false,
          'ATTACH_FILES': false,
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
    let color;
    if (message.guild.me.roles.highest.color === 0) color = '#b9bbbe';
    else color = message.guild.me.roles.highest.color;
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
    let MuteInfo = {};
    MuteInfo.userID = member.user.id;
    MuteInfo.unmuteDate = Date.now() + mins * 60000;
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
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find(ch => ch.name === `${logChName}`);
    if (!log) await message.channel.send(muteEmbed);
    else await log.send(muteEmbed);
    message.react(reactionSuccess);
  }
}
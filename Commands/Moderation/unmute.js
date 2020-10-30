const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'unmute',
  description: `Removes a user's muted status earlier.`,
  usage: 'mute @`user`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    const author = message.author.username;
    const member = message.mentions.members.first();
    const mutedRole = message.guild.roles.cache.find((r) => r.name === 'Muted Member');
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
      let msg = await message.channel.send('I require the Manage Roles permission in order to perform this action!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!member) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}unmute @[user]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!member.roles.cache.has(mutedRole.id)) {
      let msg = await message.channel.send(`${member} isn't muted!`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    member.roles.remove(mutedRole);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (!log) message.channel.send(`${args[0]} has been unmuted earlier.`);
    else log.send(`${args[0]} has been unmuted earlier.`);
    await member.send(`${author} unmuted you earlier from ${message.guild.name}.`);
    message.react(reactionSuccess);
  }
}
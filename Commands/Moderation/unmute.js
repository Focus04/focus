const Keyv = require('keyv');
const mutedMembers = new Keyv(process.env.mutedMembers);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'unmute',
  description: `Removes a user's muted status earlier.`,
  usage: 'mute @`user`',
  requiredPerms: ['KICK_MEMBERS'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(message, args, prefix) {
    const author = message.author.username;
    const member = message.mentions.members.first();
    const mutedRole = message.guild.roles.cache.find((r) => r.name === 'Muted Member');
    if (!member) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}unmute @[user]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let mutedMembersArr = await mutedMembers.get(message.guild.id);
    let mutedMember = mutedMembersArr.find((arrElement) => arrElement.userID === member.user.id);
    mutedMembersArr.splice(mutedMembersArr.indexOf(mutedMember), 1);
    if (!member.roles.cache.has(mutedRole.id)) {
      let msg = await message.channel.send(`${member} isn't muted!`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    mutedMembers.set(message.guild.id, mutedMembersArr);
    member.roles.remove(mutedRole);
    await sendLog(message.guild, message.channel, `${args[0]} has been unmuted earlier.`);
    await member.send(`${author} unmuted you earlier from ${message.guild.name}.`);
    message.react(reactionSuccess);
  }
}
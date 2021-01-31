const { MessageEmbed } = require('discord.js');
const Keyv = require('keyv');
const mutedMembers = new Keyv(process.env.mutedMembers);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');

module.exports = {
  name: 'muteinfo',
  description: 'View details about a muted member.',
  usage: 'muteinfo @`member`',
  requiredPerms: 'KICK_MEMBERS',
  permerror: 'You require the Kick Members permission in order to run this command.',
  async execute (message, args, prefix) {
    const member = message.mentions.members.first();
    if (!member) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}unmute @[user]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let mutedMembersArr = await mutedMembers.get(message.guild.id);
    let mutedMember = mutedMembersArr.find((arrElement) => arrElement.userID === member.user.id);
    if (!mutedMember) {
      let msg = await message.channel.send(`${member} isn't muted!`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let color;
    if (message.guild.me.roles.highest.color === 0) color = '#b9bbbe';
    else color = message.guild.me.roles.highest.color;
    const muteInfoEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Mute Information`)
      .addFields(
        { name: `Defendant's name:`, value: member.user.tag },
        { name: `Issued by:`, value: mutedMember.author },
        { name: `Minutes Remaining:`, value: Math.floor((mutedMember.unmuteDate - Date.now()) / 60000) + 1}
      )
      .setTimestamp();
    if (mutedMember.reason) muteInfoEmbed.addField('Reason', mutedMember.reason);
    await message.channel.send(muteInfoEmbed);
    message.react(reactionSuccess);
  }
}
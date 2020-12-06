const { MessageEmbed, MessageFlags } = require('discord.js');
const Keyv = require('keyv');
const bannedUsers = new Keyv(process.env.bannedUsers);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');

module.exports = {
  name: 'baninfo',
  description: 'View details about a banned user.',
  usage: 'baninfo `username`',
  requiredPerms: 'BAN_MEMBERS',
  permError: 'You require the Ban Members permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}baninfo [username]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const bannedUsersArr = await bannedUsers.get(message.guild.id);
    const bannedUser = bannedUsersArr.find((user) => user.username === args[0]);
    if (!bannedUser) {
      let msg = await message.channel.send(`${args[0]} isn't banned.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const banInfoEmbed = new MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Ban Information`)
      .addFields(
        { name: `Defendant's name:`, value: args[0] },
        { name: `Issued by:`, value: bannedUser.author}
      )
      .setTimestamp();
    if (bannedUser.reason) banInfoEmbed.addField('Reason:', bannedUser.reason);
    if (bannedUser.unbanDate) banInfoEmbed.addField('Days Remaining:', Math.floor((bannedUser.unbanDate - Date.now()) / 86400000) + 1);
    await message.channel.send(banInfoEmbed);
    message.react(reactionSuccess);
  }
}
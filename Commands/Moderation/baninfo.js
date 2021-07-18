const { MessageEmbed } = require('discord.js');
const Keyv = require('keyv');
const bannedUsers = new Keyv(process.env.bannedUsers);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  name: 'baninfo',
  description: 'View details about a banned user.',
  usage: 'baninfo `username`',
  requiredPerms: ['BAN_MEMBERS'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}baninfo [username]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const bannedUsersArr = await bannedUsers.get(message.guild.id);
    let bannedUser;
    if (bannedUsersArr) bannedUser = bannedUsersArr.find((user) => user.username === args[0]);
    if (!bannedUser) {
      let msg = await message.channel.send(`${args[0]} isn't banned.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let color = getRoleColor(message.guild);
    const banInfoEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Ban Information`)
      .addFields(
        { name: `Defendant's name:`, value: args[0] },
        { name: `Issued by:`, value: bannedUser.author}
      )
      .setTimestamp();
    if (bannedUser.reason) banInfoEmbed.addField('Reason:', bannedUser.reason);
    if (bannedUser.unbanDate) {
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysRemaining = Math.ceil((bannedUser.unbanDate - Date.now()) / millisecondsPerDay);
      banInfoEmbed.addField('Days Remaining:', daysRemaining);
    }
    await message.channel.send(banInfoEmbed);
    message.react(reactionSuccess);
  }
}
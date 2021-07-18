const Discord = require('discord.js');
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'clear',
  description: 'Bulk deletes a certain amount of messages.',
  usage: 'clear `amount`',
  requiredPerms: ['MANAGE_MESSAGES'],
  botRequiredPerms: ['MANAGE_MESSAGES'],
  async execute(message, args) {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount) || amount < 2 || amount > 100) {
      let msg = await message.channel.send(`You must enter a number higher than 0 and less than 100.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    message.channel.bulkDelete(amount, true);
    let color = getRoleColor(message.guild);
    const clearEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Cleared Messages`)
      .addFields(
        { name: 'Cleared by:', value: `${message.author.username}` },
        { name: 'Amount of Messages Deleted:', value: `${amount}` },
        { name: 'Channel:', value: `${message.channel.name}` }
      )
      .setTimestamp();
    await sendLog(message.guild, message.channel, clearEmbed);
    message.react(reactionSuccess);
  }
}
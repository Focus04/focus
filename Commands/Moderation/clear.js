import Discord from 'discord.js';
import Keyv from 'keyv';
const logChannels = new Keyv(process.env.logChannels);
import { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } from '../../config.json';

module.exports = {
  name: 'clear',
  description: 'Bulk deletes a certain amount of messages.',
  usage: 'clear `amount`',
  requiredPerms: 'MANAGE_MESSAGES',
  permError: 'It appears that you lack permission to clear messages.',
  async execute(message, args) {
    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
      let msg = await message.channel.send('I require the `Manage Messages` permission in order to perform this action!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount) || amount < 2 || amount > 100) {
      let msg = await message.channel.send(`You must enter a number higher than 0 and less than 100.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    message.channel.bulkDelete(amount, true).catch(async (err) => {
      console.error(err);
      let msg = await message.channel.send(`Can't delete messages older than 2 weeks.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    });

    const clearEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Cleared Messages`)
      .addFields(
        { name: 'Cleared by:', value: `${message.author.username}` },
        { name: 'Amount of Messages Deleted:', value: `${amount}` },
        { name: 'Channel:', value: `${message.channel.name}` }
      )
      .setTimestamp();
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (!log) message.channel.send(clearEmbed);
    else log.send(clearEmbed);
    message.react(reactionSuccess);
  }
}
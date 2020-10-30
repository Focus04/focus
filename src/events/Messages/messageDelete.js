const Discord = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const msglogs = new Keyv(process.env.msgLogs);
const { pinEmojiId } = require('../../config.json');

module.exports = async (client, message) => {
  const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
  const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
  const msgLog = await msglogs.get(`msglogs_${message.guild.id}`);
  if (log && msgLog == 1 && !message.author.bot && message.content.length <= 1024) {
    const deleteEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Message Deleted`)
      .addFields(
        { name: 'Author:', value: `${message.author.username}` },
        { name: 'Channel:', value: `${message.channel.name}` },
        { name: 'Content:', value: `${message.content}` }
      )
      .setTimestamp();
    log.send(deleteEmbed);
  }
}
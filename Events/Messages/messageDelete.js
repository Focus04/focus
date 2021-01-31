const Discord = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const msglogs = new Keyv(process.env.msgLogs);
const { pinEmojiId } = require('../../config.json');

module.exports = async (client, message) => {
  if (message.channel.type !== 'text' || message.author.bot) return;
  if (message.content.length > 1024) return;
  const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
  const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
  const msgLog = await msglogs.get(`msglogs_${message.guild.id}`);
  if (log && msgLog == 1) {
    console.log(message.guild.me.roles.highest.color);
    let color;
    if (message.guild.me.roles.highest.color === '0') color = '#b9bbbe';
    else color = message.guild.me.roles.highest.color;
    const deleteEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Message Deleted`)
      .addFields(
        { name: 'Author:', value: message.member },
        { name: 'Channel:', value: `#${message.channel.name}` },
        { name: 'Content:', value: message.content }
      )
      .setTimestamp();
    log.send(deleteEmbed);
  }
}
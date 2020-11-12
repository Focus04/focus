const Discord = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const msgLogs = new Keyv(process.env.msgLogs);
const { pinEmojiId } = require('../../config.json');

module.exports = async (client, oldmsg, newmsg) => {
  if (oldmsg.channel.type !== 'text' || oldmsg.attachments) return;
  const logChName = await logChannels.get(`logchannel_${oldmsg.guild.id}`);
  const log = oldmsg.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
  const msgLog = await msgLogs.get(`msglogs_${oldmsg.guild.id}`);
  if (log && msgLog == 1 && !oldmsg.author.bot && oldmsg.content.length <= 1024 && newmsg.content.length <= 1024) {
    const editEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${oldmsg.client.emojis.cache.get(pinEmojiId).toString()} Message Edited`)
      .addFields(
        { name: 'Author:', value: `${oldmsg.author.username}` },
        { name: 'Channel:', value: `${oldmsg.channel.name}` },
        { name: 'Initial Content:', value: `${oldmsg.content}` },
        { name: 'New Content:', value: `${newmsg.content}` }
      )
      .setTimestamp();
    log.send(editEmbed);
  }
}
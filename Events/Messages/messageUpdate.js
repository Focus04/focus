const Discord = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const msgLogs = new Keyv(process.env.msgLogs);
const { pinEmojiId } = require('../../config.json');

module.exports = async (client, oldmsg, newmsg) => {
  if (newmsg.channel.type !== 'text' || !newmsg.editedTimestamp) return;
  const logChName = await logChannels.get(`logchannel_${newmsg.guild.id}`);
  const log = newmsg.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
  const msgLog = await msgLogs.get(`msglogs_${newmsg.guild.id}`);
  if (log && msgLog == 1 && !newmsg.author.bot && oldmsg.content.length <= 1024 && newmsg.content.length <= 1024) {
    const editEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${newmsg.client.emojis.cache.get(pinEmojiId).toString()} Message Edited`)
      .addFields(
        { name: 'Author:', value: `${newmsg.author.username}` },
        { name: 'Channel:', value: `${newmsg.channel.name}` },
        { name: 'Initial Content:', value: `${oldmsg.content}` },
        { name: 'New Content:', value: `${newmsg.content}` }
      )
      .setTimestamp();
    log.send(editEmbed);
  }
}
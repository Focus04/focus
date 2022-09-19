const { MessageEmbed } = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const msgLogs = new Keyv(process.env.msgLogs);
const { pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = async (client, oldmsg, newmsg) => {
  if (!oldmsg.member || !newmsg.member) return;
  if (!newmsg.editedTimestamp || newmsg.member.user.bot) return;
  if (oldmsg.content.length > 1024 || newmsg.content.length > 1024) return;
  const logChName = await logChannels.get(`logchannel_${newmsg.guild.id}`);
  const log = newmsg.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
  const msgLog = await msgLogs.get(`msglogs_${newmsg.guild.id}`);
  if (log && msgLog == 1) {
    let color = getRoleColor(newmsg.guild);
    const editEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${newmsg.client.emojis.cache.get(pinEmojiId).toString()} Message Edited`)
      .addFields(
        { name: 'Author:', value: newmsg.member.user.tag },
        { name: 'Channel:', value: `#${newmsg.channel.name}` },
        { name: 'Initial Content:', value: oldmsg.content },
        { name: 'New Content:', value: newmsg.content }
      )
      .setTimestamp();
    log.send({ embeds: [editEmbed] });
  }
}
const { MessageEmbed } = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.DB_URI).replace('dbname', 'logchannels');
const msgLogs = new Keyv(process.env.DB_URI).replace('dbname', 'msglogs');
const { pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = async (client, message) => {
  if (!message.member) return;
  if (message.channel.type !== 'GUILD_TEXT' || message.member.user.bot) return;
  if (message.content.length > 1024) return;
  const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
  const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
  const msgLog = await msglogs.get(`msglogs_${message.guild.id}`);
  if (log && msgLog == 1) {
    let color = getRoleColor(message.guild);
    const deleteEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Message Deleted`)
      .addFields(
        { name: 'Author:', value: message.member.user.tag },
        { name: 'Channel:', value: `#${message.channel.name}` },
        { name: 'Content:', value: message.content }
      )
      .setTimestamp();
    log.send({ embeds: [deleteEmbed] });
  }
}
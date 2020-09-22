const Discord = require('discord.js')
const Keyv = require('keyv')
const logchannels = new Keyv(process.env.logchannels)
const msglogs = new Keyv(process.env.msglogs)

module.exports = async (client, message) => {
  let logchname = await logchannels.get(`logchannel_${message.guild.id}`)
  let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`)
  let msglog = await msglogs.get(`msglogs_${message.guild.id}`)
  if (
    log &&
    msglog == 1 &&
    !message.author.bot &&
    message.content.length <= 1024
  ) {
    let deleteembed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(
        `${message.client.emojis.cache.find(
          emoji => emoji.name === 'pinned'
        )} Message Deleted`
      )
      .addFields(
        { name: 'Author:', value: `${message.author.username}` },
        { name: 'Channel:', value: `${message.channel.name}` },
        { name: 'Content:', value: `${message.content}` }
      )
      .setTimestamp()
    log.send(deleteembed)
  }
}

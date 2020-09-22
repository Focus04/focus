const Discord = require('discord.js')
const Keyv = require('keyv')
const logchannels = new Keyv(process.env.logchannels)

module.exports = {
  name: 'report',
  description: `Submits a report to the staff's logs channel.`,
  usage: 'report `username` `offense`',
  guildOnly: true,
  async execute (message, args, prefix) {
    let member =
      message.guild.members.cache.find(
        user =>
          user.user.username === `${args[0]}` || user.nickname === `${args[0]}`
      ) || message.mentions.members.first()
    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`)
      return msg.delete({ timeout: 10000 })
    }
    if (!args[1]) {
      let msg = await message.channel.send(
        `Proper command usage: ${prefix}report [username] [offense]`
      )
      return msg.delete({ timeout: 10000 })
    }
    let logchname = await logchannels.get(`logchannel_${message.guild.id}`)
    let log = message.guild.channels.cache.find(
      ch => ch.name === `${logchname}`
    )
    if (!log) {
      let msg = await message.channel.send(
        `Looks like the server doesn't have any logs channel. Please ask a staff member to setup one using ${prefix}setlogschannel`
      )
      return msg.delete({ timeout: 10000 })
    }
    args.shift()
    let report = args.join(' ')
    let reportembed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(
        `${message.client.emojis.cache.find(
          emoji => emoji.name === 'pinned'
        )} New Report`
      )
      .addFields(
        { name: 'Submitted by:', value: `${message.author.username}` },
        { name: 'Defendant:', value: `${member}` },
        { name: 'Offense', value: `${report}` }
      )
      .setTimestamp()
    await log.send(reportembed)
    await message.author.send(
      `${member} has been successfully reported to the server's staff.`
    )
    message.channel.bulkDelete(1)
  }
}

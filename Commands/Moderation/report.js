const Discord = require('discord.js');
const { deletionTimeout, pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  name: 'report',
  description: `Submits a report to the staff's logs channel.`,
  usage: 'report @`user`/`userID` `offense`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}report @[user]/[userID] [offense]`);
      return msg.delete({ timeout: deletionTimeout });
    }

    let member = {};
    if (isNaN(args[0])) member = message.mentions.members.first();
    else member = await message.guild.members.fetch(args[0]).catch(async (err) => {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      return message.delete({ timeout: deletionTimeout });
    });
    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      return message.delete({ timeout: deletionTimeout });
    }

    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    
    if (!log) {
      let msg = await message.channel.send(`Looks like the server doesn't have any logs channel. Please ask a staff member to setup one using ${prefix}setlogschannel`);
      return msg.delete({ timeout: deletionTimeout });
    }

    args.shift();
    const report = args.join(' ');
    let color = getRoleColor(message.guild);
    const reportEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} New Report`)
      .addFields(
        { name: 'Submitted by:', value: `${message.author.username}` },
        { name: 'Defendant:', value: `${member}` },
        { name: 'Offense', value: `${report}` }
      )
      .setTimestamp();
    await log.send(reportEmbed);
    await message.author.send(`${member} has been successfully reported to the server's staff.`);
    message.channel.bulkDelete(1);
  }
}
const Discord = require('discord.js');
const Keyv = require('keyv');
const warnings = new Keyv(process.env.wrns);
const logchannels = new Keyv(process.env.logchannels);

module.exports = {
  name: 'warn',
  description: `Sends a warning message to a user.`,
  usage: 'warn @`user` `reason`',
  guildOnly: true,
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    const author = message.author.username;
    if (!member || !args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}warn @[user] [reason]`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (member.id == message.author.id) {
      let msg = await message.channel.send(`You can't warn youself, smarty pants!`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    let modhighestrole = -1;
    let memberhighestrole = -1;
    message.member.roles.cache.forEach((r) => {
      if (r.position > modhighestrole) modhighestrole = r.position;
    });
    member.roles.cache.forEach((r) => {
      if (r.position > memberhighestrole) memberhighestrole = r.position;
    });
    if (modhighestrole <= memberhighestrole) {
      let msg = await message.channel.send('Your roles must be higher than the roles of the person you want to ban!');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('KICK_MEMBERS')) {
      let msg = await message.channel.send('You need the Kick Members permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    args.shift();
    const reason = '`' + args.join(' ') + '`';
    let warns = await warnings.get(`warns_${member.id}_${message.guild.id}`);
    if (!warns) warns = 1;
    else warns = warns + 1;

    const warnEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.find((emoji) => emoji.name === 'pinned')} Warn Information`)
      .addFields(
        { name: `Defendant's name:`, value: `${member.user.tag}` },
        { name: `Issued by:`, value: `${author}` },
        { name: 'Reason:', value: `${reason}` }
      )
      .setTimestamp();
    const logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logchname}`);
    if (!log) message.channel.send(warnEmbed);
    else log.send(warnEmbed);
    await member.user.send(`${author} is warning you in ${message.guild.name} for ${reason}.`);
    await warnings.set(`warns_${member.user.id}_${message.guild.id}`, warns);
    message.react('✔️');
  }
}
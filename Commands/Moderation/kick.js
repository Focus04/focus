const Discord = require('discord.js');
const Keyv = require('keyv');
const kks = new Keyv(process.env.kks);
const logchannels = new Keyv(process.env.logchannels);

module.exports = {
  name: 'kick',
  description: `Kicks a certain user out of the server.`,
  usage: 'kick @`user` `reason`',
  guildOnly: true,
  async execute(message, args, prefix) {
    let member = message.mentions.members.first();
    let modhighestrole = -1;
    let memberhighestrole = -1;
    if (!message.guild.me.hasPermission('KICK_MEMBERS')) {
      let msg = await message.channel.send('I require the `Kick Members` permission in order to perform this action.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!member || !args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}kick @[user] [reason]`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (member.id == message.author.id) {
      let msg = await message.channel.send(`I mean you could simply leave the server.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    message.member.roles.cache.forEach((r) => {
      if (r.position > modhighestrole) modhighestrole = r.position;
    });
    
    member.roles.cache.forEach((r) => {
      if (r.position > memberhighestrole) memberhighestrole = r.position;
    });

    if (modhighestrole <= memberhighestrole) {
      let msg = await message.channel.send('Your roles must be higher than the roles of the person you want to kick!');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('KICK_MEMBERS') || !message.guild.member(member).kickable) {
      let msg = await message.channel.send(`It appears that you lack permissions to kick. In case you have them, make sure that my role is higher than the role of the person you want to kick!`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    args.shift();
    let reason = '`' + args.join(' ') + '`';
    let author = message.author.username;
    let kicks = await kks.get(`kicks_${member.id}_${message.guild.id}`)
    if (!kicks) kicks = 1;
    else kicks = kicks + 1;

    const kickembed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.find((emoji) => emoji.name === 'pinned')} Kick Information`)
      .addFields(
        { name: `Defendant's name:`, value: `${member.user.tag}` },
        { name: `Issued by:`, value: `${author}` },
        { name: `Reason:`, value: `${reason}` }
      )
      .setTimestamp();
    await member.send(`${author} kicked you from ${message.guild.name} for ${reason}.`);
    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    let log = message.guild.channels.cache.find((ch) => ch.name === `${logchname}`);
    if (!log) await message.channel.send(kickembed);
    else await log.send(kickembed);

    await kks.set(`kicks_${member.id}_${message.guild.id}`, kicks);
    await message.guild.member(member).kick();
    message.react('✔️');
  }
}
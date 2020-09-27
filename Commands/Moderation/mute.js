const Discord = require('discord.js');
const Keyv = require('keyv');
const mts = new Keyv(process.env.mts);
const logchannels = new Keyv(process.env.logchannels);

module.exports = {
  name: 'mute',
  description: `Restricts a user from sending messages.`,
  usage: 'mute @`user` `minutes` `reason`',
  guildOnly: true,
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    const user = message.mentions.users.first();
    const author = message.author.username;
    const mins = args[1];
    const mutedRole = message.guild.roles.cache.find((r) => r.name === 'Muted Member');
    let modhighestrole = -1;
    let memberhighestrole = -1;
    if (!message.guild.me.hasPermission('MANAGE_ROLES') || !message.guild.me.hasPermission('MANAGE_CHANNELS')) {
      let msg = await message.channel.send('I require the `Manage Roles` and `Manage Channels` permissions in order to perform this action.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!member || isNaN(mins) || !args[2]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}mute @[user] [minutes] [reason]`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (member.id == message.author.id) {
      let msg = await message.channel.send(`You can't mute youself, smarty pants!`);
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
      let msg = await message.channel.send('Your roles must be higher than the roles of the person you want to mute!');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('KICK_MEMBERS') || !message.guild.member(member).kickable) {
      let msg = await message.channel.send(`You need the Kick Members permission in order to run this command.  In case you have it, make sure that my role is higher than the role of the person you want to mute!`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    args.shift();
    args.shift();
    
    const reason = '`' + args.join(' ') + '`';
    let mutes = await mts.get(`mutes_${member.id}_${message.guild.id}`);
    if (!mutes) mutes = 1;
    else mutes = mutes + 1;

    member.send(`${author} has muted you from ${message.guild.name} for ${reason}. Duration: ${mins}.`);
    if (!mutedRole) {
      await message.guild.roles.create({
        data: {
          name: 'Muted Member',
          permissions: []
        }
      });

      const newMutedRole = await message.guild.roles.cache.find((r) => r.name === 'Muted Member');
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.updateOverwrite(newMutedRole, {
          'SEND_MESSAGES': false,
          'EMBED_LINKS': false,
          'ATTACH_FILES': false,
          'ADD_REACTIONS': false,
          'SPEAK': false
        });
      });
    }

    if (member.roles.cache.has(mutedRole.id)) {
      let msg = await message.channel.send(`${user.username} is already muted!`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    await mts.set(`mutes_${member.id}_${message.guild.id}`, mutes);
    member.roles.add(mutedRole);
    const muteEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.find((emoji) => emoji.name === 'pinned')} Mute Information`)
      .addFields(
        { name: `Defendant's name:`, value: `${member.user.tag}` },
        { name: `Issued by:`, value: `${author}` },
        { name: `Reason:`, value: `${reason}` },
        { name: `Duration:`, value: `${mins} minutes` },
      )
      .setFooter(`You can use ${prefix}unmute to unmute the user earlier than ${mins} minutes.`)
      .setTimestamp();
    const logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
    if (!log) await message.channel.send(muteEmbed);
    else await log.send(muteEmbed);

    message.react('✔️');
    setTimeout(function () {
      if (member.roles.cache.has(mutedRole.id)) {
        member.roles.remove(mutedRole);
        if (!log) message.channel.send(`${member} has been unmuted.`);
        else log.send(`${member} has been unmuted.`);

        member.send(`You have been unmuted from ${message.guild.name}.`);
      }
    }, mins * 60000);
  }
}
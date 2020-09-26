const Keyv = require('keyv');
const logchannels = new Keyv(process.env.logchannels);
const bannedusers = new Keyv(process.env.bannedusers);

module.exports = {
  name: 'unban',
  description: `Removes a user's banned status earlier.`,
  usage: 'unban `username`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
      let msg = await message.channel.send('I require the Ban Members permission in order to perform this action!');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}unban username`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('BAN_MEMBERS')) {
      let msg = await message.channel.send(`It appears that you lack permissions to unban.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    let userid = await bannedusers.get(`${message.guild.id}_${args[0]}`);
    if (!userid) {
      let msg = await message.channel.send(`${args[0]} isn't banned.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    await message.guild.members.unban(userid).catch(async (err) => {
      console.error(err);
      let msg = await message.channel.send(`${args[0]} isn't banned.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    });

    await bannedusers.delete(`${message.guild.id}_${args[0]}`);
    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    let log = await message.guild.channels.cache.find((ch) => ch.name === `${logchname}`);
    if (!log) message.channel.send(`${args[0]} has been unbanned earlier.`);
    else log.send(`${args[0]} has been unbanned earlier.`);

    message.react('✔️');
  }
}
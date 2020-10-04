const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.leaveChannels);
const leaveMessages = new Keyv(process.env.leaveMessages);
const logChannels = new Keyv(process.env.logChannels);
const toggleLeaveMsg = new Keyv(process.env.toggleLeaveMsg);

module.exports = {
  name: 'leavemessage',
  description: `Sets a custom good bye message for those leaving the server.`,
  usage: 'leavemessage `message`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}leavemessage [message]. Use [user] to be replaced with a username.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const msg = args.join(' ');
    const leaveChName = await leaveChannels.get(`leavechannel_${message.guild.id}`);
    const leaveChannel = await message.guild.channels.cache.find((ch) => ch.name === `${leaveChName}`);
    if (!leaveChannel) {
      let msg = await message.channel.send(`You need to set a channel for leave messages to be sent in. Use ${prefix}setleavechannel to setup one.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    await leaveMessages.set(`leavemessage_${message.guild.id}`, msg);
    await toggleLeaveMsg.set(`toggleleavemsg_${message.guild.id}`, 1);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (!log) message.channel.send(`Leave message successfully changed to ${'`' + msg + '`'}`);
    else log.send(`Leave message successfully changed to ${'`' + msg + '`'}`);
    message.react('✔️');
  }
}
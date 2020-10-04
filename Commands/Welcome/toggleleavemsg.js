const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.leaveChannels);
const toggleLeave = new Keyv(process.env.toggleLeaveMsg);
const logChannels = new Keyv(process.env.logChannels);

module.exports = {
  name: 'toggleleavemsg',
  description: `Toggles leave messages on/off.`,
  usage: 'toggleleavemsg',
  guildOnly: true,
  async execute(message, prefix) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const leaveChName = await leaveChannels.get(`leavechannel_${message.guild.id}`);
    const leave = message.guild.channels.cache.find((ch) => ch.name === `${leaveChName}`);
    let logs = await toggleLeave.get(`toggleleavemsg_${message.guild.id}`);
    let state;
    
    if (!leave) {
      let msg = await message.channel.send(`You first need to set a channel for messages to be sent in. Use ${prefix}setleavechannel to setup one.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await toggleLeave.set(`toggleleavemsg_${message.guild.id}`, logs);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((channel) => channel.name === logChName);
    if (!log) message.channel.send(`Leave messages are now set to ${'`' + state + '`'}`);
    else log.send(`Leave messages are now set to ${'`' + state + '`'}`);
    message.react('✔️');
  }
}
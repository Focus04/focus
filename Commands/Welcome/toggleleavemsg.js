const Keyv = require('keyv');
const leavechannels = new Keyv(process.env.leavechannels);
const toggleleave = new Keyv(process.env.toggleleavemsg);
const logchannels = new Keyv(process.env.logchannels);

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

    let leavechname = await leavechannels.get(`leavechannel_${message.guild.id}`);
    let leave = message.guild.channels.cache.find(ch => ch.name === `${leavechname}`);
    let logs = await toggleleave.get(`toggleleavemsg_${message.guild.id}`);
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

    await toggleleave.set(`toggleleavemsg_${message.guild.id}`, logs);
    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    let log = await message.guild.channels.cache.find(channel => channel.name === logchname);
    if (!log)
      message.channel.send(`Leave messages are now set to ${'`' + state + '`'}`);
    else
      log.send(`Leave messages are now set to ${'`' + state + '`'}`);

    message.react('✔️');
  }
}
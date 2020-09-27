const Keyv = require('keyv');
const welcomechannels = new Keyv(process.env.welcomechannels);
const togglewelcome = new Keyv(process.env.togglewelcomemsg);
const logchannels = new Keyv(process.env.logchannels);

module.exports = {
  name: 'togglewelcomemsg',
  description: `Toggles welcome messages on/off.`,
  usage: 'togglewelcomemsg',
  guildOnly: true,
  async execute(message, prefix) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const welcomechname = await welcomechannels.get(`welcomechannel_${message.guild.id}`);
    const welcome = message.guild.channels.cache.find((ch) => ch.name === `${welcomechname}`);
    let logs = await togglewelcome.get(`togglewelcomemsg_${message.guild.id}`);
    let state;
    
    if (!welcome) {
      let msg = await message.channel.send(`You first need to set a channel for messages to be sent in. Use ${prefix}setwelcomechannel to setup one.`);
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

    await togglewelcome.set(`togglewelcomemsg_${message.guild.id}`, logs);
    const logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((channel) => channel.name === logchname);
    if (!log) message.channel.send(`Welcome messages are now set to ${'`' + state + '`'}`);
    else log.send(`Welcome messages are now set to ${'`' + state + '`'}`);
    message.react('✔️');
  }
}
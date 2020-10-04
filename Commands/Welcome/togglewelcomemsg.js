const Keyv = require('keyv');
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const toggleWelcome = new Keyv(process.env.toggleWelcomeMsg);
const logChannels = new Keyv(process.env.logChannels);

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

    const welcomeChName = await welcomeChannels.get(`welcomechannel_${message.guild.id}`);
    const welcome = message.guild.channels.cache.find((ch) => ch.name === `${welcomeChName}`);
    let logs = await toggleWelcome.get(`togglewelcomemsg_${message.guild.id}`);
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

    await toggleWelcome.set(`togglewelcomemsg_${message.guild.id}`, logs);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((channel) => channel.name === logChName);
    if (!log) message.channel.send(`Welcome messages are now set to ${'`' + state + '`'}`);
    else log.send(`Welcome messages are now set to ${'`' + state + '`'}`);
    message.react('✔️');
  }
}
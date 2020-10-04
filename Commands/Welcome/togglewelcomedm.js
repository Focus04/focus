const Keyv = require('keyv');
const welcomeDms = new Keyv(process.env.welcomeDms);
const toggleWelcomeDm = new Keyv(process.env.toggleWelcomeDm);
const logChannels = new Keyv(process.env.logChannels);

module.exports = {
  name: 'togglewelcomedm',
  description: `Toggles welcome DMs on/off.`,
  usage: 'toggleWelcomedm',
  guildOnly: true,
  async execute(message, prefix) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const welcomeDm = await welcomeDms.get(`welcomedm_${message.guild.id}`);
    let logs = await toggleWelcomeDm.get(`togglewelcomedm_${message.guild.id}`);
    let state;

    if (!welcomeDm) {
      let msg = await message.channel.send(`You first need to set a welcome DM. Use ${prefix}welcomeDm to setup one.`);
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

    await toggleWelcomeDm.set(`togglewelcomedm_${message.guild.id}`, logs);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((channel) => channel.name === logChName);
    if (!log) message.channel.send(`Welcome DMs are now set to ${'`' + state + '`'}`);
    else log.send(`Welcome DMs are now set to ${'`' + state + '`'}`);
    message.react('✔️');
  }
}
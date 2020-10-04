const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const msgLogs = new Keyv(process.env.msgLogs);

module.exports = {
  name: 'togglemsglogs',
  description: `Toggles message logs on/off.`,
  usage: 'togglemsglogs',
  guildOnly: true,
  async execute(message, prefix) {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    let logs = await msgLogs.get(`msglogs_${message.guild.id}`);
    let state;
    
    if (!log) {
      let msg = await message.channel.send(`You need to set a channel for logs to be sent in. Use ${prefix}setlogschannel to setup one.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!logs || logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await msgLogs.set(`msglogs_${message.guild.id}`, logs);
    message.react('✔️');
    message.channel.send(`Message logs are now set to ${state}.`);
  }
}
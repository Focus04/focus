const Keyv = require('keyv');
const welcomedms = new Keyv(process.env.welcomedms);
const togglewelcomedm = new Keyv(process.env.togglewelcomedm);
const logchannels = new Keyv(process.env.logchannels);

module.exports = {
  name: 'welcomedm',
  description: `Sets a custom welcome message that will be inboxed to new users.`,
  usage: 'welcomedm `message`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}welcomedm [message]. Use [user] to be replaced with a username.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    let msg = args.join(' ');
    await welcomedms.set(`welcomedm_${message.guild.id}`, msg);
    await togglewelcomedm.set(`togglewelcomedm_${message.guild.id}`, 1);
    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    let log = await message.guild.channels.cache.find((ch) => ch.name === `${logchname}`);
    if (!log) message.channel.send(`Welcome DM successfully changed to ${'`' + msg + '`'}`);
    else log.send(`Welcome DM successfully changed to ${'`' + msg + '`'}`);
      
    message.react('✔️');
  }
}
const Keyv = require('keyv');
const welcomechannels = new Keyv(process.env.welcomechannels);
const welcomemessages = new Keyv(process.env.welcomemessages);
const togglewelcomemsg = new Keyv(process.env.togglewelcomemsg);
const logchannels = new Keyv(process.env.logchannels);

module.exports = {
  name: 'welcomemessage',
  description: `Sets a custom welcome message to be displayed when someone joins the server.`,
  usage: 'welcomemessage [message]',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}welcomemessage [message]. Use [user] to be replaced with a username.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const welcomechname = await welcomechannels.get(`welcomechannel_${message.guild.id}`);
    const welcomechannel = await message.guild.channels.cache.find((ch) => ch.name === `${welcomechname}`);
    if (!welcomechannel) {
      let msg = await message.channel.send(`You need to set a channel for welcome messages to be sent in. Use ${prefix}setwelcomechannel to setup one.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const msg = args.join(' ');
    await welcomemessages.set(`welcomemessage_${message.guild.id}`, msg);
    await togglewelcomemsg.set(`togglewelcomemsg_${message.guild.id}`, 1);
    const logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logchname}`);
    if (!log) message.channel.send(`Welcome message successfully changed to ${'`' + msg + '`'}`);
    else log.send(`Welcome message successfully changed to ${'`' + msg + '`'}`);
      
    message.react('✔️');
  }
}
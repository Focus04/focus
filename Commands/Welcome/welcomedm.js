const Keyv = require('keyv');
const welcomedms = new Keyv(process.env.welcomedms);
const togglewelcomedm = new Keyv(process.env.toggleWelcomeDm);
const logchannels = new Keyv(process.env.logchannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'welcomedm',
  description: `Sets a custom welcome message that will be inboxed to new users.`,
  usage: 'welcomedm `message`',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}welcomedm [message]. Use [user] to be replaced with a username.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const msg = args.join(' ');
    await welcomedms.set(`welcomedm_${message.guild.id}`, msg);
    await togglewelcomedm.set(`togglewelcomedm_${message.guild.id}`, 1);
    const logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logchname}`);
    if (!log) message.channel.send(`Welcome DM successfully changed to ${'`' + msg + '`'}`);
    else log.send(`Welcome DM successfully changed to ${'`' + msg + '`'}`);
    message.react(reactionSuccess);
  }
}
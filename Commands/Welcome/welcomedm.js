const Keyv = require('keyv');
const welcomedms = new Keyv(process.env.welcomeDms);
const togglewelcomedm = new Keyv(process.env.toggleWelcomeDm);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'welcomedm',
  description: `Sets a custom welcome message that will be inboxed to new users.`,
  usage: 'welcomedm `message`',
  requiredPerms: ['MANAGE_GUILD'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}welcomedm [message]. Use [user] to be replaced with a username.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const msg = args.join(' ');
    await welcomedms.set(`welcomedm_${message.guild.id}`, msg);
    await togglewelcomedm.set(`togglewelcomedm_${message.guild.id}`, 1);
    await sendLog(message.guild, message.channel, `Welcome DM successfully changed to ${'`' + msg + '`'}`);
    message.react(reactionSuccess);
  }
}
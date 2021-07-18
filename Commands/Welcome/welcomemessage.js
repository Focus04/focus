const Keyv = require('keyv');
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const welcomeMessages = new Keyv(process.env.welcomeMessages);
const toggleWelcomeMsg = new Keyv(process.env.toggleWelcomeMsg);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'welcomemessage',
  description: `Sets a custom welcome message to be displayed when someone joins the server.`,
  usage: 'welcomemessage [message]',
  requiredPerms: ['MANAGE_GUILD'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}welcomemessage [message]. Use [user] to be replaced with a username.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const welcomeChName = await welcomeChannels.get(`welcomechannel_${message.guild.id}`);
    const welcomeChannel = await message.guild.channels.cache.find((ch) => ch.name === `${welcomeChName}`);
    if (!welcomeChannel) {
      let msg = await message.channel.send(`You need to set a channel for welcome messages to be sent in. Use ${prefix}setwelcomechannel to setup one.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const msg = args.join(' ');
    await welcomeMessages.set(`welcomemessage_${message.guild.id}`, msg);
    await toggleWelcomeMsg.set(`togglewelcomemsg_${message.guild.id}`, 1);
    await sendLog(message.guild, message.channel, `Welcome message successfully changed to ${'`' + msg + '`'}`);
    message.react(reactionSuccess);
  }
}
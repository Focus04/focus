const Keyv = require('keyv');
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'setwelcomechannel',
  description: `Sets a custom channel where newcommers will receive a welcome message.`,
  usage: 'setwelcomechannel #`channel-name`',
  requiredPerms: ['MANAGE_GUILD'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}setwelcomechannel #[channel-name]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.find((ch) => ch.name === `${args[0]}`);
    if (!channel) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}. Please make sure that I have access to that channel.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await welcomeChannels.set(`welcomechannel_${message.guild.id}`, channel.name);
    await sendLog(message.guild, message.channel, `All new members will be logged in ${args[0]} from now on.`);
    message.react(reactionSuccess);
  }
}
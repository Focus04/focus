const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'setlogschannel',
  description: `Sets a custom channel where moderation logs will be sent.`,
  usage: 'setlogschannel `channel-name`',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}setlogschannel [channel-name]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let channel = message.guild.channels.cache.find((ch) => ch.name === `${args[0]}`);
    if (!channel) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}. Please make sure that I have access to that channel.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await logChannels.set(`logchannel_${message.guild.id}`, args[0]);
    message.react(reactionSuccess);
    message.channel.send(`All moderation actions will be logged in ${args[0]} from now on.`);
  }
}
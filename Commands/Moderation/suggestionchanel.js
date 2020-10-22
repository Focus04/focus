const Keyv = require('keyv');
const suggestionChanels = new Keyv(process.env.suggestionChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'suggestionchannel',
  description: 'Sets a channel for suggestions to be sent in.',
  usage: 'suggestionchannel `channel-name`',
  requiredPerms: 'MANAGE_SERVER',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}suggestionchannel [channel-name]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const channel = message.guild.channels.cache.find((ch) => ch.name === args[0]);
    if (!channel) {
      let msg = await message.channel.send(`Couldn't find ${channel}.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await suggestionChanels.set(message.guild.id, args[0]);
    await message.channel.send(`All suggestions will be sent in ${args[0]} from now on.`);
    message.react(reactionSuccess);
  }
}
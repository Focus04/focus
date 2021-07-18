const Keyv = require('keyv');
const suggestionChanels = new Keyv(process.env.suggestionChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'suggestionchannel',
  description: 'Sets a channel for suggestions to be sent in.',
  usage: 'suggestionchannel #`channel-name`',
  requiredPerms: ['MANAGE_GUILD'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}suggestionchannel #[channel-name]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.find((ch) => ch.name === args[0]);
    if (!channel) {
      let msg = await message.channel.send(`Couldn't find ${channel}.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await suggestionChanels.set(message.guild.id, channel.name);
    await sendLog(message.guild, message.channel, `All suggestions will be sent in ${args[0]} from now on.`);
    message.react(reactionSuccess);
  }
}
const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.leaveChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'setleavechannel',
  description: `Sets a custom channel where leaving members will be logged.`,
  usage: 'setleavechannel #`channel-name`',
  requiredPerms: ['MANAGE_GUILD'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}setleavechannel #[channel-name]`);
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

    await leaveChannels.set(`leavechannel_${message.guild.id}`, channel.name);
    await sendLog(message.guild, message.channel, `All leaving members will be logged in ${args[0]} from now on.`);
    message.react(reactionSuccess);
  }
}
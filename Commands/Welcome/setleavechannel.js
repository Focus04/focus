const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.leaveChannels);
const logChannels = new Keyv(process.env.logChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'setleavechannel',
  description: `Sets a custom channel where leaving members will be logged.`,
  usage: 'setleavechannel #`channel-name`',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}setleavechannel #[channel-name]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const channel = message.mentions.channels.first() || message.guild.channels.cache.find((ch) => ch.name === `${args[0]}`);
    if (!channel) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}. Please make sure that I have access to that channel.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await leaveChannels.set(`leavechannel_${message.guild.id}`, channel.name);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((channel) => channel.name === logChName);
    if (!log) message.channel.send(`All leaving members will be logged in ${args[0]} from now on.`);
    else log.send(`All leaving members will be logged in ${args[0]} from now on.`);
    message.react(reactionSuccess);
  }
}
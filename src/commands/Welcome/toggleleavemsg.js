const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.leaveChannels);
const toggleLeave = new Keyv(process.env.toggleLeaveMsg);
const logChannels = new Keyv(process.env.logChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'toggleleavemsg',
  description: `Toggles leave messages on/off.`,
  usage: 'toggleleavemsg',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, prefix) {
    const leaveChName = await leaveChannels.get(`leavechannel_${message.guild.id}`);
    const leave = message.guild.channels.cache.find((ch) => ch.name === `${leaveChName}`);
    let logs = await toggleLeave.get(`toggleleavemsg_${message.guild.id}`);
    let state;
    
    if (!leave) {
      let msg = await message.channel.send(`You first need to set a channel for messages to be sent in. Use ${prefix}setleavechannel to setup one.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await toggleLeave.set(`toggleleavemsg_${message.guild.id}`, logs);
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((channel) => channel.name === logChName);
    if (!log) message.channel.send(`Leave messages are now set to ${'`' + state + '`'}`);
    else log.send(`Leave messages are now set to ${'`' + state + '`'}`);
    message.react(reactionSuccess);
  }
}
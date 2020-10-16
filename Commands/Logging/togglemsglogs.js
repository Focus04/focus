import Keyv from 'keyv';
const logChannels = new Keyv(process.env.logChannels);
const msgLogs = new Keyv(process.env.msgLogs);
import { deletionTimeout, reactionError, reactionSuccess } from '../../config.json';

module.exports = {
  name: 'togglemsglogs',
  description: `Toggles message logs on/off.`,
  usage: 'togglemsglogs',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, prefix) {

    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    let logs = await msgLogs.get(`msglogs_${message.guild.id}`);
    let state;
    
    if (!log) {
      let msg = await message.channel.send(`You need to set a channel for logs to be sent in. Use ${prefix}setlogschannel to setup one.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!logs || logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await msgLogs.set(`msglogs_${message.guild.id}`, logs);
    message.react(reactionSuccess);
    message.channel.send(`Message logs are now set to ${state}.`);
  }
}
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);

module.exports = {
  sendLog: async (guild, channel, message) => {
    const logChName = await logChannels.get(`logchannel_${guild.id}`);
    const log = await guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (!log) channel.send(message);
    else log.send(message);
  }
}
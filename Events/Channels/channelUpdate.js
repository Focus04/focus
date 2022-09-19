const Keyv = require('keyv');
const logChannels = new Keyv(process.env.DB_URI.replace('dbname', 'logchannels'));
const welcomeChannels = new Keyv(process.env.DB_URI.replace('dbname', 'welcomechannels'));
const leaveChannels = new Keyv(process.env.DB_URI.replace('dbname', 'leavechannels'));
const suggestionChanels = new Keyv(process.env.suggestionChanels);

module.exports = async (client, oldChannel, newChannel) => {
  if (newChannel.type !== 'GUILD_TEXT') return;
  const logChannelName = await logChannels.get(`logchannel_${newChannel.guild.id}`);
  const welcomeChannelName = await welcomeChannels.get(`welcomechannel_${newChannel.guild.id}`);
  const leaveChannelName = await leaveChannels.get(`leavechannel_${newChannel.guild.id}`);
  const suggestionChannelName = await suggestionChanels.get(newChannel.guild.id);
  
  switch (oldChannel.name) {
    case (logChannelName):
      logChannels.set(`logchannel_${newChannel.guild.id}`, newChannel.name);
      break;
    case (welcomeChannelName):
      welcomeChannels.set(`welcomechannel_${newChannel.guild.id}`, newChannel.name);
      break;
    case (leaveChannelName):
      leaveChannels.set(`leavechannel_${newChannel.guild.id}`, newChannel.name);
      break;
    case (suggestionChannelName):
      suggestionChanels.set(newChannel.guild.id, newChannel.name);
      break;
  }
}
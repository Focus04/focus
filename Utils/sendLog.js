const Keyv = require('keyv');
const logChannels = new Keyv(process.env.DB_URI).replace('dbname', 'logchannels');

module.exports = {
  sendLog: async (interaction, message) => {
    const logChName = await logChannels.get(`logchannel_${interaction.guild.id}`);
    const log = await interaction.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    let msgContent = {};
    if (message.color) msgContent = { embeds: [message] };
    else msgContent = { content: message };
    interaction.reply(msgContent);
    if (log) log.send(msgContent);
  }
}
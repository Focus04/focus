const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.DB_URI.replace('dbname', 'logchannels'));
const msgLogs = new Keyv(process.env.DB_URI.replace('dbname', 'msglogs'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('togglemsglogs')
    .setDescription(`Toggles message logs on/off.`),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const logChName = await logChannels.get(`logchannel_${interaction.guild.id}`);
    const log = interaction.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    let logs = await msgLogs.get(`msglogs_${interaction.guild.id}`);
    let state;
    
    if (!log) {
      return interaction.reply({ content: `You need to set a channel for logs to be sent in.Use /setlogschannel to setup one.`, ephemeral: true });
    }

    if (!logs || logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await msgLogs.set(`msglogs_${interaction.guild.id}`, logs);
    interaction.reply({ content: `Logs are now set to ${'`' + state + '`'}`, ephemeral: true });
  }
}
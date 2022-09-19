const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.DB_URI.replace('dbname', 'leavechannels'));
const toggleLeave = new Keyv(process.env.toggleLeaveMsg);
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('toggleleavemsg'))
    .setDescription(`Toggles leave messages on/off.`),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const leaveChName = await leaveChannels.get(`leavechannel_${interaction.guild.id}`);
    const leave = interaction.guild.channels.cache.find((ch) => ch.name === `${leaveChName}`);
    let logs = await toggleLeave.get(`toggleleavemsg_${interaction.guild.id}`);
    let state;
    
    if (!leave) {
      return interaction.reply({ content: `You first need to set a channel for messages to be sent in. Use /setleavechannel to setup one.`, ephemeral: true });
    }

    if (logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await toggleLeave.set(`toggleleavemsg_${interaction.guild.id}`, logs);
    await sendLog(interaction, `Leave messages are now set to ${'`' + state + '`'}`);
  }
}
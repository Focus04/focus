const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.DB_URI.replace('dbname', 'leavechannels'));
const leaveMessages = new Keyv(process.env.DB_URI.replace('dbname', 'leavemessages'));
const toggleLeaveMsg = new Keyv(process.env.DB_URI.replace('dbname', 'toggleleavemsg'));
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leavemessage')
    .setDescription(`Sets a custom good bye message for those leaving the server.`)
    .addStringOption((option) => option
      .setName('message')
      .setDescription(`Use [user] to be replaced by the username.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const msg = interaction.options.getString('message');
    const leaveChName = await leaveChannels.get(`leavechannel_${interaction.guild.id}`);
    const leaveChannel = await interaction.guild.channels.cache.find((ch) => ch.name === `${leaveChName}`);
    if (!leaveChannel) {
      return interaction.reply({ content: `You need to set a channel for leave messages to be sent in. Use /setleavechannel to setup one.`, ephemeral: true });
    }

    await leaveMessages.set(`leavemessage_${interaction.guild.id}`, msg);
    await toggleLeaveMsg.set(`toggleleavemsg_${interaction.guild.id}`, 1);
    await sendLog(interaction, `Leave message successfully changed to ${'`' + msg + '`'}`);
  }
}
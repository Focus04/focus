const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const welcomeChannels = new Keyv(process.env.DB_URI.replace('dbname', 'welcomechannels'));
const welcomeMessages = new Keyv(process.env.DB_URI.replace('dbname', 'welcomemessages'));
const toggleWelcomeMsg = new Keyv(process.env.DB_URI.replace('dbname', 'togglewelcomemsg'));
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcomemessage')
    .setDescription(`Sets a custom welcome message to be displayed when someone joins the server.`)
    .addStringOption((option) => option
      .setName('message')
      .setDescription(`Use [user] to be replaced by the username.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const msg = interaction.options.getString('message');
    const welcomeChName = await welcomeChannels.get(`welcomechannel_${interaction.guild.id}`);
    const welcomeChannel = await interaction.guild.channels.cache.find((ch) => ch.name === `${welcomeChName}`);
    if (!welcomeChannel) {
      return interaction.reply({ content: `You need to set a channel for welcome messages to be sent in. Use /setwelcomechannel to setup one.`, ephemeral: true });
    }

    await welcomeMessages.set(`welcomemessage_${interaction.guild.id}`, msg);
    await toggleWelcomeMsg.set(`togglewelcomemsg_${interaction.guild.id}`, 1);
    await sendLog(interaction, `Welcome message successfully changed to ${'`' + msg + '`'}`);
  }
}
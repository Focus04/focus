const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const toggleWelcome = new Keyv(process.env.toggleWelcomeMsg);
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('togglewelcomemsg')
    .setDescription(`Toggles welcome messages on/off.`),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const welcomeChName = await welcomeChannels.get(`welcomechannel_${interaction.guild.id}`);
    const welcome = interaction.guild.channels.cache.find((ch) => ch.name === `${welcomeChName}`);
    let logs = await toggleWelcome.get(`togglewelcomemsg_${interaction.guild.id}`);
    let state;
    
    if (!welcome) {
      return interaction.reply({ content: `You first need to set a channel for messages to be sent in. Use /setwelcomechannel to setup one.`, ephemeral: true });
    }

    if (logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await toggleWelcome.set(`togglewelcomemsg_${interaction.guild.id}`, logs);
    await sendLog(interaction, `Welcome messages are now set to ${'`' + state + '`'}`);
  }
}
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const welcomedms = new Keyv(process.env.welcomeDms);
const togglewelcomedm = new Keyv(process.env.toggleWelcomeDm);
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcomedm')
    .setDescription(`Sets a custom welcome message that will be inboxed to new users.`)
    .addStringOption((option) => option
      .setName('message')
      .setDescription(`Use [user] to be replaced by the username.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const msg = interaction.options.getString('message');
    await welcomedms.set(`welcomedm_${interaction.guild.id}`, msg);
    await togglewelcomedm.set(`togglewelcomedm_${interaction.guild.id}`, 1);
    await sendLog(interaction, `Welcome DM successfully changed to ${'`' + msg + '`'}`);
  }
}
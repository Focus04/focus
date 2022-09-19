const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const welcomeDms = new Keyv(process.env.DB_URI).replace('dbname', 'welcomedms');
const toggleWelcomeDm = new Keyv(process.env.DB_URI).replace('dbname', 'togglewelcomedm');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('togglewelcomedm')
    .setDescription(`Toggles welcome DMs on/off.`),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const welcomeDm = await welcomeDms.get(`welcomedm_${interaction.guild.id}`);
    let logs = await toggleWelcomeDm.get(`togglewelcomedm_${interaction.guild.id}`);
    let state;

    if (!welcomeDm) {
      return interaction.reply({ content: `You first need to set a welcome DM. Use /welcomedm to setup one.`, ephemeral: true });
    }
    
    if (logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await toggleWelcomeDm.set(`togglewelcomedm_${interaction.guild.id}`, logs);
    await sendLog(interaction, `Welcome DMs are now set to ${'`' + state + '`'}`);
  }
}
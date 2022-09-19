const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const welcomeRoles = new Keyv(process.env.DB_URI).replace('dbname', 'welcomeroles');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcomerole')
    .setDescription(`Sets a role to be assigned to new users when they join the server.`)
    .addRoleOption((option) => option
      .setName('role')
      .setDescription('The role to be given when someone joins the server.')
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(interaction) {
    const welcomeRole = interaction.options.getRole('role');
    let botHighestRole = -1;
    let highestRole = -1;
    interaction.guild.me.roles.cache.map((r) => {
      if (r.position > botHighestRole) botHighestRole = r.position;
    });

    if (welcomeRole.position >= botHighestRole) {
      return interaction.reply({ conetnt: `My roles must be higher than the role that you want to set.`, ephemeral: true });
    }
    
    interaction.member.roles.cache.map((r) => {
      if (r.position > highestRole) highestRole = r.position;
    });

    if (welcomeRole.position >= highestRole) {
      return interaction.reply({ content: `Your roles must be higher than the role that you want to set.`, ephemeral: true });
    }

    await welcomeRoles.set(`welcomerole_${interaction.guild.id}`, welcomeRole.name);
    await sendLog(interaction, `Welcome role successfully changed to ${'`' + welcomeRole.name + '`'}`);
  }
}
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('takerole')
    .setDescription(`Removes a role from a user.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to remove a role from.`)
      .setRequired(true)
    )
    .addRoleOption((option) => option
      .setName('role')
      .setDescription(`The role that you want to remove.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_ROLES'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');
    if (!role) {
      return interaction.reply({ content: `${member.user.username} doesn't have any roles named ${role.name}`, ephemeral: true });
    }

    if (interaction.guild.me.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: `My roles must be higher than the role that you want to take!`, ephemeral: true });
    }

    if (interaction.member.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: `Your roles must be higher than the role that you want to take.`, ephemeral: true });
    }

    member.roles.remove(role);
    let perms = role.permissions.toArray().map((perm) => perm).join(`\n`);
    perms = '```' + perms + '```';
    let color = getRoleColor(interaction.guild);
    const takeRoleEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`Deleted Role`)
      .addFields(
        { name: 'From', value: `${member}` },
        { name: 'By', value: `${interaction.member.user.username}` },
        { name: 'Role', value: `${role.name}` },
        { name: 'Permissions', value: `${perms}` }
      )
      .setTimestamp();
    sendLog(interaction, takeRoleEmbed);
  }
}
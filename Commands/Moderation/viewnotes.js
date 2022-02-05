const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('viewnotes')
    .setDescription(`Shows all notes linked to a user from this server.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to view the notes of.`)
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  async execute(interaction) {
    let member = interaction.options.getMember('user');
    let content = '';
    const notes = await nts.get(`notes_${member.id}_${interaction.guild.id}`);
    if (notes) notes.forEach((note) => content += note);
    if (!notes[0]) interaction.reply({ content: `There are no notes linked to ${member.user.username}.`, ephemeral: true });
    else {
      let color = getRoleColor(interaction.guild);
      const viewNotesEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${member.user.username}'s notes`)
        .setDescription(content)
        .setTimestamp();
      interaction.member.user.send({ embeds: [viewNotesEmbed] });
    }
    interaction.reply({ content: `Check your inbox.`, ephemeral: true });
  }
}
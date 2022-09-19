const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editnote')
    .setDescription(`Edits a note from a user.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to edit a note from.`)
      .setRequired(true)
    )
    .addIntegerOption((option) => option
      .setName('id')
      .setDescription(`The id of the note that you want to edit`)
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('new_content')
      .setDescription(`The new content of the note`)
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const id = interaction.options.getInteger('id');
    const content = interaction.options.getString('new_content');
    let notes = await nts.get(`notes_${member.id}_${interaction.guild.id}`);
    if (id > notes.length || id < 1) {
      return interaction.reply({ content: `Couldn't find any notes with the ID of ${id}`, ephemeral: true });
    }

    notes[id - 1] = '```' + `${content}` + '```' + `Added by ${interaction.member.user.username} on ${moment(interaction.createdTimestamp).format('LL')}, at ${moment(interaction.createdTimestamp).format('LT')} GMT\n`;
    await nts.set(`notes_${member.id}_${interaction.guild.id}`, notes);
    await interaction.reply({ content: `Note successfully edited on ${member.user.username}'s account.`, ephemeral: true });
  }
}
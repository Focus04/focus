const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const nts = new Keyv(process.env.DB_URI).replace('dbname', 'notes');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delnote')
    .setDescription(`Deletes a note from a user.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to remove a note from.`)
      .setRequired(true)
    )
    .addIntegerOption((option) => option
      .setName('id')
      .setDescription(`The id of the note that you want to delete`)
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const id = interaction.options.getInteger('id');
    let notes = await nts.get(`notes_${member.id}_${interaction.guild.id}`);
    if (id > notes.length || id < 1) {
      return interaction.reply({ content: `Couldn't find any notes with the ID of ${'`' + id + '`'}`, ephemeral: true })
    }

    notes.splice(id - 1, 1);
    await nts.set(`notes_${member.id}_${interaction.guild.id}`, notes);
    interaction.reply({ content: `Note successfully deleted from ${member.user.username}'s account.`, ephemeral: true });
  }
}
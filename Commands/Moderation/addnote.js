const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
const Keyv = require('keyv');
const nts = new Keyv(process.env.DB_URI.replace('dbname', 'notes'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addnote')
    .setDescription(`Adds an admin note on someone's account. All staff members will be able to view this note.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user you want to add a note to.')
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('note')
      .setDescription('The note that you want to add.')
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const noteValue = interaction.options.getString('note');
    let notes = await nts.get(`notes_${member.id}_${interaction.guild.id}`);
    if (!notes) notes = [];
    const note = '```' + noteValue + '```' + `Added by ${interaction.member.user.username} on ${moment(interaction.createdTimestamp).format('LL')}, at ${moment(interaction.createdTimestamp).format('LT')} GMT\n`;
    notes.push(note);
    await nts.set(`notes_${member.id}_${interaction.guild.id}`, notes);
    await interaction.reply({ content: `Note successfully added on ${member.user.username}'s account`, ephemeral: true });
  }
}
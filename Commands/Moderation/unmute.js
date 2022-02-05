const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const mutedMembers = new Keyv(process.env.mutedMembers);
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription(`Removes a user's muted status earlier.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to unmute.`)
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(interaction) {
    const author = interaction.member.user.username;
    const member = interaction.options.getMember('user');
    const mutedRole = interaction.guild.roles.cache.find((r) => r.name === 'Muted Member');
    let mutedMembersArr = await mutedMembers.get(interaction.guild.id);
    let mutedMember = mutedMembersArr.find((arrElement) => arrElement.userID === member.user.id);
    mutedMembersArr.splice(mutedMembersArr.indexOf(mutedMember), 1);
    if (!mutedRole || !member.roles.cache.has(mutedRole.id)) {
      return interaction.reply({ content: `${member} isn't muted!`, ephemeral: true });
    }

    mutedMembers.set(interaction.guild.id, mutedMembersArr);
    member.roles.remove(mutedRole);
    await sendLog(interaction, `${member} has been unmuted earlier.`);
    if (!member.user.bot) member.send({ content: `${author} unmuted you earlier from ${interaction.guild.name}.`, ephemeral: true });
  }
}
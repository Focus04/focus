const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const mutedMembers = new Keyv(process.env.mutedMembers);
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('muteinfo')
    .setDescription(`View details about a muted member.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to view information about his mute.`)
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  async execute (interaction) {
    const member = interaction.options.getMember('user');
    let mutedMembersArr = await mutedMembers.get(interaction.guild.id);
    let mutedMember = mutedMembersArr.find((arrElement) => arrElement.userID === member.user.id);
    if (!mutedMember) {
      return interaction.reply({ content: `${member} isn't muted!` });
    }

    let color = getRoleColor(interaction.guild);
    const millisecondsPerMinute = 60 * 1000;
    const minutesRemaining = Math.ceil((mutedMember.unmuteDate - Date.now()) / millisecondsPerMinute);
    const muteInfoEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`Mute Information`)
      .addFields(
        { name: `Defendant's name:`, value: member.user.tag },
        { name: `Issued by:`, value: mutedMember.author },
        { name: `Minutes Remaining:`, value: minutesRemaining.toString() }
      )
      .setTimestamp();
    if (mutedMember.reason) muteInfoEmbed.addField('Reason', mutedMember.reason);
    interaction.reply({ embeds: [muteInfoEmbed] });
  }
}
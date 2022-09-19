const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');
const Keyv = require('keyv');
const names = new Keyv(process.env.DB_URI.replace('dbname', 'names'));
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checknames')
    .setDescription(`Check a member's previous nicknames.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to check previous nicknames of.`)
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const namesArr = await names.get(`${member.user.id}_${interaction.guild.id}`);
    if (!namesArr) {
      return interaction.reply({ content: `There aren't any name changes logged from ${member.user.username}`, ephemeral: true });
    }

    let content = '';
    namesArr.forEach((name) => content += `${'`' + name.newName + '`'} - ${moment(name.date).format('D.M.Y')}, at ${moment(name.date).format('LT')} GMT\n`);
    let color = getRoleColor(interaction.guild);
    const nameChangesEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${member.user.tag}'s nicknames`)
      .setDescription(content)
      .setTimestamp();
    interaction.reply({ embeds: [nameChangesEmbed] });
  }
}
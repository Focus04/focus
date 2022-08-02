const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription(`Displays the avatar of a user.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user you want to view the avatar of.')
    ),
  execute(interaction) {
    const user = interaction.options.getUser('user');
    let color = getRoleColor(interaction.guild);
    let avatarEmbed;
    if (!user) {
      avatarEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle('Your avatar')
        .setImage(interaction.member.user.displayAvatarURL({
          format: 'png',
          dynamic: true,
          size: 2048
        }))
        .setTimestamp();
    } else {
      avatarEmbed = new MessageEmbed()
        .setColor(color)
        .setTimestamp()
        .setTitle(`${user.username}'s avatar`)
        .setImage(user.displayAvatarURL({
          dynamic: true,
          size: 2048
        }));
    }
    interaction.reply({ embeds: [avatarEmbed] });
  }
}
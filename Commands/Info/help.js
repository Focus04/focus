const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { urls } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription(`Displays a list of all available commands along with their usage.`),
  async execute(interaction) {
    const { botInviteLink, discordInviteLink, topgg, website, github } = urls;
    let color = getRoleColor(interaction.guild);
    let debugCmds = '';
    let funCmds = '';
    let infoCmds = '';
    let roleCmds = '';
    let staffCmds = '';
    let welcomeCmds = '';
    fs.readdirSync('./Commands/Debug').forEach((file) => {
      debugCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Fun').forEach((file) => {
      funCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Info').forEach((file) => {
      infoCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Roles').forEach((file) => {
      roleCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Moderation').forEach((file) => {
      staffCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });
    fs.readdirSync('./Commands/Welcome').forEach((file) => {
      welcomeCmds += `/${file.slice(0, file.lastIndexOf('.'))} `;
    });

    const helpEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle('Commands')
      .addFields(
        {
          name: `Staff Commands`,
          value: `${'```' + staffCmds + '```'}`, inline: true
        },
        {
          name: `Info Commands`,
          value: `${'```' + infoCmds + '```'}`, inline: true
        },
        {
          name: `Role Commands`,
          value: `${'```' + roleCmds + '```'}`, inline: true
        },
        {
          name: `Welcome Comamnds`,
          value: `${'```' + welcomeCmds + '```'}`, inline: true
        },
        {
          name: `Fun Commands`,
          value: `${'```' + funCmds + '```'}`, inline: true
        },
        {
          name: `Debug Commands`,
          value: `${'```' + debugCmds + '```'}`, inline: true
        }
      )
      .setTimestamp();
    const links = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Add me')
        .setURL(botInviteLink)
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Support')
        .setURL(discordInviteLink)
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Vote!')
        .setURL(topgg)
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Website')
        .setURL(website)
        .setStyle('LINK'),
      new MessageButton()
        .setLabel('Code')
        .setURL(github)
        .setStyle('LINK')
    );
    interaction.reply({ embeds: [helpEmbed], components: [links] });
  }
}
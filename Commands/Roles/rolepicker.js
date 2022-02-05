const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolepicker')
    .setDescription(`Creates a menu that automatically assigns roles to users that react to it.`)
    .addRoleOption((option) => option
      .setName('role')
      .setDescription(`The role that you want to add to this rolepicker.`)
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('emoji')
      .setDescription(`The emoji that you want to be displayed next to the role option.`)
    )
    .addStringOption((option) => option
      .setName('description')
      .setDescription(`Describe the role.`)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(interaction) {
    let role = interaction.options.getRole('role');
    let emoji = interaction.options.getString('emoji');
    let description = interaction.options.getString('description');
    if (interaction.guild.me.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: `My roles must be higher than the role that you want to set.`, ephemeral: true });
    }

    if (interaction.member.roles.highest.comparePositionTo(role) <= 0) {
      return interaction.reply({ content: `Your roles must be higher than the role that you want to set.`, ephemeral: true });
    }

    if (emoji && emoji.startsWith('<:')) {
      let customEmoji = interaction.client.emojis.cache.get(emoji.slice(-19, -1));
      if (!customEmoji) {
        return interaction.reply({ content: `Make sure that this custom emoji shares a mutual server with me`, ephemeral: true });
      }

      emoji = emoji.slice(-19, -1);
    }

    const color = getRoleColor(interaction.guild);
    const title = new MessageEmbed()
      .setColor(color)
      .setTitle('Role Picker')
      .setDescription(`Choose an option below to assign yourself a role from the list.`)
      .setTimestamp();
    const menu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('role_picker')
        .setPlaceholder('Role Options')
        .setMinValues(0)
        .setMaxValues(1)
        .addOptions([
          {
            label: role.name,
            value: role.id
          }
        ])
    );
    if (emoji) menu.components[0].options[0].emoji = emoji;
    if (description) menu.components[0].options[0].description = description;
    interaction.reply({ content: `Role picker successfully created. You can use /addroletorp to add more roles to it.`, ephemeral: true });
    interaction.channel.send({ embeds: [title], components: [menu] });
  }
}
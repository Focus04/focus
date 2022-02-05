const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addroletorp')
    .setDescription(`Adds a role option to an existent role picker.`)
    .addStringOption((option) => option
      .setName('messageid')
      .setDescription(`The ID of the message that contains the role picker.`)
      .setRequired(true)
    )
    .addRoleOption((option) => option
      .setName('role')
      .setDescription(`The role that you want to add.`)
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
    let id = interaction.options.getString('messageid');
    let role = interaction.options.getRole('role');
    let emoji = interaction.options.getString('emoji');
    let description = interaction.options.getString('description');
    let error = 0;
    let msg = await interaction.channel.messages.fetch(id).catch((err) => error = err);
    if (error) {
      return interaction.reply({ content: `Couldn't find any role pickers with the ID of ${'`' + id + '`'}.`, ephemeral: true });
    }

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

    let options = msg.components[0].components[0].options;
    let optionCount = 0;
    let err = 0;
    options.forEach((option) => {
      optionCount++;
      if (option.value === role.id) err = 1;
    });
    if (err) {
      return interaction.reply({ content: `This role picker already contains this role.`, ephemeral: true });
    }

    let newOption = {};
    newOption.label = role.name;
    newOption.value = role.id;
    if (emoji) newOption.emoji = emoji;
    if (description) newOption.description = description;
    options.push(newOption);
    msg.components[0].components[0].options = options;
    msg.components[0].components[0].maxValues = options.length;
    await msg.edit({ embeds: [msg.embeds[0]], components: [msg.components[0]] });
    interaction.reply({ content: `Role successfully added.`, ephemeral: true });
  }
}
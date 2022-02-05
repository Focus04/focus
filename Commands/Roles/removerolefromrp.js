const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerolefromrp')
    .setDescription(`Removes a role option from an existent role picker.`)
    .addStringOption((option) => option
      .setName('messageid')
      .setDescription(`The ID of the message that contains the role picker.`)
      .setRequired(true)
    )
    .addRoleOption((option) => option
      .setName('role')
      .setDescription(`The role that you want to remove.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(interaction) {
    let id = interaction.options.getString('messageid');
    let role = interaction.options.getRole('role');
    let error = 0;
    let msg = await interaction.channel.messages.fetch(id).catch((err) => error = err);
    if (error) {
      return interaction.reply({ content: `Couldn't find any role pickers with the ID of ${'`' + id + '`'}.`, ephemeral: true });
    }

    let options = msg.components[0].components[0].options;
    let roleOption = options.find((option) => option.value === role.id);
    if (!roleOption) {
      return interaction.reply({ content: `Couldn't find this role in the role picker.`, ephemeral: true });
    }

    if (options.length === 1) {
      return interaction.reply({ content: `Couldn't remove this role as it is the last one in the role picker. Delete the message instead.`, ephemeral: true });
    }

    options.splice(options.indexOf(roleOption), 1);
    msg.components[0].components[0].options = options;
    msg.components[0].components[0].maxValues = options.length;
    await msg.edit({ embeds: [msg.embeds[0]], components: [msg.components[0]] });
    interaction.reply({ content: `Role successfully removed.`, ephemeral: true });
  }
}
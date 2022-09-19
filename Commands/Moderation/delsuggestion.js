const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const suggestionChannels = new Keyv(process.env.suggestionChannels);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delsuggestion')
    .setDescription(`Deletes a suggestion.`)
    .addStringOption((option) => option
      .setName('messageid')
      .setDescription(`The ID of the message that contains the suggestion`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  botRequiredPerms: ['MANAGE_MESSAGES'],
  async execute(interaction) {
    const id = interaction.options.getString('messageid');
    let suggestionChName = await suggestionChannels.get(interaction.guild.id);
    let suggestionChannel = interaction.guild.channels.cache.find((ch) => ch.name === suggestionChName);
    let error = 0;
    let suggestion = await suggestionChannel.interactions.fetch(id).catch((err) => error = err);
    if (error) {
      return interaction.reply({ content: `Couldn't find any messages with the ID of ${'`' + id + '`'}`, ephemeral: true });
    }

    await suggestionChannel.interaction.delete(suggestion);
    interaction.reply({ content: `Suggestion ${'`' + id + '`'} has been successfully deleted.`, ephemeral: true });
  }
}
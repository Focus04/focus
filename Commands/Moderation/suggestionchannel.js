const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const suggestionChanels = new Keyv(process.env.DB_URI).replace('dbname', 'suggestionChannels');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestionchannel')
    .setDescription(`Sets a channel for suggestions to be sent in.`)
    .addChannelOption((option) => option
      .setName('channel')
      .setDescription(`The channel you want to get suggestions in.`)
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return interaction.reply({ content: `Invalid channel.`, ephemeral: true });
    }

    await suggestionChanels.set(interaction.guild.id, channel.name);
    await sendLog(interaction, `All suggestions will be sent in #${channel.name} from now on.`);
  }
}
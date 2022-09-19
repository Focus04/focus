const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.DB_URI).replace('dbname', 'logchannels');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlogschannel')
    .setDescription(`Sets a custom channel where moderation logs will be sent.`)
    .addChannelOption((option) => option
      .setName('channel-name')
      .setDescription('The channel you want logs to be sent in.')
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel-name');
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return interaction.reply({ content: `Invalid channel.`, ephemeral: true });
    }

    await logChannels.set(`logchannel_${interaction.guild.id}`, channel.name);
    interaction.reply({ content: `All moderation actions will be logged in ${'`' + channel.name + '`'} from now on.`, ephemeral: true });
  }
}
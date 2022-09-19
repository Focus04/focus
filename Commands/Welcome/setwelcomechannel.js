const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const welcomeChannels = new Keyv(process.env.DB_URI.replace('dbname', 'welcomechannels'));
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setwelcomechannel')
    .setDescription(`Sets a custom channel where newcommers will receive a welcome message.`)
    .addChannelOption((option) => option
      .setName('channel-name')
      .setDescription('The channel you want new members to be logged in.')
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel-name');
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return interaction.reply({ content: `Invalid channel.`, ephemeral: true });
    }

    await welcomeChannels.set(`welcomechannel_${interaction.guild.id}`, channel.name);
    await sendLog(interaction, `All new members will be logged in #${channel.name} from now on.`);
  }
}
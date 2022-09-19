const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.leaveChannels);
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setleavechannel')
    .setDescription(`Sets a custom channel where leaving members will be logged.`)
    .addChannelOption((option) => option
      .setName('channel-name')
      .setDescription('The channel you want leaving members to be logged in.')
      .setRequired(true)
    ),
  requiredPerms: ['MANAGE_GUILD'],
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel-name');
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return interaction.reply({ content: `Invalid channel`, ephemeral: true });
    }

    await leaveChannels.set(`leavechannel_${interaction.guild.id}`, channel.name);
    await sendLog(interaction, `All leaving members will be logged in #${channel.name} from now on.`);
  }
}
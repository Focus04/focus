const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const bannedUsers = new Keyv(process.env.bannedUsers);
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription(`Unbans a user earlier.`)
    .addStringOption((option) => option
      .setName('username')
      .setDescription(`The username of the banned user.`)
      .setRequired(true)
    ),
  requiredPerms: ['BAN_MEMBERS'],
  botRequiredPerms: ['BAN_MEMBERS'],
  async execute(interaction) {
    const username = interaction.options.getString('username');
    const bannedUsersArr = await bannedUsers.get(interaction.guild.id);
    const bannedUser = bannedUsersArr.find((user) => user.username === username);
    if (!bannedUser) {
      return interaction.reply({ content: `${username} isn't banned.`, ephemeral: true });
    }

    let error = 0;
    await interaction.guild.members.unban(bannedUser.userID).catch(async (err) => error = err);
    if (error) {
      return interaction.reply({ content: `${username} isn't banned.`, ephemeral: true });
    }

    bannedUsersArr.splice(bannedUsersArr.indexOf(bannedUser), 1);
    await bannedUsers.set(interaction.guild.id, bannedUsersArr);
    await sendLog(interaction, `${username} has been unbanned earlier.`);
  }
}
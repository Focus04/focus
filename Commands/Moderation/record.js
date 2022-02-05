const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const warnings = new Keyv(process.env.wrns);
const bns = new Keyv(process.env.bns);
const kks = new Keyv(process.env.kks);
const mts = new Keyv(process.env.mts);
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('record')
    .setDescription(`Displays how many punishments a user has ever received on the server.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription(`The user that you want to check the record of.`)
      .setRequired(true)
    ),
  requiredPerms: ['KICK_MEMBERS'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    let warns = await warnings.get(`warns_${member.id}_${interaction.guild.id}`);
    let kicks = await kks.get(`kicks_${member.id}_${interaction.guild.id}`);
    let mutes = await mts.get(`mutes_${member.id}_${interaction.guild.id}`);
    let bans = await bns.get(`bans_${member.id}_${interaction.guild.id}`);
    if (!warns) warns = 0;
    if (!kicks) kicks = 0;
    if (!mutes) mutes = 0;
    if (!bans) bans = 0;

    let color = getRoleColor(interaction.guild);
    const recordEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${member.username}'s record`)
      .addFields(
        { name: 'Times warned', value: `${warns.toString()}` },
        { name: 'Times kicked', value: `${kicks.toString()}` },
        { name: 'Times muted', value: `${mutes.toString()}` },
        { name: 'Times banned', value: `${bans.toString()}` }
      )
      .setTimestamp();
    interaction.reply({ embeds: [recordEmbed] });
  }
}
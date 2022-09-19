const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const bns = new Keyv(process.env.DB_URI).replace('dbname', 'bns');
const bannedUsers = new Keyv(process.env.DB_URI).replace('dbname', 'bannedusers');
const punishments = new Keyv(process.env.DB_URI).replace('dbname', 'punishments');
const { pinEmojiId } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription(`Restricts a user's access to the server.`)
    .addUserOption((option) => option
      .setName('user')
      .setDescription('The user you want to ban.')
      .setRequired(true)
    )
    .addNumberOption((option) => option
      .setName('days')
      .setDescription(`The amount of days that you want the user to stay banned.`)
    )
    .addStringOption((option) => option
      .setName('reason')
      .setDescription(`The reason you're banning this user for.`)
    ),
  requiredPerms: ['BAN_MEMBERS'],
  botRequiredPerms: ['BAN_MEMBERS'],
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const user = interaction.options.getUser('user');
    const days = interaction.options.getNumber('days');
    const reason = interaction.options.getString('reason');
    const author = interaction.member.user.username;
    if (user.id == interaction.member.user.id) {
      return interaction.reply({ content: `You can't ban youself, smarty pants!`, ephemeral: true });
    }

    if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
      return interaction.reply({ content: `Your roles must be higher than the roles of the person you want to ban!`, ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: `Make sure that my role is higher than the roles of the person you want to ban!`, ephemeral: true });
    }

    let color = getRoleColor(interaction.guild);
    if (!days) {
      let bans = await bns.get(`bans_${member.id}_${interaction.guild.id}`);
      if (!bans) bans = 1;
      else bans++;

      const banEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${interaction.client.emojis.cache.get(pinEmojiId).toString()} Ban Information`)
        .addFields(
          { name: `Defendant's name:`, value: `${member.user.tag}` },
          { name: `Issued by:`, value: `${author}` },
          { name: `Duration:`, value: `Permanent` }
        )
        .setFooter(`You can use /unban ${member.user.username} to unban ${member.user.username} earlier or /baninfo ${member.user.username} to view information about his ban.`)
        .setTimestamp();
      let msg = `${author} has permanently banned you from ${interaction.guild.name}.`;
      let BanInfo = {};
      BanInfo.userID = member.user.id;
      BanInfo.username = member.user.username;
      BanInfo.author = author;
      if (reason) {
        banEmbed.addField('Reason', reason);
        msg += ` Reason: ${reason}.`;
        BanInfo.reason = '`' + reason + '`';
      }

      let bannedUsersArr = await bannedUsers.get(interaction.guild.id);
      if (!bannedUsersArr) bannedUsersArr = [];
      bannedUsersArr.push(BanInfo);
      await bannedUsers.set(interaction.guild.id, bannedUsersArr);
      await sendLog(interaction, banEmbed);
      if (!member.user.bot) await member.send({ content: msg });
      await bns.set(`bans_${member.id}_${interaction.guild.id}`, bans);
      await member.ban();
    } else {
      if (days <= 0) {
        return interaction.reply({ content: `Days must be a positive number.`, ephemeral: true });
      }

      let bans = await bns.get(`bans_${member.id}_${interaction.guild.id}`);
      if (!bans) bans = 1;
      else bans = bans + 1;

      const banEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(`${interaction.client.emojis.cache.get(pinEmojiId).toString()} Ban Information`)
        .addFields(
          { name: `Defendant's name:`, value: `${member}` },
          { name: `Issued by:`, value: `${author}` },
          { name: `Duration:`, value: `${days} days` }
        )
        .setFooter(`You can use /unban ${member.user.username} to unban ${member.user.username} earlier than ${days} days or /baninfo ${member.user.username} to view information about his ban.`)
        .setTimestamp();
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      let BanInfo = {};
      BanInfo.userID = member.user.id;
      BanInfo.username = member.user.username;
      BanInfo.unbanDate = Date.now() + days * millisecondsPerDay;
      BanInfo.author = author;
      let msg = `${author} has permanently banned you from ${interaction.guild.name}. Duration: ${days} days.`;
      if (reason) {
        banEmbed.addField('Reason', reason);
        msg += ` Reason: ${reason}`;
        BanInfo.reason = reason;
      }

      let bannedUsersArr = await bannedUsers.get(interaction.guild.id);
      let guilds = await punishments.get('guilds');
      if (!guilds.includes(interaction.guild.id)) guilds.push(interaction.guild.id);
      if (!bannedUsersArr) bannedUsersArr = [];
      bannedUsersArr.push(BanInfo);
      await bannedUsers.set(interaction.guild.id, bannedUsersArr);
      await punishments.set('guilds', guilds);
      await sendLog(interaction, banEmbed);
      if (!member.user.bot) await member.send({ content: msg });
      await bns.set(`bans_${member.id}_${interaction.guild.id}`, bans);
      await member.ban();
    }
  }
}

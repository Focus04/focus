const Discord = require('discord.js');
const Keyv = require('keyv');
const warnings = new Keyv(process.env.wrns);
const bns = new Keyv(process.env.bns);
const kks = new Keyv(process.env.kks);
const mts = new Keyv(process.env.mts);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  name: 'record',
  description: `Displays how many punishments a user has ever received on the server.`,
  usage: 'record @`user`',
  requiredPerms: ['KICK_MEMBERS'],
  async execute(message, prefix) {
    const member = message.mentions.users.first();
    if (!member) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}record @[user]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let warns = await warnings.get(`warns_${member.id}_${message.guild.id}`);
    let kicks = await kks.get(`kicks_${member.id}_${message.guild.id}`);
    let mutes = await mts.get(`mutes_${member.id}_${message.guild.id}`);
    let bans = await bns.get(`bans_${member.id}_${message.guild.id}`);
    if (!warns) warns = 0;
    if (!kicks) kicks = 0;
    if (!mutes) mutes = 0;
    if (!bans) bans = 0;

    let color = getRoleColor(message.guild);
    const recordEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`${member.username}'s record`)
      .addFields(
        { name: 'Times warned', value: `${warns}` },
        { name: 'Times kicked', value: `${kicks}` },
        { name: 'Times muted', value: `${mutes}` },
        { name: 'Times banned', value: `${bans}` }
      )
      .setTimestamp();
    await message.channel.send(recordEmbed);
    message.react(reactionSuccess);
  }
}
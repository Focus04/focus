const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Keyv = require('keyv');
const names = new Keyv(process.env.names);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'checknames',
  description: `Check a member's previous nicknames.`,
  usage: 'checknames @`member`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}checknames @[member]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const namesArr = await names.get(`${member.user.id}_${message.guild.id}`);
    if (!namesArr) {
      let msg = await message.channel.send(`There aren't any name changes logged from this member`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let content = '';
    namesArr.forEach((name) => content += `${'`' + name.newName + '`'} - ${moment(name.time).format('LL')}, at ${moment(name.time).format('LT')} GMT\n`);
    let color;
    if (message.guild.me.roles.highest.color === 0) color = '#b9bbbe';
    else color = message.guild.me.roles.highest.color;
    const nameChangesEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${member.user.tag}'s nicknames`)
      .setDescription(content)
      .setTimestamp();
    await message.channel.send(nameChangesEmbed);
    message.react(reactionSuccess);
  }
}